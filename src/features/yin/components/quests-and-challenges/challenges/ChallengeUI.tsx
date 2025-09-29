// src/features/yin/components/quests-and-challenges/challenges/ChallengeUI.tsx

import { motion } from 'framer-motion';
import { Crown, Shield, Zap } from 'lucide-react';
import React from 'react';
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
  const progressPercentage = stats.challengesTotal > 0 
    ? (stats.challengesCompleted / stats.challengesTotal) * 100 
    : 0;

  return (
    <div className="relative min-h-screen">
      <div className="relative z-10 container mx-auto px-6 py-8 max-w-7xl">
        {/* Header */}
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
              
              {/* Header content */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h1 className="text-5xl font-bold text-white mb-2">
                    Epic Challenges
                  </h1>
                  <p className="text-white/80 text-lg">
                    Rise through the tiers and become legendary
                  </p>
                </div>
                
                {/* Stats */}
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
              
              {/* Progress bar */}
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

        {/* Challenges Grid */}
        <div className="space-y-6">
          {challenges.map((challenge, index) => (
            <ChallengeTile
              key={challenge.id}
              challenge={{
                id: challenge.id,
                title: challenge.title,
                description: challenge.description,
                tier: challenge.tier || 1,
                xpReward: challenge.xpReward || 100,
                progress: challenge.progress || 0,
                maxProgress: challenge.required || 1,
                completed: challenge.completed || false,
                locked: challenge.locked || false,
                icon: challenge.icon,
                gradient: challenge.gradient
              }}
              index={index}
            />
          ))}
          
          {/* Empty state */}
          {challenges.length === 0 && (
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
    </div>
  );
};