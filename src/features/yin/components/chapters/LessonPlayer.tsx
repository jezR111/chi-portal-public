// src/features/yin/components/chapters/LessonPlayer.tsx

import { motion } from 'framer-motion';
import {
  CheckCircle,
  Clock, Lightbulb,
  Pause,
  Play
} from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { Chapter, Lesson } from '../../data/pathsData';

interface LessonPlayerProps {
  lesson: Lesson;
  chapter: Chapter;
  onComplete: () => void;
  onInsightTrigger: () => void;
  onMeditationTrigger: () => void;
}

export const LessonPlayer: React.FC<LessonPlayerProps> = ({
  lesson,
  chapter,
  onComplete,
  onInsightTrigger,
  onMeditationTrigger
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [showInsightPrompt, setShowInsightPrompt] = useState(false);

  useEffect(() => {
    // Trigger meditation after 15 minutes
    if (timeElapsed === 15 * 60) {
      onMeditationTrigger();
    }
    
    // Show insight prompt at key moments
    if (timeElapsed % (5 * 60) === 0 && timeElapsed > 0) {
      setShowInsightPrompt(true);
      setTimeout(() => setShowInsightPrompt(false), 5000);
    }
  }, [timeElapsed]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setTimeElapsed(prev => prev + 1);
        setProgress(prev => Math.min(prev + 1, 100));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  return (
    <div className="bg-gradient-to-br from-gray-900/50 to-purple-900/30 backdrop-blur-xl rounded-2xl border border-purple-500/30 p-8">
      {/* Lesson Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-purple-100 mb-1">{lesson.title}</h2>
          <p className="text-purple-300/80">From: {chapter.title}</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-purple-400" />
            <span className="text-purple-300">{lesson.duration}</span>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="bg-black/30 rounded-xl p-6 mb-6 min-h-[400px]">
        <div className="prose prose-invert max-w-none">
          <p className="text-purple-200/90 leading-relaxed">
            {/* Lesson content would go here */}
            This is where the lesson content would be displayed. 
            It could include text, images, videos, or interactive elements.
          </p>
        </div>

        {/* Insight Prompt */}
        {showInsightPrompt && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mt-6 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg"
          >
            <div className="flex items-center gap-3">
              <Lightbulb className="w-5 h-5 text-yellow-400" />
              <p className="text-yellow-300/90">
                Something resonating? Capture your insight!
              </p>
              <button
                onClick={onInsightTrigger}
                className="ml-auto px-4 py-2 bg-yellow-500/20 hover:bg-yellow-500/30 rounded-lg text-yellow-300 transition-colors"
              >
                Add Insight
              </button>
            </div>
          </motion.div>
        )}
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-purple-400">Lesson Progress</span>
          <span className="text-purple-300">{progress}%</span>
        </div>
        <div className="h-2 bg-black/50 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-purple-500 to-purple-400"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between">
        <motion.button
          onClick={() => setIsPlaying(!isPlaying)}
          className="px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 rounded-xl text-purple-100 font-semibold flex items-center gap-2"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {isPlaying ? (
            <>
              <Pause className="w-5 h-5" />
              Pause Lesson
            </>
          ) : (
            <>
              <Play className="w-5 h-5" />
              Continue Lesson
            </>
          )}
        </motion.button>

        {progress >= 100 && (
          <motion.button
            onClick={onComplete}
            className="px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 rounded-xl text-green-100 font-semibold flex items-center gap-2"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <CheckCircle className="w-5 h-5" />
            Complete Lesson
          </motion.button>
        )}
      </div>
    </div>
  );
};