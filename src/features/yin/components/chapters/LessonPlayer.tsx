// src/features/yin/components/chapters/LessonPlayer.tsx
// Version: 10.1.1 - Fixed text selection and Wall of Wisdom sharing
import { useTextSelection } from '@/features/yin/hooks/useTextSelection';
import { createClient } from '@/lib/db/supabase/client';
import { AnimatePresence, motion } from 'framer-motion';
import { BookOpen, Lightbulb } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useRef } from 'react';

// Hooks
import { useLessonContent } from '@/features/yin/hooks/useLessonContent';
import { useLessonProgress } from '@/features/yin/hooks/useLessonProgress';
import { useSectionNavigation } from '@/features/yin/hooks/useSectionNavigation';

// Components
import { SwissArmyFAB } from '@/components/layout/SwissArmyFAB';
import { InsightCapture } from '../insights/InsightCapture';
import { ExerciseSection } from './interactive/ExerciseSection';
import { MeditationSection } from './interactive/MeditationSection';
import { ReflectionSection } from './interactive/ReflectionSection';
import { LessonCompletionModal } from './lesson/LessonCompletionModal';
import { LessonHeader } from './lesson/LessonHeader';
import { LessonNavigation } from './lesson/LessonNavigation';
import { SectionRenderer } from './sections/SectionRenderer';

interface LessonPlayerProps {
  lesson: any;
  chapter: any;
  initialSection?: number;
  onComplete: () => void;
  onNext: () => void;
  onBack?: () => void;
  onInsightCapture?: (insight: any) => void;
  onMeditationTrigger?: () => void;
  onInsightTrigger?: () => void;
  isFromQuest?: boolean;
  onSectionChange?: (section: number) => void;
}

export const LessonPlayer: React.FC<LessonPlayerProps> = (props) => {
  useTextSelection();
  const {
    lesson: lessonProp,
    chapter,
    initialSection = 0,
    onComplete,
    onNext,
    onBack,
    onInsightCapture,
    onMeditationTrigger,
    onInsightTrigger,
    isFromQuest = false,
    onSectionChange
  } = props;
  const router = useRouter();
  const searchParams = useSearchParams();
  const isInitialMount = useRef(true);
  const lastViewChange = useRef<number>(Date.now());
  const isSelectingText = useRef(false);
  
  // Content management
  const { 
    lesson, 
    isLoading, 
    error, 
    sections,
    meditation,
    exercise,
    reflection
  } = useLessonContent(lessonProp);
  
  // Progress tracking
  const {
    currentSection: progressSection,
    timeInLesson,
    isCompleted,
    progress,
    goToSection,
    nextSection,
    previousSection,
    completeLesson,
    saveProgress
  } = useLessonProgress(lesson?.id || '', sections.length);
  
  // Navigation
  const {
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
  } = useSectionNavigation(sections.length, initialSection, {
    meditation: !!meditation,
    exercise: !!exercise,
    reflection: !!reflection
  });

  // State for insights
  const [showInsightCapture, setShowInsightCapture] = React.useState(false);
  const [selectedText, setSelectedText] = React.useState('');
  const [highlightedInsights, setHighlightedInsights] = React.useState<string[]>([]);
  const [showCompletionModal, setShowCompletionModal] = React.useState(false);
  const [reflectionAnswers, setReflectionAnswers] = React.useState<Record<number, any>>({});
  
  // Track text selection state
  useEffect(() => {
    const handleSelectionStart = () => {
      isSelectingText.current = true;
    };
    
    const handleSelectionEnd = () => {
      // Keep selection active for a bit to allow FAB interaction
      setTimeout(() => {
        isSelectingText.current = false;
      }, 500);
    };
    
    const handleMouseDown = () => {
      const selection = window.getSelection();
      if (selection && selection.toString()) {
        isSelectingText.current = true;
      }
    };
    
    const handleMouseUp = () => {
      setTimeout(() => {
        const selection = window.getSelection();
        if (!selection || !selection.toString()) {
          isSelectingText.current = false;
        }
      }, 500);
    };

    document.addEventListener('selectstart', handleSelectionStart);
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('touchstart', handleSelectionStart);
    document.addEventListener('touchend', handleSelectionEnd);
    
    return () => {
      document.removeEventListener('selectstart', handleSelectionStart);
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('touchstart', handleSelectionStart);
      document.removeEventListener('touchend', handleSelectionEnd);
    };
  }, []);
  
  // Sync navigation state with progress
  useEffect(() => {
    if (progressSection !== currentSection) {
      setCurrentSection(progressSection);
    }
  }, [progressSection]);

  // Initialize from URL or saved progress
  useEffect(() => {
    if (!lesson?.id) return;
    
    if (initialSection > 0) {
      goToSection(initialSection);
      return;
    }
    
    const sectionFromUrl = searchParams?.get('section');
    if (sectionFromUrl) {
      const section = parseInt(sectionFromUrl, 10);
      goToSection(section);
    }
  }, [lesson?.id, initialSection, searchParams, goToSection]);

  // Notify parent of section changes
  useEffect(() => {
    if (onSectionChange && currentSection !== initialSection) {
      onSectionChange(currentSection);
    }
  }, [currentSection, initialSection, onSectionChange]);

  // FIXED: Only scroll to top on view change if not selecting text
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    
    // Don't scroll if user is selecting text
    if (isSelectingText.current) {
      return;
    }
    
    // Don't scroll if this is a rapid view change (likely unintentional)
    const now = Date.now();
    if (now - lastViewChange.current < 100) {
      return;
    }
    lastViewChange.current = now;
    
    // Only scroll for actual view changes, not section changes
    if (currentView !== 'section') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [currentView]);

  // Handle section navigation
  const handlePreviousSection = () => {
    // Clear any text selection
    window.getSelection()?.removeAllRanges();
    goToPreviousSection();
    previousSection();
  };

  const handleNextSection = () => {
    // Clear any text selection
    window.getSelection()?.removeAllRanges();
    
    if (currentView === 'section' && isLastSection && !hasMoreContent) {
      handleLessonComplete();
    } else {
      goToNextSection();
      if (currentView === 'section') {
        nextSection();
      }
    }
  };

  // Handle meditation completion
  const handleMeditationComplete = () => {
    completeCurrentView();
    if (isFromQuest && onMeditationTrigger) {
      onMeditationTrigger();
    }
    if (!hasMoreContent) {
      handleLessonComplete();
    }
  };

  // Handle exercise completion
  const handleExerciseComplete = () => {
    completeCurrentView();
    if (!hasMoreContent) {
      handleLessonComplete();
    }
  };

  // Handle reflection completion
  const handleReflectionComplete = (answers: Record<number, any>) => {
    setReflectionAnswers(answers);
    completeCurrentView();
    if (isFromQuest && onInsightCapture && Object.keys(answers).length > 0) {
      onInsightCapture(answers);
    }
    handleLessonComplete();
  };

  // Handle lesson completion
  const handleLessonComplete = () => {
    completeLesson();
    setShowCompletionModal(true);
  };

  const handleCompletionContinue = () => {
    setShowCompletionModal(false);
    onComplete();
    if (onNext) {
      onNext();
    }
  };

  // Handle quick save from FAB
  const handleQuickSave = (text: string) => {
    if (!lesson) return;
    
    const insight = {
      id: `insight-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type: 'lightbulb' as const,
      content: text,
      highlightedText: text,
      tags: ['highlight', 'quick-capture'],
      timestamp: new Date().toISOString(),
      lessonContext: {
        lessonId: lesson.id,
        lessonTitle: lesson.title,
        sectionId: sections[currentSection]?.title || '',
        timeInLesson
      }
    };
    
    const existing = JSON.parse(localStorage.getItem('userInsights') || '[]');
    existing.unshift(insight);
    localStorage.setItem('userInsights', JSON.stringify(existing));
    
    // Trigger storage event for other components
    window.dispatchEvent(new StorageEvent('storage', {
      key: 'userInsights',
      newValue: JSON.stringify(existing),
      url: window.location.href
    }));
    
    setHighlightedInsights(prev => [...prev, text]);
    if (onInsightCapture) onInsightCapture(insight);
    
    // Show confirmation
    showConfirmationToast('Insight saved!');
  };

  // ENHANCED: Share to Wall of Wisdom handler
  const handleShareToWall = async (text: string) => {
    if (!lesson || !chapter) return;
    
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        // Save to local storage for anonymous users
        const wallPost = {
          id: `wall-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          type: 'insight',
          content: text,
          author: 'Anonymous Seeker',
          timestamp: new Date().toISOString(),
          lessonContext: {
            lessonId: lesson.id,
            lessonTitle: lesson.title,
            chapterId: chapter.id,
            chapterTitle: chapter.title
          },
          category: 'captured',
          likes: 0,
          shared: true
        };
        
        const wallPosts = JSON.parse(localStorage.getItem('wallOfInsights') || '[]');
        wallPosts.unshift(wallPost);
        localStorage.setItem('wallOfInsights', JSON.stringify(wallPosts));
        
        // Trigger storage event
        window.dispatchEvent(new StorageEvent('storage', {
          key: 'wallOfInsights',
          newValue: JSON.stringify(wallPosts),
          url: window.location.href
        }));
      } else {
        // Save to Supabase for authenticated users
        const { error } = await supabase
          .from('community_insights')
          .insert({
            user_id: user.id,
            username: 'Anonymous Seeker',
            insight: text,
            category: 'captured',
            lesson_id: lesson.id,
            lesson_title: lesson.title,
            chapter_id: chapter.id,
            chapter_title: chapter.title
          });
        
        if (error) {
          console.error('Error sharing to wall:', error);
          showConfirmationToast('Failed to share. Please try again.', 'error');
          return;
        }
      }
      
      // Also save as a personal insight
      handleQuickSave(text);
      
      // Show success message
      showConfirmationToast('Shared to Wall of Wisdom!', 'success');
      
    } catch (error) {
      console.error('Error sharing to wall:', error);
      showConfirmationToast('Failed to share. Please try again.', 'error');
    }
  };
  
  // Helper function to show confirmation toasts
  const showConfirmationToast = (message: string, type: 'success' | 'error' = 'success') => {
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 ${
      type === 'success' 
        ? 'bg-gradient-to-r from-amber-500 to-orange-500' 
        : 'bg-gradient-to-r from-red-500 to-pink-500'
    } text-white px-6 py-3 rounded-xl shadow-xl z-[100] animate-slideIn flex items-center gap-2`;
    
    notification.innerHTML = `
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        ${type === 'success' 
          ? '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>'
          : '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>'
        }
      </svg>
      ${message}
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.style.opacity = '0';
      notification.style.transform = 'translateX(100px)';
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          >
            <Lightbulb className="w-16 h-16 text-purple-400 mx-auto mb-4" />
          </motion.div>
          <h2 className="text-2xl font-bold text-white mb-2">Loading Lesson...</h2>
          <p className="text-purple-300">Fetching content...</p>
        </div>
      </div>
    );
  }

  // No lesson state
  if (!lesson) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Lightbulb className="w-16 h-16 text-purple-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">No Lesson Selected</h2>
          <p className="text-purple-300 mb-6">Please select a lesson to continue.</p>
          {onBack && (
            <button
              onClick={onBack}
              className="px-6 py-3 bg-purple-600/20 text-purple-300 rounded-xl font-semibold hover:bg-purple-600/30 transition-colors"
            >
              Back to Chapters
            </button>
          )}
        </div>
      </div>
    );
  }

  // No content state
  if (sections.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <BookOpen className="w-16 h-16 text-purple-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Content Coming Soon</h2>
          <p className="text-purple-300 mb-2">
            The content for "{lesson?.title}" is being prepared.
          </p>
          <div className="flex gap-4 justify-center mt-6">
            {onNext && (
              <button
                onClick={onNext}
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl text-white font-semibold"
              >
                Continue to Next Lesson
              </button>
            )}
            {onBack && (
              <button
                onClick={onBack}
                className="px-6 py-3 bg-purple-600/20 text-purple-300 rounded-xl font-semibold hover:bg-purple-600/30 transition-colors"
              >
                Back to Chapters
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative">
      {/* Background effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          className="absolute -top-40 -right-40 w-80 h-80 bg-purple-600/10 rounded-full blur-3xl"
          animate={{ 
            x: [0, 50, 0],
            y: [0, -30, 0],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          className="absolute -bottom-40 -left-40 w-96 h-96 bg-pink-600/10 rounded-full blur-3xl"
          animate={{ 
            x: [0, -30, 0],
            y: [0, 50, 0],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      {/* Header */}
      <LessonHeader
        lessonTitle={lesson.title}
        chapterTitle={chapter?.title}
        duration={lesson.duration}
        currentSection={currentSection}
        totalSections={sections.length}
        progress={progress}
        onBack={onBack}
      />

      {/* Content */}
      <div className="relative">
        <AnimatePresence mode="wait">
          {currentView === 'section' && sections[currentSection] && (
            <motion.div
              key={`section-${currentSection}`}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            >
              <SectionRenderer
                section={sections[currentSection]}
                sectionNumber={currentSection}
                totalSections={sections.length}
              />
            </motion.div>
          )}

          {currentView === 'meditation' && meditation && (
            <motion.div
              key="meditation"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <MeditationSection
                meditation={meditation}
                onComplete={handleMeditationComplete}
                onSkip={() => {
                  skipCurrentView();
                  if (!hasMoreContent) handleLessonComplete();
                }}
              />
            </motion.div>
          )}

          {currentView === 'exercise' && exercise && (
            <motion.div
              key="exercise"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <ExerciseSection
                exercise={exercise}
                onComplete={handleExerciseComplete}
                onSkip={() => {
                  skipCurrentView();
                  if (!hasMoreContent) handleLessonComplete();
                }}
              />
            </motion.div>
          )}

          {currentView === 'reflection' && reflection && (
            <motion.div
              key="reflection"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <ReflectionSection
                reflections={reflection}
                onComplete={handleReflectionComplete}
                onSkip={() => {
                  skipCurrentView();
                  handleLessonComplete();
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Navigation */}
      {currentView === 'section' && (
        <LessonNavigation
          currentSection={currentSection}
          totalSections={sections.length}
          hasMoreContent={hasMoreContent}
          onPrevious={handlePreviousSection}
          onNext={handleNextSection}
        />
      )}

      {/* FAB for insights - with enhanced handlers */}
      {lesson && (
        <SwissArmyFAB
          onOpenInsightCapture={(text) => {
            setShowInsightCapture(true);
            if (text) setSelectedText(text);
          }}
          onQuickSave={handleQuickSave}
          onShareToWall={handleShareToWall}
          lessonContext={{
            lessonId: lesson.id,
            lessonTitle: lesson.title,
            sectionId: sections[currentSection]?.title || '',
            timeInLesson
          }}
        />
      )}

      {/* Insight Capture Modal */}
      {lesson && (
        <InsightCapture
          isOpen={showInsightCapture}
          onClose={() => {
            setShowInsightCapture(false);
            setSelectedText('');
          }}
          lessonId={lesson.id}
          lessonTitle={lesson.title}
          sectionId={sections[currentSection]?.title}
          timeInLesson={timeInLesson}
          selectedText={selectedText}
          onSave={(insight) => {
            if (selectedText) {
              setHighlightedInsights(prev => [...prev, selectedText]);
            }
            onInsightCapture?.(insight);
            setShowInsightCapture(false);
            setSelectedText('');
          }}
        />
      )}

      {/* Completion Modal */}
      <LessonCompletionModal
        isOpen={showCompletionModal}
        lessonTitle={lesson.title}
        xpReward={lesson.xpReward || 5}
        insightsCaptured={highlightedInsights.length}
        onContinue={handleCompletionContinue}
      />
    </div>
  );
};