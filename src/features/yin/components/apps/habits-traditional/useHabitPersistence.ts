// src/features/yin/components/apps/habits/useHabitPersistence.ts
'use client';

import { useEffect, useState } from 'react';
import { Habit, HabitData } from './types';

const STORAGE_KEY = 'yin_habit_tracker';

interface StoredData {
  habits: Habit[];
  data: HabitData;
  lastUpdated: string;
}

export function useHabitPersistence() {
  const [isLoading, setIsLoading] = useState(true);
  const [storedData, setStoredData] = useState<StoredData | null>(null);

  // Load data from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Reconstruct icon functions from icon names
        const habitsWithIcons = parsed.habits.map((habit: any) => ({
          ...habit,
          icon: getIconFromName(habit.iconName || 'Star')
        }));
        setStoredData({
          ...parsed,
          habits: habitsWithIcons
        });
      }
    } catch (error) {
      console.error('Failed to load habit data:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Save data to localStorage
  const saveData = (habits: Habit[], data: HabitData) => {
    try {
      // Convert icon functions to names for storage
      const habitsForStorage = habits.map(habit => ({
        ...habit,
        iconName: habit.icon.name || 'Star',
        icon: undefined // Remove function from storage
      }));

      const dataToStore: StoredData = {
        habits: habitsForStorage as any,
        data,
        lastUpdated: new Date().toISOString()
      };

      localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToStore));
      setStoredData({
        ...dataToStore,
        habits // Keep the original habits with icons in state
      });
    } catch (error) {
      console.error('Failed to save habit data:', error);
    }
  };

  // Clear all data
  const clearData = () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
      setStoredData(null);
    } catch (error) {
      console.error('Failed to clear habit data:', error);
    }
  };

  return {
    isLoading,
    storedData,
    saveData,
    clearData
  };
}

// Helper function to get icon component from name
function getIconFromName(iconName: string) {
  const Icons = require('lucide-react');
  return Icons[iconName] || Icons.Star;
}