import { motion } from 'framer-motion';
import { Pause, Play, RotateCcw, Volume2, VolumeX, X } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';

interface MeditationQuestProps {
  quest: {
    id: string;
    title: string;
    description: string;
    duration: number;
    xp: number;
  };
  onComplete: (questId: string, xp: number, data: any) => void;
  onClose: () => void;
}

export const MeditationQuest: React.FC<MeditationQuestProps> = ({ quest, onComplete, onClose }) => {
  const [timeLeft, setTimeLeft] = useState(quest.duration * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [startTime, setStartTime] = useState<number | null>(null);

  const handleComplete = useCallback(() => {
    if (isComplete) return; // Prevent multiple calls
    
    const actualDuration = startTime ? Date.now() - startTime : quest.duration * 60000;
    
    const meditationData = {
      actualDuration,
      completedFully: true,
      soundEnabled
    };

    onComplete(quest.id, quest.xp, meditationData);

    if (soundEnabled) {
      playCompletionSound();
    }
  }, [isComplete, startTime, quest, onComplete, soundEnabled]);

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
    
    // Handle completion after state update
    if (isComplete && timeLeft === 0) {
      handleComplete();
    }
    
    return () => clearInterval(interval);
  }, [isRunning, timeLeft, startTime, isComplete, handleComplete]);

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
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 1);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 1);
    } catch (error) {
      console.error('Audio playback failed:', error);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = 1 - (timeLeft / (quest.duration * 60));

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-xl flex items-center justify-center z-50">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-gradient-to-br from-purple-900 to-pink-900 rounded-3xl p-12 max-w-md w-full relative"
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-lg transition-colors"
        >
          <X className="w-5 h-5 text-white/70" />
        </button>

        {/* Sound toggle */}
        <button
          onClick={() => setSoundEnabled(!soundEnabled)}
          className="absolute top-4 left-4 p-2 hover:bg-white/10 rounded-lg transition-colors"
        >
          {soundEnabled ? (
            <Volume2 className="w-5 h-5 text-white/70" />
          ) : (
            <VolumeX className="w-5 h-5 text-white/70" />
          )}
        </button>
        
        <h2 className="text-3xl font-bold text-white text-center mb-2">{quest.title}</h2>
        <p className="text-purple-200 text-center mb-8">{quest.description}</p>

        {/* Progress Circle */}
        <div className="relative w-48 h-48 mx-auto mb-8">
          <svg className="transform -rotate-90 w-48 h-48">
            <circle
              cx="96"
              cy="96"
              r="88"
              stroke="currentColor"
              strokeWidth="8"
              fill="none"
              className="text-purple-800"
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
              <span className="text-purple-300 text-sm mt-1">Breathe...</span>
            )}
          </div>
        </div>

        {/* Breathing guide */}
        {isRunning && (
          <motion.div
            className="h-2 bg-purple-600/30 rounded-full mb-6 overflow-hidden"
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
        <div className="flex justify-center gap-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsRunning(!isRunning)}
            className="p-4 bg-purple-600 hover:bg-purple-700 rounded-full text-white transition-all shadow-lg"
            disabled={isComplete}
          >
            {isRunning ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              setTimeLeft(quest.duration * 60);
              setIsRunning(false);
              setIsComplete(false);
              setStartTime(null);
            }}
            className="p-4 bg-purple-600/50 hover:bg-purple-700/50 rounded-full text-white transition-all"
          >
            <RotateCcw className="w-6 h-6" />
          </motion.button>
        </div>

        {/* Completion Message */}
        {isComplete && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="mt-6 p-4 bg-green-500/20 rounded-xl text-center border border-green-500/30"
          >
            <p className="text-green-400 font-bold text-lg">Quest Complete!</p>
            <p className="text-green-300 mt-1">+{quest.xp} XP earned</p>
            <button
              onClick={onClose}
              className="mt-3 px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg text-white transition-all"
            >
              Continue Journey
            </button>
          </motion.div>
        )}

        {/* Tips */}
        {!isRunning && !isComplete && (
          <div className="mt-6 p-3 bg-purple-800/30 rounded-lg">
            <p className="text-purple-300 text-sm text-center">
              Focus on your breath, letting thoughts pass like clouds
            </p>
          </div>
        )}
      </motion.div>
    </div>
  );
};