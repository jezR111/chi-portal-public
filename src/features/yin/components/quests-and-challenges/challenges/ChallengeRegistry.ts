// src/features/yin/components/quests-and-challenges/challenges/ChallengeRegistry.ts
// Version: 5.1.0 - Added backward compatibility for questTracking

import { ComponentType } from 'react';

export type ActionType = 
  | 'QUEST_COMPLETED'
  | 'LESSON_COMPLETED'
  | 'HABIT_TRACKED'
  | 'INSIGHT_SHARED'
  | 'SHADOW_CIRCLE_POST';

export interface ChallengeTrigger {
  type: ActionType;
  id?: string;
  category?: string;
  requiredCount?: number;
}

// Add questTracking back for compatibility
export interface QuestTracking {
  trackQuestsById?: string[];
  trackQuestCategories?: string[];
}

export interface ChallengeDefinition {
  id: string;
  name: string;
  description: string;
  xp: number;
  category: string;
  required: number;
  tier: number;
  enabled: boolean;
  component?: ComponentType<any>;
  triggers: ChallengeTrigger[];
  questTracking?: QuestTracking; // Add this for backward compatibility
}

// Helper function to convert triggers to questTracking format
const getQuestTrackingFromTriggers = (triggers: ChallengeTrigger[]): QuestTracking => {
  const questTracking: QuestTracking = {
    trackQuestsById: [],
    trackQuestCategories: []
  };

  triggers.forEach(trigger => {
    if (trigger.type === 'QUEST_COMPLETED') {
      if (trigger.id) {
        questTracking.trackQuestsById!.push(trigger.id);
      }
      if (trigger.category) {
        questTracking.trackQuestCategories!.push(trigger.category);
      }
    }
  });

  return questTracking;
};

export const CHALLENGE_REGISTRY: ChallengeDefinition[] = [
  // --- TIER 1 ---
  {
    id: 'first-steps',
    name: 'First Steps',
    description: 'Complete your first meditation, gratitude, and movement quest.',
    xp: 100,
    category: 'foundation',
    required: 3,
    tier: 1,
    enabled: true,
    triggers: [
      { type: 'QUEST_COMPLETED', id: 'meditation' },
      { type: 'QUEST_COMPLETED', id: 'gratitude' },
      { type: 'QUEST_COMPLETED', id: 'movement' },
    ],
    // Add backward compatibility
    get questTracking() {
      return getQuestTrackingFromTriggers(this.triggers);
    }
  },
  {
    id: 'daily-practice',
    name: 'Daily Practice',
    description: 'Complete all 5 daily quests.',
    xp: 150,
    category: 'consistency',
    required: 5,
    tier: 1,
    enabled: true,
    triggers: [
      { type: 'QUEST_COMPLETED', id: 'meditation' },
      { type: 'QUEST_COMPLETED', id: 'gratitude' },
      { type: 'QUEST_COMPLETED', id: 'movement' },
      { type: 'QUEST_COMPLETED', id: 'breathing' },
      { type: 'QUEST_COMPLETED', id: 'learning' },
    ],
    get questTracking() {
      return getQuestTrackingFromTriggers(this.triggers);
    }
  },

  // --- TIER 2 ---
  {
    id: 'meditation-master',
    name: 'Meditation Master',
    description: 'Complete 5 meditation sessions.',
    xp: 200,
    category: 'mindfulness',
    required: 5, // Requires 5 completions
    tier: 2,
    enabled: true,
    triggers: [
      { type: 'QUEST_COMPLETED', id: 'meditation', requiredCount: 5 },
    ],
    get questTracking() {
      return getQuestTrackingFromTriggers(this.triggers);
    }
  },
  {
    id: 'gratitude-champion',
    name: 'Gratitude Champion',
    description: 'Complete 5 gratitude quests.',
    xp: 200,
    category: 'reflection',
    required: 5,
    tier: 2,
    enabled: true,
    triggers: [
      { type: 'QUEST_COMPLETED', id: 'gratitude', requiredCount: 5 },
    ],
    get questTracking() {
      return getQuestTrackingFromTriggers(this.triggers);
    }
  },

  // --- TIER 3 ---
  {
    id: 'breath-warrior',
    name: 'Breath Warrior',
    description: 'Master the art of breathwork.',
    xp: 300,
    category: 'breathwork',
    required: 10,
    tier: 3,
    enabled: true,
    triggers: [
      { type: 'QUEST_COMPLETED', id: 'breathing', requiredCount: 10 },
    ],
    get questTracking() {
      return getQuestTrackingFromTriggers(this.triggers);
    }
  },
];