// src/features/yin/hooks/useQuests.ts

import { useCallback, useEffect, useState } from 'react';
import { challengesData, questsData } from '../data/questsData';
import { QuestState } from '../types/quest.types';
import { useXP } from './useXP';

export function useQuests() {
  const [isQuestSidebarOpen, setIsQuestSidebarOpen] = useState(false);
  
  // Initialize with default data immediately
  const [questState, setQuestState] = useState<QuestState>({
    quests: questsData || [],
    challenges: challengesData || [],
    completedToday: [],
    totalQuestsCompleted: 0,
    currentDailyStreak: 0,
    lastActiveDate: new Date().toISOString()
  });
  
  const { currentXP, addXP } = useXP();

  // Load quest state from localStorage (client-side only)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const loadState = () => {
      try {
        const saved = localStorage.getItem('questState');
        if (saved) {
          const state = JSON.parse(saved);
          // Check if it's a new day
          const lastActive = new Date(state.lastActiveDate || new Date().toISOString());
          const today = new Date();
          if (lastActive.toDateString() !== today.toDateString()) {
            // Reset daily quests
            state.completedToday = [];
            // Check if streak should continue
            const daysDiff = Math.floor((today.getTime() - lastActive.getTime()) / (1000 * 60 * 60 * 24));
            if (daysDiff > 1) {
              state.currentDailyStreak = 0;
            }
          }
          
          // Ensure quests and challenges arrays exist
          setQuestState({
            quests: state.quests || questsData || [],
            challenges: state.challenges || challengesData || [],
            completedToday: state.completedToday || [],
            totalQuestsCompleted: state.totalQuestsCompleted || 0,
            currentDailyStreak: state.currentDailyStreak || 0,
            lastActiveDate: state.lastActiveDate || new Date().toISOString()
          });
        }
      } catch (error) {
        console.error('Error loading quest state:', error);
        // Keep default state if there's an error
      }
    };
    
    loadState();
  }, []);

  // Save state to localStorage (client-side only)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    // Only save if we have valid data
    if (questState.quests && questState.quests.length > 0) {
      try {
        localStorage.setItem('questState', JSON.stringify(questState));
      } catch (error) {
        console.error('Error saving quest state:', error);
      }
    }
  }, [questState]);

  // Toggle sidebar
  const toggleQuestSidebar = useCallback(() => {
    setIsQuestSidebarOpen(prev => !prev);
  }, []);

  // Complete quest
  const completeQuest = useCallback((questId: string, xpEarned: number) => {
    console.log(`Quest completed: ${questId}, XP earned: ${xpEarned}`);
    
    setQuestState(prev => ({
      ...prev,
      completedToday: [...(prev.completedToday || []), questId],
      totalQuestsCompleted: (prev.totalQuestsCompleted || 0) + 1
    }));
    
    // Award XP
    addXP(xpEarned, `quest_${questId}`);
  }, [addXP]);

  // Progress challenge
  const progressChallenge = useCallback((challengeId: string) => {
    console.log(`Challenge progressed: ${challengeId}`);
    // Challenge progress is handled by the sidebar component
  }, []);

  // Safe access with fallbacks
  const questsArray = questState.quests || [];
  const completedTodayArray = questState.completedToday || [];

  return {
    isQuestSidebarOpen,
    toggleQuestSidebar,
    setIsQuestSidebarOpen,
    questState,
    completeQuest,
    progressChallenge,
    questsAvailable: questsArray.filter(q => !completedTodayArray.includes(q.id)).length,
    dailyStreak: questState.currentDailyStreak || 0
  };
}