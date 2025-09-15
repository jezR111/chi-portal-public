// src/features/yin/components/apps/habits/HabitSelector.tsx

'use client';

import { ChevronDown, Sparkles } from 'lucide-react';
import { Habit } from './types';
import { getHabitColor } from './utils';

interface HabitSelectorProps {
  habits: Habit[];
  selectedHabit: 'all' | number;
  onSelect: (habitId: 'all' | number) => void;
}

export default function HabitSelector({
  habits,
  selectedHabit,
  onSelect
}: HabitSelectorProps) {
  const currentHabit = selectedHabit === 'all' 
    ? null 
    : habits.find(h => h.id === selectedHabit);

  return (
    <div className="relative">
      <button
        className="flex items-center gap-3 px-4 py-2 bg-white/10 rounded-xl 
                   hover:bg-white/15 transition-all border border-white/20"
      >
        {selectedHabit === 'all' ? (
          <>
            <Sparkles className="w-5 h-5 text-purple-400" />
            <span className="text-white font-medium">All Habits</span>
          </>
        ) : currentHabit && (
          <>
            <div className={`p-1.5 rounded-lg ${getHabitColor(currentHabit.color).bg}`}>
              <currentHabit.icon className={`w-4 h-4 ${getHabitColor(currentHabit.color).text}`} />
            </div>
            <span className="text-white font-medium">{currentHabit.label}</span>
          </>
        )}
        <ChevronDown className="w-4 h-4 text-gray-400" />
      </button>

      {/* Dropdown Menu */}
      <div className="absolute top-full mt-2 left-0 w-64 bg-gray-900/95 backdrop-blur-xl 
                      rounded-xl border border-white/20 shadow-2xl overflow-hidden z-50 hidden">
        <button
          onClick={() => onSelect('all')}
          className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/10 transition-colors"
        >
          <Sparkles className="w-5 h-5 text-purple-400" />
          <span className="text-white">All Habits</span>
        </button>
        
        <div className="h-px bg-white/10" />
        
        {habits.map(habit => {
          const colors = getHabitColor(habit.color);
          return (
            <button
              key={habit.id}
              onClick={() => onSelect(habit.id)}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/10 transition-colors"
            >
              <div className={`p-1.5 rounded-lg ${colors.bg}`}>
                <habit.icon className={`w-4 h-4 ${colors.text}`} />
              </div>
              <span className="text-white">{habit.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}