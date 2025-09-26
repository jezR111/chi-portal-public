export interface MeditationSession {
  id: string;
  type: 'meditation' | 'breathwork' | 'mindfulness';
  duration: number;
  actualDuration?: number;
  completedAt?: Date;
  voiceNoteUrl?: string;
  insights?: string[];
  mood?: 'calm' | 'anxious' | 'peaceful' | 'restless' | 'focused';
  heartRate?: number[];
}

export interface MeditationProgress {
  totalSessions: number;
  totalMinutes: number;
  currentStreak: number;
  longestStreak: number;
  favoriteTime: string;
  sessions: MeditationSession[];
  dynamicDurations: Record<string, number>;
  lastSessionDate: string;
}

class MeditationService {
  private readonly STORAGE_KEY = 'meditationProgress';
  
  getProgress(): MeditationProgress {
    const saved = localStorage.getItem(this.STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
    
    return {
      totalSessions: 0,
      totalMinutes: 0,
      currentStreak: 0,
      longestStreak: 0,
      favoriteTime: 'morning',
      sessions: [],
      dynamicDurations: {},
      lastSessionDate: ''
    };
  }
  
  getDynamicDuration(sessionId: string): number {
    const progress = this.getProgress();
    const baseDuration = progress.dynamicDurations[sessionId] || 1;
    
    // Check days since last session
    const today = new Date().toDateString();
    const lastDate = progress.lastSessionDate;
    
    if (!lastDate) return baseDuration;
    
    const daysSince = Math.floor(
      (new Date(today).getTime() - new Date(lastDate).getTime()) / (1000 * 60 * 60 * 24)
    );
    
    if (daysSince === 0) {
      return baseDuration; // Same day
    } else if (daysSince === 1) {
      return Math.round(baseDuration * 1.5); // Next day: increase by 50%
    } else {
      // Missed days: decrease by 50% per day
      return Math.max(1, Math.round(baseDuration * Math.pow(0.5, daysSince - 1)));
    }
  }
  
  completeSession(session: MeditationSession): void {
    const progress = this.getProgress();
    const today = new Date().toDateString();
    
    // Update dynamic duration for next time
    const newDuration = Math.round((session.actualDuration || session.duration) * 1.5);
    progress.dynamicDurations[session.id] = Math.min(newDuration, 60); // Cap at 60 minutes
    
    // Update streak
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const wasYesterday = progress.lastSessionDate === yesterday.toDateString();
    
    if (wasYesterday || progress.lastSessionDate === today) {
      progress.currentStreak = wasYesterday ? progress.currentStreak + 1 : progress.currentStreak;
    } else {
      progress.currentStreak = 1;
    }
    
    progress.longestStreak = Math.max(progress.currentStreak, progress.longestStreak);
    
    // Add session
    progress.sessions.push({
      ...session,
      completedAt: new Date()
    });
    
    progress.totalSessions++;
    progress.totalMinutes += session.actualDuration || session.duration;
    progress.lastSessionDate = today;
    
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(progress));
  }
  
  addVoiceNote(sessionId: string, audioBlob: Blob): Promise<string> {
    // For now, convert to base64 and store in localStorage
    // In production, upload to cloud storage
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        const progress = this.getProgress();
        const session = progress.sessions.find(s => s.id === sessionId);
        if (session) {
          session.voiceNoteUrl = base64;
          localStorage.setItem(this.STORAGE_KEY, JSON.stringify(progress));
        }
        resolve(base64);
      };
      reader.readAsDataURL(audioBlob);
    });
  }
  
  getStats() {
    const progress = this.getProgress();
    const avgDuration = progress.totalSessions > 0 
      ? Math.round(progress.totalMinutes / progress.totalSessions)
      : 0;
    
    return {
      totalSessions: progress.totalSessions,
      totalHours: Math.round(progress.totalMinutes / 60),
      averageDuration: avgDuration,
      currentStreak: progress.currentStreak,
      longestStreak: progress.longestStreak
    };
  }
}

export const meditationService = new MeditationService();