// src/features/yin/services/challengeService.ts

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
  questRequirements?: string[]; // For quest-completion type
}

// Define all tiers with proper quest tracking
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
      daysToComplete: 2
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
      daysToComplete: 2
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
      daysToComplete: 7
    }
  ]
];

class ChallengeService {
  private readonly STORAGE_KEY = 'yin_challenges';
  private readonly TIER_STORAGE_KEY = 'yin_current_tier';
  private readonly COMPLETED_STORAGE_KEY = 'yin_completed_challenges';
  private challenges: Challenge[] = [];
  private completedChallenges: Challenge[] = [];
  private currentTier: number = 1;

  constructor() {
    this.loadChallenges();
  }

  private loadChallenges(): void {
  if (typeof window === 'undefined') return;
  
  const saved = localStorage.getItem(this.STORAGE_KEY);
  const savedTier = localStorage.getItem(this.TIER_STORAGE_KEY);
  const savedCompleted = localStorage.getItem(this.COMPLETED_STORAGE_KEY);
  
  if (savedTier) {
    this.currentTier = parseInt(savedTier);
  }
  
  // Load completed challenges first
  if (savedCompleted) {
    try {
      this.completedChallenges = JSON.parse(savedCompleted);
    } catch (e) {
      console.error('Failed to load completed challenges:', e);
    }
  }
  
  // Get IDs of completed challenges
  const completedIds = new Set(this.completedChallenges.map(c => c.id));
  
  // Initialize active challenges, excluding completed ones
  this.challenges = CHALLENGE_TIERS.flat().filter(c => !completedIds.has(c.id));
  
  if (saved) {
    try {
      const savedData = JSON.parse(saved);
      this.challenges = this.challenges.map(challenge => {
        const savedChallenge = savedData[challenge.id];
        if (savedChallenge) {
          // Skip if already in completed list
          if (savedChallenge.completed && !completedIds.has(challenge.id)) {
            // Add to completed list if not already there
            this.completedChallenges.push({
              ...challenge,
              progress: savedChallenge.progress || challenge.required,
              completed: true,
              completedDate: savedChallenge.completedDate || new Date().toISOString()
            });
            return null; // Mark for removal
          }
          
          return {
            ...challenge,
            progress: savedChallenge.progress || 0,
            completed: false,
            locked: challenge.tier > this.currentTier
          };
        }
        return {
          ...challenge,
          locked: challenge.tier > this.currentTier
        };
      }).filter(Boolean) as Challenge[]; // Remove nulls
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
    localStorage.setItem(this.COMPLETED_STORAGE_KEY, JSON.stringify(this.completedChallenges));
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

  getCurrentTierChallenges(): Challenge[] {
    return this.challenges.filter(c => c.tier === this.currentTier);
  }

  getCurrentTier(): number {
    return this.currentTier;
  }

  getCompletedCount(): number {
    return this.completedChallenges.length;
  }

  getTotalCount(): number {
    return this.challenges.length + this.completedChallenges.length;
  }

  private checkTierCompletion(): void {
    const currentTierChallenges = this.getCurrentTierChallenges();
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

  checkChallengeProgressFromQuest(questId: string): void {
    let updated = false;
    
    this.challenges.forEach(challenge => {
      if (challenge.completed || challenge.locked) return;
      
      // Handle quest-completion type challenges
      if (challenge.type === 'quest-completion' && challenge.questRequirements) {
        if (challenge.questRequirements.includes(questId)) {
          const questProgress = localStorage.getItem('quest_progress');
          if (questProgress) {
            const completed = JSON.parse(questProgress);
            const completedCount = challenge.questRequirements.filter(req => completed[req]).length;
            
            if (completedCount !== challenge.progress) {
              challenge.progress = completedCount;
              updated = true;
              
              if (challenge.progress >= challenge.required) {
                this.completeChallenge(challenge.id);
              }
            }
          }
        }
      }
      
      // Handle milestone type challenges
      if (challenge.type === 'milestone') {
        if (challenge.id === 'meditation-explorer' && questId === 'meditation') {
          challenge.progress++;
          updated = true;
          if (challenge.progress >= challenge.required) {
            this.completeChallenge(challenge.id);
          }
        }
        if (challenge.id === 'gratitude-seeker' && questId === 'gratitude') {
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