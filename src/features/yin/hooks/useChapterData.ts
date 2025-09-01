// src/features/yin/hooks/useChapterData.ts

import { Brain, Compass, Eye, Heart, Moon, Shield } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { chapterService } from '../services/chapterService';
import { ChapterData } from '../types/chapter.types';

export const useChapterData = (userId?: string) => {
  const [chapters, setChapters] = useState<ChapterData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  
  useEffect(() => {
    loadChapters();
  }, [userId]);
  
  const loadChapters = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // First, get static chapter data
      const staticChapters = getStaticChapters();
      
      // Then fetch dynamic data (progress, unlocked status, etc.)
      if (userId) {
        const dynamicData = await chapterService.getUserChapterData(userId);
        
        // Merge static and dynamic data
        const mergedChapters = staticChapters.map(chapter => {
          const userProgress = dynamicData.find(d => d.chapterId === chapter.id);
          return {
            ...chapter,
            progress: userProgress?.progress || 0,
            unlocked: userProgress?.unlocked ?? chapter.unlocked,
            lessonList: userProgress?.lessons || chapter.lessonList
          };
        });
        
        setChapters(mergedChapters);
      } else {
        setChapters(staticChapters);
      }
    } catch (err) {
      setError(err as Error);
      console.error('Error loading chapters:', err);
      
      // Fallback to static data on error
      setChapters(getStaticChapters());
    } finally {
      setLoading(false);
    }
  };
  
  const refreshChapters = useCallback(async () => {
    setRefreshing(true);
    await loadChapters();
    setRefreshing(false);
  }, [userId]);
  
  const unlockChapter = useCallback(async (chapterId: string) => {
    try {
      if (!userId) throw new Error('User ID required');
      
      await chapterService.unlockChapter(userId, chapterId);
      
      // Update local state
      setChapters(prev => prev.map(chapter => 
        chapter.id === chapterId 
          ? { ...chapter, unlocked: true }
          : chapter
      ));
      
      return true;
    } catch (err) {
      setError(err as Error);
      return false;
    }
  }, [userId]);
  
  const updateChapterProgress = useCallback(async (
    chapterId: string, 
    progress: number
  ) => {
    try {
      if (!userId) throw new Error('User ID required');
      
      await chapterService.updateProgress(userId, chapterId, progress);
      
      // Update local state
      setChapters(prev => prev.map(chapter => 
        chapter.id === chapterId 
          ? { ...chapter, progress }
          : chapter
      ));
    } catch (err) {
      setError(err as Error);
    }
  }, [userId]);
  
  const getChapterById = useCallback((chapterId: string) => {
    return chapters.find(c => c.id === chapterId);
  }, [chapters]);
  
  const getNextUnlockedChapter = useCallback(() => {
    return chapters.find(c => c.unlocked && c.progress < 100);
  }, [chapters]);
  
  return {
    chapters,
    loading,
    error,
    refreshing,
    refreshChapters,
    unlockChapter,
    updateChapterProgress,
    getChapterById,
    getNextUnlockedChapter
  };
};

// Static chapter data (can be moved to separate file)
const getStaticChapters = (): ChapterData[] => [
  {
    id: 'chapter-1',
    title: "Chapter 1: The Awakening",
    subtitle: "Discover the luminous essence of your being",
    icon: Eye,
    color: "from-violet-600 to-purple-600",
    glow: "shadow-violet-500/50",
    progress: 0,
    lessons: 5,
    duration: "1h",
    unlocked: true,
    premium: false,
    description: "Begin your cosmic journey by awakening to the infinite potential within.",
    lessonList: [
      {
        id: 'lesson-1-1',
        chapterId: 'chapter-1',
        title: "Opening the Inner Eye",
        completed: false,
        duration: "12 min",
        order: 1
      },
      {
        id: 'lesson-1-2',
        chapterId: 'chapter-1',
        title: "First Light Meditation",
        completed: false,
        duration: "15 min",
        order: 2
      },
      {
        id: 'lesson-1-3',
        chapterId: 'chapter-1',
        title: "Recognizing Your Essence",
        completed: false,
        duration: "10 min",
        order: 3
      },
      {
        id: 'lesson-1-4',
        chapterId: 'chapter-1',
        title: "The Mirror of Self",
        completed: false,
        duration: "13 min",
        order: 4
      },
      {
        id: 'lesson-1-5',
        chapterId: 'chapter-1',
        title: "Integration Practice",
        completed: false,
        duration: "10 min",
        order: 5
      }
    ]
  },
  {
    id: 'chapter-2',
    title: "Chapter 2: The Inner World",
    subtitle: "Explore the landscape of your thoughts and emotions",
    icon: Brain,
    color: "from-indigo-600 to-violet-600",
    glow: "shadow-indigo-500/50",
    progress: 0,
    lessons: 6,
    duration: "2h",
    unlocked: false,
    premium: false,
    description: "Navigate the celestial realms of your inner cosmos."
  },
  {
    id: 'chapter-3',
    title: "Chapter 3: The Shadow Self",
    subtitle: "Embrace and integrate your hidden aspects",
    icon: Moon,
    color: "from-purple-700 to-pink-600",
    glow: "shadow-purple-500/50",
    progress: 0,
    lessons: 8,
    duration: "2.5h",
    unlocked: false,
    premium: true,
    description: "Dance with the shadows to find the light within darkness."
  },
  {
    id: 'chapter-4',
    title: "Chapter 4: Inner Child Healing",
    subtitle: "Reconnect with your authentic joy and wonder",
    icon: Heart,
    color: "from-pink-600 to-rose-600",
    glow: "shadow-pink-500/50",
    progress: 0,
    lessons: 7,
    duration: "2h",
    unlocked: false,
    premium: true,
    description: "Heal past wounds and rediscover your innate playfulness."
  },
  {
    id: 'chapter-5',
    title: "Chapter 5: The Sacred Boundaries",
    subtitle: "Create energetic protection and healthy limits",
    icon: Shield,
    color: "from-blue-600 to-indigo-600",
    glow: "shadow-blue-500/50",
    progress: 0,
    lessons: 6,
    duration: "1.5h",
    unlocked: false,
    premium: false,
    description: "Learn to honor your space and energy with loving boundaries."
  },
  {
    id: 'chapter-6',
    title: "Chapter 6: The Inner Compass",
    subtitle: "Align with your true north and life purpose",
    icon: Compass,
    color: "from-teal-600 to-cyan-600",
    glow: "shadow-teal-500/50",
    progress: 0,
    lessons: 9,
    duration: "3h",
    unlocked: false,
    premium: true,
    description: "Discover your soul's calling and navigate by your inner wisdom."
  }
];