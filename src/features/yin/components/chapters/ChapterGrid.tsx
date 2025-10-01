// src/features/yin/components/chapters/ChapterGrid.tsx

import { motion } from 'framer-motion';
import React from 'react';
import { ChapterData } from '../../types/chapter.types';
import { ChapterCard } from './ChapterCard';

interface ChapterGridProps {
  chapters: ChapterData[];
  onChapterClick: (chapter: ChapterData) => void;
  gridCols?: 1 | 2 | 3 | 4;
  className?: string;
}

export const ChapterGrid: React.FC<ChapterGridProps> = ({ 
  chapters, 
  onChapterClick,
  gridCols = 3,
  className = ''
}) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 20
      }
    }
  };
  
  const getGridClass = () => {
    switch (gridCols) {
      case 1: return 'grid-cols-1';
      case 2: return 'grid-cols-1 md:grid-cols-2';
      case 3: return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';
      case 4: return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4';
      default: return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';
    }
  };
  
  return (
    <motion.div 
      className={`grid ${getGridClass()} gap-6 ${className}`}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {chapters.map((chapter, index) => (
        <motion.div 
          key={chapter.id} 
          variants={itemVariants}
          custom={index}
        >
          <ChapterCard
            chapter={chapter}
            index={index} // Pass the index prop
            onSelect={() => onChapterClick(chapter)}
          />
        </motion.div>
      ))}
    </motion.div>
  );
};

export default ChapterGrid;