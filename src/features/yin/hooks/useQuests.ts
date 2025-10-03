// src/features/yin/hooks/useQuests.ts

import { useCallback, useEffect, useState } from 'react';
import { challengesData, questsData } from '../data/questsData';
import { QuestState } from '../types/quest.types';
import { useXP } from '../xp/useXP';

export function useQuests() {
  const [isQuestSidebarOpen, setIsQuestSidebarOpen] = useState(false);
  const [questState, setQuestState] = useState<QuestState>({
    completedToday: [],
    totalCompleted: 0,
    currentStreak: 0,
    lastCompletedDate: null
  });

  // Use the centralized XP system
  const { 
    currentXP,
    streak,
    addQuestXP,
    canAfford,
    isUnlocked
  } = useXP();

  // Load quest state from localStorage
  useEffect(() => {
    const loadState = () => {
      const saved = localStorage.getItem('questState');
      if (saved) {
        const state = JSON.parse(saved);
        const today = new Date().toDateString();
        const lastDate = state.lastCompletedDate ? new Date(state.lastCompletedDate).toDateString() : null;
        
        // Reset daily quests if it's a new day
        if (lastDate !== today) {
          setQuestState({
            ...state,
            completedToday: []
          });
        } else {
          setQuestState(state);
        }
      }
    };
    
    loadState();
  }, []);

  // Save quest state to localStorage
  useEffect(() => {
    if (questState.totalCompleted > 0) {
      localStorage.setItem('questState', JSON.stringify(questState));
    }
  }, [questState]);

  // Complete a quest using new XP system
  const completeQuest = useCallback(async (questId: string, questData: {
    type?: 'daily' | 'weekly' | 'special';
    xpReward?: number;
    timeSpent?: number;
    quality?: number;
  } = {}) => {
    const today = new Date();
    
    // Update quest state
    setQuestState(prev => {
      const isFirstToday = prev.completedToday.length === 0;
      const yesterday = prev.lastCompletedDate ? new Date(prev.lastCompletedDate) : null;
      const isConsecutiveDay = yesterday && 
        (today.getTime() - yesterday.getTime()) < (2 * 24 * 60 * 60 * 1000);
      
      return {
        completedToday: [...prev.completedToday, questId],
        totalCompleted: prev.totalCompleted + 1,
        currentStreak: isFirstToday && isConsecutiveDay ? prev.currentStreak + 1 : 
                       isFirstToday && !isConsecutiveDay ? 1 : 
                       prev.currentStreak,
        lastCompletedDate: today.toISOString()
      };
    });
    
    // Award XP using the new centralized system
    const quest = questsData.find(q => q.id === questId);
    if (quest) {
      const questType = questData.type || (quest.category === 'daily' ? 'daily' : 'weekly');
      const isFirstTime = !questState.completedToday.includes(questId);
      
      const result = await addQuestXP(
        questType,
        questId,
        {
          timeSpent: questData.timeSpent || 5,
          quality: questData.quality || 5,
          firstTime: isFirstTime
        }
      );
      
      return result;
    }
  }, [questState.completedToday, addQuestXP]);

  // Check if a quest is completed today
  const isQuestCompletedToday = useCallback((questId: string) => {
    return questState.completedToday.includes(questId);
  }, [questState.completedToday]);

  // Get available quests based on current XP
  const getAvailableQuests = useCallback(() => {
    return questsData.filter(quest => {
      // Check XP requirements
      if (quest.unlockAtXP && quest.unlockAtXP > currentXP) {
        return false;
      }
      
      // Check if already completed today
      return !isQuestCompletedToday(quest.id);
    });
  }, [isQuestCompletedToday, currentXP]);

  // Get today's progress
  const getTodayProgress = useCallback(() => {
    const completed = questState.completedToday.length;
    const dailyLimit = 3 + Math.floor(currentXP / 500); // +1 slot per 500 XP
    const remaining = Math.max(0, dailyLimit - completed);
    
    return {
      completed,
      limit: dailyLimit,
      remaining
    };
  }, [questState.completedToday, currentXP]);

  // Check if user can unlock a specific quest
  const canUnlockQuest = useCallback((questId: string, cost: number) => {
    return canAfford(cost) && !isUnlocked('features', `quest_${questId}`);
  }, [canAfford, isUnlocked]);

  // Get quest stats for display
  const getQuestStats = useCallback(() => {
    const todayXP = questState.completedToday.reduce((total, questId) => {
      const quest = questsData.find(q => q.id === questId);
      return total + (quest?.xpReward || 0);
    }, 0);

    const availableCount = getAvailableQuests().length;
    const completedCount = questState.completedToday.length;
    const totalAvailable = questsData.filter(q => 
      !q.unlockAtXP || q.unlockAtXP <= currentXP
    ).length;

    return {
      todayXP,
      dailyStreak: streak || questState.currentStreak,
      questsCompletedToday: completedCount,
      questsAvailable: availableCount,
      totalQuestsUnlocked: totalAvailable,
      totalQuestsInGame: questsData.length
    };
  }, [questState, getAvailableQuests, currentXP, streak]);

  return {
    // State
    isQuestSidebarOpen,
    questState,
    
    // Actions
    openQuestSidebar: () => setIsQuestSidebarOpen(true),
    closeQuestSidebar: () => setIsQuestSidebarOpen(false),
    toggleQuestSidebar: () => setIsQuestSidebarOpen(prev => !prev),
    completeQuest,
    
    // Getters
    isQuestCompletedToday,
    getAvailableQuests,
    getTodayProgress,
    canUnlockQuest,
    getQuestStats,
    
    // Current XP from centralized system
    currentXP,
    
    // Data
    questsData,
    challengesData
  };
}