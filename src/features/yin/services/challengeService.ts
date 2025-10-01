// src/features/yin/services/challengeService.ts

import { storageService } from './storageService';

export interface Challenge {
  id: string;
  title: string;
  description: string;
  tier: number;
  type: 'quest-completion' | 'streak' | 'milestone' | 'collection';
  required: number;
  progress: number;
  completed: boolean;
  completedDate?: string;
  locked: boolean;
  xpReward: number;
  category?: string;
  daysToComplete?: number;
  questRequirements?: string[]; // Specific quest IDs required
  questTracking?: {
    // Data-driven quest tracking configuration
    trackQuests?: string[]; // Quest IDs to track for progress
    trackCategories?: string[]; // Quest categories to track
    trackTypes?: string[]; // Quest types to track  
  };
}

// Challenge definitions with data-driven quest tracking
const CHALLENGE_TIERS: Challenge[][] = [
  // Tier 1 - Beginner (1 day)
  [
    {
      id: 'first-steps',
      title: 'First Steps',
      description: 'Complete meditation, gratitude, and movement quests',
      tier: 1,
      type: 'quest-completion',
      required: 3,
      progress: 0,
      completed: false,
      locked: false,
      xpReward: 100,
      category: 'foundation',
      daysToComplete: 1,
      questRequirements: ['meditation', 'gratitude', 'movement']
    },
    {
      id: 'daily-practice',
      title: 'Daily Practice',
      description: 'Complete all 5 daily quests',
      tier: 1,
      type: 'quest-completion',
      required: 5,
      progress: 0,
      completed: false,
      locked: false,
      xpReward: 150,
      category: 'foundation',
      daysToComplete: 1,
      questRequirements: ['meditation', 'gratitude', 'movement', 'learning', 'breathing']
    }
  ],
  // Tier 2 - Novice (2 days)
  [
    {
      id: 'meditation-explorer',
      title: 'Meditation Explorer',
      description: 'Complete 5 meditation sessions',
      tier: 2,
      type: 'milestone',
      required: 5,
      progress: 0,
      completed: false,
      locked: true,
      xpReward: 200,
      category: 'mindfulness',
      daysToComplete: 2,
      questTracking: {
        trackQuests: ['meditation'],
        trackTypes: ['meditation']
      }
    },
    {
      id: 'gratitude-seeker',
      title: 'Gratitude Seeker',
      description: 'Complete 7 gratitude journals',
      tier: 2,
      type: 'milestone',
      required: 7,
      progress: 0,
      completed: false,
      locked: true,
      xpReward: 250,
      category: 'journaling',
      daysToComplete: 2,
      questTracking: {
        trackQuests: ['gratitude'],
        trackCategories: ['journaling']
      }
    },
    {
      id: 'movement-warrior',
      title: 'Movement Warrior',
      description: 'Complete 10 movement sessions',
      tier: 2,
      type: 'milestone',
      required: 10,
      progress: 0,
      completed: false,
      locked: true,
      xpReward: 250,
      category: 'fitness',
      daysToComplete: 3,
      questTracking: {
        trackQuests: ['movement'],
        trackCategories: ['movement', 'fitness']
      }
    }
  ],
  // Tier 3 - Apprentice (7 days)
  [
    {
      id: 'week-warrior',
      title: 'Week Warrior',
      description: 'Complete daily quests for 7 consecutive days',
      tier: 3,
      type: 'streak',
      required: 7,
      progress: 0,
      completed: false,
      locked: true,
      xpReward: 500,
      category: 'consistency',
      daysToComplete: 7,
      questTracking: {
        trackCategories: ['*'] // Track all categories for daily completion
      }
    },
    {
      id: 'mindful-master',
      title: 'Mindful Master',
      description: 'Complete 15 mindfulness quests',
      tier: 3,
      type: 'milestone',
      required: 15,
      progress: 0,
      completed: false,
      locked: true,
      xpReward: 400,
      category: 'mindfulness',
      daysToComplete: 5,
      questTracking: {
        trackCategories: ['mindfulness', 'meditation', 'breathing']
      }
    }
  ]
];

class ChallengeService {
  private challenges: Challenge[] = [];
  private completedChallenges: Challenge[] = [];
  private currentTier: number = 1;

  constructor() {
    this.loadChallenges();
  }

  private loadChallenges(): void {
    if (typeof window === 'undefined') return;
    
    const stored = storageService.getChallenges();
    this.currentTier = stored.currentTier;
    this.completedChallenges = stored.completed || [];
    
    // Get IDs of completed challenges
    const completedIds = new Set(this.completedChallenges.map(c => c.id));
    
    // Initialize active challenges, excluding completed ones
    this.challenges = CHALLENGE_TIERS.flat()
      .filter(c => !completedIds.has(c.id))
      .map(challenge => {
        const savedProgress = stored.active[challenge.id];
        if (savedProgress) {
          return {
            ...challenge,
            progress: savedProgress.progress || 0,
            locked: challenge.tier > this.currentTier
          };
        }
        return {
          ...challenge,
          locked: challenge.tier > this.currentTier
        };
      });
  }

  private save(): void {
    if (typeof window === 'undefined') return;
    
    const activeData = this.challenges.reduce((acc, challenge) => ({
      ...acc,
      [challenge.id]: {
        progress: challenge.progress,
        completed: challenge.completed,
        completedDate: challenge.completedDate
      }
    }), {});
    
    storageService.updateChallenges({
      active: activeData,
      completed: this.completedChallenges,
      currentTier: this.currentTier
    });
  }

  getAllChallenges(): Challenge[] {
    return [...this.challenges, ...this.completedChallenges];
  }

  getAvailableChallenges(): Challenge[] {
    return this.challenges.filter(c => !c.locked && !c.completed);
  }

  getCompletedChallenges(): Challenge[] {
    return [...this.completedChallenges];
  }

  getCurrentTier(): number {
    return this.currentTier;
  }

  private checkTierCompletion(): void {
    const currentTierChallenges = this.challenges.filter(c => c.tier === this.currentTier);
    const currentTierCompleted = this.completedChallenges.filter(c => c.tier === this.currentTier);
    const allComplete = currentTierChallenges.length === 0 && currentTierCompleted.length > 0;
    
    if (allComplete && this.currentTier < 20) {
      this.currentTier++;
      this.challenges = this.challenges.map(c => ({
        ...c,
        locked: c.tier > this.currentTier
      }));
      
      console.log(`Tier ${this.currentTier - 1} complete! Unlocking Tier ${this.currentTier}`);
      
      window.dispatchEvent(new CustomEvent('tierUnlocked', { 
        detail: { newTier: this.currentTier } 
      }));
    }
    
    this.save();
  }

  completeChallenge(challengeId: string): boolean {
    const challengeIndex = this.challenges.findIndex(c => c.id === challengeId);
    
    if (challengeIndex === -1) return false;
    
    const challenge = this.challenges[challengeIndex];
    
    if (challenge.completed || challenge.locked) return false;
    
    challenge.completed = true;
    challenge.completedDate = new Date().toISOString();
    challenge.progress = challenge.required;
    
    // Move to completed list
    this.completedChallenges.push(challenge);
    this.challenges.splice(challengeIndex, 1);
    
    // Award XP
    storageService.addXP(challenge.xpReward, 'challenge_completion', { challengeId });
    
    this.checkTierCompletion();
    this.save();
    
    window.dispatchEvent(new CustomEvent('challengeCompleted', { 
      detail: { 
        challenge,
        currentTier: this.currentTier
      } 
    }));
    
    return true;
  }

  checkChallengeProgressFromQuest(questId: string, questType?: string, questCategory?: string): void {
    let updated = false;
    
    this.challenges.forEach(challenge => {
      if (challenge.completed || challenge.locked) return;
      
      // Handle quest-completion type challenges
      if (challenge.type === 'quest-completion' && challenge.questRequirements) {
        if (challenge.questRequirements.includes(questId)) {
          const questProgress = storageService.getQuests().progress;
          const completedCount = challenge.questRequirements.filter(req => questProgress[req]).length;
          
          if (completedCount !== challenge.progress) {
            challenge.progress = completedCount;
            updated = true;
            
            if (challenge.progress >= challenge.required) {
              this.completeChallenge(challenge.id);
            }
          }
        }
      }
      
      // Handle data-driven tracking for milestone challenges
      if (challenge.questTracking) {
        let shouldIncrement = false;
        
        // Check if quest ID matches
        if (challenge.questTracking.trackQuests?.includes(questId)) {
          shouldIncrement = true;
        }
        
        // Check if quest type matches
        if (questType && challenge.questTracking.trackTypes?.includes(questType)) {
          shouldIncrement = true;
        }
        
        // Check if quest category matches
        if (questCategory) {
          if (challenge.questTracking.trackCategories?.includes('*')) {
            shouldIncrement = true;
          } else if (challenge.questTracking.trackCategories?.includes(questCategory)) {
            shouldIncrement = true;
          }
        }
        
        if (shouldIncrement) {
          challenge.progress++;
          updated = true;
          
          if (challenge.progress >= challenge.required) {
            this.completeChallenge(challenge.id);
          }
        }
      }
    });
    
    if (updated) {
      this.save();
      window.dispatchEvent(new CustomEvent('challengeProgressUpdated'));
    }
  }

  resetAll(): void {
    this.currentTier = 1;
    this.completedChallenges = [];
    this.challenges = CHALLENGE_TIERS.flat().map(c => ({
      ...c,
      progress: 0,
      completed: false,
      completedDate: undefined,
      locked: c.tier > 1
    }));
    this.save();
  }
}

export const challengeService = new ChallengeService();