// src/features/yin/components/chapters/lesson/LessonHeader.tsx
import { motion } from 'framer-motion';
import { BookOpen, ChevronLeft, Clock } from 'lucide-react';
import React from 'react';

interface LessonHeaderProps {
  lessonTitle: string;
  chapterTitle?: string;
  duration?: number;
  currentSection: number;
  totalSections: number;
  progress: number;
  onBack?: () => void;
}

export const LessonHeader: React.FC<LessonHeaderProps> = ({
  lessonTitle,
  chapterTitle,
  duration = 15,
  currentSection,
  totalSections,
  progress,
  onBack
}) => {
  return (
    <div className="sticky top-0 z-20 bg-black/30 backdrop-blur-xl rounded-3xl p-6 mb-8 border border-purple-500/20">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          {onBack && (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onBack}
              className="p-2 hover:bg-purple-500/20 rounded-lg transition-colors"
              aria-label="Back to chapter"
            >
              <ChevronLeft className="w-5 h-5 text-purple-300" />
            </motion.button>
          )}
          
          <div>
            <h1 className="text-2xl font-bold text-white mb-1">{lessonTitle}</h1>
            <div className="flex items-center gap-4 text-sm text-purple-300">
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {duration} min
              </span>
              {chapterTitle && (
                <span className="flex items-center gap-1">
                  <BookOpen className="w-4 h-4" />
                  {chapterTitle}
                </span>
              )}
            </div>
          </div>
        </div>
        
        <div className="text-right">
          <p className="text-purple-400 text-sm mb-1">
            Section {currentSection + 1} of {totalSections}
          </p>
          <div className="flex items-center gap-2">
            <div className="w-32 h-2 bg-gray-900/50 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-purple-600 to-pink-600"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
            <span className="text-white text-sm font-semibold">{Math.round(progress)}%</span>
          </div>
        </div>
      </div>
    </div>
  );
};