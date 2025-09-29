// src/features/yin/components/quests-and-challenges/QuestChallengeContainer.tsx

import { challengeService } from '@/features/yin/services/challengeService';
import { xpService } from '@/features/yin/services/xpService';
import { AnimatePresence } from 'framer-motion';
import { Activity, BookOpen, Brain, Heart, Shield, Target, Trophy, Wind } from 'lucide-react';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ChallengeUI } from './challenges/ChallengeUI';
import { QuestUI } from './quests/QuestUI';
import {
  DailyIntentionQuest,
  GratitudeQuest,
  InsightQuest,
  MeditationQuest,
  MovementQuest
} from './quests/individual-quests';

// Types
export interface Quest {
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

// Quest Registry - Single source of truth with correct IDs
const QUEST_REGISTRY: Quest[] = [
  {
    id: 'meditation',
    type: 'meditation',
    title: 'Mindful Meditation',
    description: 'Find your inner peace with a guided meditation session',
    icon: Brain,
    gradient: 'from-purple-500 via-violet-500 to-indigo-600',
    xp: 50,
    duration: '5 min',
    completed: false,
    category: 'mindfulness'
  },
  {
    id: 'gratitude',
    type: 'gratitude',
    title: 'Gratitude Journal',
    description: 'Write three things you\'re grateful for today',
    icon: Heart,
    gradient: 'from-pink-500 via-rose-500 to-red-500',
    xp: 30,
    duration: '3 min',
    completed: false,
    category: 'journaling'
  },
  {
    id: 'movement',
    type: 'movement',
    title: 'Energy Flow',
    description: 'Gentle stretching or yoga to awaken your body',
    icon: Activity,
    gradient: 'from-orange-500 via-amber-500 to-yellow-500',
    xp: 35,
    duration: '5 min',
    completed: false,
    category: 'movement'
  },
  {
    id: 'learning',
    type: 'daily-intention',
    title: 'Set Daily Intention',
    description: 'Define your focus and purpose for today',
    icon: Target,
    gradient: 'from-blue-500 via-cyan-500 to-teal-500',
    xp: 25,
    duration: '2 min',
    completed: false,
    category: 'planning'
  },
  {
    id: 'breathing',
    type: 'insight',
    title: 'Capture Insight',
    description: 'Record a meaningful realization or learning',
    icon: BookOpen,
    gradient: 'from-green-500 via-emerald-500 to-teal-500',
    xp: 40,
    duration: '3 min',
    completed: false,
    category: 'reflection'
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
 * Smart Container - Handles ALL logic
 */
export const QuestChallengeContainer: React.FC = () => {
  const [quests, setQuests] = useState<Quest[]>([]);
  const [challenges, setChallenges] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'quests' | 'challenges'>('quests');
  const [selectedQuest, setSelectedQuest] = useState<Quest | null>(null);
  const [isQuestModalOpen, setIsQuestModalOpen] = useState(false);
  const [stats, setStats] = useState({
    totalXP: 0,
    dailyStreak: 7,
    currentTier: 1,
    questsCompleted: 0,
    questsTotal: 5,
    challengesCompleted: 0,
    challengesTotal: 0
  });
  
  // Use ref to track if initial load is done
  const isInitialized = useRef(false);

  // Load quests with saved progress
  const loadQuests = useCallback(() => {
    const saved = localStorage.getItem('quest_progress');
    let questData = [...QUEST_REGISTRY];
    
    if (saved) {
      try {
        const savedProgress = JSON.parse(saved);
        questData = questData.map(q => ({
          ...q,
          completed: savedProgress[q.id] || false
        }));
      } catch (e) {
        console.error('Failed to load quest progress:', e);
      }
    }
    
    setQuests(questData);
    return questData;
  }, []);

  // Load challenges with proper completion status
  const loadChallenges = useCallback(() => {
    const allChallenges = challengeService.getAllChallenges();
    const availableChallenges = challengeService.getAvailableChallenges();
    
    // Enhance available challenges with full data
    const enhancedChallenges = availableChallenges.map(availChallenge => {
      const fullChallenge = allChallenges.find(c => c.id === availChallenge.id);
      return {
        ...availChallenge,
        ...fullChallenge, // This ensures we get the completed status
        icon: CHALLENGE_ICONS[availChallenge.id] || CHALLENGE_ICONS.default,
        gradient: getGradientForChallenge(availChallenge.id)
      };
    });
    
    setChallenges(enhancedChallenges);
    
    // Count completed challenges from ALL challenges
    const completedCount = allChallenges.filter(c => c.completed === true).length;
    
    console.log('All challenges:', allChallenges);
    console.log('Completed count:', completedCount);
    
    return { enhancedChallenges, completedCount, totalCount: allChallenges.length };
  }, []);

  // Get gradient for challenge
  const getGradientForChallenge = (id: string): string => {
    const gradients: Record<string, string> = {
      'first-steps': 'from-blue-500 via-purple-500 to-pink-500',
      'daily-practice': 'from-yellow-400 via-orange-500 to-red-500',
      'meditation-master': 'from-purple-500 via-indigo-500 to-blue-600',
      'gratitude-champion': 'from-pink-400 via-rose-500 to-red-500',
      'breath-warrior': 'from-cyan-400 via-blue-500 to-indigo-600'
    };
    return gradients[id] || 'from-gray-500 to-gray-700';
  };

  // Update stats
  const updateStats = useCallback((questData?: Quest[]) => {
    const currentQuests = questData || quests;
    const challengeData = loadChallenges();
    
    const newStats = {
      totalXP: xpService.getTotalXP(),
      dailyStreak: 7,
      currentTier: challengeService.getCurrentTier(),
      questsCompleted: currentQuests.filter(q => q.completed).length,
      questsTotal: currentQuests.length,
      challengesCompleted: challengeData.completedCount,
      challengesTotal: challengeData.totalCount
    };
    
    setStats(newStats);
  }, [quests, loadChallenges]);

  // Initialize on mount
  useEffect(() => {
    if (!isInitialized.current) {
      isInitialized.current = true;
      const loadedQuests = loadQuests();
      updateStats(loadedQuests);
    }
  }, [loadQuests, updateStats]);

  // Handle quest click - opens the quest modal
  const handleQuestClick = useCallback((questId: string) => {
    const quest = quests.find(q => q.id === questId);
    if (!quest || quest.completed) return;
    
    console.log('Opening quest modal for:', quest.title);
    setSelectedQuest(quest);
    setIsQuestModalOpen(true);
  }, [quests]);

  // Handle quest completion from modal
  const handleQuestComplete = useCallback(async (questId: string, xpReward: number, data?: any) => {
    console.log('Completing quest:', questId, 'XP:', xpReward);
    
    // Update quests
    const updatedQuests = quests.map(q => 
      q.id === questId ? { ...q, completed: true } : q
    );
    setQuests(updatedQuests);
    
    // Save progress
    const progressData = updatedQuests.reduce((acc, quest) => ({
      ...acc,
      [quest.id]: quest.completed
    }), {});
    localStorage.setItem('quest_progress', JSON.stringify(progressData));
    
    // Add XP
    xpService.addXP(xpReward, 'quest_completion');
    
    // Check challenge progress
    await challengeService.checkChallengeProgressFromQuest(questId);
    
    // Reload everything
    updateStats(updatedQuests);
    
    // Close modal
    setIsQuestModalOpen(false);
    setSelectedQuest(null);
  }, [quests, updateStats]);

  // Close modal
  const handleCloseModal = useCallback(() => {
    setIsQuestModalOpen(false);
    setSelectedQuest(null);
  }, []);

  // Render quest modal based on type
  const renderQuestModal = () => {
    if (!selectedQuest || !isQuestModalOpen) return null;

    const questProps = {
      quest: {
        id: selectedQuest.id,
        title: selectedQuest.title,
        description: selectedQuest.description,
        duration: parseInt(selectedQuest.duration || '5'),
        xp: selectedQuest.xp
      },
      onComplete: handleQuestComplete,
      onClose: handleCloseModal
    };

    switch (selectedQuest.type) {
      case 'meditation':
        return <MeditationQuest {...questProps} />;
      case 'gratitude':
        return <GratitudeQuest {...questProps} />;
      case 'movement':
        return <MovementQuest {...questProps} />;
      case 'daily-intention':
        return <DailyIntentionQuest {...questProps} />;
      case 'insight':
        return <InsightQuest {...questProps} />;
      default:
        console.warn('Unknown quest type:', selectedQuest.type);
        return null;
    }
  };

  // Calculate progress
  const questProgress = quests.length > 0 
    ? (quests.filter(q => q.completed).length / quests.length) * 100 
    : 0;

  return (
    <>
      <AnimatePresence mode="wait">
        {activeTab === 'quests' ? (
          <QuestUI
            key="quests"
            quests={quests}
            stats={stats}
            progress={questProgress}
            onQuestClick={handleQuestClick}
            onTabChange={setActiveTab}
            activeTab={activeTab}
          />
        ) : (
          <ChallengeUI
            key="challenges"
            challenges={challenges}
            stats={stats}
            onTabChange={setActiveTab}
            activeTab={activeTab}
          />
        )}
      </AnimatePresence>
      
      {/* Quest Modal */}
      <AnimatePresence>
        {isQuestModalOpen && selectedQuest && (
          <div className="fixed inset-0 z-50">
            {renderQuestModal()}
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default QuestChallengeContainer;