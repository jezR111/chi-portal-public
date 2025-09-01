// src/features/yin/hooks/useInsights.ts

import { useCallback, useEffect, useState } from 'react';
import { insightService } from '../services/insightService';
import { InsightData, InsightStats } from '../types/insight.types';

export const useInsights = (userId?: string) => {
  const [insights, setInsights] = useState<InsightData[]>([]);
  const [stats, setStats] = useState<InsightStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  useEffect(() => {
    if (userId) {
      loadInsights();
    }
  }, [userId]);
  
  const loadInsights = async () => {
    try {
      setLoading(true);
      const data = await insightService.getUserInsights(userId!);
      setInsights(data.insights);
      const userStats = await insightService.getInsightStats(userId!);
      setStats(userStats);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };
  
  const saveInsight = useCallback(async (insight: InsightData) => {
    try {
      const saved = await insightService.saveInsight(userId!, insight);
      setInsights(prev => [saved, ...prev]);
      
      // Update stats
      if (stats) {
        setStats({
          ...stats,
          totalInsights: stats.totalInsights + 1,
          todayInsights: stats.todayInsights + 1,
          lastInsightDate: new Date()
        });
      }
      
      // Trigger XP calculation
      await insightService.calculateInsightXP(userId!, saved);
      
      return saved;
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  }, [userId, stats]);
  
  const deleteInsight = useCallback(async (insightId: string) => {
    try {
      await insightService.deleteInsight(userId!, insightId);
      setInsights(prev => prev.filter(i => i.id !== insightId));
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  }, [userId]);
  
  const getInsightsByLesson = useCallback((lessonId: string) => {
    return insights.filter(i => i.lessonContext.lessonId === lessonId);
  }, [insights]);
  
  const getInsightsByTag = useCallback((tag: string) => {
    return insights.filter(i => i.tags.includes(tag));
  }, [insights]);
  
  return {
    insights,
    stats,
    loading,
    error,
    saveInsight,
    deleteInsight,
    getInsightsByLesson,
    getInsightsByTag,
    refresh: loadInsights
  };
};