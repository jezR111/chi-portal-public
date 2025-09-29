// src/features/yin/components/quests-and-challenges/quests/QuestUI.tsx

import { motion } from 'framer-motion';
import { Sparkles, TrendingUp, Zap } from 'lucide-react';
import React from 'react';
import type { Quest } from '../QuestChallengeContainer';
import { QuestTile } from './QuestTile';

interface QuestUIProps {
  quests: Quest[];
  stats: {
    totalXP: number;
    dailyStreak: number;
    questsCompleted: number;
    questsTotal: number;
  };
  progress: number;
  onQuestClick: (questId: string) => void;
  onTabChange: (tab: 'quests' | 'challenges') => void;
  activeTab: 'quests' | 'challenges';
}

/**
 * Pure presentational component for Quest UI
 * Receives all data and callbacks via props
 */
export const QuestUI: React.FC<QuestUIProps> = ({
  quests,
  stats,
  progress,
  onQuestClick,
  onTabChange,
  activeTab
}) => {
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
                      ? 'bg-white/20 text-white border border-white/30' 
                      : 'bg-white/5 text-white/60 hover:bg-white/10 border border-white/10'
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
                    Daily Quests
                  </h1>
                  <p className="text-white/80 text-lg">
                    Complete your daily challenges and unlock your potential
                  </p>
                </div>
                
                {/* Stats */}
                <div className="flex gap-6">
                  <div className="bg-black/20 backdrop-blur-xl rounded-2xl px-6 py-4 border border-white/20">
                    <div className="flex items-center gap-3">
                      <Zap className="w-8 h-8 text-yellow-400" />
                      <div>
                        <p className="text-white/70 text-sm">Total XP</p>
                        <p className="text-3xl font-bold text-yellow-400">{stats.totalXP}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-black/20 backdrop-blur-xl rounded-2xl px-6 py-4 border border-white/20">
                    <div className="flex items-center gap-3">
                      <Sparkles className="w-8 h-8 text-orange-400" />
                      <div>
                        <p className="text-white/70 text-sm">Daily Streak</p>
                        <p className="text-3xl font-bold text-orange-400">{stats.dailyStreak} Days</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Progress bar */}
              <div className="relative">
                <div className="h-8 bg-black/30 rounded-full overflow-hidden backdrop-blur-xl border border-white/20">
                  <motion.div
                    className="h-full bg-gradient-to-r from-green-400 via-emerald-500 to-teal-500"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                  />
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-white font-bold text-lg drop-shadow-lg">
                    {stats.questsCompleted} / {stats.questsTotal} Completed
                  </span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Quest Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {quests.map((quest, index) => (
            <QuestTile
              key={quest.id}
              quest={quest}
              onClick={() => onQuestClick(quest.id)}
              index={index}
            />
          ))}
          
          {/* Coming Soon Tile */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: quests.length * 0.08 }}
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
      </div>
    </div>
  );
};