// src/features/yin/components/quests-and-challenges/challenges/CompletedChallenges.tsx
// Version: 2.0.0 - Integrated premium CompletedChallengeCard

import { motion } from 'framer-motion';
import { ArrowLeft, Star, Trophy } from 'lucide-react';
import React from 'react';
import { CompletedChallengeCard } from './CompletedChallengeCard';

interface CompletedChallenge {
  id: string;
  title: string;
  description: string;
  tier: number;
  xpReward: number;
  completedDate: string;
  category?: string;
}

interface CompletedChallengesProps {
  completedChallenges: CompletedChallenge[];
  onBack: () => void;
}

export const CompletedChallenges: React.FC<CompletedChallengesProps> = ({ 
  completedChallenges, 
  onBack 
}) => {
  const challengesByTier = completedChallenges.reduce((acc, challenge) => {
    const tier = challenge.tier;
    if (!acc[tier]) acc[tier] = [];
    acc[tier].push(challenge);
    return acc;
  }, {} as Record<number, CompletedChallenge[]>);

  const totalXP = completedChallenges.reduce((sum, c) => sum + c.xpReward, 0);

  return (
    <div className="relative min-h-screen">
      <div className="relative z-10 container mx-auto px-6 py-8 max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <button
            onClick={onBack}
            className="mb-4 flex items-center gap-2 text-purple-400 hover:text-purple-300 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Challenges
          </button>
          
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold text-white mb-2">Completed Challenges</h1>
                <p className="text-white/80">Your journey of accomplishments</p>
              </div>
              
              <div className="flex gap-4">
                <div className="bg-black/20 backdrop-blur-xl rounded-2xl px-6 py-4 border border-white/20">
                  <div className="flex items-center gap-3">
                    <Trophy className="w-8 h-8 text-yellow-400" />
                    <div>
                      <p className="text-white/70 text-sm">Total Completed</p>
                      <p className="text-3xl font-bold text-yellow-400">{completedChallenges.length}</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-black/20 backdrop-blur-xl rounded-2xl px-6 py-4 border border-white/20">
                  <div className="flex items-center gap-3">
                    <Star className="w-8 h-8 text-purple-400" />
                    <div>
                      <p className="text-white/70 text-sm">Total XP Earned</p>
                      <p className="text-3xl font-bold text-purple-400">{totalXP}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="space-y-8">
          {Object.entries(challengesByTier)
            .sort(([a], [b]) => Number(b) - Number(a))
            .map(([tier, challenges]) => (
              <motion.div
                key={tier}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Number(tier) * 0.1 }}
              >
                <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                  Tier {tier}
                  <span className="text-sm text-white/60">({challenges.length} completed)</span>
                </h2>
                
                <div className="grid md:grid-cols-2 gap-4">
                  {challenges.map((challenge, idx) => (
                    <CompletedChallengeCard
                      key={challenge.id}
                      challenge={challenge}
                      index={idx}
                    />
                  ))}
                </div>
              </motion.div>
            ))}
        </div>

        {completedChallenges.length === 0 && (
          <div className="text-center py-12">
            <Trophy className="w-16 h-16 text-white/30 mx-auto mb-4" />
            <p className="text-white/60 text-lg">No completed challenges yet</p>
            <p className="text-white/40">Complete challenges to see them here!</p>
          </div>
        )}
      </div>
    </div>
  );
};