// Version 6.0.0 - Corrected props and onClick data flow

import { UserStats } from '@/features/yin/xp/xpService';
import { motion } from 'framer-motion';
import { Sparkles, Zap } from 'lucide-react';
import React from 'react';
import type { Quest } from '../QuestChallengeContainer';
import { QuestTile } from './QuestTile';

interface QuestUIProps {
  quests: Quest[];
  stats: UserStats;
  progress: number;
  onQuestClick: (quest: Quest) => void; // FIX: Expects the full Quest object
  onTabChange: (tab: 'quests' | 'challenges') => void;
  activeTab: 'quests' | 'challenges';
}

export const QuestUI: React.FC<QuestUIProps> = ({
  quests,
  stats,
  progress,
  onQuestClick,
  onTabChange,
  activeTab,
}) => {
  // FIX: Calculate these values internally instead of passing as props
  const questsCompleted = quests.filter(q => q.completed).length;
  const questsTotal = quests.length;

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
              <div className="flex gap-2 mb-6">
                {/* ... tab switcher buttons ... */}
              </div>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h1 className="text-5xl font-bold text-white mb-2">Daily Quests</h1>
                  <p className="text-white/80 text-lg">Complete your daily challenges and unlock your potential</p>
                </div>
                <div className="flex gap-6">
                  <div className="bg-black/20 backdrop-blur-xl rounded-2xl px-6 py-4 border border-white/20">
                    <div className="flex items-center gap-3">
                      <Zap className="w-8 h-8 text-yellow-400" />
                      <div>
                        <p className="text-white/70 text-sm">Total XP</p>
                        <p className="text-3xl font-bold text-yellow-400">{stats.currentXP}</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-black/20 backdrop-blur-xl rounded-2xl px-6 py-4 border border-white/20">
                    <div className="flex items-center gap-3">
                      <Sparkles className="w-8 h-8 text-orange-400" />
                      <div>
                        <p className="text-white/70 text-sm">Daily Streak</p>
                        <p className="text-3xl font-bold text-orange-400">{stats.streak} Days</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="relative">
                <div className="h-8 bg-black/30 rounded-full overflow-hidden backdrop-blur-xl border border-white/20">
                  <motion.div
                    className="h-full bg-gradient-to-r from-green-400 via-emerald-500 to-teal-500"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                  />
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-white font-bold text-lg drop-shadow-lg">
                    {questsCompleted} / {questsTotal} Completed
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
              // FIX: Pass the entire 'quest' object to the handler
              onClick={() => onQuestClick(quest)}
              index={index}
            />
          ))}
          {/* ... "Coming Soon" Tile ... */}
        </motion.div>
      </div>
    </div>
  );
};