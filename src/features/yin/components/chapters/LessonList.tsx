// src/features/yin/components/chapters/LessonList.tsx

import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Circle, Lock, Play, Clock, Lightbulb } from 'lucide-react';
import { LessonData } from '../../types/chapter.types';

interface LessonListProps {
  lessons: LessonData[];
  onLessonClick: (lesson: LessonData) => void;
  selectedLesson: LessonData | null;
}

export const LessonList: React.FC<LessonListProps> = ({
  lessons,
  onLessonClick,
  selectedLesson
}) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };
  
  const itemVariants = {
    hidden: { x: -20, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };
  
  const isLessonAccessible = (index: number): boolean => {
    if (index === 0) return true;
    return lessons[index - 1].completed;
  };
  
  return (
    <motion.div
      className="space-y-3"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <h3 className="text-lg font-semibold text-white mb-4">Lesson Journey</h3>
      
      {lessons.map((lesson, index) => {
        const accessible = isLessonAccessible(index);
        const isSelected = selectedLesson?.id === lesson.id;
        const hasInsights = lesson.insights && lesson.insights.length > 0;
        
        return (
          <motion.div
            key={lesson.id}
            variants={itemVariants}
            whileHover={accessible ? { x: 5 } : {}}
            className={`relative ${!accessible && 'opacity-50'}`}
          >
            {/* Connection Line */}
            {index < lessons.length - 1 && (
              <div 
                className={`absolute left-6 top-12 w-0.5 h-16 ${
                  lesson.completed ? 'bg-green-400/30' : 'bg-purple-500/20'
                }`}
              />
            )}
            
            <motion.div
              onClick={() => accessible && onLessonClick(lesson)}
              className={`relative flex items-center gap-4 p-4 rounded-xl border transition-all cursor-pointer ${
                isSelected
                  ? 'bg-purple-600/20 border-purple-500/50 shadow-lg shadow-purple-500/20'
                  : lesson.completed
                  ? 'bg-purple-500/10 border-purple-500/30 hover:bg-purple-500/20'
                  : accessible
                  ? 'bg-black/30 border-purple-500/20 hover:bg-black/40'
                  : 'bg-black/20 border-purple-500/10 cursor-not-allowed'
              }`}
              whileTap={accessible ? { scale: 0.98 } : {}}
            >
              {/* Status Icon */}
              <div className="relative">
                {lesson.completed ? (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200 }}
                  >
                    <CheckCircle className="w-6 h-6 text-green-400" />
                  </motion.div>
                ) : accessible ? (
                  <div className="relative">
                    <Circle className="w-6 h-6 text-purple-400" />
                    {isSelected && (
                      <motion.div
                        className="absolute inset-0 flex items-center justify-center"
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <div className="w-3 h-3 bg-purple-400 rounded-full" />
                      </motion.div>
                    )}
                  </div>
                ) : (
                  <Lock className="w-6 h-6 text-purple-500/50" />
                )}
              </div>
              
              {/* Lesson Info */}
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h4 className="text-white font-medium">
                    Lesson {index + 1}: {lesson.title}
                  </h4>
                  {hasInsights && (
                    <Lightbulb className="w-4 h-4 text-yellow-400" title="Has insights" />
                  )}
                </div>
                <div className="flex items-center gap-4 mt-1">
                  <span className="text-purple-300/60 text-sm flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {lesson.duration}
                  </span>
                  {lesson.progress && (
                    <span className="text-purple-400 text-sm">
                      {Math.round((lesson.progress.totalTimeSpent / 60000))} min spent
                    </span>
                  )}
                  {lesson.insights && lesson.insights.length > 0 && (
                    <span className="text-yellow-400/60 text-sm">
                      {lesson.insights.length} insights
                    </span>
                  )}
                </div>
              </div>
              
              {/* Action Button */}
              {accessible && (
                <motion.button
                  className={`p-2 rounded-lg transition-colors ${