// src/features/yin/components/quests/ChallengeCard.tsx

import { AnimatePresence, motion } from 'framer-motion';
import {
  Activity,
  AlertCircle,
  Award,
  Calendar,
  CheckCircle,
  ChevronRight,
  Flame,
  Gift,
  RefreshCw,
  Star,
  Target,
  TrendingUp,
  Trophy,
  Zap
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { Challenge } from '../../types/quest.types';

interface ChallengeCardProps {
  challenge: Challenge;
  onProgress?: () => void;
  onClaim?: (xpEarned: number) => void; // Future: claim rewards
  onReset?: () => void; // Future: reset challenge
  showDetails?: boolean; // Future: expanded view
}

export default function ChallengeCard({
  challenge,
  onProgress,
  onClaim,
  onReset,
  showDetails = false
}: ChallengeCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showReward, setShowReward] = useState(false);
  const [streakAnimation, setStreakAnimation] = useState(false);
  const [lastMilestone, setLastMilestone] = useState<number | null>(null);

  // Calculate progress percentage
  const progressPercentage = Math.min(100, (challenge.currentProgress / challenge.target) * 100);
  const isCompleted = challenge.currentProgress >= challenge.target;

  // Check for milestone achievements
  useEffect(() => {
    if (challenge.milestones) {
      const achievedMilestones = challenge.milestones.filter(
        m => challenge.currentProgress >= m.at
      );
      const latestMilestone = achievedMilestones[achievedMilestones.length - 1];
      
      if (latestMilestone && latestMilestone.at !== lastMilestone) {
        setLastMilestone(latestMilestone.at);
        // Trigger milestone animation
        setTimeout(() => setShowReward(true), 100);
        setTimeout(() => setShowReward(false), 3000);
      }
    }
  }, [challenge.currentProgress]);

  // Animate streak changes
  useEffect(() => {
    if (challenge.type === 'streak' && challenge.currentStreak) {
      setStreakAnimation(true);
      setTimeout(() => setStreakAnimation(false), 600);
    }
  }, [challenge.currentStreak]);

  // Get challenge type icon
  const getChallengeIcon = () => {
    switch (challenge.type) {
      case 'streak': return <Flame className="w-5 h-5" />;
      case 'accumulation': return <TrendingUp className="w-5 h-5" />;
      case 'variety': return <Star className="w-5 h-5" />;
      case 'intensity': return <Activity className="w-5 h-5" />;
      default: return <Target className="w-5 h-5" />;
    }
  };

  // Get challenge type label
  const getChallengeTypeLabel = () => {
    switch (challenge.type) {
      case 'streak': return 'Streak Challenge';
      case 'accumulation': return 'Accumulation';
      case 'variety': return 'Variety Challenge';
      case 'intensity': return 'Intensity Challenge';
      default: return 'Challenge';
    }
  };

  // Format time remaining for streaks
  const getStreakStatus = () => {
    if (challenge.type !== 'streak' || !challenge.lastProgressAt) return null;
    
    const lastProgress = new Date(challenge.lastProgressAt);
    const now = new Date();
    const hoursSinceProgress = Math.floor((now.getTime() - lastProgress.getTime()) / (1000 * 60 * 60));
    const hoursRemaining = 24 - hoursSinceProgress;
    
    if (hoursRemaining <= 0) {
      return { text: 'Streak expired', color: 'text-red-400', icon: AlertCircle };
    } else if (hoursRemaining <= 6) {
      return { text: `${hoursRemaining}h to maintain`, color: 'text-yellow-400', icon: AlertCircle };
    } else {
      return { text: 'Streak active', color: 'text-green-400', icon: CheckCircle };
    }
  };

  const streakStatus = getStreakStatus();

  // Calculate next milestone
  const nextMilestone = challenge.milestones?.find(m => m.at > challenge.currentProgress);
  const progressToNextMilestone = nextMilestone 
    ? ((challenge.currentProgress - (lastMilestone || 0)) / (nextMilestone.at - (lastMilestone || 0))) * 100
    : 0;

  // Handle claim reward
  const handleClaimReward = () => {
    if (!isCompleted) return;
    
    const totalXP = challenge.xpReward + (challenge.milestones?.reduce((sum, m) => {
      return sum + (challenge.currentProgress >= m.at ? m.xpBonus : 0);
    }, 0) || 0);
    
    onClaim?.(totalXP);
    setShowReward(true);
    setTimeout(() => setShowReward(false), 3000);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden rounded-xl"
    >
      {/* Background gradient */}
      <div 
        className={`absolute inset-0 bg-gradient-to-r ${challenge.gradient || 'from-orange-500 to-red-500'} opacity-10`} 
      />

      {/* Main Card */}
      <div 
        className={`relative bg-gray-800/50 backdrop-blur-sm border rounded-xl p-4 transition-all cursor-pointer ${
          isCompleted 
            ? 'border-green-500/40 bg-green-900/20' 
            : 'border-purple-500/20 hover:border-purple-400/40'
        }`}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-start gap-3">
            {/* Icon Container */}
            <div className={`flex-shrink-0 w-10 h-10 rounded-lg bg-gradient-to-r ${
              challenge.gradient || 'from-orange-500 to-red-500'
            } flex items-center justify-center`}>
              {challenge.icon ? (
                <span className="text-xl">{challenge.icon}</span>
              ) : (
                getChallengeIcon()
              )}
            </div>

            {/* Title and Description */}
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold text-white">{challenge.title}</h3>
                {isCompleted && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="flex items-center gap-1 px-2 py-0.5 bg-green-500/20 rounded-full"
                  >
                    <Trophy className="w-3 h-3 text-green-400" />
                    <span className="text-xs font-medium text-green-300">Complete!</span>
                  </motion.div>
                )}
              </div>
              <p className="text-sm text-gray-300">{challenge.description}</p>
            </div>
          </div>

          {/* Expand Icon */}
          <motion.div
            animate={{ rotate: isExpanded ? 90 : 0 }}
            className="flex-shrink-0"
          >
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </motion.div>
        </div>

        {/* Progress Section */}
        <div className="space-y-3">
          {/* Main Progress Bar */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400">{getChallengeTypeLabel()}</span>
                {challenge.type === 'streak' && challenge.currentStreak !== undefined && (
                  <motion.div
                    animate={streakAnimation ? { scale: [1, 1.2, 1] } : {}}
                    className="flex items-center gap-1"
                  >
                    <Flame className="w-3 h-3 text-orange-400" />
                    <span className="text-xs font-bold text-orange-300">
                      {challenge.currentStreak} day{challenge.currentStreak !== 1 ? 's' : ''}
                    </span>
                  </motion.div>
                )}
              </div>
              <span className="text-xs font-medium text-white">
                {challenge.currentProgress} / {challenge.target}
              </span>
            </div>

            {/* Progress Bar */}
            <div className="relative h-2 bg-gray-700/50 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progressPercentage}%` }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                className={`absolute inset-y-0 left-0 rounded-full ${
                  isCompleted 
                    ? 'bg-gradient-to-r from-green-400 to-green-500' 
                    : 'bg-gradient-to-r from-purple-400 to-pink-400'
                }`}
              />
              
              {/* Milestone Markers */}
              {challenge.milestones?.map((milestone) => (
                <div
                  key={milestone.at}
                  className="absolute top-1/2 -translate-y-1/2 w-0.5 h-4 bg-white/30"
                  style={{ left: `${(milestone.at / challenge.target) * 100}%` }}
                >
                  {challenge.currentProgress >= milestone.at && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-1 left-1/2 -translate-x-1/2 w-3 h-3 bg-yellow-400 rounded-full border-2 border-gray-800"
                    />
                  )}
                </div>
              ))}
            </div>

            {/* Milestone Progress (if between milestones) */}
            {nextMilestone && !isCompleted && (
              <div className="mt-2">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-purple-300">
                    Next milestone: {nextMilestone.at - challenge.currentProgress} to go
                  </span>
                  <span className="text-xs text-yellow-300">
                    +{nextMilestone.xpBonus} XP
                  </span>
                </div>
                <div className="h-1 bg-gray-700/30 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progressToNextMilestone}%` }}
                    className="h-full bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Status and Rewards */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* Streak Status */}
              {streakStatus && (
                <div className={`flex items-center gap-1 text-xs ${streakStatus.color}`}>
                  <streakStatus.icon className="w-3 h-3" />
                  <span>{streakStatus.text}</span>
                </div>
              )}
              
              {/* Best Streak */}
              {challenge.bestStreak !== undefined && challenge.bestStreak > 0 && (
                <div className="flex items-center gap-1 text-xs text-gray-400">
                  <Award className="w-3 h-3" />
                  <span>Best: {challenge.bestStreak}</span>
                </div>
              )}
            </div>

            {/* XP Reward Display */}
            <div className="flex items-center gap-1 text-xs">
              <Zap className="w-3 h-3 text-yellow-400" />
              <span className="text-yellow-300 font-medium">
                {challenge.xpReward} XP
              </span>
              {challenge.dailyXP && (
                <span className="text-gray-400">
                  (+{challenge.dailyXP}/day)
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Expanded Content */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="pt-4 mt-4 border-t border-purple-500/20">
                {/* Milestones List */}
                {challenge.milestones && challenge.milestones.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-xs font-medium text-gray-400 uppercase mb-2">Milestones</h4>
                    <div className="space-y-2">
                      {challenge.milestones.map((milestone) => (
                        <div
                          key={milestone.at}
                          className={`flex items-center justify-between p-2 rounded-lg ${
                            challenge.currentProgress >= milestone.at
                              ? 'bg-green-500/10 border border-green-500/20'
                              : 'bg-white/5 border border-gray-700'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            {challenge.currentProgress >= milestone.at ? (
                              <CheckCircle className="w-4 h-4 text-green-400" />
                            ) : (
                              <div className="w-4 h-4 rounded-full border-2 border-gray-500" />
                            )}
                            <span className={`text-sm ${
                              challenge.currentProgress >= milestone.at
                                ? 'text-green-300'
                                : 'text-gray-400'
                            }`}>
                              Day {milestone.at}: {milestone.message}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Gift className="w-3 h-3 text-yellow-400" />
                            <span className="text-xs text-yellow-300">+{milestone.xpBonus} XP</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-3">
                  {isCompleted ? (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleClaimReward();
                      }}
                      className="flex-1 px-4 py-2 bg-gradient-to-r from-green-500/20 to-emerald-500/20 hover:from-green-500/30 hover:to-emerald-500/30 border border-green-400/40 rounded-lg text-green-300 font-medium transition-all flex items-center justify-center gap-2"
                    >
                      <Trophy className="w-4 h-4" />
                      Claim Reward
                    </button>
                  ) : challenge.type === 'streak' && challenge.currentStreak === 0 ? (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onProgress?.();
                      }}
                      className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 hover:from-purple-500/30 hover:to-pink-500/30 border border-purple-400/40 rounded-lg text-white font-medium transition-all flex items-center justify-center gap-2"
                    >
                      <Flame className="w-4 h-4" />
                      Start Streak
                    </button>
                  ) : (
                    <div className="flex-1 px-4 py-2 bg-gray-700/30 border border-gray-600/40 rounded-lg text-center">
                      <p className="text-sm text-gray-400">
                        Complete {challenge.questIds?.[0] ? 'related quests' : 'quests'} to progress
                      </p>
                    </div>
                  )}

                  {/* Reset Button (Future) */}
                  {challenge.resetPeriod && onReset && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onReset();
                      }}
                      className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-gray-600/40 rounded-lg text-gray-400 transition-all flex items-center justify-center gap-2"
                    >
                      <RefreshCw className="w-4 h-4" />
                      Reset
                    </button>
                  )}
                </div>

                {/* Additional Info */}
                {challenge.resetPeriod && (
                  <div className="mt-3 p-2 bg-white/5 rounded-lg">
                    <p className="text-xs text-gray-400">
                      <Calendar className="w-3 h-3 inline mr-1" />
                      Resets {challenge.resetPeriod}
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Reward Animation Overlay */}
        <AnimatePresence>
          {showReward && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="absolute inset-0 flex items-center justify-center pointer-events-none"
            >
              <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-4 py-2 rounded-full font-bold flex items-center gap-2 shadow-lg">
                <Trophy className="w-5 h-5" />
                Milestone Achieved!
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}