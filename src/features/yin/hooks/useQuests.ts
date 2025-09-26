import { useCallback, useEffect, useState } from 'react';
import { challengesData, questsData } from '../data/questsData';
import { xpService } from '../services/xpService';
import { QuestState } from '../types/quest.types';

export function useQuests() {
  const [isQuestSidebarOpen, setIsQuestSidebarOpen] = useState(false);
  const [questState, setQuestState] = useState<QuestState>({
    completedToday: [],
    totalCompleted: 0,
    currentStreak: 0,
    lastCompletedDate: null
  });

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

  // Complete a quest
  const completeQuest = useCallback((questId: string, xpReward: number) => {
    const today = new Date();
    
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
    
    // Award XP using the service
    xpService.addXP(xpReward, 'quests', { questId });
  }, []);

  // Check if a quest is completed today
  const isQuestCompletedToday = useCallback((questId: string) => {
    return questState.completedToday.includes(questId);
  }, [questState.completedToday]);

  // Get available quests
  const getAvailableQuests = useCallback(() => {
    const currentXP = xpService.getTotalXP();
    return questsData.filter(quest => {
      if (quest.unlockAtXP && quest.unlockAtXP > currentXP) {
        return false;
      }
      return !isQuestCompletedToday(quest.id);
    });
  }, [isQuestCompletedToday]);

  // Get today's progress
  const getTodayProgress = useCallback(() => {
    const completed = questState.completedToday.length;
    const dailyLimit = 3 + Math.floor(xpService.getTotalXP() / 500); // +1 slot per 500 XP
    const remaining = Math.max(0, dailyLimit - completed);
    
    return {
      completed,
      limit: dailyLimit,
      remaining
    };
  }, [questState.completedToday]);

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
    
    // Data
    questsData,
    challengesData
  };
}