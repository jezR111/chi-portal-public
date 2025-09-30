// src/features/yin/components/quests-and-challenges/quests/individual-quests/MovementQuest.tsx

import { AnimatePresence, motion } from 'framer-motion';
import { Activity, Check, ChevronRight, Pause, Play, X, Zap } from 'lucide-react';
import { useEffect, useState } from 'react';

interface MovementQuestProps {
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

const MOVEMENT_SEQUENCE = [
  {
    name: 'Neck Rolls',
    duration: 30,
    description: 'Gently roll your neck in circles, 15 seconds each direction',
    icon: '🔄',
    xp: 1
  },
  {
    name: 'Shoulder Shrugs',
    duration: 30,
    description: 'Raise shoulders to ears, hold for 3 seconds, release. Repeat.',
    icon: '⬆️',
    xp: 1
  },
  {
    name: 'Arm Circles',
    duration: 40,
    description: 'Wide arm circles forward and backward, 20 seconds each',
    icon: '🔁',
    xp: 1
  },
  {
    name: 'Standing Forward Fold',
    duration: 45,
    description: 'Bend forward from hips, let arms hang, sway gently',
    icon: '🙇',
    xp: 1
  },
  {
    name: 'Side Stretches',
    duration: 40,
    description: 'Reach one arm overhead and lean, 20 seconds each side',
    icon: '🙆',
    xp: 1
  },
  {
    name: 'Hip Circles',
    duration: 30,
    description: 'Hands on hips, circle clockwise then counter-clockwise',
    icon: '🔄',
    xp: 1
  },
  {
    name: 'Quad Stretch',
    duration: 40,
    description: 'Hold foot behind you, 20 seconds each leg',
    icon: '🦵',
    xp: 1
  }
];

export const MovementQuest: React.FC<MovementQuestProps> = ({ quest, onComplete, onClose }) => {
  const [currentExercise, setCurrentExercise] = useState(0);
  const [timeLeft, setTimeLeft] = useState(MOVEMENT_SEQUENCE[0].duration);
  const [isRunning, setIsRunning] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [completedExercises, setCompletedExercises] = useState<number[]>([]);
  const [skippedExercises, setSkippedExercises] = useState<number[]>([]);
  const [earnedXP, setEarnedXP] = useState(0);

  const totalDuration = MOVEMENT_SEQUENCE.reduce((sum, ex) => sum + ex.duration, 0);
  const currentProgress = MOVEMENT_SEQUENCE
    .slice(0, currentExercise)
    .reduce((sum, ex) => sum + ex.duration, 0) + (MOVEMENT_SEQUENCE[currentExercise].duration - timeLeft);
  const overallProgress = (currentProgress / totalDuration) * 100;

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isRunning && !isComplete) {
      interval = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            // Exercise completed naturally
            const newCompleted = [...completedExercises, currentExercise];
            setCompletedExercises(newCompleted);
            setEarnedXP(earnedXP + MOVEMENT_SEQUENCE[currentExercise].xp);
            
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
  }, [isRunning, currentExercise, isComplete, completedExercises, earnedXP]);

  useEffect(() => {
    if (isComplete) {
      const finalXP = completedExercises.length; // 1 XP per completed exercise
      setTimeout(() => {
        onComplete(quest.id, finalXP, {
          completedExercises: completedExercises.length,
          skippedExercises: skippedExercises.length,
          totalXP: finalXP
        });
      }, 2000);
    }
  }, [isComplete, completedExercises, skippedExercises, quest.id, onComplete]);

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
        <div className="absolute top-4 right-4">
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-white/70" />
          </button>
        </div>

        <div className="flex items-center gap-3 mb-6">
          <Activity className="w-8 h-8 text-orange-400" />
          <h2 className="text-3xl font-bold text-white">{quest.title}</h2>
          {/* XP Counter */}
          <div className="ml-auto flex items-center gap-2 px-3 py-1 bg-yellow-500/20 rounded-full">
            <Zap className="w-4 h-4 text-yellow-400" />
            <span className="text-yellow-300 font-bold">{earnedXP} XP</span>
          </div>
        </div>

        {/* Overall Progress */}
        <div className="bg-black/30 rounded-full h-3 mb-8 overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-orange-400 to-yellow-400"
            animate={{ width: `${overallProgress}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>

        <AnimatePresence mode="wait">
          {!isComplete ? (
            <motion.div
              key="exercises"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6"
            >
              {/* Current Exercise */}
              <div className="bg-gradient-to-br from-orange-500/20 to-yellow-500/20 rounded-2xl p-6 border border-orange-500/30">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <span className="text-5xl">{exercise.icon}</span>
                    <div>
                      <h3 className="text-2xl font-bold text-white">{exercise.name}</h3>
                      <p className="text-orange-200 text-sm mt-1">
                        Exercise {currentExercise + 1} of {MOVEMENT_SEQUENCE.length} • +{exercise.xp} XP
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
                    className="h-full bg-orange-400"
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
                      {currentExercise === 0 && !completedExercises.length ? 'Start' : 'Resume'}
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
                    Skip (No XP)
                    <ChevronRight className="w-5 h-5" />
                  </motion.button>
                )}
              </div>

              {/* Exercise List */}
              <div className="grid grid-cols-2 gap-3 mt-6">
                {MOVEMENT_SEQUENCE.map((ex, idx) => (
                  <div
                    key={idx}
                    className={`p-3 rounded-lg flex items-center gap-2 transition-all ${
                      idx === currentExercise 
                        ? 'bg-orange-500/30 border border-orange-400'
                        : completedExercises.includes(idx)
                        ? 'bg-green-500/20 border border-green-400/50'
                        : skippedExercises.includes(idx)
                        ? 'bg-gray-500/20 border border-gray-400/50 line-through opacity-50'
                        : 'bg-white/5 border border-white/10'
                    }`}
                  >
                    {completedExercises.includes(idx) && (
                      <Check className="w-4 h-4 text-green-400" />
                    )}
                    <span className="text-white/80 text-sm">{ex.name}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          ) : (
            // Completion screen
            <motion.div
              key="complete"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-center py-8"
            >
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 1 }}
                className="inline-block mb-6"
              >
                <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center shadow-2xl">
                  <Check className="w-12 h-12 text-white" />
                </div>
              </motion.div>
              <h3 className="text-3xl font-bold text-white mb-2">Energy Flowing!</h3>
              <p className="text-green-300 text-xl mb-2">
                {completedExercises.length} exercises complete
              </p>
              {skippedExercises.length > 0 && (
                <p className="text-orange-300 text-sm mb-2">
                  {skippedExercises.length} skipped
                </p>
              )}
              <p className="text-yellow-300 text-2xl font-bold">+{earnedXP} XP earned</p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};