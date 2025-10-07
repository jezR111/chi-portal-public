// Version: 6.0.0 - Implemented detailed requirement tracking for live checklist UI

import { CHALLENGE_REGISTRY, ChallengeDefinition } from '../components/quests-and-challenges/challenges/ChallengeRegistry';
import { storageService } from './storageService';

// The full Challenge object, combining static data with live progress
export interface Challenge extends ChallengeDefinition {
  progress: number;
  completed: boolean;
  locked: boolean;
  completedDate?: string;
  xpReward: number;
  completedReqs?: string[]; // Tracks which specific requirements are met
}

// Minimal quest info needed for progress tracking
interface QuestProgressInfo {
  id: string;
  category?: string;
}

class ChallengeService {
  private activeChallenges: Challenge[] = [];
  private completedChallenges: { id: string; completedDate: string }[] = [];
  private currentTier: number = 1;

  constructor() {
    this.loadState();
  }

  private loadState(): void {
    if (typeof window === 'undefined') return;

    const stored = storageService.getChallenges();
    this.currentTier = stored.currentTier || 1;
    this.completedChallenges = stored.completed || [];

    const completedIds = new Set(this.completedChallenges.map(c => c.id));

    this.activeChallenges = CHALLENGE_REGISTRY
      .filter(definition => !completedIds.has(definition.id))
      .map(definition => {
        const savedProgress = stored.active ? stored.active[definition.id] : undefined;
        const completedReqs = savedProgress?.completedReqs || [];
        return {
          ...definition,
          xpReward: definition.xp,
          progress: completedReqs.length, 
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
  }

  // --- Public Getters ---

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

  // --- Public Actions ---

  public checkChallengeProgressFromQuest(quest: QuestProgressInfo): Challenge | null {
    let justCompletedChallenge: Challenge | null = null;
    let progressWasMade = false;

    this.activeChallenges.forEach(challenge => {
      if (challenge.completed || challenge.locked || !challenge.questTracking) return;
      
      const tracking = challenge.questTracking;
      let requirementMetId: string | null = null;

      if (tracking.trackQuestsById?.includes(quest.id)) {
        requirementMetId = quest.id;
      } else if (quest.category && tracking.trackQuestCategories?.includes(quest.category)) {
        requirementMetId = quest.category;
      }

      if (requirementMetId && !challenge.completedReqs?.includes(requirementMetId)) {
        challenge.completedReqs = [...(challenge.completedReqs || []), requirementMetId];
        challenge.progress = challenge.completedReqs.length;
        progressWasMade = true;
        
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
    this.loadState();
  }

  // --- Private Logic ---

  private completeChallenge(challengeId: string): Challenge | null {
    const challengeIndex = this.activeChallenges.findIndex(c => c.id === challengeId);
    if (challengeIndex === 'undefined') return null;

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