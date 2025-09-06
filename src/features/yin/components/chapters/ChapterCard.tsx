// src/features/yin/components/chapters/ChapterCard.tsx
import { motion } from 'framer-motion';
import {
  BookOpen,
  CheckCircle,
  ChevronRight,
  Clock,
  Lock,
  Star,
  Zap
} from 'lucide-react';
import React from 'react';

interface ChapterCardProps {
  chapter: any; // Using any for flexibility with the data structure
  onClick: () => void;
  isOverview?: boolean; // Added for overview card distinction
}

export const ChapterCard: React.FC<ChapterCardProps> = ({ chapter, onClick, isOverview }) => {
  const Icon = chapter.icon;
  const isLocked = !chapter.unlocked;
  const isCompleted = chapter.progress === 100;

  // Logic for Overview Card Distinction
  const cardStyles = isOverview
    ? "bg-gradient-to-br from-purple-900/40 to-indigo-900/40 border-purple-400/30" // Lighter for overview
    : "bg-gradient-to-r from-gray-900/50 to-purple-900/30 border-purple-500/20 hover:border-purple-400/40"; // Original style for regular chapters

  return (
    <motion.div
      whileHover={!isLocked ? { x: 4 } : {}}
      whileTap={!isLocked ? { scale: 0.99 } : {}}
      className={`relative group ${!isLocked ? 'cursor-pointer' : 'cursor-not-allowed'}`}
      onClick={!isLocked ? onClick : undefined}
    >
      {/* Overview Badge - placed here to avoid being clipped by overflow-hidden */}
      {isOverview && (
        <div className="absolute -top-3 left-4 px-3 py-1 bg-purple-600/80 rounded-full z-10">
          <span className="text-xs font-semibold text-white">OVERVIEW</span>
        </div>
      )}

      <div className={`
        relative backdrop-blur-xl rounded-2xl border
        transition-all duration-300 overflow-hidden
        ${cardStyles}
        ${isOverview && 'ring-2 ring-purple-500/20'}
        ${isLocked ? 'opacity-60' : ''}
      `}>
        <div className="p-6">
          <div className="flex items-start gap-5">
            {/* Icon */}
            <div className={`
              relative w-14 h-14 rounded-xl flex items-center justify-center
              ${!isLocked
                ? `bg-gradient-to-br ${chapter.color || 'from-purple-600 to-indigo-600'} shadow-lg ${chapter.glow}`
                : 'bg-gray-800/50'
              }
            `}>
              {isLocked ? (
                <Lock className="w-6 h-6 text-gray-400" />
              ) : isCompleted ? (
                <CheckCircle className="w-7 h-7 text-white" />
              ) : (
                <Icon className="w-7 h-7 text-white" />
              )}
            </div>

            {/* Content */}
            <div className="flex-1">
              {/* Title and badges */}
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-1">
                    {chapter.title}
                  </h3>
                  <p className="text-purple-300/80 text-sm">
                    {chapter.subtitle}
                  </p>
                </div>

                {/* Badges */}
                <div className="flex items-center gap-2">
                  {chapter.premium && (
                    <div className="bg-gradient-to-r from-amber-500 to-orange-500 px-2 py-1 rounded-full">
                      <Star className="w-3 h-3 text-white" fill="currentColor" />
                    </div>
                  )}
                  {isCompleted && (
                    <div className="bg-green-500/20 px-2 py-1 rounded-full">
                      <CheckCircle className="w-3 h-3 text-green-400" />
                    </div>
                  )}
                </div>
              </div>

              {/* Description */}
              {!isLocked && (
                <p className="text-purple-200/50 text-xs leading-relaxed mb-3 line-clamp-2">
                  {chapter.description}
                </p>
              )}

              {/* Stats */}
              <div className="flex items-center gap-4 text-xs">
                {!isLocked ? (
                  <>
                    <span className="flex items-center gap-1 text-purple-300/60">
                      <BookOpen className="w-3 h-3" />
                      {chapter.lessons?.length || 0} lessons
                    </span>
                    <span className="flex items-center gap-1 text-purple-300/60">
                      <Clock className="w-3 h-3" />
                      {Math.floor(chapter.totalDuration / 60)}h {chapter.totalDuration % 60}m
                    </span>
                    <span className="flex items-center gap-1 text-purple-300/60">
                      <Zap className="w-3 h-3" />
                      +{chapter.xpReward} XP
                    </span>
                  </>
                ) : (
                  <span className="text-purple-400/60 text-sm">
                    Requires {chapter.requiredXP} XP to unlock
                  </span>
                )}
              </div>

              {/* Progress Bar */}
              {!isLocked && chapter.progress > 0 && (
                <div className="mt-3">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-purple-400/60">Progress</span>
                    <span className="text-white font-semibold">{chapter.progress}%</span>
                  </div>
                  <div className="h-1.5 bg-black/30 rounded-full overflow-hidden">
                    <motion.div
                      className={`h-full bg-gradient-to-r ${chapter.color || 'from-purple-600 to-indigo-600'}`}
                      initial={{ width: 0 }}
                      animate={{ width: `${chapter.progress}%` }}
                      transition={{ duration: 0.8, delay: 0.2 }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Arrow indicator for unlocked chapters */}
            {!isLocked && (
              <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <ChevronRight className="w-5 h-5 text-purple-400" />
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};