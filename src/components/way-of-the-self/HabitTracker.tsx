// src/components/way-of-the-self/HabitTracker.tsx
'use client';

import {
  Book,
  Brain,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Circle,
  Droplets,
  Dumbbell,
  Flame,
  Heart,
  LucideIcon,
  MinusCircle,
  Moon,
  Music,
  PenTool,
  Plus,
  Smile,
  TrendingUp,
  Users,
  XCircle
} from 'lucide-react';
import { useEffect, useState } from 'react';

// Interfaces
interface HabitPreset {
  icon: LucideIcon;
  color: string;
  label: string;
}

interface Habit extends HabitPreset {
  id: number;
  active: boolean;
  createdAt?: string;
}

interface HabitData {
  [key: string]: string | undefined;
}

interface Streak {
  current: number;
  max: number;
}

interface DayData {
  date: Date;
  isCurrentMonth: boolean;
}

interface HabitTrackerProps {
  onDataUpdate?: (data: { habits: Habit[]; data: HabitData }) => void;
  initialData?: {
    habits?: Habit[];
    data?: HabitData;
  } | null;
}

// Predefined habit icons and colors
const HABIT_PRESETS: Record<string, HabitPreset> = {
  meditation: { icon: Brain, color: 'purple', label: 'Meditate' },
  journaling: { icon: PenTool, color: 'blue', label: 'Journal' },
  exercise: { icon: Dumbbell, color: 'green', label: 'Exercise' },
  reading: { icon: Book, color: 'amber', label: 'Read' },
  water: { icon: Droplets, color: 'cyan', label: 'Hydrate' },
  sleep: { icon: Moon, color: 'indigo', label: 'Sleep 8hrs' },
  gratitude: { icon: Heart, color: 'pink', label: 'Gratitude' },
  connect: { icon: Users, color: 'rose', label: 'Connect' },
  creative: { icon: Music, color: 'orange', label: 'Create' },
  mindful: { icon: Smile, color: 'teal', label: 'Mindful Moment' }
};

// Bullet journal style markers
const MARKER_STATES = {
  empty: { icon: Circle, color: 'text-gray-400' },
  completed: { icon: CheckCircle, color: 'text-green-400' },
  missed: { icon: XCircle, color: 'text-red-400' },
  partial: { icon: MinusCircle, color: 'text-yellow-400' },
  migrated: { icon: ChevronRight, color: 'text-blue-400' }
};

// Color mapping for dynamic classes
const COLOR_CLASSES = {
  purple: {
    bg: 'bg-purple-500/20',
    text: 'text-purple-400'
  },
  blue: {
    bg: 'bg-blue-500/20',
    text: 'text-blue-400'
  },
  green: {
    bg: 'bg-green-500/20',
    text: 'text-green-400'
  },
  amber: {
    bg: 'bg-amber-500/20',
    text: 'text-amber-400'
  },
  cyan: {
    bg: 'bg-cyan-500/20',
    text: 'text-cyan-400'
  },
  indigo: {
    bg: 'bg-indigo-500/20',
    text: 'text-indigo-400'
  },
  pink: {
    bg: 'bg-pink-500/20',
    text: 'text-pink-400'
  },
  rose: {
    bg: 'bg-rose-500/20',
    text: 'text-rose-400'
  },
  orange: {
    bg: 'bg-orange-500/20',
    text: 'text-orange-400'
  },
  teal: {
    bg: 'bg-teal-500/20',
    text: 'text-teal-400'
  }
};

export default function HabitTracker({ 
  onDataUpdate,
  initialData = null 
}: HabitTrackerProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [habits, setHabits] = useState<Habit[]>([]);
  const [habitData, setHabitData] = useState<HabitData>({});
  const [showAddHabit, setShowAddHabit] = useState(false);
  const [selectedHabit, setSelectedHabit] = useState<Habit | null>(null);
  const [viewMode, setViewMode] = useState('month'); // month, week, year
  const [streaks, setStreaks] = useState<Record<number, Streak>>({});
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);

  // Initialize with default habits or load saved data
  useEffect(() => {
    if (initialData) {
      setHabits(initialData.habits || []);
      setHabitData(initialData.data || {});
    } else {
      // Default habits for new users
      setHabits([
        { id: 1, ...HABIT_PRESETS.meditation, active: true },
        { id: 2, ...HABIT_PRESETS.journaling, active: true },
        { id: 3, ...HABIT_PRESETS.exercise, active: true }
      ]);
    }
  }, [initialData]);

  // Calculate streaks
  useEffect(() => {
    calculateStreaks();
  }, [habitData, habits]);

  const calculateStreaks = () => {
    const newStreaks: Record<number, Streak> = {};
    habits.forEach(habit => {
      let currentStreak = 0;
      let maxStreak = 0;
      const today = new Date();
      
      for (let i = 30; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        const dateKey = formatDateKey(date);
        
        if (habitData[`${habit.id}-${dateKey}`] === 'completed') {
          currentStreak++;
          maxStreak = Math.max(maxStreak, currentStreak);
        } else if (i < 30) { // Don't break streak for today
          currentStreak = 0;
        }
      }
      
      newStreaks[habit.id] = { current: currentStreak, max: maxStreak };
    });
    setStreaks(newStreaks);
  };

  const formatDateKey = (date: Date) => {
    return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
  };

  const getDaysInMonth = (): DayData[] => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const days: DayData[] = [];
    
    // Add padding days from previous month
    const startPadding = firstDay.getDay();
    for (let i = startPadding - 1; i >= 0; i--) {
      const paddingDate = new Date(year, month, -i);
      days.push({ date: paddingDate, isCurrentMonth: false });
    }
    
    // Add days of current month
    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push({ date: new Date(year, month, i), isCurrentMonth: true });
    }
    
    // Add padding days from next month
    const endPadding = 42 - days.length; // 6 weeks * 7 days
    for (let i = 1; i <= endPadding; i++) {
      days.push({ date: new Date(year, month + 1, i), isCurrentMonth: false });
    }
    
    return days;
  };

  const toggleHabitDay = (habitId: number, date: Date, currentState: string) => {
    const dateKey = formatDateKey(date);
    const key = `${habitId}-${dateKey}`;
    
    // Cycle through states: empty -> completed -> partial -> missed -> empty
    const stateOrder = ['empty', 'completed', 'partial', 'missed'];
    const currentIndex = stateOrder.indexOf(currentState || 'empty');
    const nextState = stateOrder[(currentIndex + 1) % stateOrder.length];
    
    setHabitData(prev => ({
      ...prev,
      [key]: nextState === 'empty' ? undefined : nextState
    }));
    
    // Notify parent component
    onDataUpdate?.({ habits, data: { ...habitData, [key]: nextState === 'empty' ? undefined : nextState } });
  };

  const addHabit = (preset: string) => {
    const newHabit: Habit = {
      id: Date.now(),
      ...HABIT_PRESETS[preset],
      active: true,
      createdAt: new Date().toISOString()
    };
    setHabits(prev => [...prev, newHabit]);
    setShowAddHabit(false);
  };

  const deleteHabit = (habitId: number) => {
    setHabits(prev => prev.filter(h => h.id !== habitId));
    // Clean up data for this habit
    const newData = { ...habitData };
    Object.keys(newData).forEach(key => {
      if (key.startsWith(`${habitId}-`)) {
        delete newData[key];
      }
    });
    setHabitData(newData);
  };

  const getHabitState = (habitId: number, date: Date): string => {
    const dateKey = formatDateKey(date);
    return habitData[`${habitId}-${dateKey}`] || 'empty';
  };

  const getCompletionRate = () => {
    const today = new Date();
    const totalPossible = habits.length;
    let completed = 0;
    
    habits.forEach(habit => {
      const state = getHabitState(habit.id, today);
      if (state === 'completed') completed++;
      else if (state === 'partial') completed += 0.5;
    });
    
    return totalPossible > 0 ? Math.round((completed / totalPossible) * 100) : 0;
  };

  const getColorClasses = (color: string) => {
    return COLOR_CLASSES[color as keyof typeof COLOR_CLASSES] || COLOR_CLASSES.purple;
  };

  const days = getDaysInMonth();
  const today = new Date();
  const todayKey = formatDateKey(today);

  return (
    <div className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white mb-1">Habit Tracker</h2>
          <p className="text-gray-400 text-sm">Build consistency, transform your life</p>
        </div>
        
        <div className="flex items-center gap-4">
          {/* Stats */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-green-500/20 px-3 py-1 rounded-full">
              <TrendingUp className="w-4 h-4 text-green-400" />
              <span className="text-sm font-medium text-green-400">{getCompletionRate()}%</span>
            </div>
            <div className="flex items-center gap-2 bg-orange-500/20 px-3 py-1 rounded-full">
              <Flame className="w-4 h-4 text-orange-400" />
              <span className="text-sm font-medium text-orange-400">
                {Math.max(...Object.values(streaks).map(s => s.current || 0), 0)} day streak
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Month Navigation */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
          className="p-2 hover:bg-white/10 rounded-lg transition-colors"
        >
          <ChevronLeft className="w-5 h-5 text-gray-400" />
        </button>
        
        <h3 className="text-lg font-semibold text-white">
          {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
        </h3>
        
        <button
          onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
          className="p-2 hover:bg-white/10 rounded-lg transition-colors"
        >
          <ChevronRight className="w-5 h-5 text-gray-400" />
        </button>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-4 mb-4 text-xs">
        {Object.entries(MARKER_STATES).map(([state, config]) => (
          <div key={state} className="flex items-center gap-1">
            <config.icon className={`w-4 h-4 ${config.color}`} />
            <span className="text-gray-400 capitalize">{state}</span>
          </div>
        ))}
      </div>

      {/* Grid Container - Scrollable on mobile */}
      <div className="overflow-x-auto -mx-6 px-6">
        <div className="min-w-[600px]">
          {/* Days of Week Header */}
          <div className="grid grid-cols-[120px_repeat(7,1fr)] gap-1 mb-2">
            <div /> {/* Empty corner */}
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="text-center text-xs text-gray-400 font-medium">
                {day}
              </div>
            ))}
          </div>

          {/* Habits Grid */}
          <div className="space-y-2">
            {habits.map(habit => {
              const HabitIcon = habit.icon;
              const streak = streaks[habit.id] || { current: 0, max: 0 };
              const colorClasses = getColorClasses(habit.color);
              
              return (
                <div key={habit.id} className="group">
                  <div className="grid grid-cols-[120px_repeat(7,1fr)] gap-1 items-center">
                    {/* Habit Label */}
                    <div className="flex items-center gap-2 pr-2">
                      <div className={`p-1.5 rounded-lg ${colorClasses.bg}`}>
                        <HabitIcon className={`w-4 h-4 ${colorClasses.text}`} />
                      </div>
                      <span className="text-sm text-white truncate">{habit.label}</span>
                      {streak.current > 0 && (
                        <span className="text-xs text-orange-400 font-medium">
                          {streak.current}🔥
                        </span>
                      )}
                    </div>
                    
                    {/* Calendar Grid */}
                    <div className="grid grid-cols-7 gap-1 col-span-7">
                      {days.map((day, index) => {
                        const state = getHabitState(habit.id, day.date);
                        const StateIcon = MARKER_STATES[state as keyof typeof MARKER_STATES]?.icon || MARKER_STATES.empty.icon;
                        const stateColor = MARKER_STATES[state as keyof typeof MARKER_STATES]?.color || MARKER_STATES.empty.color;
                        const isToday = formatDateKey(day.date) === todayKey;
                        const isPast = day.date < today;
                        
                        return (
                          <button
                            key={index}
                            onClick={() => day.isCurrentMonth && toggleHabitDay(habit.id, day.date, state)}
                            disabled={!day.isCurrentMonth}
                            className={`
                              aspect-square flex items-center justify-center rounded-lg transition-all
                              ${day.isCurrentMonth 
                                ? 'hover:bg-white/10 cursor-pointer' 
                                : 'opacity-20 cursor-not-allowed'
                              }
                              ${isToday ? 'ring-2 ring-purple-400 ring-offset-1 ring-offset-transparent' : ''}
                            `}
                          >
                            <StateIcon className={`w-5 h-5 ${stateColor}`} />
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Add Habit Button */}
          <button
            onClick={() => setShowAddHabit(true)}
            className="mt-4 w-full py-3 border-2 border-dashed border-white/20 rounded-xl text-gray-400 hover:border-white/40 hover:text-white transition-all flex items-center justify-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Add New Habit
          </button>
        </div>
      </div>

      {/* Add Habit Modal */}
      {showAddHabit && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-gradient-to-br from-gray-900 to-purple-900 rounded-2xl p-6 max-w-md w-full border border-white/20">
            <h3 className="text-xl font-semibold text-white mb-4">Choose a Habit</h3>
            
            <div className="grid grid-cols-2 gap-3">
              {Object.entries(HABIT_PRESETS).map(([key, preset]) => {
                const Icon = preset.icon;
                const isExisting = habits.some(h => h.label === preset.label);
                const colorClasses = getColorClasses(preset.color);
                
                return (
                  <button
                    key={key}
                    onClick={() => !isExisting && addHabit(key)}
                    disabled={isExisting}
                    className={`
                      flex items-center gap-3 p-3 rounded-xl transition-all
                      ${isExisting 
                        ? 'bg-gray-800/50 opacity-50 cursor-not-allowed' 
                        : 'bg-white/10 hover:bg-white/20 cursor-pointer'
                      }
                    `}
                  >
                    <div className={`p-2 rounded-lg ${colorClasses.bg}`}>
                      <Icon className={`w-5 h-5 ${colorClasses.text}`} />
                    </div>
                    <span className="text-white text-sm">{preset.label}</span>
                  </button>
                );
              })}
            </div>
            
            <button
              onClick={() => setShowAddHabit(false)}
              className="mt-4 w-full py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
