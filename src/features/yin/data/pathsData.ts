// src/features/yin/data/pathsData.ts

export interface Path {
  id: string;
  title: string;
  description: string;
  icon: any;
  color: string;
  chapters: Chapter[];
}

export interface Chapter {
  id: string;
  pathId: string;
  title: string;
  description: string;
  lessons: Lesson[];
}

export interface Lesson {
  id: string;
  chapterId: string;
  title: string;
  duration: string;
  content?: any;
}

export const pathsData: Path[] = [
  {
    id: 'path-1',
    title: 'The Inward Journey',
    description: 'Begin your exploration of self',
    icon: Compass,
    color: 'from-violet-600 to-purple-600',
    chapters: [
      {
        id: 'chapter-1-1',
        pathId: 'path-1',
        title: 'Self-Care',
        description: 'Learning to nurture yourself',
        lessons: [
          { id: 'lesson-1-1-1', chapterId: 'chapter-1-1', title: 'Understanding Self-Care', duration: '15 min' },
          { id: 'lesson-1-1-2', chapterId: 'chapter-1-1', title: 'Daily Practices', duration: '20 min' },
        ]
      },
      {
        id: 'chapter-1-2',
        pathId: 'path-1',
        title: 'Wounding',
        description: 'Healing past hurts',
        lessons: [
          { id: 'lesson-1-2-1', chapterId: 'chapter-1-2', title: 'Recognizing Wounds', duration: '25 min' },
          { id: 'lesson-1-2-2', chapterId: 'chapter-1-2', title: 'The Healing Process', duration: '30 min' },
        ]
      }
    ]
  },
  {
    id: 'path-2',
    title: 'Emotional Alchemy',
    description: 'Transform your emotional landscape',
    icon: Heart,
    color: 'from-pink-600 to-rose-600',
    chapters: [
      {
        id: 'chapter-2-1',
        pathId: 'path-2',
        title: 'Discovering Your Values',
        description: 'What truly matters to you',
        lessons: [
          { id: 'lesson-2-1-1', chapterId: 'chapter-2-1', title: 'Core Values Assessment', duration: '20 min' },
        ]
      }
    ]
  },
  {
    id: 'path-3',
    title: 'Shadow Integration',
    description: 'Embrace all aspects of yourself',
    icon: Moon,
    color: 'from-purple-700 to-indigo-700',
    chapters: []
  },
  {
    id: 'path-4',
    title: 'Inner Child Healing',
    description: 'Reconnect with joy and wonder',
    icon: Star,
    color: 'from-yellow-600 to-amber-600',
    chapters: []
  },
  {
    id: 'path-5',
    title: 'Sacred Boundaries',
    description: 'Honor your space and energy',
    icon: Shield,
    color: 'from-blue-600 to-cyan-600',
    chapters: []
  },
  {
    id: 'path-6',
    title: 'Authentic Expression',
    description: 'Show up as your true self',
    icon: Sparkles,
    color: 'from-emerald-600 to-teal-600',
    chapters: []
  }
];