// src/features/yin/types/chapter.types.ts

import { LucideIcon } from 'lucide-react';

export interface ChapterData {
  id: string;
  title: string;
  subtitle: string;
  icon: LucideIcon;
  color: string;
  glow: string;
  progress: number;
  lessons: number;
  duration: string;
  unlocked: boolean;
  premium: boolean;
  description: string;
  lessonList?: LessonData[];
}

export interface LessonData {
  id: string;
  chapterId: string;
  title: string;
  completed: boolean;
  duration: string;
  order: number;
  content?: LessonContent;
  insights?: InsightData[];
  progress?: LessonProgress;
}

export interface LessonContent {
  sections: ContentSection[];
  exercises?: Exercise[];
  meditationBreaks?: MeditationBreak[];
}

export interface ContentSection {
  id: string;
  type: 'text' | 'audio' | 'video' | 'exercise' | 'reflection';
  content: string;
  duration?: number;
  position: number;
}

export interface MeditationBreak {
  afterMinutes: number;
  type: 'meditation' | 'breathwork' | 'mindfulness';
  duration: number;
  mandatory: boolean;
}

export interface Exercise {
  id: string;
  type: 'journal' | 'practice' | 'reflection';
  prompt: string;
  duration: number;
}

export interface InsightData {
  id: string;
  timestamp: Date;
  type: 'lightbulb' | 'note' | 'voice' | 'breakthrough';
  content: string | Blob;
  tags: string[];
  lessonContext: {
    sectionId: string;
    timeInLesson: number;
  };
}

export interface LessonProgress {
  startedAt?: Date;
  completedAt?: Date;
  pausedAt?: number;
  totalTimeSpent: number;
  comprehensionRating?: number;
  sessionHistory: SessionData[];
}

export interface SessionData {
  date: Date;
  duration: number;
  progress: number;
  insightsCount: number;
}