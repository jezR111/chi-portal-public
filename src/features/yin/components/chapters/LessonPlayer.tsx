// src/features/yin/components/chapters/LessonPlayer.tsx
// Version: 8.6.1 - Fixed React Hooks order issue

import { SwissArmyFAB } from '@/components/layout/SwissArmyFAB';
import { LessonRepository } from '@/features/yin/services/lessonRepository';
import { createClient } from '@/lib/db/supabase/client';
import { AnimatePresence, motion } from 'framer-motion';
import {
  BookOpen,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Clock,
  Edit3,
  Heart,
  Lightbulb,
  Play,
  Quote,
  Sparkles,
  Star,
  Video
} from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react';
import { getLessonContent } from '../../data/lessonContent';
import { InsightCapture } from '../insights/InsightCapture';

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

const renderFormattedContent = (content: string) => {
  // Parse markdown-style formatting
  let formatted = content
    // Headers
    .replace(/^### (.*?)$/gm, '<h3 class="text-xl font-bold text-purple-200 mb-3 mt-6">$1</h3>')
    .replace(/^## (.*?)$/gm, '<h2 class="text-2xl font-bold text-white mb-4 mt-8">$1</h2>')
    .replace(/^# (.*?)$/gm, '<h1 class="text-3xl font-bold bg-gradient-to-r from-purple-200 to-pink-200 bg-clip-text text-transparent mb-6">$1</h1>')
    // Bold and italic
    .replace(/\*\*\*(.*?)\*\*\*/g, '<strong class="font-bold text-purple-100"><em>$1</em></strong>')
    .replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-purple-100">$1</strong>')
    .replace(/\*(.*?)\*/g, '<em class="italic text-purple-200">$1</em>')
    // Lists
    .replace(/^- (.*?)$/gm, '<li class="ml-6 text-purple-100/90 list-disc">$1</li>')
    .replace(/^\d+\. (.*?)$/gm, '<li class="ml-6 text-purple-100/90 list-decimal">$1</li>')
    // Line breaks
    .replace(/\n\n/g, '</p><p class="mb-4 text-purple-100/90 leading-relaxed">')
    .replace(/\n/g, '<br />');
  
  // Wrap in paragraph tags if not already wrapped
  if (!formatted.startsWith('<')) {
    formatted = `<p class="mb-4 text-purple-100/90 leading-relaxed">${formatted}</p>`;
  }
  
  // Wrap lists in ul/ol tags
  formatted = formatted.replace(/(<li class="ml-6 text-purple-100\/90 list-disc">.*?<\/li>\n?)+/g, 
    match => `<ul class="mb-4 space-y-2">${match}</ul>`);
  formatted = formatted.replace(/(<li class="ml-6 text-purple-100\/90 list-decimal">.*?<\/li>\n?)+/g, 
    match => `<ol class="mb-4 space-y-2">${match}</ol>`);
    
  return formatted;
};

export const LessonPlayer: React.FC<LessonPlayerProps> = ({
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
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const contentRef = useRef<HTMLDivElement>(null);
  const isInitialMount = useRef(true);
  
  // ALL HOOKS MUST BE DECLARED HERE, BEFORE ANY CONDITIONAL RETURNS
  
  // State to hold the actual lesson content
  const [lesson, setLesson] = useState(lessonProp);
  const [isLoading, setIsLoading] = useState(true);
  
  // State declarations
  const [currentSection, setCurrentSection] = useState(initialSection);
  const [isCompleted, setIsCompleted] = useState(false);
  const [hasCompletedLesson, setHasCompletedLesson] = useState(false);
  const [showMeditation, setShowMeditation] = useState(false);
  const [showExercise, setShowExercise] = useState(false);
  const [showReflection, setShowReflection] = useState(false);
  const [reflectionAnswers, setReflectionAnswers] = useState<Record<number, any>>({});
  
  const [meditationCompleted, setMeditationCompleted] = useState(false);
  const [exerciseCompleted, setExerciseCompleted] = useState(false);
  const [reflectionCompleted, setReflectionCompleted] = useState(false);
  
  // Insight capture states
  const [showInsightCapture, setShowInsightCapture] = useState(false);
  const [selectedText, setSelectedText] = useState('');
  const [timeInLesson, setTimeInLesson] = useState(0);
  const [highlightedInsights, setHighlightedInsights] = useState<string[]>([]);

  // Fetch full lesson if we have a placeholder
  useEffect(() => {
    const fetchFullLesson = async () => {
      setIsLoading(true);
      
      // Detect placeholder lessons
      const isPlaceholder = lessonProp?.subtitle === 'Content coming soon' || 
                          lessonProp?.description?.includes('coming soon');
      
      // If we have a placeholder or a lesson without sections, fetch the real one
      if (lessonProp?.id && (isPlaceholder || !lessonProp.sections)) {
        console.log(`📝 Fetching full lesson for "${lessonProp.title}" (${lessonProp.id})...`);
        
        try {
          const fullLesson = await LessonRepository.getLesson(lessonProp.id);
          
          if (fullLesson && fullLesson.sections) {
            console.log(`✅ Full lesson loaded with ${fullLesson.sections.length} sections`);
            setLesson(fullLesson);
          } else {
            // Try getLessonContent as fallback
            const content = getLessonContent(lessonProp.id);
            if (content && content.sections) {
              console.log(`📚 Lesson content loaded from getLessonContent`);
              setLesson({ ...lessonProp, ...content });
            } else {
              console.log(`⚠️ No full content found, using placeholder`);
              setLesson(lessonProp);
            }
          }
        } catch (error) {
          console.error('Error fetching lesson:', error);
          setLesson(lessonProp);
        }
      } else {
        // The provided lesson is already complete
        setLesson(lessonProp);
      }
      
      setIsLoading(false);
    };
    
    if (lessonProp) {
      fetchFullLesson();
    } else {
      setIsLoading(false);
    }
  }, [lessonProp]);

  // Track time in lesson
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeInLesson(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Initialize section from initialSection or URL or saved progress
  useEffect(() => {
    if (!lesson?.id) return;
    
    // First priority: initialSection prop (for resume functionality)
    if (initialSection !== undefined && initialSection > 0) {
      setCurrentSection(initialSection);
      return;
    }
    
    // Second priority: URL parameter
    const sectionFromUrl = searchParams?.get('section');
    if (sectionFromUrl) {
      const section = parseInt(sectionFromUrl, 10);
      setCurrentSection(section);
      setTimeout(() => {
        const element = document.getElementById(`section-${section}`);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 300);
      return;
    }

    // Third priority: saved progress
    const savedProgress = localStorage.getItem(`lesson-progress-${lesson.id}`);
    if (savedProgress) {
      const progress = JSON.parse(savedProgress);
      if (progress.currentSection > 0) {
        setCurrentSection(progress.currentSection);
        setTimeInLesson(progress.timeInLesson || 0);
        
        const notification = document.createElement('div');
        notification.className = 'fixed top-20 left-1/2 -translate-x-1/2 bg-purple-600 text-white px-6 py-3 rounded-xl shadow-xl z-[100] animate-slideDown';
        notification.innerHTML = `Resuming from Section ${progress.currentSection + 1}`;
        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 3000);
      }
    }
  }, [lesson?.id, initialSection, searchParams]);

  // Scroll to section after it's rendered (for resume functionality)
  useEffect(() => {
    if (initialSection > 0 && currentSection === initialSection) {
      const timer = setTimeout(() => {
        const element = document.getElementById(`section-${initialSection}`);
        if (element) {
          const yOffset = -100;
          const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
          window.scrollTo({ top: y, behavior: 'smooth' });
        }
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [currentSection, initialSection]);

  // Save progress
  useEffect(() => {
    if (!lesson?.id) return;
    
    const saveProgress = {
      pathId: chapter?.pathId || localStorage.getItem('currentPathId') || 'the-self',
      chapterId: chapter?.id,
      lessonId: lesson.id,
      section: currentSection,
      currentSection,
      timeInLesson,
      timestamp: new Date().toISOString()
    };
    
    localStorage.setItem(`lesson-progress-${lesson.id}`, JSON.stringify(saveProgress));
    localStorage.setItem('lastLessonProgress', JSON.stringify(saveProgress));
    
    const pathId = chapter?.pathId || localStorage.getItem('currentPathId');
    if (pathId) {
      localStorage.setItem(`path-progress-${pathId}`, JSON.stringify({
        lastChapterId: chapter?.id,
        lastLessonId: lesson.id,
        lastSection: currentSection
      }));
    }
    
    if (onSectionChange && currentSection !== initialSection) {
      onSectionChange(currentSection);
    }
  }, [currentSection, lesson?.id, chapter?.id, chapter?.pathId, timeInLesson, onSectionChange, initialSection]);

  // Scroll to top when section changes (but not on initial mount)
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentSection, showMeditation, showExercise, showReflection]);

  // NOW SAFE TO DO CONDITIONAL RETURNS AFTER ALL HOOKS

  // Early return if no lesson prop at all
  if (!lessonProp) {
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

  // Show loading indicator while fetching
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
          <p className="text-purple-300">Fetching content from Notion...</p>
        </div>
      </div>
    );
  }

  // Get content from the resolved lesson
  let content = lesson?.sections ? { sections: lesson.sections } : null;
  
  // Additional fallback if still no content
  if (!content && lesson?.id) {
    content = getLessonContent(lesson.id);
  }

  // If no content found at all
  if (!content || !content.sections || content.sections.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <BookOpen className="w-16 h-16 text-purple-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Content Coming Soon</h2>
          <p className="text-purple-300 mb-2">
            The content for lesson "{lesson?.title || 'Unknown'}" ({lesson?.id}) is being prepared.
          </p>
          <p className="text-purple-400 text-sm mb-6">
            Check back soon for the full lesson experience.
          </p>
          <div className="flex gap-4 justify-center">
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
  
  const totalSections = content.sections.length;
  const progress = ((currentSection + 1) / totalSections) * 100;

  // Quick save handler for FAB
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
        sectionId: content?.sections?.[currentSection]?.title || '',
        timeInLesson
      }
    };
    
    const existing = JSON.parse(localStorage.getItem('userInsights') || '[]');
    existing.unshift(insight);
    localStorage.setItem('userInsights', JSON.stringify(existing));
    
    window.dispatchEvent(new StorageEvent('storage', {
      key: 'userInsights',
      newValue: JSON.stringify(existing),
      url: window.location.href
    }));
    
    setHighlightedInsights(prev => [...prev, text]);
    if (onInsightCapture) onInsightCapture(insight);
  };

  // Share to Wall handler  
  const handleShareToWall = async (text: string) => {
    if (!lesson || !chapter) return;
    
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
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
    } else {
      const { error } = await supabase
        .from('community_insights')
        .insert({
          user_id: user.id,
          username: 'Anonymous Seeker',
          insight: text,
          category: 'captured'
        });
      
      if (error) {
        console.error('Error sharing to wall:', error);
      }
    }
    
    handleQuickSave(text);
    
    const notification = document.createElement('div');
    notification.className = 'fixed top-4 right-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-6 py-3 rounded-xl shadow-xl z-[100] animate-slideIn flex items-center gap-2';
    notification.innerHTML = `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>Shared to Wall of Wisdom!`;
    document.body.appendChild(notification);
    setTimeout(() => {
      notification.style.opacity = '0';
      notification.style.transform = 'translateX(100px)';
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  };

  const handleSectionComplete = () => {
    if (currentSection < totalSections - 1) {
      const nextSection = currentSection + 1;
      setCurrentSection(nextSection);
      if (onSectionChange) {
        onSectionChange(nextSection);
      }
    } else if (content.meditation && !meditationCompleted) {
      setShowMeditation(true);
    } else if (content.exercise && !exerciseCompleted) {
      setShowExercise(true);
    } else if (content.reflection && !reflectionCompleted) {
      setShowReflection(true);
    } else {
      handleLessonComplete();
    }
  };

  const handleLessonComplete = () => {
    if (!hasCompletedLesson) {
      setIsCompleted(true);
    }
  };

  const renderSection = (section: any, index: number) => {
    if (index !== currentSection) return null;

    // Add null check for section
    if (!section) {
      console.error('Section is undefined at index:', index);
      return (
        <div className="text-center py-12">
          <p className="text-purple-300">Section not found</p>
        </div>
      );
    }

    return (
      <motion.div
        id={`section-${index}`}
        key={`section-${index}`}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        className="max-w-4xl mx-auto"
      >
        {(section.type === 'text' || section.type === 'introduction' || section.type === 'teaching' || section.type === 'practice' || section.type === 'reflection') && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="relative"
          >
            <motion.div
              className="absolute -top-10 -left-10 w-20 h-20 bg-purple-500/10 rounded-full blur-2xl"
              animate={{ 
                x: [0, 30, 0],
                y: [0, -20, 0],
              }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
              className="absolute -bottom-10 -right-10 w-32 h-32 bg-pink-500/10 rounded-full blur-3xl"
              animate={{ 
                x: [0, -20, 0],
                y: [0, 30, 0],
              }}
              transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            />
            
            <div className="relative">
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl opacity-20 group-hover:opacity-30 blur transition duration-1000 group-hover:duration-200" />
                
                <div className="relative bg-black/40 backdrop-blur-xl rounded-3xl overflow-hidden">
                  <motion.div 
                    className="h-1 bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 1, delay: 0.5 }}
                  />
                  
                  <div className="p-8 lg:p-10">
                    {section.title && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="mb-8"
                      >
                        <div className="flex items-center gap-4 mb-4">
                          <motion.div 
                            className="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg"
                            whileHover={{ scale: 1.1, rotate: 5 }}
                          >
                            <Lightbulb className="w-6 h-6 text-white" />
                          </motion.div>
                          <div>
                            <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-200 to-pink-200 bg-clip-text text-transparent">
                              {section.title}
                            </h2>
                            <p className="text-purple-400 text-sm mt-1">Section {index + 1} of {totalSections}</p>
                          </div>
                        </div>
                        <motion.div 
                          className="h-px bg-gradient-to-r from-transparent via-purple-500/30 to-transparent"
                          initial={{ scaleX: 0 }}
                          animate={{ scaleX: 1 }}
                          transition={{ duration: 0.8, delay: 0.4 }}
                        />
                      </motion.div>
                    )}
                    
                    <div 
                      ref={contentRef}
                      className="prose prose-lg prose-invert max-w-none"
                    >
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="text-purple-100/90 leading-relaxed space-y-6 select-text"
                        dangerouslySetInnerHTML={{ __html: renderFormattedContent(section.content) }}
                      />
                    </div>
                    
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1 }}
                      className="mt-8 p-4 bg-gradient-to-r from-purple-600/10 to-pink-600/10 rounded-2xl border border-purple-500/20"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-amber-500/20 rounded-lg flex items-center justify-center">
                          <Sparkles className="w-4 h-4 text-amber-400" />
                        </div>
                        <p className="text-purple-300 text-sm">
                          Pro tip: Highlight any text to capture it as an insight using the floating button
                        </p>
                      </div>
                    </motion.div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {section.type === 'quote' && (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 via-pink-600/10 to-indigo-600/10 blur-3xl" />
            
            <div className="relative bg-gradient-to-br from-purple-900/30 to-pink-900/30 backdrop-blur-xl rounded-3xl p-10 border border-purple-500/20">
              <Quote className="absolute top-6 left-6 w-8 h-8 text-purple-500/30" />
              <Quote className="absolute bottom-6 right-6 w-8 h-8 text-purple-500/30 rotate-180" />
              
              <div className="relative z-10">
                <p className="text-2xl md:text-3xl font-light text-transparent bg-clip-text bg-gradient-to-r from-purple-200 via-pink-200 to-indigo-200 italic leading-relaxed text-center">
                  {section.content}
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {section.type === 'video' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative bg-black/40 backdrop-blur-xl rounded-3xl p-8 border border-purple-500/20"
          >
            <div className="flex items-center gap-3 mb-6">
              <Video className="w-6 h-6 text-purple-400" />
              <h3 className="text-xl font-semibold text-white">{section.title}</h3>
              <span className="text-purple-300 text-sm">({section.duration} min)</span>
            </div>
            <div className="aspect-video bg-gradient-to-br from-purple-900/50 to-pink-900/50 rounded-2xl flex items-center justify-center group hover:from-purple-900/60 hover:to-pink-900/60 transition-all cursor-pointer">
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center"
              >
                <Play className="w-10 h-10 text-white ml-1" />
              </motion.div>
            </div>
          </motion.div>
        )}
      </motion.div>
    );
  };

  const renderMeditation = () => {
    if (!content?.meditation || !showMeditation) return null;

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-4xl mx-auto"
      >
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/20 to-purple-600/20 blur-3xl" />
          
          <div className="relative bg-gradient-to-br from-indigo-900/30 to-purple-900/30 backdrop-blur-xl rounded-3xl p-10 border border-purple-500/20">
            <div className="text-center mb-8">
              <motion.div
                className="w-16 h-16 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Heart className="w-8 h-8 text-white" />
              </motion.div>
              <h2 className="text-3xl font-bold text-white mb-2">{content.meditation.title}</h2>
              <p className="text-purple-300">Duration: {content.meditation.duration} minutes</p>
            </div>
            
            <div className="space-y-4 mb-8">
              {content.meditation.guidance.map((step: string, index: number) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start gap-4 group"
                >
                  <div className="w-10 h-10 bg-purple-600/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1 group-hover:bg-purple-600/30 transition-colors">
                    <span className="text-purple-300 text-sm font-semibold">{index + 1}</span>
                  </div>
                  <p className="text-purple-100/80 leading-relaxed">{step}</p>
                </motion.div>
              ))}
            </div>

            <div className="flex justify-center gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setMeditationCompleted(true);
                  if (isFromQuest && onMeditationTrigger) {
                    onMeditationTrigger();
                  }
                  setShowMeditation(false);
                  handleSectionComplete();
                }}
                className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl text-white font-semibold hover:shadow-lg hover:shadow-purple-500/25 transition-all"
              >
                Complete Meditation
              </motion.button>
              
              <button
                onClick={() => {
                  setMeditationCompleted(true);
                  setShowMeditation(false);
                  handleSectionComplete();
                }}
                className="px-6 py-3 bg-white/10 backdrop-blur-sm text-gray-300 rounded-xl hover:bg-white/20 transition-all"
              >
                Skip for now
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

  const renderExercise = () => {
    if (!content?.exercise || !showExercise) return null;

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-4xl mx-auto"
      >
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/20 to-teal-600/20 blur-3xl" />
          
          <div className="relative bg-gradient-to-br from-emerald-900/30 to-teal-900/30 backdrop-blur-xl rounded-3xl p-10 border border-emerald-500/20">
            <div className="text-center mb-8">
              <motion.div
                className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full mx-auto mb-4 flex items-center justify-center"
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
              >
                <Edit3 className="w-8 h-8 text-white" />
              </motion.div>
              <h2 className="text-3xl font-bold text-white mb-2">{content.exercise.title}</h2>
              <p className="text-emerald-300">
                Type: {content.exercise.type} • Duration: {content.exercise.duration} minutes
              </p>
            </div>
            
            <div className="space-y-4 mb-8">
              {content.exercise.instructions.map((instruction: string, index: number) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start gap-3 group"
                >
                  <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-1 group-hover:text-emerald-300 transition-colors" />
                  <p className="text-emerald-100/80 leading-relaxed">{instruction}</p>
                </motion.div>
              ))}
            </div>

            <div className="flex justify-center gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setExerciseCompleted(true);
                  setShowExercise(false);
                  handleSectionComplete();
                }}
                className="px-8 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-xl text-white font-semibold hover:shadow-lg hover:shadow-emerald-500/25 transition-all"
              >
                Complete Exercise
              </motion.button>
              
              <button
                onClick={() => {
                  setExerciseCompleted(true);
                  setShowExercise(false);
                  handleSectionComplete();
                }}
                className="px-6 py-3 bg-white/10 backdrop-blur-sm text-gray-300 rounded-xl hover:bg-white/20 transition-all"
              >
                Skip for now
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

  const renderReflection = () => {
    if (!content?.reflection || !showReflection) return null;

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-4xl mx-auto"
      >
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-br from-amber-600/20 to-orange-600/20 blur-3xl" />
          
          <div className="relative bg-gradient-to-br from-amber-900/30 to-orange-900/30 backdrop-blur-xl rounded-3xl p-10 border border-amber-500/20">
            <div className="text-center mb-8">
              <motion.div
                className="w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-600 rounded-full mx-auto mb-4 flex items-center justify-center"
                animate={{ rotate: [0, 180, 360] }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              >
                <Star className="w-8 h-8 text-white" />
              </motion.div>
              <h2 className="text-3xl font-bold text-white mb-2">Reflection Time</h2>
              <p className="text-amber-300">Take a moment to integrate what you've learned</p>
            </div>
            
            <div className="space-y-6">
              {content.reflection.map((prompt: any, index: number) => (
                <motion.div 
                  key={index} 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-black/30 rounded-2xl p-6 backdrop-blur-sm"
                >
                  <p className="text-white mb-4 font-medium">{prompt.question}</p>
                  
                  {prompt.type === 'text' && (
                    <textarea
                      className="w-full p-4 bg-white/10 border border-amber-500/30 rounded-xl text-white placeholder-amber-300/50 focus:border-amber-500/50 focus:outline-none resize-none backdrop-blur-sm"
                      rows={3}
                      placeholder="Share your thoughts..."
                      value={reflectionAnswers[index] || ''}
                      onChange={(e) => setReflectionAnswers({ ...reflectionAnswers, [index]: e.target.value })}
                    />
                  )}
                  
                  {prompt.type === 'rating' && (
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(rating => (
                        <motion.button
                          key={rating}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => setReflectionAnswers({ ...reflectionAnswers, [index]: rating })}
                          className={`
                            w-10 h-10 rounded-lg flex items-center justify-center transition-all font-medium
                            ${reflectionAnswers[index] === rating
                              ? 'bg-gradient-to-br from-amber-500 to-orange-500 text-white shadow-lg'
                              : 'bg-white/10 text-amber-300/70 hover:bg-white/20'
                            }
                          `}
                        >
                          {rating}
                        </motion.button>
                      ))}
                    </div>
                  )}
                  
                  {prompt.type === 'choice' && prompt.options && (
                    <div className="space-y-2">
                      {prompt.options.map((option: string, optionIndex: number) => (
                        <motion.button
                          key={optionIndex}
                          whileHover={{ x: 5 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setReflectionAnswers({ ...reflectionAnswers, [index]: option })}
                          className={`
                            w-full p-3 rounded-xl text-left transition-all
                            ${reflectionAnswers[index] === option
                              ? 'bg-gradient-to-r from-amber-500/30 to-orange-500/30 text-white border border-amber-500/50'
                              : 'bg-white/10 text-amber-100/70 border border-amber-500/20 hover:bg-white/20'
                            }
                          `}
                        >
                          {option}
                        </motion.button>
                      ))}
                    </div>
                  )}
                </motion.div>
              ))}
            </div>

            <div className="flex justify-center gap-4 mt-8">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setReflectionCompleted(true);
                  if (isFromQuest && onInsightCapture && Object.keys(reflectionAnswers).length > 0) {
                    onInsightCapture(reflectionAnswers);
                  }
                  handleLessonComplete();
                }}
                className="px-8 py-3 bg-gradient-to-r from-amber-600 to-orange-600 rounded-xl text-white font-semibold hover:shadow-lg hover:shadow-amber-500/25 transition-all"
              >
                Submit Reflection
              </motion.button>
              
              <button
                onClick={() => {
                  setReflectionCompleted(true);
                  handleLessonComplete();
                }}
                className="px-6 py-3 bg-white/10 backdrop-blur-sm text-gray-300 rounded-xl hover:bg-white/20 transition-all"
              >
                Skip Reflection
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

  const handlePreviousSection = () => {
    if (currentSection > 0) {
      const prevSection = currentSection - 1;
      setCurrentSection(prevSection);
      if (onSectionChange) {
        onSectionChange(prevSection);
      }
    }
  };

  const handleNextSection = () => {
    handleSectionComplete();
  };

  return (
    <div className="min-h-screen relative">
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

      <div className="sticky top-0 z-20 bg-black/30 backdrop-blur-xl rounded-3xl p-6 mb-8 border border-purple-500/20">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            {onBack && (
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={onBack}
                className="p-2 hover:bg-purple-500/20 rounded-lg transition-colors"
                aria-label="Back to chapter"
              >
                <ChevronLeft className="w-5 h-5 text-purple-300" />
              </motion.button>
            )}
            
            <div>
              <h1 className="text-2xl font-bold text-white mb-1">{lesson?.title || 'Unknown Lesson'}</h1>
              <div className="flex items-center gap-4 text-sm text-purple-300">
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {lesson?.duration || 15} min
                </span>
                <span className="flex items-center gap-1">
                  <BookOpen className="w-4 h-4" />
                  {chapter?.title || 'Unknown Chapter'}
                </span>
              </div>
            </div>
          </div>
          
          <div className="text-right">
            <p className="text-purple-400 text-sm mb-1">Section {currentSection + 1} of {totalSections}</p>
            <div className="flex items-center gap-2">
              <div className="w-32 h-2 bg-gray-900/50 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-purple-600 to-pink-600"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
              <span className="text-white text-sm font-semibold">{Math.round(progress)}%</span>
            </div>
          </div>
        </div>
      </div>

      <div className="relative">
        <AnimatePresence mode="wait">
          {!showMeditation && !showExercise && !showReflection && 
            content.sections && content.sections[currentSection] &&
            renderSection(content.sections[currentSection], currentSection)}
        </AnimatePresence>
        {renderMeditation()}
        {renderExercise()}
        {renderReflection()}
      </div>

      {!showMeditation && !showExercise && !showReflection && !isCompleted && (
        <div className="flex justify-between items-center mt-8">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handlePreviousSection}
            disabled={currentSection === 0}
            className={`
              flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all
              ${currentSection === 0
                ? 'bg-gray-900/30 text-gray-600 cursor-not-allowed'
                : 'bg-purple-600/20 text-purple-300 hover:bg-purple-600/30 backdrop-blur-sm'
              }
            `}
          >
            <ChevronLeft className="w-5 h-5" />
            Previous
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleNextSection}
            className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl text-white font-semibold hover:shadow-lg hover:shadow-purple-500/25 transition-all"
          >
            {currentSection < totalSections - 1 ? 'Continue' : 
             content.meditation && !meditationCompleted ? 'Start Meditation' :
             content.exercise && !exerciseCompleted ? 'Start Exercise' :
             content.reflection && !reflectionCompleted ? 'Reflect' : 'Complete Lesson'}
            <ChevronRight className="w-5 h-5" />
          </motion.button>
        </div>
      )}

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
            sectionId: content?.sections[currentSection]?.title || '',
            timeInLesson
          }}
        />
      )}

      {lesson && (
        <InsightCapture
          isOpen={showInsightCapture}
          onClose={() => {
            setShowInsightCapture(false);
            setSelectedText('');
          }}
          lessonId={lesson.id}
          lessonTitle={lesson.title}
          sectionId={content?.sections[currentSection]?.title}
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

      {isCompleted && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="fixed inset-0 flex items-center justify-center z-50 bg-black/50 backdrop-blur-sm"
        >
          <motion.div
            initial={{ y: 20 }}
            animate={{ y: 0 }}
            className="bg-gradient-to-br from-purple-900 to-pink-900 rounded-3xl p-8 max-w-md text-center border border-purple-500/30"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            >
              <CheckCircle className="w-20 h-20 text-green-400 mx-auto mb-4" />
            </motion.div>
            <h2 className="text-3xl font-bold text-white mb-2">Lesson Complete!</h2>
            <p className="text-purple-200 mb-6">You've earned {lesson?.xpReward || 5} XP</p>
            
            {highlightedInsights.length > 0 && (
              <div className="mb-6 p-4 bg-black/30 rounded-xl">
                <p className="text-purple-300 text-sm mb-2">You captured {highlightedInsights.length} insight{highlightedInsights.length > 1 ? 's' : ''} in this lesson</p>
                <div className="flex justify-center gap-2">
                  {Array.from({ length: Math.min(highlightedInsights.length, 5) }).map((_, i) => (
                    <div key={i} className="w-2 h-2 bg-amber-400 rounded-full" />
                  ))}
                </div>
              </div>
            )}
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                if (!hasCompletedLesson) {
                  setHasCompletedLesson(true);
                  onComplete();
                  setIsCompleted(false);
                  if (onNext) {
                    onNext();
                  }
                }
              }}
              disabled={hasCompletedLesson}
              className={`px-8 py-3 rounded-xl font-semibold transition-all ${
                hasCompletedLesson 
                  ? 'bg-gray-600 text-gray-400 cursor-not-allowed' 
                  : 'bg-white text-purple-900 hover:bg-purple-100'
              }`}
            >
              {hasCompletedLesson ? 'Processing...' : 'Continue Journey'}
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};