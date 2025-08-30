// src/features/yang/components/HydrationTracker.tsx
'use client';

import { motion } from 'framer-motion';
import { Droplets, Minus, Plus } from 'lucide-react';
import { useState } from 'react';

interface HydrationTrackerProps {
  current: number;
  target: number;
}

export function HydrationTracker({ current, target }: HydrationTrackerProps) {
  const [waterIntake, setWaterIntake] = useState(current);
  const percentage = Math.min((waterIntake / target) * 100, 100);

  return (
    <div className="bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-xl rounded-2xl border border-blue-500/20 p-6 h-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-white">Hydration</h3>
        <Droplets className="w-5 h-5 text-blue-400" />
      </div>

      <div className="relative h-48 mb-6">
        <div className="absolute inset-0 bg-black/30 rounded-2xl overflow-hidden">
          <motion.div
            className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-blue-500 to-cyan-400"
            initial={{ height: 0 }}
            animate={{ height: `${percentage}%` }}
            transition={{ duration: 0.5 }}
          >
            <div className="absolute inset-0 opacity-50">
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-full h-px bg-white/20"
                  style={{ bottom: `${i * 25}%` }}
                  animate={{ x: [0, 10, 0] }}
                  transition={{ duration: 3, repeat: Infinity, delay: i * 0.2 }}
                />
              ))}
            </div>
          </motion.div>
        </div>
        
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <p className="text-4xl font-bold text-white">{waterIntake}</p>
            <p className="text-sm text-gray-400">/ {target} ml</p>
          </div>
        </div>
      </div>

      <div className="flex gap-2">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setWaterIntake(Math.max(0, waterIntake - 250))}
          className="flex-1 py-2 bg-black/30 rounded-lg border border-gray-700 hover:border-blue-500/50 transition-all"
        >
          <Minus className="w-5 h-5 text-gray-400 mx-auto" />
        </motion.button>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setWaterIntake(waterIntake + 250)}
          className="flex-1 py-2 bg-blue-500/20 rounded-lg border border-blue-500/50 hover:bg-blue-500/30 transition-all"
        >
          <Plus className="w-5 h-5 text-blue-400 mx-auto" />
        </motion.button>
      </div>
      
      <p className="text-center text-xs text-gray-400 mt-2">+/- 250ml</p>
    </div>
  );
}
