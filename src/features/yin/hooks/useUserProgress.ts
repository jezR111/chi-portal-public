// src/features/yin/hooks/useUserProgress.ts

import { useCallback, useEffect, useState } from 'react';
import { progressService } from '../services/progressService';

interface UserProgress {
  userId: string;
  level: number;
  totalXP: number;
  currentLevelXP: number;
  nextLevelXP: number;
  streakDays: number;
  lastActiveDate: Date;
  achievements: Achievement[];
  chapterProgress: ChapterProgress[];
  stats: UserStats;
}

interface ChapterProgress {
  chapterId: string;
  percentage: number;
  unlocked: boolean;
  completedLessons: string[];
  lastAccessedAt?: Date;
}

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt: Date;
  xpReward: number;
}

interface UserStats {
  totalMeditationMinutes: number;
  totalInsights: number;
  totalLessonsCompleted: number;
  averageComprehension: number;
  joinedAt: Date;
}

export const useUserProgress = (userId: string) => {
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [chapterProgress, setChapterProgress] = useState<Record<string, ChapterProgress>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [syncing, setSyncing] = useState(false);
  
  useEffect(() => {
    if (userId) {
      loadProgress();
    }
  }, [userId]);
  
  const loadProgress = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Try to load from server
      const serverProgress = await progressService.getUserProgress(userId);
      
      if (serverProgress) {
        setProgress(serverProgress);
        
        // Convert array to map for easier access
        const progressMap: Record<string, ChapterProgress> = {};
        serverProgress.chapterProgress.forEach(cp => {
          progressMap[cp.chapterId] = cp;
        });
        setChapterProgress(progressMap);
      } else {
        // Initialize new user progress
        const newProgress = await initializeUserProgress(userId);
        setProgress(newProgress);
      }
    } catch (err) {
      setError(err as Error);
      console.error('Error loading progress:', err);
      
      // Try to load from local storage as fallback
      loadLocalProgress(userId);
    } finally {
      setLoading(false);
    }
  };
  
  const loadLocalProgress = (userId: string) => {
    try {
      const local = localStorage.getItem(`progress_${userId}`);
      if (local) {
        const parsed = JSON.parse(local);
        setProgress(parsed);
        
        const progressMap: Record<string, ChapterProgress> = {};
        parsed.chapterProgress?.forEach((cp: ChapterProgress) => {
          progressMap[cp.chapterId] = cp;
        });
        setChapterProgress(progressMap);
      }
    } catch (err) {
      console.error('Error loading local progress:', err);
    }
  };
  
  const saveLocalProgress = useCallback((progress: UserProgress) => {
    try {
      localStorage.setItem(`progress_${userId}`, JSON.stringify(progress));
    } catch (err) {
      console.error('Error saving local progress:', err);
    }
  }, [userId]);
  
  const syncProgress = useCallback(async () => {
    if (!progress) return;
    
    try {
      setSyncing(true);
      await progressService.syncProgress(progress);
    } catch (err) {
      console.error('Error syncing progress:', err);
    } finally {
      setSyncing(false);
    }
  }, [progress]);
  
  const updateProgress = useCallback((updates: Partial<UserProgress>) => {
    setProgress(prev => {
      if (!prev) return null;
      
      const updated = { ...prev, ...updates };
      saveLocalProgress(updated);
      
      // Queue sync
      setTimeout(() => syncProgress(), 1000);
      
      return updated;
    });
  }, [saveLocalProgress, syncProgress]);
  
  const updateChapterProgress = useCallback(async (
    chapterId: string,
    lessonId: string,
    completed: boolean
  ) => {
    try {
      const currentChapterProgress = chapterProgress[chapterId] || {
        chapterId,
        percentage: 0,
        unlocked: true,
        completedLessons: []
      };
      
      // Update completed lessons
      const completedLessons = completed
        ? [...new Set([...currentChapterProgress.completedLessons, lessonId])]
        : currentChapterProgress.completedLessons.filter(id => id !== lessonId);
      
      // Calculate new percentage (would need total lessons count)
      const percentage = (completedLessons.length / 5) * 100; // Assuming 5 lessons per chapter
      
      const updatedChapterProgress = {
        ...currentChapterProgress,
        completedLessons,
        percentage,
        lastAccessedAt: new Date()
      };
      
      // Update local state
      setChapterProgress(prev => ({
        ...prev,
        [chapterId]: updatedChapterProgress
      }));
      
      // Update main progress
      if (progress) {
        const updatedProgress = {
          ...progress,
          chapterProgress: Object.values({
            ...chapterProgress,
            [chapterId]: updatedChapterProgress
          })
        };
        
        updateProgress(updatedProgress);
        
        // Sync with server
        await progressService.updateChapterProgress(userId, chapterId, updatedChapterProgress);
      }
    } catch (err) {
      setError(err as Error);
    }
  }, [userId, progress, chapterProgress, updateProgress]);
  
  const addXP = useCallback(async (amount: number, source: string) => {
    if (!progress) return;
    
    const newTotalXP = progress.totalXP + amount;
    const newCurrentLevelXP = progress.currentLevelXP + amount;
    
    let newLevel = progress.level;
    let currentLevelXP = newCurrentLevelXP;
    
    // Check for level up
    while (currentLevelXP >= progress.nextLevelXP) {
      currentLevelXP -= progress.nextLevelXP;
      newLevel++;
    }
    
    const updates = {
      totalXP: newTotalXP,
      currentLevelXP,
      level: newLevel,
      nextLevelXP: calculateNextLevelXP(newLevel)
    };
    
    updateProgress(updates);
    
    // Log XP gain
    await progressService.logXPGain(userId, amount, source);
    
    return {
      leveledUp: newLevel > progress.level,
      newLevel,
      totalXP: newTotalXP
    };
  }, [userId, progress, updateProgress]);
  
  const updateStreak = useCallback(async () => {
    if (!progress) return;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const lastActive = new Date(progress.lastActiveDate);
    lastActive.setHours(0, 0, 0, 0);
    
    const daysDiff = Math.floor((today.getTime() - lastActive.getTime()) / (1000 * 60 * 60 * 24));
    
    let newStreak = progress.streakDays;
    
    if (daysDiff === 0) {
      // Same day, no change
      return newStreak;
    } else if (daysDiff === 1) {
      // Next day, increment streak
      newStreak++;
    } else {
      // Streak broken
      newStreak = 1;
    }
    
    updateProgress({
      streakDays: newStreak,
      lastActiveDate: today
    });
    
    return newStreak;
  }, [progress, updateProgress]);
  
  const unlockAchievement = useCallback(async (achievementId: string) => {
    if (!progress) return;
    
    // Check if already unlocked
    if (progress.achievements.some(a => a.id === achievementId)) {
      return;
    }
    
    // Get achievement details
    const achievement = await progressService.getAchievement(achievementId);
    if (!achievement) return;
    
    const newAchievement: Achievement = {
      ...achievement,
      unlockedAt: new Date()
    };
    
    updateProgress({
      achievements: [...progress.achievements, newAchievement]
    });
    
    // Add XP reward
    if (achievement.xpReward > 0) {
      await addXP(achievement.xpReward, `achievement_${achievementId}`);
    }
    
    return newAchievement;
  }, [progress, updateProgress, addXP]);
  
  return {
    progress: chapterProgress,
    level: progress?.level || 1,
    totalXP: progress?.totalXP || 0,
    streakDays: progress?.streakDays || 0,
    achievements: progress?.achievements || [],
    stats: progress?.stats,
    loading,
    error,
    syncing,
    updateProgress,
    updateChapterProgress,
    addXP,
    updateStreak,
    unlockAchievement,
    refresh: loadProgress
  };
};

// Helper functions
const initializeUserProgress = async (userId: string): Promise<UserProgress> => {
  const now = new Date();
  
  return {
    userId,
    level: 1,
    totalXP: 0,
    currentLevelXP: 0,
    nextLevelXP: 1000,
    streakDays: 0,
    lastActiveDate: now,
    achievements: [],
    chapterProgress: [
      {
        chapterId: 'chapter-1',
        percentage: 0,
        unlocked: true,
        completedLessons: []
      }
    ],
    stats: {
      totalMeditationMinutes: 0,
      totalInsights: 0,
      totalLessonsCompleted: 0,
      averageComprehension: 0,
      joinedAt: now
    }
  };
};

const calculateNextLevelXP = (level: number): number => {
  // Exponential XP curve
  return Math.floor(1000 * Math.pow(1.5, level - 1));
};