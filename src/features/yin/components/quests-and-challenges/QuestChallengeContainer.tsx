// src/features/yin/components/quests-and-challenges/QuestChallengeContainer.tsx

import { AnimatePresence } from 'framer-motion';
import {
  Activity,
  BookOpen,
  Brain,
  Heart,
  Shield,
  Target,
  Trophy,
  Wind
} from 'lucide-react';
import React, { useEffect, useState } from 'react';

// Services
import { Challenge, challengeService } from '@/features/yin/services/challengeService';
import { xpService } from '@/features/yin/services/xpService';

// UI Components
import { ChallengeUI } from './challenges/ChallengeUI';
import { QuestUI } from './quests/QuestUI';

// Types
export interface Quest {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  xp: number;
  duration?: string;
  completed: boolean;
  category?: string;
}

export interface QuestChallengeState {
  quests: Quest[];
  challenges: Challenge[];
  activeTab: 'quests' | 'challenges';
  totalXP: number;
  dailyStreak: number;
  currentTier: number;
  questProgress: number;
  showCelebration: boolean;
}

// Quest Registry - Single source of truth for quest definitions
const QUEST_REGISTRY: Quest[] = [
  {
    id: 'meditation',
    title: 'Mindful Meditation',
    description: 'Find your inner peace with a guided meditation session',
    icon: Brain,
    xp: 50,
    duration: '5 min',
    completed: false,
    category: 'mindfulness'
  },
  {
    id: 'gratitude',
    title: 'Gratitude Journal',
    description: 'Write three things you\'re grateful for today',
    icon: Heart,
    xp: 30,
    duration: '3 min',
    completed: false,
    category: 'journaling'
  },
  {
    id: 'breathing',
    title: 'Breath of Life',
    description: 'Practice deep breathing exercises for clarity',
    icon: Wind,
    xp: 40,
    duration: '4 min',
    completed: false,
    category: 'mindfulness'
  },
  {
    id: 'learning',
    title: 'Wisdom Seeker',
    description: 'Read an inspirational quote and reflect on its meaning',
    icon: BookOpen,
    xp: 25,
    duration: '2 min',
    completed: false,
    category: 'learning'
  },
  {
    id: 'movement',
    title: 'Energy Flow',
    description: 'Gentle stretching or yoga to awaken your body',
    icon: Activity,
    xp: 35,
    duration: '5 min',
    completed: false,
    category: 'movement'
  }
];

// Challenge icon mapping
const CHALLENGE_ICONS: Record<string, React.ComponentType<any>> = {
  'first-steps': Target,
  'daily-practice': Trophy,
  'meditation-master': Brain,
  'gratitude-champion': Heart,
  'breath-warrior': Wind,
  'default': Shield
};

/**
 * Smart container component that manages all quest and challenge logic
 * UI components receive props and callbacks only
 */
export const QuestChallengeContainer: React.FC = () => {
  const [state, setState] = useState<QuestChallengeState>({
    quests: [],
    challenges: [],
    activeTab: 'quests',
    totalXP: 0,
    dailyStreak: 7, // This would come from a streak service
    currentTier: 1,
    questProgress: 0,
    showCelebration: false
  });

  // Initialize on mount
  useEffect(() => {
    initializeData();
    
    // Listen for challenge completions
    const handleChallengeComplete = (event: CustomEvent) => {
      console.log('Challenge completed:', event.detail);
      setState(prev => ({ ...prev, showCelebration: true }));
      setTimeout(() => setState(prev => ({ ...prev, showCelebration: false })), 5000);
    };
    
    window.addEventListener('challengeCompleted' as any, handleChallengeComplete);
    return () => {
      window.removeEventListener('challengeCompleted' as any, handleChallengeComplete);
    };
  }, []);

  // Initialize all data
  const initializeData = () => {
    // Load quests from registry
    const savedQuests = loadQuestProgress();
    
    // Load challenges
    const challenges = loadChallenges();
    
    // Load XP
    const totalXP = xpService.getTotalXP();
    
    // Calculate progress
    const questProgress = calculateQuestProgress(savedQuests);
    
    setState(prev => ({
      ...prev,
      quests: savedQuests,
      challenges,
      totalXP,
      questProgress,
      currentTier: challengeService.getCurrentTier()
    }));
  };

  // Load quest progress from localStorage
  const loadQuestProgress = (): Quest[] => {
    if (typeof window === 'undefined') return QUEST_REGISTRY;
    
    const saved = localStorage.getItem('quest_progress');
    if (saved) {
      try {
        const savedData = JSON.parse(saved);
        return QUEST_REGISTRY.map(quest => ({
          ...quest,
          completed: savedData[quest.id] || false
        }));
      } catch (e) {
        console.error('Error loading quest progress:', e);
      }
    }
    return QUEST_REGISTRY;
  };

  // Save quest progress
  const saveQuestProgress = (quests: Quest[]) => {
    if (typeof window === 'undefined') return;
    
    const progressData = quests.reduce((acc, quest) => ({
      ...acc,
      [quest.id]: quest.completed
    }), {});
    
    localStorage.setItem('quest_progress', JSON.stringify(progressData));
  };

  // Load and enhance challenges with icons
  const loadChallenges = (): Challenge[] => {
    const challenges = challengeService.getAllChallenges();
    return challenges.map(challenge => ({
      ...challenge,
      icon: CHALLENGE_ICONS[challenge.id] || CHALLENGE_ICONS.default
    }));
  };

  // Calculate quest progress percentage
  const calculateQuestProgress = (quests: Quest[]): number => {
    const completed = quests.filter(q => q.completed).length;
    return (completed / quests.length) * 100;
  };

  // Handle quest click - should open quest, not complete it
  const handleQuestClick = (questId: string) => {
    const quest = state.quests.find(q => q.id === questId);
    if (!quest || quest.completed) return;
    
    // TODO: Open quest modal/view for user to complete the activity
    console.log('Opening quest:', questId);
    // For now, we'll simulate completion after a delay (replace with actual quest flow)
    setTimeout(() => {
      handleQuestComplete(questId);
    }, 1000);
  };
  
  // Handle quest completion (called after quest activity is done)
  const handleQuestComplete = (questId: string) => {
    const quest = state.quests.find(q => q.id === questId);
    if (!quest || quest.completed) return;
    
    // Update quest status
    const updatedQuests = state.quests.map(q => 
      q.id === questId ? { ...q, completed: true } : q
    );
    
    // Save progress
    saveQuestProgress(updatedQuests);
    
    // Add XP
    xpService.addXP(quest.xp, 'quests');
    
    // Update challenges
    challengeService.checkChallengeProgressFromQuest(questId);
    
    // Reload data
    const challenges = loadChallenges();
    const totalXP = xpService.getTotalXP();
    const questProgress = calculateQuestProgress(updatedQuests);
    
    // Check if all quests completed
    const allCompleted = updatedQuests.every(q => q.completed);
    
    setState(prev => ({
      ...prev,
      quests: updatedQuests,
      challenges,
      totalXP,
      questProgress,
      showCelebration: allCompleted,
      currentTier: challengeService.getCurrentTier()
    }));
    
    if (allCompleted) {
      setTimeout(() => setState(prev => ({ ...prev, showCelebration: false })), 5000);
    }
  };

  // Handle tab change
  const handleTabChange = (tab: 'quests' | 'challenges') => {
    setState(prev => ({ ...prev, activeTab: tab }));
  };

  // Reset daily quests (for new day)
  const resetDailyQuests = () => {
    const resetQuests = QUEST_REGISTRY.map(q => ({ ...q, completed: false }));
    saveQuestProgress(resetQuests);
    setState(prev => ({
      ...prev,
      quests: resetQuests,
      questProgress: 0
    }));
  };

  // Get stats for display
  const getStats = () => ({
    totalXP: state.totalXP,
    dailyStreak: state.dailyStreak,
    currentTier: state.currentTier,
    questsCompleted: state.quests.filter(q => q.completed).length,
    questsTotal: state.quests.length,
    challengesCompleted: challengeService.getCompletedCount(),
    challengesTotal: challengeService.getTotalCount()
  });

  // Render the UI components with props
  return (
    <>
      <AnimatePresence mode="wait">
        {state.activeTab === 'quests' ? (
          <QuestUI
            key="quests"
            quests={state.quests}
            stats={getStats()}
            progress={state.questProgress}
            onQuestClick={handleQuestComplete}
            onTabChange={handleTabChange}
            activeTab={state.activeTab}
          />
        ) : (
          <ChallengeUI
            key="challenges"
            challenges={state.challenges}
            stats={getStats()}
            onTabChange={handleTabChange}
            activeTab={state.activeTab}
          />
        )}
      </AnimatePresence>
      
      {/* Celebration could be a separate component */}
      {state.showCelebration && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="text-center">
            <Trophy className="w-32 h-32 text-yellow-400 mb-6" />
            <h2 className="text-6xl font-bold text-white mb-4">Quest Master!</h2>
            <p className="text-2xl text-white/80">All daily quests completed!</p>
          </div>
        </div>
      )}
    </>
  );
};

// Export the container as default
export default QuestChallengeContainer;