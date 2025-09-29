// src/features/yin/services/challengeService.ts

export interface Challenge {
  id: string;
  title: string;
  description: string;
  tier: number;
  xpReward: number;
  progress: number;
  maxProgress: number;
  completed: boolean;
  locked: boolean;
  icon?: React.ComponentType<any>;
  gradient?: string;
  category?: string;
  requirements?: string[];
}

interface ChallengeData {
  challenges: Challenge[];
  currentTier: number;
  completedChallenges: string[];
}

class ChallengeService {
  private static instance: ChallengeService;
  private readonly STORAGE_KEY = 'yin_challenges';
  
  // Challenge definitions
  private readonly CHALLENGES: Challenge[] = [
    {
      id: 'first-steps',
      title: 'First Steps',
      description: 'Complete meditation, gratitude, and movement quests',
      tier: 1,
      xpReward: 100,
      progress: 0,
      maxProgress: 3,
      completed: false,
      locked: false,
      category: 'beginner'
    },
    {
      id: 'daily-practice',
      title: 'Daily Practice',
      description: 'Complete all 5 daily quests',
      tier: 1,
      xpReward: 150,
      progress: 0,
      maxProgress: 5,
      completed: false,
      locked: false,
      category: 'daily'
    },
    {
      id: 'meditation-master',
      title: 'Meditation Master',
      description: 'Complete 7 meditation sessions',
      tier: 2,
      xpReward: 200,
      progress: 0,
      maxProgress: 7,
      completed: false,
      locked: true,
      category: 'mastery'
    },
    {
      id: 'gratitude-champion',
      title: 'Gratitude Champion',
      description: 'Complete 10 gratitude journals',
      tier: 2,
      xpReward: 200,
      progress: 0,
      maxProgress: 10,
      completed: false,
      locked: true,
      category: 'mastery'
    },
    {
      id: 'breath-warrior',
      title: 'Breath Warrior',
      description: 'Complete 5 breathing exercises',
      tier: 3,
      xpReward: 300,
      progress: 0,
      maxProgress: 5,
      completed: false,
      locked: true,
      category: 'advanced'
    }
  ];
  
  static getInstance(): ChallengeService {
    if (!ChallengeService.instance) {
      ChallengeService.instance = new ChallengeService();
    }
    return ChallengeService.instance;
  }
  
  // Get saved data or initialize
  private getData(): ChallengeData {
    if (typeof window === 'undefined') {
      return {
        challenges: this.CHALLENGES,
        currentTier: 1,
        completedChallenges: []
      };
    }
    
    const saved = localStorage.getItem(this.STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Error parsing challenge data:', e);
      }
    }
    
    // Initialize with default data
    const defaultData: ChallengeData = {
      challenges: this.CHALLENGES,
      currentTier: 1,
      completedChallenges: []
    };
    
    this.saveData(defaultData);
    return defaultData;
  }
  
  private saveData(data: ChallengeData): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
    }
  }
  
  // Get all challenges
  getAllChallenges(): Challenge[] {
    const data = this.getData();
    return data.challenges;
  }
  
  // Get available (unlocked) challenges
  getAvailableChallenges(): Challenge[] {
    const data = this.getData();
    return data.challenges.filter(c => !c.locked);
  }
  
  // Get current tier
  getCurrentTier(): number {
    const data = this.getData();
    return data.currentTier;
  }
  
  // Check challenge progress from quest completion
  checkChallengeProgressFromQuest(questId: string): void {
    const data = this.getData();
    let updated = false;
    
    // Update First Steps challenge
    if (questId === 'meditation' || questId === 'gratitude' || questId === 'movement') {
      const challenge = data.challenges.find(c => c.id === 'first-steps');
      if (challenge && !challenge.completed) {
        challenge.progress++;
        if (challenge.progress >= challenge.maxProgress) {
          this.completeChallenge('first-steps');
        }
        updated = true;
      }
    }
    
    // Update Daily Practice challenge (tracks all 5 quests)
    const dailyChallenge = data.challenges.find(c => c.id === 'daily-practice');
    if (dailyChallenge && !dailyChallenge.completed) {
      // Count completed quests (this would need to be tracked properly)
      dailyChallenge.progress++;
      if (dailyChallenge.progress >= dailyChallenge.maxProgress) {
        this.completeChallenge('daily-practice');
      }
      updated = true;
    }
    
    // Update meditation master
    if (questId === 'meditation') {
      const medChallenge = data.challenges.find(c => c.id === 'meditation-master');
      if (medChallenge && !medChallenge.completed && !medChallenge.locked) {
        medChallenge.progress++;
        if (medChallenge.progress >= medChallenge.maxProgress) {
          this.completeChallenge('meditation-master');
        }
        updated = true;
      }
    }
    
    if (updated) {
      this.saveData(data);
    }
  }
  
  // Complete a challenge
  completeChallenge(challengeId: string): void {
    const data = this.getData();
    const challenge = data.challenges.find(c => c.id === challengeId);
    
    if (challenge && !challenge.completed) {
      challenge.completed = true;
      data.completedChallenges.push(challengeId);
      
      // Check if should unlock next tier
      const tier1Completed = data.challenges
        .filter(c => c.tier === 1)
        .every(c => c.completed);
      
      if (tier1Completed && data.currentTier === 1) {
        data.currentTier = 2;
        // Unlock tier 2 challenges
        data.challenges
          .filter(c => c.tier === 2)
          .forEach(c => c.locked = false);
      }
      
      const tier2Completed = data.challenges
        .filter(c => c.tier === 2)
        .every(c => c.completed);
      
      if (tier2Completed && data.currentTier === 2) {
        data.currentTier = 3;
        // Unlock tier 3 challenges
        data.challenges
          .filter(c => c.tier === 3)
          .forEach(c => c.locked = false);
      }
      
      this.saveData(data);
      
      // Dispatch event for celebration
      window.dispatchEvent(new CustomEvent('challengeCompleted', {
        detail: { challengeId, tier: challenge.tier, xpReward: challenge.xpReward }
      }));
    }
  }
  
  // Get challenge by ID
  getChallenge(challengeId: string): Challenge | undefined {
    const data = this.getData();
    return data.challenges.find(c => c.id === challengeId);
  }
  
  // Get challenges by tier
  getChallengesByTier(tier: number): Challenge[] {
    const data = this.getData();
    return data.challenges.filter(c => c.tier === tier);
  }
  
  // Get completed challenges count
  getCompletedCount(): number {
    const data = this.getData();
    return data.challenges.filter(c => c.completed).length;
  }
  
  // Get total challenges count
  getTotalCount(): number {
    const data = this.getData();
    return data.challenges.length;
  }
  
  // Reset all challenges (for testing)
  reset(): void {
    const defaultData: ChallengeData = {
      challenges: this.CHALLENGES.map(c => ({ ...c, progress: 0, completed: false, locked: c.tier > 1 })),
      currentTier: 1,
      completedChallenges: []
    };
    this.saveData(defaultData);
  }
}

// Export singleton instance
export const challengeService = ChallengeService.getInstance();