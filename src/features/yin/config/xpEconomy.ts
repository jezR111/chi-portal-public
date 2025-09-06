// src/features/yin/config/xpEconomy.ts

export const XP_ECONOMY = {
  // Starting XP
  INITIAL_XP: 0, // Start with 0, earn through journey
  
  // Earning XP
  EARNING: {
    LESSON_COMPLETION: 10,        // Per lesson completed
    CHAPTER_COMPLETION: 30,       // Bonus for completing all lessons in chapter
    PATH_COMPLETION: 100,         // Bonus for completing entire path
    DAILY_PRACTICE: 5,            // Daily login/practice
    INSIGHT_CAPTURE: 3,           // Recording an insight
    MEDITATION_SESSION: 5,        // Completing meditation
    WEEKLY_STREAK: 25,            // Maintaining 7-day streak
    REFLECTION_ENTRY: 2,          // Journaling/reflection
  },
  
  // Spending XP - Unlocks
  UNLOCK_COSTS: {
    PATH: {
      FIRST: 0,         // First path is free
      SECOND: 150,      // Second path unlock
      THIRD: 300,       // Third path unlock
      FOURTH: 500,      // Fourth path unlock
      ADDITIONAL: 750   // Each additional path (5+)
    },
    CHAPTER: {
      FREE_TIER: 0,     // First 2 chapters in each path are free
      TIER_1: 50,       // Chapters 3-4
      TIER_2: 75,       // Chapters 5-6
      TIER_3: 100,      // Chapters 7+
    }
  },
  
  // Progression Rules
  RULES: {
    FREE_CHAPTERS_PER_PATH: 2,      // First 2 chapters free in each path
    FREE_PATHS: 1,                   // First path selection is free
    LESSON_UNLOCK: 'SEQUENTIAL',     // Must complete previous lesson
    ALLOW_PREVIEW: true,             // Can preview locked content
    PREVIEW_DURATION: 60,            // Preview first 60 seconds of content
    MIN_LESSON_COMPLETION: 0.8,      // 80% completion for XP
  },
  
  // Special Events & Bonuses
  BONUSES: {
    FIRST_LESSON_OF_DAY: 5,         // Bonus for first lesson each day
    PERFECT_WEEK: 50,               // Complete 7 days in a row
    PATH_MASTERY: 200,              // 100% completion of a path
    INSIGHT_MILESTONE: {             // Bonus for insight collection
      10: 20,
      25: 50,
      50: 100,
      100: 250
    }
  },
  
  // XP Display
  DISPLAY: {
    SHOW_NEXT_UNLOCK: true,         // Show what user can unlock next
    SHOW_PROGRESS_BAR: true,         // Visual progress to next unlock
    SHOW_TOTAL_XP: true,            // Display total XP earned
    SHOW_AVAILABLE_XP: true,        // Display spendable XP
  }
};

// Helper functions for XP calculations
export const calculateChapterUnlockCost = (chapterIndex: number): number => {
  if (chapterIndex < XP_ECONOMY.RULES.FREE_CHAPTERS_PER_PATH) {
    return XP_ECONOMY.UNLOCK_COSTS.CHAPTER.FREE_TIER;
  } else if (chapterIndex < 4) {
    return XP_ECONOMY.UNLOCK_COSTS.CHAPTER.TIER_1;
  } else if (chapterIndex < 6) {
    return XP_ECONOMY.UNLOCK_COSTS.CHAPTER.TIER_2;
  } else {
    return XP_ECONOMY.UNLOCK_COSTS.CHAPTER.TIER_3;
  }
};

export const calculatePathUnlockCost = (pathNumber: number): number => {
  const costs = XP_ECONOMY.UNLOCK_COSTS.PATH;
  
  switch(pathNumber) {
    case 1: return costs.FIRST;
    case 2: return costs.SECOND;
    case 3: return costs.THIRD;
    case 4: return costs.FOURTH;
    default: return costs.ADDITIONAL;
  }
};

export const calculateTotalXPForPath = (
  chaptersCount: number, 
  lessonsPerChapter: number[]
): number => {
  const lessonXP = lessonsPerChapter.reduce((sum, count) => 
    sum + (count * XP_ECONOMY.EARNING.LESSON_COMPLETION), 0
  );
  const chapterBonuses = chaptersCount * XP_ECONOMY.EARNING.CHAPTER_COMPLETION;
  const pathBonus = XP_ECONOMY.EARNING.PATH_COMPLETION;
  
  return lessonXP + chapterBonuses + pathBonus;
};

// XP requirement messages
export const XP_MESSAGES = {
  INSUFFICIENT_XP: (needed: number, current: number) => 
    `You need ${needed - current} more XP to unlock this content`,
  UNLOCK_SUCCESS: (item: string) => 
    `Successfully unlocked ${item}!`,
  XP_EARNED: (amount: number, reason: string) => 
    `+${amount} XP earned for ${reason}`,
  NEXT_UNLOCK: (item: string, cost: number, current: number) => 
    `${cost - current} XP until you can unlock ${item}`,
  SEQUENTIAL_LOCK: 'Complete the previous lesson to unlock this one',
  PATH_LOCKED: (cost: number) => 
    `This path requires ${cost} XP to unlock`,
  PREVIEW_MODE: 'Preview Mode - Complete lessons to unlock full access'
};