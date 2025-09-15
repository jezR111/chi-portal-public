// src/features/yin/components/apps/habits/InsightsPanel.tsx

'use client';

import { AlertTriangle, Award, Sparkles, TrendingUp } from 'lucide-react';
import { Habit, HabitData } from './types';
import { calculateStats, calculateStreak, getHabitColor } from './utils';

interface InsightsPanelProps {
  habits: Habit[];
  habitData: HabitData;
}

export default function InsightsPanel({ habits, habitData }: InsightsPanelProps) {
  const insights = habits.map(habit => {
    const streak = calculateStreak(habit.id, habitData);
    const stats = calculateStats(habit, habitData);
    const colors = getHabitColor(habit.color);
    
    return { habit, streak, stats, colors };
  });

  const topPerformer = insights.reduce((best, current) => 
    current.stats.completionRate > best.stats.completionRate ? current : best
  );

  const streakChampion = insights.reduce((best, current) => 
    current.streak.current > best.streak.current ? current : best
  );

  const atRisk = insights.filter(i => 
    i.streak.current > 0 && i.streak.current < 3 && i.stats.completionRate < 50
  );

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Top Performer */}
        <div className="bg-gradient-to-br from-green-500/20 to-green-600/10 rounded-xl p-4 border border-green-500/20">
          <div className="flex items-center gap-2 mb-2">
            <Award className="w-5 h-5 text-green-400" />
            <span className="text-sm text-green-400 font-medium">Top Performer</span>
          </div>
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${topPerformer.colors.bg}`}>
              <topPerformer.habit.icon className={`w-5 h-5 ${topPerformer.colors.text}`} />
            </div>
            <div>
              <p className="text-white font-medium">{topPerformer.habit.label}</p>
              <p className="text-sm text-gray-400">{topPerformer.stats.completionRate}% completion</p>
            </div>
          </div>
        </div>

        {/* Streak Champion */}
        <div className="bg-gradient-to-br from-orange-500/20 to-orange-600/10 rounded-xl p-4 border border-orange-500/20">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-5 h-5 text-orange-400" />
            <span className="text-sm text-orange-400 font-medium">Longest Streak</span>
          </div>
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${streakChampion.colors.bg}`}>
              <streakChampion.habit.icon className={`w-5 h-5 ${streakChampion.colors.text}`} />
            </div>
            <div>
              <p className="text-white font-medium">{streakChampion.habit.label}</p>
              <p className="text-sm text-gray-400">{streakChampion.streak.current} days 🔥</p>
            </div>
          </div>
        </div>

        {/* At Risk */}
        {atRisk.length > 0 && (
          <div className="bg-gradient-to-br from-red-500/20 to-red-600/10 rounded-xl p-4 border border-red-500/20">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="w-5 h-5 text-red-400" />
              <span className="text-sm text-red-400 font-medium">Needs Attention</span>
            </div>
            <div className="space-y-1">
              {atRisk.slice(0, 2).map(item => (
                <p key={item.habit.id} className="text-sm text-white">
                  {item.habit.label}
                </p>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Detailed Stats */}
      <div className="space-y-3">
        <h4 className="text-white font-medium flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-purple-400" />
          Habit Performance
        </h4>
        
        {insights.map(({ habit, streak, stats, colors }) => (
          <div key={habit.id} className="bg-white/5 rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${colors.bg}`}>
                  <habit.icon className={`w-5 h-5 ${colors.text}`} />
                </div>
                <div>
                  <p className="text-white font-medium">{habit.label}</p>
                  <p className="text-xs text-gray-400">
                    Best on {stats.bestDay}s • {stats.averagePerWeek} times/week
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-white">{stats.completionRate}%</p>
                <p className="text-xs text-gray-400">
                  {streak.current > 0 ? `${streak.current} day streak` : 'No streak'}
                </p>
              </div>
            </div>
            
            {/* Progress Bar */}
            <div className="w-full bg-gray-800 rounded-full h-2 overflow-hidden">
              <div
                className={`h-full ${colors.dot} transition-all duration-500`}
                style={{ width: `${stats.completionRate}%` }}
              />
            </div>
            
            {/* Quick Stats */}
            <div className="flex justify-between mt-3 text-xs">
              <span className="text-green-400">✓ {stats.totalCompleted} completed</span>
              <span className="text-red-400">✗ {stats.totalMissed} missed</span>
              <span className="text-orange-400">🏆 Max {streak.max} days</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}