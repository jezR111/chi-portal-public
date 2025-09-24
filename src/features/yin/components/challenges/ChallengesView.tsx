// src/features/yin/components/challenges/ChallengesView.tsx

import { motion } from 'framer-motion';
import { Award, Coins, Lock, Star, Trophy, Zap } from 'lucide-react';
import { useEffect, useState } from 'react';
import {
  calculateLevel,
  Challenge,
  getAvailableChallenges,
  getXPForNextLevel,
  levelSystem
} from '../../data/challengesData';

interface ChallengesViewProps {
  userXP: number;
  userTokens: number;
  onChallengeComplete?: (challenge: Challenge) => void;
}

export const ChallengesView = ({ userXP = 0, userTokens = 100, onChallengeComplete }: ChallengesViewProps) => {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [userLevel, setUserLevel] = useState(1);
  const [levelProgress, setLevelProgress] = useState({ current: 0, needed: 100, nextLevel: 2 });
  
  useEffect(() => {
    const level = calculateLevel(userXP);
    setUserLevel(level);
    setLevelProgress(getXPForNextLevel(userXP));
    
    // Get only 3 available challenges for current level
    const available = getAvailableChallenges(level);
    setChallenges(available);
  }, [userXP]);

  const currentLevelData = levelSystem.find(l => l.level === userLevel);
  const nextLevelData = levelSystem.find(l => l.level === userLevel + 1);

  return (
    <div className="space-y-6">
      {/* Level & Token Display */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Level Progress Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-purple-900/30 to-indigo-900/30 backdrop-blur-xl rounded-3xl p-6 border border-purple-500/20"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-xl flex items-center justify-center">
                <Trophy className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-white font-bold">Level {userLevel}</h3>
                <p className="text-purple-300 text-sm">{currentLevelData?.title}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-white font-bold">{userXP} XP</p>
              <p className="text-purple-400 text-xs">
                {levelProgress.needed > 0 ? `${levelProgress.needed} to level ${levelProgress.nextLevel}` : 'Max Level'}
              </p>
            </div>
          </div>
          
          {/* Level Progress Bar */}
          <div className="space-y-2">
            <div className="h-2 bg-black/30 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-purple-500 to-indigo-500"
                initial={{ width: 0 }}
                animate={{ 
                  width: `${nextLevelData ? 
                    ((userXP - currentLevelData!.xpRequired) / (nextLevelData.xpRequired - currentLevelData!.xpRequired)) * 100 
                    : 100}%` 
                }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              />
            </div>
            
            {/* Next Level Perks */}
            {nextLevelData && (
              <div className="mt-3 p-3 bg-black/20 rounded-xl">
                <p className="text-purple-300 text-xs mb-1">Next Level Unlocks:</p>
                <ul className="text-purple-200 text-xs space-y-1">
                  {nextLevelData.perks.slice(0, 2).map((perk, i) => (
                    <li key={i} className="flex items-center gap-1">
                      <Star className="w-3 h-3 text-purple-400" />
                      {perk}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </motion.div>

        {/* Token Balance Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-amber-900/30 to-orange-900/30 backdrop-blur-xl rounded-3xl p-6 border border-amber-500/20"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center">
                <Coins className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-white font-bold">Wisdom Tokens</h3>
                <p className="text-amber-300 text-sm">For unlocking content</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-white font-bold text-2xl">{userTokens}</p>
              <p className="text-amber-400 text-sm">✧WT</p>
            </div>
          </div>
          
          {/* Token Usage Info */}
          <div className="space-y-2 p-3 bg-black/20 rounded-xl">
            <p className="text-amber-300 text-xs font-semibold mb-2">Token Uses:</p>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="flex items-center justify-between text-amber-200">
                <span>Unlock Chapter:</span>
                <span className="font-bold">30-60 ✧</span>
              </div>
              <div className="flex items-center justify-between text-amber-200">
                <span>Unlock Path:</span>
                <span className="font-bold">50-200 ✧</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Active Challenges - Only 3 at a time */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-white">Active Challenges</h2>
          <div className="flex items-center gap-2 text-purple-300 text-sm">
            <Award className="w-4 h-4" />
            <span>{challenges.length} Available</span>
          </div>
        </div>

        <div className="grid gap-4">
          {challenges.map((challenge, index) => (
            <motion.div
              key={challenge.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="relative bg-gradient-to-br from-purple-900/20 to-indigo-900/20 backdrop-blur-xl rounded-2xl p-6 border border-purple-500/20 hover:border-purple-400/30 transition-all"
            >
              {/* Challenge Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-purple-600/30 to-indigo-600/30 rounded-xl flex items-center justify-center text-2xl">
                    {challenge.icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">{challenge.title}</h3>
                    <p className="text-purple-300 text-sm">{challenge.description}</p>
                    <div className="flex items-center gap-3 mt-2">
                      <span className="px-2 py-0.5 bg-purple-600/20 text-purple-300 text-xs rounded-full">
                        Level {challenge.level}
                      </span>
                      <span className="px-2 py-0.5 bg-indigo-600/20 text-indigo-300 text-xs rounded-full">
                        {challenge.category}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Rewards */}
                <div className="text-right">
                  <div className="flex items-center gap-1 text-purple-300 mb-1">
                    <Zap className="w-4 h-4" />
                    <span className="font-bold">+{challenge.rewards.xp} XP</span>
                  </div>
                  <div className="flex items-center gap-1 text-amber-300">
                    <Coins className="w-4 h-4" />
                    <span className="font-bold">+{challenge.rewards.tokens} ✧</span>
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs text-purple-400">
                  <span>Progress</span>
                  <span>{challenge.progress || 0} / {challenge.requirements.target}</span>
                </div>
                <div className="h-2 bg-black/30 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
                    initial={{ width: 0 }}
                    animate={{ width: `${((challenge.progress || 0) / challenge.requirements.target) * 100}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
              </div>

              {/* Complete Button (if challenge is ready) */}
              {challenge.progress && challenge.progress >= challenge.requirements.target && (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onChallengeComplete?.(challenge)}
                  className="mt-4 w-full py-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl text-white font-semibold hover:shadow-lg hover:shadow-purple-500/25 transition-all"
                >
                  Claim Rewards
                </motion.button>
              )}
            </motion.div>
          ))}

          {/* If no challenges available */}
          {challenges.length === 0 && (
            <div className="text-center py-12 bg-black/20 rounded-2xl">
              <Trophy className="w-16 h-16 text-purple-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">All Challenges Complete!</h3>
              <p className="text-purple-300">Check back tomorrow for new challenges</p>
            </div>
          )}
        </div>
      </div>

      {/* Locked Challenges Preview */}
      {userLevel < 3 && (
        <div className="mt-8">
          <div className="flex items-center gap-2 mb-4">
            <Lock className="w-5 h-5 text-gray-500" />
            <h3 className="text-lg font-semibold text-gray-400">Upcoming at Level {userLevel + 1}</h3>
          </div>
          <div className="space-y-2 opacity-50">
            <div className="bg-black/20 rounded-xl p-4 border border-gray-700/30">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-800/50 rounded-lg flex items-center justify-center">
                  <Lock className="w-5 h-5 text-gray-600" />
                </div>
                <div className="flex-1">
                  <p className="text-gray-400 font-medium">New challenges unlock at Level {userLevel + 1}</p>
                  <p className="text-gray-500 text-sm">
                    {levelProgress.needed} XP needed to unlock
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};