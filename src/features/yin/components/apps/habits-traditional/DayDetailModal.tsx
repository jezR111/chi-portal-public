// src/features/yin/components/apps/habits/DayDetailModal.tsx

'use client';

import { Ban, Calendar, CheckCircle, Circle, MinusCircle, X, XCircle } from 'lucide-react';
import { Habit, HabitData, HabitStatus } from './types';
import { formatDateKey, getHabitColor, parseStatus } from './utils';

interface DayDetailModalProps {
  date: Date;
  habits: Habit[];
  habitData: HabitData;
  onClose: () => void;
  onStatusChange: (habitId: number, status: HabitStatus | undefined) => void;
}

const STATUS_OPTIONS: Array<{ value: HabitStatus | undefined; icon: any; label: string; color: string }> = [
  { value: undefined, icon: Circle, label: 'Not tracked', color: 'text-gray-400' },
  { value: 'completed', icon: CheckCircle, label: 'Completed', color: 'text-green-400' },
  { value: 'partial', icon: MinusCircle, label: 'Partial', color: 'text-yellow-400' },
  { value: 'missed', icon: XCircle, label: 'Missed', color: 'text-red-400' },
  { value: 'skip', icon: Ban, label: 'Skipped', color: 'text-gray-500' }
];

export default function DayDetailModal({
  date,
  habits,
  habitData,
  onClose,
  onStatusChange
}: DayDetailModalProps) {
  const dateKey = formatDateKey(date);
  const dateStr = date.toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-gradient-to-br from-gray-900 to-purple-900 rounded-2xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto border border-white/20">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Calendar className="w-6 h-6 text-purple-400" />
            <h3 className="text-xl font-semibold text-white">{dateStr}</h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Quick Actions */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => habits.forEach(h => onStatusChange(h.id, 'completed'))}
            className="px-3 py-1.5 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30 transition-colors text-sm"
          >
            Complete All
          </button>
          <button
            onClick={() => habits.forEach(h => onStatusChange(h.id, undefined))}
            className="px-3 py-1.5 bg-gray-500/20 text-gray-400 rounded-lg hover:bg-gray-500/30 transition-colors text-sm"
          >
            Clear All
          </button>
        </div>

        {/* Habits List */}
        <div className="space-y-3">
          {habits.map(habit => {
            const status = parseStatus(habitData[`${habit.id}-${dateKey}`]);
            const colors = getHabitColor(habit.color);
            
            return (
              <div key={habit.id} className="bg-white/5 rounded-xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${colors.bg}`}>
                      <habit.icon className={`w-5 h-5 ${colors.text}`} />
                    </div>
                    <span className="text-white font-medium">{habit.label}</span>
                  </div>
                </div>
                
                {/* Status Options */}
                <div className="flex gap-2">
                  {STATUS_OPTIONS.map(option => {
                    const Icon = option.icon;
                    const isSelected = status === option.value;
                    
                    return (
                      <button
                        key={option.label}
                        onClick={() => onStatusChange(habit.id, option.value)}
                        className={`
                          flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all text-sm
                          ${isSelected 
                            ? 'bg-white/20 ring-2 ring-white/40' 
                            : 'bg-white/5 hover:bg-white/10'
                          }
                        `}
                      >
                        <Icon className={`w-4 h-4 ${option.color}`} />
                        <span className={isSelected ? 'text-white' : 'text-gray-400'}>
                          {option.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="mt-6 w-full py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-colors"
        >
          Done
        </button>
      </div>
    </div>
  );
}