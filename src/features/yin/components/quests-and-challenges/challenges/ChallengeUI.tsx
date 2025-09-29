import { motion } from 'framer-motion';
import { Star, Trophy } from 'lucide-react';
import React from 'react';

interface ChallengeUIProps {
  challenge: {
    id: string;
    title: string;
    description?: string;
    tier: number;
    xp: number;
    completed: boolean;
    required?: number;
    category?: string;
  };
  progress: number;
  onClick: () => void;
  index: number;
}

const getChallengeIcon = (challengeId: string) => {
  const icons: Record<string, string> = {
    'first-steps': '👣',
    'capture-insight': '💡',
    'daily-practice': '🎯',
    'shadow-work-intro': '🌙',
    'evening-reflection': '🌅',
    'inner-compass': '🧭',
    'week-streak': '🔥',
    'insight-collection': '📚',
    'community-share': '🤝'
  };
  return icons[challengeId] || '⭐';
};

export const ChallengeUI: React.FC<ChallengeUIProps> = ({ 
  challenge, 
  progress,
  onClick, 
  index 
}) => {
  const isComplete = challenge.completed;
  const progressPercent = challenge.required ? Math.round((progress / challenge.required) * 100) : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={!isComplete ? { scale: 1.02, y: -4 } : {}}
      className="relative"
    >
      <div className={`
        bg-gradient-to-br from-purple-900/40 to-indigo-900/40 
        rounded-2xl p-6 border transition-all backdrop-blur-sm
        ${isComplete 
          ? 'border-yellow-500/50 shadow-lg shadow-yellow-500/20' 
          : 'border-purple-500/30 hover:border-purple-400/50 cursor-pointer'
        }
        h-full flex flex-col
      `}
        onClick={() => !isComplete && onClick()}
      >
        {/* Gold Completion Sash */}
        {isComplete && (
          <div className="absolute -top-3 -right-3 left-3 h-8 overflow-hidden z-10">
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-600 via-yellow-500 to-amber-500 transform rotate-2 shadow-lg">
              <div className="flex items-center justify-center h-full">
                <Trophy className="w-4 h-4 text-yellow-900 mr-1" />
                <span className="text-xs font-bold text-yellow-900 uppercase tracking-wider">
                  Completed
                </span>
              </div>
            </div>
          </div>
        )}
        
        {/* Challenge Icon and Category */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-purple-800/50 flex items-center justify-center text-2xl">
              {getChallengeIcon(challenge.id)}
            </div>
            {challenge.category && (
              <span className="text-[10px] font-bold text-purple-400 uppercase tracking-wider">
                {challenge.category}
              </span>
            )}
          </div>
        </div>
        
        {/* Challenge Content with embossed container */}
        <div className="flex-1">
          <div className="bg-black/20 rounded-lg p-3 mb-4">
            <h3 className={`font-bold text-lg mb-1 ${
              isComplete ? 'text-yellow-400' : 'text-white'
            }`}>
              {challenge.title}
            </h3>
            <p className="text-purple-300/80 text-sm">
              {challenge.description}
            </p>
          </div>
          
          {/* Progress Section */}
          {!isComplete && (
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-purple-400">
                <span>Progress</span>
                <span>{progress} / {challenge.required || 1}</span>
              </div>
              <div className="h-2 bg-purple-950/60 rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercent}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </div>
          )}
        </div>
        
        {/* XP Reward */}
        <div className="flex items-center justify-between pt-4 border-t border-purple-500/20">
          <div className="flex items-center gap-2">
            <Star className={`w-4 h-4 ${isComplete ? 'text-yellow-400' : 'text-amber-400'}`} />
            <span className={`font-bold ${
              isComplete ? 'text-yellow-400' : 'text-amber-400'
            }`}>
              {isComplete ? '✓' : '+'}{challenge.xp} XP
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};