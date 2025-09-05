// src/features/yin/data/pathsData.ts

import {
  Compass, Heart, Moon,
  Shield, Sparkles,
  Star
} from 'lucide-react';

export interface Lesson {
  id: string;
  chapterId: string;
  title: string;
  duration: string;
  completed?: boolean;
  content?: any;
}

export interface Chapter {
  id: string;
  pathId: string;
  title: string;
  description: string;
  lessons: Lesson[];
  progress?: number;
  completed?: boolean;
  locked?: boolean;
  estimatedTime?: string;
}

export interface Path {
  id: string;
  title: string;
  description: string;
  fullDescription?: string;
  icon: any;
  color: string;
  chapters: Chapter[];
  progress?: number;
  estimatedTime?: string;
}

export const pathsData: Path[] = [
  {
    id: 'path-inward',
    title: 'The Inward Journey',
    description: 'Begin your exploration of self through self-care and healing',
    fullDescription: 'This foundational path guides you through understanding and nurturing yourself, recognizing wounds, and beginning the healing process.',
    icon: Compass,
    color: 'from-violet-600 to-purple-700',
    chapters: [
      {
        id: 'chapter-self-care',
        pathId: 'path-inward',
        title: 'Self-Care',
        description: 'Learning to nurture and care for yourself with compassion',
        estimatedTime: '45 min',
        lessons: [
          { 
            id: 'lesson-1', 
            chapterId: 'chapter-self-care', 
            title: 'Understanding Self-Care', 
            duration: '15 min',
            completed: false
          },
          { 
            id: 'lesson-2', 
            chapterId: 'chapter-self-care', 
            title: 'Daily Self-Care Practices', 
            duration: '20 min',
            completed: false
          },
          { 
            id: 'lesson-3', 
            chapterId: 'chapter-self-care', 
            title: 'Creating Your Self-Care Ritual', 
            duration: '10 min',
            completed: false
          }
        ],
        progress: 0
      },
      {
        id: 'chapter-wounding',
        pathId: 'path-inward',
        title: 'Wounding',
        description: 'Recognizing and healing emotional wounds with gentleness',
        estimatedTime: '55 min',
        lessons: [
          { 
            id: 'lesson-4', 
            chapterId: 'chapter-wounding', 
            title: 'Recognizing Your Wounds', 
            duration: '25 min',
            completed: false
          },
          { 
            id: 'lesson-5', 
            chapterId: 'chapter-wounding', 
            title: 'The Healing Process', 
            duration: '30 min',
            completed: false
          }
        ],
        progress: 0,
        locked: false
      },
      {
        id: 'chapter-inner-child',
        pathId: 'path-inward',
        title: 'Inner Child',
        description: 'Reconnecting with your authentic, playful essence',
        estimatedTime: '40 min',
        lessons: [
          { 
            id: 'lesson-6', 
            chapterId: 'chapter-inner-child', 
            title: 'Meeting Your Inner Child', 
            duration: '20 min',
            completed: false
          },
          { 
            id: 'lesson-7', 
            chapterId: 'chapter-inner-child', 
            title: 'Healing Through Play', 
            duration: '20 min',
            completed: false
          }
        ],
        progress: 0,
        locked: true
      }
    ],
    progress: 0,
    estimatedTime: '2.5 hours'
  },
  {
    id: 'path-emotional',
    title: 'Emotional Alchemy',
    description: 'Transform your emotional landscape and discover your values',
    fullDescription: 'Learn to work with your emotions as guides, understanding what they reveal about your values and needs.',
    icon: Heart,
    color: 'from-pink-600 to-rose-700',
    chapters: [
      {
        id: 'chapter-values',
        pathId: 'path-emotional',
        title: 'Discovering Your Values',
        description: 'Uncover what truly matters to you at your core',
        estimatedTime: '35 min',
        lessons: [
          { 
            id: 'lesson-8', 
            chapterId: 'chapter-values', 
            title: 'Core Values Assessment', 
            duration: '20 min',
            completed: false
          },
          { 
            id: 'lesson-9', 
            chapterId: 'chapter-values', 
            title: 'Living Your Values', 
            duration: '15 min',
            completed: false
          }
        ],
        progress: 0,
        locked: true
      },
      {
        id: 'chapter-emotions',
        pathId: 'path-emotional',
        title: 'Emotional Intelligence',
        description: 'Understanding and working with your emotions',
        estimatedTime: '50 min',
        lessons: [
          { 
            id: 'lesson-10', 
            chapterId: 'chapter-emotions', 
            title: 'The Language of Emotions', 
            duration: '25 min',
            completed: false
          },
          { 
            id: 'lesson-11', 
            chapterId: 'chapter-emotions', 
            title: 'Emotional Regulation Techniques', 
            duration: '25 min',
            completed: false
          }
        ],
        progress: 0,
        locked: true
      }
    ],
    progress: 0,
    estimatedTime: '1.5 hours'
  },
  {
    id: 'path-shadow',
    title: 'Shadow Integration',
    description: 'Embrace all aspects of yourself, including the hidden parts',
    fullDescription: 'Journey into the depths of your psyche to integrate shadow aspects and find wholeness.',
    icon: Moon,
    color: 'from-purple-700 to-indigo-800',
    chapters: [],
    progress: 0,
    estimatedTime: '3 hours'
  },
  {
    id: 'path-boundaries',
    title: 'Sacred Boundaries',
    description: 'Learn to honor your space and energy with loving limits',
    fullDescription: 'Develop healthy boundaries that protect your energy while maintaining connection.',
    icon: Shield,
    color: 'from-blue-600 to-cyan-700',
    chapters: [],
    progress: 0,
    estimatedTime: '2 hours'
  },
  {
    id: 'path-authentic',
    title: 'Authentic Expression',
    description: 'Show up as your true self in all areas of life',
    fullDescription: 'Discover and express your authentic self with confidence and clarity.',
    icon: Sparkles,
    color: 'from-emerald-600 to-teal-700',
    chapters: [],
    progress: 0,
    estimatedTime: '2.5 hours'
  },
  {
    id: 'path-purpose',
    title: 'Soul Purpose',
    description: 'Align with your deeper calling and life mission',
    fullDescription: 'Connect with your soul\'s purpose and create a life of meaning.',
    icon: Star,
    color: 'from-amber-600 to-yellow-700',
    chapters: [],
    progress: 0,
    estimatedTime: '3 hours'
  }
];