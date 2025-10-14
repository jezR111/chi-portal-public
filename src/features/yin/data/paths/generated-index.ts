// File: src/features/yin/data/paths/generated-index.ts
// Temporary file - will be replaced when you run generatePaths.ts

export interface GeneratedLesson {
  id: string;
  title: string;
  path: string;
  chapter: string;
  order: number;
  duration?: number;
  xpReward?: number;
}

export interface GeneratedChapter {
  id: string;
  title: string;
  description: string;
  lessons: GeneratedLesson[];
}

export interface GeneratedPath {
  id: string;
  title: string;
  chapters: GeneratedChapter[];
}

// Populate with your actual data from the processed files you showed me
export const generatedPathsRegistry: Record<string, GeneratedPath> = {
  'the-self': {
    id: 'the-self',
    title: 'The Self',
    chapters: [
      {
        id: 'the-self-overview-of-the-self',
        title: 'Overview Of The Self',
        description: 'Introduction to self-awareness',
        lessons: [
          {
            id: '28b3385a-bd61-8062-b7d0-eea780b344bc',
            title: 'Overview of The Self',
            path: 'the-self',
            chapter: 'overview-of-the-self',
            order: 1,
            duration: 15,
            xpReward: 5
          }
        ]
      },
      {
        id: 'the-self-the-stages-of-self',
        title: 'The Stages Of Self',
        description: 'Evolution of consciousness',
        lessons: [
          {
            id: '28b3385a-bd61-807f-9807-c16ff974c0ab',
            title: 'Overview of Stages of Self',
            path: 'the-self',
            chapter: 'the-stages-of-self',
            order: 1,
            duration: 15,
            xpReward: 5
          },
          {
            id: '28b3385a-bd61-8057-b6d1-d6a2b693e9b0',
            title: 'The Stages of Self',
            path: 'the-self',
            chapter: 'the-stages-of-self',
            order: 2,
            duration: 15,
            xpReward: 5
          }
        ]
      }
    ]
  }
};

export const lessonPathIndex: Record<string, { path: string; chapter: string }> = {
  '28b3385a-bd61-8062-b7d0-eea780b344bc': { 
    path: 'the-self', 
    chapter: 'overview-of-the-self' 
  },
  '28b3385a-bd61-807f-9807-c16ff974c0ab': { 
    path: 'the-self', 
    chapter: 'the-stages-of-self' 
  },
  '28b3385a-bd61-8057-b6d1-d6a2b693e9b0': { 
    path: 'the-self', 
    chapter: 'the-stages-of-self' 
  }
};

export function getChaptersForPath(pathId: string): GeneratedChapter[] {
  const path = generatedPathsRegistry[pathId];
  return path ? path.chapters : [];
}

export function getLessonIdsForPath(pathId: string): string[] {
  const path = generatedPathsRegistry[pathId];
  if (!path) return [];
  
  return path.chapters.flatMap(chapter => 
    chapter.lessons.map(lesson => lesson.id)
  );
}

export function findLessonLocation(lessonId: string): { path: string; chapter: string } | null {
  return lessonPathIndex[lessonId] || null;
}