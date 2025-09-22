// src/features/yin/types/insight.types.ts

export type InsightType = 'lightbulb' | 'breakthrough' | 'note' | 'heart';

export interface InsightData {
  id: string;
  type: InsightType;
  content: string;
  highlightedText?: string;
  voiceNote?: Blob;
  tags: string[];
  timestamp: string;
  lessonContext: {
    lessonId: string;
    lessonTitle: string;
    sectionId: string;
    timeInLesson: number;
  };
}

export interface InsightStats {
  totalInsights: number;
  todayInsights: number;
  weeklyInsights: number;
  monthlyInsights: number;
  streakDays: number;
  lastInsightDate: Date;
  topTags: Array<{ tag: string; count: number }>;
  insightsByType: Record<InsightType, number>;
}