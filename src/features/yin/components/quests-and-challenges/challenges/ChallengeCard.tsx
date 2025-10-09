// src/features/yin/components/quests-and-challenges/challenges/ChallengeCard.tsx
// Version: 4.0.0 - Enhanced Challenge Card with Milestones and Animations
import { AnimatePresence, motion } from 'framer-motion';
import {
  Activity, AlertCircle,
  Calendar, CheckCircle, ChevronRight,
  Flame, Gift, Lock, RefreshCw, Star, Target, TrendingUp, Trophy, Zap
} from 'lucide-react';
import { useEffect, useState } from 'react';

interface Milestone {
  at: number;
  message: string;
  xpBonus: number;
}

interface Challenge {
  id: string;
  title: string;
  description?: string;
  tier: number;
  xp: number;
  completed: boolean;
  type?: 'streak' | 'accumulation' | 'variety' | 'intensity';
  currentProgress?: number;
  target?: number;
  milestones?: Milestone[];
  currentStreak?: number;
  bestStreak?: number;
  lastProgressAt?: string;
  dailyXP?: number;
  resetPeriod?: string;
  icon?: string;
  gradient?: string;
  questIds?: string[];
}

interface ChallengeCardProps {
  challenge: Challenge;
  onClick: () => void;
  onProgress?: () => void;
  onClaim?: (xpEarned: number) => void;
  onReset?: () => void;
  index: number;
  locked?: boolean;
}

export const ChallengeCard: React.FC<ChallengeCardProps> = ({ 
  challenge, 
  onClick,
  onProgress,
  onClaim,
  onReset,
  index,
  locked = false 
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showReward, setShowReward] = useState(false);
  const [streakAnimation, setStreakAnimation] = useState(false);
  const [lastMilestone, setLastMilestone] = useState<number | null>(null);

  const gradients = [
    'from-purple-500 to-indigo-600',
    'from-pink-500 to-rose-600', 
    'from-blue-500 to-cyan-600',
    'from-green-500 to-emerald-600',
    'from-amber-500 to-orange-600',
    'from-violet-500 to-purple-600'
  ];

  const gradient = challenge.gradient || gradients[index % gradients.length];
  const progressPercentage = challenge.target 
    ? Math.min(100, ((challenge.currentProgress || 0) / challenge.target) * 100)
    : 0;
  const isCompleted = challenge.completed || 
    (challenge.target && challenge.currentProgress && challenge.currentProgress >= challenge.target);

  // Check for milestone achievements
  useEffect(() => {
    if (challenge.milestones && challenge.currentProgress) {
      const achievedMilestones = challenge.milestones.filter(
        m => challenge.currentProgress! >= m.at
      );
      const latestMilestone = achievedMilestones[achievedMilestones.length - 1];
      
      if (latestMilestone && latestMilestone.at !== lastMilestone) {
        setLastMilestone(latestMilestone.at);
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
    if (challenge.icon) return <span className="text-2xl">{challenge.icon}</span>;
    switch (challenge.type) {
      case 'streak': return <Flame className="w-6 h-6 text-white" />;
      case 'accumulation': return <TrendingUp className="w-6 h-6 text-white" />;
      case 'variety': return <Star className="w-6 h-6 text-white" />;
      case 'intensity': return <Activity className="w-6 h-6 text-white" />;
      default: return <Target className="w-6 h-6 text-white" />;
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
  const nextMilestone = challenge.milestones?.find(m => m.at > (challenge.currentProgress || 0));

  const handleClaimReward = () => {
    if (!isCompleted) return;
    
    const totalXP = challenge.xp + (challenge.milestones?.reduce((sum, m) => {
      return sum + ((challenge.currentProgress || 0) >= m.at ? m.xpBonus : 0);
    }, 0) || 0);
    
    onClaim?.(totalXP);
    setShowReward(true);
    setTimeout(() => setShowReward(false), 3000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ 
        delay: index * 0.1,
        type: "spring",
        stiffness: 100
      }}
      className="relative"
    >
      {/* Main Card - Premium Glass Morphism Style */}
      <motion.div
        whileHover={!locked && !isCompleted ? { scale: 1.02, y: -5 } : {}}
        whileTap={!locked && !isCompleted ? { scale: 0.98 } : {}}
        onClick={() => !locked && setIsExpanded(!isExpanded)}
        className={`relative aspect-[4/3] cursor-pointer group ${locked ? 'pointer-events-none' : ''}`}
      >
        {/* Glow effect */}
        <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-50 blur-xl 
          ${!locked ? 'group-hover:opacity-70' : 'opacity-20'} 
          transition-opacity duration-300 rounded-3xl`} 
        />
        
        {/* Main card */}
        <div className={`
          relative h-full
          bg-gradient-to-br ${gradient}
          rounded-3xl overflow-hidden
          ${isCompleted ? 'opacity-60' : ''}
          ${locked ? 'opacity-40' : ''}
        `}>
          {/* Glass overlay */}
          <div className="absolute inset-0 bg-white/10 backdrop-blur-sm" />
          
          {/* Top glass reflection */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-transparent opacity-60" />
          
          {/* Content */}
          <div className="relative h-full p-6 flex flex-col justify-between">
            {/* Status badges */}
            {isCompleted && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute top-3 right-3 w-10 h-10 bg-green-400/90 rounded-full flex items-center justify-center shadow-lg z-10"
              >
                <Trophy className="w-5 h-5 text-white" />
              </motion.div>
            )}
            
            {locked && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute top-3 right-3 w-10 h-10 bg-gray-800/90 rounded-full flex items-center justify-center shadow-lg z-10"
              >
                <Lock className="w-5 h-5 text-gray-400" />
              </motion.div>
            )}

            {/* Header with icon and tier */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/30">
                  {getChallengeIcon()}
                </div>
                <div className="bg-black/30 backdrop-blur px-3 py-1 rounded-full">
                  <span className="text-white/90 text-xs font-bold">Tier {challenge.tier}</span>
                </div>
              </div>
              
              {/* Streak indicator */}
              {challenge.type === 'streak' && challenge.currentStreak !== undefined && (
                <motion.div
                  animate={streakAnimation ? { scale: [1, 1.2, 1] } : {}}
                  className="flex items-center gap-1 bg-orange-500/20 backdrop-blur px-3 py-1 rounded-full"
                >
                  <Flame className="w-4 h-4 text-orange-300" />
                  <span className="text-orange-300 font-bold text-sm">
                    {challenge.currentStreak} day{challenge.currentStreak !== 1 ? 's' : ''}
                  </span>
                </motion.div>
              )}
            </div>

            {/* Title and description */}
            <div className="flex-1 flex flex-col justify-center">
              <h3 className="text-white font-bold text-xl mb-2 drop-shadow-lg">
                {challenge.title}
              </h3>
              <p className="text-white/80 text-sm line-clamp-2">
                {challenge.description || 'Complete this challenge to earn XP'}
              </p>

              {/* Progress bar (if applicable) */}
              {challenge.target && (
                <div className="mt-3">
                  <div className="flex justify-between text-xs text-white/60 mb-1">
                    <span>Progress</span>
                    <span>{challenge.currentProgress || 0} / {challenge.target}</span>
                  </div>
                  <div className="relative h-2 bg-black/30 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${progressPercentage}%` }}
                      transition={{ duration: 0.5, ease: 'easeOut' }}
                      className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-white/50 to-white/30"
                    />
                    
                    {/* Milestone markers */}
                    {challenge.milestones?.map((milestone) => (
                      <div
                        key={milestone.at}
                        className="absolute top-1/2 -translate-y-1/2 w-0.5 h-4 bg-white/30"
                        style={{ left: `${(milestone.at / challenge.target!) * 100}%` }}
                      >
                        {(challenge.currentProgress || 0) >= milestone.at && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="absolute -top-1 left-1/2 -translate-x-1/2 w-3 h-3 bg-yellow-400 rounded-full border-2 border-white/50"
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Bottom section */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5 bg-black/20 backdrop-blur px-3 py-1.5 rounded-full">
                  <Zap className="w-4 h-4 text-yellow-300" />
                  <span className="text-yellow-300 font-bold text-sm">+{challenge.xp} XP</span>
                </div>
                
                {streakStatus && (
                  <div className={`flex items-center gap-1 text-xs ${streakStatus.color}`}>
                    <streakStatus.icon className="w-3 h-3" />
                    <span>{streakStatus.text}</span>
                  </div>
                )}
              </div>

              <motion.div
                animate={{ rotate: isExpanded ? 90 : 0 }}
                className="text-white/60"
              >
                <ChevronRight className="w-5 h-5" />
              </motion.div>
            </div>
          </div>

          {/* Shine effect */}
          {!locked && (
            <motion.div
              className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              initial={{ x: '-100%', y: '-100%' }}
              whileHover={{ x: '100%', y: '100%' }}
              transition={{ duration: 0.6 }}
            />
          )}
        </div>
      </motion.div>

      {/* Expanded Content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden mt-4"
          >
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-purple-500/20">
              {/* Milestones */}
              {challenge.milestones && challenge.milestones.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-400 uppercase mb-3">Milestones</h4>
                  <div className="space-y-2">
                    {challenge.milestones.map((milestone) => (
                      <div
                        key={milestone.at}
                        className={`flex items-center justify-between p-3 rounded-lg ${
                          (challenge.currentProgress || 0) >= milestone.at
                            ? 'bg-green-500/10 border border-green-500/20'
                            : 'bg-white/5 border border-gray-700'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          {(challenge.currentProgress || 0) >= milestone.at ? (
                            <CheckCircle className="w-5 h-5 text-green-400" />
                          ) : (
                            <div className="w-5 h-5 rounded-full border-2 border-gray-500" />
                          )}
                          <span className={`text-sm ${
                            (challenge.currentProgress || 0) >= milestone.at
                              ? 'text-green-300'
                              : 'text-gray-400'
                          }`}>
                            {milestone.message}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Gift className="w-4 h-4 text-yellow-400" />
                          <span className="text-xs text-yellow-300">+{milestone.xpBonus} XP</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Action buttons */}
              <div className="flex gap-3">
                {isCompleted ? (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleClaimReward();
                    }}
                    className="flex-1 px-4 py-2 bg-gradient-to-r from-green-500/20 to-emerald-500/20 
                      hover:from-green-500/30 hover:to-emerald-500/30 border border-green-400/40 
                      rounded-lg text-green-300 font-medium transition-all flex items-center justify-center gap-2"
                  >
                    <Trophy className="w-4 h-4" />
                    Claim Reward
                  </button>
                ) : (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onClick();
                    }}
                    className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 
                      hover:from-purple-500/30 hover:to-pink-500/30 border border-purple-400/40 
                      rounded-lg text-white font-medium transition-all"
                  >
                    View Details
                  </button>
                )}
                
                {challenge.resetPeriod && onReset && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onReset();
                    }}
                    className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-gray-600/40 
                      rounded-lg text-gray-400 transition-all flex items-center gap-2"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Reset
                  </button>
                )}
              </div>

              {/* Additional info */}
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
            className="absolute inset-0 flex items-center justify-center pointer-events-none z-50"
          >
            <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-4 py-2 rounded-full font-bold flex items-center gap-2 shadow-lg">
              <Trophy className="w-5 h-5" />
              Milestone Achieved!
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};