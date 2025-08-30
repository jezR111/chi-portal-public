// src/features/yang/components/TrainingCalendar.tsx
'use client';

import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';

interface TrainingCalendarProps {
  selectedWeek: number;
  onWeekChange: (week: number) => void;
}

export function TrainingCalendar({ selectedWeek, onWeekChange }: TrainingCalendarProps) {
  const [selectedDate, setSelectedDate] = useState(new Date());
  
  const weeks = [
    { week: 1, phase: 'Adaptation', focus: 'Form & Technique' },
    { week: 2, phase: 'Adaptation', focus: 'Volume Building' },
    { week: 3, phase: 'Strength', focus: 'Intensity Increase' },
    { week: 4, phase: 'Strength', focus: 'Progressive Overload' },
    { week: 5, phase: 'Power', focus: 'Explosive Movement' },
    { week: 6, phase: 'Deload', focus: 'Active Recovery' },
  ];

  const currentWeekData = weeks[selectedWeek] || weeks[0];

  return (
    <div className="bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-xl rounded-2xl border border-orange-500/20 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-white">Training Program</h3>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onWeekChange(Math.max(0, selectedWeek - 1))}
            className="p-2 hover:bg-orange-500/20 rounded-lg transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-orange-400" />
          </button>
          <span className="px-4 py-2 bg-black/30 rounded-lg text-white font-medium">
            Week {currentWeekData.week}
          </span>
          <button
            onClick={() => onWeekChange(Math.min(weeks.length - 1, selectedWeek + 1))}
            className="p-2 hover:bg-orange-500/20 rounded-lg transition-colors"
          >
            <ChevronRight className="w-5 h-5 text-orange-400" />
          </button>
        </div>
      </div>

      <div className="mb-6 p-4 bg-orange-500/10 rounded-xl border border-orange-500/30">
        <p className="text-sm text-orange-400 mb-1">Phase: {currentWeekData.phase}</p>
        <p className="text-white font-medium">{currentWeekData.focus}</p>
      </div>

      <div className="grid grid-cols-7 gap-2">
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day) => (
          <div key={day} className="text-center text-xs text-gray-400 font-medium">
            {day}
          </div>
        ))}
        
        {/* Calendar days would go here */}
        {[...Array(35)].map((_, index) => {
          const dayNum = index - 2; // Offset for start of month
          const hasWorkout = dayNum > 0 && dayNum <= 31 && [1,2,4,5,6,8,9,11,12,13,15,16,18,19,20].includes(dayNum);
          
          return (
            <motion.button
              key={index}
              whileHover={{ scale: hasWorkout ? 1.1 : 1 }}
              whileTap={{ scale: 0.95 }}
              className={`aspect-square rounded-lg flex items-center justify-center text-sm ${
                hasWorkout 
                  ? 'bg-orange-500/20 border border-orange-500/50 text-orange-400 font-bold' 
                  : dayNum > 0 && dayNum <= 31 
                  ? 'bg-black/30 text-gray-400 hover:bg-black/50' 
                  : ''
              }`}
              disabled={dayNum <= 0 || dayNum > 31}
            >
              {dayNum > 0 && dayNum <= 31 && dayNum}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
