// src/features/yin/types/quest.types.ts

export type QuestCategory = 'mind' | 'body' | 'spirit' | 'heart' | 'shadow';
export type QuestDifficulty = 'quick' | 'standard' | 'deep' | 'epic';
export type VerificationType = 'honor' | 'timer' | 'photo' | 'reflection' | 'biometric';
export type ChallengeType = 'streak' | 'accumulation' | 'variety' | 'intensity';

export interface Quest {
  id: string;
  title: string;
  description: string;
  xpReward: number;
  
  // Core fields (MVP)
  duration: '5min' | '15min' | '30min' | '60min' | '2hr+';
  available: boolean;
  completedToday?: boolean;
  lastCompleted?: string; // ISO date string
  
  // Visual & UX
  icon?: string; // emoji or icon name
  gradient?: string; // tailwind gradient classes
  
  // Future fields (structured now, implemented later)
  category?: QuestCategory;
  difficulty?: QuestDifficulty;
  verificationType?: VerificationType;
  
  // Advanced features (ready when needed)
  prerequisites?: string[]; // Quest IDs that must be completed first
  chainId?: string;         // For quest chains
  unlockAtXP?: number;      // XP required to unlock
  
  // Modifiers for bonus XP
  modifiers?: {
    morningBonus?: { before: string; multiplier: number }; // e.g., before "09:00", 1.5x
    eveningBonus?: { after: string; multiplier: number };
    streakBonus?: boolean;
    weekendBonus?: boolean;
  };
  
  // Scheduling (future)
  schedule?: {
    availableFrom?: string;  // Time of day "06:00"
    availableUntil?: string; // "22:00"
    daysOfWeek?: number[];   // 0-6, Sunday-Saturday
    seasonal?: 'spring' | 'summer' | 'fall' | 'winter';
    lunar?: 'new' | 'waxing' | 'full' | 'waning';
  };
  
  // Content for completion
  completionPrompt?: string; // What to show after completion
  reflectionPrompts?: string[]; // For reflection type verification
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  
  // Core MVP fields
  type: ChallengeType;
  currentProgress: number;
  target: number;
  xpReward: number; // For completing entire challenge
  dailyXP?: number; // XP per day/completion
  
  // Visual
  icon?: string;
  gradient?: string;
  
  // Progress tracking
  isActive: boolean;
  startedAt?: string; // ISO date
  completedAt?: string;
  lastProgressAt?: string;
  
  // Streak specific
  currentStreak?: number;
  bestStreak?: number;
  allowedGapDays?: number; // Grace period for streaks
  
  // Future expansion
  questIds?: string[];      // Which quests count toward this
  resetPeriod?: 'daily' | 'weekly' | 'monthly' | 'never';
  milestones?: { 
    at: number; 
    xpBonus: number;
    badge?: string;
    message?: string;
  }[];
}

export interface QuestCompletion {
  questId: string;
  completedAt: string;
  xpEarned: number;
  bonusApplied?: string[]; // Which bonuses were active
  verificationData?: any;
  reflection?: string;
}

export interface QuestState {
  // MVP
  quests: Quest[];
  challenges: Challenge[];
  completedToday: string[]; // Quest IDs
  
  // Stats
  totalQuestsCompleted: number;
  currentDailyStreak: number;
  lastActiveDate: string;
  
  // Future
  activeChains?: { chainId: string; currentIndex: number }[];
  questHistory?: QuestCompletion[];
  unlockedQuests?: string[];
}