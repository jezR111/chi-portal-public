// src/features/yin/config/xpEconomy.ts

export const XP_ECONOMY = {
  // Starting XP
  INITIAL_XP: 0, // Start with 0, earn through journey
  
  // Earning XP
  LESSON_COMPLETION: 10,        // Per lesson completed
  CHAPTER_COMPLETION: 30,       // Bonus for completing all lessons in chapter
  PATH_COMPLETION: 100,         // Bonus for completing entire path
  DAILY_PRACTICE: 5,            // Daily login/practice
  INSIGHT_CAPTURE: 3,           // Recording an insight
  MEDITATION_SESSION: 5,        // Completing meditation
  
  // Spending XP - Unlocks
  UNLOCK_COSTS: {
    PATH: {
      FIRST: 0,     // First path is free
      SECOND: 150,  // Second path unlock
      THIRD: 300,   // Third path unlock
      ADDITIONAL: 500 // Each additional path
    },
    CHAPTER: {
      TIER_1: 0,    // First 2 chapters in path are free
      TIER_2: 50,   // Chapters 3-5
      TIER_3: 100,  // Chapters 6+
    }
  },
  
  // Progression Rules
  RULES: {
    FREE_CHAPTERS_PER_PATH: 2,
    LESSON_UNLOCK: 'SEQUENTIAL', // Must complete previous
    ALLOW_PREVIEW: true,         // Can preview locked content
  }
};