
// src/features/yang/components/RecoveryStatus.tsx
'use client';

import { motion } from 'framer-motion';
import { Activity, Battery, Heart, Moon } from 'lucide-react';

export function RecoveryStatus() {
  const recoveryMetrics = {
    sleep: { hours: 7.5, quality: 85 },
    hrv: { value: 62, trend: 'up' },
    rhr: { value: 58, trend: 'stable' },
    readiness: 78,
  };

  return (
    <div className="bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-xl rounded-2xl border border-pink-500/20 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-white">Recovery</h3>
        <Heart className="w-5 h-5 text-pink-400" />
      </div>

      <div className="text-center mb-6">
        <div className="relative w-32 h-32 mx-auto">
          <svg className="transform -rotate-90 w-32 h-32">
            <circle cx="64" cy="64" r="56" stroke="#1f2937" strokeWidth="8" fill="none" />
            <motion.circle
              cx="64" cy="64" r="56"
              stroke="url(#recoveryGradient)"
              strokeWidth="8"
              fill="none"
              strokeLinecap="round"
              strokeDasharray={`${recoveryMetrics.readiness * 3.52} 352`}
              initial={{ strokeDasharray: "0 352" }}
              animate={{ strokeDasharray: `${recoveryMetrics.readiness * 3.52} 352` }}
              transition={{ duration: 1 }}
            />
            <defs>
              <linearGradient id="recoveryGradient">
                <stop offset="0%" stopColor="#ec4899" />
                <stop offset="100%" stopColor="#f97316" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <Battery className="w-6 h-6 text-pink-400 mb-1" />
            <span className="text-3xl font-bold text-white">{recoveryMetrics.readiness}%</span>
            <span className="text-xs text-gray-400">Readiness</span>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between p-2 bg-black/30 rounded-lg">
          <div className="flex items-center gap-2">
            <Moon className="w-4 h-4 text-purple-400" />
            <span className="text-sm text-gray-400">Sleep</span>
          </div>
          <span className="text-sm font-bold text-white">{recoveryMetrics.sleep.hours}h</span>
        </div>

        <div className="flex items-center justify-between p-2 bg-black/30 rounded-lg">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-green-400" />
            <span className="text-sm text-gray-400">HRV</span>
          </div>
          <span className="text-sm font-bold text-white">{recoveryMetrics.hrv.value}ms</span>
        </div>

        <div className="flex items-center justify-between p-2 bg-black/30 rounded-lg">
          <div className="flex items-center gap-2">
            <Heart className="w-4 h-4 text-red-400" />
            <span className="text-sm text-gray-400">RHR</span>
          </div>
          <span className="text-sm font-bold text-white">{recoveryMetrics.rhr.value} bpm</span>
        </div>
      </div>
    </div>
  );
}
