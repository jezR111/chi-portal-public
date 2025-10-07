// src/features/yin/components/quests-and-challenges/QuestChallengeContainer.tsx
// Version: 8.1.0 - Complete container with proper data flow

import { CHALLENGE_REGISTRY } from '@/features/yin/components/quests-and-challenges/challenges/ChallengeRegistry';
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
  X
} from 'lucide-react';
import React, { useCallback, useEffect, useState } from 'react';
import { DevResetButton } from './DevResetButton';
import { ChallengeUI } from './challenges/ChallengeUI';
import { QuestUI } from './quests/QuestUI';
import {
  DailyIntentionQuest,
  GratitudeQuest,
  InsightQuest,
  MeditationQuest,
  MovementQuest
} from './quests/individual-quests';

// Quest Types
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
    id: 'daily-intention',
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
    id: 'insight',
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

// Challenge Icons
const CHALLENGE_ICONS: Record<string, React.ComponentType<any>> = {
  'first-steps': Target,
  'daily-practice': Trophy,
  'meditation-master': Brain,
  'gratitude-champion': Heart,
  'breath-warrior': Wind,
  default: Shield,
};

// Main Component
export const QuestChallengeContainer: React.FC = () => {
  // State
  const [quests, setQuests] = useState<Quest[]>([]);
  const [challenges, setChallenges] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'quests' | 'challenges'>('quests');
  const [challengeStats, setChallengeStats] = useState({ 
    completed: 0, 
    total: 0, 
    currentTier: 1 
  });
  const [selectedQuest, setSelectedQuest] = useState<Quest | null>(null);
  const [showQuestModal, setShowQuestModal] = useState(false);
  
  // XP Hook
  const { addXP, addChallengeXP, ...xpStats } = useXP();

  // Load Quests
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
  }, []);

  // Load Challenges
  const loadChallenges = useCallback(() => {
    // Get available challenges from service
    const availableChallenges = challengeService.getAvailableChallenges();
    const completedChallenges = challengeService.getCompletedChallengesWithDetails();
    
    // Ensure each challenge has the questTracking data from the registry
    const challengesWithFullData = availableChallenges.map(challenge => {
      // Find the full definition from the registry
      const registryDef = CHALLENGE_REGISTRY.find(c => c.id === challenge.id);
      
      // Merge the registry definition with the service data
      return {
        ...registryDef, // Start with registry definition (includes questTracking)
        ...challenge,   // Override with service data (progress, completed, etc)
        questTracking: registryDef?.questTracking || challenge.questTracking // Ensure questTracking is included
      };
    });
    
    console.log('Loaded challenges with tracking:', challengesWithFullData);
    
    setChallenges(challengesWithFullData);
    
    setChallengeStats({
      completed: completedChallenges.length,
      total: CHALLENGE_REGISTRY.length,
      currentTier: challengeService.getCurrentTier(),
    });
  }, []);

  // Initial Load
  useEffect(() => {
    loadQuests();
    loadChallenges();
  }, []);

  // Handle Quest Click
  const handleQuestClick = useCallback((clickedQuest: Quest) => {
  if (clickedQuest.completed) return;

  // FIX: Find the original quest definition from the master QUEST_REGISTRY.
  // This guarantees the 'icon' property is always a valid component.
  const originalQuestDef = QUEST_REGISTRY.find(q => q.id === clickedQuest.id);

  if (originalQuestDef) {
    // Set state using the original definition, but preserve the current 'completed' status
    setSelectedQuest({ ...originalQuestDef, completed: clickedQuest.completed });
    setShowQuestModal(true);
  } else {
    console.error(`Could not find original quest definition for id: ${clickedQuest.id}`);
  }
}, []);
  // Handle Quest Complete
  const handleQuestComplete = useCallback((questId: string) => {
    const quest = quests.find(q => q.id === questId);
    if (!quest) return;

    // Add XP
    addXP(quest.xp, 'quests', `Completed: ${quest.title}`);

    // Update quest state
    const updatedQuests = quests.map(q => 
      q.id === questId ? { ...q, completed: true } : q
    );
    setQuests(updatedQuests);

    // Save progress
    const progressData = updatedQuests.reduce((acc, q) => ({ 
      ...acc, 
      [q.id]: q.completed 
    }), {});
    localStorage.setItem('quest_progress', JSON.stringify(progressData));

    // Check for challenge completion
    const completedChallenge = challengeService.checkAndCompleteChallenge(questId, quest.category);
    
    if (completedChallenge) {
      addChallengeXP(
        completedChallenge.xp, 
        'challenges', 
        `Completed: ${completedChallenge.name}`
      );
      loadChallenges(); // Reload challenges
    }

    // Close modal
    setShowQuestModal(false);
    setSelectedQuest(null);
  }, [quests, addXP, addChallengeXP, loadChallenges]);

  // Handle Reset
  const handleReset = () => {
    // Clear local storage
    localStorage.removeItem('quest_progress');
    localStorage.removeItem('challenge_progress');
    localStorage.removeItem('challenge_state');
    
    // Reload data
    loadQuests();
    loadChallenges();
  };

  // Render Quest Modal Content
  const renderQuestModalContent = () => {
    if (!selectedQuest) return null;

    switch (selectedQuest.type) {
      case 'meditation':
        return (
          <MeditationQuest 
            onComplete={() => handleQuestComplete(selectedQuest.id)}
          />
        );
      case 'gratitude':
        return (
          <GratitudeQuest 
            onComplete={() => handleQuestComplete(selectedQuest.id)}
          />
        );
      case 'movement':
        return (
          <MovementQuest 
            onComplete={() => handleQuestComplete(selectedQuest.id)}
          />
        );
      case 'daily-intention':
        return (
          <DailyIntentionQuest 
            onComplete={() => handleQuestComplete(selectedQuest.id)}
          />
        );
      case 'insight':
        return (
          <InsightQuest 
            onComplete={() => handleQuestComplete(selectedQuest.id)}
          />
        );
      default:
        return (
          <div className="p-6 text-center">
            <p className="text-white/70 mb-4">Quest type not implemented yet</p>
            <button
              onClick={() => handleQuestComplete(selectedQuest.id)}
              className="px-6 py-2 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-lg text-white font-semibold"
            >
              Mark as Complete
            </button>
          </div>
        );
    }
  };

  // Calculate quest stats
  const questsCompleted = quests.filter(q => q.completed).length;
  const questsTotal = quests.length;
  const questProgress = questsTotal > 0 ? (questsCompleted / questsTotal) * 100 : 0;

  return (
    <>
      {/* Tab Content */}
      <AnimatePresence mode="wait">
        {activeTab === 'quests' ? (
          <QuestUI
            key="quests"
            quests={quests}
            stats={{
              ...xpStats,
              questsCompleted,
              questsTotal,
            }}
            progress={questProgress}
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
          />
        )}
      </AnimatePresence>

      {/* Quest Modal */}
      <AnimatePresence>
        {showQuestModal && selectedQuest && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={() => {
              setShowQuestModal(false);
              setSelectedQuest(null);
            }}
          >
            {/* Backdrop */}
            <motion.div
              className="absolute inset-0 bg-black/80 backdrop-blur-xl"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />

            {/* Modal Content */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative z-10 w-full max-w-2xl"
            >
              <div className={`
                bg-gradient-to-br ${selectedQuest.gradient} p-1 rounded-2xl
                shadow-2xl
              `}>
                <div className="bg-gray-900/95 backdrop-blur-xl rounded-2xl">
                  {/* Header */}
                  <div className="p-6 border-b border-white/10">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center">
                          <selectedQuest.icon className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h2 className="text-2xl font-bold text-white">
                            {selectedQuest.title}
                          </h2>
                          <p className="text-white/70">
                            {selectedQuest.description}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          setShowQuestModal(false);
                          setSelectedQuest(null);
                        }}
                        className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center transition-colors"
                      >
                        <X className="w-5 h-5 text-white" />
                      </button>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    {renderQuestModalContent()}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Dev Reset Button */}
      <DevResetButton onReset={handleReset} />
    </>
  );
};

export default QuestChallengeContainer;