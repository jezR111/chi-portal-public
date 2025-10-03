// src/features/yin/hooks/useMeditation.ts

import { useCallback, useEffect, useState } from 'react';
import { MeditationStats } from '../components/meditation/MeditationTimer';
import { xpService } from '../xp/xpService';

interface MeditationSession {
  id: string;
  userId: string;
  stats: MeditationStats;
  lessonId?: string;
  xpEarned: number;
  timestamp: Date;
}

export const useMeditation = (userId?: string) => {
  const [sessions, setSessions] = useState<MeditationSession[]>([]);
  const [streakDays, setStreakDays] = useState(0);
  const [totalMinutes, setTotalMinutes] = useState(0);
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    if (userId) {
      loadMeditationData();
    }
  }, [userId]);
  
  const loadMeditationData = async () => {
    try {
      setLoading(true);
      // Load from localStorage or API
      const stored = localStorage.getItem(`meditation_${userId}`);
      if (stored) {
        const data = JSON.parse(stored);
        setSessions(data.sessions || []);
        setStreakDays(calculateStreak(data.sessions));
        setTotalMinutes(calculateTotalMinutes(data.sessions));
      }
    } catch (error) {
      console.error('Error loading meditation data:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const recordSession = useCallback(async (stats: MeditationStats, lessonId?: string) => {
    if (!userId) return;
    
    // Calculate XP
    const xpActivity = {
      type: 'meditation' as const,
      userId,
      timestamp: new Date(),
      duration: stats.duration * 1000, // Convert to ms
      data: {
        streakDays: streakDays + 1,
        isFirstTime: sessions.length === 0,
        recentMeditations: getRecentMeditationCount()
      }
    };
    
    const xpResult = xpService.getInstance().calculateSessionXP(xpActivity);
    
    const session: MeditationSession = {
      id: `med_${Date.now()}`,
      userId,
      stats,
      lessonId,
      xpEarned: xpResult.total,
      timestamp: new Date()
    };
    
    const updatedSessions = [session, ...sessions];
    setSessions(updatedSessions);
    
    // Save to localStorage
    localStorage.setItem(`meditation_${userId}`, JSON.stringify({
      sessions: updatedSessions,
      lastUpdated: new Date()
    }));
    
    // Update stats
    setStreakDays(calculateStreak(updatedSessions));
    setTotalMinutes(calculateTotalMinutes(updatedSessions));
    
    return xpResult.total;
  }, [userId, sessions, streakDays]);
  
  const getRecentMeditationCount = (): number => {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    return sessions.filter(s => 
      new Date(s.timestamp) > sevenDaysAgo
    ).length;
  };
  
  const calculateStreak = (sessions: MeditationSession[]): number => {
    if (sessions.length === 0) return 0;
    
    const sortedSessions = [...sessions].sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
    
    let streak = 0;
    let currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    
    for (const session of sortedSessions) {
      const sessionDate = new Date(session.timestamp);
      sessionDate.setHours(0, 0, 0, 0);
      
      const diffDays = Math.floor((currentDate.getTime() - sessionDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (diffDays <= 1) {
        streak++;
        currentDate = sessionDate;
      } else {
        break;
      }
    }
    
    return streak;
  };
  
  const calculateTotalMinutes = (sessions: MeditationSession[]): number => {
    return sessions.reduce((total, session) => 
      total + Math.floor(session.stats.duration / 60), 0
    );
  };
  
  return {
    sessions,
    streakDays,
    totalMinutes,
    loading,
    recordSession,
    getRecentMeditationCount
  };
};