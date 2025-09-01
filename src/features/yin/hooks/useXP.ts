// src/features/yin/hooks/useXP.ts

import { useCallback } from 'react';
import { MeditationStats } from '../components/meditation/MeditationTimer';
import { xpService } from '../services/xpService';
import { useUserProgress } from './useUserProgress';

interface XPGain {
  amount: number;
  source: string;
  breakdown: {
    base: number;
    bonus: number;
    multiplier: number;
    patterns: string[];
  };
}

export const useXP = (userId: string) => {
  const { addXP, progress } = useUserProgress(userId);
  const xp = xpService.getInstance();
  
  const calculateMeditationXP = useCallback(async (stats: MeditationStats): Promise<number> => {
    const activity = {
      type: 'meditation' as const,
      userId,
      timestamp: stats.timestamp,
      duration: stats.duration * 1000, // Convert to ms
      data: {
        streakDays: progress.streakDays || 0,
        isFirstTime: false, // Would check user's meditation history
        recentMeditations: 5 // Would calculate from history
      },
      insights: []
    };
    
    const result = xp.calculateSessionXP(activity);
    
    // Add XP to user progress
    await addXP(result.total, 'meditation');
    
    return result.total;
  }, [userId, progress, addXP]);
  
  const calculateLessonXP = useCallback(async (
    lessonId: string,
    comprehensionRating: number,
    timeSpent: number,
    insightCount: number
  ): Promise<XPGain> => {
    const activity = {
      type: 'lesson' as const,
      userId,
      timestamp: new Date(),
      duration: timeSpent,
      data: {
        comprehensionRating,
        streakDays: progress.streakDays || 0
      },
      insights: new Array(insightCount).fill({})
    };
    
    const result = xp.calculateSessionXP(activity);
    
    // Add XP to user progress
    await addXP(result.total, `lesson_${lessonId}`);
    
    return {
      amount: result.total,
      source: 'lesson',
      breakdown: result.breakdown
    };
  }, [userId, progress, addXP]);
  
  const calculateInsightXP = useCallback(async (
    insightType: string,
    tags: string[]
  ): Promise<number> => {
    let baseXP = 15;
    
    // Bonus for breakthrough insights
    if (insightType === 'breakthrough') {
      baseXP = 50;
    }
    
    // Bonus for well-tagged insights
    if (tags.length >= 3) {
      baseXP += 10;
    }
    
    await addXP(baseXP, `insight_${insightType}`);
    
    return baseXP;
  }, [addXP]);
  
  const calculateStreakXP = useCallback(async (
    streakDays: number
  ): Promise<number> => {
    const milestones = {
      3: 50,
      7: 150,
      14: 350,
      21: 600,
      30: 1000,
      60: 2500,
      90: 5000
    };
    
    let xpReward = 0;
    
    for (const [days, reward] of Object.entries(milestones)) {
      if (streakDays === parseInt(days)) {
        xpReward = reward;
        break;
      }
    }
    
    if (xpReward > 0) {
      await addXP(xpReward, `streak_${streakDays}_days`);
    }
    
    return xpReward;
  }, [addXP]);
  
  const checkPatternXP = useCallback(async (): Promise<number> => {
    // Check various patterns and award XP
    let totalPatternXP = 0;
    
    // This would check user's activity patterns
    // For now, returning 0
    
    return totalPatternXP;
  }, []);
  
  return {
    calculateMeditationXP,
    calculateLessonXP,
    calculateInsightXP,
    calculateStreakXP,
    checkPatternXP
  };
};