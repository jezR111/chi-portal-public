// src/features/yin/components/chapters/StatsDashboard.tsx
'use client'

import { motion } from 'framer-motion';
import {
  Activity,
  Award,
  BarChart3,
  BookOpen,
  Clock,
  Flame,
  PieChart,
  Target,
  TrendingUp,
  Zap
} from 'lucide-react';
import React, { useMemo } from 'react';

interface StatsDashboardProps {
  totalXP: number;
  completedLessons: string[];
  userLevel: number;
  pathProgress: Record<string, number>;
  createdAt?: string; // When user started
  lastActive?: string;
}

export const StatsDashboard: React.FC<StatsDashboardProps> = ({
  totalXP,
  completedLessons,
  userLevel,
  pathProgress,
  createdAt = '2024-01-01',
  lastActive = new Date().toISOString()
}) => {
  // Calculate various statistics
  const stats = useMemo(() => {
    const now = new Date();
    const startDate = new Date(createdAt);
    const daysActive = Math.ceil((now.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    
    // Learning velocity
    const lessonsPerDay = completedLessons.length / Math.max(1, daysActive);
    const xpPerDay = totalXP / Math.max(1, daysActive);
    
    // Path statistics
    const activePaths = Object.values(pathProgress).filter(p => p > 0).length;
    const completedPaths = Object.values(pathProgress).filter(p => p >= 100).length;
    const averagePathProgress = Object.values(pathProgress).length > 0
      ? Math.round(Object.values(pathProgress).reduce((a, b) => a + b, 0) / Object.values(pathProgress).length)
      : 0;
    
    // Time estimates
    const estimatedTotalTime = completedLessons.length * 15; // 15 min average per lesson
    const hoursLearned = Math.round(estimatedTotalTime / 60);
    
    // Predictions
    const daysToNextLevel = Math.ceil((100 - (totalXP % 100)) / Math.max(1, xpPerDay));
    const estimatedMasteryDate = new Date();
    estimatedMasteryDate.setDate(estimatedMasteryDate.getDate() + Math.ceil((5000 - totalXP) / Math.max(1, xpPerDay)));
    
    // Learning patterns
    const weeklyAverage = Math.round(lessonsPerDay * 7);
    const monthlyGoal = Math.round(weeklyAverage * 4.3);
    
    return {
      daysActive,
      lessonsPerDay: lessonsPerDay.toFixed(1),
      xpPerDay: Math.round(xpPerDay),
      activePaths,
      completedPaths,
      averagePathProgress,
      hoursLearned,
      daysToNextLevel,
      estimatedMasteryDate: estimatedMasteryDate.toLocaleDateString(),
      weeklyAverage,
      monthlyGoal,
      totalLessons: completedLessons.length,
      currentStreak: 7, // This would need proper tracking
      longestStreak: 14, // This would need proper tracking
    };
  }, [totalXP, completedLessons, pathProgress, createdAt]);

  const statCards = [
    {
      title: 'Total XP Earned',
      value: totalXP.toLocaleString(),
      subtitle: `Level ${userLevel}`,
      icon: Zap,
      color: 'from-yellow-400 to-amber-500',
      trend: `+${stats.xpPerDay} per day`
    },
    {
      title: 'Lessons Completed',
      value: stats.totalLessons,
      subtitle: `${stats.lessonsPerDay} per day`,
      icon: BookOpen,
      color: 'from-blue-400 to-indigo-500',
      trend: `${stats.weeklyAverage} weekly avg`
    },
    {
      title: 'Learning Streak',
      value: `${stats.currentStreak} days`,
      subtitle: `Best: ${stats.longestStreak} days`,
      icon: Flame,
      color: 'from-orange-400 to-red-500',
      trend: 'Keep it going!'
    },
    {
      title: 'Time Invested',
      value: `${stats.hoursLearned}h`,
      subtitle: `${stats.daysActive} days active`,
      icon: Clock,
      color: 'from-purple-400 to-pink-500',
      trend: '~15 min per lesson'
    },
    {
      title: 'Path Progress',
      value: `${stats.averagePathProgress}%`,
      subtitle: `${stats.activePaths} active paths`,
      icon: Target,
      color: 'from-green-400 to-emerald-500',
      trend: `${stats.completedPaths} completed`
    },
    {
      title: 'Next Level In',
      value: `${stats.daysToNextLevel} days`,
      subtitle: `At current pace`,
      icon: TrendingUp,
      color: 'from-cyan-400 to-teal-500',
      trend: `Mastery: ${stats.estimatedMasteryDate}`
    }
  ];

  // Weekly activity heatmap data
  const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const activityData = weekDays.map((day, index) => ({
    day,
    lessons: Math.floor(Math.random() * 5), // This would be real data
    intensity: Math.random()
  }));

  // Progress distribution
  const progressDistribution = [
    { category: 'The Self', progress: pathProgress['the-self'] || 0, color: 'bg-purple-500' },
    { category: 'Inward Journey', progress: pathProgress['inward-journey'] || 0, color: 'bg-indigo-500' },
    { category: 'Energy Bodies', progress: pathProgress['energy-bodies'] || 0, color: 'bg-blue-500' },
    { category: 'Self Relating', progress: pathProgress['self-relating'] || 0, color: 'bg-green-500' },
    { category: 'Doing', progress: pathProgress['doing'] || 0, color: 'bg-yellow-500' },
    { category: 'Life', progress: pathProgress['life'] || 0, color: 'bg-red-500' }
  ];

  return (
    <div className="space-y-6">
      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.02 }}
            className="bg-purple-900/30 backdrop-blur-sm rounded-xl p-6 border border-purple-500/30"
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`p-3 rounded-lg bg-gradient-to-br ${stat.color}`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <span className="text-xs text-purple-400">{stat.trend}</span>
            </div>
            <h3 className="text-3xl font-bold text-white mb-1">{stat.value}</h3>
            <p className="text-purple-300 text-sm">{stat.title}</p>
            <p className="text-purple-400 text-xs mt-1">{stat.subtitle}</p>
          </motion.div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Activity Heatmap */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-purple-900/30 backdrop-blur-sm rounded-xl p-6 border border-purple-500/30"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-white">Weekly Activity</h3>
            <Activity className="w-5 h-5 text-purple-400" />
          </div>
          
          <div className="space-y-3">
            {activityData.map((day, index) => (
              <div key={day.day} className="flex items-center gap-3">
                <span className="text-purple-300 text-sm w-10">{day.day}</span>
                <div className="flex-1 h-8 bg-purple-900/50 rounded-lg overflow-hidden relative">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${day.intensity * 100}%` }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                    className={`h-full bg-gradient-to-r from-purple-500 to-pink-500`}
                    style={{ opacity: 0.3 + day.intensity * 0.7 }}
                  />
                  <span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-xs text-white">
                    {day.lessons} lessons
                  </span>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-4 pt-4 border-t border-purple-500/20">
            <div className="flex justify-between text-sm">
              <span className="text-purple-400">Most active day</span>
              <span className="text-white font-semibold">Wednesday</span>
            </div>
            <div className="flex justify-between text-sm mt-2">
              <span className="text-purple-400">Least active day</span>
              <span className="text-white font-semibold">Sunday</span>
            </div>
          </div>
        </motion.div>

        {/* Path Progress Distribution */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-purple-900/30 backdrop-blur-sm rounded-xl p-6 border border-purple-500/30"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-white">Path Distribution</h3>
            <PieChart className="w-5 h-5 text-purple-400" />
          </div>
          
          <div className="space-y-3">
            {progressDistribution.map((path, index) => (
              <div key={path.category}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-purple-300">{path.category}</span>
                  <span className="text-white font-semibold">{path.progress}%</span>
                </div>
                <div className="h-2 bg-purple-900/50 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${path.progress}%` }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                    className={path.color}
                  />
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-4 pt-4 border-t border-purple-500/20">
            <div className="flex justify-between text-sm">
              <span className="text-purple-400">Focus recommendation</span>
              <span className="text-yellow-400 font-semibold">Energy Bodies</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Milestones & Predictions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-purple-900/30 to-indigo-900/30 backdrop-blur-sm rounded-xl p-6 border border-purple-500/30"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-white">Milestones & Predictions</h3>
          <BarChart3 className="w-5 h-5 text-purple-400" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-purple-900/30 rounded-lg">
            <Award className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
            <p className="text-white font-bold text-lg">Level {userLevel + 1}</p>
            <p className="text-purple-300 text-sm">in {stats.daysToNextLevel} days</p>
          </div>
          
          <div className="text-center p-4 bg-purple-900/30 rounded-lg">
            <Target className="w-8 h-8 text-green-400 mx-auto mb-2" />
            <p className="text-white font-bold text-lg">Path Master</p>
            <p className="text-purple-300 text-sm">Complete all 6 paths</p>
          </div>
          
          <div className="text-center p-4 bg-purple-900/30 rounded-lg">
            <Trophy className="w-8 h-8 text-purple-400 mx-auto mb-2" />
            <p className="text-white font-bold text-lg">Enlightenment</p>
            <p className="text-purple-300 text-sm">{stats.estimatedMasteryDate}</p>
          </div>
        </div>
        
        <div className="mt-4 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
          <p className="text-yellow-300 text-sm">
            💡 <span className="font-semibold">Pro tip:</span> Maintain your daily streak to reach Level {userLevel + 1} faster!
            At your current pace, you'll unlock all achievements in {Math.ceil((5000 - totalXP) / stats.xpPerDay)} days.
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default StatsDashboard;