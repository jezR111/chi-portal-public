// src/features/yin/components/quests/ChallengesView.tsx

import { motion } from 'framer-motion';
import { Lock, Star, TrendingUp, Trophy } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { allChallenges, allChallengesCompleted, getActiveChallenges, getUpcomingChallenges } from '../../data/progressiveChallenges';
import { challengeService } from '../../services/challengeService';

export const ChallengesView: React.FC = () => {
  const [userXP, setUserXP] = useState(() => {
    const saved = localStorage.getItem('yinProgress');
    if (saved) {
      const data = JSON.parse(saved);
      return data.savedXP || 300;
    }
    return 300;
  });

  const [completedChallenges, setCompletedChallenges] = useState<string[]>(() => {
    // Sync with challengeService
    const serviceProgress = challengeService.getProgress();
    return serviceProgress.completed;
  });

  const [challengeProgress, setChallengeProgress] = useState<Record<string, number>>(() => {
    const saved = localStorage.getItem('challengeProgress');
    return saved ? JSON.parse(saved) : {};
  });

  // Get active and upcoming challenges
  const activeChallenges = getActiveChallenges(userXP, completedChallenges);
  const upcomingChallenges = getUpcomingChallenges(userXP, completedChallenges);
  const completedChallengesList = allChallenges.filter(c => completedChallenges.includes(c.id));
  const allCompleted = allChallengesCompleted(completedChallenges);

  // Save progress
  useEffect(() => {
    localStorage.setItem('completedChallenges', JSON.stringify(completedChallenges));
    localStorage.setItem('challengeProgress', JSON.stringify(challengeProgress));
  }, [completedChallenges, challengeProgress]);

  // Listen for quest/lesson completions to update progress
  useEffect(() => {
    // Listen for challenge completions from our service
    const handleChallengeCompleted = (e: CustomEvent) => {
      const { challengeId, challengeName, xpReward, progress } = e.detail;
      console.log('Challenge completed event received:', challengeId, 'with XP:', xpReward);
      
      // Update our local state to match the service
      setCompletedChallenges(progress.completed);
      
      // Update progress for the specific challenge - set to target value
      setChallengeProgress(prev => {
        const challenge = allChallenges.find(c => c.id === challengeId);
        const targetValue = challenge?.target || 1;
        return {
          ...prev,
          [challengeId]: targetValue // Set to target to show as complete
        };
      });
      
      // Award bonus XP for challenge completion
      const saved = localStorage.getItem('yinProgress');
      const data = saved ? JSON.parse(saved) : { savedXP: 300 };
      data.savedXP = (data.savedXP || 300) + xpReward;
      localStorage.setItem('yinProgress', JSON.stringify(data));
      setUserXP(data.savedXP);
      
      // Update today's XP as well
      const todaySaved = localStorage.getItem('completedQuestsToday');
      if (todaySaved) {
        const todayData = JSON.parse(todaySaved);
        todayData.totalXP = (todayData.totalXP || 0) + xpReward;
        localStorage.setItem('completedQuestsToday', JSON.stringify(todayData));
        
        // Dispatch event to update QuestView header
        window.dispatchEvent(new StorageEvent('storage', {
          key: 'completedQuestsToday',
          newValue: JSON.stringify(todayData),
          url: window.location.href
        }));
      }
      
      // Show celebration notification
      const celebration = document.createElement('div');
      celebration.className = 'fixed top-20 left-1/2 transform -translate-x-1/2 z-50';
      celebration.innerHTML = `
        <div class="bg-gradient-to-r from-amber-500 to-yellow-500 px-6 py-3 rounded-xl shadow-2xl animate-bounce">
          <div class="text-white font-bold">🏆 Challenge Complete: ${challengeName}! +${xpReward} Bonus XP!</div>
        </div>
      `;
      document.body.appendChild(celebration);
      setTimeout(() => celebration.remove(), 3000);
    };

    // Update challenge progress based on quest completions  
    const updateChallengeProgress = () => {
      const completedToday = localStorage.getItem('completedQuestsToday');
      if (completedToday) {
        const data = JSON.parse(completedToday);
        if (data.date === new Date().toDateString() && data.quests) {
          // Update progress for daily-practice based on quests completed
          setChallengeProgress(prev => ({
            ...prev,
            'daily-practice': data.quests.length,
            'first-steps': data.quests.length > 0 ? 1 : 0
          }));
        }
      }
    };

    // Listen for storage changes
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'challengeProgress') {
        // Sync with challengeService when it updates
        const serviceProgress = challengeService.getProgress();
        setCompletedChallenges(serviceProgress.completed);
      }
      
      if (e.key === 'completedQuestsToday') {
        updateChallengeProgress();
      }
    };

    // Initial load - check current progress
    updateChallengeProgress();

    window.addEventListener('challengeCompleted', handleChallengeCompleted as EventListener);
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('challengeCompleted', handleChallengeCompleted as EventListener);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const handleClaimReward = (challengeId: string, xpReward: number) => {
    // Use the service to properly complete and persist
    challengeService.completeChallenge(challengeId);
    
    // The event listener will handle the rest
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold text-white mb-2">Active Challenges</h2>
        <p className="text-purple-300">
          Complete challenges to earn XP and unlock new ones
        </p>
        <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-purple-500/20 rounded-full">
          <Trophy className="w-5 h-5 text-amber-400" />
          <span className="text-white font-semibold">
            {completedChallenges.length} Completed
          </span>
        </div>
      </div>

      {/* Active Challenges */}
      <div className="grid md:grid-cols-3 gap-6 mb-12">
        {activeChallenges.map((challenge, index) => {
          const progress = challengeProgress[challenge.id] || 0;
          const progressPercent = (progress / challenge.target) * 100;
          const isComplete = completedChallenges.includes(challenge.id);
          const canClaim = progress >= challenge.target && !isComplete;

          return (
            <motion.div
              key={challenge.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="relative group"
            >
              <div className={`
                bg-black/40 backdrop-blur-sm rounded-2xl p-6 border 
                ${isComplete ? 'border-amber-500/50' : canClaim ? 'border-green-500/50' : 'border-purple-500/20'}
                hover:border-purple-500/40 transition-all
              `}>
                {/* Icon and Category */}
                <div className="flex items-start justify-between mb-4">
                  <div className={`
                    w-16 h-16 rounded-2xl flex items-center justify-center text-3xl
                    bg-gradient-to-br ${challenge.color}
                  `}>
                    {challenge.icon}
                  </div>
                  <span className="text-xs text-purple-400 uppercase tracking-wider">
                    {challenge.category}
                  </span>
                </div>

                {/* Title and Description */}
                <h3 className="text-xl font-bold text-white mb-2">{challenge.title}</h3>
                <p className="text-gray-400 text-sm mb-4">{challenge.description}</p>

                {/* Progress */}
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-purple-300">Progress</span>
                    <span className="text-white font-medium">
                      {isComplete ? '✓ Complete' : `${progress} / ${challenge.target}`}
                    </span>
                  </div>
                  <div className="h-2 bg-gray-900/50 rounded-full overflow-hidden">
                    <motion.div
                      className={`h-full ${isComplete ? 'bg-gradient-to-r from-amber-500 to-yellow-500' : canClaim ? 'bg-green-500' : 'bg-gradient-to-r from-purple-500 to-pink-500'}`}
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(progressPercent, 100)}%` }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                </div>

                {/* Reward */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-amber-400" />
                    <span className="text-amber-400 font-medium">
                      +{challenge.xpReward} XP
                    </span>
                  </div>

                  {canClaim && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleClaimReward(challenge.id, challenge.xpReward)}
                      className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg text-white font-semibold text-sm"
                    >
                      Claim Reward
                    </motion.button>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Completed Challenges Section */}
      {completedChallengesList.length > 0 && (
        <div className="mb-12">
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-400" />
            Completed Challenges
          </h3>
          
          <div className="grid md:grid-cols-3 gap-4">
            {completedChallengesList.map((challenge, index) => (
              <motion.div
                key={challenge.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="relative"
              >
                <div className="bg-black/30 backdrop-blur-sm rounded-xl p-4 border border-amber-500/30 relative overflow-hidden">
                  {/* Gold Completed Sash */}
                  <div className="absolute top-6 -right-8 transform rotate-45 bg-gradient-to-r from-amber-500 to-yellow-500 text-white text-xs font-bold py-1 px-12 shadow-lg">
                    COMPLETED
                  </div>
                  
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`w-10 h-10 bg-gradient-to-br ${challenge.color} rounded-lg flex items-center justify-center text-xl opacity-75`}>
                      {challenge.icon}
                    </div>
                    <div className="flex-1">
                      <h4 className="text-white font-medium">{challenge.title}</h4>
                      <p className="text-xs text-amber-400">✓ +{challenge.xpReward} XP Earned</p>
                    </div>
                  </div>
                  <div className="h-1 bg-gradient-to-r from-amber-500 to-yellow-500 rounded-full mt-2" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Upcoming Challenges (Locked) */}
      {upcomingChallenges.length > 0 && (
        <div>
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <Lock className="w-5 h-5 text-gray-400" />
            Upcoming Challenges
            <span className="text-sm text-gray-400 font-normal">
              (Earn more XP to unlock)
            </span>
          </h3>
          
          <div className="grid md:grid-cols-3 gap-4">
            {upcomingChallenges.map((challenge, index) => (
              <motion.div
                key={challenge.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.5 }}
                className="relative"
              >
                <div className="bg-gray-900/30 backdrop-blur-sm rounded-xl p-4 border border-gray-700/30">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-gray-800/50 rounded-lg flex items-center justify-center text-xl">
                      {challenge.icon}
                    </div>
                    <div className="flex-1">
                      <h4 className="text-gray-400 font-medium">{challenge.title}</h4>
                      <p className="text-xs text-gray-600">Requires {challenge.xpRequirement} XP</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Lock className="w-4 h-4 text-gray-600" />
                    <span className="text-xs text-gray-600">
                      {challenge.xpRequirement - userXP} more XP needed
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Progress Summary */}
      <div className="mt-8 p-4 bg-purple-500/10 rounded-xl border border-purple-500/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <TrendingUp className="w-5 h-5 text-purple-400" />
            <span className="text-purple-300">
              {activeChallenges.length} active challenges • {completedChallenges.length} completed total
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-purple-400 text-sm">Current XP:</span>
            <span className="text-white font-bold">{userXP}</span>
          </div>
        </div>
      </div>
    </div>
  );
};