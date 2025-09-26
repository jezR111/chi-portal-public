//src/features/yin/types/xp.types.ts

export interface XPActivity {
  type: 'meditation' | 'insight' | 'lesson' | 'journal' | 'quest' | 'challenge';
  timestamp: number;
  duration: number; // in milliseconds
  data: {
    // Meditation specific
    isFirstTime?: boolean;
    streakDays?: number;
    recentMeditations?: number;
    
    // Insight specific
    insights?: Array<{
      text: string;
      tags?: string[];
    }>;
    
    // Lesson specific
    lessonId?: string;
    comprehensionRating?: number; // 1-5
    completed?: boolean;
    
    // Journal specific
    wordCount?: number;
    mood?: string;
    
    // General
    isGroupSession?: boolean;
    questId?: string;
    challengeId?: string;
  };
}

export interface XPResult {
  total: number;
  breakdown: {
    base: number;
    bonus: number;
    multiplier: number;
    patterns: string[];
  };
}