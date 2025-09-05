// src/features/yin/components/chapters/ProgressBar.tsx

import { motion } from 'framer-motion';
import { Star, TrendingUp, Zap } from 'lucide-react';
import React from 'react';

interface ProgressBarProps {
  progress?: number;
  level?: number;
  xp?: number;
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress = 0,
  level = 1,
  xp = 0,
  className = ''
}) => {
  const nextLevelXP = calculateNextLevelXP(level);
  const currentLevelXP = calculateCurrentLevelXP(level);
  // Prevent division by zero if next and current level XP are the same
  const levelProgress = nextLevelXP - currentLevelXP > 0 
    ? ((xp - currentLevelXP) / (nextLevelXP - currentLevelXP)) * 100 
    : 0;
  
  return (
    <motion.div
      className={`bg-black/30 backdrop-blur-xl rounded-3xl p-8 border border-purple-500/20 ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      {/* Title Section */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-white">Your Journey Progress</h3>
        <div className="flex items-center gap-4">
          {/* Level Badge */}
          <motion.div
            className="flex items-center gap-2 bg-purple-600/20 px-4 py-2 rounded-full border border-purple-500/30"
            whileHover={{ scale: 1.05 }}
          >
            <Star className="w-4 h-4 text-yellow-400" />
            <span className="text-white font-semibold">Level {level}</span>
          </motion.div>
          
          {/* XP Display */}
          <motion.div
            className="flex items-center gap-2 bg-indigo-600/20 px-4 py-2 rounded-full border border-indigo-500/30"
            whileHover={{ scale: 1.05 }}
          >
            <Zap className="w-4 h-4 text-indigo-400" />
            <span className="text-white font-semibold">{xp.toLocaleString()} XP</span>
          </motion.div>
        </div>
      </div>
      
      {/* Overall Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-purple-400">Overall Progress</span>
          <span className="text-white font-bold">{progress}%</span>
        </div>
        <div className="relative h-4 bg-black/50 rounded-full overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-violet-600 via-purple-600 to-pink-600 opacity-20" />
          <motion.div 
            className="relative h-full bg-gradient-to-r from-violet-600 via-purple-600 to-pink-600 rounded-full shadow-lg shadow-purple-500/50"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
              animate={{ x: ['-100%', '100%'] }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            />
          </motion.div>
          {[25, 50, 75].map((milestone) => (
            <div
              key={milestone}
              className="absolute top-0 bottom-0 w-0.5 bg-purple-400/30"
              style={{ left: `${milestone}%` }}
            />
          ))}
        </div>
      </div>
      
      {/* Level Progress */}
      <div className="mb-6">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-indigo-400">Level Progress</span>
          <span className="text-white text-sm">
            {Math.max(0, xp - currentLevelXP).toLocaleString()} / {Math.max(0, nextLevelXP - currentLevelXP).toLocaleString()} XP to Level {level + 1}
          </span>
        </div>
        <div className="h-2 bg-black/50 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-indigo-500 to-purple-500"
            initial={{ width: 0 }}
            animate={{ width: `${levelProgress}%` }}
            transition={{ duration: 1, delay: 0.5 }}
          />
        </div>
      </div>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-4">
        <motion.div
          className="text-center p-3 bg-purple-500/10 rounded-xl border border-purple-500/20"
          whileHover={{ scale: 1.05 }}
        >
          <p className="text-purple-400 text-sm mb-1">Rank</p>
          <p className="text-white font-bold">{getRankName(level)}</p>
        </motion.div>
        
        <motion.div
          className="text-center p-3 bg-purple-500/10 rounded-xl border border-purple-500/20"
          whileHover={{ scale: 1.05 }}
        >
          <p className="text-purple-400 text-sm mb-1">Next Reward</p>
          <p className="text-white font-bold">
            {level % 5 === 4 ? 'New Badge' : `${((5 - (level % 5)) * 100).toLocaleString()} XP`}
          </p>
        </motion.div>
        
        <motion.div
          className="text-center p-3 bg-purple-500/10 rounded-xl border border-purple-500/20"
          whileHover={{ scale: 1.05 }}
        >
          <p className="text-purple-400 text-sm mb-1">Growth Rate</p>
          <div className="flex items-center justify-center gap-1">
            <TrendingUp className="w-4 h-4 text-green-400" />
            <p className="text-green-400 font-bold">+23%</p>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

// Helper functions
const calculateNextLevelXP = (level: number): number => {
  return 1000 * Math.pow(1.5, level);
};

const calculateCurrentLevelXP = (level: number): number => {
  if (level <= 1) return 0;
  return 1000 * Math.pow(1.5, level - 1);
};

const getRankName = (level: number): string => {
  const ranks = [
    'Seeker', 'Explorer', 'Journeyer', 'Pathfinder', 'Wayfarer', 
    'Navigator', 'Sage', 'Master', 'Enlightened', 'Transcendent'
  ];
  const rankIndex = Math.floor((level - 1) / 5);
  return ranks[Math.min(rankIndex, ranks.length - 1)];
};

export default ProgressBar;
