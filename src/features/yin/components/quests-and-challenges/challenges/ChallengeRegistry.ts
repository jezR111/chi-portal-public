// Version: 5.0.0 - Refactored to an event-driven trigger system

import { ComponentType } from 'react';

// Define the types of actions the challenge system can listen for
export type ActionType = 
  | 'QUEST_COMPLETED'
  | 'LESSON_COMPLETED'
  | 'HABIT_TRACKED'
  | 'INSIGHT_SHARED'
  | 'SHADOW_CIRCLE_POST';

// Define the structure for a trigger
export interface ChallengeTrigger {
  type: ActionType;
  // Use 'id' for specific quests/lessons, or 'category' for quest categories
  id?: string;
  category?: string;
  // How many times this action must be performed for this trigger to be "met"
  requiredCount?: number; 
}

export interface ChallengeDefinition {
  id: string;
  name: string;
  description: string;
  xp: number;
  category: string;
  required: number; // Total number of unique triggers to complete
  tier: number;
  enabled: boolean;
  component?: ComponentType<any>;
  triggers: ChallengeTrigger[]; // REPLACED questTracking
}

export const CHALLENGE_REGISTRY: ChallengeDefinition[] = [
  // --- TIER 1 ---
  {
    id: 'first-steps',
    name: 'First Steps',
    description: 'Complete your first meditation, gratitude, and movement quest.',
    xp: 100,
    category: 'foundation',
    required: 3, // Requires 3 unique triggers to be met
    tier: 1,
    enabled: true,
    triggers: [
      { type: 'QUEST_COMPLETED', id: 'meditation' },
      { type: 'QUEST_COMPLETED', id: 'gratitude' },
      { type: 'QUEST_COMPLETED', id: 'movement' },
    ],
  },
  {
    id: 'portal-explorer',
    name: 'Portal Explorer',
    description: 'Discover the core features of the Chi Portal.',
    xp: 150,
    category: 'discovery',
    required: 4, // Requires 4 unique triggers to be met
    tier: 1,
    enabled: true,
    triggers: [
      { type: 'LESSON_COMPLETED' },
      { type: 'HABIT_TRACKED' },
      { type: 'INSIGHT_SHARED' },
      { type: 'SHADOW_CIRCLE_POST' },
    ],
  },

  // --- TIER 2 ---
  {
    id: 'meditation-explorer',
    name: 'Meditation Explorer',
    description: 'Complete 5 meditation sessions.',
    xp: 200,
    category: 'mindfulness',
    required: 1, // Only one trigger, but it requires 5 completions
    tier: 2,
    enabled: true,
    triggers: [
      { type: 'QUEST_COMPLETED', id: 'meditation', requiredCount: 5 },
    ],
  },
  // ... more challenges can be converted to this new format
];