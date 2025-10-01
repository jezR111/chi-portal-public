// src/features/yin/hooks/useYinProgress.ts
// Version: 2.0.0 - SSR-Safe Progress Management
// Last Updated: 2024-01-20

import { useCallback, useEffect, useState } from 'react';

interface YinProgressData {
  totalXP: number;
  completedLessons: string[];
  pathProgress: Record<string, number>;
  lastUpdated: string;
}

const DEFAULT_PROGRESS: YinProgressData = {
  totalXP: 150,
  completedLessons: [],
  pathProgress: {},
  lastUpdated: new Date().toISOString()
};

export function useYinProgress(storageKey = 'chi_portal_chapter_progress') {
  // Start with default values (SSR-safe)
  const [progress, setProgress] = useState<YinProgressData>(DEFAULT_PROGRESS);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage after mount (client-side only)
  useEffect(() => {
    if (typeof window === 'undefined') return;

    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        setProgress({
          totalXP: parsed.totalXP || DEFAULT_PROGRESS.totalXP,
          completedLessons: parsed.completedLessons || DEFAULT_PROGRESS.completedLessons,
          pathProgress: parsed.pathProgress || DEFAULT_PROGRESS.pathProgress,
          lastUpdated: parsed.lastUpdated || DEFAULT_PROGRESS.lastUpdated
        });
      }
    } catch (error) {
      console.error('Failed to load progress:', error);
    } finally {
      setIsLoaded(true);
    }
  }, [storageKey]);

  // Save to localStorage whenever progress changes
  const saveProgress = useCallback((newProgress: YinProgressData) => {
    if (typeof window === 'undefined') return;

    try {
      const dataToSave = {
        ...newProgress,
        lastUpdated: new Date().toISOString()
      };
      localStorage.setItem(storageKey, JSON.stringify(dataToSave));
      setProgress(dataToSave);
    } catch (error) {
      console.error('Failed to save progress:', error);
    }
  }, [storageKey]);

  // Update functions
  const addXP = useCallback((amount: number) => {
    const newProgress = {
      ...progress,
      totalXP: progress.totalXP + amount
    };
    saveProgress(newProgress);
    return newProgress.totalXP;
  }, [progress, saveProgress]);

  const completeLesson = useCallback((lessonId: string, xpReward = 25) => {
    if (progress.completedLessons.includes(lessonId)) {
      return progress.totalXP; // Already completed
    }

    const newProgress = {
      ...progress,
      totalXP: progress.totalXP + xpReward,
      completedLessons: [...progress.completedLessons, lessonId]
    };
    saveProgress(newProgress);
    return newProgress.totalXP;
  }, [progress, saveProgress]);

  const updatePathProgress = useCallback((pathId: string, progressPercent: number) => {
    const newProgress = {
      ...progress,
      pathProgress: {
        ...progress.pathProgress,
        [pathId]: Math.min(100, Math.max(0, progressPercent))
      }
    };
    saveProgress(newProgress);
  }, [progress, saveProgress]);

  const resetProgress = useCallback(() => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(storageKey);
    }
    setProgress(DEFAULT_PROGRESS);
  }, [storageKey]);

  return {
    // State
    totalXP: progress.totalXP,
    completedLessons: progress.completedLessons,
    pathProgress: progress.pathProgress,
    isLoaded,
    
    // Computed values
    userLevel: Math.floor(progress.totalXP / 100) + 1,
    levelProgress: ((progress.totalXP % 100) / 100) * 100,
    
    // Actions
    addXP,
    completeLesson,
    updatePathProgress,
    resetProgress,
    saveProgress
  };
}