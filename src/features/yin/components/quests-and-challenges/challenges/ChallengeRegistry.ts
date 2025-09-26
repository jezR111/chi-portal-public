import { ComponentType } from 'react';

// Import all challenges from individual-challenges folder
import {
  DailyPracticeChallenge,
  FirstStepsChallenge
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
    xp: 20,
    category: 'foundation',
    required: 1,
    tier: 1,
    component: FirstStepsChallenge,
    enabled: true
  },
  {
    id: 'daily-practice',
    name: 'Daily Practice',
    description: 'Complete any daily quest',
    xp: 30,
    category: 'consistency',
    required: 1,
    tier: 1,
    component: DailyPracticeChallenge,
    enabled: true
  },
  // Add more challenges here...
];