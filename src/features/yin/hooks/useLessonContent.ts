// src/features/yin/hooks/useLessonContent.ts
import { LessonRepository } from '@/features/yin/services/lessonRepository';
import { useEffect, useState } from 'react';

export const useLessonContent = (initialLesson: any) => {
  const [lesson, setLesson] = useState(initialLesson);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFullLesson = async () => {
      if (!initialLesson) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);
      
      try {
        // Check if lesson needs fetching
        const isPlaceholder = !initialLesson?.sections || 
                             initialLesson.sections.length === 0 ||
                             initialLesson?.subtitle === 'Content coming soon';
        
        if (initialLesson?.id && isPlaceholder) {
          console.log(`📝 Fetching full lesson for "${initialLesson.title}" (${initialLesson.id})...`);
          
          const fullLesson = await LessonRepository.getLesson(initialLesson.id);
          
          if (fullLesson && fullLesson.sections) {
            console.log(`✅ Full lesson loaded with ${fullLesson.sections.length} sections`);
            setLesson(fullLesson);
          } else {
            console.log(`⚠️ No full content found, using placeholder`);
            setLesson(initialLesson);
          }
        } else {
          setLesson(initialLesson);
        }
      } catch (err) {
        console.error('Error fetching lesson:', err);
        setError('Failed to load lesson content');
        setLesson(initialLesson);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchFullLesson();
  }, [initialLesson]);

  return {
    lesson,
    isLoading,
    error,
    sections: lesson?.sections || [],
    meditation: lesson?.meditation,
    exercise: lesson?.exercise,
    reflection: lesson?.reflection
  };
};