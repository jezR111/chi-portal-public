// src/features/yin/components/quests-and-challenges/QuestChallengeContainer.tsx  
// Version: 5.5.0 - Fixed challenge completion flow and added proper completion checks

import { challengeService } from '@/features/yin/services/challengeService';
import { useXP } from '@/features/yin/xp/useXP';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Activity,
  BookOpen,
  Brain,
  Heart,
  Shield,
  Target,
  Trophy,
  Wind,
  Zap
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

// Challenge completion modal component
const ChallengeCompletionModal: React.FC<{
  challenge: any;
  onClose: () => void;
}> = ({ challenge, onClose }) => {
  useEffect(() => {
    // Auto-close after 3 seconds
    const timer = setTimeout(() => {
      onClose();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm"
    >
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        exit={{ scale: 0, rotate: 180 }}
        transition={{ type: "spring", damping: 15 }}
        className="bg-gradient-to-br from-yellow-900/95 to-orange-900/95 rounded-3xl p-8 max-w-md w-full border border-yellow-500/30 relative overflow-hidden"
      >
        {/* Animated background */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-yellow-400"
              initial={{
                x: Math.random() * 400 - 200,
                y: -20,
                rotate: 0,
              }}
              animate={{
                y: 400,
                rotate: 360,
              }}
              transition={{
                duration: 2,
                delay: i * 0.1,
                ease: "easeIn",
              }}
              style={{
                left: `${Math.random() * 100}%`,
              }}
            />
          ))}
        </div>

        <div className="relative text-center">
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 360, 360],
            }}
            transition={{
              duration: 1,
              times: [0, 0.5, 1],
            }}
            className="inline-block mb-6"
          >
            <div className="w-24 h-24 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-2xl">
              <Trophy className="w-12 h-12 text-white" />
            </div>
          </motion.div>

          <h2 className="text-3xl font-bold text-white mb-2">
            Challenge Complete!
          </h2>
          <p className="text-2xl text-yellow-300 font-semibold mb-4">
            {challenge.name}
          </p>
          
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3 }}
            className="inline-flex items-center gap-3 bg-gradient-to-r from-yellow-500/30 to-orange-500/30 px-6 py-3 rounded-full border border-yellow-500/30"
          >
            <Zap className="w-6 h-6 text-yellow-400" />
            <span className="text-2xl font-bold text-yellow-400">
              +{challenge.xp} XP
            </span>
          </motion.div>

          <p className="text-orange-200 mt-4">
            Tier {challenge.tier} Achievement Unlocked!
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
};

// Quest Registry 
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
    id: 'breathing',
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
    id: 'learning',
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
  const [completedChallenge, setCompletedChallenge] = useState<any>(null);
  const [challengeStats, setChallengeStats] = useState({
    completed: 0,
    total: 0,
    currentTier: 1,
  });

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

  // Listen for challenge completion events from ChallengeTile
  useEffect(() => {
    const handleChallengeCompleted = (event: CustomEvent) => {
      console.log('Challenge completed event received:', event.detail);
      const { challengeId, challengeName, tier, xpReward } = event.detail;
      
      // Show celebration
      setCompletedChallenge({
        id: challengeId,
        name: challengeName,
        tier: tier,
        xp: xpReward
      });
      
      // Reload challenges after a delay
      setTimeout(() => {
        loadChallenges();
      }, 3500);
    };

    window.addEventListener('challenge-completed', handleChallengeCompleted as EventListener);
    
    return () => {
      window.removeEventListener('challenge-completed', handleChallengeCompleted as EventListener);
    };
  }, [loadChallenges]);

  const handleQuestClick = useCallback((questId: string) => {
    const quest = quests.find(q => q.id === questId);
    if (!quest || quest.completed) return;
    
    setSelectedQuest(quest);
    setIsQuestModalOpen(true);
  }, [quests]);

  const handleQuestComplete = useCallback((quest: Quest, completionData: any) => {
    // Add XP for the quest
    addXP(quest.xp, 'quests', `Completed: ${quest.title}`);

    // Update quest status
    const updatedQuests = quests.map(q =>
      q.id === quest.id ? { ...q, completed: true } : q
    );
    setQuests(updatedQuests);

    // Save progress
    const progressData = updatedQuests.reduce((acc, q) => ({ ...acc, [q.id]: q.completed }), {});
    localStorage.setItem('quest_progress', JSON.stringify(progressData));

    // Dispatch quest completed event
    window.dispatchEvent(new CustomEvent('quest-completed', {
      detail: { questId: quest.id, category: quest.category }
    }));

    // Note: Challenge completion is now handled by ChallengeTile automatically
  }, [quests, addXP]);

  const handleChallengeComplete = useCallback((challengeId: string, tier: number) => {
    console.log('Challenge complete handler:', challengeId, tier);
    addChallengeXP(tier, challengeId, 7, true);
    loadChallenges();
  }, [addChallengeXP, loadChallenges]);

  const handleCloseModal = useCallback(() => {
    setIsQuestModalOpen(false);
    setTimeout(() => {
      setSelectedQuest(null);
    }, 300);
  }, []);

  const renderQuestModal = () => {
    if (!selectedQuest || !isQuestModalOpen) return null;
    
    const questProps = {
      quest: selectedQuest,
      onComplete: (completionData: any) => handleQuestComplete(selectedQuest, completionData),
      onClose: handleCloseModal,
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

      {/* Challenge Completion Celebration */}
      <AnimatePresence>
        {completedChallenge && (
          <ChallengeCompletionModal
            challenge={completedChallenge}
            onClose={() => setCompletedChallenge(null)}
          />
        )}
      </AnimatePresence>

      {process.env.NODE_ENV === 'development' && (
        <DevResetButton
          onReset={() => {
            localStorage.removeItem('quest_progress');
            localStorage.removeItem('quest_completion_counts');
            challengeService.reset();
            loadQuests();
            loadChallenges();
          }}
        />
      )}
    </>
  );
};

export default QuestChallengeContainer;