// src/features/yin/components/chapters/lesson/LessonNavigation.tsx
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import React from 'react';

interface LessonNavigationProps {
  currentSection: number;
  totalSections: number;
  hasMoreContent: boolean;
  onPrevious: () => void;
  onNext: () => void;
}

export const LessonNavigation: React.FC<LessonNavigationProps> = ({
  currentSection,
  totalSections,
  hasMoreContent,
  onPrevious,
  onNext
}) => {
  const isFirstSection = currentSection === 0;
  const isLastSection = currentSection === totalSections - 1;
  
  const nextButtonText = isLastSection && !hasMoreContent ? 
    'Complete Lesson' : 
    isLastSection ? 
    'Continue' : 
    'Next Section';

  return (
    <div className="flex justify-between items-center mt-8">
      <motion.button
        whileHover={{ scale: isFirstSection ? 1 : 1.05 }}
        whileTap={{ scale: isFirstSection ? 1 : 0.95 }}
        onClick={onPrevious}
        disabled={isFirstSection}
        className={`
          flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all
          ${isFirstSection
            ? 'bg-gray-900/30 text-gray-600 cursor-not-allowed'
            : 'bg-purple-600/20 text-purple-300 hover:bg-purple-600/30 backdrop-blur-sm'
          }
        `}
      >
        <ChevronLeft className="w-5 h-5" />
        Previous
      </motion.button>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onNext}
        className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl text-white font-semibold hover:shadow-lg hover:shadow-purple-500/25 transition-all"
      >
        {nextButtonText}
        <ChevronRight className="w-5 h-5" />
      </motion.button>
    </div>
  );
};