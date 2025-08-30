// src/features/yang/components/TrainingOverview.tsx
'use client';

import { motion } from 'framer-motion';
import { Clock, Flame, Target, TrendingUp } from 'lucide-react';

export function TrainingOverview() {
  const weeklyWorkouts = [
    { day: 'Mon', type: 'Upper Power', completed: true, intensity: 85 },
    { day: 'Tue', type: 'Lower Strength', completed: true, intensity: 90 },
    { day: 'Wed', type: 'Recovery', completed: true, intensity: 40 },
    { day: 'Thu', type: 'Upper Volume', completed: true, intensity: 75 },
    { day: 'Fri', type: 'Lower Power', completed: false, intensity: 0 },
    { day: 'Sat', type: 'Full Body', completed: false, intensity: 0 },
    { day: 'Sun', type: 'Rest', completed: false, intensity: 0 },
  ];

  return (
    <div className="bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-xl rounded-2xl border border-orange-500/20 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-white">Training Week</h3>
        <div className="flex items-center gap-2">
          <Flame className="w-5 h-5 text-orange-400" />
          <span className="text-orange-400 font-bold">4/7 Complete</span>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-2 mb-6">
        {weeklyWorkouts.map((workout, index) => (
          <motion.div
            key={workout.day}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className={`text-center p-3 rounded-xl border ${
              workout.completed 
                ? 'bg-orange-500/20 border-orange-500/50' 
                : 'bg-black/30 border-gray-700'
            }`}
          >
            <p className="text-xs text-gray-400 mb-1">{workout.day}</p>
            <div className={`w-10 h-10 mx-auto mb-2 rounded-full flex items-center justify-center ${
              workout.completed ? 'bg-orange-500' : 'bg-gray-700'
            }`}>
              {workout.completed ? (
                <Flame className="w-5 h-5 text-white" />
              ) : (
                <span className="text-xs text-gray-400">{index + 1}</span>
              )}
            </div>
            <p className="text-xs text-gray-300 font-medium">{workout.type}</p>
            {workout.intensity > 0 && (
              <div className="mt-2 h-1 bg-black/50 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-yellow-500 to-red-500"
                  style={{ width: `${workout.intensity}%` }}
                />
              </div>
            )}
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-black/30 rounded-lg p-3">
          <div className="flex items-center gap-2 text-orange-400 mb-1">
            <Target className="w-4 h-4" />
            <span className="text-xs">Volume</span>
          </div>
          <p className="text-xl font-bold text-white">42,500 lbs</p>
          <p className="text-xs text-green-400">+12% vs last week</p>
        </div>
        <div className="bg-black/30 rounded-lg p-3">
          <div className="flex items-center gap-2 text-orange-400 mb-1">
            <Clock className="w-4 h-4" />
            <span className="text-xs">Time</span>
          </div>
          <p className="text-xl font-bold text-white">5.2 hrs</p>
          <p className="text-xs text-gray-400">This week</p>
        </div>
        <div className="bg-black/30 rounded-lg p-3">
          <div className="flex items-center gap-2 text-orange-400 mb-1">
            <TrendingUp className="w-4 h-4" />
            <span className="text-xs">PRs</span>
          </div>
          <p className="text-xl font-bold text-white">3</p>
          <p className="text-xs text-yellow-400">New records!</p>
        </div>
      </div>
    </div>
  );
}
