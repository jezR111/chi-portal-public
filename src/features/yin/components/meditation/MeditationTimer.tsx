// src/features/yin/components/meditation/MeditationTimer.tsx

import { AnimatePresence, motion } from 'framer-motion';
import {
  Brain,
  ChevronRight,
  Heart,
  Pause,
  Play,
  SkipForward,
  Sparkles,
  Volume2, VolumeX,
  Wind
} from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import { useMeditation } from '../../hooks/useMeditation';
import { BreathworkGuide } from './BreathworkGuide';

interface MeditationTimerProps {
  duration: number; // in minutes
  type: 'meditation' | 'breathwork' | 'mindfulness';
  onComplete: (stats: MeditationStats) => void;
  onSkip?: () => void;
  mandatory?: boolean;
  lessonId?: string;
  autoStart?: boolean;
}

export interface MeditationStats {
  duration: number;
  completed: boolean;
  type: string;
  heartRate?: number[];
  calmScore?: number;
  timestamp: Date;
}

export const MeditationTimer: React.FC<MeditationTimerProps> = ({
  duration,
  type,
  onComplete,
  onSkip,
  mandatory = false,
  lessonId,
  autoStart = false
}) => {
  const [timeRemaining, setTimeRemaining] = useState(duration * 60);
  const [isPlaying, setIsPlaying] = useState(autoStart);
  const [sessionStats, setSessionStats] = useState<MeditationStats>({
    duration: 0,
    completed: false,
    type,
    timestamp: new Date()
  });
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [currentPhase, setCurrentPhase] = useState<'prepare' | 'active' | 'complete'>('prepare');
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { recordSession } = useMeditation();
  
  useEffect(() => {
    if (isPlaying && timeRemaining > 0) {
      intervalRef.current = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            handleComplete();
            return 0;
          }
          return prev - 1;
        });
        
        // Update session duration
        setSessionStats(prev => ({
          ...prev,
          duration: duration * 60 - prev.duration + 1
        }));
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPlaying, timeRemaining]);
  
  useEffect(() => {
    // Play ambient sound
    if (soundEnabled && audioRef.current) {
      if (isPlaying) {
        audioRef.current.play();
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, soundEnabled]);
  
  const handleComplete = async () => {
    setIsPlaying(false);
    setCurrentPhase('complete');
    
    const stats: MeditationStats = {
      ...sessionStats,
      completed: true,
      calmScore: calculateCalmScore()
    };
    
    // Record session for XP
    if (lessonId) {
      await recordSession(stats, lessonId);
    }
    
    onComplete(stats);
  };
  
  const handleSkip = () => {
    if (!mandatory && onSkip) {
      onSkip();
    }
  };
  
  const calculateCalmScore = (): number => {
    // Simplified calm score calculation
    const completionPercent = (sessionStats.duration / (duration * 60)) * 100;
    return Math.min(100, Math.round(completionPercent * 0.8 + 20));
  };
  
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  
  const getIcon = () => {
    switch (type) {
      case 'breathwork': return Wind;
      case 'mindfulness': return Brain;
      default: return Heart;
    }
  };
  
  const Icon = getIcon();
  
  return (
    <div className="relative w-full max-w-md mx-auto">
      {/* Background Glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 via-indigo-600/20 to-purple-600/20 blur-3xl" />
      
      {/* Main Timer Circle */}
      <div className="relative bg-black/40 backdrop-blur-xl rounded-3xl p-8 border border-purple-500/20">
        {/* Phase Indicator */}
        <div className="text-center mb-6">
          <motion.h3 
            className="text-2xl font-bold text-white mb-2"
            animate={{ opacity: [0.8, 1, 0.8] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            {currentPhase === 'prepare' && 'Prepare Your Mind'}
            {currentPhase === 'active' && 'Focus on Your Breath'}
            {currentPhase === 'complete' && 'Well Done!'}
          </motion.h3>
          <p className="text-purple-300/80 text-sm">
            {type === 'breathwork' && 'Follow the breathing guide'}
            {type === 'meditation' && 'Find your inner stillness'}
            {type === 'mindfulness' && 'Be present in this moment'}
          </p>
        </div>
        
        {/* Timer Display */}
        <div className="relative w-64 h-64 mx-auto mb-8">
          <svg className="absolute inset-0 transform -rotate-90">
            <circle
              cx="128"
              cy="128"
              r="120"
              stroke="rgba(139, 92, 246, 0.1)"
              strokeWidth="8"
              fill="none"
            />
            <motion.circle
              cx="128"
              cy="128"
              r="120"
              stroke="url(#gradient)"
              strokeWidth="8"
              fill="none"
              strokeLinecap="round"
              strokeDasharray={754}
              strokeDashoffset={754 - (754 * ((duration * 60 - timeRemaining) / (duration * 60)))}
              transition={{ duration: 1, ease: "linear" }}
            />
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#8b5cf6" />
                <stop offset="100%" stopColor="#ec4899" />
              </linearGradient>
            </defs>
          </svg>
          
          {/* Center Content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 4, repeat: Infinity }}
            >
              <Icon className="w-12 h-12 text-purple-400 mb-4" />
            </motion.div>
            
            <div className="text-5xl font-bold text-white mb-2">
              {formatTime(timeRemaining)}
            </div>
            
            <div className="text-purple-300/60 text-sm">
              {Math.round((timeRemaining / (duration * 60)) * 100)}% remaining
            </div>
          </div>
        </div>
        
        {/* Breathwork Guide */}
        {type === 'breathwork' && isPlaying && (
          <BreathworkGuide 
            isActive={isPlaying}
            pattern="4-7-8" // Can be configurable
          />
        )}
        
        {/* Controls */}
        <div className="flex items-center justify-center gap-4">
          {/* Play/Pause */}
          <motion.button
            onClick={() => {
              setIsPlaying(!isPlaying);
              if (!isPlaying && currentPhase === 'prepare') {
                setCurrentPhase('active');
              }
            }}
            className="w-16 h-16 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center shadow-lg hover:shadow-purple-500/25"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            {isPlaying ? (
              <Pause className="w-8 h-8 text-white" />
            ) : (
              <Play className="w-8 h-8 text-white ml-1" />
            )}
          </motion.button>
          
          {/* Sound Toggle */}
          <motion.button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center hover:bg-purple-500/30"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            {soundEnabled ? (
              <Volume2 className="w-6 h-6 text-purple-300" />
            ) : (
              <VolumeX className="w-6 h-6 text-purple-300" />
            )}
          </motion.button>
          
          {/* Skip (if allowed) */}
          {!mandatory && (
            <motion.button
              onClick={handleSkip}
              className="w-12 h-12 bg-gray-700/50 rounded-full flex items-center justify-center hover:bg-gray-700/70"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <SkipForward className="w-6 h-6 text-gray-300" />
            </motion.button>
          )}
        </div>
        
        {/* Motivational Text */}
        <AnimatePresence mode="wait">
          {isPlaying && (
            <motion.div
              className="mt-6 text-center"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <p className="text-purple-300/60 text-sm italic">
                {timeRemaining > duration * 60 * 0.75 && "Let your thoughts settle like leaves on water..."}
                {timeRemaining <= duration * 60 * 0.75 && timeRemaining > duration * 60 * 0.5 && "You're doing wonderfully. Keep breathing..."}
                {timeRemaining <= duration * 60 * 0.5 && timeRemaining > duration * 60 * 0.25 && "Halfway there. Notice how calm you feel..."}
                {timeRemaining <= duration * 60 * 0.25 && timeRemaining > 0 && "Almost complete. Savor these final moments..."}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Hidden Audio Element */}
        <audio
          ref={audioRef}
          src="/audio/meditation-ambient.mp3"
          loop
          className="hidden"
        />
      </div>
      
      {/* Session Stats (shown after completion) */}
      <AnimatePresence>
        {currentPhase === 'complete' && (
          <motion.div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm rounded-3xl flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="text-center">
              <Sparkles className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-white mb-2">Session Complete!</h3>
              <p className="text-purple-300 mb-4">Calm Score: {sessionStats.calmScore}%</p>
              <button
                onClick={() => onComplete(sessionStats)}
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl text-white font-semibold flex items-center gap-2 mx-auto hover:shadow-lg hover:shadow-purple-500/25"
              >
                Continue Journey
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MeditationTimer;