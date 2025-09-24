export interface ChallengeProgress {
  completed: string[];
  lastUpdated: number;
}

class ChallengeService {
  private readonly STORAGE_KEY = 'challengeProgress';
  
  getProgress(): ChallengeProgress {
    try {
      const saved = localStorage.getItem(this.STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        // Ensure structure is correct
        return {
          completed: Array.isArray(parsed.completed) ? parsed.completed : [],
          lastUpdated: parsed.lastUpdated || Date.now()
        };
      }
    } catch (error) {
      console.error('Error parsing challenge progress:', error);
      // Clear corrupted data
      localStorage.removeItem(this.STORAGE_KEY);
    }
    
    // Return default structure
    return { completed: [], lastUpdated: Date.now() };
  }
  
  completeChallenge(challengeId: string): boolean {
    const progress = this.getProgress();
    
    // Ensure completed is an array
    if (!Array.isArray(progress.completed)) {
      progress.completed = [];
    }
    
    if (!progress.completed.includes(challengeId)) {
      progress.completed.push(challengeId);
      progress.lastUpdated = Date.now();
      
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(progress));
      
      // Log for debugging
      console.log('Challenge completed:', challengeId, progress);
      
      // Get challenge details for celebration
      const challengeDetails = this.getChallengeDetails(challengeId);
      
      // Dispatch custom event with details
      window.dispatchEvent(new CustomEvent('challengeCompleted', {
        detail: { 
          challengeId,
          challengeName: challengeDetails.name,
          xpReward: challengeDetails.xp,
          progress 
        }
      }));
      
      // Also dispatch storage event for cross-tab sync
      window.dispatchEvent(new StorageEvent('storage', {
        key: this.STORAGE_KEY,
        newValue: JSON.stringify(progress),
        url: window.location.href
      }));
      
      return true; // Challenge was newly completed
    }
    
    return false; // Already completed
  }
  
  // Comprehensive mapping
  mapQuestToChallenge(questType: string): string | null {
    const mapping: Record<string, string> = {
      // Quest types - First Steps includes first 3 activities
      'meditation': 'first-steps',
      'gratitude': 'first-steps', 
      'movement': 'first-steps',
      
      // Other challenges
      'insight': 'capture-insight',
      'shadow-work': 'shadow-work-intro',
      'reflection': 'evening-reflection',
      'daily': 'daily-practice'
    };
    
    const normalized = questType.toLowerCase();
    return mapping[normalized] || null;
  }
  
  getChallengeDetails(challengeId: string): { name: string; xp: number } {
    const challenges: Record<string, { name: string; xp: number }> = {
      'first-steps': { name: 'First Steps', xp: 20 },
      'daily-practice': { name: 'Daily Practice', xp: 30 },
      'capture-insight': { name: 'Capture an Insight', xp: 25 },
      'shadow-work-intro': { name: 'Shadow Work Introduction', xp: 40 },
      'evening-reflection': { name: 'Evening Reflection', xp: 30 },
      'inner-compass': { name: 'Find Your Inner Compass', xp: 50 }
    };
    
    return challenges[challengeId] || { name: 'Challenge', xp: 20 };
  }
  
  isFirstStepsComplete(): boolean {
    const progress = this.getProgress();
    return progress.completed.includes('first-steps');
  }
  
  isChallengecComplete(challengeId: string): boolean {
    const progress = this.getProgress();
    return progress.completed.includes(challengeId);
  }
  
  reset(): void {
    localStorage.removeItem(this.STORAGE_KEY);
    window.dispatchEvent(new CustomEvent('challengeReset'));
  }
}

export const challengeService = new ChallengeService();