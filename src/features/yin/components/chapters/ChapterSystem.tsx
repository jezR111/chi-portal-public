'use client';

import ChapterCard from '@/features/yin/components/chapters/ChapterCard';
import LessonPlayer from '@/features/yin/components/chapters/LessonPlayer';
import PathsView from '@/features/yin/components/chapters/PathsView';
import UnlockConfirmDialog from '@/features/yin/components/chapters/UnlockConfirmDialog';
import { pathsData } from '@/features/yin/data/enhancedPathsData';
import { AnimatePresence, motion } from 'framer-motion';
import { BookOpen, ChevronLeft, Zap } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';

// XP Configuration
const XP_CONFIG = {
  PATH_COSTS: {
    FIRST: 0,     // Free
    SECOND: 100,
    THIRD: 200,
    FOURTH: 300,
    ADDITIONAL: 500
  },
  CHAPTER_COST: 50,
  REWARDS: {
    LESSON_COMPLETE: 10,
    CHAPTER_COMPLETE: 50,
    INSIGHT_CAPTURE: 5,
    MEDITATION_COMPLETE: 10
  }
};

// Mock chapter data generator
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
          { id: 'L0001', title: 'The Journey Into Self', duration: 15, xpReward: 10 },
          { id: 'L0002', title: 'The Observer and Observed', duration: 15, xpReward: 10 },
          { id: 'L0003', title: 'Beginning Your Practice', duration: 20, xpReward: 15 }
        ]
      },
      {
        id: 'the-self-ch02',
        title: 'The Stages of Self',
        subtitle: 'Evolution of consciousness',
        description: 'Explore the different stages of self-development and how consciousness evolves.',
        order: 2,
        lessons: [
          { id: 'L0004', title: 'Understanding the Shadow', duration: 15, xpReward: 10 },
          { id: 'L0005', title: 'Ego Development', duration: 20, xpReward: 15 }
        ]
      },
      {
        id: 'the-self-ch03',
        title: 'Self Image & Identity',
        subtitle: 'How we see ourselves',
        description: 'Examine the constructs of self-image and identity, and how they shape our reality.',
        order: 3,
        lessons: [
          { id: 'L0006', title: 'The Mirror of Perception', duration: 15, xpReward: 10 },
          { id: 'L0007', title: 'Beliefs and Identity', duration: 20, xpReward: 15 }
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
          { id: 'L0101', title: 'The Call to Journey Inward', duration: 15, xpReward: 10 },
          { id: 'L0102', title: 'Creating Sacred Space', duration: 15, xpReward: 10 }
        ]
      },
      {
        id: 'inward-ch02',
        title: 'The Descent',
        subtitle: 'Going deeper within',
        description: 'Learn techniques for deep introspection and inner exploration.',
        order: 2,
        lessons: [
          { id: 'L0103', title: 'Meditation Techniques', duration: 20, xpReward: 15 },
          { id: 'L0104', title: 'Dream Work', duration: 25, xpReward: 20 }
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
          { id: 'L0201', title: 'The Subtle Body', duration: 20, xpReward: 15 },
          { id: 'L0202', title: 'Energy Centers', duration: 25, xpReward: 20 }
        ]
      },
      {
        id: 'energy-ch02',
        title: 'Working with Energy',
        subtitle: 'Practical energy exercises',
        description: 'Hands-on practices for sensing and directing energy.',
        order: 2,
        lessons: [
          { id: 'L0203', title: 'Breathwork for Energy', duration: 20, xpReward: 15 },
          { id: 'L0204', title: 'Energy Healing Basics', duration: 30, xpReward: 25 }
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
  // View state
  const [currentView, setCurrentView] = useState<'paths' | 'chapters' | 'lesson'>('paths');
  const [selectedPath, setSelectedPath] = useState<any>(null);
  const [selectedChapter, setSelectedChapter] = useState<any>(null);
  const [selectedLesson, setSelectedLesson] = useState<any>(null);
  const [chaptersList, setChaptersList] = useState<any[]>([]);
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
  const [currentSection, setCurrentSection] = useState(0);
  
  // Confirmation dialog state
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    type: 'path' | 'chapter';
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
  
  // Progress state - Initialize from localStorage
  const [userXP, setUserXP] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('yinProgress');
      if (saved) {
        const data = JSON.parse(saved);
        return data.savedXP ?? 300;
      }
    }
    return 300;
  });
  
  const [unlockedPaths, setUnlockedPaths] = useState<string[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('yinProgress');
      if (saved) {
        const data = JSON.parse(saved);
        return data.savedUnlockedPaths || [];
      }
    }
    return [];
  });
  
  const [unlockedChapters, setUnlockedChapters] = useState<string[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('yinProgress');
      if (saved) {
        const data = JSON.parse(saved);
        return data.savedUnlockedChapters || [];
      }
    }
    return [];
  });
  
  const [completedLessons, setCompletedLessons] = useState<string[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('yinProgress');
      if (saved) {
        const data = JSON.parse(saved);
        return data.completedLessons || [];
      }
    }
    return [];
  });
  
  const [userPathProgress, setUserPathProgress] = useState<Record<string, number>>({});

  // Save to localStorage whenever state changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const dataToSave = {
        savedXP: userXP,
        savedUnlockedPaths: unlockedPaths,
        savedUnlockedChapters: unlockedChapters,
        completedLessons: completedLessons,
        pathProgress: userPathProgress
      };
      localStorage.setItem('yinProgress', JSON.stringify(dataToSave));
    }
  }, [userXP, unlockedPaths, unlockedChapters, completedLessons, userPathProgress]);

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
          xpReward: chapterLessons.reduce((sum, l) => sum + (l.xpReward || 10), 0)
        };
      });
      
      setChaptersList(enhancedChapters);
    }
  }, [selectedPath, unlockedChapters, completedLessons]);

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

  // Fixed Path Selection Handler
  const handlePathSelect = (path: any) => {
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
      
      if (userXP < cost) {
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
          callback: () => {
            setUserXP(prev => prev - cost);
            setUnlockedPaths(prev => [...prev, path.id]);
            setSelectedPath(path);
            setCurrentView('chapters');
            setConfirmDialog({ ...confirmDialog, isOpen: false });
          }
        });
      }
    }
  };

  // Fixed Chapter Selection Handler
  const handleChapterSelect = (chapter: any, index: number) => {
    const isFirstChapter = index === 0;
    
    if (isFirstChapter || unlockedChapters.includes(chapter.id)) {
      setSelectedChapter(chapter);
      if (chapter.lessons && chapter.lessons.length > 0) {
        setCurrentLessonIndex(0);
        setSelectedLesson(chapter.lessons[0]);
        setCurrentSection(0);
        setCurrentView('lesson');
      }
      return;
    }
    
    const unlockCost = XP_CONFIG.CHAPTER_COST;
    
    if (userXP < unlockCost) {
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
        callback: () => {
          setUserXP(prev => prev - unlockCost);
          setUnlockedChapters(prev => [...prev, chapter.id]);
          setSelectedChapter(chapter);
          if (chapter.lessons && chapter.lessons.length > 0) {
            setCurrentLessonIndex(0);
            setSelectedLesson(chapter.lessons[0]);
            setCurrentSection(0);
            setCurrentView('lesson');
          }
          setConfirmDialog({ ...confirmDialog, isOpen: false });
        }
      });
    }
  };

  const handleLessonComplete = () => {
    if (selectedLesson && selectedChapter) {
      const xpGain = selectedLesson.xpReward || XP_CONFIG.REWARDS.LESSON_COMPLETE;
      setUserXP(prev => prev + xpGain);
      setCompletedLessons(prev => {
        if (!prev.includes(selectedLesson.id)) {
          return [...prev, selectedLesson.id];
        }
        return prev;
      });
      
      if (currentLessonIndex < selectedChapter.lessons.length - 1) {
        setCurrentLessonIndex(currentLessonIndex + 1);
        setSelectedLesson(selectedChapter.lessons[currentLessonIndex + 1]);
        setCurrentSection(0);
      } else {
        setUserXP(prev => prev + XP_CONFIG.REWARDS.CHAPTER_COMPLETE);
        setCurrentView('chapters');
        setSelectedLesson(null);
        setCurrentSection(0);
      }
    }
  };

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

  const handleNextLesson = () => {
    if (selectedChapter && currentLessonIndex < selectedChapter.lessons.length - 1) {
      setCurrentLessonIndex(currentLessonIndex + 1);
      setSelectedLesson(selectedChapter.lessons[currentLessonIndex + 1]);
      setCurrentSection(0);
    }
  };

  const handlePreviousLesson = () => {
    if (selectedChapter && currentLessonIndex > 0) {
      setCurrentLessonIndex(currentLessonIndex - 1);
      setSelectedLesson(selectedChapter.lessons[currentLessonIndex - 1]);
      setCurrentSection(0);
    }
  };

  const handleConfirmUnlock = () => {
    if (confirmDialog.callback && !confirmDialog.insufficientXP) {
      confirmDialog.callback();
    }
  };

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
          <span className="text-amber-300 font-bold">{userXP} XP</span>
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
              userXP={userXP}
              onPathSelect={handlePathSelect}
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
            {/* Path Header - MODIFIED FOR FULL-WIDTH AND LIGHTER HUE */}
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

            {/* Chapters List */}
            <div className="space-y-4">
              {chaptersList.length > 0 ? (
                chaptersList.map((chapter, index) => (
                  <ChapterCard 
                    key={chapter.id}
                    chapter={chapter}
                    index={index}
                    onSelect={() => handleChapterSelect(chapter, index)}
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
            {LessonPlayer ? (
              <LessonPlayer
                lesson={selectedLesson}
                chapter={{
                  ...selectedChapter,
                  pathId: selectedPath?.id
                }}
                initialSection={currentSection}
                onComplete={handleLessonComplete}
                onNext={handleNextLesson}
                onPrevious={handlePreviousLesson}
                onBack={handleBack}
                onInsightCapture={(insight) => {
                  console.log('Insight captured:', insight);
                  setUserXP(prev => prev + XP_CONFIG.REWARDS.INSIGHT_CAPTURE);
                }}
                onMeditationTrigger={() => {
                  console.log('Meditation completed');
                  setUserXP(prev => prev + XP_CONFIG.REWARDS.MEDITATION_COMPLETE);
                }}
                onSectionChange={setCurrentSection}
                isFromQuest={false}
                highlightingEnabled={true}
              />
            ) : (
              <div className="bg-black/20 backdrop-blur-sm rounded-xl p-8 border border-purple-500/20">
                <h2 className="text-3xl font-bold text-white mb-4">{selectedLesson.title}</h2>
                <p className="text-purple-300 mb-6">From: {selectedChapter.title}</p>
                <button
                  onClick={handleLessonComplete}
                  className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl text-white font-semibold hover:shadow-lg transition-all"
                >
                  Complete Lesson (+{selectedLesson.xpReward || 10} XP)
                </button>
              </div>
            )}
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
        currentXP={userXP}
        insufficientXP={confirmDialog.insufficientXP}
      />
    </>
  );
}

