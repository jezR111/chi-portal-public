// src/features/yin/components/quests-and-challenges/QuestChallengeContainer.tsx
// Version: 5.3.0 - Fixed ID handling and modal issues

import { challengeService } from '@/features/yin/services/challengeService';
import { useXP } from '@/features/yin/xp/useXP';
import { AnimatePresence } from 'framer-motion';
import {
  Activity,
  BookOpen,
  Brain,
  Heart,
  Shield,
  Target,
  Trophy,
  Wind,
} from 'lucide-react';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { DevResetButton } from './DevResetButton';
import { ChallengeUI } from './challenges/ChallengeUI';
import { QuestUI } from './quests/QuestUI';
import {
  DailyIntentionQuest,
  GratitudeQuest,
  InsightQuest,
  MeditationQuest,
  MovementQuest,
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

// Quest Registry - FIXED IDs to match what QuestTile expects
const QUEST_REGISTRY: Quest[] = [
    {
        id: 'meditation',  // Simplified IDs that match the accentColors in QuestTile
        type: 'meditation',
        title: 'Mindful Meditation',
        description: 'Find your inner peace with a guided meditation session',
        icon: Brain,
        gradient: 'from-purple-500 via-violet-500 to-indigo-600',
        xp: 50,
        duration: '5 min',
        completed: false,
        category: 'mindfulness',
    },
    {
        id: 'gratitude',
        type: 'gratitude',
        title: 'Gratitude Journal',
        description: "Write three things you're grateful for today",
        icon: Heart,
        gradient: 'from-pink-500 via-rose-500 to-red-500',
        xp: 30,
        duration: '3 min',
        completed: false,
        category: 'journaling',
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
        category: 'movement',
    },
    {
        id: 'breathing',  // Changed to match QuestTile's accentColors
        type: 'daily-intention',
        title: 'Set Daily Intention',
        description: 'Define your focus and purpose for today',
        icon: Target,
        gradient: 'from-blue-500 via-cyan-500 to-teal-500',
        xp: 25,
        duration: '2 min',
        completed: false,
        category: 'planning',
    },
    {
        id: 'learning',  // Changed to match QuestTile's accentColors
        type: 'insight',
        title: 'Capture Insight',
        description: 'Record a meaningful realization or learning',
        icon: BookOpen,
        gradient: 'from-green-500 via-emerald-500 to-teal-500',
        xp: 40,
        duration: '3 min',
        completed: false,
        category: 'reflection',
    },
];

// Challenge icon mapping
const CHALLENGE_ICONS: Record<string, React.ComponentType<any>> = {
  'first-steps': Target, 
  'daily-practice': Trophy, 
  'meditation-master': Brain,
  'gratitude-champion': Heart, 
  'breath-warrior': Wind, 
  default: Shield,
};

export const QuestChallengeContainer: React.FC = () => {
  const [quests, setQuests] = useState<Quest[]>([]);
  const [challenges, setChallenges] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'quests' | 'challenges'>('quests');
  const [selectedQuest, setSelectedQuest] = useState<Quest | null>(null);
  const [isQuestModalOpen, setIsQuestModalOpen] = useState(false);
  const [challengeStats, setChallengeStats] = useState({
      completed: 0,
      total: 0,
      currentTier: 1,
  });

  // Use the full, stable API from the centralized hook
  const { addXP, addChallengeXP, ...xpStats } = useXP();

  const isInitialized = useRef(false);

  const loadQuests = useCallback(() => {
    const saved = localStorage.getItem('quest_progress');
    let questData = [...QUEST_REGISTRY];
    if (saved) {
      try {
        const savedProgress = JSON.parse(saved);
        questData = questData.map(q => ({
          ...q,
          completed: savedProgress[q.id] || false,
        }));
      } catch (e) { 
        console.error('Failed to load quest progress:', e); 
      }
    }
    setQuests(questData);
  }, []);

  const loadChallenges = useCallback(() => {
    const allChallenges = challengeService.getAllChallenges();
    const availableChallenges = challengeService.getAvailableChallenges();
    const completedChallenges = challengeService.getCompletedChallenges();

    const enhancedChallenges = availableChallenges.map(availChallenge => ({
      ...availChallenge,
      ...allChallenges.find(c => c.id === availChallenge.id),
      icon: CHALLENGE_ICONS[availChallenge.id] || CHALLENGE_ICONS.default,
      gradient: getGradientForChallenge(availChallenge.id),
    }));
    setChallenges(enhancedChallenges);

    const completedCount = completedChallenges.length;
    const tier = Math.floor(completedCount / 5) + 1;

    setChallengeStats({
        completed: completedCount,
        total: allChallenges.length,
        currentTier: tier,
    });
  }, []);

  const getGradientForChallenge = (id: string): string => {
    const gradients: Record<string, string> = {
      'first-steps': 'from-blue-500 via-purple-500 to-pink-500',
      'daily-practice': 'from-yellow-400 via-orange-500 to-red-500',
      'meditation-master': 'from-purple-500 via-indigo-500 to-blue-600',
      'gratitude-champion': 'from-pink-400 via-rose-500 to-red-500',
      'breath-warrior': 'from-cyan-400 via-blue-500 to-indigo-600',
    };
    return gradients[id] || 'from-gray-500 to-gray-700';
  };

  useEffect(() => {
    if (!isInitialized.current) {
      isInitialized.current = true;
      loadQuests();
      loadChallenges();
    }
  }, [loadQuests, loadChallenges]);

  // Handle quest click - ensure questId is properly handled
  const handleQuestClick = useCallback((questId: string) => {
    console.log('Quest clicked with ID:', questId); // Debug log
    
    if (!questId) {
      console.error('No questId provided to handleQuestClick');
      return;
    }
    
    const quest = quests.find(q => q.id === questId);
    if (!quest) {
      console.error(`Could not find quest with id: ${questId}`);
      console.log('Available quests:', quests.map(q => q.id)); // Debug log
      return;
    }
    
    if (quest.completed) {
      console.log(`Quest ${questId} already completed`);
      return;
    }
    
    setSelectedQuest(quest);
    setIsQuestModalOpen(true);
  }, [quests]);

  const handleQuestComplete = useCallback((quest: Quest, completionData: any) => {
    // Use the quest's own XP value directly
    addXP(quest.xp, 'quests', `Completed: ${quest.title}`);

    const updatedQuests = quests.map(q =>
      q.id === quest.id ? { ...q, completed: true } : q
    );
    setQuests(updatedQuests);

    const progressData = updatedQuests.reduce((acc, q) => ({ ...acc, [q.id]: q.completed }), {});
    localStorage.setItem('quest_progress', JSON.stringify(progressData));

    // FIX: Pass both id and category for proper challenge tracking
    const completedChallenge = challengeService.checkChallengeProgressFromQuest({
      id: quest.id,
      category: quest.category
    });
    
    if (completedChallenge) {
      console.log('Challenge completed:', completedChallenge.name);
      loadChallenges();
    }
    // The extra brace was here, now removed
  }, [quests, addXP, loadChallenges]);

  const handleChallengeComplete = useCallback((challengeId: string, tier: number) => {
    addChallengeXP(tier, challengeId, 7, true);
    loadChallenges();
  }, [addChallengeXP, loadChallenges]);

  const handleCloseModal = useCallback(() => {
    setIsQuestModalOpen(false);
    setTimeout(() => {
      setSelectedQuest(null);
    }, 300); // Clear selection after animation
  }, []);

  const renderQuestModal = () => {
    if (!selectedQuest || !isQuestModalOpen) return null;
    
    const questProps = {
      quest: selectedQuest,
      onComplete: (completionData: any) => handleQuestComplete(selectedQuest, completionData),
      onClose: handleCloseModal,
    };
    
    // Map quest type properly
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

  const questProgress = quests.length > 0 
    ? (quests.filter(q => q.completed).length / quests.length) * 100 
    : 0;

  const completedQuestCount = quests.filter(q => q.completed).length;
  const totalQuestCount = quests.length;

  return (
    <>
      <AnimatePresence mode="wait">
        {activeTab === 'quests' ? (
          <QuestUI
            key="quests"
            quests={quests}
            stats={xpStats}
            progress={questProgress}
            questsCompleted={completedQuestCount}
            questsTotal={totalQuestCount}
            onQuestClick={handleQuestClick}
            onTabChange={setActiveTab}
            activeTab={activeTab}
          />
        ) : (
          <ChallengeUI
            key="challenges"
            challenges={challenges}
            stats={{
                ...xpStats,
                currentTier: challengeStats.currentTier,
                challengesCompleted: challengeStats.completed,
                challengesTotal: challengeStats.total,
            }}
            onTabChange={setActiveTab}
            activeTab={activeTab}
            onChallengeComplete={handleChallengeComplete}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isQuestModalOpen && selectedQuest && (
          <div className="fixed inset-0 z-50">
            {renderQuestModal()}
          </div>
        )}
      </AnimatePresence>

      {process.env.NODE_ENV === 'development' && (
        <DevResetButton onReset={() => {
          localStorage.removeItem('quest_progress');
          challengeService.reset();
          loadQuests();
          loadChallenges();
        }} />
      )}
    </>
  );
};

export default QuestChallengeContainer;