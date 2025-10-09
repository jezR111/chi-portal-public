// src/features/yin/services/challengeService.ts
// Version: 6.2.0 - Fixed trigger-based quest tracking

import { CHALLENGE_REGISTRY, ChallengeDefinition } from '../components/quests-and-challenges/challenges/ChallengeRegistry';
import { storageService } from './storageService';

export interface Challenge extends ChallengeDefinition {
  progress: number;
  completed: boolean;
  locked: boolean;
  completedDate?: string;
  xpReward: number;
  completedReqs?: string[];
}

interface QuestProgressInfo {
  id: string;
  category?: string;
}

class ChallengeService {
  private activeChallenges: Challenge[] = [];
  private completedChallenges: { id: string; completedDate: string }[] = [];
  private currentTier: number = 1;
  private questCompletionCounts: Record<string, number> = {}; // Track how many times each quest is completed

  constructor() {
    this.loadState();
  }

  private loadState(): void {
    if (typeof window === 'undefined') return;

    const stored = storageService.getChallenges();
    this.currentTier = stored.currentTier || 1;
    this.completedChallenges = stored.completed || [];
    
    // Load quest completion counts
    const savedCounts = localStorage.getItem('quest_completion_counts');
    if (savedCounts) {
      try {
        this.questCompletionCounts = JSON.parse(savedCounts);
      } catch (e) {
        console.error('Failed to load quest completion counts:', e);
      }
    }

    const completedIds = new Set(this.completedChallenges.map(c => c.id));

    this.activeChallenges = CHALLENGE_REGISTRY
      .filter(definition => !completedIds.has(definition.id))
      .map(definition => {
        const savedProgress = stored.active ? stored.active[definition.id] : undefined;
        const completedReqs = savedProgress?.completedReqs || [];
        
        // Calculate progress based on triggers
        let progress = 0;
        if (definition.triggers) {
          definition.triggers.forEach(trigger => {
            if (trigger.type === 'QUEST_COMPLETED' && trigger.id) {
              const completionCount = this.questCompletionCounts[trigger.id] || 0;
              const requiredCount = trigger.requiredCount || 1;
              if (completionCount >= requiredCount) {
                progress++;
              }
            }
          });
        }

        return {
          ...definition,
          xpReward: definition.xp,
          progress,
          completedReqs: completedReqs,
          completed: false,
          locked: definition.tier > this.currentTier,
        };
      });
  }

  private saveState(): void {
    if (typeof window === 'undefined') return;

    const activeData = this.activeChallenges.reduce((acc, c) => ({
      ...acc,
      [c.id]: { progress: c.progress, completedReqs: c.completedReqs },
    }), {});

    storageService.updateChallenges({
      active: activeData,
      completed: this.completedChallenges,
      currentTier: this.currentTier,
    });

    // Save quest completion counts
    localStorage.setItem('quest_completion_counts', JSON.stringify(this.questCompletionCounts));
  }

  public getAvailableChallenges(): Challenge[] {
    return this.activeChallenges.filter(c => !c.locked);
  }

  public getCompletedChallengesWithDetails(): (Challenge & { completedDate: string })[] {
    return this.completedChallenges.map(completed => {
      const definition = CHALLENGE_REGISTRY.find(def => def.id === completed.id);
      return {
        ...(definition as ChallengeDefinition),
        progress: definition?.required || 0,
        completed: true,
        locked: false,
        completedDate: completed.completedDate,
        xpReward: definition?.xp || 0,
      };
    }).filter(c => c.id);
  }

  public getCurrentTier(): number {
    return this.currentTier;
  }

  public getAllChallenges(): Challenge[] {
    const completed = this.getCompletedChallengesWithDetails();
    const all = [...this.activeChallenges, ...completed];
    return all;
  }

  public getCompletedChallenges(): Challenge[] {
    return this.getCompletedChallengesWithDetails();
  }

  public checkChallengeProgressFromQuest(questParam: string | QuestProgressInfo): Challenge | null {
    const quest: QuestProgressInfo = typeof questParam === 'string' 
      ? { id: questParam } 
      : questParam;
    
    // Increment quest completion count
    if (quest.id) {
      this.questCompletionCounts[quest.id] = (this.questCompletionCounts[quest.id] || 0) + 1;
      console.log(`Quest ${quest.id} completed ${this.questCompletionCounts[quest.id]} times`);
    }
      
    let justCompletedChallenge: Challenge | null = null;
    let progressWasMade = false;

    this.activeChallenges.forEach(challenge => {
      if (challenge.completed || challenge.locked) return;
      
      let newProgress = 0;
      let updatedCompletedReqs: string[] = [...(challenge.completedReqs || [])];

      // Check each trigger
      challenge.triggers?.forEach(trigger => {
        if (trigger.type === 'QUEST_COMPLETED') {
          if (trigger.id === quest.id) {
            const completionCount = this.questCompletionCounts[trigger.id] || 0;
            const requiredCount = trigger.requiredCount || 1;
            
            if (completionCount >= requiredCount) {
              newProgress++;
              if (!updatedCompletedReqs.includes(trigger.id)) {
                updatedCompletedReqs.push(trigger.id);
              }
            }
          } else if (trigger.category === quest.category) {
            newProgress++;
            if (!updatedCompletedReqs.includes(trigger.category)) {
              updatedCompletedReqs.push(trigger.category);
            }
          }
        }
      });

      if (newProgress > challenge.progress) {
        challenge.progress = newProgress;
        challenge.completedReqs = updatedCompletedReqs;
        progressWasMade = true;
        
        console.log(`Challenge ${challenge.id} progress: ${challenge.progress}/${challenge.required}`);
        
        if (challenge.progress >= challenge.required) {
          justCompletedChallenge = this.completeChallenge(challenge.id);
        }
      }
    });

    if (progressWasMade) {
      this.saveState();
    }
    return justCompletedChallenge;
  }
  
  public reset(): void {
    storageService.reset('challenges');
    localStorage.removeItem('quest_completion_counts');
    this.questCompletionCounts = {};
    this.loadState();
  }

  private completeChallenge(challengeId: string): Challenge | null {
    const challengeIndex = this.activeChallenges.findIndex(c => c.id === challengeId);
    if (challengeIndex === -1) return null;

    const challenge = this.activeChallenges[challengeIndex];
    if (challenge.completed) return null;
    
    this.activeChallenges.splice(challengeIndex, 1);
    this.completedChallenges.push({ id: challenge.id, completedDate: new Date().toISOString() });
    
    this.checkTierCompletion();
    
    console.log(`Challenge Completed: ${challenge.name}`);
    return challenge;
  }

  private checkTierCompletion(): void {
    const currentTierDefs = CHALLENGE_REGISTRY.filter(c => c.tier === this.currentTier);
    const completedInTier = this.completedChallenges.filter(c => {
        const def = CHALLENGE_REGISTRY.find(d => d.id === c.id);
        return def?.tier === this.currentTier;
    });

    if (completedInTier.length >= currentTierDefs.length && this.currentTier < 5) {
      this.currentTier++;
      this.activeChallenges.forEach(c => {
        if (c.tier === this.currentTier) {
          c.locked = false;
        }
      });
      console.log(`Tier ${this.currentTier - 1} complete! Unlocking Tier ${this.currentTier}.`);
    }
  }
}

export const challengeService = new ChallengeService();