import { ComponentType } from 'react';

// Import all quests from individual-quests folder
import {
  GratitudeQuest,
  MeditationQuest
} from './individual-quests';

export interface QuestDefinition {
  id: string;
  title: string;
  description: string;
  type: string;
  xp: number;
  duration?: number;
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
  icon: string;
  color: string;
  component: ComponentType<any>;
  enabled: boolean;
}

export const QUEST_REGISTRY: QuestDefinition[] = [
  {
    id: 'morning-meditation',
    title: 'Morning Meditation',
    description: 'Mindful breathing',
    type: 'meditation',
    xp: 25,
    duration: 1,
    difficulty: 'easy',
    category: 'Mindfulness',
    icon: '☀️',
    color: 'from-amber-500 to-orange-500',
    component: MeditationQuest,
    enabled: true
  },
  {
    id: 'gratitude-practice',
    title: 'Gratitude Practice',
    description: 'List 5 gratitudes',
    type: 'gratitude',
    xp: 20,
    difficulty: 'easy',
    category: 'Reflection',
    icon: '💖',
    color: 'from-pink-500 to-rose-500',
    component: GratitudeQuest,
    enabled: true
  },
  // Add more quests here...
];