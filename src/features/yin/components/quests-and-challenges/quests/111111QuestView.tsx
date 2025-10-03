import { AnimatePresence, motion } from 'framer-motion';
import {
  Activity,
  BookOpen,
  Brain,
  Heart,
  Shield,
  Sparkles,
  Target,
  TrendingUp,
  Trophy,
  Wind,
  Zap
} from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { ChallengeTile } from '../challenges/ChallengeTile';
import { QuestTile } from './QuestTile';

// Import services
import { Challenge, challengeService } from '@/features/yin/services/challengeService';
import { xpService } from '@/features/yin/xp/xpService';

interface Quest {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  gradient: string;
  xp: number;
  duration?: string;
  completed?: boolean;
  action?: () => void;
}

export const QuestView: React.FC = () => {
  const [dailyQuests, setDailyQuests] = useState<Quest[]>([]);
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [totalXP, setTotalXP] = useState(0);
  const [dailyStreak, setDailyStreak] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);
  const [activeTab, setActiveTab] = useState<'quests' | 'challenges'>('quests');
  const [currentTier, setCurrentTier] = useState(1);
  const [completedChallengesCount, setCompletedChallengesCount] = useState(0);

  // Initialize quests and challenges
  useEffect(() => {
    const quests: Quest[] = [
      {
        id: 'meditation',
        title: 'Mindful Meditation',
        description: 'Find your inner peace with a guided meditation session',
        icon: Brain,
        gradient: 'from-purple-500 via-violet-500 to-indigo-600',
        xp: 50,
        duration: '5 min',
        completed: false,
        action: () => completeMeditation()
      },
      {
        id: 'gratitude',
        title: 'Gratitude Journal',
        description: 'Write three things you\'re grateful for today',
        icon: Heart,
        gradient: 'from-pink-500 via-rose-500 to-red-500',
        xp: 30,
        duration: '3 min',
        completed: false,
        action: () => completeGratitude()
      },
      {
        id: 'breathing',
        title: 'Breath of Life',
        description: 'Practice deep breathing exercises for clarity',
        icon: Wind,
        gradient: 'from-cyan-500 via-blue-500 to-indigo-500',
        xp: 40,
        duration: '4 min',
        completed: false,
        action: () => completeBreathing()
      },
      {
        id: 'learning',
        title: 'Wisdom Seeker',
        description: 'Read an inspirational quote and reflect on its meaning',
        icon: BookOpen,
        gradient: 'from-green-500 via-emerald-500 to-teal-500',
        xp: 25,
        duration: '2 min',
        completed: false,
        action: () => completeLearning()
      },
      {
        id: 'movement',
        title: 'Energy Flow',
        description: 'Gentle stretching or yoga to awaken your body',
        icon: Activity,
        gradient: 'from-orange-500 via-amber-500 to-yellow-500',
        xp: 35,
        duration: '5 min',
        completed: false,
        action: () => completeMovement()
      }
    ];

    setDailyQuests(quests);
    setTotalXP(xpService.getTotalXP());
    setDailyStreak(7); // Example streak
    loadChallenges();
  }, []);

  // Load challenges
  const loadChallenges = () => {
    const availableChallenges = challengeService.getAvailableChallenges();
    const allChallenges = challengeService.getAllChallenges();
    
    // Add icons to challenges
    const enhancedChallenges = availableChallenges.map(challenge => ({
      ...challenge,
      icon: challenge.id === 'first-steps' ? Target : 
            challenge.id === 'daily-practice' ? Trophy : Shield
    }));
    
    setChallenges(enhancedChallenges);
    setCurrentTier(challengeService.getCurrentTier());
    setCompletedChallengesCount(allChallenges.filter(c => c.completed).length);
  };

  // Quest completion handlers
  const completeMeditation = () => completeQuest('meditation', 50);
  const completeGratitude = () => completeQuest('gratitude', 30);
  const completeBreathing = () => completeQuest('breathing', 40);
  const completeLearning = () => completeQuest('learning', 25);
  const completeMovement = () => completeQuest('movement', 35);

  const completeQuest = (questId: string, xpReward: number) => {
    setDailyQuests(prev => prev.map(quest => 
      quest.id === questId ? { ...quest, completed: true } : quest
    ));
    
    // Add XP
    xpService.addXP(xpReward, 'quests');
    setTotalXP(xpService.getTotalXP());
    
    // Check challenge progress
    challengeService.checkChallengeProgressFromQuest(questId);
    loadChallenges(); // Reload challenges to update progress
    
    // Check if all quests completed
    const allCompleted = dailyQuests.every(q => q.id === questId || q.completed);
    if (allCompleted) {
      setShowCelebration(true);
      setTimeout(() => setShowCelebration(false), 5000);
    }
  };

  const handleQuestClick = (quest: Quest) => {
    if (!quest.completed && quest.action) {
      quest.action();
    }
  };

  const completedCount = dailyQuests.filter(q => q.completed).length;
  const progressPercentage = (completedCount / dailyQuests.length) * 100;

  return (
    <div className="relative min-h-screen">
      <div className="relative z-10 container mx-auto px-6 py-8 max-w-7xl">
        {/* Header with tabs */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl overflow-hidden relative">
            {/* Inner glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10" />
            
            <div className="relative">
              {/* Tab switcher */}
              <div className="flex gap-2 mb-6">
                <button
                  onClick={() => setActiveTab('quests')}
                  className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                    activeTab === 'quests' 
                      ? 'bg-white/20 text-white border border-white/30' 
                      : 'bg-white/5 text-white/60 hover:bg-white/10 border border-white/10'
                  }`}
                >
                  Daily Quests
                </button>
                <button
                  onClick={() => setActiveTab('challenges')}
                  className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                    activeTab === 'challenges' 
                      ? 'bg-white/20 text-white border border-white/30' 
                      : 'bg-white/5 text-white/60 hover:bg-white/10 border border-white/10'
                  }`}
                >
                  Challenges
                </button>
              </div>
              
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h1 className="text-5xl font-bold text-white mb-2">
                    {activeTab === 'quests' ? 'Daily Quests' : 'Challenges'}
                  </h1>
                  <p className="text-white/80 text-lg">
                    {activeTab === 'quests' 
                      ? 'Complete your daily challenges and unlock your potential'
                      : 'Complete challenges to unlock new tiers and earn rewards'}
                  </p>
                </div>
                
                {/* Stats section */}
                <div className="flex gap-6">
                  {/* XP Counter */}
                  <motion.div 
                    className="bg-black/20 backdrop-blur-xl rounded-2xl px-6 py-4 border border-white/20"
                    whileHover={{ scale: 1.05 }}
                  >
                    <div className="flex items-center gap-3">
                      <Zap className="w-8 h-8 text-yellow-400" 
                        style={{ filter: 'drop-shadow(0 0 12px rgba(251, 191, 36, 0.8))' }}
                      />
                      <div>
                        <p className="text-white/70 text-sm">Total XP</p>
                        <p className="text-3xl font-bold text-yellow-400">{totalXP}</p>
                      </div>
                    </div>
                  </motion.div>
                  
                  {/* Conditional stat based on active tab */}
                  {activeTab === 'quests' ? (
                    <motion.div 
                      className="bg-black/20 backdrop-blur-xl rounded-2xl px-6 py-4 border border-white/20"
                      whileHover={{ scale: 1.05 }}
                    >
                      <div className="flex items-center gap-3">
                        <Sparkles className="w-8 h-8 text-orange-400" 
                          style={{ filter: 'drop-shadow(0 0 12px rgba(251, 146, 60, 0.8))' }}
                        />
                        <div>
                          <p className="text-white/70 text-sm">Daily Streak</p>
                          <p className="text-3xl font-bold text-orange-400">{dailyStreak} Days</p>
                        </div>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div 
                      className="bg-black/20 backdrop-blur-xl rounded-2xl px-6 py-4 border border-white/20"
                      whileHover={{ scale: 1.05 }}
                    >
                      <div className="flex items-center gap-3">
                        <Shield className="w-8 h-8 text-purple-400" 
                          style={{ filter: 'drop-shadow(0 0 12px rgba(168, 85, 247, 0.8))' }}
                        />
                        <div>
                          <p className="text-white/70 text-sm">Current Tier</p>
                          <p className="text-3xl font-bold text-purple-400">{currentTier}</p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>
              </div>
              
              {/* Progress bar */}
              {activeTab === 'quests' && (
                <div className="relative">
                  <div className="h-8 bg-black/30 rounded-full overflow-hidden backdrop-blur-xl border border-white/20">
                    <motion.div
                      className="h-full bg-gradient-to-r from-green-400 via-emerald-500 to-teal-500"
                      initial={{ width: 0 }}
                      animate={{ width: `${progressPercentage}%` }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                      style={{
                        boxShadow: 'inset 0 0 30px rgba(34, 197, 94, 0.4)'
                      }}
                    />
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-white font-bold text-lg drop-shadow-lg">
                      {completedCount} / {dailyQuests.length} Completed
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Content based on active tab */}
        <AnimatePresence mode="wait">
          {activeTab === 'quests' ? (
            <motion.div
              key="quests"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {dailyQuests.map((quest, index) => (
                <QuestTile
                  key={quest.id}
                  quest={quest}
                  onClick={() => handleQuestClick(quest)}
                  index={index}
                />
              ))}
              
              {/* Coming Soon Tile */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: dailyQuests.length * 0.08 }}
                className="relative aspect-square"
              >
                <div className="h-full bg-gradient-to-br from-gray-700/50 to-gray-800/50 backdrop-blur-xl rounded-3xl border border-white/10 flex items-center justify-center">
                  <div className="text-center">
                    <TrendingUp className="w-12 h-12 text-white/40 mx-auto mb-3" />
                    <p className="text-white/60 font-bold text-lg">More Quests</p>
                    <p className="text-white/40 text-sm">Coming Soon</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          ) : (
            <motion.div
              key="challenges"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              {challenges.map((challenge, index) => (
                <ChallengeTile
                  key={challenge.id}
                  challenge={challenge}
                  index={index}
                />
              ))}
              
              {challenges.length === 0 && (
                <div className="text-center py-12">
                  <Shield className="w-16 h-16 text-white/30 mx-auto mb-4" />
                  <p className="text-white/60 text-lg">Complete more quests to unlock challenges!</p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Celebration overlay */}
      <AnimatePresence>
        {showCelebration && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 pointer-events-none"
          >
            <div className="absolute inset-0 bg-black/50" />
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: 180 }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
            >
              <div className="text-center">
                <Trophy className="w-32 h-32 text-yellow-400 mb-6" 
                  style={{ filter: 'drop-shadow(0 0 40px rgba(251, 191, 36, 0.8))' }}
                />
                <h2 className="text-6xl font-bold text-white mb-4">Quest Master!</h2>
                <p className="text-2xl text-white/80">All daily quests completed!</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};