// src/features/yin/types/insight.types.ts

export type InsightType = 'lightbulb' | 'note' | 'voice' | 'breakthrough' | 'heart';

export interface InsightData {
  id: string;
  type: InsightType;
  content: string;
  voiceNote?: Blob;
  tags: string[];
  timestamp: Date;
  lessonContext: {
    lessonId: string;
    lessonTitle: string;
    sectionId: string;
    timeInLesson: number;
  };
  metadata?: {
    mood?: number;
    energy?: number;
  };
}

export interface InsightCollection {
  userId: string;
  insights: InsightData[];
  totalCount: number;
  tags: TagCount[];
  patterns?: InsightPattern[];
}

export interface TagCount {
  tag: string;
  count: number;
}

export interface InsightPattern {
  pattern: string;
  frequency: number;
  relatedInsights: string[];
  suggestedContent?: string[];
}

export interface InsightStats {
  totalInsights: number;
  todayInsights: number;
  weekInsights: number;
  topTags: TagCount[];
  streakDays: number;
  lastInsightDate: Date;
}