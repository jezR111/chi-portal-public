// src/features/yin/xp/xpConfig.ts
// Version: 3.0.0 - Centralized XP and Level Configuration
// Level Configuration
export interface Level {
  level: number;
  title: string;
  minXP: number;
  maxXP: number;
  color: string;
  icon: string; // Changed from ReactNode to string (emoji)
}

export const LEVELS: Level[] = [
  { level: 1, title: 'Seeker', minXP: 0, maxXP: 99, color: 'from-gray-600 to-gray-500', icon: '🌱' },
  { level: 2, title: 'Apprentice', minXP: 100, maxXP: 249, color: 'from-purple-600 to-purple-500', icon: '🔭' },
  { level: 3, title: 'Explorer', minXP: 250, maxXP: 449, color: 'from-blue-600 to-blue-500', icon: '⚡' },
  { level: 4, title: 'Journeyman', minXP: 450, maxXP: 699, color: 'from-green-600 to-green-500', icon: '🌟' },
  { level: 5, title: 'Practitioner', minXP: 700, maxXP: 999, color: 'from-amber-600 to-amber-500', icon: '✨' },
  { level: 6, title: 'Adept', minXP: 1000, maxXP: 1399, color: 'from-orange-600 to-orange-500', icon: '🏆' },
  { level: 7, title: 'Scholar', minXP: 1400, maxXP: 1899, color: 'from-pink-600 to-pink-500', icon: '💎' },
  { level: 8, title: 'Sage', minXP: 1900, maxXP: 2499, color: 'from-purple-600 to-pink-500', icon: '🧙' },
  { level: 9, title: 'Master', minXP: 2500, maxXP: 3199, color: 'from-indigo-600 to-purple-500', icon: '🎯' },
  { level: 10, title: 'Grandmaster', minXP: 3200, maxXP: 3999, color: 'from-purple-600 via-pink-500 to-amber-500', icon: '👑' },
  { level: 11, title: 'Elder', minXP: 4000, maxXP: 4999, color: 'from-yellow-600 via-red-500 to-purple-500', icon: '🌅' },
  { level: 12, title: 'Ancient', minXP: 5000, maxXP: 6199, color: 'from-cyan-600 via-blue-500 to-purple-500', icon: '🔮' },
  { level: 13, title: 'Mystic', minXP: 6200, maxXP: 7599, color: 'from-green-600 via-teal-500 to-blue-500', icon: '🌌' },
  { level: 14, title: 'Transcendent', minXP: 7600, maxXP: 9199, color: 'from-purple-600 via-pink-500 to-yellow-500', icon: '🎆' },
  { level: 15, title: 'Ascended', minXP: 9200, maxXP: Infinity, color: 'from-white via-purple-500 to-black', icon: '🕊️' }
];

// XP Economy Configuration
export const XP_CONFIG = {
  // Starting XP
  INITIAL_XP: 300, // Start with some XP to feel progress
  
  // Fixed XP Rewards (use these for simple addXP calls)
  REWARDS: {
    // Quests
    QUEST_EASY: 20,
    QUEST_MEDIUM: 35,
    QUEST_HARD: 60,
    
    // Lessons & Learning
    LESSON_COMPLETE: 15,
    CHAPTER_COMPLETE: 50,
    PATH_COMPLETE: 250,
    
    // Daily Activities
    DAILY_LOGIN: 5,
    DAILY_PRACTICE: 10,
    DAILY_INTENTION: 15,
    
    // Insights & Reflection
    INSIGHT_BASIC: 10,
    INSIGHT_BREAKTHROUGH: 50,
    REFLECTION_ENTRY: 15,
    
    // Meditation (base values, multipliers apply)
    MEDITATION_5MIN: 25,
    MEDITATION_10MIN: 50,
    MEDITATION_20MIN: 100,
    MEDITATION_30MIN: 150,
    
    // Challenges
    CHALLENGE_BEGINNER: 20,
    CHALLENGE_INTERMEDIATE: 40,
    CHALLENGE_ADVANCED: 75,
    
    // Streaks
    STREAK_3DAY: 50,
    STREAK_7DAY: 150,
    STREAK_14DAY: 350,
    STREAK_30DAY: 1000,
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
    },
    FEATURES: {
      ADVANCED_MEDITATION: 200,
      SHADOW_WORK_TOOLS: 300,
      COMMUNITY_ACCESS: 150,
      AI_GUIDANCE: 500,
    }
  },
  
  // Multipliers
  MULTIPLIERS: {
    MORNING_PRACTICE: 1.5,    // Before 9am
    EVENING_PRACTICE: 1.2,    // After 10pm
    WEEKEND_WARRIOR: 1.3,     // Sat/Sun
    GROUP_SESSION: 1.4,       // With others
    PERFECT_WEEK: 2.0,        // 7 days straight
    FIRST_TIME: 1.5,          // First time doing activity
  },
  
  // Rules
  RULES: {
    FREE_CHAPTERS_PER_PATH: 2,
    FREE_PATHS: 1,
    MIN_LESSON_COMPLETION: 0.8,  // 80% for XP
    ALLOW_PREVIEW: true,
    PREVIEW_DURATION: 60,         // seconds
  }
};

// Helper Functions
export function calculateLevel(xp: number): Level {
  return LEVELS.find(level => xp >= level.minXP && xp <= level.maxXP) || LEVELS[0];
}

export function calculateProgress(xp: number): number {
  const level = calculateLevel(xp);
  if (level.maxXP === Infinity) return 100;
  
  const xpInLevel = xp - level.minXP;
  const xpNeeded = level.maxXP - level.minXP + 1;
  return Math.floor((xpInLevel / xpNeeded) * 100);
}

export function getNextLevel(currentXP: number): Level | null {
  const currentLevel = calculateLevel(currentXP);
  if (currentLevel.level === LEVELS.length) return null;
  return LEVELS[currentLevel.level]; // Returns next level
}

export function xpToNextLevel(currentXP: number): number {
  const level = calculateLevel(currentXP);
  if (level.maxXP === Infinity) return 0;
  return level.maxXP + 1 - currentXP;
}

export function getChapterUnlockCost(chapterIndex: number): number {
  const costs = XP_CONFIG.UNLOCK_COSTS.CHAPTER;
  if (chapterIndex < XP_CONFIG.RULES.FREE_CHAPTERS_PER_PATH) {
    return costs.FREE_TIER;
  } else if (chapterIndex < 4) {
    return costs.TIER_1;
  } else if (chapterIndex < 6) {
    return costs.TIER_2;
  } else {
    return costs.TIER_3;
  }
}

export function getPathUnlockCost(pathNumber: number): number {
  const costs = XP_CONFIG.UNLOCK_COSTS.PATH;
  switch(pathNumber) {
    case 1: return costs.FIRST;
    case 2: return costs.SECOND;
    case 3: return costs.THIRD;
    case 4: return costs.FOURTH;
    default: return costs.ADDITIONAL;
  }
}

// XP Messages
export const XP_MESSAGES = {
  INSUFFICIENT_XP: (needed: number, current: number) => 
    `You need ${needed - current} more XP to unlock this`,
  UNLOCK_SUCCESS: (item: string) => 
    `Successfully unlocked ${item}!`,
  XP_EARNED: (amount: number, reason: string) => 
    `+${amount} XP earned for ${reason}`,
  LEVEL_UP: (newLevel: number, title: string) =>
    `Level ${newLevel} - ${title} achieved!`,
  STREAK_BONUS: (days: number, xp: number) =>
    `${days}-day streak! +${xp} XP bonus`,
};