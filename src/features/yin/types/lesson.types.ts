// src/features/yin/types/lesson.types.ts

export interface LessonContent {
  id: string;
  type: 'video' | 'text' | 'audio' | 'mixed' | 'exercise';
  sections: LessonSection[];
  meditation?: MeditationContent;
  exercise?: ExerciseContent;
  reflection?: ReflectionPrompt[];
}

export interface LessonSection {
  type: 'text' | 'video' | 'audio' | 'quote' | 'image' | 'content' | 'teaching' | 'practice';
  content: string;
  duration?: number;
  title?: string;
}

export interface MeditationContent {
  title: string;
  duration: number;
  audioUrl?: string;
  guidance: string[];
}

export interface ExerciseContent {
  title: string;
  instructions: string[];
  duration: number;
  type: 'journaling' | 'movement' | 'breathing' | 'visualization';
}

export interface ReflectionPrompt {
  question: string;
  type: 'text' | 'rating' | 'choice';
  options?: string[];
}