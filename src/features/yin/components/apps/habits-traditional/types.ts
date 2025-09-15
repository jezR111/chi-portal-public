// src/features/yin/components/apps/habits/types.ts

import { LucideIcon } from 'lucide-react';

export interface HabitPreset {
  icon: LucideIcon;
  color: string;
  label: string;
}

export interface Habit extends HabitPreset {
  id: number;
  active: boolean;
  createdAt?: string;
  category?: 'mindfulness' | 'physical' | 'creative' | 'social' | 'growth';
  notes?: string;
}

export interface HabitData {
  [key: string]: HabitStatus | undefined;
}

export type HabitStatus = 'completed' | 'partial' | 'missed' | 'skip';

export interface DayData {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  isFuture: boolean;
}

export interface Streak {
  current: number;
  max: number;
  lastCompleted?: Date;
}

export interface HabitStats {
  completionRate: number;
  totalCompleted: number;
  totalMissed: number;
  bestDay: string;
  worstDay: string;
  averagePerWeek: number;
}

export interface HabitInsight {
  habitId: number;
  bestTime?: string;
  correlations: Array<{
    habitId: number;
    strength: number;
  }>;
  streakRisk: boolean;
  suggestion?: string;
}

export type ViewMode = 'month' | 'week' | 'insights' | 'manage';
export type CalendarMode = 'single' | 'multi';