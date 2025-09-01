// src/features/yin/components/meditation/BreathworkGuide.tsx

import { AnimatePresence, motion } from 'framer-motion';
import React, { useEffect, useState } from 'react';

interface BreathworkGuideProps {
  isActive: boolean;
  pattern?: '4-7-8' | '4-4-4-4' | '5-5' | 'custom';
  customPattern?: {
    inhale: number;
    hold1?: number;
    exhale: number;
    hold2?: number;
  };
}

export const BreathworkGuide: React.FC<BreathworkGuideProps> = ({
  isActive,
  pattern = '4-7-8',
  customPattern
}) => {
  const [phase, setPhase] = useState<'inhale' | 'hold' | 'exhale' | 'pause'>('inhale');
  const [progress, setProgress] = useState(0);
  
  const getPattern = () => {
    switch (pattern) {
      case '4-7-8':
        return { inhale: 4, hold1: 7, exhale: 8, hold2: 0 };
      case '4-4-4-4':
        return { inhale: 4, hold1: 4, exhale: 4, hold2: 4 };
      case '5-5':
        return { inhale: 5, hold1: 0, exhale: 5, hold2: 0 };
      case 'custom':
        return customPattern || { inhale: 4, hold1: 4, exhale: 4, hold2: 4 };
      default:
        return { inhale: 4, hold1: 7, exhale: 8, hold2: 0 };
    }
  };
  
  const breathPattern = getPattern();
  
  useEffect(() => {
    if (!isActive) return;
    
    let timer: NodeJS.Timeout;
    let currentProgress = 0;
    
    const runPhase = (phaseName: typeof phase, duration: number) => {
      if (duration === 0) return;
      
      setPhase(phaseName);
      setProgress(0);
      
      const increment = 100 / (duration * 10); // Update every 100ms
      
      const interval = setInterval(() => {
        currentProgress += increment;
        setProgress(currentProgress);
        
        if (currentProgress >= 100) {
          clearInterval(interval);
          currentProgress = 0;
        }
      }, 100);
      
      return interval;
    };
    
    const breathCycle = async () => {
      // Inhale
      const inhaleTimer = runPhase('inhale', breathPattern.inhale);
      await new Promise(resolve => setTimeout(resolve, breathPattern.inhale * 1000));
      if (inhaleTimer) clearInterval(inhaleTimer);
      
      // Hold
      if (breathPattern.hold1 > 0) {
        const holdTimer = runPhase('hold', breathPattern.hold1);
        await new Promise(resolve => setTimeout(resolve, breathPattern.hold1 * 1000));
        if (holdTimer) clearInterval(holdTimer);
      }
      
      // Exhale
      const exhaleTimer = runPhase('exhale', breathPattern.exhale);
      await new Promise(resolve => setTimeout(resolve, breathPattern.exhale * 1000));
      if (exhaleTimer) clearInterval(exhaleTimer);
      
      // Pause
      if (breathPattern.hold2 > 0) {
        const pauseTimer = runPhase('pause', breathPattern.hold2);
        await new Promise(resolve => setTimeout(resolve, breathPattern.hold2 * 1000));
        if (pauseTimer) clearInterval(pauseTimer);
      }
    };
    
    const runCycle = async () => {
      while (isActive) {
        await breathCycle();
      }
    };
    
    runCycle();
    
    return () => {
      setProgress(0);
    };
  }, [isActive, breathPattern]);
  
  const getPhaseText = () => {
    switch (phase) {
      case 'inhale': return 'Breathe In';
      case 'hold': return 'Hold';
      case 'exhale': return 'Breathe Out';
      case 'pause': return 'Pause';
    }
  };
  
  const getPhaseColor = () => {
    switch (phase) {
      case 'inhale': return 'from-blue-500 to-cyan-500';
      case 'hold': return 'from-purple-500 to-indigo-500';
      case 'exhale': return 'from-pink-500 to-rose-500';
      case 'pause': return 'from-gray-500 to-gray-600';
    }
  };
  
  return (
    <div className="mb-8">
      {/* Visual Guide */}
      <div className="relative w-48 h-48 mx-auto mb-4">
        {/* Outer Ring */}
        <motion.div
          className={`absolute inset-0 rounded-full bg-gradient-to-br ${getPhaseColor()} opacity-20`}
          animate={{
            scale: phase === 'inhale' ? [1, 1.3] : phase === 'exhale' ? [1.3, 1] : 1.15,
          }}
          transition={{
            duration: phase === 'inhale' ? breathPattern.inhale 
                     : phase === 'exhale' ? breathPattern.exhale 
                     : 0,
            ease: "easeInOut"
          }}
        />
        
        {/* Inner Circle */}
        <motion.div
          className={`absolute inset-8 rounded-full bg-gradient-to-br ${getPhaseColor()}`}
          animate={{
            scale: phase === 'inhale' ? [1, 1.2] : phase === 'exhale' ? [1.2, 1] : 1.1,
            opacity: [0.6, 1, 0.6]
          }}
          transition={{
            scale: {
              duration: phase === 'inhale' ? breathPattern.inhale 
                       : phase === 'exhale' ? breathPattern.exhale 
                       : 0,
              ease: "easeInOut"
            },
            opacity: {
              duration: 2,
              repeat: Infinity
            }
          }}
        />
        
        {/* Center Text */}
        <div className="absolute inset-0 flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={phase}
              className="text-center"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <p className="text-white text-xl font-bold">{getPhaseText()}</p>
              <p className="text-white/60 text-sm mt-1">
                {phase === 'inhale' && `${breathPattern.inhale}s`}
                {phase === 'hold' && `${breathPattern.hold1}s`}
                {phase === 'exhale' && `${breathPattern.exhale}s`}
                {phase === 'pause' && `${breathPattern.hold2}s`}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
      
      {/* Progress Bar */}
      <div className="w-full max-w-xs mx-auto">
        <div className="h-2 bg-black/30 rounded-full overflow-hidden">
          <motion.div
            className={`h-full bg-gradient-to-r ${getPhaseColor()}`}
            style={{ width: `${progress}%` }}
            transition={{ duration: 0.1 }}
          />
        </div>
      </div>
      
      {/* Pattern Indicator */}
      <p className="text-center text-purple-300/60 text-xs mt-4">
        Pattern: {pattern === 'custom' ? 'Custom' : pattern}
      </p>
    </div>
  );
};

export default BreathworkGuide;