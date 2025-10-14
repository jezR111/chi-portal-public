// src/features/yin/components/chapters/lesson/LessonCompletionModal.tsx
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle, Sparkles } from 'lucide-react';
import React from 'react';

interface LessonCompletionModalProps {
  isOpen: boolean;
  lessonTitle: string;
  xpReward: number;
  insightsCaptured: number;
  onContinue: () => void;
}

export const LessonCompletionModal: React.FC<LessonCompletionModalProps> = ({
  isOpen,
  lessonTitle,
  xpReward,
  insightsCaptured,
  onContinue
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 flex items-center justify-center z-50 bg-black/50 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            className="bg-gradient-to-br from-purple-900 to-pink-900 rounded-3xl p-8 max-w-md text-center border border-purple-500/30"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            >
              <CheckCircle className="w-20 h-20 text-green-400 mx-auto mb-4" />
            </motion.div>
            
            <h2 className="text-3xl font-bold text-white mb-2">Lesson Complete!</h2>
            <p className="text-purple-200 mb-6">"{lessonTitle}"</p>
            
            <div className="bg-black/30 rounded-xl p-4 mb-6">
              <p className="text-purple-200 mb-4">You've earned</p>
              <div className="text-3xl font-bold text-amber-400 mb-4">
                +{xpReward} XP
              </div>
              
              {insightsCaptured > 0 && (
                <div className="pt-4 border-t border-purple-500/30">
                  <p className="text-purple-300 text-sm mb-2">
                    You captured {insightsCaptured} insight{insightsCaptured > 1 ? 's' : ''}
                  </p>
                  <div className="flex justify-center gap-2">
                    {Array.from({ length: Math.min(insightsCaptured, 5) }).map((_, i) => (
                      <motion.div
                        key={i}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.3 + i * 0.1 }}
                      >
                        <Sparkles className="w-4 h-4 text-amber-400" />
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onContinue}
              className="px-8 py-3 bg-white text-purple-900 rounded-xl font-semibold hover:bg-purple-100 transition-colors"
            >
              Continue Journey
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};