// src/features/yin/components/quests-and-challenges/quests/individual-quests/MeditationQuest.tsx

import { AnimatePresence, motion } from 'framer-motion';
import { Brain, Clock, Pause, Play, RotateCcw, Volume2, VolumeX, X } from 'lucide-react';
import { useEffect, useState } from 'react';

interface MeditationQuestProps {
  quest: {
    id: string;
    title: string;
    description: string;
    duration?: number;
    xp: number;
  };
  onComplete: (questId: string, xp: number, data: any) => void;
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
  const [showSuccess, setShowSuccess] = useState(false);

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

  // Handle completion - simplified like GratitudeQuest
  useEffect(() => {
    if (isComplete && timeLeft === 0 && !showSuccess) {
      if (soundEnabled) {
        playCompletionSound();
      }
      
      const actualDuration = startTime ? Date.now() - startTime : selectedDuration * 60000;
      const earnedXP = calculateXP(selectedDuration);
      
      const meditationData = {
        actualDuration,
        selectedDuration: selectedDuration * 60,
        completedFully: true,
        soundEnabled,
        earnedXP,
        timestamp: Date.now()
      };

      // Call onComplete with correct signature
      onComplete(quest.id, earnedXP, meditationData);
      
      // Show success animation then auto-close like GratitudeQuest
      setShowSuccess(true);
      setTimeout(() => {
        onClose();
      }, 2000);
    }
  }, [isComplete, timeLeft, showSuccess, soundEnabled, quest.id, selectedDuration, startTime, onComplete, onClose]);

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
    setShowSuccess(false);
  };

  const progress = 1 - (timeLeft / (selectedDuration * 60));

  // Main meditation interface
  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-xl flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-gradient-to-br from-purple-900/90 to-indigo-900/90 rounded-3xl p-8 max-w-lg w-full relative backdrop-blur-xl border border-purple-500/30"
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
            </motion.div>
          )}
        </AnimatePresence>

        {/* Success Overlay - Simplified like GratitudeQuest */}
        <AnimatePresence>
          {showSuccess && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/80 rounded-3xl flex items-center justify-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", damping: 15 }}
                className="text-center"
              >
                <motion.div
                  animate={{
                    scale: [1, 1.2, 1],
                  }}
                  transition={{
                    duration: 0.5,
                    repeat: 3
                  }}
                >
                  <Brain className="w-20 h-20 text-purple-400 mx-auto mb-4" />
                </motion.div>
                <h3 className="text-2xl font-bold text-white mb-2">Quest Complete!</h3>
                <p className="text-purple-300">{quest.title}</p>
                <p className="text-green-400 font-bold text-xl mt-2">+{calculateXP(selectedDuration)} XP</p>
                <p className="text-purple-300 text-sm mt-2">
                  Meditation completed • {selectedDuration} minutes
                </p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};