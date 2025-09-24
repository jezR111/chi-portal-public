export interface Level {
  level: number;
  title: string;
  minXP: number;
  maxXP: number;
  color: string;
  icon: string;
}

export const LEVELS: Level[] = [
  { level: 1, title: 'Seeker', minXP: 0, maxXP: 99, color: 'from-purple-600 to-purple-500', icon: '🌱' },
  { level: 2, title: 'Explorer', minXP: 100, maxXP: 249, color: 'from-blue-600 to-blue-500', icon: '🔭' },
  { level: 3, title: 'Practitioner', minXP: 250, maxXP: 499, color: 'from-green-600 to-green-500', icon: '⚡' },
  { level: 4, title: 'Adept', minXP: 500, maxXP: 999, color: 'from-amber-600 to-amber-500', icon: '✨' },
  { level: 5, title: 'Master', minXP: 1000, maxXP: Infinity, color: 'from-purple-600 via-pink-500 to-amber-500', icon: '👑' }
];

export function calculateLevel(xp: number): Level {
  return LEVELS.find(level => xp >= level.minXP && xp <= level.maxXP) || LEVELS[0];
}

export function calculateProgress(xp: number): number {
  const level = calculateLevel(xp);
  if (level.level === 5) return 100; // Max level
  
  const xpInLevel = xp - level.minXP;
  const xpNeeded = level.maxXP - level.minXP + 1;
  return Math.floor((xpInLevel / xpNeeded) * 100);
}

export function getNextLevel(currentXP: number): Level | null {
  const currentLevel = calculateLevel(currentXP);
  if (currentLevel.level === 5) return null;
  return LEVELS[currentLevel.level]; // Returns next level (index = level because 0-indexed)
}

export function xpToNextLevel(currentXP: number): number {
  const level = calculateLevel(currentXP);
  if (level.level === 5) return 0;
  return level.maxXP + 1 - currentXP;
}