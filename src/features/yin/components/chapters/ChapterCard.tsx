// Version: 13.0 - Inset Card Design

import { motion } from 'framer-motion';
import {
  BookOpen,
  CheckCircle,
  ChevronRight,
  Clock,
  Lock,
  PlayCircle,
  Sparkles,
  Trophy
} from 'lucide-react';

// A simple utility to conditionally join class names
const cn = (...classes: (string | boolean | undefined)[]) => {
  return classes.filter(Boolean).join(' ');
};

interface ChapterCardProps {
  chapter: {
    id: string;
    title: string;
    subtitle?: string;
    description?: string;
    icon?: any;
    unlocked: boolean;
    progress: number;
    totalLessons: number;
    completedLessons: number;
    totalDuration: number;
    xpReward: number;
    requiredXP?: number;
    color?: string;
    order?: number;
  };
  index: number;
  onSelect: () => void;
}

export default function ChapterCard({ chapter, index, onSelect }: ChapterCardProps) {
  const Icon = chapter.icon || BookOpen;
  const isFirstChapter = index === 0;
  const isCompleted = chapter.progress === 100;
  const isAccessible = chapter.unlocked || isFirstChapter;

  // --- Inset Styling Logic ---
  const cardContainerClasses = cn(
    'relative overflow-hidden backdrop-blur-sm rounded-2xl',
    'p-5 md:p-6 cursor-pointer transition-all shadow-inner shadow-black/50', // Added inner shadow
    isCompleted && 'bg-gray-900/50 border-t-black/30 border-b-green-900/20 opacity-85 hover:opacity-95',
    isAccessible && !isCompleted && 'bg-black/50 border-t-black/30 border-b-purple-500/20 hover:bg-black/40',
    !isAccessible && 'bg-black/30 border-gray-700/30 opacity-75 cursor-not-allowed'
  );

  const iconContainerClasses = cn(
    'relative p-3 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0',
    isCompleted && 'bg-gradient-to-br from-gray-700 to-gray-800',
    isAccessible && !isCompleted && `bg-gradient-to-br ${chapter.color || 'from-purple-600 to-indigo-600'}`,
    !isAccessible && 'bg-gray-800'
  );

  const titleClasses = cn(
    'text-xl font-bold mb-1 leading-tight',
    isCompleted && 'text-gray-400',
    isAccessible && !isCompleted && 'text-white',
    !isAccessible && 'text-gray-500'
  );

  const subtitleClasses = cn(
    'text-sm leading-relaxed',
    isCompleted && 'text-gray-500',
    isAccessible && !isCompleted && 'text-purple-300',
    !isAccessible && 'text-gray-600'
  );

  return (
    <motion.div
      initial={{ opacity: 0, x: -30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{
        delay: index * 0.1,
        type: "spring",
        stiffness: 100,
        damping: 20
      }}
      whileHover={isAccessible ? { scale: 1.01, y: -2 } : {}}
      whileTap={isAccessible ? { scale: 0.99 } : {}}
      onClick={isAccessible ? onSelect : undefined}
      className={cardContainerClasses}
    >
      {/* Background Effects */}
      {isCompleted && <div className="absolute inset-0 bg-gradient-to-br from-green-900/10 via-transparent to-transparent pointer-events-none" />}
      {isAccessible && !isCompleted && chapter.progress > 0 && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-purple-600/15 via-purple-600/5 to-transparent pointer-events-none"
          initial={{ x: '-100%' }}
          animate={{ x: `${chapter.progress - 100}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
      )}

      {/* Badges */}
      {isCompleted && (
        <motion.div initial={{ scale: 0, rotate: -180 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: "spring", stiffness: 200, delay: 0.2 }} className="absolute top-5 right-5 z-10">
          <div className="relative">
            <div className="absolute inset-0 bg-green-500 blur-lg opacity-30 animate-pulse" />
            <div className="relative w-10 h-10 bg-gradient-to-br from-green-600/90 to-emerald-700/90 rounded-full flex items-center justify-center shadow-lg">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
          </div>
        </motion.div>
      )}
      {isFirstChapter && !isCompleted && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="absolute top-5 right-5 z-10">
          <div className="px-3 py-1 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full">
            <span className="text-xs font-bold text-white tracking-wide">FREE</span>
          </div>
        </motion.div>
      )}

      <div className="relative flex items-start gap-4">
        {/* Icon */}
        <motion.div whileHover={isAccessible && !isCompleted ? { rotate: 5, scale: 1.1 } : {}} transition={{ type: "spring", stiffness: 300 }} className={iconContainerClasses}>
          {isCompleted ? (
            <><div className="absolute inset-0 bg-green-500/20 rounded-xl" /><CheckCircle className="relative w-7 h-7 text-green-400" /></>
          ) : isAccessible ? (
            <><div className="absolute inset-0 bg-white/20 rounded-xl animate-pulse" /><Icon className="relative w-7 h-7 text-white" /></>
          ) : (
            <Lock className="w-7 h-7 text-gray-600" />
          )}
        </motion.div>

        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1 pr-3">
              <h3 className={titleClasses}>
                Chapter {index + 1}: {chapter.title}
              </h3>
              {chapter.subtitle && <p className={subtitleClasses}>{chapter.subtitle}</p>}
            </div>

            {/* Action Icons/Badges */}
            {!isAccessible && chapter.requiredXP && chapter.requiredXP > 0 && (
              <motion.div className="flex items-center gap-1.5 bg-amber-500/20 px-3 py-1.5 rounded-lg" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.1 }}>
                <Lock className="w-3.5 h-3.5 text-amber-400" />
                <span className="text-amber-300 text-sm font-semibold">{chapter.requiredXP} XP</span>
              </motion.div>
            )}
            {isAccessible && !isCompleted && (
              <motion.div animate={{ x: [0, 4, 0] }} transition={{ duration: 1.5, repeat: Infinity }} className="text-purple-400">
                <PlayCircle className="w-7 h-7" />
              </motion.div>
            )}
          </div>

          {/* Description */}
          {chapter.description && isAccessible && (
            <p className={cn('text-sm leading-relaxed mb-4 line-clamp-2', isCompleted ? 'text-gray-500' : 'text-purple-200/80')}>
              {chapter.description}
            </p>
          )}

          {/* Accessible Content */}
          {isAccessible ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <BookOpen className={cn('w-4 h-4', isCompleted ? 'text-gray-500' : 'text-purple-400')} />
                  <span className={cn('text-sm', isCompleted ? 'text-gray-500' : 'text-purple-300')}>{chapter.totalLessons} {chapter.totalLessons === 1 ? 'lesson' : 'lessons'}</span>
                </div>
                {chapter.completedLessons > 0 && <span className={cn('font-semibold text-sm', isCompleted ? 'text-green-600' : 'text-purple-200')}>{chapter.completedLessons} / {chapter.totalLessons} completed</span>}
              </div>

              {/* Progress Bar */}
              {chapter.totalLessons > 0 && (
                <div className="relative">
                  <div className={cn('w-full rounded-full h-2.5 overflow-hidden', isCompleted ? 'bg-gray-800' : 'bg-purple-900/40')}>
                    <motion.div
                      className={cn('h-full rounded-full transition-all', isCompleted ? 'bg-gradient-to-r from-green-600 to-emerald-600' : 'bg-gradient-to-r from-purple-500 to-pink-500')}
                      initial={{ width: 0 }}
                      animate={{ width: `${chapter.progress}%` }}
                      transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
                    />
                  </div>
                </div>
              )}

              {/* Stats Row */}
              <div className="flex items-center gap-5 text-sm">
                <div className="flex items-center gap-1.5">
                  <Clock className={cn('w-4 h-4', isCompleted ? 'text-gray-500' : 'text-purple-300')} />
                  <span className={isCompleted ? 'text-gray-500' : 'text-purple-300'}>{chapter.totalDuration} min</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Trophy className={cn('w-4 h-4', isCompleted ? 'text-gray-500' : 'text-amber-300')} />
                  <span className={isCompleted ? 'text-gray-500' : 'text-amber-300'}>+{chapter.xpReward} XP</span>
                </div>
                {isCompleted && (
                  <motion.div className="ml-auto flex items-center gap-1.5 text-green-600" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
                    <Sparkles className="w-4 h-4" />
                    <span className="font-semibold text-sm">Mastered!</span>
                  </motion.div>
                )}
              </div>

              {/* CTA Button */}
              {!isCompleted && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="pt-1">
                  <div className={cn('w-full py-2.5 px-5 rounded-lg font-semibold text-sm transition-all flex items-center justify-center gap-1.5 group', chapter.progress > 0 ? 'bg-purple-600/40 hover:bg-purple-600/50 text-purple-200' : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white shadow-lg hover:shadow-xl')}>
                    <span>{chapter.progress > 0 ? 'Continue' : 'Start'} Chapter</span>
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </motion.div>
              )}
            </div>
          ) : (
            // Locked Content
            <div className="text-sm">
              <p className="text-gray-400 leading-relaxed">Complete previous chapters to unlock</p>
              {chapter.requiredXP && chapter.requiredXP > 0 && <p className="text-xs text-gray-500 mt-1.5">Requires {chapter.requiredXP} XP</p>}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

