// src/features/yin/hooks/useLessonProgress.ts
import { useCallback, useEffect, useRef, useState } from 'react';

export interface LessonProgressData {
  pathId?: string;
  chapterId?: string;
  lessonId: string;
  currentSection: number;
  totalSections: number;
  progressPercent: number;
  timeInLesson: number;
  completed: boolean;
  timestamp: string;
}

export const useLessonProgress = (lessonId: string, totalSections: number) => {
  const [currentSection, setCurrentSection] = useState(0);
  const [timeInLesson, setTimeInLesson] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [progress, setProgress] = useState(0);

  // Create a ref to hold all state needed by saveProgress to keep it stable.
  const stateRef = useRef({ currentSection, timeInLesson, isCompleted, progress, totalSections });

  // Update the ref on every render to ensure it has the latest values.
  // This effect has no dependency array, so it runs after every render.
  useEffect(() => {
    stateRef.current = { currentSection, timeInLesson, isCompleted, progress, totalSections };
  });

  // Load saved progress
  useEffect(() => {
    if (!lessonId) return;
    
    const savedProgress = localStorage.getItem(`lesson-progress-${lessonId}`);
    if (savedProgress) {
      const data = JSON.parse(savedProgress);
      setCurrentSection(data.currentSection || 0);
      setTimeInLesson(data.timeInLesson || 0);
      setIsCompleted(data.completed || false);
    }
  }, [lessonId]);

  // Track time in lesson
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeInLesson(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Calculate progress percentage
  useEffect(() => {
    const newProgress = totalSections > 0 
      ? Math.round(((currentSection + 1) / totalSections) * 100)
      : 0;
    setProgress(newProgress);
  }, [currentSection, totalSections]);

  // Save progress to localStorage
  const saveProgress = useCallback((section?: number) => {
    if (!lessonId) return;

    // Read the latest state from the ref to avoid stale closures.
    const latestState = stateRef.current;

    const progressData: LessonProgressData = {
      lessonId,
      currentSection: section ?? latestState.currentSection,
      totalSections: latestState.totalSections,
      progressPercent: latestState.progress,
      timeInLesson: latestState.timeInLesson,
      completed: latestState.isCompleted,
      timestamp: new Date().toISOString()
    };
    
    localStorage.setItem(`lesson-progress-${lessonId}`, JSON.stringify(progressData));
    localStorage.setItem('lastLessonProgress', JSON.stringify(progressData));
  }, [lessonId]); // Now this function is stable as long as lessonId doesn't change.

  const goToSection = useCallback((section: number) => {
    if (section >= 0 && section < totalSections) {
      setCurrentSection(section);
      saveProgress(section);
    }
  }, [totalSections, saveProgress]); // This is now stable too.

  const nextSection = useCallback(() => {
    if (currentSection < totalSections - 1) {
      goToSection(currentSection + 1);
    }
  }, [currentSection, totalSections, goToSection]);

  const previousSection = useCallback(() => {
    if (currentSection > 0) {
      goToSection(currentSection - 1);
    }
  }, [currentSection, goToSection]);

  const completeLesson = useCallback(() => {
    setIsCompleted(true);
    // saveProgress is called right after setting state. Because it uses a ref,
    // the ref will be updated on the re-render, and the saved data will be correct.
    saveProgress();
  }, [saveProgress]);

  return {
    currentSection,
    timeInLesson,
    isCompleted,
    progress,
    goToSection,
    nextSection,
    previousSection,
    completeLesson,
    saveProgress
  };
};