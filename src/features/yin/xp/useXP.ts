// src/features/yin/xp/useXP.ts
// Version: 12.1.0 - Fixed build error by correcting import path

import { useMemo, useSyncExternalStore } from 'react'; // THE FIX: Import directly from React
import type { XPCalculationResult } from './XpCalculator-index';
import { xpService, type UserStats, type XPBreakdown } from './xpService';

// A stable default state used for server-side rendering and initial hydration.
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

export interface UseXPReturn extends UserStats {
  // All state properties from UserStats are included directly.

  // Specialized Actions from the service
  addLessonXP: (lessonId: string, completionTime: number, comprehensionScore?: number) => XPCalculationResult;
  addChapterXP: (chapterId: string, lessonsCompleted: number, perfectCompletion: boolean) => XPCalculationResult;
  addQuestXP: (questType: 'daily' | 'weekly' | 'special', questId: string, completionData?: any) => XPCalculationResult;
  addMeditationXP: (duration: number, type?: 'guided' | 'silent' | 'breathwork') => XPCalculationResult;
  addMovementXP: (exercises: string[], duration: number, intensity?: 'low' | 'medium' | 'high') => XPCalculationResult;
  addInsightXP: (insights: Array<{ text: string; isBreakthrough?: boolean }>) => XPCalculationResult;
  addJournalXP: (wordCount: number, mood?: string, includesReflection?: boolean) => XPCalculationResult;
  addChallengeXP: (tier: number, challengeId: string, daysToComplete: number, perfectCompletion?: boolean) => XPCalculationResult;

  // Generic Actions
  addXP: (amount: number, source: keyof XPBreakdown, description?: string) => void;
  spendXP: (amount: number, unlockType: 'path' | 'chapter' | 'feature', unlockId: string) => boolean;

  // Utilities
  canAfford: (cost: number) => boolean;
  isUnlocked: (type: 'paths' | 'chapters' | 'features', id: string) => boolean;

  // Dev Tools
  addTestXP: (amount?: number) => void;
}

/**
 * The definitive, stable hook for the XP system.
 * It provides a live, synchronized snapshot of the user's stats
 * and exposes the full API of the xpService directly to components.
 */
export function useXP(): UseXPReturn {
  // Correctly wrap the subscription call in an arrow function
  // to preserve the `this` context of xpService.
  const subscribe = (callback: () => void) => xpService.subscribe(callback);

  // The snapshot function now directly returns the result from the service.
  // The service itself handles caching to ensure object stability.
  const getSnapshot = () => xpService.getUserStats();

  // Use the synchronized state from the store.
  const stats = useSyncExternalStore(subscribe, getSnapshot, () => SAFE_DEFAULT);

  // The full API is memoized to prevent unnecessary re-renders in child components.
  const api = useMemo(() => ({
    // Specialized add actions
    addLessonXP: xpService.addLessonXP.bind(xpService),
    addChapterXP: xpService.addChapterXP.bind(xpService),
    addQuestXP: xpService.addQuestXP.bind(xpService),
    addMeditationXP: xpService.addMeditationXP.bind(xpService),
    addMovementXP: xpService.addMovementXP.bind(xpService),
    addInsightXP: xpService.addInsightXP.bind(xpService),
    addJournalXP: xpService.addJournalXP.bind(xpService),
    addChallengeXP: xpService.addChallengeXP.bind(xpService),

    // Generic actions
    addXP: xpService.addXP.bind(xpService),
    spendXP: xpService.spendXP.bind(xpService),

    // Utilities
    canAfford: xpService.canAfford.bind(xpService),
    isUnlocked: xpService.isUnlocked.bind(xpService),

    // Dev Tools
    addTestXP: (amount: number = 500) => {
      xpService.addXP(amount, 'other', 'Developer Test XP');
    },
  }), []);

  return {
    ...stats,
    ...api,
  };
}

