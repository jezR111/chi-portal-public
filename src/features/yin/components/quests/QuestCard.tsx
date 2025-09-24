// src/features/yin/components/quests/QuestCard.tsx

import { AnimatePresence, motion } from 'framer-motion';
import {
  Award,
  Calendar,
  Camera,
  CheckCircle,
  ChevronRight,
  Clock,
  Edit3,
  Lock,
  Sparkles,
  Sun,
  Timer,
  Zap
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { Quest } from '../../types/quest.types';

interface QuestCardProps {
  quest: Quest;
  onComplete: () => void;
  onVerify?: (data: any) => void; // Future: verification data
  disabled?: boolean;
  currentXP: number;
  showCategory?: boolean; // Future: show category badge
  timerMode?: boolean; // Future: timer integration
}

export default function QuestCard({
  quest,
  onComplete,
  onVerify,
  disabled = false,
  currentXP,
  showCategory = false,
  timerMode = false
}: QuestCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showCompletion, setShowCompletion] = useState(false);
  const [timeBonus, setTimeBonus] = useState<{ active: boolean; multiplier: number }>({ 
    active: false, 
    multiplier: 1 
  });

  // Check if quest is locked
  const isLocked = quest.unlockAtXP && currentXP < quest.unlockAtXP;
  const canComplete = !isLocked && !quest.completedToday && !disabled;

  // Check for active time bonuses
  useEffect(() => {
    const checkTimeBonus = () => {
      const now = new Date();
      const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
      
      if (quest.modifiers?.morningBonus && currentTime < quest.modifiers.morningBonus.before) {
        setTimeBonus({ active: true, multiplier: quest.modifiers.morningBonus.multiplier });
      } else if (quest.modifiers?.eveningBonus && currentTime > quest.modifiers.eveningBonus.after) {
        setTimeBonus({ active: true, multiplier: quest.modifiers.eveningBonus.multiplier });
      } else if (quest.modifiers?.weekendBonus && [0, 6].includes(now.getDay())) {
        setTimeBonus({ active: true, multiplier: 1.25 });
      } else {
        setTimeBonus({ active: false, multiplier: 1 });
      }
    };

    checkTimeBonus();
    const interval = setInterval(checkTimeBonus, 60000); // Check every minute
    return () => clearInterval(interval);
  }, [quest]);

  // Get verification icon
  const getVerificationIcon = () => {
    switch (quest.verificationType) {
      case 'timer': return <Timer className="w-3 h-3" />;
      case 'photo': return <Camera className="w-3 h-3" />;
      case 'reflection': return <Edit3 className="w-3 h-3" />;
      default: return null;
    }
  };

  // Get duration display
  const getDurationDisplay = () => {
    const durationMap = {
      '5min': '5 min',
      '15min': '15 min',
      '30min': '30 min',
      '60min': '1 hour',
      '2hr+': '2+ hours'
    };
    return durationMap[quest.duration] || quest.duration;
  };

  // Handle completion
  const handleComplete = () => {
  if (!canComplete) return;
  
  setShowCompletion(true);
  onComplete();
  
  // Map quest to challenge and complete it
  const challengeId = challengeService.mapQuestToChallenge(quest.type || quest.category);
  if (challengeId) {
    challengeService.completeChallenge(challengeId);
  }
  
  // Auto-hide completion message
  setTimeout(() => {
    setShowCompletion(false);
  }, 3000);
};

  // Calculate actual XP with bonuses
  const actualXP = Math.floor(quest.xpReward * timeBonus.multiplier);

  return (
    <>
      <motion.div
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`relative overflow-hidden rounded-xl transition-all ${
          isLocked ? 'opacity-60' : ''
        }`}
      >
        {/* Background gradient */}
        <div 
          className={`absolute inset-0 bg-gradient-to-r ${quest.gradient || 'from-purple-500 to-pink-500'} opacity-10`} 
        />
        
        {/* Main Card */}
        <div className={`relative bg-gray-800/50 backdrop-blur-sm border border-purple-500/20 rounded-xl p-4 transition-all ${
          canComplete ? 'hover:border-purple-400/40 cursor-pointer' : ''
        } ${quest.completedToday ? 'bg-green-900/20 border-green-500/30' : ''}`}
          onClick={() => canComplete && setIsExpanded(!isExpanded)}
        >
          {/* Lock Overlay */}
          {isLocked && (
            <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm rounded-xl flex items-center justify-center z-10">
              <div className="text-center">
                <Lock className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-400">Unlock at {quest.unlockAtXP} XP</p>
                <p className="text-xs text-gray-500 mt-1">You have {currentXP} XP</p>
              </div>
            </div>
          )}

          {/* Completed Overlay */}
          {quest.completedToday && (
            <div className="absolute inset-0 bg-green-900/30 rounded-xl flex items-center justify-center z-10">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="text-center"
              >
                <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-2" />
                <p className="text-sm font-medium text-green-300">Completed!</p>
              </motion.div>
            </div>
          )}

          {/* Disabled Overlay */}
          {disabled && !quest.completedToday && !isLocked && (
            <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm rounded-xl flex items-center justify-center z-10">
              <div className="text-center">
                <Calendar className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-400">Daily limit reached</p>
                <p className="text-xs text-gray-500 mt-1">Come back tomorrow!</p>
              </div>
            </div>
          )}

          {/* Content */}
          <div className="flex items-start gap-4">
            {/* Icon */}
            <div className={`flex-shrink-0 w-12 h-12 rounded-lg bg-gradient-to-r ${
              quest.gradient || 'from-purple-500 to-pink-500'
            } flex items-center justify-center text-2xl`}>
              {quest.icon || '✨'}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between mb-1">
                <h3 className="font-semibold text-white truncate pr-2">
                  {quest.title}
                </h3>
                <div className="flex items-center gap-2 flex-shrink-0">
                  {/* Time Bonus Indicator */}
                  {timeBonus.active && !quest.completedToday && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="flex items-center gap-1 px-2 py-1 bg-yellow-500/20 rounded-full"
                    >
                      <Zap className="w-3 h-3 text-yellow-400" />
                      <span className="text-xs font-medium text-yellow-300">
                        {timeBonus.multiplier}x
                      </span>
                    </motion.div>
                  )}
                  
                  {/* Verification Type Badge */}
                  {quest.verificationType && quest.verificationType !== 'honor' && (
                    <div className="p-1 bg-white/10 rounded">
                      {getVerificationIcon()}
                    </div>
                  )}
                </div>
              </div>

              <p className="text-sm text-gray-300 mb-3 line-clamp-2">
                {quest.description}
              </p>

              {/* Meta Info */}
              <div className="flex items-center gap-4 text-xs">
                <div className="flex items-center gap-1 text-purple-300">
                  <Clock className="w-3 h-3" />
                  <span>{getDurationDisplay()}</span>
                </div>
                <div className="flex items-center gap-1 text-green-300">
                  <Sparkles className="w-3 h-3" />
                  <span>{actualXP} XP</span>
                  {timeBonus.active && (
                    <span className="text-yellow-300">(+{actualXP - quest.xpReward})</span>
                  )}
                </div>
                {showCategory && quest.category && (
                  <span className="px-2 py-0.5 bg-purple-500/20 rounded-full text-purple-300 capitalize">
                    {quest.category}
                  </span>
                )}
              </div>
            </div>

            {/* Action Icon */}
            {canComplete && (
              <motion.div
                animate={{ rotate: isExpanded ? 90 : 0 }}
                className="flex-shrink-0"
              >
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </motion.div>
            )}
          </div>

          {/* Expanded Content */}
          <AnimatePresence>
            {isExpanded && canComplete && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="pt-4 mt-4 border-t border-purple-500/20">
                  {/* Completion Prompt */}
                  {quest.completionPrompt && (
                    <p className="text-sm text-purple-200 mb-4 italic">
                      {quest.completionPrompt}
                    </p>
                  )}

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    {quest.verificationType === 'timer' && timerMode ? (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          // Future: Start timer
                          console.log('Timer mode activated');
                        }}
                        className="flex-1 px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-400/40 rounded-lg text-blue-300 font-medium transition-all flex items-center justify-center gap-2"
                      >
                        <Timer className="w-4 h-4" />
                        Start Timer
                      </button>
                    ) : quest.verificationType === 'reflection' ? (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          // Future: Open reflection modal
                          handleComplete();
                        }}
                        className="flex-1 px-4 py-2 bg-purple-500/20 hover:bg-purple-500/30 border border-purple-400/40 rounded-lg text-purple-300 font-medium transition-all flex items-center justify-center gap-2"
                      >
                        <Edit3 className="w-4 h-4" />
                        Write Reflection
                      </button>
                    ) : (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleComplete();
                        }}
                        className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 hover:from-purple-500/30 hover:to-pink-500/30 border border-purple-400/40 rounded-lg text-white font-medium transition-all flex items-center justify-center gap-2"
                      >
                        <CheckCircle className="w-4 h-4" />
                        Complete Quest
                      </button>
                    )}
                  </div>

                  {/* Schedule Info (Future) */}
                  {quest.schedule && (
                    <div className="mt-3 p-2 bg-white/5 rounded-lg">
                      <div className="flex items-center gap-2 text-xs text-gray-400">
                        {quest.schedule.availableFrom && (
                          <div className="flex items-center gap-1">
                            <Sun className="w-3 h-3" />
                            <span>Best before {quest.schedule.availableFrom}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Completion Animation */}
        <AnimatePresence>
          {showCompletion && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="absolute inset-0 flex items-center justify-center pointer-events-none"
            >
              <div className="bg-green-500 text-white px-4 py-2 rounded-full font-bold flex items-center gap-2">
                <Award className="w-5 h-5" />
                +{actualXP} XP Earned!
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </>
  );
}