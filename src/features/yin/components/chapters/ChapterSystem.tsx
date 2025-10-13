// src/features/yin/components/chapters/ChapterSystem.tsx
// Version: 5.1.0 - Fixed syntax and async issues
'use client';

import { pathsData } from '@/features/yin/data/enhancedPathsData';
import { LessonRepository } from '@/features/yin/services/lessonRepository';
import { useXP } from '@/features/yin/xp/useXP';
import { AnimatePresence, motion } from 'framer-motion';
import { BookOpen, ChevronLeft, Zap } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import EnhancedChapterCard from './EnhancedChapterCard';
import { LessonPlayer } from './LessonPlayer';
import PathsView from './PathsView';
import UnlockConfirmDialog from './UnlockConfirmDialog';

// XP Configuration
const XP_CONFIG = {
  PATH_COSTS: {
    FIRST: 0,
    SECOND: 100,
    THIRD: 200,
    FOURTH: 300,
    ADDITIONAL: 500
  },
  CHAPTER_COST: 50,
  LESSON_UNLOCK_COST: 100,
  REWARDS: {
    LESSON_COMPLETE: 5,
    CHAPTER_COMPLETE: 0,
    INSIGHT_CAPTURE: 5,
    MEDITATION_COMPLETE: 10
  }
}; // THIS WAS MISSING

// Updated chapter data matching the screenshot
const getChaptersForPath = (pathId: string) => {
  const mockChapters: Record<string, any[]> = {
    'the-self': [
      {
        id: 'the-self-ch01',
        title: 'Overview of The Self',
        subtitle: 'Introduction to self-awareness',
        description: 'Begin your journey by understanding the fundamental nature of self-awareness and consciousness.',
        order: 1,
        lessons: [
          { id: '2893385abd61819ea80df6b05144ee82', title: 'Notion Lesson Test', duration: 15, xpReward: 5 },
          { id: 'L0001', title: 'The Journey Into Self', duration: 15, xpReward: 5 },
          { id: 'L0002', title: 'The Observer and Observed', duration: 15, xpReward: 5 },
          { id: 'L0003', title: 'Beginning Your Practice', duration: 20, xpReward: 5 }
        ]
      },
      {
        id: 'the-self-ch02',
        title: 'The Stages of Self',
        subtitle: 'Evolution of consciousness',
        description: 'Explore the different stages of self-development and how consciousness evolves through time.',
        order: 2,
        lessons: [
          { id: 'L0004', title: 'Understanding Development', duration: 15, xpReward: 5 },
          { id: 'L0005', title: 'Stages of Growth', duration: 20, xpReward: 5 },
          { id: 'L0006', title: 'Integration of Stages', duration: 20, xpReward: 5 }
        ]
      },
      {
        id: 'the-self-ch03',
        title: 'The Types of Selves',
        subtitle: 'Multiple dimensions of self',
        description: 'Discover the various aspects and types of self that exist within your consciousness.',
        order: 3,
        lessons: [
          { id: 'L0007', title: 'The Physical Self', duration: 15, xpReward: 5 },
          { id: 'L0008', title: 'The Emotional Self', duration: 20, xpReward: 5 },
          { id: 'L0009', title: 'The Mental Self', duration: 15, xpReward: 5 },
          { id: 'L0010', title: 'The Spiritual Self', duration: 20, xpReward: 5 }
        ]
      },
      {
        id: 'the-self-ch04',
        title: 'Self Image & Identity',
        subtitle: 'How we see ourselves',
        description: 'Examine the constructs of self-image and identity, and how they shape our reality.',
        order: 4,
        lessons: [
          { id: 'L0011', title: 'The Mirror of Perception', duration: 15, xpReward: 5 },
          { id: 'L0012', title: 'Beliefs and Identity', duration: 20, xpReward: 5 },
          { id: 'L0013', title: 'Breaking False Identifications', duration: 25, xpReward: 5 }
        ]
      },
      {
        id: 'the-self-ch05',
        title: 'Elements of The Self',
        subtitle: 'Core components of being',
        description: 'Understand the fundamental elements that comprise your sense of self.',
        order: 5,
        lessons: [
          { id: 'L0014', title: 'Core Elements', duration: 20, xpReward: 5 },
          { id: 'L0015', title: 'The Shadow', duration: 25, xpReward: 5 },
          { id: 'L0016', title: 'The Higher Self', duration: 20, xpReward: 5 }
        ]
      },
      {
        id: 'the-self-ch06',
        title: 'The Soul, The Self & The Ego',
        subtitle: 'Three aspects of being',
        description: 'Explore the relationship between soul, self, and ego in your journey of understanding.',
        order: 6,
        lessons: [
          { id: 'L0017', title: 'Understanding the Soul', duration: 20, xpReward: 5 },
          { id: 'L0018', title: 'The Ego Structure', duration: 20, xpReward: 5 },
          { id: 'L0019', title: 'The True Self', duration: 20, xpReward: 5 },
          { id: 'L0020', title: 'Harmonizing All Three', duration: 25, xpReward: 5 }
        ]
      },
      {
        id: 'the-self-ch07',
        title: 'The Never Ending Journey of Self',
        subtitle: 'Continuous evolution',
        description: 'Understand how self-discovery is an ongoing, ever-deepening process.',
        order: 7,
        lessons: [
          { id: 'L0021', title: 'The Spiral Path', duration: 15, xpReward: 5 },
          { id: 'L0022', title: 'Cycles of Growth', duration: 20, xpReward: 5 },
          { id: 'L0023', title: 'Embracing Change', duration: 20, xpReward: 5 }
        ]
      },
      {
        id: 'the-self-ch08',
        title: 'Self Connection',
        subtitle: 'Deepening relationship with self',
        description: 'Cultivate a deeper, more authentic connection with your true nature.',
        order: 8,
        lessons: [
          { id: 'L0024', title: 'Practices for Connection', duration: 20, xpReward: 5 },
          { id: 'L0025', title: 'Living in Alignment', duration: 25, xpReward: 5 },
          { id: 'L0026', title: 'Integration and Embodiment', duration: 30, xpReward: 5 }
        ]
      }
    ],
    'inward-journey': [
      {
        id: 'inward-ch01',
        title: 'Preparing for the Journey',
        subtitle: 'Getting ready for inner exploration',
        description: 'Set the foundation for your inward journey with preparation and intention.',
        order: 1,
        lessons: [
          { id: 'L0101', title: 'The Call to Journey Inward', duration: 15, xpReward: 5 },
          { id: 'L0102', title: 'Creating Sacred Space', duration: 15, xpReward: 5 }
        ]
      },
      {
        id: 'inward-ch02',
        title: 'The Descent',
        subtitle: 'Going deeper within',
        description: 'Learn techniques for deep introspection and inner exploration.',
        order: 2,
        lessons: [
          { id: 'L0103', title: 'Meditation Techniques', duration: 20, xpReward: 5 },
          { id: 'L0104', title: 'Dream Work', duration: 25, xpReward: 5 }
        ]
      }
    ],
    'energy-bodies': [
      {
        id: 'energy-ch01',
        title: 'Introduction to Energy',
        subtitle: 'Understanding subtle energy',
        description: 'Learn about the subtle energy systems that influence your physical and mental state.',
        order: 1,
        lessons: [
          { id: 'L0201', title: 'The Subtle Body', duration: 20, xpReward: 5 },
          { id: 'L0202', title: 'Energy Centers', duration: 25, xpReward: 5 }
        ]
      },
      {
        id: 'energy-ch02',
        title: 'Working with Energy',
        subtitle: 'Practical energy exercises',
        description: 'Hands-on practices for sensing and directing energy.',
        order: 2,
        lessons: [
          { id: 'L0203', title: 'Breathwork for Energy', duration: 20, xpReward: 5 },
          { id: 'L0204', title: 'Energy Healing Basics', duration: 30, xpReward: 5 }
        ]
      }
    ]
  };
  
  return mockChapters[pathId] || [];
};

// Helper function for path unlock cost
function getPathUnlockCost(pathNumber: number): number {
  const costs = XP_CONFIG.PATH_COSTS;
  switch(pathNumber) {
    case 1: return costs.FIRST;
    case 2: return costs.SECOND;
    case 3: return costs.THIRD;
    case 4: return costs.FOURTH;
    default: return costs.ADDITIONAL;
  }
}

interface ChapterSystemProps {
  userId?: string;
  resumeData?: {
    pathId?: string;
    chapterId?: string;
    lessonId?: string;
    section?: number;
  } | null;
  onResume?: (lastProgress: any) => any;
}

export default function ChapterSystem({ 
  userId = 'default-user',
  resumeData,
  onResume
}: ChapterSystemProps) {
  // XP System
  const { currentXP, addXP, spendXP, canAfford } = useXP();
  
  // View state
  const [currentView, setCurrentView] = useState<'paths' | 'chapters' | 'lesson'>('paths');
  const [selectedPath, setSelectedPath] = useState<any>(null);
  const [selectedChapter, setSelectedChapter] = useState<any>(null);
  const [selectedLesson, setSelectedLesson] = useState<any>(null);
  const [chaptersList, setChaptersList] = useState<any[]>([]);
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
  const [currentSection, setCurrentSection] = useState(0);
  
  // Progress state
  const [unlockedPaths, setUnlockedPaths] = useState<string[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('chapter_progress');
      if (saved) {
        const data = JSON.parse(saved);
        return data.savedUnlockedPaths || [];
      }
    }
    return [];
  });

  const [unlockedChapters, setUnlockedChapters] = useState<string[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('chapter_progress');
      if (saved) {
        const data = JSON.parse(saved);
        return data.savedUnlockedChapters || [];
      }
    }
    return [];
  });

  const [completedLessons, setCompletedLessons] = useState<string[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('chapter_progress');
      if (saved) {
        const data = JSON.parse(saved);
        return data.completedLessons || [];
      }
    }
    return [];
  });

  const [unlockedLessons, setUnlockedLessons] = useState<string[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('chapter_progress');
      if (saved) {
        const data = JSON.parse(saved);
        return data.unlockedLessons || [];
      }
    }
    return [];
  });

  const [userPathProgress, setUserPathProgress] = useState<Record<string, number>>({});
  
  const [lessonProgress, setLessonProgress] = useState<Record<string, any>>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('lesson_progress_detail');
      return saved ? JSON.parse(saved) : {};
    }
    return {};
  });
  
  // Confirmation dialog state
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    type: 'path' | 'chapter' | 'lesson';
    item: any;
    cost: number;
    callback?: () => void;
    insufficientXP?: boolean;
  }>({
    isOpen: false,
    type: 'path',
    item: null,
    cost: 0,
    insufficientXP: false
  });

  // Save lesson progress to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('lesson_progress_detail', JSON.stringify(lessonProgress));
    }
  }, [lessonProgress]);

  // Save overall chapter progress
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const progressData = {
        savedUnlockedPaths: unlockedPaths,
        savedUnlockedChapters: unlockedChapters,
        completedLessons,
        unlockedLessons,
        lessonProgress
      };
      localStorage.setItem('chapter_progress', JSON.stringify(progressData));
    }
  }, [unlockedPaths, unlockedChapters, completedLessons, unlockedLessons, lessonProgress]);

  // Load chapters when path is selected
  useEffect(() => {
    if (selectedPath) {
      const chapters = getChaptersForPath(selectedPath.id);
      const enhancedChapters = chapters.map((ch, index) => {
        const isFirstChapter = index === 0;
        const isUnlocked = isFirstChapter || unlockedChapters.includes(ch.id);
        const unlockCost = isFirstChapter ? 0 : XP_CONFIG.CHAPTER_COST;

        const chapterLessons = ch.lessons || [];
        const completedInChapter = chapterLessons.filter(
          lesson => completedLessons.includes(lesson.id)
        ).length;
        const progress = chapterLessons.length > 0 
          ? Math.round((completedInChapter / chapterLessons.length) * 100)
          : 0;
        
        return {
          ...ch,
          progress,
          completedLessons: completedInChapter,
          totalLessons: chapterLessons.length,
          icon: selectedPath.icon,
          color: selectedPath.gradient,
          unlocked: isUnlocked,
          requiredXP: unlockCost,
          totalDuration: chapterLessons.reduce((sum, l) => sum + (l.duration || 15), 0),
          xpReward: chapterLessons.reduce((sum, l) => sum + (l.xpReward || 5), 0)
        };
      });
      
      setChaptersList(enhancedChapters);
    }
  }, [selectedPath, unlockedChapters, completedLessons]);

  // Auto-unlock next chapter when current chapter is completed
  useEffect(() => {
    if (selectedPath && chaptersList.length > 0) {
      chaptersList.forEach((chapter, index) => {
        if (chapter.progress === 100 && index < chaptersList.length - 1) {
          const nextChapter = chaptersList[index + 1];
          if (!unlockedChapters.includes(nextChapter.id)) {
            setUnlockedChapters(prev => [...prev, nextChapter.id]);
          }
        }
      });
    }
  }, [chaptersList, selectedPath, unlockedChapters]);

  // Calculate path progress
  const calculatePathProgress = useCallback(() => {
    const progress: Record<string, number> = {};
    
    pathsData.forEach(path => {
      const chapters = getChaptersForPath(path.id);
      const totalLessons = chapters.reduce((sum: number, ch: any) => {
        return sum + (ch.lessons?.length || 0);
      }, 0);
      
      if (totalLessons === 0) {
        progress[path.id] = 0;
        return;
      }
      
      const completedInPath = completedLessons.filter(lessonId => {
        return chapters.some((ch: any) => 
          ch.lessons?.some((l: any) => l.id === lessonId)
        );
      }).length;
      
      progress[path.id] = Math.round((completedInPath / totalLessons) * 100);
    });
    
    return progress;
  }, [completedLessons]);

  // Update path progress when lessons complete
  useEffect(() => {
    const newProgress = calculatePathProgress();
    setUserPathProgress(newProgress);
  }, [completedLessons, calculatePathProgress]);

  // Handle Resume button - FIXED DUPLICATE CODE
  const handleResume = async (pathId: string) => {
    const pathChapters = getChaptersForPath(pathId);
    let lastLesson = null;
    let lastChapter = null;
    let lastSection = 0;
    
    const lastProgress = localStorage.getItem('lastLessonProgress');
    if (lastProgress) {
      const progress = JSON.parse(lastProgress);
      if (progress.pathId === pathId) {
        for (const chapter of pathChapters) {
          const lesson = chapter.lessons?.find((l: any) => l.id === progress.lessonId);
          if (lesson) {
            lastLesson = lesson;
            lastChapter = chapter;
            lastSection = progress.currentSection || 0;
            break;
          }
        }
      }
    }
    
    // If no saved progress, find first incomplete lesson
    if (!lastLesson) {
      for (const chapter of pathChapters) {
        for (const lesson of chapter.lessons || []) {
          if (!completedLessons.includes(lesson.id)) {
            lastLesson = lesson;
            lastChapter = chapter;
            lastSection = 0;
            break;
          }
        }
        if (lastLesson) break;
      }
    }

    if (lastLesson && lastChapter) {
      // Await the async call
      const lessonContent = await LessonRepository.getLesson(lastLesson.id);
      const lessonWithContent = lessonContent || lastLesson;
      
      setSelectedPath(pathsData.find(p => p.id === pathId));
      setSelectedChapter(lastChapter);
      setSelectedLesson(lessonWithContent);
      setCurrentSection(lastSection);
      const lessonIndex = lastChapter.lessons.findIndex((l: any) => l.id === lastLesson.id);
      setCurrentLessonIndex(lessonIndex);
      setCurrentView('lesson');
    } else {
      handlePathSelect(pathsData.find(p => p.id === pathId));
    }
  };

  // Handle path selection
  const handlePathSelect = async (path: any) => {
    const pathIndex = unlockedPaths.length;
    
    if (pathIndex === 0 && !unlockedPaths.includes(path.id)) {
      setUnlockedPaths([path.id]);
      setSelectedPath(path);
      setCurrentView('chapters');
    } else if (unlockedPaths.includes(path.id)) {
      setSelectedPath(path);
      setCurrentView('chapters');
    } else {
      const cost = getPathUnlockCost(pathIndex + 1);
      
      if (!canAfford(cost)) {
        setConfirmDialog({
          isOpen: true,
          type: 'path',
          item: path,
          cost: cost,
          insufficientXP: true
        });
      } else {
        setConfirmDialog({
          isOpen: true,
          type: 'path',
          item: path,
          cost: cost,
          insufficientXP: false,
          callback: async () => {
            const success = await spendXP(cost, 'path', path.id);
            if (success) {
              setUnlockedPaths(prev => [...prev, path.id]);
              setSelectedPath(path);
              setCurrentView('chapters');
              setConfirmDialog(prev => ({ ...prev, isOpen: false }));
            }
          }
        });
      }
    }
  };

  // Handle lesson unlocking
  const handleUnlockLesson = async (lessonId: string, cost: number) => {
    if (canAfford(cost)) {
      setConfirmDialog({
        isOpen: true,
        type: 'lesson',
        item: { id: lessonId, title: 'Unlock Lesson' },
        cost,
        insufficientXP: false,
        callback: async () => {
          const success = await spendXP(cost, 'lesson', lessonId);
          if (success) {
            setUnlockedLessons(prev => [...prev, lessonId]);
            setConfirmDialog(prev => ({ ...prev, isOpen: false }));
          }
        }
      });
    }
  };

  // Handle lesson selection from EnhancedChapterCard
  const handleSelectLesson = async (lesson: any, chapter: any) => {
    // Show loading
    const loadingEl = document.createElement('div');
    loadingEl.className = 'fixed top-4 right-4 bg-purple-600 text-white px-4 py-2 rounded-lg z-50';
    loadingEl.textContent = 'Loading lesson...';
    document.body.appendChild(loadingEl);
    
    try {
      // Await the lesson fetch
      const lessonContent = await LessonRepository.getLesson(lesson.id);
      console.log('Fetched lesson:', lessonContent); // Debug log
      
      const lessonWithContent = lessonContent || lesson;
      
      setSelectedChapter(chapter);
      setSelectedLesson(lessonWithContent);
      const progress = lessonProgress[lesson.id];
      setCurrentSection(progress?.currentSection || 0);
      const lessonIndex = chapter.lessons.findIndex((l: any) => l.id === lesson.id);
      setCurrentLessonIndex(lessonIndex);
      setCurrentView('lesson');
    } catch (error) {
      console.error('Error loading lesson:', error);
    } finally {
      loadingEl.remove();
    }
  };

  // Handle chapter selection
  const handleChapterSelect = async (chapter: any, index: number) => {
    const isFirstChapter = index === 0;
    
    if (isFirstChapter || unlockedChapters.includes(chapter.id)) {
      setSelectedChapter(chapter);
      if (chapter.lessons && chapter.lessons.length > 0) {
        const lessonContent = await LessonRepository.getLesson(chapter.lessons[0].id);
        const lessonWithContent = lessonContent || chapter.lessons[0];
        
        setCurrentLessonIndex(0);
        setSelectedLesson(lessonWithContent);
        setCurrentSection(0);
        setCurrentView('lesson');
      }
      return;
    }
    
    const unlockCost = XP_CONFIG.CHAPTER_COST;
    
    if (!canAfford(unlockCost)) {
      setConfirmDialog({
        isOpen: true,
        type: 'chapter',
        item: chapter,
        cost: unlockCost,
        insufficientXP: true
      });
    } else {
      setConfirmDialog({
        isOpen: true,
        type: 'chapter',
        item: chapter,
        cost: unlockCost,
        insufficientXP: false,
        callback: async () => {
          const success = await spendXP(unlockCost, 'chapter', chapter.id);
          if (success) {
            setUnlockedChapters(prev => [...prev, chapter.id]);
            setSelectedChapter(chapter);
            if (chapter.lessons && chapter.lessons.length > 0) {
              const lessonContent = await LessonRepository.getLesson(chapter.lessons[0].id);
              const lessonWithContent = lessonContent || chapter.lessons[0];
              setCurrentLessonIndex(0);
              setSelectedLesson(lessonWithContent);
              setCurrentSection(0);
              setCurrentView('lesson');
            }
            setConfirmDialog(prev => ({ ...prev, isOpen: false }));
          }
        }
      });
    }
  };

  // Handle lesson completion
  const handleLessonComplete = async () => {
    if (selectedLesson && selectedChapter) {
      const xpGain = XP_CONFIG.REWARDS.LESSON_COMPLETE;
      addXP(xpGain, 'lessons', `Completed lesson: ${selectedLesson.title}`);
      
      setCompletedLessons(prev => {
        if (!prev.includes(selectedLesson.id)) {
          return [...prev, selectedLesson.id];
        }
        return prev;
      });
      
      setLessonProgress(prev => ({
        ...prev,
        [selectedLesson.id]: {
          ...prev[selectedLesson.id],
          completed: true,
          progressPercent: 100
        }
      }));
      
      if (currentLessonIndex < selectedChapter.lessons.length - 1) {
        const nextIndex = currentLessonIndex + 1;
        const nextLesson = selectedChapter.lessons[nextIndex];
        // Await here too
        const lessonContent = await LessonRepository.getLesson(nextLesson.id);
        const lessonWithContent = lessonContent || nextLesson;
        
        setCurrentLessonIndex(nextIndex);
        setSelectedLesson(lessonWithContent);
        setCurrentSection(0);
      } else {
        setCurrentView('chapters');
        setSelectedLesson(null);
        setCurrentSection(0);
        setCurrentLessonIndex(0);
      }
    }
  };

  // Handle navigation
  const handleBack = () => {
    if (currentView === 'lesson') {
      setCurrentView('chapters');
      setSelectedLesson(null);
      setCurrentSection(0);
    } else if (currentView === 'chapters') {
      setCurrentView('paths');
      setSelectedPath(null);
      setSelectedChapter(null);
      setChaptersList([]);
    }
  };

  const handleNextLesson = async () => {
    if (selectedChapter && currentLessonIndex < selectedChapter.lessons.length - 1) {
      const nextIndex = currentLessonIndex + 1;
      const nextLesson = selectedChapter.lessons[nextIndex];
      const lessonContent = await LessonRepository.getLesson(nextLesson.id);
      const lessonWithContent = lessonContent || nextLesson;
      
      setCurrentLessonIndex(nextIndex);
      setSelectedLesson(lessonWithContent);
      setCurrentSection(0);
    } else if (selectedChapter && currentLessonIndex === selectedChapter.lessons.length - 1) {
      handleLessonComplete();
    }
  };

  const handleConfirmUnlock = () => {
    if (confirmDialog.callback && !confirmDialog.insufficientXP) {
      confirmDialog.callback();
    }
  };

  // Update lesson progress with section tracking - FIXED to be async
  const updateLessonProgress = useCallback(async (lessonId: string, sectionIndex: number) => {
  // Don't update if it's the same section
  if (lessonProgress[lessonId]?.currentSection === sectionIndex) {
    return;
  }
  
  let lesson = selectedLesson;
  if (!lesson || lesson.id !== lessonId) {
    lesson = await LessonRepository.getLesson(lessonId);
  }
  
  const totalSections = lesson?.sections?.length || 1;
  const progressPercent = Math.round(((sectionIndex + 1) / totalSections) * 100);

    setLessonProgress(prev => ({
    ...prev,
    [lessonId]: {
      currentSection: sectionIndex,
      totalSections,
      progressPercent,
      lastAccessed: Date.now(),
      type: lesson?.type || 'topic'
    }
  }));
}, [lessonProgress, selectedLesson]);

  return (
    <>
      {currentView !== 'paths' && (
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={handleBack}
          className="mb-6 flex items-center gap-2 text-purple-300 hover:text-purple-200 transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
          <span>Back to {currentView === 'lesson' ? 'Chapters' : 'Paths'}</span>
        </motion.button>
      )}

      <div className="flex justify-end mb-6">
        <div className="flex items-center gap-2 bg-gradient-to-r from-amber-500/20 to-orange-500/20 px-4 py-2 rounded-xl border border-amber-500/30">
          <Zap className="w-5 h-5 text-amber-400" />
          <span className="text-amber-300 font-bold">{currentXP} XP</span>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {currentView === 'paths' && (
          <motion.div
            key="paths"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-200 to-pink-200 mb-2">
              Choose Your Path
            </h2>
            <p className="text-purple-300 mb-8">Each path builds upon the last, unlocking deeper wisdom</p>
            
            <PathsView
              paths={pathsData}
              unlockedPaths={unlockedPaths}
              userPathProgress={userPathProgress}
              userXP={currentXP}
              onPathSelect={handlePathSelect}
              onResume={handleResume}
            />
          </motion.div>
        )}

        {currentView === 'chapters' && selectedPath && (
          <motion.div
            key="chapters"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="-mx-4 md:-mx-6 lg:-mx-8 mb-8 bg-purple-950/30 px-4 md:px-6 lg:px-8 py-8 border-y border-purple-500/20">
              <div className="flex items-start gap-6">
                <div className={`
                  w-20 h-20 rounded-2xl flex items-center justify-center
                  bg-gradient-to-br ${selectedPath.gradient}
                  shadow-lg
                `}>
                  <selectedPath.icon className="w-10 h-10 text-white" />
                </div>
                <div className="flex-1">
                  <h2 className="text-3xl font-bold text-white mb-2">{selectedPath.title}</h2>
                  <p className="text-purple-300 text-lg mb-4">{selectedPath.subtitle}</p>
                  <p className="text-purple-200/70 leading-relaxed">{selectedPath.longDescription}</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {chaptersList.length > 0 ? (
                chaptersList.map((chapter, index) => (
                  <EnhancedChapterCard
                    key={chapter.id}
                    chapter={chapter}
                    index={index}
                    onSelectLesson={(lesson) => handleSelectLesson(lesson, chapter)}
                    unlockedLessons={unlockedLessons}
                    completedLessons={completedLessons}
                    lessonProgress={lessonProgress}
                    onUnlockLesson={handleUnlockLesson}
                    currentXP={currentXP}
                  />
                ))
              ) : (
                <div className="text-center py-12 bg-black/30 backdrop-blur-xl rounded-3xl border border-purple-500/20">
                  <BookOpen className="w-12 h-12 text-purple-400 mx-auto mb-4" />
                  <p className="text-purple-300 text-lg">No chapters available yet</p>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {currentView === 'lesson' && selectedLesson && selectedChapter && (
          <motion.div
            key="lesson"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <LessonPlayer
              lesson={selectedLesson}
              chapter={{
                ...selectedChapter,
                pathId: selectedPath?.id
              }}
              initialSection={currentSection}
              onComplete={handleLessonComplete}
              onNext={handleNextLesson}
              onBack={handleBack}
              onInsightCapture={(insight) => {
                console.log('Insight captured:', insight);
                addXP(XP_CONFIG.REWARDS.INSIGHT_CAPTURE, 'insights', 'Captured insight');
              }}
              onMeditationTrigger={() => {
                console.log('Meditation completed');
                addXP(XP_CONFIG.REWARDS.MEDITATION_COMPLETE, 'meditation', 'Completed meditation');
              }}
              onInsightTrigger={() => {
                console.log('Insight triggered');
                addXP(XP_CONFIG.REWARDS.INSIGHT_CAPTURE, 'insights', 'Insight triggered');
              }}
              onSectionChange={(sectionIndex) => {
                setCurrentSection(sectionIndex);
                updateLessonProgress(selectedLesson.id, sectionIndex);
              }}
              isFromQuest={false}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <UnlockConfirmDialog
        isOpen={confirmDialog.isOpen}
        onClose={() => setConfirmDialog({ ...confirmDialog, isOpen: false })}
        onConfirm={handleConfirmUnlock}
        type={confirmDialog.type}
        item={confirmDialog.item}
        cost={confirmDialog.cost}
        currentXP={currentXP}
        insufficientXP={confirmDialog.insufficientXP}
      />
    </>
  );
}