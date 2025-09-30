// src/features/yin/components/quests-and-challenges/challenges/ChallengeUI.tsx

import { challengeService } from '@/features/yin/services/challengeService';
import { AnimatePresence, motion } from 'framer-motion';
import { Check, ChevronDown, Crown, Shield, Sparkles, Zap } from 'lucide-react';
import React, { useState } from 'react';
import { ChallengeTile } from './ChallengeTile';

interface ChallengeUIProps {
  challenges: any[];
  stats: {
    totalXP: number;
    currentTier: number;
    challengesCompleted: number;
    challengesTotal: number;
  };
  onTabChange: (tab: 'quests' | 'challenges') => void;
  activeTab: 'quests' | 'challenges';
}

export const ChallengeUI: React.FC<ChallengeUIProps> = ({
  challenges,
  stats,
  onTabChange,
  activeTab
}) => {
  const [expandedChallenge, setExpandedChallenge] = useState<string | null>(null);
  const progressPercentage = stats.challengesTotal > 0 
    ? (stats.challengesCompleted / stats.challengesTotal) * 100 
    : 0;

  const completedChallenges = challengeService.getCompletedChallenges();

  const handleChallengeClick = (challengeId: string) => {
    setExpandedChallenge(expandedChallenge === challengeId ? null : challengeId);
  };

  const questInfo: Record<string, { name: string; icon: string }> = {
    'meditation': { name: 'Mindful Meditation', icon: '🧘' },
    'gratitude': { name: 'Gratitude Journal', icon: '💝' },
    'movement': { name: 'Energy Flow', icon: '⚡' },
    'learning': { name: 'Set Daily Intention', icon: '🎯' },
    'breathing': { name: 'Capture Insight', icon: '💡' }
  };

  return (
    <div className="relative min-h-screen">
      <div className="relative z-10 container mx-auto px-6 py-8 max-w-7xl">
        {/* Header - keeping existing */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10" />
            
            <div className="relative">
              {/* Tab switcher */}
              <div className="flex gap-2 mb-6">
                <button
                  onClick={() => onTabChange('quests')}
                  className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                    activeTab === 'quests' 
                      ? 'bg-white/5 text-white/60 hover:bg-white/10 border border-white/10'
                      : 'bg-white/20 text-white border border-white/30'
                  }`}
                >
                  Daily Quests
                </button>
                <button
                  onClick={() => onTabChange('challenges')}
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
                    Epic Challenges
                  </h1>
                  <p className="text-white/80 text-lg">
                    Rise through the tiers and become legendary
                  </p>
                </div>
                
                <div className="flex gap-6">
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
                        <p className="text-3xl font-bold text-yellow-400">{stats.totalXP}</p>
                      </div>
                    </div>
                  </motion.div>
                  
                  <motion.div 
                    className="bg-black/20 backdrop-blur-xl rounded-2xl px-6 py-4 border border-white/20"
                    whileHover={{ scale: 1.05 }}
                  >
                    <div className="flex items-center gap-3">
                      <Crown className="w-8 h-8 text-purple-400" 
                        style={{ filter: 'drop-shadow(0 0 12px rgba(168, 85, 247, 0.8))' }}
                      />
                      <div>
                        <p className="text-white/70 text-sm">Current Tier</p>
                        <p className="text-3xl font-bold text-purple-400">Tier {stats.currentTier}</p>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </div>
              
              <div className="relative">
                <div className="h-8 bg-black/30 rounded-full overflow-hidden backdrop-blur-xl border border-white/20">
                  <motion.div
                    className="h-full bg-gradient-to-r from-green-400 via-emerald-500 to-purple-500"
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
                    {stats.challengesCompleted} / {stats.challengesTotal} Completed
                  </span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Active Challenges */}
        {challenges.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-6">Active Challenges</h2>
            <div className="space-y-6">
              {challenges.map((challenge, index) => {
                const isExpanded = expandedChallenge === challenge.id;
                
                return (
                  <div key={challenge.id}>
                    <div 
                      onClick={() => challenge.questRequirements && handleChallengeClick(challenge.id)}
                      className={challenge.questRequirements ? 'cursor-pointer' : ''}
                    >
                      <ChallengeTile
                        challenge={{
                          id: challenge.id,
                          title: challenge.title,
                          description: challenge.description,
                          tier: challenge.tier || 1,
                          xpReward: challenge.xpReward || 100,
                          progress: challenge.progress || 0,
                          maxProgress: challenge.required || 1,
                          completed: false,
                          locked: challenge.locked || false,
                          icon: challenge.icon,
                          gradient: challenge.gradient || 'from-yellow-400 via-orange-500 to-red-600'
                        }}
                        index={index}
                      />
                    </div>
                    
                    {/* Expand indicator */}
                    {challenge.questRequirements && (
                      <div className="flex justify-center -mt-4 mb-2 relative z-20">
                        <motion.div
                          animate={{ rotate: isExpanded ? 180 : 0 }}
                          className="bg-black/50 backdrop-blur-xl rounded-full p-2 border border-white/20"
                        >
                          <ChevronDown className="w-5 h-5 text-white/60" />
                        </motion.div>
                      </div>
                    )}
                    
                    {/* Expandable Quest Requirements */}
                    <AnimatePresence>
                      {isExpanded && challenge.questRequirements && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <div className="bg-black/30 backdrop-blur-xl rounded-3xl p-6 border border-white/20 mb-4">
                            <p className="text-sm text-white/60 mb-4 flex items-center gap-2">
                              <Sparkles className="w-4 h-4 text-purple-400" />
                              Complete these quests to unlock:
                            </p>
                            <div className="grid gap-3">
                              {challenge.questRequirements.map((questId: string) => {
                                const questProgress = localStorage.getItem('quest_progress');
                                const completed = questProgress ? JSON.parse(questProgress)[questId] : false;
                                const quest = questInfo[questId] || { name: questId, icon: '📝' };
                                
                                return (
                                  <motion.div
                                    key={questId}
                                    initial={{ x: -20, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    className={`
                                      flex items-center gap-4 p-4 rounded-2xl
                                      backdrop-blur-xl border transition-all duration-300
                                      ${completed 
                                        ? 'bg-gradient-to-r from-green-500/20 to-emerald-500/20 border-green-500/30' 
                                        : 'bg-white/5 border-white/10 hover:bg-white/10'
                                      }
                                    `}
                                  >
                                    <span className="text-2xl">{quest.icon}</span>
                                    <span className={`flex-1 font-medium text-lg ${
                                      completed ? 'text-green-400' : 'text-white/70'
                                    }`}>
                                      {quest.name}
                                    </span>
                                    <div className={`
                                      w-8 h-8 rounded-full flex items-center justify-center
                                      ${completed 
                                        ? 'bg-green-500 shadow-lg shadow-green-500/50' 
                                        : 'bg-white/10 border-2 border-white/30'
                                      }
                                    `}>
                                      {completed && (
                                        <motion.div
                                          initial={{ scale: 0 }}
                                          animate={{ scale: 1 }}
                                          transition={{ type: "spring", stiffness: 500 }}
                                        >
                                          <Check className="w-5 h-5 text-white" />
                                        </motion.div>
                                      )}
                                    </div>
                                  </motion.div>
                                );
                              })}
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Completed Challenges */}
        {completedChallenges.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-white/60 mb-6">Completed Challenges</h2>
            <div className="space-y-6">
              {completedChallenges.map((challenge, index) => (
                <ChallengeTile
                  key={`completed-${challenge.id}`}
                  challenge={{
                    id: challenge.id,
                    title: challenge.title,
                    description: challenge.description,
                    tier: challenge.tier || 1,
                    xpReward: challenge.xpReward || 100,
                    progress: challenge.required || 1,
                    maxProgress: challenge.required || 1,
                    completed: true,
                    locked: false,
                    icon: challenge.icon,
                    gradient: 'from-gray-600 to-gray-700'
                  }}
                  index={index}
                />
              ))}
            </div>
          </div>
        )}
        
        {/* Empty state */}
        {challenges.length === 0 && completedChallenges.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <Shield className="w-16 h-16 text-white/30 mx-auto mb-4" />
            <p className="text-white/60 text-lg">Complete more quests to unlock challenges!</p>
          </motion.div>
        )}
      </div>
    </div>
  );
};