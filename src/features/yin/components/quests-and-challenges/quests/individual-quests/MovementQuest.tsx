// src/features/yin/components/quests-and-challenges/quests/individual-quests/MovementQuest.tsx

import { AnimatePresence, motion } from 'framer-motion';
import { Activity, Check, ChevronRight, Pause, Play, X, Zap } from 'lucide-react';
import { useEffect, useState } from 'react';

interface MovementQuestProps {
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

const MOVEMENT_SEQUENCE = [
  {
    name: 'Neck Rolls',
    duration: 30,
    description: 'Gently roll your neck in circles, 15 seconds each direction',
    icon: '🔄'
  },
  {
    name: 'Shoulder Shrugs',
    duration: 30,
    description: 'Raise shoulders to ears, hold for 3 seconds, release. Repeat.',
    icon: '⬆️'
  },
  {
    name: 'Arm Circles',
    duration: 40,
    description: 'Wide arm circles forward and backward, 20 seconds each',
    icon: '🔁'
  },
  {
    name: 'Standing Forward Fold',
    duration: 45,
    description: 'Bend forward from hips, let arms hang, sway gently',
    icon: '🙇'
  },
  {
    name: 'Side Stretches',
    duration: 40,
    description: 'Reach one arm overhead and lean, 20 seconds each side',
    icon: '🙆'
  },
  {
    name: 'Hip Circles',
    duration: 30,
    description: 'Hands on hips, circle clockwise then counter-clockwise',
    icon: '⭕'
  },
  {
    name: 'Quad Stretch',
    duration: 40,
    description: 'Hold foot behind you, 20 seconds each leg',
    icon: '🦵'
  }
];

export const MovementQuest: React.FC<MovementQuestProps> = ({ quest, onComplete, onClose }) => {
  const [currentExercise, setCurrentExercise] = useState(0);
  const [timeLeft, setTimeLeft] = useState(MOVEMENT_SEQUENCE[0].duration);
  const [isRunning, setIsRunning] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [completedExercises, setCompletedExercises] = useState<number[]>([]);
  const [skippedExercises, setSkippedExercises] = useState<number[]>([]);
  const [showSuccess, setShowSuccess] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);

  const totalDuration = MOVEMENT_SEQUENCE.reduce((sum, ex) => sum + ex.duration, 0);
  const currentProgress = MOVEMENT_SEQUENCE
    .slice(0, currentExercise)
    .reduce((sum, ex) => sum + ex.duration, 0) + (MOVEMENT_SEQUENCE[currentExercise].duration - timeLeft);
  const overallProgress = (currentProgress / totalDuration) * 100;

  // Calculate XP based on completion percentage
  const calculateEarnedXP = () => {
    const completionRate = completedExercises.length / MOVEMENT_SEQUENCE.length;
    return Math.round(quest.xp * completionRate);
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isRunning && !isComplete) {
      interval = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            // Exercise completed naturally
            const newCompleted = [...completedExercises, currentExercise];
            setCompletedExercises(newCompleted);
            
            const nextIndex = currentExercise + 1;
            if (nextIndex >= MOVEMENT_SEQUENCE.length) {
              setIsComplete(true);
              setIsRunning(false);
              return 0;
            } else {
              setCurrentExercise(nextIndex);
              return MOVEMENT_SEQUENCE[nextIndex].duration;
            }
          }
          return prev - 1;
        });
      }, 1000);
    }
    
    return () => clearInterval(interval);
  }, [isRunning, currentExercise, isComplete, completedExercises]);

  // Handle completion with auto-close like GratitudeQuest
  useEffect(() => {
    if (isComplete && !showSuccess) {
      const earnedXP = calculateEarnedXP();
      const movementData = {
        completedExercises: completedExercises.length,
        skippedExercises: skippedExercises.length,
        totalExercises: MOVEMENT_SEQUENCE.length,
        completionRate: (completedExercises.length / MOVEMENT_SEQUENCE.length) * 100,
        earnedXP,
        timestamp: Date.now()
      };
      
      // Call onComplete with the movement data
      onComplete(movementData);
      
      // Show success animation then auto-close
      setShowSuccess(true);
      setTimeout(() => {
        onClose();
      }, 2000);
    }
  }, [isComplete, showSuccess, completedExercises, skippedExercises, quest, onComplete, onClose]);

  const handleStart = () => {
    setIsRunning(true);
    setHasStarted(true);
  };

  const handleSkip = () => {
    setSkippedExercises([...skippedExercises, currentExercise]);
    
    const nextIndex = currentExercise + 1;
    if (nextIndex < MOVEMENT_SEQUENCE.length) {
      setCurrentExercise(nextIndex);
      setTimeLeft(MOVEMENT_SEQUENCE[nextIndex].duration);
    } else {
      setIsComplete(true);
      setIsRunning(false);
    }
  };

  const formatTime = (seconds: number) => {
    if (seconds >= 60) {
      const mins = Math.floor(seconds / 60);
      const secs = seconds % 60;
      return `${mins}:${secs.toString().padStart(2, '0')}`;
    }
    return `${seconds}s`;
  };

  const exercise = MOVEMENT_SEQUENCE[currentExercise];

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-xl flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-gradient-to-br from-orange-900/90 to-amber-900/90 rounded-3xl p-8 max-w-2xl w-full relative backdrop-blur-xl border border-orange-500/30"
      >
        {/* Header */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-lg transition-colors"
        >
          <X className="w-5 h-5 text-white/70" />
        </button>

        <div className="text-center mb-6">
          <motion.div
            animate={{
              rotate: hasStarted ? 0 : [0, 10, -10, 0],
              scale: hasStarted ? 1 : [1, 1.1, 1]
            }}
            transition={{
              duration: 2,
              repeat: hasStarted ? 0 : Infinity,
              repeatDelay: 3
            }}
            className="inline-block mb-4"
          >
            <Activity className="w-12 h-12 text-orange-400" />
          </motion.div>
          <h2 className="text-3xl font-bold text-white mb-2">{quest.title}</h2>
          <p className="text-orange-200">{quest.description}</p>
        </div>

        {/* Overall Progress Bar */}
        {hasStarted && (
          <div className="mb-6">
            <div className="flex justify-between text-xs text-orange-300 mb-1">
              <span>Overall Progress</span>
              <span>{completedExercises.length} / {MOVEMENT_SEQUENCE.length} exercises</span>
            </div>
            <div className="bg-black/30 rounded-full h-2 overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-orange-400 to-yellow-400"
                animate={{ width: `${overallProgress}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>
        )}

        {!hasStarted ? (
          // Initial Start Screen
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Exercise Preview */}
            <div className="bg-black/30 rounded-2xl p-4">
              <h3 className="text-orange-300 font-semibold mb-3">Today's Flow Includes:</h3>
              <div className="grid grid-cols-2 gap-2">
                {MOVEMENT_SEQUENCE.map((ex, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 p-2 bg-white/5 rounded-lg"
                  >
                    <span className="text-xl">{ex.icon}</span>
                    <span className="text-white/80 text-sm">{ex.name}</span>
                  </div>
                ))}
              </div>
              <p className="text-orange-200/60 text-xs mt-3">
                Total duration: ~{Math.ceil(totalDuration / 60)} minutes
              </p>
            </div>

            {/* XP Preview */}
            <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-2xl p-4 border border-yellow-500/30">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-yellow-400" />
                  <span className="text-white/80">Complete all exercises</span>
                </div>
                <span className="text-2xl font-bold text-yellow-400">+{quest.xp} XP</span>
              </div>
            </div>

            {/* Start Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleStart}
              className="w-full py-4 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 rounded-2xl text-white font-bold text-lg transition-all shadow-lg"
            >
              Begin Energy Flow
            </motion.button>
          </motion.div>
        ) : (
          // Exercise Screen
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            {/* Current Exercise Card */}
            <div className="bg-gradient-to-br from-orange-500/20 to-yellow-500/20 rounded-2xl p-6 border border-orange-500/30">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  <motion.span 
                    className="text-5xl"
                    animate={{ scale: isRunning ? [1, 1.1, 1] : 1 }}
                    transition={{ duration: 2, repeat: isRunning ? Infinity : 0 }}
                  >
                    {exercise.icon}
                  </motion.span>
                  <div>
                    <h3 className="text-2xl font-bold text-white">{exercise.name}</h3>
                    <p className="text-orange-200 text-sm mt-1">
                      Exercise {currentExercise + 1} of {MOVEMENT_SEQUENCE.length}
                    </p>
                  </div>
                </div>
                <div className="text-center">
                  <span className="text-4xl font-bold text-orange-300">
                    {formatTime(timeLeft)}
                  </span>
                </div>
              </div>
              
              <p className="text-white/80 text-lg mb-4">
                {exercise.description}
              </p>

              {/* Exercise Progress */}
              <div className="bg-black/30 rounded-full h-2 overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-orange-400 to-yellow-400"
                  animate={{ 
                    width: `${((exercise.duration - timeLeft) / exercise.duration) * 100}%` 
                  }}
                />
              </div>
            </div>

            {/* Controls */}
            <div className="flex justify-center gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsRunning(!isRunning)}
                className="px-8 py-3 bg-orange-600 hover:bg-orange-700 rounded-xl text-white font-semibold transition-all shadow-lg flex items-center gap-2"
              >
                {isRunning ? (
                  <>
                    <Pause className="w-5 h-5" />
                    Pause
                  </>
                ) : (
                  <>
                    <Play className="w-5 h-5" />
                    Resume
                  </>
                )}
              </motion.button>
              
              {currentExercise < MOVEMENT_SEQUENCE.length - 1 && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSkip}
                  className="px-6 py-3 bg-orange-600/50 hover:bg-orange-700/50 rounded-xl text-white font-semibold transition-all flex items-center gap-2"
                >
                  Skip
                  <ChevronRight className="w-5 h-5" />
                </motion.button>
              )}
            </div>

            {/* Exercise Status Grid */}
            <div className="grid grid-cols-2 gap-3">
              {MOVEMENT_SEQUENCE.map((ex, idx) => (
                <div
                  key={idx}
                  className={`p-3 rounded-lg flex items-center gap-2 transition-all ${
                    idx === currentExercise 
                      ? 'bg-orange-500/30 border border-orange-400 scale-105'
                      : completedExercises.includes(idx)
                      ? 'bg-green-500/20 border border-green-400/50'
                      : skippedExercises.includes(idx)
                      ? 'bg-gray-500/10 border border-gray-400/30 opacity-50'
                      : 'bg-white/5 border border-white/10'
                  }`}
                >
                  {completedExercises.includes(idx) && (
                    <Check className="w-4 h-4 text-green-400" />
                  )}
                  <span className={`text-sm ${
                    skippedExercises.includes(idx) ? 'text-white/40 line-through' : 'text-white/80'
                  }`}>
                    {ex.name}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Success Overlay - Matching GratitudeQuest style */}
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
                  <Activity className="w-20 h-20 text-orange-400 mx-auto mb-4" />
                </motion.div>
                <h3 className="text-2xl font-bold text-white mb-2">Energy Flowing!</h3>
                <p className="text-orange-300">Your body thanks you</p>
                <p className="text-green-400 font-bold text-xl mt-2">+{calculateEarnedXP()} XP</p>
                {completedExercises.length < MOVEMENT_SEQUENCE.length && (
                  <p className="text-orange-300/60 text-sm mt-2">
                    {completedExercises.length}/{MOVEMENT_SEQUENCE.length} exercises completed
                  </p>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};