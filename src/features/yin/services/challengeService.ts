import { xpService } from './xpService';

export interface ChallengeProgress {
  completed: string[];
  lastUpdated: number;
  totalChallengesCompleted: number;
  xpEarned: number;
}

export interface Challenge {
  id: string;
  name: string;
  description: string;
  xp: number;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  prerequisites?: string[];
}

class ChallengeService {
  private readonly STORAGE_KEY = 'challengeProgress';
  
  private readonly challenges: Record<string, Challenge> = {
    'first-steps': { 
      id: 'first-steps',
      name: 'First Steps', 
      description: 'Complete your first meditation, gratitude, or movement practice',
      xp: 20,
      category: 'foundation',
      difficulty: 'beginner'
    },
    'daily-practice': { 
      id: 'daily-practice',
      name: 'Daily Practice', 
      description: 'Complete any daily quest',
      xp: 30,
      category: 'consistency',
      difficulty: 'beginner'
    },
    'capture-insight': { 
      id: 'capture-insight',
      name: 'Capture an Insight', 
      description: 'Record your first insight or reflection',
      xp: 25,
      category: 'reflection',
      difficulty: 'beginner'
    },
    'shadow-work-intro': { 
      id: 'shadow-work-intro',
      name: 'Shadow Work Introduction', 
      description: 'Complete your first shadow work exercise',
      xp: 40,
      category: 'shadow',
      difficulty: 'intermediate'
    },
    'evening-reflection': { 
      id: 'evening-reflection',
      name: 'Evening Reflection', 
      description: 'Complete an evening reflection practice',
      xp: 30,
      category: 'reflection',
      difficulty: 'beginner'
    },
    'inner-compass': { 
      id: 'inner-compass',
      name: 'Find Your Inner Compass', 
      description: 'Discover your core values and direction',
      xp: 50,
      category: 'discovery',
      difficulty: 'intermediate'
    },
    'knowledge-seeker': { 
      id: 'knowledge-seeker',
      name: 'Knowledge Seeker', 
      description: 'Complete your first lesson or learning module',
      xp: 40,
      category: 'learning',
      difficulty: 'beginner'
    },
    'consistency-builder': { 
      id: 'consistency-builder',
      name: 'Consistency Builder', 
      description: 'Maintain a 7-day practice streak',
      xp: 50,
      category: 'consistency',
      difficulty: 'intermediate'
    },
    'mindful-week': {
      id: 'mindful-week',
      name: 'Mindful Week',
      description: 'Complete 7 meditation sessions in a week',
      xp: 60,
      category: 'meditation',
      difficulty: 'intermediate'
    },
    'shadow-explorer': {
      id: 'shadow-explorer',
      name: 'Shadow Explorer',
      description: 'Complete 5 shadow work exercises',
      xp: 75,
      category: 'shadow',
      difficulty: 'advanced'
    }
  };
  
  getProgress(): ChallengeProgress {
    try {
      const saved = localStorage.getItem(this.STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          completed: Array.isArray(parsed.completed) ? parsed.completed : [],
          lastUpdated: parsed.lastUpdated || Date.now(),
          totalChallengesCompleted: parsed.totalChallengesCompleted || 0,
          xpEarned: parsed.xpEarned || 0
        };
      }
    } catch (error) {
      console.error('Error parsing challenge progress:', error);
      localStorage.removeItem(this.STORAGE_KEY);
    }
    
    return { 
      completed: [], 
      lastUpdated: Date.now(),
      totalChallengesCompleted: 0,
      xpEarned: 0
    };
  }
  
  completeChallenge(challengeId: string): boolean {
    const progress = this.getProgress();
    
    if (!Array.isArray(progress.completed)) {
      progress.completed = [];
    }
    
    if (!progress.completed.includes(challengeId)) {
      const challenge = this.getChallengeById(challengeId);
      
      // Check prerequisites
      if (challenge.prerequisites?.length) {
        const missingPrereqs = challenge.prerequisites.filter(
          prereq => !progress.completed.includes(prereq)
        );
        if (missingPrereqs.length > 0) {
          console.warn(`Cannot complete ${challengeId}: missing prerequisites`, missingPrereqs);
          return false;
        }
      }
      
      progress.completed.push(challengeId);
      progress.lastUpdated = Date.now();
      progress.totalChallengesCompleted = (progress.totalChallengesCompleted || 0) + 1;
      progress.xpEarned = (progress.xpEarned || 0) + challenge.xp;
      
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(progress));
      
      // Use central XP service
      xpService.addXP(challenge.xp, 'challenges', { challengeId });
      
      // Emit challenge completed event
      window.dispatchEvent(new CustomEvent('challengeCompleted', {
        detail: { 
          challengeId,
          challenge,
          xpReward: challenge.xp,
          progress,
          totalCompleted: progress.completed.length
        }
      }));
      
      return true;
    }
    
    return false;
  }
  
  mapQuestToChallenge(questType: string): string | null {
    const mapping: Record<string, string> = {
      'meditation': 'first-steps',
      'gratitude': 'first-steps', 
      'movement': 'first-steps',
      'insight': 'capture-insight',
      'shadow-work': 'shadow-work-intro',
      'reflection': 'evening-reflection',
      'daily': 'daily-practice',
      'learning': 'knowledge-seeker'
    };
    
    const normalized = questType.toLowerCase();
    return mapping[normalized] || null;
  }
  
  getChallengeById(challengeId: string): Challenge {
    return this.challenges[challengeId] || {
      id: challengeId,
      name: 'Unknown Challenge',
      description: '',
      xp: 20,
      category: 'other',
      difficulty: 'beginner'
    };
  }
  
  getChallengeDetails(challengeId: string): { name: string; xp: number } {
    const challenge = this.getChallengeById(challengeId);
    return { name: challenge.name, xp: challenge.xp };
  }
  
  getAllChallenges(): Challenge[] {
    return Object.values(this.challenges);
  }
  
  getChallengesByCategory(category: string): Challenge[] {
    return Object.values(this.challenges).filter(c => c.category === category);
  }
  
  getChallengesByDifficulty(difficulty: Challenge['difficulty']): Challenge[] {
    return Object.values(this.challenges).filter(c => c.difficulty === difficulty);
  }
  
  isChallengecComplete(challengeId: string): boolean {
    const progress = this.getProgress();
    return progress.completed.includes(challengeId);
  }
  
  getAvailableChallenges(): Challenge[] {
    const progress = this.getProgress();
    return Object.values(this.challenges).filter(challenge => {
      // Check if not completed
      if (progress.completed.includes(challenge.id)) return false;
      
      // Check prerequisites
      if (challenge.prerequisites?.length) {
        return challenge.prerequisites.every(prereq => 
          progress.completed.includes(prereq)
        );
      }
      
      return true;
    });
  }
  
  getCompletedChallenges(): Challenge[] {
    const progress = this.getProgress();
    return progress.completed
      .map(id => this.getChallengeById(id))
      .filter(c => c.id !== 'unknown');
  }
  
  getProgressPercentage(): number {
    const total = Object.keys(this.challenges).length;
    const completed = this.getProgress().completed.length;
    return Math.round((completed / total) * 100);
  }
  
  reset(): void {
    localStorage.removeItem(this.STORAGE_KEY);
    window.dispatchEvent(new CustomEvent('challengeReset'));
  }
}

export const challengeService = new ChallengeService();