// src/features/yin/components/chapters/ChapterDetailModal.tsx

import { LessonList } from '@/features/yin/components/chapters/LessonList';
import { AnimatePresence, motion } from 'framer-motion';
import { BookOpen, CheckCircle, Clock, Play, Sparkles, X } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { ChapterData, LessonData } from '../../types/chapter.types';

interface ChapterDetailModalProps {
  chapter: ChapterData;
  onClose: () => void;
  onLessonStart: (lessonId: string) => void;
  onInsightCapture?: (insight: any) => void;
}

export const ChapterDetailModal: React.FC<ChapterDetailModalProps> = ({
  chapter,
  onClose,
  onLessonStart,
}) => {
  // Define the Icon component from the chapter prop.
  const Icon = chapter?.icon; 

  const [selectedLesson, setSelectedLesson] = useState<LessonData | null>(null);
  const [isClosing, setIsClosing] = useState(false);

  // Safety check: If for some reason the chapter or icon doesn't exist, don't render anything.
  if (!chapter || !Icon) {
    return null;
  }

  // Effect to prevent body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);
  
  // Helper function to check if a lesson is accessible, moved inside the component
  const isLessonAccessible = (lesson: LessonData, allLessons?: LessonData[]): boolean => {
    if (!allLessons) return false; // A lesson list must exist
    const lessonIndex = allLessons.findIndex(l => l.id === lesson.id);
    if (lessonIndex === 0) return true; // The first lesson is always accessible
    if (lessonIndex > 0) {
      return allLessons[lessonIndex - 1].completed; // Accessible if the previous is complete
    }
    return false;
  };

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(onClose, 300); // Wait for animation to finish before calling parent's onClose
  };
  
  const handleLessonClick = (lesson: LessonData) => {
    if (isLessonAccessible(lesson, chapter.lessonList)) {
      setSelectedLesson(lesson);
    }
  };
  
  const handleStartLesson = () => {
    // Logic to start the first available lesson or the selected one
    if (selectedLesson && isLessonAccessible(selectedLesson, chapter.lessonList)) {
      onLessonStart(selectedLesson.id);
    } else if (chapter.lessonList?.length > 0) {
      const firstIncomplete = chapter.lessonList.find(l => !l.completed);
      const firstLesson = chapter.lessonList[0];

      if (firstIncomplete && isLessonAccessible(firstIncomplete, chapter.lessonList)) {
        onLessonStart(firstIncomplete.id);
      } else if (firstLesson) {
        onLessonStart(firstLesson.id);
      }
    }
  };

  const completedLessons = chapter.lessonList?.filter(l => l.completed).length || 0;
  const totalLessons = chapter.lessonList?.length || chapter.lessons;
  
  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* Backdrop */}
        <motion.div
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={handleClose}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        />
        
        {/* Modal Content */}
        <motion.div
          className="relative bg-gradient-to-br from-slate-900 via-purple-900/50 to-slate-900 rounded-3xl border border-purple-500/20 max-w-4xl w-full max-h-[85vh] overflow-hidden flex flex-col"
          initial={{ scale: 0.9, y: 20, opacity: 0 }}
          animate={{ scale: isClosing ? 0.9 : 1, y: isClosing ? 20 : 0, opacity: isClosing ? 0 : 1 }}
          exit={{ scale: 0.9, y: 20, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          {/* Header */}
          <div className="relative p-8 pb-6 border-b border-purple-500/20">
            <div className={`absolute inset-0 bg-gradient-to-br ${chapter.color} opacity-10`} />
            
            <button
              onClick={handleClose}
              className="absolute top-6 right-6 p-2 hover:bg-white/10 rounded-xl transition-colors z-10"
            >
              <X className="w-5 h-5 text-white" />
            </button>
            
            <div className="relative flex items-start gap-6">
              <div className={`w-20 h-20 bg-gradient-to-br ${chapter.color} rounded-2xl flex items-center justify-center shadow-lg ${chapter.glow}`}>
                <Icon className="w-10 h-10 text-white" />
              </div>
              
              <div className="flex-1">
                <h2 className="text-3xl font-bold text-white mb-2">{chapter.title}</h2>
                <p className="text-purple-300/80 text-lg mb-3">{chapter.subtitle}</p>
                <p className="text-purple-200/60">{chapter.description}</p>
                
                <div className="flex items-center gap-6 mt-4">
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-purple-400" />
                    <span className="text-purple-300">{totalLessons} lessons</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-purple-400" />
                    <span className="text-purple-300">{chapter.duration}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span className="text-purple-300">{completedLessons} completed</span>
                  </div>
                </div>
              </div>
              
              {chapter.premium && (
                <div className="absolute top-0 right-12 bg-gradient-to-r from-amber-500 to-orange-500 px-3 py-1 rounded-full flex items-center gap-1">
                  <Sparkles className="w-4 h-4 text-white" />
                  <span className="text-white text-sm font-semibold">Premium</span>
                </div>
              )}
            </div>
            
            {chapter.progress > 0 && (
              <div className="relative mt-6">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-purple-400">Chapter Progress</span>
                  <span className="text-white font-bold">{chapter.progress}%</span>
                </div>
                <div className="h-3 bg-black/50 rounded-full overflow-hidden">
                  <motion.div
                    className={`h-full bg-gradient-to-r ${chapter.color} shadow-lg`}
                    initial={{ width: 0 }}
                    animate={{ width: `${chapter.progress}%` }}
                    transition={{ duration: 1 }}
                  />
                </div>
              </div>
            )}
          </div>
          
          {/* Lessons List - now scrolls independently */}
          <div className="p-8 pt-6 overflow-y-auto flex-grow custom-scrollbar">
            {chapter.lessonList ? (
              <LessonList
                lessons={chapter.lessonList}
                onLessonClick={handleLessonClick}
                selectedLesson={selectedLesson}
              />
            ) : (
              <div className="text-center py-12">
                <p className="text-purple-300">Lessons will be revealed as you progress.</p>
              </div>
            )}
          </div>
          
          {/* Action Footer */}
          <div className="p-8 pt-6 border-t border-purple-500/20 mt-auto">
            <div className="flex items-center justify-between">
              <div className="text-sm text-purple-300/60">
                {selectedLesson ? (
                  <span>Selected: {selectedLesson.title}</span>
                ) : (
                  <span>Select a lesson or start your journey</span>
                )}
              </div>
              
              <motion.button
                onClick={handleStartLesson}
                className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl text-white font-semibold flex items-center gap-2 hover:shadow-lg hover:shadow-purple-500/25 transition-all"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Play className="w-5 h-5" />
                {chapter.progress > 0 ? 'Continue Journey' : 'Begin Chapter'}
              </motion.button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

// NOTE: To style the scrollbar, add the following to your global CSS file (e.g., globals.css)
/*
 .custom-scrollbar::-webkit-scrollbar {
   width: 6px;
 }
 .custom-scrollbar::-webkit-scrollbar-track {
   background: rgba(139, 92, 246, 0.1);
   border-radius: 3px;
 }
 .custom-scrollbar::-webkit-scrollbar-thumb {
   background: rgba(139, 92, 246, 0.3);
   border-radius: 3px;
 }
 .custom-scrollbar::-webkit-scrollbar-thumb:hover {
   background: rgba(139, 92, 246, 0.5);
 }
*/

