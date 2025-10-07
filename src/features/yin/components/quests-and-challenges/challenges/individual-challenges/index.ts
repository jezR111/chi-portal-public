// src/features/yin/components/quests-and-challenges/challenges/individual-challenges/index.ts

// --- CORRECTED EXPORT PATHS ---

// Export main UI components
export { QuestUI } from '../../quests/QuestUI'; // FIX: Was ../quests/QuestUI
export { ChallengeUI } from '../ChallengeUI';

// Export registries for external use if needed
export { QUEST_REGISTRY } from '../../quests/QuestRegistry'; // FIX: Was ../quests/QuestRegistry
export { CHALLENGE_REGISTRY } from '../ChallengeRegistry'; // FIX: Was ./challenges/ChallengeRegistry

// Export types
export type { QuestDefinition } from '../../quests/QuestRegistry'; // FIX: Was ../quests/QuestRegistry
export type { ChallengeDefinition } from '../ChallengeRegistry'; // FIX: Was ./challenges/ChallengeRegistry
