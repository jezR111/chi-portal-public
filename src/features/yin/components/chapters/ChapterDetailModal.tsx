// src/features/yin/components/chapters/ChapterDetailModal.tsx

import { BookOpen, CheckCircle, ChevronRight, Clock, Lock, PlayCircle, X } from 'lucide-react';
import React, { useState } from 'react';
import { lessonContent } from '../../data/lessonContent';
import { useUserProgress } from '../../hooks/useUserProgress';
import { Chapter } from '../../types/chapter.types';

interface ChapterDetailModalProps {
  chapter: Chapter;
  pathId: string;
  chapterIndex: number;
  isOpen: boolean;
  onClose: () => void;
  onStartLesson: (lessonId: string) => void;
}

export const ChapterDetailModal: React.FC<ChapterDetailModalProps> = ({
  chapter,
  pathId,
  chapterIndex,
  isOpen,
  onClose,
  onStartLesson
}) => {
  const { progress, canAccessLesson, isChapterUnlocked } = useUserProgress();
  const [selectedLesson, setSelectedLesson] = useState<string | null>(null);
  
  if (!isOpen) return null;
  
  const isUnlocked = isChapterUnlocked(chapter.id, chapterIndex, pathId);
  const completedLessons = chapter.lessons?.filter(
    lesson => progress.completedLessons.includes(lesson.id)
  ).length || 0;
  const totalLessons = chapter.lessons?.length || 0;
  
  // Get path theme colors
  const getPathTheme = (pathId: string) => {
    const themes: Record<string, string> = {
      'the-self': 'from-purple-600 to-indigo-600',
      'inward-journey': 'from-blue-600 to-cyan-600',
      'energy-bodies': 'from-yellow-600 to-orange-600',
      'self-relating-others': 'from-pink-600 to-rose-600',
      'somatic-healing': 'from-green-600 to-emerald-600',
      'archetypal-realms': 'from-indigo-600 to-purple-600',
      'shadow-integration': 'from-gray-700 to-gray-600',
      'creative-consciousness': 'from-violet-600 to-fuchsia-600'
    };
    return themes[pathId] || themes['the-self'];
  };
  
  const themeGradient = getPathTheme(pathId);
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-gray-900 rounded-2xl 
                    shadow-2xl overflow-hidden flex flex-col">
        {/* Header with gradient */}
        <div className={`relative bg-gradient-to-r ${themeGradient} p-6`}>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 
                     rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-white" />
          </button>
          
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center">
              {chapter.icon ? (
                <span className="text-3xl">{chapter.icon}</span>
              ) : (
                <BookOpen className="w-8 h-8 text-white" />
              )}
            </div>
            
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-white mb-2">{chapter.title}</h2>
              <p className="text-white/80 text-sm">{chapter.subtitle || 'Your spiritual journey continues'}</p>
              <p className="text-white/60 text-sm mt-2">{chapter.description}</p>
            </div>
          </div>
          
          {/* Chapter Stats */}
          <div className="flex items-center gap-6 mt-4">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-white/70" />
              <span className="text-sm text-white/90">{totalLessons} lessons</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-white/70" />
              <span className="text-sm text-white/90">{chapter.duration || totalLessons * 15} min</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-white/70" />
              <span className="text-sm text-white/90">{completedLessons} completed</span>
            </div>
          </div>
        </div>
        
        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {!isUnlocked ? (
            // Locked State
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-20 h-20 bg-gray-800 rounded-full flex items-center justify-center mb-4">
                <Lock className="w-10 h-10 text-gray-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-300 mb-2">Chapter Locked</h3>
              <p className="text-gray-500 mb-6 max-w-md">
                Complete previous chapters or unlock with XP to access this content.
              </p>
              <button className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white 
                               rounded-lg font-medium transition-colors">
                Unlock Chapter
              </button>
            </div>
          ) : chapter.lessons && chapter.lessons.length > 0 ? (
            // Lessons List
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-gray-200 mb-4">
                Lessons will be revealed as you progress
              </h3>
              
              {chapter.lessons.map((lesson, index) => {
                const isCompleted = progress.completedLessons.includes(lesson.id);
                const isAccessible = index === 0 || progress.completedLessons.includes(chapter.lessons[index - 1].id);
                const isLocked = !isAccessible;
                const lessonData = lessonContent[lesson.id];
                
                return (
                  <div
                    key={lesson.id}
                    className={`
                      relative rounded-lg border transition-all duration-200
                      ${isLocked 
                        ? 'bg-gray-900/40 border-gray-800 opacity-60' 
                        : isCompleted
                          ? 'bg-green-900/20 border-green-800/40 hover:bg-green-900/30'
                          : 'bg-gray-800/40 border-gray-700 hover:bg-gray-800/60 cursor-pointer'
                      }
                    `}
                    onClick={() => !isLocked && onStartLesson(lesson.id)}
                  >
                    <div className="p-4 flex items-center gap-4">
                      {/* Lesson Number/Status */}
                      <div className={`
                        w-10 h-10 rounded-full flex items-center justify-center font-semibold
                        ${isCompleted 
                          ? 'bg-green-600 text-white' 
                          : isLocked
                            ? 'bg-gray-800 text-gray-600'
                            : 'bg-purple-600/20 text-purple-400 border border-purple-600/40'
                        }
                      `}>
                        {isCompleted ? (
                          <CheckCircle className="w-5 h-5" />
                        ) : isLocked ? (
                          <Lock className="w-4 h-4" />
                        ) : (
                          <span>{index + 1}</span>
                        )}
                      </div>
                      
                      {/* Lesson Info */}
                      <div className="flex-1">
                        <h4 className={`font-medium mb-1 ${
                          isLocked ? 'text-gray-500' : 'text-gray-100'
                        }`}>
                          {lesson.title}
                        </h4>
                        {lessonData && !isLocked && (
                          <p className="text-sm text-gray-400 line-clamp-2">
                            {lessonData.sections[0]?.content?.slice(0, 100)}...
                          </p>
                        )}
                        {isLocked && (
                          <p className="text-sm text-gray-600 italic">
                            Complete the previous lesson to unlock
                          </p>
                        )}
                        
                        {/* Lesson Meta */}
                        <div className="flex items-center gap-4 mt-2">
                          <span className="text-xs text-gray-500 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {lesson.duration || 15} min
                          </span>
                          <span className="text-xs text-gray-500">
                            +{lesson.xpReward || 10} XP
                          </span>
                          {lesson.type && (
                            <span className="text-xs px-2 py-0.5 bg-gray-800 rounded text-gray-400">
                              {lesson.type}
                            </span>
                          )}
                        </div>
                      </div>
                      
                      {/* Action Button */}
                      {!isLocked && (
                        <button className={`
                          px-4 py-2 rounded-lg text-sm font-medium transition-colors
                          flex items-center gap-2
                          ${isCompleted 
                            ? 'bg-green-700/30 text-green-400 hover:bg-green-700/40' 
                            : 'bg-purple-600/20 text-purple-400 hover:bg-purple-600/30'
                          }
                        `}>
                          {isCompleted ? (
                            <>
                              <span>Review</span>
                              <ChevronRight className="w-4 h-4" />
                            </>
                          ) : (
                            <>
                              <PlayCircle className="w-4 h-4" />
                              <span>Start</span>
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            // No lessons state
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <p className="text-gray-400">No lessons available yet.</p>
            </div>
          )}
        </div>
        
        {/* Footer */}
        {isUnlocked && chapter.lessons && chapter.lessons.length > 0 && (
          <div className="border-t border-gray-800 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">
                  {completedLessons === 0 
                    ? 'Start your journey with the first lesson'
                    : `${completedLessons} of ${totalLessons} lessons completed`
                  }
                </p>
              </div>
              <button
                onClick={() => {
                  const nextLesson = chapter.lessons.find(
                    (l, i) => !progress.completedLessons.includes(l.id) && 
                             (i === 0 || progress.completedLessons.includes(chapter.lessons[i-1].id))
                  );
                  if (nextLesson) onStartLesson(nextLesson.id);
                }}
                className={`px-6 py-3 bg-gradient-to-r ${themeGradient} text-white 
                         rounded-lg font-medium transition-all hover:shadow-lg
                         flex items-center gap-2`}
              >
                <PlayCircle className="w-5 h-5" />
                <span>
                  {completedLessons === 0 ? 'Begin Chapter' : 'Continue Learning'}
                </span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};