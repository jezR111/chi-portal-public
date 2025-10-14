// src/features/yin/components/chapters/interactive/ExerciseSection.tsx
import { motion } from 'framer-motion';
import { CheckCircle, Edit3 } from 'lucide-react';
import React from 'react';

interface ExerciseSectionProps {
  exercise: {
    title: string;
    type: string;
    duration: number;
    instructions: string[];
  };
  onComplete: () => void;
  onSkip: () => void;
}

export const ExerciseSection: React.FC<ExerciseSectionProps> = ({
  exercise,
  onComplete,
  onSkip
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="max-w-4xl mx-auto"
    >
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/20 to-teal-600/20 blur-3xl" />
        
        <div className="relative bg-gradient-to-br from-emerald-900/30 to-teal-900/30 backdrop-blur-xl rounded-3xl p-10 border border-emerald-500/20">
          <div className="text-center mb-8">
            <motion.div
              className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full mx-auto mb-4 flex items-center justify-center"
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.5 }}
            >
              <Edit3 className="w-8 h-8 text-white" />
            </motion.div>
            <h2 className="text-3xl font-bold text-white mb-2">{exercise.title}</h2>
            <p className="text-emerald-300">
              Type: {exercise.type} • Duration: {exercise.duration} minutes
            </p>
          </div>
          
          <div className="space-y-4 mb-8">
            {exercise.instructions.map((instruction, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-start gap-3 group"
              >
                <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-1 group-hover:text-emerald-300 transition-colors" />
                <p className="text-emerald-100/80 leading-relaxed">{instruction}</p>
              </motion.div>
            ))}
          </div>

          <div className="flex justify-center gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onComplete}
              className="px-8 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-xl text-white font-semibold hover:shadow-lg hover:shadow-emerald-500/25 transition-all"
            >
              Complete Exercise
            </motion.button>
            
            <button
              onClick={onSkip}
              className="px-6 py-3 bg-white/10 backdrop-blur-sm text-gray-300 rounded-xl hover:bg-white/20 transition-all"
            >
              Skip for now
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};