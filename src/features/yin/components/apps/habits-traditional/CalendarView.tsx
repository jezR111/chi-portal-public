// src/features/yin/components/apps/habits/CalendarView.tsx

'use client';

import { Ban, CheckCircle, Circle, MinusCircle, XCircle } from 'lucide-react';
import { Habit, HabitData, HabitStatus, ViewMode } from './types';
import { formatDateKey, getDaysInMonth, getHabitColor, getWeekDays, parseStatus } from './utils';

interface CalendarViewProps {
  habits: Habit[];
  habitData: HabitData;
  selectedHabit: 'all' | number;
  viewMode: ViewMode;
  currentDate: Date;
  onDayClick: (date: Date) => void;
  onStatusChange: (habitId: number, date: Date, status: HabitStatus | undefined) => void;
  onEditHabit?: (habit: Habit) => void;

}

const STATUS_ICONS = {
  completed: { icon: CheckCircle, color: 'text-green-400' },
  partial: { icon: MinusCircle, color: 'text-yellow-400' },
  missed: { icon: XCircle, color: 'text-red-400' },
  skip: { icon: Ban, color: 'text-gray-500' }
};

export default function CalendarView({
  habits,
  habitData,
  selectedHabit,
  viewMode,
  currentDate,
  onDayClick,
  onStatusChange
}: CalendarViewProps) {
  const today = new Date();
  const days = viewMode === 'week' 
    ? getWeekDays(currentDate)
    : getDaysInMonth(currentDate);

  const renderSingleHabitDay = (habit: Habit, date: Date, isCurrentMonth: boolean) => {
    const dateKey = formatDateKey(date);
    const status = parseStatus(habitData[`${habit.id}-${dateKey}`]);
    const StatusIcon = status ? STATUS_ICONS[status].icon : Circle;
    const statusColor = status ? STATUS_ICONS[status].color : 'text-gray-400';
    const isToday = formatDateKey(date) === formatDateKey(today);
    const isFuture = date > today;

    const cycleStatus = () => {
      if (isFuture) return;
      const order: (HabitStatus | undefined)[] = [undefined, 'completed', 'partial', 'missed', 'skip'];
      const currentIndex = order.indexOf(status);
      const nextStatus = order[(currentIndex + 1) % order.length];
      onStatusChange(habit.id, date, nextStatus);
    };

    return (
      <button
        onClick={cycleStatus}
        disabled={!isCurrentMonth || isFuture}
        className={`
          aspect-square flex flex-col items-center justify-center rounded-lg transition-all
          ${isCurrentMonth && !isFuture
            ? 'hover:bg-white/10 cursor-pointer' 
            : 'opacity-30 cursor-not-allowed'
          }
          ${isToday ? 'ring-2 ring-purple-400' : ''}
        `}
      >
        <span className="text-xs text-gray-400 mb-1">
          {date.getDate()}
        </span>
        <StatusIcon className={`w-5 h-5 ${statusColor}`} />
      </button>
    );
  };

  const renderMultiHabitDay = (date: Date, isCurrentMonth: boolean) => {
    const isToday = formatDateKey(date) === formatDateKey(today);
    const isFuture = date > today;
    
    return (
      <button
        onClick={() => onDayClick(date)}
        disabled={!isCurrentMonth || isFuture}
        className={`
          aspect-square flex flex-col items-center justify-center rounded-lg transition-all p-2
          ${isCurrentMonth && !isFuture
            ? 'hover:bg-white/10 cursor-pointer' 
            : 'opacity-30 cursor-not-allowed'
          }
          ${isToday ? 'ring-2 ring-purple-400' : ''}
        `}
      >
        <span className="text-xs text-gray-400 mb-2">
          {date.getDate()}
        </span>
        <div className="grid grid-cols-3 gap-0.5">
          {habits.slice(0, 9).map(habit => {
            const dateKey = formatDateKey(date);
            const status = parseStatus(habitData[`${habit.id}-${dateKey}`]);
            const colors = getHabitColor(habit.color);
            
            return (
              <div
                key={habit.id}
                className={`w-2 h-2 rounded-full ${
                  status === 'completed' ? colors.dot :
                  status === 'partial' ? 'bg-yellow-500' :
                  status === 'missed' ? 'bg-red-500' :
                  status === 'skip' ? 'bg-gray-600' :
                  'bg-gray-700'
                }`}
              />
            );
          })}
        </div>
      </button>
    );
  };

  const selectedHabitObj = selectedHabit !== 'all' 
    ? habits.find(h => h.id === selectedHabit)
    : null;

  return (
    <div className="space-y-4">
      {/* Day Headers */}
      <div className={`grid ${viewMode === 'week' ? 'grid-cols-7' : 'grid-cols-7'} gap-2`}>
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="text-center text-xs text-gray-400 font-medium">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className={`grid ${viewMode === 'week' ? 'grid-cols-7' : 'grid-cols-7'} gap-2`}>
        {days.map((date, index) => {
          const isCurrentMonth = date.getMonth() === currentDate.getMonth();
          
          if (selectedHabit === 'all') {
            return (
              <div key={index}>
                {renderMultiHabitDay(date, isCurrentMonth)}
              </div>
            );
          } else if (selectedHabitObj) {
            return (
              <div key={index}>
                {renderSingleHabitDay(selectedHabitObj, date, isCurrentMonth)}
              </div>
            );
          }
          
          return null;
        })}
      </div>

      {/* Legend */}
      {selectedHabit === 'all' && (
        <div className="flex flex-wrap items-center justify-center gap-3 mt-4 text-xs">
          {habits.slice(0, 9).map(habit => {
            const colors = getHabitColor(habit.color);
            return (
              <div key={habit.id} className="flex items-center gap-1">
                <div className={`w-2 h-2 rounded-full ${colors.dot}`} />
                <span className="text-gray-400">{habit.label}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}