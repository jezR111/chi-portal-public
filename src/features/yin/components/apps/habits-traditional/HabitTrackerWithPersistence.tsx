// src/features/yin/components/apps/habits/HabitTrackerWithPersistence.tsx
'use client';

import * as Icons from 'lucide-react';
import { useEffect, useState } from 'react';
import HabitTracker from './HabitTracker';
import { Habit, HabitData } from './types';

const STORAGE_KEY = 'yin_habit_tracker';

export default function HabitTrackerWithPersistence() {
  const [isLoading, setIsLoading] = useState(true);
  const [initialData, setInitialData] = useState<{
    habits: Habit[];
    data: HabitData;
  } | null>(null);

  // Load data on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        
        // Reconstruct icon functions from stored icon names
        const habitsWithIcons = parsed.habits.map((habit: any) => {
          const IconComponent = (Icons as any)[habit.iconName || 'Star'] || Icons.Star;
          return {
            ...habit,
            icon: IconComponent
          };
        });

        setInitialData({
          habits: habitsWithIcons,
          data: parsed.data || {}
        });
      }
    } catch (error) {
      console.error('Failed to load habit data:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Save data whenever it updates
  const handleDataUpdate = ({ habits, data }: { habits: Habit[]; data: HabitData }) => {
    try {
      // Convert icons to names for storage
      const habitsForStorage = habits.map(habit => ({
        ...habit,
        iconName: habit.icon.name || 'Star',
        icon: undefined // Remove function from storage
      }));

      const dataToStore = {
        habits: habitsForStorage,
        data,
        lastUpdated: new Date().toISOString()
      };

      localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToStore));
    } catch (error) {
      console.error('Failed to save habit data:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 p-6">
        <div className="flex items-center justify-center py-12">
          <div className="text-gray-400">Loading habits...</div>
        </div>
      </div>
    );
  }

  return (
    <HabitTracker
      initialData={initialData}
      onDataUpdate={handleDataUpdate}
    />
  );
}