// src/features/yin/config/xpConfig.ts

export const XP_CONFIG = {
  // Starting XP
  INITIAL_XP: 0, // Start with 0, earn through journey
  
  // Earning XP
  REWARDS: {
    LESSON_COMPLETE: 10,      // Per lesson completed
    CHAPTER_COMPLETE: 30,     // Bonus for completing all lessons in chapter
    PATH_COMPLETE: 100,       // Bonus for completing entire path
    DAILY_PRACTICE: 5,        // Daily login/practice
    INSIGHT_CAPTURE: 3,       // Recording an insight
    MEDITATION_COMPLETE: 5,   // Completing meditation
  },
  
  // Spending XP - Path Unlocks
  PATH_COSTS: {
    FIRST: 0,         // First path is free
    SECOND: 150,      // Second path unlock
    THIRD: 300,       // Third path unlock
    FOURTH: 500,      // Fourth path unlock
    ADDITIONAL: 750   // Each additional path (5+)
  },
  
  // Spending XP - Chapter Unlocks
  CHAPTER_COSTS: {
    FREE_TIER: 0,     // First 2 chapters in each path are free
    TIER_1: 50,       // Chapters 3-4
    TIER_2: 75,       // Chapters 5-6
    TIER_3: 100,      // Chapters 7+
  },
  
  // Rules
  RULES: {
    FREE_CHAPTERS_PER_PATH: 2,      // First 2 chapters free in each path
    FREE_PATHS: 1,                   // First path selection is free
    LESSON_UNLOCK: 'SEQUENTIAL',     // Must complete previous lesson
    ALLOW_PREVIEW: true,             // Can preview locked content
  }
};

// Helper function to calculate chapter unlock cost
export const getChapterUnlockCost = (chapterIndex: number): number => {
  if (chapterIndex < XP_CONFIG.RULES.FREE_CHAPTERS_PER_PATH) {
    return XP_CONFIG.CHAPTER_COSTS.FREE_TIER;
  } else if (chapterIndex < 4) {
    return XP_CONFIG.CHAPTER_COSTS.TIER_1;
  } else if (chapterIndex < 6) {
    return XP_CONFIG.CHAPTER_COSTS.TIER_2;
  } else {
    return XP_CONFIG.CHAPTER_COSTS.TIER_3;
  }
};

// Helper function to calculate path unlock cost
export const getPathUnlockCost = (pathNumber: number): number => {
  const costs = XP_CONFIG.PATH_COSTS;
  
  switch(pathNumber) {
    case 1: return costs.FIRST;
    case 2: return costs.SECOND;
    case 3: return costs.THIRD;
    case 4: return costs.FOURTH;
    default: return costs.ADDITIONAL;
  }
};