// src/features/yin/data/questsData.ts

import { Challenge, Quest } from '../types/quest.types';

export const questsData: Quest[] = [
  {
    id: 'morning_meditation',
    title: 'Morning Stillness',
    description: 'Begin your day with 10 minutes of peaceful meditation',
    duration: '15min',
    xpReward: 10,
    available: true,
    icon: '🧘',
    gradient: 'from-purple-500 to-indigo-500',
    category: 'mind',
    difficulty: 'quick',
    verificationType: 'honor',
    modifiers: {
      morningBonus: { before: '09:00', multiplier: 1.5 },
      streakBonus: true
    },
    completionPrompt: 'How did that meditation feel? Notice any shifts in your energy?'
  },
  {
    id: 'gratitude_journal',
    title: 'Gratitude Practice',
    description: 'Write down 5 things you\'re grateful for today',
    duration: '5min',
    xpReward: 8,
    available: true,
    icon: '📝',
    gradient: 'from-pink-500 to-rose-500',
    category: 'heart',
    difficulty: 'quick',
    verificationType: 'reflection',
    reflectionPrompts: [
      'What are you most grateful for today?',
      'Who made a positive impact on your day?',
      'What simple pleasure did you enjoy?'
    ]
  },
  {
    id: 'mindful_walk',
    title: 'Conscious Movement',
    description: 'Take a 20-minute walk with full presence and awareness',
    duration: '30min',
    xpReward: 15,
    available: true,
    icon: '🚶',
    gradient: 'from-green-500 to-teal-500',
    category: 'body',
    difficulty: 'standard',
    verificationType: 'honor',
    modifiers: {
      weekendBonus: true
    }
  },
  {
    id: 'breathwork_practice',
    title: 'Sacred Breath',
    description: 'Practice conscious breathing exercises for energy and calm',
    duration: '15min',
    xpReward: 12,
    available: false,
    unlockAtXP: 100,
    icon: '🌬️',
    gradient: 'from-cyan-500 to-blue-500',
    category: 'spirit',
    difficulty: 'standard',
    verificationType: 'timer'
  },
  {
    id: 'shadow_work',
    title: 'Shadow Integration',
    description: 'Journal about a trigger or pattern you noticed today',
    duration: '30min',
    xpReward: 20,
    available: false,
    unlockAtXP: 300,
    icon: '🌑',
    gradient: 'from-gray-700 to-gray-900',
    category: 'shadow',
    difficulty: 'deep',
    verificationType: 'reflection',
    reflectionPrompts: [
      'What triggered you today and why?',
      'What pattern are you ready to release?',
      'What is this teaching you about yourself?'
    ]
  },
  {
    id: 'cold_shower',
    title: 'Cold Exposure',
    description: 'End your shower with 2 minutes of cold water',
    duration: '5min',
    xpReward: 15,
    available: false,
    unlockAtXP: 200,
    icon: '❄️',
    gradient: 'from-blue-400 to-blue-600',
    category: 'body',
    difficulty: 'standard',
    verificationType: 'honor',
    modifiers: {
      morningBonus: { before: '08:00', multiplier: 1.3 }
    }
  },
  {
    id: 'yoga_flow',
    title: 'Sacred Movement',
    description: 'Complete a gentle yoga flow to awaken your body',
    duration: '30min',
    xpReward: 18,
    available: false,
    unlockAtXP: 150,
    icon: '🧘‍♀️',
    gradient: 'from-purple-400 to-pink-400',
    category: 'body',
    difficulty: 'standard',
    verificationType: 'honor'
  },
  {
    id: 'creative_expression',
    title: 'Creative Flow',
    description: 'Spend 30 minutes in creative expression - art, music, or writing',
    duration: '30min',
    xpReward: 15,
    available: false,
    unlockAtXP: 250,
    icon: '🎨',
    gradient: 'from-orange-400 to-pink-500',
    category: 'spirit',
    difficulty: 'standard',
    verificationType: 'honor'
  }
];

export const challengesData: Challenge[] = [
  {
    id: 'meditation_streak',
    title: '7-Day Meditation Journey',
    description: 'Meditate every day for a week',
    type: 'streak',
    currentProgress: 0,
    target: 7,
    xpReward: 100,
    dailyXP: 5,
    icon: '🔥',
    gradient: 'from-orange-500 to-red-500',
    isActive: true,
    currentStreak: 0,
    bestStreak: 0,
    allowedGapDays: 1,
    milestones: [
      { at: 3, xpBonus: 20, message: '3 days strong! Keep going!' },
      { at: 5, xpBonus: 30, message: 'Almost there! 2 more days!' },
      { at: 7, xpBonus: 50, message: 'Meditation Master! 🏆' }
    ],
    questIds: ['morning_meditation']
  },
  {
    id: 'wellness_variety',
    title: 'Rainbow Wellness',
    description: 'Complete 5 different types of wellness activities',
    type: 'variety',
    currentProgress: 0,
    target: 5,
    xpReward: 75,
    icon: '🌈',
    gradient: 'from-purple-400 via-pink-400 to-yellow-400',
    isActive: true,
    milestones: [
      { at: 3, xpBonus: 15, message: 'Great variety! Keep exploring!' },
      { at: 5, xpBonus: 35, message: 'Wellness Explorer achieved! 🌟' }
    ]
  }
];