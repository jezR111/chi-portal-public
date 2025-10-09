// src/features/yin/components/quests-and-challenges/quests/individual-quests/MeditationQuest.tsx

import { AnimatePresence, motion } from 'framer-motion';
import { Clock, Pause, Play, RotateCcw, Trophy, Volume2, VolumeX, X, Zap } from 'lucide-react';
import { useEffect, useState } from 'react';

interface MeditationQuestProps {
  quest: {
    id: string;
    title: string;
    description: string;
    duration?: number;
    xp: number;
  };
  onComplete: (data: any) => void;
  onClose: () => void;
}

export const MeditationQuest: React.FC<MeditationQuestProps> = ({ quest, onComplete, onClose }) => {
  const [selectedDuration, setSelectedDuration] = useState(5);
  const [timeLeft, setTimeLeft] = useState(selectedDuration * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [showSettings, setShowSettings] = useState(true);
  const [showCelebration, setShowCelebration] = useState(false);

  // Preset durations with better spacing
  const presetDurations = [
    { value: 1, label: '1m' },
    { value: 3, label: '3m' },
    { value: 5, label: '5m' },
    { value: 10, label: '10m' },
    { value: 15, label: '15m' },
    { value: 20, label: '20m' },
    { value: 30, label: '30m' }
  ];
  
  // Calculate XP based on duration
  const calculateXP = (minutes: number): number => {
    const baseXP = quest.xp || 30;
    const bonusMultiplier = 1 + (minutes - 1) * 0.15;
    return Math.round(baseXP * bonusMultiplier);
  };

  // Update time when duration changes
  useEffect(() => {
    if (!isRunning && !isComplete) {
      setTimeLeft(selectedDuration * 60);
    }
  }, [selectedDuration, isRunning, isComplete]);

  // Timer logic
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isRunning && timeLeft > 0) {
      if (!startTime) {
        setStartTime(Date.now());
      }
      
      interval = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setIsComplete(true);
            setIsRunning(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    
    return () => clearInterval(interval);
  }, [isRunning, timeLeft, startTime]);

  // Handle completion - Show celebration screen
  useEffect(() => {
    if (isComplete && timeLeft === 0 && !showCelebration) {
      if (soundEnabled) {
        playCompletionSound();
      }
      
      // Show celebration screen after a brief pause
      setTimeout(() => {
        setShowCelebration(true);
      }, 1000);
    }
  }, [isComplete, timeLeft, soundEnabled]);

  const playCompletionSound = () => {
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.value = 528;
      oscillator.type = 'sine';
      
      gainNode.gain.setValueAtTime(0, audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.3, audioContext.currentTime + 0.01);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 1.5);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 1.5);
    } catch (error) {
      console.error('Audio playback failed:', error);
    }
  };

  const handleContinue = () => {
    const actualDuration = startTime ? Date.now() - startTime : selectedDuration * 60000;
    const earnedXP = calculateXP(selectedDuration);
    
    const meditationData = {
      actualDuration,
      selectedDuration: selectedDuration * 60,
      completedFully: true,
      soundEnabled,
      earnedXP,
      questId: quest.id,
      xp: earnedXP
    };

    onComplete(meditationData);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStart = () => {
    setShowSettings(false);
    setIsRunning(true);
  };

  const handleReset = () => {
    setTimeLeft(selectedDuration * 60);
    setIsRunning(false);
    setIsComplete(false);
    setStartTime(null);
    setShowSettings(true);
    setShowCelebration(false);
  };

  const progress = 1 - (timeLeft / (selectedDuration * 60));

  // Celebration Modal
  if (showCelebration) {
    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-60 flex items-center justify-center bg-black/90 backdrop-blur-xl p-4"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="bg-gradient-to-br from-purple-900/95 to-indigo-900/95 rounded-3xl p-8 max-w-md w-full border border-purple-500/30 shadow-2xl relative overflow-hidden"
          >
            {/* Background decorations */}
            <div className="absolute inset-0 overflow-hidden">
              <motion.div
                className="absolute -top-24 -right-24 w-48 h-48 bg-yellow-500/20 rounded-full blur-3xl"
                animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 3, repeat: Infinity }}
              />
              <motion.div
                className="absolute -bottom-24 -left-24 w-48 h-48 bg-pink-500/20 rounded-full blur-3xl"
                animate={{ scale: [1.2, 1, 1.2], opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 3, repeat: Infinity, delay: 1.5 }}
              />
            </div>

            <div className="relative text-center">
              {/* Trophy Icon with animation */}
              <motion.div
                initial={{ rotate: -180, scale: 0 }}
                animate={{ rotate: 0, scale: 1 }}
                transition={{ 
                  delay: 0.2, 
                  type: "spring",
                  stiffness: 200,
                  damping: 15
                }}
                className="relative w-24 h-24 mx-auto mb-6"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full blur-xl opacity-60 animate-pulse" />
                <div className="relative w-full h-full bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-2xl">
                  <Trophy className="w-12 h-12 text-white" />
                </div>
                {/* Sparkles around trophy */}
                <motion.div
                  className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-300 rounded-full"
                  animate={{ scale: [0, 1, 0], opacity: [0, 1, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <motion.div
                  className="absolute -bottom-1 -left-1 w-3 h-3 bg-yellow-300 rounded-full"
                  animate={{ scale: [0, 1, 0], opacity: [0, 1, 0] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                />
                <motion.div
                  className="absolute top-1/2 -right-2 w-2 h-2 bg-yellow-300 rounded-full"
                  animate={{ scale: [0, 1, 0], opacity: [0, 1, 0] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                />
              </motion.div>

              {/* Title */}
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-3xl font-bold text-white mb-2"
              >
                Quest Complete!
              </motion.h2>

              {/* Quest Name */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-xl text-purple-200 mb-6"
              >
                {quest.title}
              </motion.p>

              {/* XP Reward with animation */}
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ 
                  delay: 0.5, 
                  type: "spring",
                  stiffness: 200,
                  damping: 15
                }}
                className="inline-flex items-center gap-3 bg-gradient-to-r from-yellow-500/30 to-orange-500/30 px-8 py-4 rounded-full mb-8 border border-yellow-500/30"
              >
                <Zap className="w-7 h-7 text-yellow-400" />
                <motion.span 
                  className="text-3xl font-bold text-yellow-400"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.7 }}
                >
                  +{calculateXP(selectedDuration)} XP
                </motion.span>
              </motion.div>

              {/* Duration info */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="text-purple-300 text-sm mb-6"
              >
                Meditation completed • {selectedDuration} minutes
              </motion.p>

              {/* Continue Button */}
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleContinue}
                className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl text-white font-bold text-lg hover:from-purple-700 hover:to-pink-700 transition-all shadow-xl"
              >
                Continue
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    );
  }

  // Main meditation interface
  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-xl flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-gradient-to-br from-purple-900/90 to-pink-900/90 rounded-3xl p-8 max-w-lg w-full relative backdrop-blur-xl border border-purple-500/30"
      >
        {/* Header controls */}
        <div className="absolute top-4 left-4 right-4 flex justify-between">
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            {soundEnabled ? (
              <Volume2 className="w-5 h-5 text-white/70" />
            ) : (
              <VolumeX className="w-5 h-5 text-white/70" />
            )}
          </button>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-white/70" />
          </button>
        </div>
        
        <h2 className="text-3xl font-bold text-white text-center mb-2 mt-8">{quest.title}</h2>
        <p className="text-purple-200 text-center mb-6">{quest.description}</p>

        <AnimatePresence mode="wait">
          {showSettings && !isRunning && !isComplete ? (
            // Duration Selection Screen
            <motion.div
              key="settings"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Duration Selector */}
              <div className="bg-black/30 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <span className="text-white/80 font-medium">Duration</span>
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-purple-400" />
                    <span className="text-2xl font-bold text-white">
                      {selectedDuration} min
                    </span>
                  </div>
                </div>
                
                {/* Improved Slider Container */}
                <div className="relative">
                  {/* Track background */}
                  <div className="absolute w-full h-3 bg-purple-900/50 rounded-full top-1/2 -translate-y-1/2" />
                  
                  {/* Filled track */}
                  <div 
                    className="absolute h-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full top-1/2 -translate-y-1/2 transition-all"
                    style={{ width: `${(selectedDuration - 1) / 29 * 100}%` }}
                  />
                  
                  {/* Slider input (invisible but functional) */}
                  <input
                    type="range"
                    min="1"
                    max="30"
                    value={selectedDuration}
                    onChange={(e) => setSelectedDuration(parseInt(e.target.value))}
                    className="relative w-full h-3 opacity-0 cursor-pointer z-10"
                  />
                  
                  {/* Custom thumb */}
                  <div 
                    className="absolute top-1/2 -translate-y-1/2 w-6 h-6 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full shadow-lg pointer-events-none border-2 border-white/30"
                    style={{ left: `calc(${(selectedDuration - 1) / 29 * 100}% - 12px)` }}
                  >
                    <div className="absolute inset-0 rounded-full animate-ping bg-purple-400 opacity-30" />
                  </div>
                </div>
                
                {/* Preset buttons - better grid */}
                <div className="flex justify-between items-center mt-6 px-1">
                  {presetDurations.map(({ value, label }) => (
                    <button
                      key={value}
                      onClick={() => setSelectedDuration(value)}
                      className={`relative px-3 py-2 rounded-lg text-xs font-bold transition-all transform ${
                        selectedDuration === value 
                          ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white scale-110 shadow-lg' 
                          : 'bg-purple-900/30 text-purple-300 hover:bg-purple-800/40 hover:scale-105'
                      }`}
                    >
                      {label}
                      {selectedDuration === value && (
                        <div className="absolute -top-1 -right-1 w-2 h-2 bg-pink-400 rounded-full animate-pulse" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* XP Preview */}
              <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-2xl p-4 border border-yellow-500/30">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Zap className="w-5 h-5 text-yellow-400" />
                    <span className="text-white/80">XP Reward</span>
                  </div>
                  <motion.span 
                    key={calculateXP(selectedDuration)}
                    initial={{ scale: 1.3, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="text-2xl font-bold text-yellow-400"
                  >
                    +{calculateXP(selectedDuration)}
                  </motion.span>
                </div>
                <p className="text-xs text-yellow-200/60 mt-2">
                  Longer sessions earn more XP!
                </p>
              </div>

              {/* Start Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleStart}
                className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-2xl text-white font-bold text-lg transition-all shadow-lg"
              >
                Begin Meditation
              </motion.button>
            </motion.div>
          ) : (
            // Timer screen
            <motion.div
              key="timer"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-6"
            >
              {/* Progress Circle */}
              <div className="relative w-48 h-48 mx-auto">
                <svg className="transform -rotate-90 w-48 h-48">
                  <circle
                    cx="96"
                    cy="96"
                    r="88"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="none"
                    className="text-purple-800/50"
                  />
                  <motion.circle
                    cx="96"
                    cy="96"
                    r="88"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="none"
                    strokeDasharray={552}
                    strokeDashoffset={552 * (1 - progress)}
                    className="text-purple-400 transition-all duration-1000"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-4xl font-bold text-white">{formatTime(timeLeft)}</span>
                  {isRunning && (
                    <motion.span 
                      className="text-purple-300 text-sm mt-1"
                      animate={{ opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 4, repeat: Infinity }}
                    >
                      Breathe deeply
                    </motion.span>
                  )}
                </div>
              </div>

              {/* Breathing guide */}
              {isRunning && !isComplete && (
                <motion.div
                  className="h-2 bg-purple-600/30 rounded-full overflow-hidden"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <motion.div
                    className="h-full bg-gradient-to-r from-purple-400 to-pink-400"
                    animate={{
                      scaleX: [0, 1, 0],
                    }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                    style={{ transformOrigin: 'left' }}
                  />
                </motion.div>
              )}

              {/* Controls */}
              {!isComplete && (
                <div className="flex justify-center gap-4">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsRunning(!isRunning)}
                    className="p-4 bg-purple-600 hover:bg-purple-700 rounded-full text-white transition-all shadow-lg"
                  >
                    {isRunning ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleReset}
                    className="p-4 bg-purple-600/50 hover:bg-purple-700/50 rounded-full text-white transition-all"
                  >
                    <RotateCcw className="w-6 h-6" />
                  </motion.button>
                </div>
              )}

              {/* Show loading when complete but before celebration */}
              {isComplete && !showCelebration && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center"
                >
                  <div className="w-12 h-12 mx-auto border-4 border-purple-400 border-t-transparent rounded-full animate-spin" />
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};