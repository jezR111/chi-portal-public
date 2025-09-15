// src/features/yin/components/apps/habits/HabitTracker.tsx
'use client';

import {
  BarChart3,
  Book, Brain, Calendar, ChevronLeft, ChevronRight,
  Droplets, Dumbbell, Edit2, Heart, LayoutGrid, Moon, Music,
  PenTool, Plus, Smile, TrendingUp, Users
} from 'lucide-react';
import { useEffect, useState } from 'react';
import CalendarView from './CalendarView';
import DayDetailModal from './DayDetailModal';
import EditHabitModal from './EditHabitModal';
import HabitSelector from './HabitSelector';
import InsightsPanel from './InsightsPanel';
import { Habit, HabitData, HabitPreset, HabitStatus, ViewMode } from './types';
import { calculateStreak, formatDateKey, getHabitColor } from './utils';

// Predefined habit presets
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

interface HabitTrackerProps {
  onDataUpdate?: (data: { habits: Habit[]; data: HabitData }) => void;
  initialData?: {
    habits?: Habit[];
    data?: HabitData;
  } | null;
}

export default function HabitTracker({ 
  onDataUpdate,
  initialData = null 
}: HabitTrackerProps) {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [habitData, setHabitData] = useState<HabitData>({});
  const [selectedHabit, setSelectedHabit] = useState<'all' | number>('all');
  const [viewMode, setViewMode] = useState<ViewMode>('month');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);
  const [showAddHabit, setShowAddHabit] = useState(false);
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [isNewHabit, setIsNewHabit] = useState(false);

  // Initialize data
  useEffect(() => {
    if (initialData) {
      setHabits(initialData.habits || []);
      setHabitData(initialData.data || {});
    } else {
      // Default habits
      setHabits([
        { id: 1, ...HABIT_PRESETS.meditation, active: true },
        { id: 2, ...HABIT_PRESETS.journaling, active: true },
        { id: 3, ...HABIT_PRESETS.exercise, active: true }
      ]);
    }
  }, [initialData]);

  // Calculate completion rate
  const getCompletionRate = () => {
    const today = new Date();
    const totalPossible = habits.length;
    let completed = 0;
    
    habits.forEach(habit => {
      const dateKey = formatDateKey(today);
      const status = habitData[`${habit.id}-${dateKey}`];
      if (status === 'completed') completed++;
      else if (status === 'partial') completed += 0.5;
    });
    
    return totalPossible > 0 ? Math.round((completed / totalPossible) * 100) : 0;
  };

  // Get max streak
  const getMaxStreak = () => {
    let maxStreak = 0;
    habits.forEach(habit => {
      const streak = calculateStreak(habit.id, habitData);
      maxStreak = Math.max(maxStreak, streak.current);
    });
    return maxStreak;
  };

  // Handle status change
  const handleStatusChange = (habitId: number, date: Date, status: HabitStatus | undefined) => {
    const dateKey = formatDateKey(date);
    const key = `${habitId}-${dateKey}`;
    
    setHabitData(prev => {
      const newData = { ...prev };
      if (status === undefined) {
        delete newData[key];
      } else {
        newData[key] = status;
      }
      
      onDataUpdate?.({ habits, data: newData });
      return newData;
    });
  };

  // Handle day modal status change
  const handleDayModalStatusChange = (habitId: number, status: HabitStatus | undefined) => {
    if (!selectedDay) return;
    handleStatusChange(habitId, selectedDay, status);
  };

  // Open new habit modal
  const openNewHabitModal = () => {
    setEditingHabit(null);
    setIsNewHabit(true);
    setShowEditModal(true);
  };

  // Save habit
  const saveHabit = (updatedHabit: Partial<Habit>) => {
    if (isNewHabit) {
      const newHabit = updatedHabit as Habit;
      const newHabits = [...habits, newHabit];
      setHabits(newHabits);
      onDataUpdate?.({ habits: newHabits, data: habitData });
    } else {
      const newHabits = habits.map(h => 
        h.id === updatedHabit.id ? { ...h, ...updatedHabit } : h
      );
      setHabits(newHabits);
      onDataUpdate?.({ habits: newHabits, data: habitData });
    }
    setShowEditModal(false);
  };

  // Delete habit
  const deleteHabit = (habitId: number) => {
    const newHabits = habits.filter(h => h.id !== habitId);
    setHabits(newHabits);
    
    // Clean up data
    const newData = { ...habitData };
    Object.keys(newData).forEach(key => {
      if (key.startsWith(`${habitId}-`)) {
        delete newData[key];
      }
    });
    setHabitData(newData);
    onDataUpdate?.({ habits: newHabits, data: newData });
  };

  // Navigation
  const navigateMonth = (direction: number) => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + direction));
  };

  const navigateWeek = (direction: number) => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + (direction * 7));
    setCurrentDate(newDate);
  };

  return (
    <div className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white mb-1">Habit Tracker</h2>
          <p className="text-gray-400 text-sm">Build consistency, transform your life</p>
        </div>
        
        {/* Stats */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-green-500/20 px-3 py-1 rounded-full">
            <TrendingUp className="w-4 h-4 text-green-400" />
            <span className="text-sm font-medium text-green-400">{getCompletionRate()}%</span>
          </div>
          <div className="flex items-center gap-2 bg-orange-500/20 px-3 py-1 rounded-full">
            <span className="text-sm font-medium text-orange-400">
              {getMaxStreak()} 🔥
            </span>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between mb-6">
        {/* View Toggle */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode('month')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              viewMode === 'month' 
                ? 'bg-purple-500/20 text-purple-400' 
                : 'bg-white/5 text-gray-400 hover:bg-white/10'
            }`}
          >
            <Calendar className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('week')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              viewMode === 'week' 
                ? 'bg-purple-500/20 text-purple-400' 
                : 'bg-white/5 text-gray-400 hover:bg-white/10'
            }`}
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('insights')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              viewMode === 'insights' 
                ? 'bg-purple-500/20 text-purple-400' 
                : 'bg-white/5 text-gray-400 hover:bg-white/10'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('manage' as ViewMode)}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              viewMode === 'manage' 
                ? 'bg-purple-500/20 text-purple-400' 
                : 'bg-white/5 text-gray-400 hover:bg-white/10'
            }`}
          >
            <Edit2 className="w-4 h-4" />
          </button>
        </div>

        {/* Habit Selector */}
        {(viewMode === 'month' || viewMode === 'week') && (
          <div className="relative">
            <HabitSelector
              habits={habits}
              selectedHabit={selectedHabit}
              onSelect={setSelectedHabit}
            />
          </div>
        )}
      </div>

      {/* Navigation */}
      {(viewMode === 'month' || viewMode === 'week') && (
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => viewMode === 'week' ? navigateWeek(-1) : navigateMonth(-1)}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-gray-400" />
          </button>
          
          <h3 className="text-lg font-semibold text-white">
            {viewMode === 'week' 
              ? `Week of ${currentDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`
              : currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
            }
          </h3>
          
          <button
            onClick={() => viewMode === 'week' ? navigateWeek(1) : navigateMonth(1)}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </button>
        </div>
      )}

      {/* Main Content */}
      {viewMode === 'manage' ? (
        <div className="space-y-3">
          <p className="text-sm text-gray-400 mb-4">
            Click on any habit to edit or delete it
          </p>
          
          {habits.map(habit => {
            const colors = getHabitColor(habit.color);
            const HabitIcon = habit.icon;
            
            return (
              <button
                key={habit.id}
                onClick={() => {
                  setEditingHabit(habit);
                  setIsNewHabit(false);
                  setShowEditModal(true);
                }}
                className="w-full flex items-center justify-between p-4 bg-white/5 
                           hover:bg-white/10 rounded-xl transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${colors.bg}`}>
                    <HabitIcon className={`w-5 h-5 ${colors.text}`} />
                  </div>
                  <div className="text-left">
                    <p className="text-white font-medium">{habit.label}</p>
                    {habit.notes && (
                      <p className="text-xs text-gray-400">{habit.notes}</p>
                    )}
                  </div>
                </div>
                
                <Edit2 className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 
                                 transition-opacity" />
              </button>
            );
          })}
          
          <button
            onClick={openNewHabitModal}
            className="w-full py-3 border-2 border-dashed border-white/20 rounded-xl 
                       text-gray-400 hover:border-white/40 hover:text-white transition-all 
                       flex items-center justify-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Add Custom Habit
          </button>
        </div>
      ) : viewMode === 'insights' ? (
        <InsightsPanel habits={habits} habitData={habitData} />
      ) : (
        <CalendarView
          habits={habits}
          habitData={habitData}
          selectedHabit={selectedHabit}
          viewMode={viewMode}
          currentDate={currentDate}
          onDayClick={setSelectedDay}
          onStatusChange={handleStatusChange}
        />
      )}

      {/* Add Habit Button - only show when not in manage mode */}
      {viewMode !== 'manage' && (
        <button
          onClick={openNewHabitModal}
          className="mt-6 w-full py-3 border-2 border-dashed border-white/20 rounded-xl 
                     text-gray-400 hover:border-white/40 hover:text-white transition-all 
                     flex items-center justify-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Create Custom Habit
        </button>
      )}

      {/* Edit Habit Modal */}
      {showEditModal && (
        <EditHabitModal
          habit={editingHabit}
          isNew={isNewHabit}
          onSave={saveHabit}
          onDelete={deleteHabit}
          onClose={() => {
            setShowEditModal(false);
            setEditingHabit(null);
            setIsNewHabit(false);
          }}
        />
      )}

      {/* Day Detail Modal */}
      {selectedDay && (
        <DayDetailModal
          date={selectedDay}
          habits={habits}
          habitData={habitData}
          onClose={() => setSelectedDay(null)}
          onStatusChange={handleDayModalStatusChange}
        />
      )}
    </div>
  );
}