// src/features/yin/config/xpBalance.ts

/**
 * Centralized XP balance configuration
 * All XP rewards should be defined here for consistency
 */

export interface XPRewardConfig {
  baseReward: number;
  difficultyMultiplier: number;
  timeInvestment: number; // in minutes
  category: string;
}

// Base XP rewards balanced by effort and time investment
export const XP_REWARDS = {
  // Quick actions (1-3 minutes) - 10-20 XP
  quickActions: {
    gratitude: {
      baseReward: 15,
      difficultyMultiplier: 1.0,
      timeInvestment: 3,
      category: 'journaling'
    },
    dailyIntention: {
      baseReward: 12,
      difficultyMultiplier: 1.0,
      timeInvestment: 2,
      category: 'planning'
    },
    breathingExercise: {
      baseReward: 10,
      difficultyMultiplier: 1.0,
      timeInvestment: 1,
      category: 'mindfulness'
    }
  },

  // Medium actions (5-10 minutes) - 20-40 XP
  mediumActions: {
    meditation: {
      baseReward: 25,
      difficultyMultiplier: 1.2,
      timeInvestment: 5,
      category: 'mindfulness'
    },
    movement: {
      baseReward: 28, // Increased from 7 to be balanced
      difficultyMultiplier: 1.3,
      timeInvestment: 7,
      category: 'fitness'
    },
    insightCapture: {
      baseReward: 30,
      difficultyMultiplier: 1.4,
      timeInvestment: 5,
      category: 'reflection'
    },
    journalEntry: {
      baseReward: 35,
      difficultyMultiplier: 1.3,
      timeInvestment: 10,
      category: 'journaling'
    }
  },

  // Long actions (15+ minutes) - 50+ XP
  longActions: {
    deepMeditation: {
      baseReward: 60,
      difficultyMultiplier: 1.5,
      timeInvestment: 20,
      category: 'mindfulness'
    },
    workoutSession: {
      baseReward: 75,
      difficultyMultiplier: 1.6,
      timeInvestment: 30,
      category: 'fitness'
    },
    learningModule: {
      baseReward: 80,
      difficultyMultiplier: 1.7,
      timeInvestment: 30,
      category: 'growth'
    }
  },

  // Challenge completion bonuses
  challenges: {
    tier1: 100,
    tier2: 200,
    tier3: 300,
    tier4: 500,
    tier5: 750,
    tierMultiplier: 1.5 // Each tier is 1.5x the previous
  },

  // Streak bonuses (additive)
  streaks: {
    daily: 5,      // Per day maintained
    weekly: 50,    // Week completion bonus
    monthly: 250,  // Month completion bonus
    maxDailyBonus: 50 // Cap for daily streak bonus
  },

  // Time-based multipliers
  timeMultipliers: {
    earlyBird: {
      before: '09:00',
      multiplier: 1.25,
      description: 'Morning practice bonus'
    },
    nightOwl: {
      after: '20:00',
      multiplier: 1.15,
      description: 'Evening practice bonus'
    },
    weekend: {
      multiplier: 1.2,
      description: 'Weekend warrior bonus'
    }
  }
};

// XP calculation helper functions
export const calculateQuestXP = (
  questType: string,
  duration: number,
  modifiers: {
    timeBonus?: boolean;
    streakDays?: number;
    performanceMode?: boolean;
  } = {}
): number => {
  // Find the appropriate reward config
  let baseConfig: XPRewardConfig | undefined;
  
  for (const category of Object.values(XP_REWARDS.quickActions)) {
    if (category.category === questType) {
      baseConfig = category;
      break;
    }
  }
  
  if (!baseConfig) {
    for (const category of Object.values(XP_REWARDS.mediumActions)) {
      if (category.category === questType) {
        baseConfig = category;
        break;
      }
    }
  }
  
  if (!baseConfig) {
    for (const category of Object.values(XP_REWARDS.longActions)) {
      if (category.category === questType) {
        baseConfig = category;
        break;
      }
    }
  }
  
  if (!baseConfig) {
    // Default fallback
    return 20;
  }
  
  let xp = baseConfig.baseReward;
  
  // Apply duration scaling (longer = more XP)
  const durationMultiplier = Math.min(2, duration / baseConfig.timeInvestment);
  xp = Math.floor(xp * durationMultiplier);
  
  // Apply time bonus
  if (modifiers.timeBonus) {
    const hour = new Date().getHours();
    const timeString = `${hour.toString().padStart(2, '0')}:00`;
    
    if (timeString < XP_REWARDS.timeMultipliers.earlyBird.before) {
      xp = Math.floor(xp * XP_REWARDS.timeMultipliers.earlyBird.multiplier);
    } else if (timeString > XP_REWARDS.timeMultipliers.nightOwl.after) {
      xp = Math.floor(xp * XP_REWARDS.timeMultipliers.nightOwl.multiplier);
    }
    
    // Weekend bonus
    const day = new Date().getDay();
    if (day === 0 || day === 6) {
      xp = Math.floor(xp * XP_REWARDS.timeMultipliers.weekend.multiplier);
    }
  }
  
  // Apply streak bonus
  if (modifiers.streakDays) {
    const streakBonus = Math.min(
      modifiers.streakDays * XP_REWARDS.streaks.daily,
      XP_REWARDS.streaks.maxDailyBonus
    );
    xp += streakBonus;
  }
  
  // Reduce XP slightly in performance mode (less visual feedback)
  if (modifiers.performanceMode) {
    xp = Math.floor(xp * 0.95);
  }
  
  return xp;
};

// Movement quest specific - balanced per exercise
export const MOVEMENT_XP_PER_EXERCISE = 4; // 7 exercises = 28 XP total
export const MOVEMENT_COMPLETION_BONUS = 7; // Bonus for completing all

// Meditation duration scaling
export const MEDITATION_XP_SCALE = {
  1: 10,   // 1 minute
  3: 20,   // 3 minutes
  5: 25,   // 5 minutes (base)
  10: 45,  // 10 minutes
  15: 70,  // 15 minutes
  20: 100, // 20 minutes
  30: 150  // 30 minutes
};

export default XP_REWARDS;