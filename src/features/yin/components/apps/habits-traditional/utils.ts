// src/features/yin/components/apps/habits/utils.ts

import { Habit, HabitData, HabitStats, HabitStatus, Streak } from './types';

export const formatDateKey = (date: Date): string => {
  return `${date.getFullYear()}-${(date.getMonth() + 1)
    .toString()
    .padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
};

export const parseStatus = (status?: string): HabitStatus | undefined => {
  if (!status) return undefined;
  return status as HabitStatus;
};

export const calculateStreak = (
  habitId: number,
  habitData: HabitData
): Streak => {
  let currentStreak = 0;
  let maxStreak = 0;
  let tempStreak = 0;
  let lastCompleted: Date | undefined;
  const today = new Date();
  
  // Check last 365 days for max streak
  for (let i = 365; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateKey = formatDateKey(date);
    const status = parseStatus(habitData[`${habitId}-${dateKey}`]);
    
    if (status === 'completed' || status === 'partial') {
      tempStreak++;
      if (!lastCompleted || date > lastCompleted) {
        lastCompleted = date;
      }
      maxStreak = Math.max(maxStreak, tempStreak);
    } else if (i < 365) { // Don't break on today
      tempStreak = 0;
    }
  }
  
  // Calculate current streak from today backwards
  for (let i = 0; i <= 365; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateKey = formatDateKey(date);
    const status = parseStatus(habitData[`${habitId}-${dateKey}`]);
    
    if (status === 'completed' || status === 'partial') {
      currentStreak++;
    } else if (i > 0) { // Allow today to be empty
      break;
    }
  }
  
  return { current: currentStreak, max: maxStreak, lastCompleted };
};

export const calculateStats = (
  habit: Habit,
  habitData: HabitData,
  days: number = 30
): HabitStats => {
  const today = new Date();
  let completed = 0;
  let missed = 0;
  const dayStats: Record<string, number> = {
    Mon: 0, Tue: 0, Wed: 0, Thu: 0, Fri: 0, Sat: 0, Sun: 0
  };
  
  for (let i = 0; i < days; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateKey = formatDateKey(date);
    const status = parseStatus(habitData[`${habit.id}-${dateKey}`]);
    
    if (status === 'completed') {
      completed++;
      const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
      dayStats[dayName]++;
    } else if (status === 'missed') {
      missed++;
    }
  }
  
  const bestDay = Object.entries(dayStats).reduce((a, b) => 
    dayStats[a[0]] > dayStats[b[0]] ? a : b
  )[0];
  
  const worstDay = Object.entries(dayStats).reduce((a, b) => 
    dayStats[a[0]] < dayStats[b[0]] ? a : b
  )[0];
  
  return {
    completionRate: days > 0 ? Math.round((completed / days) * 100) : 0,
    totalCompleted: completed,
    totalMissed: missed,
    bestDay,
    worstDay,
    averagePerWeek: Math.round((completed / (days / 7)) * 10) / 10
  };
};

export const getHabitColor = (color: string): { bg: string; text: string; dot: string } => {
  const colors: Record<string, { bg: string; text: string; dot: string }> = {
    purple: {
      bg: 'bg-purple-500/20',
      text: 'text-purple-400',
      dot: 'bg-purple-500'
    },
    blue: {
      bg: 'bg-blue-500/20',
      text: 'text-blue-400',
      dot: 'bg-blue-500'
    },
    green: {
      bg: 'bg-green-500/20',
      text: 'text-green-400',
      dot: 'bg-green-500'
    },
    amber: {
      bg: 'bg-amber-500/20',
      text: 'text-amber-400',
      dot: 'bg-amber-500'
    },
    cyan: {
      bg: 'bg-cyan-500/20',
      text: 'text-cyan-400',
      dot: 'bg-cyan-500'
    },
    indigo: {
      bg: 'bg-indigo-500/20',
      text: 'text-indigo-400',
      dot: 'bg-indigo-500'
    },
    pink: {
      bg: 'bg-pink-500/20',
      text: 'text-pink-400',
      dot: 'bg-pink-500'
    },
    rose: {
      bg: 'bg-rose-500/20',
      text: 'text-rose-400',
      dot: 'bg-rose-500'
    },
    orange: {
      bg: 'bg-orange-500/20',
      text: 'text-orange-400',
      dot: 'bg-orange-500'
    },
    teal: {
      bg: 'bg-teal-500/20',
      text: 'text-teal-400',
      dot: 'bg-teal-500'
    }
  };
  
  return colors[color] || colors.purple;
};

export const getDaysInMonth = (date: Date): Date[] => {
  const year = date.getFullYear();
  const month = date.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const days: Date[] = [];
  
  // Add padding days from previous month
  const startPadding = firstDay.getDay();
  for (let i = startPadding - 1; i >= 0; i--) {
    days.push(new Date(year, month, -i));
  }
  
  // Add days of current month
  for (let i = 1; i <= lastDay.getDate(); i++) {
    days.push(new Date(year, month, i));
  }
  
  // Add padding days from next month to complete grid
  const endPadding = 42 - days.length; // 6 weeks * 7 days
  for (let i = 1; i <= endPadding; i++) {
    days.push(new Date(year, month + 1, i));
  }
  
  return days;
};

export const getWeekDays = (date: Date): Date[] => {
  const days: Date[] = [];
  const startOfWeek = new Date(date);
  const day = startOfWeek.getDay();
  const diff = startOfWeek.getDate() - day;
  startOfWeek.setDate(diff);
  
  for (let i = 0; i < 7; i++) {
    const day = new Date(startOfWeek);
    day.setDate(startOfWeek.getDate() + i);
    days.push(day);
  }
  
  return days;
};