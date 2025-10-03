// src/features/yin/xp/XpCalculator-index.ts

import { XP_CONFIG } from './xpConfig';

/**
 * Base interfaces for calculator inputs and outputs
 */
export interface XPCalculationResult {
  base: number;
  bonus: number;
  multiplier: number;
  total: number;
  breakdown: string[];
}

export interface BaseModifiers {
  streakDays?: number;
  isFirstTime?: boolean;
  timeOfDay?: Date;
  isWeekend?: boolean;
  isGroupSession?: boolean;
}

/**
 * Chapter XP Calculator
 */
export const chapterXPCalculator = {
  calculateLessonXP(
    lessonId: string,
    completionTime: number, // in seconds
    comprehensionScore?: number, // 1-5
    modifiers: BaseModifiers = {}
  ): XPCalculationResult {
    const breakdown: string[] = [];
    let base = XP_CONFIG.REWARDS.LESSON_COMPLETE;
    let bonus = 0;
    let multiplier = 1;

    // Comprehension bonus
    if (comprehensionScore && comprehensionScore >= 4) {
      bonus += (comprehensionScore - 3) * 10;
      breakdown.push(`Excellent comprehension: +${(comprehensionScore - 3) * 10} XP`);
    }

    // Speed bonus (if completed under expected time)
    const expectedTime = 300; // 5 minutes expected
    if (completionTime < expectedTime && completionTime > 60) {
      bonus += 5;
      breakdown.push('Quick completion: +5 XP');
    }

    // Apply modifiers
    const mods = calculateModifiers(modifiers);
    multiplier = mods.multiplier;
    breakdown.push(...mods.breakdown);

    const total = Math.floor((base + bonus) * multiplier);

    return { base, bonus, multiplier, total, breakdown };
  },

  calculateChapterCompleteXP(
    chapterId: string,
    lessonsCompleted: number,
    perfectCompletion: boolean,
    modifiers: BaseModifiers = {}
  ): XPCalculationResult {
    const breakdown: string[] = [];
    let base = XP_CONFIG.REWARDS.CHAPTER_COMPLETE;
    let bonus = 0;
    let multiplier = 1;

    // Perfect completion bonus
    if (perfectCompletion) {
      bonus += 25;
      breakdown.push('Perfect completion: +25 XP');
    }

    // Lesson count bonus
    if (lessonsCompleted > 5) {
      bonus += (lessonsCompleted - 5) * 5;
      breakdown.push(`${lessonsCompleted} lessons completed: +${(lessonsCompleted - 5) * 5} XP`);
    }

    // Apply modifiers
    const mods = calculateModifiers(modifiers);
    multiplier = mods.multiplier;
    breakdown.push(...mods.breakdown);

    const total = Math.floor((base + bonus) * multiplier);

    return { base, bonus, multiplier, total, breakdown };
  },

  calculatePathCompleteXP(
    pathId: string,
    chaptersCompleted: number,
    timeToComplete: number, // in days
    modifiers: BaseModifiers = {}
  ): XPCalculationResult {
    const breakdown: string[] = [];
    let base = XP_CONFIG.REWARDS.PATH_COMPLETE;
    let bonus = 0;
    let multiplier = 1;

    // Speed bonus for completing quickly
    if (timeToComplete < 30) {
      bonus += 100;
      breakdown.push('Completed in under 30 days: +100 XP');
    } else if (timeToComplete < 60) {
      bonus += 50;
      breakdown.push('Completed in under 60 days: +50 XP');
    }

    // Apply modifiers
    const mods = calculateModifiers(modifiers);
    multiplier = mods.multiplier;
    breakdown.push(...mods.breakdown);

    const total = Math.floor((base + bonus) * multiplier);

    return { base, bonus, multiplier, total, breakdown };
  }
};

/**
 * Quest XP Calculator
 */
export const questXPCalculator = {
  calculateQuestXP(
    questType: 'daily' | 'weekly' | 'special',
    questId: string,
    completionData: {
      timeSpent?: number; // in minutes
      quality?: number; // 1-5
      firstTime?: boolean;
    } = {},
    modifiers: BaseModifiers = {}
  ): XPCalculationResult {
    const breakdown: string[] = [];
    let base = 0;
    let bonus = 0;
    let multiplier = 1;

    // Base XP by quest type
    switch (questType) {
      case 'daily':
        base = XP_CONFIG.REWARDS.QUEST_EASY;
        break;
      case 'weekly':
        base = XP_CONFIG.REWARDS.QUEST_MEDIUM;
        break;
      case 'special':
        base = XP_CONFIG.REWARDS.QUEST_HARD;
        break;
    }

    // Quality bonus
    if (completionData.quality && completionData.quality >= 4) {
      bonus += (completionData.quality - 3) * 10;
      breakdown.push(`High quality: +${(completionData.quality - 3) * 10} XP`);
    }

    // First time bonus
    if (completionData.firstTime) {
      multiplier *= XP_CONFIG.MULTIPLIERS.FIRST_TIME;
      breakdown.push('First time bonus: 1.5x');
    }

    // Apply modifiers
    const mods = calculateModifiers(modifiers);
    multiplier *= mods.multiplier;
    breakdown.push(...mods.breakdown);

    const total = Math.floor((base + bonus) * multiplier);

    return { base, bonus, multiplier, total, breakdown };
  }
};

/**
 * Meditation XP Calculator
 */
export const meditationXPCalculator = {
  calculateMeditationXP(
    duration: number, // in minutes
    type: 'guided' | 'silent' | 'breathwork',
    modifiers: BaseModifiers = {}
  ): XPCalculationResult {
    const breakdown: string[] = [];
    let base = 0;
    let bonus = 0;
    let multiplier = 1;

    // Base XP by duration
    if (duration >= 30) {
      base = XP_CONFIG.REWARDS.MEDITATION_30MIN;
    } else if (duration >= 20) {
      base = XP_CONFIG.REWARDS.MEDITATION_20MIN;
    } else if (duration >= 10) {
      base = XP_CONFIG.REWARDS.MEDITATION_10MIN;
    } else if (duration >= 5) {
      base = XP_CONFIG.REWARDS.MEDITATION_5MIN;
    } else {
      base = Math.floor(duration * 3); // 3 XP per minute for short sessions
    }

    // Type bonuses
    if (type === 'breathwork') {
      bonus += 10;
      breakdown.push('Breathwork practice: +10 XP');
    }

    // Streak bonus
    if (modifiers.streakDays) {
      if (modifiers.streakDays >= 30) {
        bonus += XP_CONFIG.REWARDS.STREAK_30DAY / 10; // Partial streak bonus
        breakdown.push('30+ day streak bonus: +100 XP');
      } else if (modifiers.streakDays >= 14) {
        bonus += XP_CONFIG.REWARDS.STREAK_14DAY / 10;
        breakdown.push('14+ day streak bonus: +35 XP');
      } else if (modifiers.streakDays >= 7) {
        bonus += XP_CONFIG.REWARDS.STREAK_7DAY / 10;
        breakdown.push('7+ day streak bonus: +15 XP');
      } else if (modifiers.streakDays >= 3) {
        bonus += XP_CONFIG.REWARDS.STREAK_3DAY / 10;
        breakdown.push('3+ day streak bonus: +5 XP');
      }
    }

    // Apply modifiers
    const mods = calculateModifiers(modifiers);
    multiplier = mods.multiplier;
    breakdown.push(...mods.breakdown);

    const total = Math.floor((base + bonus) * multiplier);

    return { base, bonus, multiplier, total, breakdown };
  }
};

/**
 * Movement XP Calculator
 */
export const movementXPCalculator = {
  calculateMovementXP(
    exercises: string[],
    duration: number, // in minutes
    intensity: 'low' | 'medium' | 'high',
    modifiers: BaseModifiers = {}
  ): XPCalculationResult {
    const breakdown: string[] = [];
    let base = exercises.length * 4; // 4 XP per exercise
    let bonus = 0;
    let multiplier = 1;

    // Completion bonus
    if (exercises.length >= 7) {
      bonus += 7;
      breakdown.push('Full routine completion: +7 XP');
    }

    // Intensity bonus
    switch (intensity) {
      case 'high':
        bonus += 10;
        breakdown.push('High intensity: +10 XP');
        break;
      case 'medium':
        bonus += 5;
        breakdown.push('Medium intensity: +5 XP');
        break;
    }

    // Duration bonus
    if (duration >= 30) {
      bonus += 15;
      breakdown.push('30+ minute session: +15 XP');
    } else if (duration >= 15) {
      bonus += 7;
      breakdown.push('15+ minute session: +7 XP');
    }

    // Apply modifiers
    const mods = calculateModifiers(modifiers);
    multiplier = mods.multiplier;
    breakdown.push(...mods.breakdown);

    const total = Math.floor((base + bonus) * multiplier);

    return { base, bonus, multiplier, total, breakdown };
  }
};

/**
 * Insight XP Calculator
 */
export const insightXPCalculator = {
  calculateInsightXP(
    insights: Array<{
      text: string;
      tags?: string[];
      isBreakthrough?: boolean;
    }>,
    modifiers: BaseModifiers = {}
  ): XPCalculationResult {
    const breakdown: string[] = [];
    let base = insights.length * XP_CONFIG.REWARDS.INSIGHT_BASIC;
    let bonus = 0;
    let multiplier = 1;

    // Breakthrough insights
    const breakthroughs = insights.filter(i => i.isBreakthrough);
    if (breakthroughs.length > 0) {
      bonus += breakthroughs.length * (XP_CONFIG.REWARDS.INSIGHT_BREAKTHROUGH - XP_CONFIG.REWARDS.INSIGHT_BASIC);
      breakdown.push(`${breakthroughs.length} breakthrough insights: +${bonus} XP`);
    }

    // Multiple insights bonus
    if (insights.length >= 5) {
      bonus += 25;
      breakdown.push('5+ insights in session: +25 XP');
    }

    // Apply modifiers
    const mods = calculateModifiers(modifiers);
    multiplier = mods.multiplier;
    breakdown.push(...mods.breakdown);

    const total = Math.floor((base + bonus) * multiplier);

    return { base, bonus, multiplier, total, breakdown };
  }
};

/**
 * Journal XP Calculator
 */
export const journalXPCalculator = {
  calculateJournalXP(
    wordCount: number,
    mood?: string,
    includesReflection?: boolean,
    modifiers: BaseModifiers = {}
  ): XPCalculationResult {
    const breakdown: string[] = [];
    let base = XP_CONFIG.REWARDS.REFLECTION_ENTRY;
    let bonus = 0;
    let multiplier = 1;

    // Word count bonus
    if (wordCount >= 1000) {
      bonus += 50;
      breakdown.push('1000+ words: +50 XP');
    } else if (wordCount >= 500) {
      bonus += 25;
      breakdown.push('500+ words: +25 XP');
    } else if (wordCount >= 250) {
      bonus += 10;
      breakdown.push('250+ words: +10 XP');
    }

    // Reflection bonus
    if (includesReflection) {
      bonus += 15;
      breakdown.push('Includes reflection: +15 XP');
    }

    // Apply modifiers
    const mods = calculateModifiers(modifiers);
    multiplier = mods.multiplier;
    breakdown.push(...mods.breakdown);

    const total = Math.floor((base + bonus) * multiplier);

    return { base, bonus, multiplier, total, breakdown };
  }
};

/**
 * Challenge XP Calculator
 */
export const challengeXPCalculator = {
  calculateChallengeXP(
    tier: number, // 1-5
    daysToComplete: number,
    perfectCompletion?: boolean,
    modifiers: BaseModifiers = {}
  ): XPCalculationResult {
    const breakdown: string[] = [];
    let base = 0;
    let bonus = 0;
    let multiplier = 1;

    // Base XP by tier
    switch (tier) {
      case 1:
        base = 100;
        break;
      case 2:
        base = 200;
        break;
      case 3:
        base = 300;
        break;
      case 4:
        base = 500;
        break;
      case 5:
        base = 750;
        break;
      default:
        base = 100;
    }

    // Speed bonus
    const expectedDays = tier * 7;
    if (daysToComplete < expectedDays) {
      bonus += Math.floor((expectedDays - daysToComplete) * 5);
      breakdown.push(`Completed ${expectedDays - daysToComplete} days early: +${bonus} XP`);
    }

    // Perfect completion
    if (perfectCompletion) {
      bonus += base * 0.25;
      breakdown.push(`Perfect completion: +${Math.floor(base * 0.25)} XP`);
    }

    // Apply modifiers
    const mods = calculateModifiers(modifiers);
    multiplier = mods.multiplier;
    breakdown.push(...mods.breakdown);

    const total = Math.floor((base + bonus) * multiplier);

    return { base, bonus, multiplier, total, breakdown };
  }
};

/**
 * Helper function to calculate modifiers
 */
function calculateModifiers(modifiers: BaseModifiers): {
  multiplier: number;
  breakdown: string[];
} {
  let multiplier = 1;
  const breakdown: string[] = [];

  // Time of day bonus
  if (modifiers.timeOfDay) {
    const hour = modifiers.timeOfDay.getHours();
    if (hour < 9) {
      multiplier *= XP_CONFIG.MULTIPLIERS.MORNING_PRACTICE;
      breakdown.push('Morning practice: 1.5x');
    } else if (hour >= 22) {
      multiplier *= XP_CONFIG.MULTIPLIERS.EVENING_PRACTICE;
      breakdown.push('Evening practice: 1.2x');
    }
  }

  // Weekend bonus
  if (modifiers.isWeekend) {
    multiplier *= XP_CONFIG.MULTIPLIERS.WEEKEND_WARRIOR;
    breakdown.push('Weekend warrior: 1.3x');
  }

  // Group session
  if (modifiers.isGroupSession) {
    multiplier *= XP_CONFIG.MULTIPLIERS.GROUP_SESSION;
    breakdown.push('Group session: 1.4x');
  }

  // First time bonus (if not already applied)
  if (modifiers.isFirstTime && multiplier === 1) {
    multiplier *= XP_CONFIG.MULTIPLIERS.FIRST_TIME;
    breakdown.push('First time bonus: 1.5x');
  }

  return { multiplier, breakdown };
}