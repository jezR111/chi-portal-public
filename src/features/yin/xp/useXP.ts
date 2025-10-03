// src/features/yin/xp/useXP.ts
// Version: 4.0.0 - Always ready from first render

import { useEffect, useState } from 'react';
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
  spendXP: (amount: number, unlockType: 'path' | 'chapter' | 'feature', unlockId: string) => Promise<boolean>;
  
  // Utilities
  canAfford: (cost: number) => boolean;
  isUnlocked: (type: 'paths' | 'chapters' | 'features', id: string) => boolean;
  
  // Full stats - NEVER NULL
  stats: UserStats;
}

// Get initial data synchronously
const getInitialStats = (): UserStats => {
  if (typeof window !== 'undefined') {
    return xpService.getUserStats();
  }
  // Server-side default
  return {
    level: 1,
    levelTitle: 'Seeker',
    levelIcon: '🌱',
    levelColor: 'from-gray-600 to-gray-500',
    currentXP: 300,
    todayXP: 0,
    levelProgress: 0,
    xpToNextLevel: 100,
    streak: 0,
    weeklyXP: [],
    monthlyAverage: 0,
    breakdown: {
      quests: 0,
      challenges: 0,
      lessons: 0,
      meditation: 0,
      insights: 0,
      journal: 0,
      movement: 0,
      other: 0
    },
    totalUnlocked: {
      paths: 0,
      chapters: 0,
      features: 0
    }
  };
};

export function useXP(): UseXPReturn {
  // Initialize with actual data immediately
  const [stats, setStats] = useState<UserStats>(getInitialStats);
  
  useEffect(() => {
    // Ensure we have the latest data
    const currentStats = xpService.getUserStats();
    setStats(currentStats);
    
    // Subscribe to updates
    const unsubscribe = xpService.subscribe((newStats) => {
      setStats(newStats);
    });
    
    return unsubscribe;
  }, []);
  
  const addXP = (amount: number, source: string, description?: string) => {
    const sourceMap: Record<string, any> = {
      'quest': 'quests',
      'challenge': 'challenges',
      'lesson': 'lessons',
      'meditation': 'meditation',
      'insight': 'insights',
      'journal': 'journal',
      'movement': 'movement',
    };
    
    const category = sourceMap[source] || 'other';
    xpService.addXP(amount, category, description);
  };
  
  const spendXP = async (
    amount: number, 
    unlockType: 'path' | 'chapter' | 'feature', 
    unlockId: string
  ): Promise<boolean> => {
    return xpService.spendXP(amount, unlockType, unlockId);
  };
  
  const canAfford = (cost: number): boolean => {
    return xpService.canAfford(cost);
  };
  
  const isUnlocked = (type: 'paths' | 'chapters' | 'features', id: string): boolean => {
    return xpService.isUnlocked(type, id);
  };
  
  // ALWAYS return valid data - stats is never null
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
    addXP,
    spendXP,
    canAfford,
    isUnlocked,
    stats // Never null!
  };
}