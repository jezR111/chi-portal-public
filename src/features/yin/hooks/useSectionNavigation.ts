// src/features/yin/hooks/useSectionNavigation.ts
import { useCallback, useState } from 'react';

export const useSectionNavigation = (
  totalSections: number,
  initialSection: number = 0,
  hasExtraContent: {
    meditation?: boolean;
    exercise?: boolean;
    reflection?: boolean;
  } = {}
) => {
  const [currentView, setCurrentView] = useState<'section' | 'meditation' | 'exercise' | 'reflection'>('section');
  const [currentSection, setCurrentSection] = useState(initialSection);
  const [completedViews, setCompletedViews] = useState({
    meditation: false,
    exercise: false,
    reflection: false
  });

  const isFirstSection = currentSection === 0;
  const isLastSection = currentSection === totalSections - 1;
  
  const hasMoreContent = isLastSection && (
    (hasExtraContent.meditation && !completedViews.meditation) ||
    (hasExtraContent.exercise && !completedViews.exercise) ||
    (hasExtraContent.reflection && !completedViews.reflection)
  );

  const goToPreviousSection = useCallback(() => {
    if (currentView !== 'section') {
      setCurrentView('section');
    } else if (currentSection > 0) {
      setCurrentSection(currentSection - 1);
    }
  }, [currentSection, currentView]);

  const goToNextSection = useCallback(() => {
    if (currentView === 'section') {
      if (currentSection < totalSections - 1) {
        setCurrentSection(currentSection + 1);
      } else if (hasExtraContent.meditation && !completedViews.meditation) {
        setCurrentView('meditation');
      } else if (hasExtraContent.exercise && !completedViews.exercise) {
        setCurrentView('exercise');
      } else if (hasExtraContent.reflection && !completedViews.reflection) {
        setCurrentView('reflection');
      }
    }
  }, [currentSection, totalSections, currentView, hasExtraContent, completedViews]);

  const completeCurrentView = useCallback(() => {
    if (currentView === 'meditation') {
      setCompletedViews(prev => ({ ...prev, meditation: true }));
      if (hasExtraContent.exercise && !completedViews.exercise) {
        setCurrentView('exercise');
      } else if (hasExtraContent.reflection && !completedViews.reflection) {
        setCurrentView('reflection');
      } else {
        setCurrentView('section');
      }
    } else if (currentView === 'exercise') {
      setCompletedViews(prev => ({ ...prev, exercise: true }));
      if (hasExtraContent.reflection && !completedViews.reflection) {
        setCurrentView('reflection');
      } else {
        setCurrentView('section');
      }
    } else if (currentView === 'reflection') {
      setCompletedViews(prev => ({ ...prev, reflection: true }));
      setCurrentView('section');
    }
  }, [currentView, hasExtraContent, completedViews]);

  const skipCurrentView = useCallback(() => {
    completeCurrentView();
  }, [completeCurrentView]);

  return {
    currentView,
    currentSection,
    completedViews,
    isFirstSection,
    isLastSection,
    hasMoreContent,
    goToPreviousSection,
    goToNextSection,
    completeCurrentView,
    skipCurrentView,
    setCurrentSection
  };
};