// src/features/yin/hooks/useQuestState.tsx
'use client'

import React, { createContext, ReactNode, useContext, useEffect, useReducer } from 'react';
import { challengeService } from '../services/challengeService';
import { storageService } from '../services/storageService';

// Types
interface Quest {
  id: string;
  type: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  gradient: string;
  xp: number;
  duration?: string;
  completed: boolean;
  category?: string;
}

interface Challenge {
  id: string;
  title: string;
  description: string;
  tier: number;
  required: number;
  progress: number;
  completed: boolean;
  locked: boolean;
  xpReward: number;
  questRequirements?: string[];
  icon?: React.ComponentType<any>;
  gradient?: string;
}

interface QuestState {
  // Quests
  quests: Quest[];
  dailyCompletions: string[];
  questsCompletedToday: number;
  
  // Challenges
  challenges: Challenge[];
  completedChallenges: Challenge[];
  currentTier: number;
  
  // XP
  totalXP: number;
  xpHistory: Array<{
    amount: number;
    source: string;
    timestamp: string;
    metadata?: any;
  }>;
  
  // Lessons/Chapters
  completedLessons: string[];
  lessonProgress: Record<string, number>;
  
  // Streaks
  dailyStreak: number;
  lastActiveDate: string;
  
  // UI State
  selectedQuest: Quest | null;
  isQuestModalOpen: boolean;
  activeTab: 'quests' | 'challenges';
  
  // Settings
  performanceMode: boolean;
  animationsEnabled: boolean;
  soundEnabled: boolean;
}

// Action Types
type QuestAction =
  | { type: 'INITIALIZE'; payload: Partial<QuestState> }
  | { type: 'COMPLETE_QUEST'; payload: { questId: string; xpReward: number; data?: any } }
  | { type: 'RESET_DAILY_QUESTS' }
  | { type: 'SELECT_QUEST'; payload: Quest | null }
  | { type: 'OPEN_QUEST_MODAL'; payload: boolean }
  | { type: 'COMPLETE_CHALLENGE'; payload: string }
  | { type: 'UPDATE_CHALLENGE_PROGRESS'; payload: { challengeId: string; progress: number } }
  | { type: 'UNLOCK_TIER'; payload: number }
  | { type: 'ADD_XP'; payload: { amount: number; source: string; metadata?: any } }
  | { type: 'UPDATE_STREAK'; payload: number }
  | { type: 'SET_ACTIVE_TAB'; payload: 'quests' | 'challenges' }
  | { type: 'UPDATE_SETTINGS'; payload: Partial<{ performanceMode: boolean; animationsEnabled: boolean; soundEnabled: boolean }> }
  | { type: 'COMPLETE_LESSON'; payload: { lessonId: string; xpReward: number } }
  | { type: 'UPDATE_LESSON_PROGRESS'; payload: { lessonId: string; progress: number } }
  | { type: 'RESET_ALL' }
  | { type: 'RESET_SCOPE'; payload: 'quests' | 'challenges' | 'xp' };

// Reducer
function questReducer(state: QuestState, action: QuestAction): QuestState {
  switch (action.type) {
    case 'INITIALIZE': {
      return {
        ...state,
        ...action.payload
      };
    }

    case 'COMPLETE_QUEST': {
      const { questId, xpReward, data } = action.payload;
      
      // Update quest completion status
      const updatedQuests = state.quests.map(q => 
        q.id === questId ? { ...q, completed: true } : q
      );
      
      // Add to daily completions
      const updatedCompletions = [...state.dailyCompletions, questId];
      
      // Update XP
      const updatedTotalXP = state.totalXP + xpReward;
      const newXPEntry = {
        amount: xpReward,
        source: 'quest_completion',
        timestamp: new Date().toISOString(),
        metadata: { questId, ...data }
      };
      const updatedHistory = [...state.xpHistory, newXPEntry].slice(-100);
      
      // Check challenge progress
      const quest = state.quests.find(q => q.id === questId);
      if (quest) {
        challengeService.checkChallengeProgressFromQuest(questId, quest.type, quest.category);
      }
      
      // Save to storage
      storageService.updateQuests({
        progress: updatedQuests.reduce((acc, q) => ({ ...acc, [q.id]: q.completed }), {}),
        dailyCompletions: updatedCompletions
      });
      storageService.addXP(xpReward, 'quest_completion', { questId });
      
      return {
        ...state,
        quests: updatedQuests,
        dailyCompletions: updatedCompletions,
        questsCompletedToday: updatedCompletions.length,
        totalXP: updatedTotalXP,
        xpHistory: updatedHistory
      };
    }

    case 'RESET_DAILY_QUESTS': {
      const resetQuests = state.quests.map(q => ({ ...q, completed: false }));
      
      storageService.updateQuests({
        progress: {},
        dailyCompletions: [],
        lastResetDate: new Date().toISOString()
      });
      
      return {
        ...state,
        quests: resetQuests,
        dailyCompletions: [],
        questsCompletedToday: 0
      };
    }

    case 'SELECT_QUEST': {
      return {
        ...state,
        selectedQuest: action.payload
      };
    }

    case 'OPEN_QUEST_MODAL': {
      return {
        ...state,
        isQuestModalOpen: action.payload
      };
    }

    case 'COMPLETE_CHALLENGE': {
      const challengeId = action.payload;
      const challenge = state.challenges.find(c => c.id === challengeId);
      
      if (!challenge || challenge.completed || challenge.locked) {
        return state;
      }
      
      // Complete the challenge
      const completed = challengeService.completeChallenge(challengeId);
      
      if (!completed) {
        return state;
      }
      
      // Reload challenges from service
      const updatedChallenges = challengeService.getAvailableChallenges();
      const updatedCompleted = challengeService.getCompletedChallenges();
      const newTier = challengeService.getCurrentTier();
      
      return {
        ...state,
        challenges: updatedChallenges,
        completedChallenges: updatedCompleted,
        currentTier: newTier,
        totalXP: state.totalXP + challenge.xpReward
      };
    }

    case 'UPDATE_CHALLENGE_PROGRESS': {
      const { challengeId, progress } = action.payload;
      
      const updatedChallenges = state.challenges.map(c =>
        c.id === challengeId ? { ...c, progress } : c
      );
      
      return {
        ...state,
        challenges: updatedChallenges
      };
    }

    case 'UNLOCK_TIER': {
      const newTier = action.payload;
      
      const updatedChallenges = state.challenges.map(c => ({
        ...c,
        locked: c.tier > newTier
      }));
      
      return {
        ...state,
        currentTier: newTier,
        challenges: updatedChallenges
      };
    }

    case 'ADD_XP': {
      const { amount, source, metadata } = action.payload;
      
      const updatedTotalXP = state.totalXP + amount;
      const newXPEntry = {
        amount,
        source,
        timestamp: new Date().toISOString(),
        metadata
      };
      const updatedHistory = [...state.xpHistory, newXPEntry].slice(-100);
      
      storageService.addXP(amount, source, metadata);
      
      return {
        ...state,
        totalXP: updatedTotalXP,
        xpHistory: updatedHistory
      };
    }

    case 'UPDATE_STREAK': {
      return {
        ...state,
        dailyStreak: action.payload
      };
    }

    case 'SET_ACTIVE_TAB': {
      return {
        ...state,
        activeTab: action.payload
      };
    }

    case 'UPDATE_SETTINGS': {
      const updatedSettings = {
        ...state,
        ...action.payload
      };
      
      storageService.updateSettings(action.payload);
      
      return updatedSettings;
    }

    case 'COMPLETE_LESSON': {
      const { lessonId, xpReward } = action.payload;
      
      // Add to completed lessons
      const updatedCompletedLessons = [...(state.completedLessons || []), lessonId];
      
      // Update XP
      const updatedTotalXP = state.totalXP + xpReward;
      const newXPEntry = {
        amount: xpReward,
        source: 'lesson_completion',
        timestamp: new Date().toISOString(),
        metadata: { lessonId }
      };
      const updatedHistory = [...state.xpHistory, newXPEntry].slice(-100);
      
      // Save to storage (you'll need to extend storage service for lessons)
      storageService.addXP(xpReward, 'lesson_completion', { lessonId });
      
      return {
        ...state,
        completedLessons: updatedCompletedLessons,
        totalXP: updatedTotalXP,
        xpHistory: updatedHistory
      };
    }

    case 'UPDATE_LESSON_PROGRESS': {
      const { lessonId, progress } = action.payload;
      
      const updatedProgress = {
        ...state.lessonProgress,
        [lessonId]: progress
      };
      
      return {
        ...state,
        lessonProgress: updatedProgress
      };
    }

    case 'RESET_ALL': {
      storageService.reset('all');
      challengeService.resetAll();
      
      return {
        ...state,
        quests: state.quests.map(q => ({ ...q, completed: false })),
        dailyCompletions: [],
        questsCompletedToday: 0,
        challenges: challengeService.getAvailableChallenges(),
        completedChallenges: [],
        currentTier: 1,
        totalXP: 0,
        xpHistory: [],
        dailyStreak: 0
      };
    }

    case 'RESET_SCOPE': {
      const scope = action.payload;
      
      if (scope === 'quests') {
        storageService.reset('quests');
        return {
          ...state,
          quests: state.quests.map(q => ({ ...q, completed: false })),
          dailyCompletions: [],
          questsCompletedToday: 0
        };
      } else if (scope === 'challenges') {
        storageService.reset('challenges');
        challengeService.resetAll();
        return {
          ...state,
          challenges: challengeService.getAvailableChallenges(),
          completedChallenges: [],
          currentTier: 1
        };
      } else if (scope === 'xp') {
        storageService.reset('xp');
        return {
          ...state,
          totalXP: 0,
          xpHistory: []
        };
      }
      
      return state;
    }

    default:
      return state;
  }
}

// Context
const QuestStateContext = createContext<{
  state: QuestState;
  dispatch: React.Dispatch<QuestAction>;
} | undefined>(undefined);

// Provider Component
export const QuestStateProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(questReducer, {
    quests: [],
    dailyCompletions: [],
    questsCompletedToday: 0,
    challenges: [],
    completedChallenges: [],
    currentTier: 1,
    totalXP: 0,
    xpHistory: [],
    completedLessons: [],
    lessonProgress: {},
    dailyStreak: 0,
    lastActiveDate: new Date().toISOString(),
    selectedQuest: null,
    isQuestModalOpen: false,
    activeTab: 'quests',
    performanceMode: false,
    animationsEnabled: true,
    soundEnabled: true
  });

  // Initialize from storage on mount
  useEffect(() => {
    const stored = storageService.getChallenges();
    const questData = storageService.getQuests();
    const xpData = storageService.getXP();
    const settings = storageService.getSettings();
    
    // Check if new day
    const lastActive = new Date(questData.lastResetDate);
    const today = new Date();
    const isNewDay = lastActive.toDateString() !== today.toDateString();
    
    if (isNewDay) {
      dispatch({ type: 'RESET_DAILY_QUESTS' });
    }
    
    dispatch({
      type: 'INITIALIZE',
      payload: {
        dailyCompletions: isNewDay ? [] : questData.dailyCompletions,
        questsCompletedToday: isNewDay ? 0 : questData.dailyCompletions.length,
        challenges: challengeService.getAvailableChallenges(),
        completedChallenges: challengeService.getCompletedChallenges(),
        currentTier: stored.currentTier,
        totalXP: xpData.total,
        xpHistory: xpData.history,
        performanceMode: settings.performanceMode,
        animationsEnabled: settings.animations,
        soundEnabled: settings.soundEnabled
      }
    });
  }, []);

  // Listen for storage updates from other components
  useEffect(() => {
   const handleStorageUpdate = (event: CustomEvent) => {
  const { data } = event.detail;
  // Defer the dispatch to avoid updating during render
  setTimeout(() => {
    dispatch({
      type: 'INITIALIZE',
      payload: {
        totalXP: data?.xp?.total || 0,
        currentLevel: data?.xp?.level || 1,
        completedQuests: data?.completedQuests || [],
        activeQuests: data?.activeQuests || [],
        completedChallenges: data?.completedChallenges || [],
        activeChallenges: data?.activeChallenges || [],
        dailyStreak: data?.streaks?.daily || 0,
        weeklyStreak: data?.streaks?.weekly || 0,
        questsAvailable: 3,
        challengesAvailable: 2
      }
    });
  }, 0);
};

    window.addEventListener('storageUpdated', handleStorageUpdate as EventListener);
    return () => window.removeEventListener('storageUpdated', handleStorageUpdate as EventListener);
  }, []);

  return (
    <QuestStateContext.Provider value={{ state, dispatch }}>
      {children}
    </QuestStateContext.Provider>
  );
};

// Hook - Fix the return to handle missing context gracefully
export const useQuestState = () => {
  const context = useContext(QuestStateContext);
  if (!context) {
    console.error('useQuestState must be used within QuestStateProvider');
    // Return a minimal state to prevent crashes
    return {
      state: {
        quests: [],
        dailyCompletions: [],
        questsCompletedToday: 0,
        challenges: [],
        completedChallenges: [],
        currentTier: 1,
        totalXP: 0,
        xpHistory: [],
        completedLessons: [],
        lessonProgress: {},
        dailyStreak: 0,
        lastActiveDate: new Date().toISOString(),
        selectedQuest: null,
        isQuestModalOpen: false,
        activeTab: 'quests' as const,
        performanceMode: false,
        animationsEnabled: true,
        soundEnabled: true
      },
      dispatch: () => {}
    };
  }
  return context;
};

// Convenience hooks
export const useQuestActions = () => {
  const { dispatch } = useQuestState();
  
  return {
    completeQuest: (questId: string, xpReward: number, data?: any) => {
      dispatch({ type: 'COMPLETE_QUEST', payload: { questId, xpReward, data } });
    },
    selectQuest: (quest: Quest | null) => {
      dispatch({ type: 'SELECT_QUEST', payload: quest });
    },
    openQuestModal: (open: boolean) => {
      dispatch({ type: 'OPEN_QUEST_MODAL', payload: open });
    },
    completeChallenge: (challengeId: string) => {
      dispatch({ type: 'COMPLETE_CHALLENGE', payload: challengeId });
    },
    completeLesson: (lessonId: string, xpReward: number) => {
      dispatch({ type: 'COMPLETE_LESSON', payload: { lessonId, xpReward } });
    },
    updateLessonProgress: (lessonId: string, progress: number) => {
      dispatch({ type: 'UPDATE_LESSON_PROGRESS', payload: { lessonId, progress } });
    },
    addXP: (amount: number, source: string, metadata?: any) => {
      dispatch({ type: 'ADD_XP', payload: { amount, source, metadata } });
    },
    setActiveTab: (tab: 'quests' | 'challenges') => {
      dispatch({ type: 'SET_ACTIVE_TAB', payload: tab });
    },
    resetAll: () => {
      dispatch({ type: 'RESET_ALL' });
    },
    resetScope: (scope: 'quests' | 'challenges' | 'xp') => {
      dispatch({ type: 'RESET_SCOPE', payload: scope });
    }
  };
};