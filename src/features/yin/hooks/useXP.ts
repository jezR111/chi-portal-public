// src/features/yin/hooks/useXP.ts

import { useCallback } from 'react';
import { MeditationStats } from '../components/meditation/MeditationTimer';
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

interface Activity {
  type: 'meditation' | 'lesson' | 'insight' | 'quest';
  userId?: string;
  timestamp: Date;
  duration: number;
  data: {
    streakDays?: number;
    isFirstTime?: boolean;
    recentMeditations?: number;
    comprehensionRating?: number;
  };
  insights: any[];
}

// XP Service logic embedded directly (since xpService is causing issues)
class XPCalculator {
  calculateSessionXP(activity: Activity): { total: number; breakdown: any } {
    let base = 0;
    let bonus = 0;
    let multiplier = 1;
    const patterns: string[] = [];

    // Base XP by activity type
    switch (activity.type) {
      case 'meditation':
        base = 10;
        // Duration bonus: +2 XP per 5 minutes
        bonus += Math.floor(activity.duration / (5 * 60 * 1000)) * 2;
        
        // Streak bonus
        if (activity.data.streakDays && activity.data.streakDays > 0) {
          multiplier += 0.1 * Math.min(activity.data.streakDays, 10); // Max 2x multiplier
          patterns.push(`streak_${activity.data.streakDays}`);
        }
        
        // First time bonus
        if (activity.data.isFirstTime) {
          bonus += 20;
          patterns.push('first_meditation');
        }
        break;
        
      case 'lesson':
        base = 15;
        // Comprehension bonus
        if (activity.data.comprehensionRating) {
          bonus += activity.data.comprehensionRating * 2;
        }
        // Time spent bonus
        bonus += Math.floor(activity.duration / (10 * 60 * 1000)) * 5;
        break;
        
      case 'quest':
        base = 10;
        break;
        
      case 'insight':
        base = 15;
        // Insight count bonus
        bonus += activity.insights.length * 5;
        break;
    }

    const total = Math.floor((base + bonus) * multiplier);
    
    return {
      total,
      breakdown: {
        base,
        bonus,
        multiplier,
        patterns
      }
    };
  }
}

const xpCalculator = new XPCalculator();

export const useXP = (userId: string = 'default') => {
  const { progress, earnXP } = useUserProgress();
  
  const calculateMeditationXP = useCallback(async (stats: MeditationStats): Promise<number> => {
    const activity: Activity = {
      type: 'meditation',
      userId,
      timestamp: stats.timestamp || new Date(),
      duration: stats.duration * 1000, // Convert to ms
      data: {
        streakDays: progress.dailyStreak || 0,
        isFirstTime: progress.totalMeditationMinutes === 0, // Check if first meditation
        recentMeditations: 5 // Would calculate from history
      },
      insights: []
    };
    
    const result = xpCalculator.calculateSessionXP(activity);
    
    // Add XP to user progress
    earnXP(result.total, 'meditation');
    
    return result.total;
  }, [userId, progress, earnXP]);
  
  const calculateLessonXP = useCallback(async (
    lessonId: string,
    comprehensionRating: number,
    timeSpent: number,
    insightCount: number
  ): Promise<XPGain> => {
    const activity: Activity = {
      type: 'lesson',
      userId,
      timestamp: new Date(),
      duration: timeSpent,
      data: {
        comprehensionRating,
        streakDays: progress.dailyStreak || 0
      },
      insights: new Array(insightCount).fill({})
    };
    
    const result = xpCalculator.calculateSessionXP(activity);
    
    // Add XP to user progress
    earnXP(result.total, `lesson_${lessonId}`);
    
    return {
      amount: result.total,
      source: 'lesson',
      breakdown: result.breakdown
    };
  }, [userId, progress, earnXP]);
  
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
    
    earnXP(baseXP, `insight_${insightType}`);
    
    return baseXP;
  }, [earnXP]);
  
  const calculateStreakXP = useCallback(async (
    streakDays: number
  ): Promise<number> => {
    const milestones: Record<number, number> = {
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
      earnXP(xpReward, `streak_${streakDays}_days`);
    }
    
    return xpReward;
  }, [earnXP]);
  
  const checkPatternXP = useCallback(async (): Promise<number> => {
    // Check various patterns and award XP
    let totalPatternXP = 0;
    
    // Morning routine pattern (meditation before 9am)
    const now = new Date();
    if (now.getHours() < 9) {
      totalPatternXP += 5;
      earnXP(5, 'morning_routine');
    }
    
    // Consistency pattern (multiple days in a row)
    if (progress.dailyStreak >= 3) {
      totalPatternXP += 10;
      earnXP(10, 'consistency_bonus');
    }
    
    // Deep practice pattern (long sessions)
    if (progress.totalMeditationMinutes > 30) {
      totalPatternXP += 15;
      earnXP(15, 'deep_practice');
    }
    
    return totalPatternXP;
  }, [progress, earnXP]);

  // Additional helper methods for quest system
  const addXP = useCallback((amount: number, reason: string = 'quest') => {
    earnXP(amount, reason);
  }, [earnXP]);

  const spendXP = useCallback((amount: number): boolean => {
    // This would need to be implemented in useUserProgress
    // For now, checking if user has enough XP
    return progress.availableXP >= amount;
  }, [progress.availableXP]);
  
  return {
    // All original methods
    calculateMeditationXP,
    calculateLessonXP,
    calculateInsightXP,
    calculateStreakXP,
    checkPatternXP,
    
    // Additional methods for quest system
    currentXP: progress.availableXP,
    totalXP: progress.totalXP,
    addXP,
    spendXP
  };
};