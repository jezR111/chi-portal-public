// src/features/yin/services/challengeService.ts

export interface Challenge {
  id: string;
  title: string;
  description: string;
  tier: number;
  required: number;
  progress: number;
  completed: boolean;
  completedDate?: string;
  locked: boolean;
  xpReward: number;
  category?: string;
  daysToComplete?: number; // For time-based challenges
}

// Define all 20 tiers of challenges
const CHALLENGE_TIERS: Challenge[][] = [
  // Tier 1 - Beginner (1 day)
  [
    {
      id: 'first-steps',
      title: 'First Steps',
      description: 'Complete meditation, gratitude, and movement quests',
      tier: 1,
      required: 1,
      progress: 0,
      completed: false,
      locked: false,
      xpReward: 100,
      category: 'foundation',
      daysToComplete: 1
    },
    {
      id: 'daily-practice',
      title: 'Daily Practice',
      description: 'Complete all 5 daily quests',
      tier: 1,
      required: 1,
      progress: 0,
      completed: false,
      locked: false,
      xpReward: 150,
      category: 'foundation',
      daysToComplete: 1
    }
  ],
  // Tier 2 - Novice (2 days)
  [
    {
      id: 'meditation-explorer',
      title: 'Meditation Explorer',
      description: 'Complete 5 meditation sessions',
      tier: 2,
      required: 5,
      progress: 0,
      completed: false,
      locked: true,
      xpReward: 200,
      category: 'mindfulness',
      daysToComplete: 2
    },
    {
      id: 'gratitude-seeker',
      title: 'Gratitude Seeker',
      description: 'Complete 7 gratitude journals',
      tier: 2,
      required: 7,
      progress: 0,
      completed: false,
      locked: true,
      xpReward: 250,
      category: 'journaling',
      daysToComplete: 2
    }
  ],
  // Tier 3 - Apprentice (3 days)
  [
    {
      id: 'week-warrior',
      title: 'Week Warrior',
      description: 'Complete daily quests for 7 consecutive days',
      tier: 3,
      required: 7,
      progress: 0,
      completed: false,
      locked: true,
      xpReward: 500,
      category: 'consistency',
      daysToComplete: 7
    }
  ],
  // ... Continue with progressively harder tiers
  // Tier 20 - Legendary (30 days)
  // This would be filled with all 20 tiers
];

class ChallengeService {
  private readonly STORAGE_KEY = 'yin_challenges';
  private readonly TIER_STORAGE_KEY = 'yin_current_tier';
  private challenges: Challenge[] = [];
  private currentTier: number = 1;

  constructor() {
    this.loadChallenges();
  }

  private loadChallenges(): void {
    if (typeof window === 'undefined') return;
    
    // Load saved progress
    const saved = localStorage.getItem(this.STORAGE_KEY);
    const savedTier = localStorage.getItem(this.TIER_STORAGE_KEY);
    
    if (savedTier) {
      this.currentTier = parseInt(savedTier);
    }
    
    // Flatten all tiers into single array
    this.challenges = CHALLENGE_TIERS.flat();
    
    if (saved) {
      try {
        const savedData = JSON.parse(saved);
        // Merge saved progress with challenge definitions
        this.challenges = this.challenges.map(challenge => {
          const savedChallenge = savedData[challenge.id];
          if (savedChallenge) {
            return {
              ...challenge,
              progress: savedChallenge.progress || 0,
              completed: savedChallenge.completed || false,
              completedDate: savedChallenge.completedDate,
              locked: challenge.tier > this.currentTier
            };
          }
          return {
            ...challenge,
            locked: challenge.tier > this.currentTier
          };
        });
      } catch (e) {
        console.error('Failed to load challenges:', e);
      }
    } else {
      // Initialize with tier 1 unlocked
      this.challenges = this.challenges.map(c => ({
        ...c,
        locked: c.tier > 1
      }));
    }
  }

  private save(): void {
    if (typeof window === 'undefined') return;
    
    const saveData = this.challenges.reduce((acc, challenge) => ({
      ...acc,
      [challenge.id]: {
        progress: challenge.progress,
        completed: challenge.completed,
        completedDate: challenge.completedDate
      }
    }), {});
    
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(saveData));
    localStorage.setItem(this.TIER_STORAGE_KEY, this.currentTier.toString());
  }

  getAllChallenges(): Challenge[] {
    return [...this.challenges];
  }

  getAvailableChallenges(): Challenge[] {
    // Return only unlocked, incomplete challenges
    return this.challenges.filter(c => !c.locked && !c.completed);
  }

  getCompletedChallenges(): Challenge[] {
    return this.challenges.filter(c => c.completed);
  }

  getCurrentTierChallenges(): Challenge[] {
    return this.challenges.filter(c => c.tier === this.currentTier);
  }

  getCurrentTier(): number {
    return this.currentTier;
  }

  getCompletedCount(): number {
    return this.challenges.filter(c => c.completed).length;
  }

  getTotalCount(): number {
    return this.challenges.length;
  }

  // Check if all challenges in current tier are complete
  private checkTierCompletion(): void {
    const currentTierChallenges = this.getCurrentTierChallenges();
    const allComplete = currentTierChallenges.every(c => c.completed);
    
    if (allComplete && this.currentTier < 20) {
      // Unlock next tier
      this.currentTier++;
      this.challenges = this.challenges.map(c => ({
        ...c,
        locked: c.tier > this.currentTier
      }));
      
      console.log(`Tier ${this.currentTier - 1} complete! Unlocking Tier ${this.currentTier}`);
      
      // Dispatch event for UI update
      window.dispatchEvent(new CustomEvent('tierUnlocked', { 
        detail: { newTier: this.currentTier } 
      }));
    }
    
    this.save();
  }

  // Complete a challenge
  completeChallenge(challengeId: string): boolean {
    const challenge = this.challenges.find(c => c.id === challengeId);
    
    if (!challenge || challenge.completed || challenge.locked) {
      return false;
    }
    
    challenge.completed = true;
    challenge.completedDate = new Date().toISOString();
    challenge.progress = challenge.required;
    
    this.checkTierCompletion();
    this.save();
    
    // Dispatch completion event
    window.dispatchEvent(new CustomEvent('challengeCompleted', { 
      detail: { 
        challenge,
        currentTier: this.currentTier
      } 
    }));
    
    return true;
  }

  // Update challenge progress
  updateProgress(challengeId: string, progress: number): void {
    const challenge = this.challenges.find(c => c.id === challengeId);
    
    if (!challenge || challenge.completed || challenge.locked) {
      return;
    }
    
    challenge.progress = Math.min(progress, challenge.required);
    
    if (challenge.progress >= challenge.required) {
      this.completeChallenge(challengeId);
    } else {
      this.save();
    }
  }

  // Check progress based on quest completion
  checkChallengeProgressFromQuest(questId: string): void {
    // Update relevant challenges based on quest
    this.challenges.forEach(challenge => {
      if (challenge.completed || challenge.locked) return;
      
      // Logic for different challenge types
      switch (challenge.id) {
        case 'first-steps':
          // Check if meditation, gratitude, and movement quests are done
          if (['meditation', 'gratitude', 'movement'].includes(questId)) {
            this.updateProgress(challenge.id, 1);
          }
          break;
        
        case 'daily-practice':
          // This would be checked when all 5 daily quests are complete
          // Handled elsewhere
          break;
        
        case 'meditation-explorer':
          if (questId === 'meditation') {
            this.updateProgress(challenge.id, challenge.progress + 1);
          }
          break;
        
        case 'gratitude-seeker':
          if (questId === 'gratitude') {
            this.updateProgress(challenge.id, challenge.progress + 1);
          }
          break;
      }
    });
  }

  // Reset all progress (for testing)
  resetAll(): void {
    this.currentTier = 1;
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