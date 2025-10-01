// src/features/yin/utils/xpCalculations.ts

/**
 * XP Calculation Utilities
 * Handles level calculations, XP requirements, and progress tracking
 */

// XP required for each level (cumulative)
// Uses a progressive curve: each level requires more XP than the last
const XP_PER_LEVEL = [
  0,      // Level 0 (doesn't exist)
  0,      // Level 1 - Starting level
  100,    // Level 2
  250,    // Level 3
  450,    // Level 4
  700,    // Level 5
  1000,   // Level 6
  1400,   // Level 7
  1900,   // Level 8
  2500,   // Level 9
  3200,   // Level 10
  4000,   // Level 11
  4900,   // Level 12
  5900,   // Level 13
  7000,   // Level 14
  8200,   // Level 15
  9500,   // Level 16
  10900,  // Level 17
  12400,  // Level 18
  14000,  // Level 19
  15700,  // Level 20
  17500,  // Level 21
  19400,  // Level 22
  21400,  // Level 23
  23500,  // Level 24
  25700,  // Level 25
  28000,  // Level 26
  30400,  // Level 27
  32900,  // Level 28
  35500,  // Level 29
  38200,  // Level 30
];

// Generate XP requirements for levels beyond 30
function getXPForLevel(level: number): number {
  if (level <= 0) return 0;
  if (level < XP_PER_LEVEL.length) {
    return XP_PER_LEVEL[level];
  }
  
  // For levels beyond 30, use a formula
  // Each level requires previousLevel + (level * 150)
  let xp = XP_PER_LEVEL[XP_PER_LEVEL.length - 1];
  for (let i = XP_PER_LEVEL.length; i <= level; i++) {
    xp += i * 150;
  }
  return xp;
}

/**
 * Calculate the user's level based on their total XP
 */
export function calculateLevel(totalXP: number): number {
  // Handle edge cases
  if (totalXP <= 0) return 1;
  
  // Check against pre-defined levels first
  for (let i = 1; i < XP_PER_LEVEL.length; i++) {
    if (totalXP < XP_PER_LEVEL[i]) {
      return i - 1;
    }
  }
  
  // For XP beyond level 30, calculate dynamically
  let level = XP_PER_LEVEL.length - 1;
  let requiredXP = XP_PER_LEVEL[XP_PER_LEVEL.length - 1];
  
  while (totalXP >= requiredXP) {
    level++;
    requiredXP += level * 150;
  }
  
  return level - 1;
}

/**
 * Calculate progress to next level as a percentage
 */
export function calculateLevelProgress(totalXP: number): number {
  const currentLevel = calculateLevel(totalXP);
  const currentLevelXP = getXPForLevel(currentLevel);
  const nextLevelXP = getXPForLevel(currentLevel + 1);
  
  if (nextLevelXP === currentLevelXP) return 100;
  
  const progressXP = totalXP - currentLevelXP;
  const requiredXP = nextLevelXP - currentLevelXP;
  
  return Math.floor((progressXP / requiredXP) * 100);
}

/**
 * Get XP needed to reach the next level
 */
export function getXPToNextLevel(totalXP: number): number {
  const currentLevel = calculateLevel(totalXP);
  const nextLevelXP = getXPForLevel(currentLevel + 1);
  
  return Math.max(0, nextLevelXP - totalXP);
}

/**
 * Get level information with all details
 */
export interface LevelInfo {
  level: number;
  totalXP: number;
  currentLevelXP: number;
  nextLevelXP: number;
  progressXP: number;
  progressPercent: number;
  xpToNextLevel: number;
}

export function getLevelInfo(totalXP: number): LevelInfo {
  const level = calculateLevel(totalXP);
  const currentLevelXP = getXPForLevel(level);
  const nextLevelXP = getXPForLevel(level + 1);
  const progressXP = totalXP - currentLevelXP;
  const progressPercent = calculateLevelProgress(totalXP);
  const xpToNextLevel = getXPToNextLevel(totalXP);
  
  return {
    level,
    totalXP,
    currentLevelXP,
    nextLevelXP,
    progressXP,
    progressPercent,
    xpToNextLevel
  };
}

/**
 * Format XP display with abbreviations for large numbers
 */
export function formatXP(xp: number): string {
  if (xp < 1000) return xp.toString();
  if (xp < 10000) return `${(xp / 1000).toFixed(1)}k`;
  if (xp < 1000000) return `${Math.floor(xp / 1000)}k`;
  return `${(xp / 1000000).toFixed(1)}M`;
}

/**
 * Calculate bonus XP based on streak
 */
export function calculateStreakBonus(baseXP: number, streakDays: number): number {
  if (streakDays <= 0) return 0;
  
  // 5% bonus per streak day, max 50% bonus at 10 days
  const bonusPercent = Math.min(streakDays * 5, 50);
  return Math.floor(baseXP * (bonusPercent / 100));
}

/**
 * Calculate time-based XP multiplier
 */
export function getTimeMultiplier(): number {
  const hour = new Date().getHours();
  
  // Morning boost (6am - 9am): 1.25x
  if (hour >= 6 && hour < 9) return 1.25;
  
  // Evening boost (8pm - 11pm): 1.15x
  if (hour >= 20 && hour < 23) return 1.15;
  
  // Weekend boost
  const day = new Date().getDay();
  if (day === 0 || day === 6) return 1.2;
  
  return 1.0;
}

/**
 * Level titles for display
 */
export const LEVEL_TITLES: Record<number, string> = {
  1: 'Seeker',
  5: 'Explorer',
  10: 'Wanderer',
  15: 'Pathfinder',
  20: 'Sage',
  25: 'Master',
  30: 'Grandmaster',
  40: 'Enlightened',
  50: 'Transcendent'
};

export function getLevelTitle(level: number): string {
  const titles = Object.keys(LEVEL_TITLES)
    .map(Number)
    .sort((a, b) => b - a);
  
  for (const titleLevel of titles) {
    if (level >= titleLevel) {
      return LEVEL_TITLES[titleLevel];
    }
  }
  
  return 'Initiate';
}