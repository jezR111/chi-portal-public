// Version: 1.0.0 - Premium card for displaying a completed challenge

import { motion } from 'framer-motion';
import { Calendar, CheckCircle, Trophy } from 'lucide-react';
import React from 'react';

interface CompletedChallenge {
  id: string;
  title: string;
  description: string;
  tier: number;
  xpReward: number;
  completedDate: string;
}

interface CardProps {
  challenge: CompletedChallenge;
  index: number;
}

export const CompletedChallengeCard: React.FC<CardProps> = ({ challenge, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="bg-gradient-to-br from-green-900/40 via-emerald-900/30 to-gray-900/40 rounded-2xl p-6 border border-green-500/30"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center border border-green-500/30">
            <Trophy className="w-6 h-6 text-green-300" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">{challenge.title}</h3>
            <p className="text-green-300/80 text-sm">{challenge.description}</p>
          </div>
        </div>
        <div className="text-right">
          <span className="text-yellow-400 font-bold text-lg">+{challenge.xpReward} XP</span>
          <p className="text-xs text-white/50">Tier {challenge.tier}</p>
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-green-500/20 text-sm">
        <div className="flex items-center gap-2 text-green-400">
          <CheckCircle className="w-4 h-4" />
          <span>Completed</span>
        </div>
        <div className="flex items-center gap-2 text-white/60">
          <Calendar className="w-4 h-4" />
          <span>{new Date(challenge.completedDate).toLocaleDateString()}</span>
        </div>
      </div>
    </motion.div>
  );
};