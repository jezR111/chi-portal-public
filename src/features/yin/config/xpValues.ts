// src/features/yin/config/xpValues.ts
// Version: 1.0.0 - Centralized XP value configuration

/**
 * Centralized XP values for all activities
 * This ensures consistency across the app
 */

export const XP_VALUES = {
  // Quest XP (fixed amounts)
  quests: {
    meditation: 50,      // Fixed
    gratitude: 30,       // Fixed
    movement: {
      base: 35,          // Max if all exercises done
      perExercise: 5,    // Each exercise worth 5 XP
    },
    dailyIntention: 25,  // Fixed (was breathing)
    insight: 40,         // Fixed (was learning)
  },

  // Challenge XP (fixed amounts per challenge)
  challenges: {
    // Tier 1
    'first-steps': 100,
    'daily-practice': 150,
    
    // Tier 2
    'meditation-master': 200,
    'gratitude-champion': 200,
    
    // Tier 3
    'breath-warrior': 300,
  },

  // Lesson/Chapter XP
  lessons: {
    base: 25,
    completion: 15,
    perfect: 10,  // Bonus
  },

  // Time-based activities (per minute)
  perMinute: {
    meditation: 10,
    movement: 7,
    reading: 5,
  },

  // Bonuses
  bonuses: {
    firstTime: 20,
    streak3Days: 15,
    streak7Days: 30,
    perfectWeek: 100,
  }
};

/**
 * Calculate movement quest XP based on exercises completed
 */
export function calculateMovementXP(completedExercises: number, totalExercises: number): number {
  if (totalExercises === 0) return 0;
  const completionRate = completedExercises / totalExercises;
  return Math.round(XP_VALUES.quests.movement.base * completionRate);
}

/**
 * Get challenge XP by ID
 */
export function getChallengeXP(challengeId: string): number {
  return XP_VALUES.challenges[challengeId as keyof typeof XP_VALUES.challenges] || 100;
}