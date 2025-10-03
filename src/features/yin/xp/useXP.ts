// src/features/yin/xp/useXP.ts
// Version: 7.0.0 - Classic state-based hydration fix

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

/**
 * useXP — A robust, hydration-safe hook to get user XP data.
 * It ensures client-side data is loaded before allowing interactions.
 */
export function useXP(): UseXPReturn {
  // Start with a safe default and a loading state.
  const [stats, setStats] = useState<UserStats>(SAFE_DEFAULT);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // This effect runs only on the client, after the component has mounted.
    
    // 1. Get the initial, real state from the service which reads from localStorage.
    const initialStats = xpService.getUserStats();
    setStats(initialStats);
    
    // 2. Mark loading as complete now that we have the hydrated state.
    setIsLoading(false);

    // 3. Subscribe to any future updates from the service.
    const unsubscribe = xpService.subscribe((newStats) => {
      setStats(newStats);
    });

    // 4. Clean up the subscription when the component unmounts.
    return () => unsubscribe();
  }, []); // The empty dependency array ensures this effect runs only once.

  // Memoize the API functions so they have a stable identity across re-renders.
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

    const canAfford = (cost: number): boolean => xpService.canAfford(cost);
    const isUnlocked = (type: 'paths' | 'chapters' | 'features', id: string): boolean =>
      xpService.isUnlocked(type, id);

    return { addXP, spendXP, canAfford, isUnlocked };
  }, []);

  return {
    ...stats,
    ...api,
    isLoading,
    stats: stats, // Also return the full stats object
  };
}

