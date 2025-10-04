// src/features/yin/xp/useXP.ts
// Version: 7.3.0 - Added addTestXP for development

import { useEffect, useMemo, useState } from 'react';
import { xpService, type UserStats } from './xpService';

export interface UseXPReturn {
  // Current state
  currentXP: number;
  todayXP: number;
  level: number;
  levelTitle: string;
  levelIcon: string;
  levelColor: string;
  levelProgress: number;
  xpToNextLevel: number;
  streak: number;

  // Actions
  addXP: (amount: number, source: string, description?: string) => void;
  spendXP: (
    amount: number,
    unlockType: 'path' | 'chapter' | 'feature',
    unlockId: string
  ) => Promise<boolean>;

  // Utilities
  canAfford: (cost: number) => boolean;
  isUnlocked: (type: 'paths' | 'chapters' | 'features', id: string) => boolean;

  // Full stats & Loading State
  stats: UserStats;
  isLoading: boolean;
  
  // Dev Tools
  addTestXP: (amount?: number) => void;
}

const SAFE_DEFAULT: UserStats = {
  level: 1,
  levelTitle: 'Seeker',
  levelIcon: '🌱',
  levelColor: 'from-gray-600 to-gray-500',
  currentXP: 0,
  todayXP: 0,
  levelProgress: 0,
  xpToNextLevel: 100,
  streak: 0,
  weeklyXP: Array(7).fill(0),
  monthlyAverage: 0,
  breakdown: {
    quests: 0, challenges: 0, lessons: 0, meditation: 0,
    insights: 0, journal: 0, movement: 0, other: 0,
  },
  totalUnlocked: { paths: 1, chapters: 0, features: 0 },
};

function sanitizeStats(stats: UserStats | null | undefined): UserStats {
  const s = stats || SAFE_DEFAULT;
  return {
    ...SAFE_DEFAULT,
    ...s,
    currentXP: typeof s.currentXP === 'number' ? s.currentXP : SAFE_DEFAULT.currentXP,
    todayXP: typeof s.todayXP === 'number' ? s.todayXP : SAFE_DEFAULT.todayXP,
    level: typeof s.level === 'number' ? s.level : SAFE_DEFAULT.level,
    levelProgress: typeof s.levelProgress === 'number' ? s.levelProgress : SAFE_DEFAULT.levelProgress,
    xpToNextLevel: typeof s.xpToNextLevel === 'number' ? s.xpToNextLevel : SAFE_DEFAULT.xpToNextLevel,
    streak: typeof s.streak === 'number' ? s.streak : SAFE_DEFAULT.streak,
  };
}

export function useXP(): UseXPReturn {
  const [stats, setStats] = useState<UserStats>(SAFE_DEFAULT);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initialStats = sanitizeStats(xpService.getUserStats());
    setStats(initialStats);
    setIsLoading(false);

    const unsubscribe = xpService.subscribe((newStats) => {
      setStats(sanitizeStats(newStats));
    });

    return () => unsubscribe();
  }, []);

  const canAfford = (cost: number): boolean => {
    if (isLoading) return false;
    return stats.currentXP >= cost;
  };

  const api = useMemo(() => {
    const addXP = (amount: number, source: string, description?: string) => {
      const sourceMap: Record<string, any> = {
        quest: 'quests', challenge: 'challenges', lesson: 'lessons',
        meditation: 'meditation', insight: 'insights', journal: 'journal',
        movement: 'movement',
      };
      const category = sourceMap[source] || 'other';
      xpService.addXP(amount, category, description);
    };

    const spendXP = (
      amount: number,
      unlockType: 'path' | 'chapter' | 'feature',
      unlockId: string
    ): Promise<boolean> => {
      return Promise.resolve(xpService.spendXP(amount, unlockType, unlockId));
    };

    const isUnlocked = (type: 'paths' | 'chapters' | 'features', id: string): boolean =>
      xpService.isUnlocked(type, id);

    // ** New test function added here **
    const addTestXP = (amount: number = 500) => {
        xpService.addXP(amount, 'other', 'Developer Test XP');
    };

    return { addXP, spendXP, isUnlocked, addTestXP };
  }, []);

  return {
    currentXP: stats.currentXP,
    todayXP: stats.todayXP,
    level: stats.level,
    levelTitle: stats.levelTitle,
    levelIcon: stats.levelIcon,
    levelColor: stats.levelColor,
    levelProgress: stats.levelProgress,
    xpToNextLevel: stats.xpToNextLevel,
    streak: stats.streak,
    ...api,
    canAfford,
    isLoading,
    stats: stats,
  };
}

