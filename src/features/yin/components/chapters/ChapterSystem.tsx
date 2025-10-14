// File: src/features/yin/components/chapters/ChapterSystem.tsx
// Version: 6.0.0 - Fully data-driven, no hardcoded content
'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { BookOpen, ChevronLeft, Zap } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';

// Data imports - all content comes from these sources
import { pathsData } from '@/features/yin/data/enhancedPathsData';
import {
  getChaptersForPath as getGeneratedChapters,
  getLessonIdsForPath,
  lessonPathIndex
} from '@/features/yin/data/paths/generated-index';
import { LessonRepository } from '@/features/yin/services/lessonRepository';
import { useXP } from '@/features/yin/xp/useXP';

// Component imports
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
  // Initialize LessonRepository with path index
  useEffect(() => {
    LessonRepository.setPathIndex(lessonPathIndex);
  }, []);

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
  
  // Progress state - loaded from localStorage
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

  // Load and enhance chapters when path is selected
  useEffect(() => {
    if (selectedPath) {
      // Get content from generated index
      const generatedChapters = getGeneratedChapters(selectedPath.id);
      
      // Merge with UI metadata from enhancedPathsData
      const pathMetadata = pathsData.find(p => p.id === selectedPath.id);
      
      const enhancedChapters = generatedChapters.map((chapter, index) => {
        const isFirstChapter = index === 0;
        const isUnlocked = isFirstChapter || unlockedChapters.includes(chapter.id);
        const unlockCost = isFirstChapter ? 0 : XP_CONFIG.CHAPTER_COST;

        const chapterLessons = chapter.lessons || [];
        const completedInChapter = chapterLessons.filter(
          lesson => completedLessons.includes(lesson.id)
        ).length;
        const progress = chapterLessons.length > 0 
          ? Math.round((completedInChapter / chapterLessons.length) * 100)
          : 0;
        
        return {
          ...chapter,
          progress,
          completedLessons: completedInChapter,
          totalLessons: chapterLessons.length,
          icon: pathMetadata?.icon,
          color: pathMetadata?.gradient,
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

  // Calculate path progress using generated data
  const calculatePathProgress = useCallback(() => {
    const progress: Record<string, number> = {};
    
    pathsData.forEach(path => {
      const allLessonIds = getLessonIdsForPath(path.id);
      const totalLessons = allLessonIds.length;
      
      if (totalLessons === 0) {
        progress[path.id] = 0;
        return;
      }
      
      const completedInPath = completedLessons.filter(lessonId => 
        allLessonIds.includes(lessonId)
      ).length;
      
      progress[path.id] = Math.round((completedInPath / totalLessons) * 100);
    });
    
    return progress;
  }, [completedLessons]);

  // Update path progress when lessons complete
  useEffect(() => {
    const newProgress = calculatePathProgress();
    setUserPathProgress(newProgress);
  }, [completedLessons, calculatePathProgress]);

  // Handle Resume button
  const handleResume = async (pathId: string) => {
    const generatedChapters = getGeneratedChapters(pathId);
    let lastLesson = null;
    let lastChapter = null;
    let lastSection = 0;
    
    // Check for saved progress
    const lastProgress = localStorage.getItem('lastLessonProgress');
    if (lastProgress) {
      const progress = JSON.parse(lastProgress);
      if (progress.pathId === pathId) {
        for (const chapter of generatedChapters) {
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
      for (const chapter of generatedChapters) {
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

  // Handle lesson selection
  const handleSelectLesson = async (lesson: any, chapter: any) => {
    const loadingEl = document.createElement('div');
    loadingEl.className = 'fixed top-4 right-4 bg-purple-600 text-white px-4 py-2 rounded-lg z-50';
    loadingEl.textContent = 'Loading lesson...';
    document.body.appendChild(loadingEl);
    
    try {
      const lessonContent = await LessonRepository.getLesson(lesson.id);
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

  // Update lesson progress with section tracking
  const updateLessonProgress = useCallback(async (lessonId: string, sectionIndex: number) => {
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

  // Save last lesson progress for resume functionality
  useEffect(() => {
    if (selectedLesson && selectedPath && currentView === 'lesson') {
      const progressData = {
        pathId: selectedPath.id,
        lessonId: selectedLesson.id,
        currentSection,
        timestamp: Date.now()
      };
      localStorage.setItem('lastLessonProgress', JSON.stringify(progressData));
    }
  }, [selectedLesson, selectedPath, currentSection, currentView]);

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
                  <p className="text-purple-400 text-sm mt-2">Run sync:notion script to load content</p>
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