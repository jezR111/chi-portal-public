// src/features/yang/components/NutritionSummary.tsx
'use client';

import { motion } from 'framer-motion';
import { AlertCircle, Apple } from 'lucide-react';

export function NutritionSummary() {
  const nutritionData = {
    calories: { current: 1850, target: 2500, trend: 'up' },
    protein: { current: 142, target: 180, trend: 'stable' },
    water: { current: 2.1, target: 3.0, trend: 'down' },
  };

  return (
    <div className="bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-xl rounded-2xl border border-green-500/20 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-white">Nutrition</h3>
        <Apple className="w-5 h-5 text-green-400" />
      </div>

      <div className="space-y-4">
        <div>
          <div className="flex justify-between mb-2">
            <span className="text-sm text-gray-400">Calories</span>
            <span className="text-sm font-bold text-white">
              {nutritionData.calories.current} / {nutritionData.calories.target}
            </span>
          </div>
          <div className="h-2 bg-black/50 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(nutritionData.calories.current / nutritionData.calories.target) * 100}%` }}
              className="h-full bg-gradient-to-r from-green-500 to-emerald-500"
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between mb-2">
            <span className="text-sm text-gray-400">Protein</span>
            <span className="text-sm font-bold text-white">
              {nutritionData.protein.current}g / {nutritionData.protein.target}g
            </span>
          </div>
          <div className="h-2 bg-black/50 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(nutritionData.protein.current / nutritionData.protein.target) * 100}%` }}
              className="h-full bg-gradient-to-r from-red-500 to-pink-500"
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between mb-2">
            <span className="text-sm text-gray-400">Hydration</span>
            <span className="text-sm font-bold text-white">
              {nutritionData.water.current}L / {nutritionData.water.target}L
            </span>
          </div>
          <div className="h-2 bg-black/50 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(nutritionData.water.current / nutritionData.water.target) * 100}%` }}
              className="h-full bg-gradient-to-r from-blue-500 to-cyan-500"
            />
          </div>
        </div>
      </div>

      <div className="mt-4 p-3 bg-yellow-500/10 rounded-lg border border-yellow-500/30">
        <div className="flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-yellow-400" />
          <p className="text-xs text-yellow-400">Low calorie intake today</p>
        </div>
      </div>
    </div>
  );
}
