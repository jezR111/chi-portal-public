// src/features/yin/components/chapters/interactive/MeditationSection.tsx
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import React from 'react';

interface MeditationSectionProps {
  meditation: {
    title: string;
    duration: number;
    guidance: string[];
  };
  onComplete: () => void;
  onSkip: () => void;
}

export const MeditationSection: React.FC<MeditationSectionProps> = ({
  meditation,
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
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/20 to-purple-600/20 blur-3xl" />
        
        <div className="relative bg-gradient-to-br from-indigo-900/30 to-purple-900/30 backdrop-blur-xl rounded-3xl p-10 border border-purple-500/20">
          <div className="text-center mb-8">
            <motion.div
              className="w-16 h-16 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Heart className="w-8 h-8 text-white" />
            </motion.div>
            <h2 className="text-3xl font-bold text-white mb-2">{meditation.title}</h2>
            <p className="text-purple-300">Duration: {meditation.duration} minutes</p>
          </div>
          
          <div className="space-y-4 mb-8">
            {meditation.guidance.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-start gap-4 group"
              >
                <div className="w-10 h-10 bg-purple-600/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1 group-hover:bg-purple-600/30 transition-colors">
                  <span className="text-purple-300 text-sm font-semibold">{index + 1}</span>
                </div>
                <p className="text-purple-100/80 leading-relaxed">{step}</p>
              </motion.div>
            ))}
          </div>

          <div className="flex justify-center gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onComplete}
              className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl text-white font-semibold hover:shadow-lg hover:shadow-purple-500/25 transition-all"
            >
              Complete Meditation
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