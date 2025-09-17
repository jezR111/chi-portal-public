// src/features/yin/components/chapters/ChapterCard.tsx
import { motion } from 'framer-motion';
import {
  BookOpen,
  CheckCircle,
  ChevronRight,
  Clock,
  Lock,
  Star,
  Unlock,
  Zap
} from 'lucide-react';
import React from 'react';

interface ChapterCardProps {
  chapter: any;
  onClick: () => void;
  isOverview?: boolean;
}

export const ChapterCard: React.FC<ChapterCardProps> = ({ chapter, onClick, isOverview }) => {
  const Icon = chapter.icon;
  const isLocked = !chapter.unlocked;
  const isCompleted = chapter.progress === 100;
  const canPurchase = chapter.canUnlock && isLocked && chapter.requiredXP > 0;

  const cardStyles = isOverview
    ? "bg-gradient-to-br from-purple-900/40 to-indigo-900/40 border-purple-400/30"
    : canPurchase
      ? "bg-gradient-to-r from-amber-900/30 to-orange-900/20 border-amber-500/30 hover:border-amber-400/50"
      : isLocked
        ? "bg-gradient-to-r from-gray-900/50 to-gray-800/30 border-gray-700/20"
        : "bg-gradient-to-r from-gray-900/50 to-purple-900/30 border-purple-500/20 hover:border-purple-400/40";

  return (
    <motion.div
      whileHover={!isLocked || canPurchase ? { x: 4 } : {}}
      whileTap={!isLocked || canPurchase ? { scale: 0.99 } : {}}
      className={`relative group ${!isLocked || canPurchase ? 'cursor-pointer' : 'cursor-not-allowed'}`}
      onClick={!isLocked || canPurchase ? onClick : undefined}
    >
      {isOverview && (
        <div className="absolute -top-3 left-4 px-3 py-1 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full z-10 flex items-center gap-1">
          <span className="text-xs font-semibold text-white">FREE CHAPTER</span>
        </div>
      )}

      {canPurchase && (
        <div className="absolute -top-3 right-4 px-3 py-1 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full z-10 flex items-center gap-1 animate-pulse">
          <Unlock className="w-3 h-3 text-white" />
          <span className="text-xs font-semibold text-white">UNLOCK: 50 XP</span>
        </div>
      )}

      <div className={`
        relative backdrop-blur-xl rounded-2xl border
        transition-all duration-300 overflow-hidden
        ${cardStyles}
        ${isOverview && 'ring-2 ring-purple-500/20'}
        ${isLocked && !canPurchase ? 'opacity-60' : ''}
      `}>
        <div className="p-6">
          <div className="flex items-start gap-5">
            <div className={`
              relative w-14 h-14 rounded-xl flex items-center justify-center
              ${!isLocked
                ? `bg-gradient-to-br ${chapter.color || 'from-purple-600 to-indigo-600'} shadow-lg ${chapter.glow}`
                : canPurchase
                  ? 'bg-gradient-to-br from-amber-600 to-orange-600 shadow-lg shadow-amber-500/30'
                  : 'bg-gray-800/50'
              }
            `}>
              {isLocked && !canPurchase ? (
                <Lock className="w-6 h-6 text-gray-400" />
              ) : isLocked && canPurchase ? (
                <Zap className="w-6 h-6 text-white animate-pulse" />
              ) : isCompleted ? (
                <CheckCircle className="w-7 h-7 text-white" />
              ) : (
                <Icon className="w-7 h-7 text-white" />
              )}
            </div>

            <div className="flex-1">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className={`text-lg font-semibold mb-1 ${
                    canPurchase ? 'text-amber-100' : 'text-white'
                  }`}>
                    {chapter.title}
                  </h3>
                  <p className={`text-sm ${
                    canPurchase ? 'text-amber-200/80' : 'text-purple-300/80'
                  }`}>
                    {chapter.subtitle}
                  </p>
                </div>

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

              {(!isLocked || canPurchase) && (
                <p className={`text-xs leading-relaxed mb-3 line-clamp-2 ${
                  canPurchase ? 'text-amber-100/60' : 'text-purple-200/50'
                }`}>
                  {chapter.description}
                </p>
              )}

              <div className="flex items-center gap-4 text-xs">
                {!isLocked ? (
                  <>
                    <span className="flex items-center gap-1 text-purple-300/60">
                      <BookOpen className="w-3 h-3" />
                      {chapter.lessons?.length || 0} lessons
                    </span>
                    <span className="flex items-center gap-1 text-purple-300/60">
                      <Clock className="w-3 h-3" />
                      {Math.floor((chapter.totalDuration || 60) / 60)}h {(chapter.totalDuration || 60) % 60}m
                    </span>
                    <span className="flex items-center gap-1 text-purple-300/60">
                      <Zap className="w-3 h-3" />
                      +{chapter.xpReward || 100} XP
                    </span>
                  </>
                ) : canPurchase ? (
                  <>
                    <span className="flex items-center gap-1 text-amber-300/80 font-medium">
                      <Zap className="w-3 h-3 animate-pulse" />
                      Click to unlock for 50 XP
                    </span>
                    <span className="flex items-center gap-1 text-amber-300/60">
                      <BookOpen className="w-3 h-3" />
                      {chapter.lessons?.length || 0} lessons inside
                    </span>
                  </>
                ) : (
                  <span className="text-gray-400/60 text-sm">
                    Locked - Requires XP to unlock
                  </span>
                )}
              </div>

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

            {(!isLocked || canPurchase) && (
              <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <ChevronRight className={`w-5 h-5 ${
                  canPurchase ? 'text-amber-400' : 'text-purple-400'
                }`} />
              </div>
            )}
          </div>
        </div>

        {canPurchase && (
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-amber-900/50 to-transparent p-3 opacity-0 group-hover:opacity-100 transition-opacity">
            <p className="text-xs text-amber-200 text-center font-medium">
              ✨ Unlock this chapter to continue your journey
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
};