// src/features/yin/components/chapters/ChapterCard.tsx

import { motion } from 'framer-motion';
import { BookOpen, CheckCircle, Clock, Lock, Star } from 'lucide-react';
import React from 'react';
import { ChapterData } from '../../types/chapter.types';

interface ChapterCardProps {
  chapter: ChapterData;
  onClick: () => void;
}

export const ChapterCard: React.FC<ChapterCardProps> = ({ chapter, onClick }) => {
  const Icon = chapter.icon;
  
  return (
    <motion.div
      whileHover={{ scale: chapter.unlocked ? 1.05 : 1 }}
      whileTap={{ scale: chapter.unlocked ? 0.98 : 1 }}
      className={`relative group cursor-pointer ${!chapter.unlocked && 'opacity-75'}`}
      onClick={onClick}
    >
      <div className={`relative bg-black/30 backdrop-blur-xl rounded-3xl border border-purple-500/20 p-6 overflow-hidden ${
        chapter.unlocked ? 'hover:border-purple-400/50' : ''
      }`}>
        {/* Background Gradient */}
        <div className={`absolute inset-0 bg-gradient-to-br ${chapter.color} opacity-10 group-hover:opacity-20 transition-opacity`} />
        
        {/* Premium Badge */}
        {chapter.premium && (
          <div className="absolute top-4 right-4 bg-gradient-to-r from-amber-500 to-orange-500 p-1.5 rounded-full">
            <Star className="w-4 h-4 text-white" fill="currentColor" />
          </div>
        )}
        
        {/* Icon */}
        <div className={`relative w-16 h-16 bg-gradient-to-br ${chapter.color} rounded-2xl flex items-center justify-center mb-4 shadow-lg ${chapter.glow}`}>
          {chapter.unlocked ? (
            <Icon className="w-8 h-8 text-white" />
          ) : (
            <Lock className="w-8 h-8 text-white/60" />
          )}
        </div>
        
        {/* Content */}
        <h3 className="text-xl font-bold text-white mb-2">{chapter.title}</h3>
        <p className="text-purple-300/60 text-sm mb-4">{chapter.subtitle}</p>
        <p className="text-purple-200/40 text-xs mb-4 line-clamp-2">{chapter.description}</p>
        
        {/* Stats */}
        <div className="flex items-center justify-between text-xs text-purple-300/60 mb-4">
          <span className="flex items-center gap-1">
            <BookOpen className="w-3 h-3" />
            {chapter.lessons} lessons
          </span>
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {chapter.duration}
          </span>
        </div>
        
        {/* Progress Bar */}
        {chapter.progress > 0 && (
          <div className="relative">
            <div className="flex justify-between text-xs mb-1">
              <span className="text-purple-400">Progress</span>
              <span className="text-white font-bold">{chapter.progress}%</span>
            </div>
            <div className="h-2 bg-black/50 rounded-full overflow-hidden">
              <motion.div 
                className={`h-full bg-gradient-to-r ${chapter.color} shadow-lg`}
                initial={{ width: 0 }}
                animate={{ width: `${chapter.progress}%` }}
                transition={{ duration: 1, delay: 0.2 }}
              />
            </div>
          </div>
        )}
        
        {/* Action Button */}
        {chapter.unlocked && (
          <motion.button 
            className="mt-4 w-full py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl text-white font-semibold opacity-0 group-hover:opacity-100 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/25"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {chapter.progress > 0 ? 'Continue Journey' : 'Begin Journey'}
          </motion.button>
        )}
      </div>
      
      {/* Completion Badge */}
      {chapter.progress === 100 && (
        <motion.div 
          className="absolute -top-2 -right-2 bg-gradient-to-r from-green-500 to-emerald-500 p-2 rounded-full shadow-lg shadow-green-500/50"
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 200, delay: 0.5 }}
        >
          <CheckCircle className="w-5 h-5 text-white" />
        </motion.div>
      )}
    </motion.div>
  );
};