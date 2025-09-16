// src/features/yin/components/apps/habits/HabitTrackerSupabase.tsx
// This component handles Supabase persistence for the habit tracker
// It loads user data from Supabase and saves changes automatically

'use client';

import { createClient } from '@/lib/db/supabase/client';
import * as Icons from 'lucide-react';
import { useEffect, useState } from 'react';
import HabitTracker from './HabitTracker';
import { Habit, HabitData } from './types';

// Initialize Supabase client
const supabase = createClient();

export default function HabitTrackerSupabase() {
  // State for loading status and data
  const [isLoading, setIsLoading] = useState(true);
  const [initialData, setInitialData] = useState<{
    habits: Habit[];
    data: HabitData;
  } | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  // Load user data when component mounts
  useEffect(() => {
    loadUserAndData();
  }, []);

  // Function to load user authentication and habit data
  const loadUserAndData = async () => {
    try {
      // Check if user is logged in
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        // No user logged in - use component defaults
        console.log('No user logged in, using local defaults');
        setIsLoading(false);
        return;
      }

      setUserId(user.id);

      // Fetch existing habit data from database
      const { data, error } = await supabase
        .from('habit_tracker')
        .select('*')
        .eq('user_id', user.id)
        .single();

      // PGRST116 means no rows found - this is okay for new users
      if (error && error.code !== 'PGRST116') {
        console.error('Error loading habits:', error);
      }

      if (data) {
        // Reconstruct habit icons from stored icon names
        // We can't store functions in JSON, so we store icon names
        const habitsWithIcons = (data.habits || []).map((habit: any) => {
          const IconComponent = (Icons as any)[habit.iconName || 'Star'] || Icons.Star;
          return {
            ...habit,
            icon: IconComponent
          };
        });

        setInitialData({
          habits: habitsWithIcons,
          data: data.habit_data || {}
        });
      }
    } catch (error) {
      console.error('Failed to load habit data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Function to save data to Supabase
  const handleDataUpdate = async ({ habits, data }: { habits: Habit[]; data: HabitData }) => {
    if (!userId) {
      console.log('No user logged in, data not saved to database');
      return;
    }

    try {
      // Convert icon components to names for JSON storage
      const habitsForStorage = habits.map(habit => ({
        ...habit,
        iconName: habit.icon.name || 'Star',
        icon: undefined // Remove function from storage
      }));

      // Upsert data (insert or update based on user_id)
      const { error } = await supabase
        .from('habit_tracker')
        .upsert({
          user_id: userId,
          habits: habitsForStorage,
          habit_data: data,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'user_id' // Update if user_id exists, insert if not
        });

      if (error) {
        console.error('Failed to save habit data:', error);
      } else {
        console.log('Habit data saved successfully');
      }
    } catch (error) {
      console.error('Failed to save habit data:', error);
    }
  };

  // Show loading state while fetching data
  if (isLoading) {
    return (
      <div className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 p-6">
        <div className="flex items-center justify-center py-12">
          <div className="text-gray-400">Loading habits...</div>
        </div>
      </div>
    );
  }

  // Render the main habit tracker with persistence
  return (
    <HabitTracker
      initialData={initialData}
      onDataUpdate={handleDataUpdate}
    />
  );
}