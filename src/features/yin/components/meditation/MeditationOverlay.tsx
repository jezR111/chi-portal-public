// src/features/yin/components/meditation/MeditationOverlay.tsx

import { AnimatePresence, motion } from 'framer-motion';
import { Info, Sparkles, X } from 'lucide-react';
import React, { useState } from 'react';
import { useXP } from '../../hooks/useXP';
import { MeditationStats, MeditationTimer } from './MeditationTimer';

interface MeditationOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
  duration?: number;
  type?: 'meditation' | 'breathwork' | 'mindfulness';
  mandatory?: boolean;
  lessonId?: string;
  lessonTitle?: string;
}

export const MeditationOverlay: React.FC<MeditationOverlayProps> = ({
  isOpen,
  onClose,
  onComplete,
  duration = 3,
  type = 'meditation',
  mandatory = true,
  lessonId,
  lessonTitle
}) => {
  const [showCompletion, setShowCompletion] = useState(false);
  const [earnedXP, setEarnedXP] = useState(0);
  const { calculateMeditationXP } = useXP();
  
  const handleMeditationComplete = async (stats: MeditationStats) => {
    // Calculate XP earned
    const xp = await calculateMeditationXP(stats);
    setEarnedXP(xp);
    setShowCompletion(true);
    
    // Auto-close after showing completion
    setTimeout(() => {
      onComplete();
    }, 3000);
  };
  
  const handleSkip = () => {
    if (!mandatory) {
      onClose();
    }
  };
  
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Background Effects */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-indigo-900/20 to-purple-900/20" />
            {/* Floating orbs */}
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-64 h-64 bg-purple-600/10 rounded-full blur-3xl"
                animate={{
                  x: [0, 100, 0],
                  y: [0, -100, 0],
                }}
                transition={{
                  duration: 10 + i * 2,
                  repeat: Infinity,
                  delay: i * 2,
                }}
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
              />
            ))}
          </div>
          
          {/* Main Content */}
          <motion.div
            className="relative z-10 w-full max-w-lg"
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
          >
            {/* Header */}
            {!mandatory && (
              <div className="text-right mb-4">
                <button
                  onClick={handleSkip}
                  className="p-2 bg-white/10 backdrop-blur-sm rounded-lg hover:bg-white/20 transition-colors"
                >
                  <X className="w-5 h-5 text-white" />
                </button>
              </div>
            )}
            
            {/* Info Banner */}
            <motion.div
              className="mb-6 p-4 bg-purple-600/20 backdrop-blur-sm rounded-2xl border border-purple-500/30"
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-purple-400 mt-0.5" />
                <div>
                  <h3 className="text-white font-semibold mb-1">Mindfulness Break</h3>
                  <p className="text-purple-300/80 text-sm">
                    {mandatory 
                      ? "This meditation break helps integrate what you've learned. It's a required part of your journey."
                      : "Take a moment to center yourself and integrate your insights."}
                  </p>
                  {lessonTitle && (
                    <p className="text-purple-400 text-xs mt-2">
                      From: {lessonTitle}
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
            
            {/* Timer Component */}
            {!showCompletion ? (
              <MeditationTimer
                duration={duration}
                type={type}
                onComplete={handleMeditationComplete}
                onSkip={handleSkip}
                mandatory={mandatory}
                lessonId={lessonId}
                autoStart={false}
              />
            ) : (
              /* Completion Screen */
              <motion.div
                className="bg-black/40 backdrop-blur-xl rounded-3xl p-8 border border-purple-500/20 text-center"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
              >
                <Sparkles className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-white mb-2">Beautiful!</h3>
                <p className="text-purple-300 mb-4">
                  You've earned <span className="text-yellow-400 font-bold">{earnedXP} XP</span> for your practice
                </p>
                <div className="w-32 h-1 bg-purple-600/30 rounded-full mx-auto overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-purple-600 to-pink-600"
                    initial={{ width: 0 }}
                    animate={{ width: '100%' }}
                    transition={{ duration: 2 }}
                  />
                </div>
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MeditationOverlay;