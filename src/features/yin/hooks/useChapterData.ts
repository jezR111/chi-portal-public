// src/features/yin/hooks/useChapterData.ts
import { useCallback, useEffect, useState } from 'react';
import { pathsData } from '../data/enhancedPathsData';
import { Chapter, Lesson, notionService } from '../services/notionService';

interface UseChapterDataReturn {
  chapters: Chapter[];
  currentChapter: Chapter | null;
  lessons: Lesson[];
  isLoading: boolean;
  error: string | null;
  fetchChaptersForPath: (pathId: string) => Promise<void>;
  fetchLessonContent: (lessonId: string) => Promise<string | null>;
  setCurrentChapter: (chapter: Chapter) => void;
  refreshChapters: () => Promise<void>;
}

export const useChapterData = (initialPathId?: string): UseChapterDataReturn => {
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [currentChapter, setCurrentChapter] = useState<Chapter | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPathId, setCurrentPathId] = useState<string | undefined>(initialPathId);

  /**
   * Fetch chapters for a specific path
   */
  const fetchChaptersForPath = useCallback(async (pathId: string) => {
    setIsLoading(true);
    setError(null);
    setCurrentPathId(pathId);

    try {
      // Find the path data
      const pathData = pathsData.find(p => p.id === pathId);
      if (!pathData) {
        throw new Error(`Path ${pathId} not found`);
      }

      // Fetch chapters from Notion service
      const fetchedChapters = await notionService.getChaptersForPath(pathId, pathData);
      
      // Add some variety to progress for demo purposes
      const chaptersWithProgress = fetchedChapters.map((chapter, index) => ({
        ...chapter,
        progress: index === 0 ? Math.floor(Math.random() * 60) + 20 : 0,
        completed: false
      }));

      setChapters(chaptersWithProgress);

      // If we have chapters and no current chapter, set the first one
      if (chaptersWithProgress.length > 0 && !currentChapter) {
        setCurrentChapter(chaptersWithProgress[0]);
        setLessons(chaptersWithProgress[0].lessonList);
      }
    } catch (err) {
      console.error('Error fetching chapters:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch chapters');
      
      // Fallback to mock data if Notion fetch fails
      setChapters(getMockChaptersForPath(pathId));
    } finally {
      setIsLoading(false);
    }
  }, [currentChapter]);

  /**
   * Fetch content for a specific lesson
   */
  const fetchLessonContent = useCallback(async (lessonId: string): Promise<string | null> => {
    try {
      const content = await notionService.getLessonContent(lessonId);
      return content;
    } catch (err) {
      console.error('Error fetching lesson content:', err);
      return null;
    }
  }, []);

  /**
   * Set the current chapter and update lessons
   */
  const handleSetCurrentChapter = useCallback((chapter: Chapter) => {
    setCurrentChapter(chapter);
    setLessons(chapter.lessonList);
  }, []);

  /**
   * Refresh chapters for the current path
   */
  const refreshChapters = useCallback(async () => {
    if (currentPathId) {
      await fetchChaptersForPath(currentPathId);
    }
  }, [currentPathId, fetchChaptersForPath]);

  // Load initial chapters if pathId is provided
  useEffect(() => {
    if (initialPathId) {
      fetchChaptersForPath(initialPathId);
    }
  }, [initialPathId]);

  return {
    chapters,
    currentChapter,
    lessons,
    isLoading,
    error,
    fetchChaptersForPath,
    fetchLessonContent,
    setCurrentChapter: handleSetCurrentChapter,
    refreshChapters
  };
};

/**
 * Fallback mock data if Notion is not available
 */
function getMockChaptersForPath(pathId: string): Chapter[] {
  const pathData = pathsData.find(p => p.id === pathId);
  if (!pathData) return [];

  const mockChapterTitles: Record<string, string[]> = {
    'the-self': [
      'Overview of The Self',
      'The Stages of Self',
      'Self Image & Identity',
      'The Soul & The Ego'
    ],
    'inward-journey': [
      'Self Care Foundations',
      'Healing Your Wounds',
      'Emotional Intelligence',
      'Finding Inner Peace'
    ],
    'energy-bodies': [
      'Physical Body Wisdom',
      'Mental Energy Mastery',
      'Spiritual Heart Opening',
      'Energy Integration'
    ],
    'self-relating': [
      'Healthy Boundaries',
      'Authentic Communication',
      'Compassionate Connection',
      'Relationship Dynamics'
    ],
    'doing': [
      'Conscious Action',
      'Purpose-Driven Work',
      'Flow States',
      'Productivity & Presence'
    ],
    'life': [
      'Living Fully',
      'Embracing Change',
      'Joy and Sorrow',
      'Life Purpose'
    ],
    'self-mastery': [
      'Inner Discipline',
      'Emotional Mastery',
      'Mental Clarity',
      'Spiritual Sovereignty'
    ],
    'metaphysics': [
      'Nature of Reality',
      'Consciousness Exploration',
      'Time and Space',
      'Unity Experience'
    ]
  };

  const titles = mockChapterTitles[pathId] || ['Chapter 1', 'Chapter 2', 'Chapter 3'];
  
  return titles.map((title, index) => ({
    id: `${pathId}-chapter-${index + 1}`,
    pathId: pathId,
    notionId: `mock-${pathId}-${index + 1}`,
    title: title,
    subtitle: 'Transformative insights',
    description: `Explore the depths of ${title.toLowerCase()} in this transformative chapter.`,
    lessons: Math.floor(Math.random() * 4) + 3,
    duration: `${Math.floor(Math.random() * 2) + 1}h ${Math.floor(Math.random() * 45) + 15}m`,
    completed: false,
    progress: index === 0 ? Math.floor(Math.random() * 40) : 0,
    icon: pathData.icon,
    color: pathData.gradient,
    glow: `shadow-${pathData.glowColor}-500/30`,
    unlocked: index === 0,
    premium: Math.random() > 0.8,
    lessonList: generateMockLessons(`${pathId}-chapter-${index + 1}`, title)
  }));
}

function generateMockLessons(chapterId: string, chapterTitle: string): Lesson[] {
  const lessonCount = Math.floor(Math.random() * 3) + 3;
  return Array.from({ length: lessonCount }, (_, i) => ({
    id: `${chapterId}-lesson-${i + 1}`,
    chapterId: chapterId,
    title: `${chapterTitle} - Part ${i + 1}`,
    duration: `${Math.floor(Math.random() * 15) + 10}min`,
    completed: i === 0 && Math.random() > 0.5,
    content: undefined
  }));
}