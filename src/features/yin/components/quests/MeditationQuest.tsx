// src/features/yin/components/quests/MeditationQuest.tsx
import { motion } from 'framer-motion';
import { Pause, Play, RotateCcw, X } from 'lucide-react'; // Add X here
import { useEffect, useState } from 'react';

export const MeditationQuest = ({ quest, onComplete, onClose }) => {
  const [timeLeft, setTimeLeft] = useState(quest.duration * 60); // Convert to seconds
  const [isRunning, setIsRunning] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setIsComplete(true);
            setIsRunning(false);
            onComplete(quest.id, quest.xp);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, timeLeft, quest, onComplete]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-xl flex items-center justify-center z-50">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-gradient-to-br from-purple-900 to-pink-900 rounded-3xl p-12 max-w-md w-full"
      >
              {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-lg transition-colors"
        >
          <X className="w-5 h-5 text-white/70" />
        </button>
        <h2 className="text-3xl font-bold text-white text-center mb-2">{quest.title}</h2>
        <p className="text-purple-200 text-center mb-8">{quest.description}</p>

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
            <circle
              cx="96"
              cy="96"
              r="88"
              stroke="currentColor"
              strokeWidth="8"
              fill="none"
              strokeDasharray={552}
              strokeDashoffset={552 - (552 * (1 - timeLeft / (quest.duration * 60)))}
              className="text-purple-400 transition-all duration-1000"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-4xl font-bold text-white">{formatTime(timeLeft)}</span>
          </div>
        </div>

        <div className="flex justify-center gap-4">
          <button
            onClick={() => setIsRunning(!isRunning)}
            className="p-4 bg-purple-600 hover:bg-purple-700 rounded-full text-white transition-all"
          >
            {isRunning ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
          </button>
          <button
            onClick={() => {
              setTimeLeft(quest.duration * 60);
              setIsRunning(false);
            }}
            className="p-4 bg-purple-600/50 hover:bg-purple-700/50 rounded-full text-white transition-all"
          >
            <RotateCcw className="w-6 h-6" />
          </button>
        </div>

        {isComplete && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="mt-6 p-4 bg-green-500/20 rounded-xl text-center"
          >
            <p className="text-green-400 font-bold">Quest Complete! +{quest.xp} XP</p>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};