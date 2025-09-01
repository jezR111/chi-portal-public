// src/features/yin/services/progressService.ts

interface UserProgress {
  userId: string;
  level: number;
  totalXP: number;
  currentLevelXP: number;
  nextLevelXP: number;
  streakDays: number;
  lastActiveDate: Date;
  achievements: any[];
  chapterProgress: any[];
  stats: any;
}

class ProgressService {
  private baseUrl = process.env.NEXT_PUBLIC_API_URL || '/api';
  
  async getUserProgress(userId: string): Promise<UserProgress | null> {
    try {
      const response = await fetch(`${this.baseUrl}/users/${userId}/progress`, {
        headers: {
          'Authorization': `Bearer ${this.getAuthToken()}`
        }
      });
      
      if (!response.ok) {
        if (response.status === 404) {
          return null; // New user
        }
        throw new Error('Failed to fetch progress');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching progress:', error);
      return this.getLocalProgress(userId);
    }
  }
  
  async syncProgress(progress: UserProgress): Promise<void> {
    try {
      await fetch(`${this.baseUrl}/users/${progress.userId}/progress`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getAuthToken()}`
        },
        body: JSON.stringify(progress)
      });
    } catch (error) {
      console.error('Error syncing progress:', error);
      // Queue for retry
      this.queueSync(progress);
    }
  }
  
  async updateChapterProgress(
    userId: string,
    chapterId: string,
    progress: any
  ): Promise<void> {
    try {
      await fetch(`${this.baseUrl}/users/${userId}/chapters/${chapterId}/progress`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getAuthToken()}`
        },
        body: JSON.stringify(progress)
      });
    } catch (error) {
      console.error('Error updating chapter progress:', error);
    }
  }
  
  async logXPGain(userId: string, amount: number, source: string): Promise<void> {
    try {
      await fetch(`${this.baseUrl}/users/${userId}/xp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getAuthToken()}`
        },
        body: JSON.stringify({ amount, source, timestamp: new Date() })
      });
    } catch (error) {
      console.error('Error logging XP gain:', error);
      this.saveLocalXPLog(userId, amount, source);
    }
  }
  
  async getAchievement(achievementId: string): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/achievements/${achievementId}`, {
        headers: {
          'Authorization': `Bearer ${this.getAuthToken()}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch achievement');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching achievement:', error);
      return this.getLocalAchievement(achievementId);
    }
  }
  
  private getAuthToken(): string {
    return localStorage.getItem('authToken') || '';
  }
  
  private getLocalProgress(userId: string): UserProgress | null {
    const stored = localStorage.getItem(`progress_${userId}`);
    return stored ? JSON.parse(stored) : null;
  }
  
  private saveLocalXPLog(userId: string, amount: number, source: string): void {
    const logs = JSON.parse(localStorage.getItem(`xp_logs_${userId}`) || '[]');
    logs.push({ amount, source, timestamp: Date.now() });
    localStorage.setItem(`xp_logs_${userId}`, JSON.stringify(logs));
  }
  
  private queueSync(progress: UserProgress): void {
    const queue = JSON.parse(localStorage.getItem('sync_queue') || '[]');
    queue.push({ type: 'progress', data: progress, timestamp: Date.now() });
    localStorage.setItem('sync_queue', JSON.stringify(queue));
  }
  
  private getLocalAchievement(achievementId: string): any {
    // Default achievements data
    const achievements: Record<string, any> = {
      'first_insight': {
        id: 'first_insight',
        name: 'First Insight',
        description: 'Captured your first insight',
        icon: 'lightbulb',
        xpReward: 50
      },
      'week_warrior': {
        id: 'week_warrior',
        name: 'Week Warrior',
        description: 'Maintained a 7-day streak',
        icon: 'flame',
        xpReward: 150
      }
    };
    
    return achievements[achievementId] || null;
  }
}

export const progressService = new ProgressService();