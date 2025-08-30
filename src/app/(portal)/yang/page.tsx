// src/app/(portal)/yang/page.tsx
'use client';

import { DailyVitality } from '@/features/yang/components/DailyVitality';
import MountainProgress from '@/features/yang/components/MountainProgress';
import { NutritionSummary } from '@/features/yang/components/NutritionSummary';
import { RecoveryStatus } from '@/features/yang/components/RecoveryStatus';
import { TrainingOverview } from '@/features/yang/components/TrainingOverview';
import VitalityStats from '@/features/yang/components/VitalityStats';
import { motion } from 'framer-motion';
import {
  Activity,
  Brain,
  ChevronRight,
  Heart,
  TrendingUp,
  Zap
} from 'lucide-react';
import { useState } from 'react';

export default function VitalityDashboard() {
  const [selectedMetric, setSelectedMetric] = useState<string>('strength');
  
  // Mock data - would come from API
  const vitalityScore = 78;
  const weeklyProgress = {
    training: 85,
    nutrition: 72,
    recovery: 90,
    mindset: 68
  };

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-orange-900/20 via-amber-900/20 to-yellow-900/20 backdrop-blur-xl border border-orange-500/20 p-8"
      >
        <div className="absolute inset-0 bg-[url('/assets/yang/texture-rock.jpg')] opacity-5" />
        
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-400">
                Vitality Command Center
              </h1>
              <p className="text-orange-200/80 mt-2">
                Master your physical realm • Build unstoppable momentum
              </p>
            </div>
            
            <div className="text-right">
              <div className="text-sm text-orange-300/60 mb-1">Total Power Level</div>
              <div className="text-5xl font-bold text-orange-400">{vitalityScore}</div>
              <div className="flex items-center justify-end mt-2 text-green-400">
                <TrendingUp className="w-4 h-4 mr-1" />
                <span className="text-sm">+5 this week</span>
              </div>
            </div>
          </div>

          {/* Quick Stats Bar */}
          <div className="grid grid-cols-4 gap-4">
            {Object.entries(weeklyProgress).map(([key, value]) => (
              <motion.div
                key={key}
                whileHover={{ scale: 1.05 }}
                className="bg-black/30 rounded-xl p-4 border border-orange-500/20"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-orange-300/60 text-sm capitalize">{key}</span>
                  <span className="text-orange-400 font-bold">{value}%</span>
                </div>
                <div className="h-2 bg-black/50 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${value}%` }}
                    transition={{ duration: 1, delay: 0.2 }}
                    className="h-full bg-gradient-to-r from-orange-500 to-red-500"
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Daily Vitality Check */}
      <DailyVitality />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Training Section */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2"
        >
          <TrainingOverview />
        </motion.div>

        {/* Mountain Progress Visualization */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <MountainProgress currentLevel={3} totalLevels={10} />
        </motion.div>
      </div>

      {/* Secondary Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Nutrition Summary */}
        <NutritionSummary />
        
        {/* Recovery Status */}
        <RecoveryStatus />
        
        {/* Vitality Stats */}
        <VitalityStats />
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4"
      >
        {[
          { icon: Activity, label: 'Log Workout', color: 'from-red-500 to-orange-500' },
          { icon: Heart, label: 'Track Recovery', color: 'from-pink-500 to-red-500' },
          { icon: Brain, label: 'Mental Training', color: 'from-purple-500 to-pink-500' },
          { icon: Zap, label: 'Energy Check', color: 'from-yellow-500 to-orange-500' },
        ].map((action, index) => (
          <motion.button
            key={action.label}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="relative group overflow-hidden rounded-2xl bg-gradient-to-br from-gray-900 to-gray-800 p-6 border border-gray-700 hover:border-orange-500/50 transition-all"
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${action.color} opacity-0 group-hover:opacity-20 transition-opacity`} />
            <action.icon className="w-8 h-8 text-orange-400 mb-3" />
            <p className="text-gray-300 font-medium">{action.label}</p>
            <ChevronRight className="absolute bottom-4 right-4 w-5 h-5 text-gray-600 group-hover:text-orange-400 transition-colors" />
          </motion.button>
        ))}
      </motion.div>
    </div>
  );
}