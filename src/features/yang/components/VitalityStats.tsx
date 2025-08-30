// src/features/yang/components/VitalityStats.tsx
'use client';

import { Flame, TrendingUp, Heart, Dumbbell } from 'lucide-react';
import { motion } from 'framer-motion';

const stats = [
  {
    label: 'Power Level',
    value: 87,
    icon: Flame,
    color: 'from-orange-500 to-amber-400',
    trend: '+3% this week',
  },
  {
    label: 'Workouts',
    value: 5,
    icon: Dumbbell,
    color: 'from-amber-500 to-orange-400',
    trend: '+1 session',
  },
  {
    label: 'Recovery',
    value: 92,
    icon: Heart,
    color: 'from-rose-500 to-orange-400',
    trend: 'Optimal',
  },
  {
    label: 'Progress',
    value: '34%',
    icon: TrendingUp,
    color: 'from-orange-400 to-amber-300',
    trend: '+7% this month',
  },
];

export default function VitalityStats() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {stats.map(({ label, value, icon: Icon, color, trend }, i) => (
        <motion.div
          key={label}
          className={`bg-gradient-to-br ${color} rounded-2xl p-5 flex flex-col items-start shadow-lg border border-orange-900/30 relative overflow-hidden`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
        >
          <div className="flex items-center gap-2 mb-2">
            <Icon className="w-6 h-6 text-white drop-shadow" />
            <span className="text-lg font-bold text-white drop-shadow">{value}</span>
          </div>
          <span className="text-sm text-orange-100/80 font-medium mb-1">{label}</span>
          <span className="text-xs text-orange-200/60">{trend}</span>
          {/* Ember effect */}
          <motion.div
            className="absolute right-2 bottom-2 w-8 h-8 rounded-full bg-orange-400/30 blur-2xl"
            animate={{ scale: [1, 1.2, 1], opacity: [0.7, 1, 0.7] }}
            transition={{ repeat: Infinity, duration: 2, delay: i * 0.2 }}
          />
        </motion.div>
      ))}
    </div>
  );
}
