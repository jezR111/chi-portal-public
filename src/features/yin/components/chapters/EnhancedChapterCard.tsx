// src/features/yin/components/chapters/EnhancedChapterCard.tsx

import { AnimatePresence, motion } from 'framer-motion';
import { BookOpen, CheckCircle, ChevronDown, ChevronUp, Lock, Unlock, Users } from 'lucide-react';
import { useState } from 'react';

interface EnhancedChapterCardProps {
  chapter: any;
  index: number;
  onSelectLesson: (lesson: any) => void;
  unlockedLessons: string[];
  completedLessons: string[];
  lessonProgress: Record<string, any>; // For tracking progress within lessons
  onUnlockLesson?: (lessonId: string, cost: number) => void;
  onCommunityClick?: (context: { type: 'chapter', id: string, title: string }) => void;
  currentXP: number;
}

export default function EnhancedChapterCard({
  chapter,
  index,
  onSelectLesson,
  unlockedLessons,
  completedLessons,
  lessonProgress,
  onUnlockLesson,
  onCommunityClick,
  currentXP
}: EnhancedChapterCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [showAll, setShowAll] = useState(false);
  
  const visibleLessons = showAll ? chapter.lessons : chapter.lessons.slice(0, 5);
  const hasMore = chapter.lessons.length > 5;
  
  const XP_UNLOCK_COST = 100; // Updated to 100 XP
  
  const getLessonStatus = (lesson: any, index: number) => {
    if (completedLessons.includes(lesson.id)) return 'completed';
    if (index === 0) return 'unlocked';
    if (unlockedLessons.includes(lesson.id)) return 'unlocked';
    
    const prevLesson = chapter.lessons[index - 1];
    if (completedLessons.includes(prevLesson.id)) return 'available';
    
    return 'locked';
  };

  const getLessonProgressPercent = (lessonId: string) => {
    const progress = lessonProgress[lessonId];
    if (!progress) return 0;
    
    if (progress.type === 'overview') {
      const totalSections = progress.totalSections || 1;
      const completedSections = progress.completedSections || 0;
      return Math.round((completedSections / totalSections) * 100);
    } else {
      const totalAspects = progress.totalAspects || 1;
      const completedAspects = progress.completedAspects || 0;
      return Math.round((completedAspects / totalAspects) * 100);
    }
  };

  return (
    <motion.div
      className={`
        bg-black/40 backdrop-blur-xl rounded-3xl p-6
        border transition-all duration-300
        ${chapter.unlocked 
          ? 'border-purple-500/30 hover:border-purple-400/50' 
          : 'border-gray-600/30'
        }
      `}
    >
      <div 
        className="cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4">
            <div className={`
              w-16 h-16 rounded-2xl flex items-center justify-center
              bg-gradient-to-br ${chapter.color || 'from-purple-500 to-pink-500'}
              ${!chapter.unlocked && 'opacity-50 grayscale'}
            `}>
              {chapter.unlocked ? (
                <BookOpen className="w-8 h-8 text-white" />
              ) : (
                <Lock className="w-8 h-8 text-white/70" />
              )}
            </div>
            
            <div className="flex-1">
              <h3 className="text-xl font-bold text-white mb-1">
                Chapter {index + 1}: {chapter.title}
              </h3>
              <p className="text-purple-300 text-sm mb-2">{chapter.subtitle}</p>
              <p className="text-purple-200/70 text-sm">{chapter.description}</p>
              
              <div className="flex items-center gap-4 mt-3">
                <span className="text-purple-400 text-sm">
                  📚 {chapter.lessons.length} lessons
                </span>
                <span className="text-purple-400 text-sm">
                  ⏱️ {chapter.totalDuration} min
                </span>
                <span className="text-amber-400 text-sm">
                  ✨ +{chapter.xpReward} XP
                </span>
              </div>
              
              {/* Chapter Progress Bar */}
              <div className="mt-3">
                <div className="h-2 bg-purple-900/30 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-500"
                    style={{ width: `${chapter.progress || 0}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
          
          <motion.div
            animate={{ rotate: expanded ? 180 : 0 }}
            className="mt-2"
          >
            <ChevronDown className="w-6 h-6 text-purple-400" />
          </motion.div>
        </div>
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="mt-6 space-y-2 overflow-hidden"
          >
            {visibleLessons.map((lesson: any, lessonIndex: number) => {
              const status = getLessonStatus(lesson, lessonIndex);
              const progressPercent = getLessonProgressPercent(lesson.id);
              const canUnlockWithXP = status === 'locked' && currentXP >= XP_UNLOCK_COST;
              const isInProgress = progressPercent > 0 && progressPercent < 100;
              
              return (
                <motion.div
                  key={lesson.id}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: lessonIndex * 0.05 }}
                  className={`
                    p-4 rounded-xl border transition-all relative overflow-hidden
                    ${status === 'completed' 
                      ? 'bg-green-900/20 border-green-500/30 hover:bg-green-900/30 cursor-pointer'
                      : status === 'unlocked' 
                      ? 'bg-purple-900/20 border-purple-500/30 hover:bg-purple-900/30 cursor-pointer' 
                      : status === 'available'
                      ? 'bg-purple-950/20 border-purple-600/20 hover:bg-purple-950/30 cursor-pointer'
                      : 'bg-gray-900/20 border-gray-700/30'
                    }
                  `}
                  onClick={() => {
                    if (status !== 'locked') {
                      onSelectLesson(lesson);
                    }
                  }}
                >
                  {/* Progress overlay for in-progress lessons */}
                  {isInProgress && (
                    <div 
                      className="absolute left-0 top-0 h-full bg-purple-500/10 transition-all duration-500"
                      style={{ width: `${progressPercent}%` }}
                    />
                  )}
                  
                  <div className="flex items-center justify-between relative z-10">
                    <div className="flex items-center gap-3">
                      <div className={`
                        w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold
                        ${status === 'completed'
                          ? 'bg-green-500/30 text-green-200'
                          : status === 'unlocked' || status === 'available'
                          ? 'bg-purple-500/30 text-purple-200' 
                          : 'bg-gray-700/30 text-gray-400'
                        }
                      `}>
                        {status === 'completed' ? '✓' : lessonIndex + 1}
                      </div>
                      
                      <div className="flex-1">
                        <h4 className={`
                          font-semibold
                          ${status === 'locked' ? 'text-gray-400' : 'text-white'}
                        `}>
                          {lesson.title}
                          {isInProgress && (
                            <span className="ml-2 text-xs text-purple-400">
                              ({progressPercent}% complete)
                            </span>
                          )}
                        </h4>
                        {lesson.type === 'overview' ? (
                          <p className="text-purple-300/70 text-sm mt-1">
                            Foundation lesson • {lesson.keyLearnings?.length || 0} key concepts
                          </p>
                        ) : (
                          <p className="text-purple-300/70 text-sm mt-1">
                            {lesson.briefDescription || 'Explore this concept in depth'}
                          </p>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {status === 'locked' ? (
                        <>
                          <Lock className="w-4 h-4 text-gray-500" />
                          {canUnlockWithXP && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onUnlockLesson?.(lesson.id, XP_UNLOCK_COST);
                              }}
                              className="px-3 py-1 bg-amber-500/20 hover:bg-amber-500/30 
                                       border border-amber-500/30 rounded-lg text-amber-300 
                                       text-sm transition-all flex items-center gap-1"
                            >
                              <Unlock className="w-3 h-3" />
                              {XP_UNLOCK_COST} XP
                            </button>
                          )}
                        </>
                      ) : status === 'completed' ? (
                        <CheckCircle className="w-5 h-5 text-green-400" />
                      ) : isInProgress ? (
                        <span className="text-purple-400 text-sm">Resume</span>
                      ) : status === 'available' ? (
                        <span className="text-purple-400 text-sm">Start</span>
                      ) : null}
                    </div>
                  </div>
                </motion.div>
              );
            })}
            
            {hasMore && !showAll && (
              <button
                onClick={() => setShowAll(true)}
                className="w-full py-2 text-purple-400 hover:text-purple-300 
                         text-sm transition-colors flex items-center justify-center gap-2"
              >
                Show {chapter.lessons.length - 5} more lessons
                <ChevronDown className="w-4 h-4" />
              </button>
            )}
            
            {hasMore && showAll && (
              <button
                onClick={() => setShowAll(false)}
                className="w-full py-2 text-purple-400 hover:text-purple-300 
                         text-sm transition-colors flex items-center justify-center gap-2"
              >
                Show less
                <ChevronUp className="w-4 h-4" />
              </button>
            )}
            
            {/* Community Connection Section */}
            <div className="mt-4 pt-4 border-t border-purple-500/20">
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  onCommunityClick?.({
                    type: 'chapter',
                    id: chapter.id,
                    title: chapter.title
                  });
                }}
                className="flex items-center gap-2 text-purple-300 hover:text-purple-200 transition-colors"
              >
                <Users className="w-4 h-4" />
                <span className="text-sm">
                  {Math.floor(Math.random() * 20) + 5} others studying this chapter
                </span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}