// src/features/yin/components/quests-and-challenges/challenges/ChallengeRegistry.ts
// Version: 2.0.0 - Balanced XP and removed redundant challenge

import { ComponentType } from 'react';

// Import all challenges from individual-challenges folder
import {
  FirstStepsChallenge,
} from './individual-challenges';

export interface ChallengeDefinition {
  id: string;
  name: string;
  description: string;
  xp: number;
  category: string;
  required: number;
  tier: number;
  component?: ComponentType<any>;
  enabled: boolean;
}

export const CHALLENGE_REGISTRY: ChallengeDefinition[] = [
  {
    id: 'first-steps',
    name: 'First Steps',
    description: 'Complete your first meditation, gratitude, or movement practice',
    xp: 50, // UPDATED: Changed from 20 to 50
    category: 'foundation',
    required: 1,
    tier: 1,
    component: FirstStepsChallenge,
    enabled: true,
  },
  // REMOVED: The 'daily-practice' challenge has been removed as requested.
];

