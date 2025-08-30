// src/features/yang/components/DailyVitality.tsx
'use client';

import { Battery, Brain, Heart } from 'lucide-react';
import { useState } from 'react';
import { motion } from 'framer-motion';

export function DailyVitality() {
  const [energyLevel, setEnergyLevel] = useState(7);
  const [motivationLevel, setMotivationLevel] = useState(8);
  const [recoveryStatus, setRecoveryStatus] = useState(6);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-xl rounded-2xl border border-orange-500/20 p-6"
    >
      <h3 className="text-xl font-bold text-white mb-4">Daily Vitality Check</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Energy Level */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Battery className="w-5 h-5 text-yellow-400" />
            <span className="text-gray-300">Energy Level</span>
          </div>
          <div className="flex gap-1">
            {[...Array(10)].map((_, i) => (
              <motion.button
                key={i}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setEnergyLevel(i + 1)}
                className={`h-8 flex-1 rounded ${
                  i < energyLevel 
                    ? 'bg-gradient-to-t from-yellow-500 to-orange-400' 
                    : 'bg-gray-700'
                }`}
              />
            ))}
          </div>
          <p className="text-center mt-2 text-sm text-gray-400">{energyLevel}/10</p>
        </div>
        
        {/* Motivation */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Brain className="w-5 h-5 text-purple-400" />
            <span className="text-gray-300">Motivation</span>
          </div>
          <div className="flex gap-1">
            {[...Array(10)].map((_, i) => (
              <motion.button
                key={i}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setMotivationLevel(i + 1)}
                className={`h-8 flex-1 rounded ${
                  i < motivationLevel 
                    ? 'bg-gradient-to-t from-purple-500 to-pink-400' 
                    : 'bg-gray-700'
                }`}
              />
            ))}
          </div>
          <p className="text-center mt-2 text-sm text-gray-400">{motivationLevel}/10</p>
        </div>
        
        {/* Recovery */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Heart className="w-5 h-5 text-red-400" />
            <span className="text-gray-300">Recovery Status</span>
          </div>
          <div className="flex gap-1">
            {[...Array(10)].map((_, i) => (
              <motion.button
                key={i}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setRecoveryStatus(i + 1)}
                className={`h-8 flex-1 rounded ${
                  i < recoveryStatus 
                    ? 'bg-gradient-to-t from-red-500 to-pink-400' 
                    : 'bg-gray-700'
                }`}
              />
            ))}
          </div>
          <p className="text-center mt-2 text-sm text-gray-400">{recoveryStatus}/10</p>
        </div>
      </div>
      
      <div className="mt-6 p-4 bg-black/30 rounded-xl">
        <p className="text-sm text-gray-400">
          {energyLevel >= 7 && motivationLevel >= 7 
            ? "🔥 You're primed for an intense session today!" 
            : recoveryStatus < 5 
            ? "⚠️ Consider a lighter session or active recovery today."
            : "💪 Ready for a solid training day!"}
        </p>
      </div>
    </motion.div>
  );
}