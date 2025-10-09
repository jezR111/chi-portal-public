// Version: 3.0.0 - Integrated completed view, simplified tier display, and added "no challenges" message.
'use client';

import { challengeService } from '@/features/yin/services/challengeService';
import { motion } from 'framer-motion';
import { Crown, Trophy, Zap } from 'lucide-react';
import React, { useState } from 'react';
import { ChallengeTile } from './ChallengeTile';
import { CompletedChallenges } from './CompletedChallenges';

interface ChallengeUIProps {
  challenges: any[];
  stats: {
    currentXP: number;
    currentTier: number;
    challengesCompleted: number;
    challengesTotal: number;
  };
  onTabChange: (tab: 'quests' | 'challenges') => void;
  activeTab: 'quests' | 'challenges';
  onChallengeComplete?: (challengeId: string, tier: number) => void; // Add this
}

export const ChallengeUI: React.FC<ChallengeUIProps> = ({
  challenges,
  stats,
  onTabChange,
  activeTab,
}) => {
  const [view, setView] = useState<'available' | 'completed'>('available');

  const completedChallenges = challengeService.getCompletedChallengesWithDetails();

  if (view === 'completed') {
    return (
      <CompletedChallenges
        completedChallenges={completedChallenges}
        onBack={() => setView('available')}
      />
    );
  }

  return (
    <div className="relative min-h-screen">
      <div className="relative z-10 container mx-auto px-6 py-8 max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10" />

            <div className="relative">
              <div className="flex justify-between items-center mb-6">
                <div className="flex gap-2">
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
                <button
                  onClick={() => setView('completed')}
                  className="px-4 py-2 text-sm bg-white/5 hover:bg-white/10 rounded-md text-gray-300 transition-colors flex items-center gap-2"
                >
                  <Trophy className="w-4 h-4" />
                  View Completed
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
                      <Zap
                        className="w-8 h-8 text-yellow-400"
                        style={{
                          filter: 'drop-shadow(0 0 12px rgba(251, 191, 36, 0.8))',
                        }}
                      />
                      <div>
                        <p className="text-white/70 text-sm">Total XP</p>
                        <p className="text-3xl font-bold text-yellow-400">
                          {stats.currentXP}
                        </p>
                      </div>
                    </div>
                  </motion.div>

                  <motion.div
                    className="bg-black/20 backdrop-blur-xl rounded-2xl px-6 py-4 border border-white/20"
                    whileHover={{ scale: 1.05 }}
                  >
                    <div className="flex items-center gap-3">
                      <Crown
                        className="w-8 h-8 text-purple-400"
                        style={{
                          filter: 'drop-shadow(0 0 12px rgba(168, 85, 247, 0.8))',
                        }}
                      />
                      <div>
                        <p className="text-white/70 text-sm">Current Tier</p>
                        <p className="text-3xl font-bold text-purple-400">
                          Tier {stats.currentTier}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </div>

              <div className="text-center py-2 bg-black/20 rounded-full">
                <span className="text-white font-bold text-lg">
                  {stats.challengesCompleted} Challenges Completed
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="space-y-6">
          {challenges.length > 0 ? (
            challenges.map((challenge: any, index: number) => (
              <ChallengeTile
                key={challenge.id}
                challenge={{ ...challenge, xpReward: challenge.xp }}
                index={index}
              />
            ))
          ) : (
            <div className="text-center py-12 bg-black/30 backdrop-blur-xl rounded-3xl border border-purple-500/20">
              <Crown className="w-12 h-12 text-purple-400 mx-auto mb-4" />
              <p className="text-purple-300 text-lg">All available challenges are complete!</p>
              <p className="text-white/60 mt-2">New challenges will be unlocked as you progress.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};