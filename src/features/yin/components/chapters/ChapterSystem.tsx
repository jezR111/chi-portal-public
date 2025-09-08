// src/features/yin/components/chapters/ChapterSystem.tsx - Key fixes for onClick and XP

import {
  BookOpen,
  ChevronLeft,
  Clock,
  Trophy,
  Zap
} from 'lucide-react';
import { useEffect, useState } from 'react';

// Import components
import { ChapterCard } from './ChapterCard';
import { ChapterDetailModal } from './ChapterDetailModal';
import CoreLearningLoop from './CoreLearningLoop';
import { LessonPlayer } from './LessonPlayer';
import PathsView from './PathsView';

// Import data and config
import { XP_CONFIG, getChapterUnlockCost } from '../../config/xpConfig';
import { Chapter, getChaptersForPath } from '../../data/chaptersData';
import { PathData } from '../../data/enhancedPathsData';
import { useUserProgress } from '../../hooks/useUserProgress';

const ChapterSystem = ({ userId = 'default-user' }) => {
  const [currentView, setCurrentView] = useState('paths');
  const [selectedPath, setSelectedPath] = useState<PathData | null>(null);
  const [selectedChapter, setSelectedChapter] = useState<Chapter | null>(null);
  const [chaptersList, setChaptersList] = useState<Chapter[]>([]);
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
  
  // Modal state - IMPORTANT: This was missing proper connection
  const [showChapterModal, setShowChapterModal] = useState(false);
  const [modalChapter, setModalChapter] = useState<Chapter | null>(null);
  const [modalChapterIndex, setModalChapterIndex] = useState(0);
  
  // User XP state - Start with 0 as per XP_CONFIG
  const [userXP, setUserXP] = useState(XP_CONFIG.INITIAL_XP);
  const [unlockedPaths, setUnlockedPaths] = useState<string[]>([]);
  const [unlockedChapters, setUnlockedChapters] = useState<string[]>([]);
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);
  
  // User path progress tracking
  const [userPathProgress, setUserPathProgress] = useState<Record<string, number>>({});
  
  // Hooks
  const { progress, updateProgress } = useUserProgress(userId);

 // Load chapters when a path is selected
useEffect(() => {
  if (selectedPath) {
    const chapters = getChaptersForPath(selectedPath.id);
    
    // Add visual properties and unlock status
    const enhancedChapters = chapters.map((ch, index) => {
      const unlockCost = getChapterUnlockCost(index);
      const isUnlocked = index < XP_CONFIG.RULES.FREE_CHAPTERS_PER_PATH || 
                        unlockedChapters.includes(ch.id);
      
      return {
        ...ch,
        icon: selectedPath.icon,
        color: selectedPath.gradient,
        glow: `shadow-${selectedPath.glowColor}-500/30`,
        unlocked: isUnlocked,
        requiredXP: isUnlocked ? 0 : unlockCost, // Show 0 if already unlocked
        premium: false,
        completed: false,
        progress: 0
      };
    });
    
    setChaptersList(enhancedChapters);
  }
}, [selectedPath, userXP, unlockedChapters]); // Make sure unlockedChapters is in dependencies

  // Path selection handler
  const handlePathSelect = (path: PathData) => {
    const pathIndex = unlockedPaths.length;
    
    // First path is free
    if (pathIndex === 0) {
      setUnlockedPaths([path.id]);
      setSelectedPath(path);
      setCurrentView('chapters');
    } 
    // Already unlocked path
    else if (unlockedPaths.includes(path.id)) {
      setSelectedPath(path);
      setCurrentView('chapters');
    }
    // Try to unlock with XP
    else {
      const cost = getPathUnlockCost(pathIndex + 1);
      if (userXP >= cost) {
        setUserXP(prev => prev - cost);
        setUnlockedPaths(prev => [...prev, path.id]);
        setSelectedPath(path);
        setCurrentView('chapters');
      } else {
        // Show preview or insufficient XP message
        console.log(`Need ${cost - userXP} more XP to unlock this path`);
      }
    }
  };

  // FIXED: Chapter click handler - This now properly shows the modal
  const handleChapterClick = (chapter: Chapter, index: number) => {
  console.log('Chapter clicked:', chapter.title, 'Index:', index); // ADD INDEX TO LOG
  
  const unlockCost = getChapterUnlockCost(index);
  const isUnlocked = index < XP_CONFIG.RULES.FREE_CHAPTERS_PER_PATH || 
                    unlockedChapters.includes(chapter.id);
  
  if (isUnlocked) {
    // Show the chapter detail modal
    setModalChapter(chapter);
    setModalChapterIndex(index);
    setShowChapterModal(true);
  } else if (userXP >= unlockCost) {
    // Unlock the chapter with XP
    setUserXP(prev => prev - unlockCost);
    setUnlockedChapters(prev => [...prev, chapter.id]);
    
    // Then show the modal
    setModalChapter(chapter);
    setModalChapterIndex(index);
    setShowChapterModal(true);
  } else {
    // Show preview or insufficient XP message
    console.log(`Need ${unlockCost - userXP} more XP to unlock this chapter`);
  }
};

  // Handle starting a lesson from the modal
  const handleLessonStart = (lessonId: string) => {
    console.log('Starting lesson:', lessonId); // Debug log
    
    if (modalChapter) {
      setSelectedChapter(modalChapter);
      const lessonIndex = modalChapter.lessons?.findIndex(l => l.id === lessonId) || 0;
      setCurrentLessonIndex(lessonIndex);
      setShowChapterModal(false);
      setCurrentView('lessons');
    }
  };

  // Handle lesson completion
  const handleLessonComplete = () => {
    const currentLesson = selectedChapter?.lessons?.[currentLessonIndex];
    if (currentLesson) {
      // Award XP for lesson completion
      setUserXP(prev => prev + XP_CONFIG.REWARDS.LESSON_COMPLETE);
      setCompletedLessons(prev => [...prev, currentLesson.id]);
      updateProgress(currentLesson.id, 'completed');
      
      // Check if more lessons in chapter
      if (currentLessonIndex < selectedChapter.lessons.length - 1) {
        setCurrentLessonIndex(currentLessonIndex + 1);
      } else {
        // Chapter complete - Award bonus
        setUserXP(prev => prev + XP_CONFIG.REWARDS.CHAPTER_COMPLETE);
        updateProgress(selectedChapter.id, 'chapter-completed');
        
        // Update path progress
        if (selectedPath) {
          const currentProgress = userPathProgress[selectedPath.id] || 0;
          const newProgress = Math.min(100, currentProgress + 10);
          setUserPathProgress(prev => ({
            ...prev,
            [selectedPath.id]: newProgress
          }));
        }
        
        setCurrentView('chapters');
      }
    }
  };

  const handleNextLesson = () => {
    if (selectedChapter && currentLessonIndex < selectedChapter.lessons.length - 1) {
      setCurrentLessonIndex(currentLessonIndex + 1);
    }
  };

  const handleInsightCapture = (insight: any) => {
    console.log('Insight captured:', insight);
    setUserXP(prev => prev + XP_CONFIG.REWARDS.INSIGHT_CAPTURE);
  };

  const handleBack = () => {
    if (currentView === 'lessons') {
      setCurrentView('chapters');
      setSelectedChapter(null);
    } else if (currentView === 'chapters') {
      setCurrentView('paths');
      setSelectedPath(null);
      setChaptersList([]);
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

  return (
    <div className="min-h-screen relative">
      {/* Background - simplified for focus */}
      <div className="fixed inset-0 bg-gradient-to-br from-gray-950 via-purple-950/70 to-indigo-950" />

      {/* Header */}
      <div className="relative z-20 bg-black/30 backdrop-blur-xl border-b border-purple-500/20 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {currentView !== 'paths' && (
                <button
                  onClick={handleBack}
                  className="p-2 hover:bg-purple-500/20 rounded-lg transition-colors"
                >
                  <ChevronLeft className="w-5 h-5 text-purple-300" />
                </button>
              )}
              <div>
                <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-200 to-pink-200">
                  {currentView === 'paths' && 'Choose Your Path'}
                  {currentView === 'chapters' && selectedPath?.title}
                  {currentView === 'lessons' && selectedChapter?.title}
                </h1>
                <p className="text-purple-300 text-sm mt-1">
                  {currentView === 'paths' && 'Each path builds upon the last, creating a complete journey of self-discovery'}
                  {currentView === 'chapters' && selectedPath?.subtitle}
                  {currentView === 'lessons' && selectedChapter?.subtitle}
                </p>
              </div>
            </div>

            {/* XP Display */}
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2 bg-gradient-to-r from-amber-500/20 to-orange-500/20 px-4 py-2 rounded-xl border border-amber-500/30">
                <Zap className="w-5 h-5 text-amber-400" />
                <span className="text-amber-300 font-bold">{userXP} XP</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 p-8 max-w-7xl mx-auto">
        {/* Paths View */}
        {currentView === 'paths' && (
          <PathsView
            userXP={userXP}
            userProgress={userPathProgress}
            onPathSelect={handlePathSelect}
            unlockedPaths={unlockedPaths}  // ADD THIS LINE

          />
        )}

        {/* Chapters List */}
        {currentView === 'chapters' && selectedPath && (
          <div>
            {/* Path Header */}
            <div className="mb-8 bg-black/30 backdrop-blur-xl rounded-3xl p-8 border border-purple-500/20">
              <div className="flex items-start gap-6">
                <div className={`
                  w-20 h-20 rounded-2xl flex items-center justify-center
                  bg-gradient-to-br ${selectedPath.gradient}
                  shadow-lg ${selectedPath.shadowColor}
                `}>
                  <selectedPath.icon className="w-10 h-10 text-white" />
                </div>
                <div className="flex-1">
                  <h2 className="text-3xl font-bold text-white mb-2">{selectedPath.title}</h2>
                  <p className="text-purple-300 text-lg mb-4">{selectedPath.subtitle}</p>
                  <p className="text-purple-200/70 leading-relaxed mb-6">{selectedPath.longDescription}</p>
                  
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                      <Trophy className="w-5 h-5 text-amber-400" />
                      <span className="text-purple-300">+{selectedPath.totalXP} XP Available</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-5 h-5 text-purple-400" />
                      <span className="text-purple-300">{selectedPath.estimatedHours} hours</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <BookOpen className="w-5 h-5 text-purple-400" />
                      <span className="text-purple-300">{selectedPath.totalChapters} chapters</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Chapters Grid */}
            {chaptersList.length > 0 ? (
              <div className="grid gap-4">
               {chaptersList.map((chapter, index) => (
  <ChapterCard
    key={chapter.id}
    chapter={chapter}
    onClick={() => handleChapterClick(chapter, index)} // Make sure index is passed here
    isOverview={index === 0}
  />
))}
              </div>
            ) : (
              <div className="text-center py-12 bg-black/30 backdrop-blur-xl rounded-3xl border border-purple-500/20">
                <p className="text-purple-300 text-lg">No chapters available yet</p>
                <p className="text-purple-400 text-sm mt-2">Content coming soon!</p>
              </div>
            )}
          </div>
        )}

        {/* Lessons View */}
        {currentView === 'lessons' && selectedChapter && selectedChapter.lessons && (
          <CoreLearningLoop
            chapter={selectedChapter}
            lessons={selectedChapter.lessons}
            userId={userId}
            onProgress={updateProgress}
            onCompletion={() => setCurrentView('chapters')}
          >
            {({ currentLesson, progress: lessonProgress, actions }) => (
              <LessonPlayer
                lesson={currentLesson || selectedChapter.lessons[currentLessonIndex]}
                chapter={selectedChapter}
                onComplete={actions?.completeLesson || handleLessonComplete}
                onNext={actions?.nextLesson || handleNextLesson}
                onInsightCapture={handleInsightCapture}
                onInsightTrigger={() => console.log('Insight triggered')}
                onMeditationTrigger={() => {
                  console.log('Meditation triggered');
                  setUserXP(prev => prev + XP_CONFIG.REWARDS.MEDITATION_COMPLETE);
                }}
              />
            )}
          </CoreLearningLoop>
        )}
      </div>

      {/* Chapter Detail Modal - FIXED: Now properly connected */}
      {showChapterModal && modalChapter && (
  <ChapterDetailModal
    chapter={modalChapter}
    pathId={selectedPath?.id || ''}
    chapterIndex={modalChapterIndex}
    isOpen={showChapterModal}
    onClose={() => {
      setShowChapterModal(false);
      setModalChapter(null);
    }}
    onStartLesson={handleLessonStart}
  onUnlockChapter={() => {
  const unlockCost = getChapterUnlockCost(modalChapterIndex);
  console.log('Unlock attempt - Full details:', {
    chapterIndex: modalChapterIndex,
    unlockCost,
    userXP,
    chapterId: modalChapter.id,
    isFirstTwoChapters: modalChapterIndex < XP_CONFIG.RULES.FREE_CHAPTERS_PER_PATH
  });
  
  // Check if already unlocked
  if (unlockedChapters.includes(modalChapter.id)) {
    console.log('Chapter already unlocked, opening...');
    if (modalChapter.lessons && modalChapter.lessons.length > 0) {
      handleLessonStart(modalChapter.lessons[0].id);
    }
    return;
  }
  
  // For free chapters or when user has enough XP
  if (unlockCost === 0 || userXP >= unlockCost) {
    console.log(`Unlocking chapter... Cost: ${unlockCost} XP`);
    
    // Deduct XP if not free
    if (unlockCost > 0) {
      console.log(`Deducting ${unlockCost} XP from ${userXP}`);
      setUserXP(prev => {
        const newXP = prev - unlockCost;
        console.log(`XP updated: ${prev} -> ${newXP}`);
        return newXP;
      });
    }
    
    // Add to unlocked chapters
    setUnlockedChapters(prev => [...prev, modalChapter.id]);
    
    // Close modal and start first lesson
    setShowChapterModal(false);
    if (modalChapter.lessons && modalChapter.lessons.length > 0) {
      handleLessonStart(modalChapter.lessons[0].id);
    }
  } else {
    alert(`You need ${unlockCost - userXP} more XP to unlock this chapter.`);
  }
}}
    userXP={userXP}
  />
)}
    </div>
  );
};

export default ChapterSystem;