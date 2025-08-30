// src/app/(portal)/vitality/training/page.tsx
'use client';

import { ProgressiveOverload } from '@/features/yang/components/ProgressiveOverload';
import { TrainingCalendar } from '@/features/yang/components/TrainingCalendar';
import { WorkoutBuilder } from '@/features/yang/components/WorkoutBuilder';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Award,
  BarChart3,
  Dumbbell,
  Flame,
  Play,
  Plus,
  Target,
  Timer
} from 'lucide-react';
import { useState } from 'react';

interface Workout {
  id: string;
  name: string;
  type: 'strength' | 'cardio' | 'mobility' | 'hybrid';
  duration: number;
  exercises: Exercise[];
  completed: boolean;
  scheduledDate: Date;
}

interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: number;
  weight?: number;
  rest: number;
  notes?: string;
}

export default function TrainingPage() {
  const [selectedWeek, setSelectedWeek] = useState(0);
  const [activeWorkout, setActiveWorkout] = useState<Workout | null>(null);
  const [showBuilder, setShowBuilder] = useState(false);
  
  // Mock data
  const currentProgram = {
    name: "Peak Performance Protocol",
    phase: "Strength Building",
    week: 4,
    totalWeeks: 12,
    adherence: 92
  };

  const todayWorkout = {
    name: "Upper Power Day",
    exercises: 6,
    estimatedTime: 75,
    targetMuscles: ["Chest", "Back", "Shoulders"]
  };

  return (
    <div className="space-y-8">
      {/* Program Overview Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-red-900/20 via-orange-900/20 to-amber-900/20 backdrop-blur-xl border border-red-500/20 p-8"
      >
        <div className="absolute inset-0 bg-[url('/assets/yang/fire-texture.jpg')] opacity-5" />
        
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Dumbbell className="w-8 h-8 text-orange-400" />
                <h1 className="text-3xl font-bold text-white">Training Command</h1>
              </div>
              <p className="text-orange-200/80">
                {currentProgram.name} • Week {currentProgram.week} of {currentProgram.totalWeeks}
              </p>
            </div>
            
            <div className="flex gap-4">
              <div className="text-center">
                <div className="text-4xl font-bold text-orange-400">{currentProgram.adherence}%</div>
                <div className="text-sm text-orange-300/60">Adherence</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-red-400">
                  <Flame className="w-10 h-10" />
                </div>
                <div className="text-sm text-orange-300/60">On Fire</div>
              </div>
            </div>
          </div>

          {/* Phase Progress */}
          <div className="bg-black/30 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-orange-300/80">Phase: {currentProgram.phase}</span>
              <span className="text-orange-400 font-bold">
                {Math.round((currentProgram.week / currentProgram.totalWeeks) * 100)}%
              </span>
            </div>
            <div className="h-3 bg-black/50 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(currentProgram.week / currentProgram.totalWeeks) * 100}%` }}
                transition={{ duration: 1 }}
                className="h-full bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500"
              />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Today's Workout Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        className="bg-gradient-to-br from-orange-900/10 to-red-900/10 backdrop-blur-xl rounded-2xl border border-orange-500/20 p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-white mb-1">Today's Mission</h2>
            <p className="text-orange-300/80">{todayWorkout.name}</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl font-bold text-white flex items-center gap-2 shadow-lg hover:shadow-orange-500/25"
          >
            <Play className="w-5 h-5" />
            Start Workout
          </motion.button>
        </div>
        
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-black/30 rounded-lg p-3">
            <div className="flex items-center gap-2 text-orange-400 mb-1">
              <Target className="w-4 h-4" />
              <span className="text-sm">Exercises</span>
            </div>
            <div className="text-2xl font-bold text-white">{todayWorkout.exercises}</div>
          </div>
          <div className="bg-black/30 rounded-lg p-3">
            <div className="flex items-center gap-2 text-orange-400 mb-1">
              <Timer className="w-4 h-4" />
              <span className="text-sm">Duration</span>
            </div>
            <div className="text-2xl font-bold text-white">{todayWorkout.estimatedTime} min</div>
          </div>
          <div className="bg-black/30 rounded-lg p-3">
            <div className="flex items-center gap-2 text-orange-400 mb-1">
              <Flame className="w-4 h-4" />
              <span className="text-sm">Target</span>
            </div>
            <div className="text-sm font-medium text-white">
              {todayWorkout.targetMuscles.join(", ")}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Main Training Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Training Calendar */}
        <div className="lg:col-span-2">
          <TrainingCalendar 
            selectedWeek={selectedWeek}
            onWeekChange={setSelectedWeek}
          />
        </div>
        
        {/* Progressive Overload Tracker */}
        <div>
          <ProgressiveOverload />
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowBuilder(true)}
          className="p-6 bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl border border-gray-700 hover:border-orange-500/50 transition-all"
        >
          <Plus className="w-8 h-8 text-orange-400 mb-3" />
          <p className="text-white font-semibold">Create Workout</p>
          <p className="text-gray-400 text-sm mt-1">Build custom routine</p>
        </motion.button>
        
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="p-6 bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl border border-gray-700 hover:border-orange-500/50 transition-all"
        >
          <BarChart3 className="w-8 h-8 text-orange-400 mb-3" />
          <p className="text-white font-semibold">View Analytics</p>
          <p className="text-gray-400 text-sm mt-1">Track your gains</p>
        </motion.button>
        
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="p-6 bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl border border-gray-700 hover:border-orange-500/50 transition-all"
        >
          <Award className="w-8 h-8 text-orange-400 mb-3" />
          <p className="text-white font-semibold">Achievements</p>
          <p className="text-gray-400 text-sm mt-1">12 unlocked</p>
        </motion.button>
      </div>

      {/* Workout Builder Modal */}
      <AnimatePresence>
        {showBuilder && (
          <WorkoutBuilder onClose={() => setShowBuilder(false)} />
        )}
      </AnimatePresence>
    </div>
  );
}