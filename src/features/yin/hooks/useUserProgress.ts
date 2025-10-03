import { useCallback, useEffect, useState } from 'react';
import { XP_CONFIG, getChapterUnlockCost, getPathUnlockCost } from '../xp/xpConfig';

interface UserProgress {
  // XP System
  totalXP: number;
  availableXP: number;
  
  // Path Progress
  selectedPaths: string[];      // First path is free, others cost XP
  currentPath: string | null;
  unlockedPaths: string[];
  
  // Chapter Progress
  unlockedChapters: string[];   // Chapters user has unlocked with XP
  currentChapter: string | null;
  
  // Lesson Progress
  completedLessons: string[];   // Fully completed lessons
  currentLesson: string | null;
  lessonProgress: Record<string, number>; // Percentage completion per lesson
  
  // Stats
  dailyStreak: number;
  lastActiveDate: string;
  totalMeditationMinutes: number;
  insightsCaptured: number;
}

const INITIAL_PROGRESS: UserProgress = {
  totalXP: XP_CONFIG.INITIAL_XP,
  availableXP: XP_CONFIG.INITIAL_XP,
  selectedPaths: [],
  currentPath: null,
  unlockedPaths: [],
  unlockedChapters: [],
  currentChapter: null,
  completedLessons: [],
  currentLesson: null,
  lessonProgress: {},
  dailyStreak: 0,
  lastActiveDate: new Date().toISOString(),
  totalMeditationMinutes: 0,
  insightsCaptured: 0,
};

export const useUserProgress = () => {
  const [progress, setProgress] = useState<UserProgress>(() => {
    // Check if we're on the client side
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('yinRealmProgress');
      return saved ? JSON.parse(saved) : INITIAL_PROGRESS;
    }
    return INITIAL_PROGRESS;
  });

  // Save to localStorage whenever progress changes (client-side only)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('yinRealmProgress', JSON.stringify(progress));
    }
  }, [progress]);
  
  // Check if a path is unlocked
  const isPathUnlocked = useCallback((pathId: string): boolean => {
    return progress.unlockedPaths.includes(pathId) || 
           (progress.selectedPaths.length === 0); // First path is free
  }, [progress]);

  // Check if a chapter is unlocked
  const isChapterUnlocked = useCallback((chapterId: string, chapterIndex: number, pathId: string): boolean => {
    // First check if the path is unlocked
    if (!isPathUnlocked(pathId) && !progress.selectedPaths.includes(pathId)) {
      return false;
    }
    
    // First X chapters in each unlocked path are free
    if (chapterIndex < XP_CONFIG.RULES.FREE_CHAPTERS_PER_PATH) {
      return progress.selectedPaths.includes(pathId) || progress.unlockedPaths.includes(pathId);
    }
    
    // Otherwise, check if specifically unlocked
    return progress.unlockedChapters.includes(chapterId);
  }, [progress, isPathUnlocked]);

  // Check if a lesson is accessible (sequential unlock)
  const canAccessLesson = useCallback((lessonId: string, lessonIndex: number, chapterId: string, chapterIndex: number, pathId: string): boolean => {
    // First, chapter must be unlocked
    if (!isChapterUnlocked(chapterId, chapterIndex, pathId)) {
      return false;
    }
    
    // First lesson in a chapter is always accessible if chapter is unlocked
    if (lessonIndex === 0) {
      return true;
    }
    
    // For subsequent lessons, check if previous lesson is completed
    // This requires knowing the lesson order - would need chapter data
    // For now, we'll use a simplified check
    const chapterLessons = getLessonsForChapter(chapterId); // You'd implement this
    const previousLessonId = chapterLessons[lessonIndex - 1]?.id;
    
    return progress.completedLessons.includes(previousLessonId);
  }, [progress, isChapterUnlocked]);

  // Select first path (free)
  const selectFirstPath = useCallback((pathId: string) => {
    if (progress.selectedPaths.length === 0) {
      setProgress(prev => ({
        ...prev,
        selectedPaths: [pathId],
        currentPath: pathId,
        unlockedPaths: [pathId], // First path is automatically unlocked
      }));
      
      // Show success message
      console.log(`🎉 Path unlocked: ${pathId}`);
    }
  }, [progress]);

  // Unlock additional path with XP
  const unlockPath = useCallback((pathId: string): boolean => {
    const pathNumber = progress.unlockedPaths.length + 1;
    const cost = getPathUnlockCost(pathNumber); // Changed from calculatePathUnlockCost
    
    if (progress.availableXP >= cost) {
      setProgress(prev => ({
        ...prev,
        availableXP: prev.availableXP - cost,
        unlockedPaths: [...prev.unlockedPaths, pathId],
        selectedPaths: [...prev.selectedPaths, pathId],
      }));
      
      console.log(`🎉 Path unlocked for ${cost} XP: ${pathId}`);
      return true;
    }
    
    console.log(`❌ Insufficient XP. Need ${cost}, have ${progress.availableXP}`);
    return false;
  }, [progress]);

  // Unlock chapter with XP
  const unlockChapter = useCallback((chapterId: string, chapterIndex: number): boolean => {
    const cost = getChapterUnlockCost(chapterIndex); // Changed from calculateChapterUnlockCost
    
    // Free chapters don't need XP
    if (cost === 0) {
      setProgress(prev => ({
        ...prev,
        unlockedChapters: [...prev.unlockedChapters, chapterId],
      }));
      return true;
    }
    
    // Check XP for paid chapters
    if (progress.availableXP >= cost) {
      setProgress(prev => ({
        ...prev,
        availableXP: prev.availableXP - cost,
        unlockedChapters: [...prev.unlockedChapters, chapterId],
      }));
      
      console.log(`🎉 Chapter unlocked for ${cost} XP: ${chapterId}`);
      return true;
    }
    
    console.log(`❌ Insufficient XP. Need ${cost}, have ${progress.availableXP}`);
    return false;
  }, [progress]);

  // Complete a lesson and earn XP
  const completeLesson = useCallback((lessonId: string) => {
    if (!progress.completedLessons.includes(lessonId)) {
      const xpEarned = XP_CONFIG.REWARDS.LESSON_COMPLETE; // Changed from EARNING.LESSON_COMPLETION
      
      setProgress(prev => ({
        ...prev,
        completedLessons: [...prev.completedLessons, lessonId],
        totalXP: prev.totalXP + xpEarned,
        availableXP: prev.availableXP + xpEarned,
        lessonProgress: {
          ...prev.lessonProgress,
          [lessonId]: 100,
        },
      }));
      
      console.log(`✅ Lesson completed! +${xpEarned} XP`);
      
      // Check for chapter completion bonus
      checkChapterCompletion(lessonId);
    }
  }, [progress]);

  // Update lesson progress (partial completion)
  const updateLessonProgress = useCallback((lessonId: string, percentage: number) => {
    setProgress(prev => ({
      ...prev,
      lessonProgress: {
        ...prev.lessonProgress,
        [lessonId]: Math.min(100, Math.max(0, percentage)),
      },
      currentLesson: lessonId,
    }));
  }, []);

  // Check if completing this lesson finishes a chapter
  const checkChapterCompletion = useCallback((lessonId: string) => {
    // This would need chapter data to properly implement
    // Check if all lessons in the chapter are complete
    // Award chapter completion bonus if true
    // For now, just a placeholder
    // When implemented, use XP_CONFIG.REWARDS.CHAPTER_COMPLETE
  }, []);

  // Earn XP from various activities
  const earnXP = useCallback((amount: number, reason: string) => {
    setProgress(prev => ({
      ...prev,
      totalXP: prev.totalXP + amount,
      availableXP: prev.availableXP + amount,
    }));
    
    console.log(`💫 +${amount} XP earned for ${reason}`);
  }, []);

  // Get progress for a specific chapter
  const getChapterProgress = useCallback((chapterId: string) => {
    // Would need chapter data to calculate
    // Returns { completed: number, total: number, percentage: number }
    return { completed: 0, total: 0, percentage: 0 };
  }, []);

  // Get next available lesson in current path
  const getNextLesson = useCallback(() => {
    // Logic to find the next sequential lesson
    // Would need chapter and lesson data
    return null;
  }, []);

  // Helper function - would be imported from data
  const getLessonsForChapter = (chapterId: string) => {
    // This would fetch from your chapter data
    return [];
  };

  return {
    progress,
    
    // Path functions
    isPathUnlocked,
    selectFirstPath,
    unlockPath,
    
    // Chapter functions
    isChapterUnlocked,
    unlockChapter,
    getChapterProgress,
    
    // Lesson functions
    canAccessLesson,
    completeLesson,
    updateLessonProgress,
    getNextLesson,
    
    // XP functions
    earnXP,
    
    // Utility
    resetProgress: () => setProgress(INITIAL_PROGRESS),
  };
};