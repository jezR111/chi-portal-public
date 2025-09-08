// src/features/yin/components/chapters/ChapterSystem.tsx

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
import { XP_CONFIG } from '../../config/xpConfig';
import { Chapter, getChaptersForPath } from '../../data/chaptersData';
import { PathData } from '../../data/enhancedPathsData';
import { useUserProgress } from '../../hooks/useUserProgress';

const ChapterSystem = ({ userId = 'default-user' }) => {
  const [currentView, setCurrentView] = useState('paths');
  const [selectedPath, setSelectedPath] = useState<PathData | null>(null);
  const [selectedChapter, setSelectedChapter] = useState<Chapter | null>(null);
  const [chaptersList, setChaptersList] = useState<Chapter[]>([]);
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
  
  // Modal state
  const [showChapterModal, setShowChapterModal] = useState(false);
  const [modalChapter, setModalChapter] = useState<Chapter | null>(null);
  const [modalChapterIndex, setModalChapterIndex] = useState(0);
  
  // Initialize state from localStorage or defaults
  const [userXP, setUserXP] = useState(() => {
    const saved = localStorage.getItem('yinProgress');
    if (saved) {
      const data = JSON.parse(saved);
      return data.savedXP ?? 300; // Using 300 for testing as you mentioned
    }
    return 300; // Testing with 300 XP
  });
  
  const [unlockedPaths, setUnlockedPaths] = useState<string[]>(() => {
    const saved = localStorage.getItem('yinProgress');
    if (saved) {
      const data = JSON.parse(saved);
      return data.savedUnlockedPaths || [];
    }
    return [];
  });
  
  const [unlockedChapters, setUnlockedChapters] = useState<string[]>(() => {
    const saved = localStorage.getItem('yinProgress');
    if (saved) {
      const data = JSON.parse(saved);
      return data.savedUnlockedChapters || [];
    }
    return [];
  });
  
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);
  const [userPathProgress, setUserPathProgress] = useState<Record<string, number>>({});
  
  // Hooks
  const { progress, updateProgress } = useUserProgress(userId);

  // Save to localStorage whenever state changes
  useEffect(() => {
    const dataToSave = {
      savedXP: userXP,
      savedUnlockedPaths: unlockedPaths,
      savedUnlockedChapters: unlockedChapters
    };
    localStorage.setItem('yinProgress', JSON.stringify(dataToSave));
    console.log('Saved to localStorage:', dataToSave);
  }, [userXP, unlockedPaths, unlockedChapters]);

  // Clean up any incorrectly unlocked chapters
useEffect(() => {
  // Get all chapter IDs that should be unlocked (first chapter of each unlocked path)
  const validUnlockedChapters: string[] = [];
  
  unlockedPaths.forEach(pathId => {
    const chapters = getChaptersForPath(pathId);
    if (chapters.length > 0) {
      // Only the first chapter should be free
      validUnlockedChapters.push(chapters[0].id);
    }
  });
  
  // Add any chapters that were manually unlocked with XP
  const manuallyUnlocked = unlockedChapters.filter(chId => {
    // Check if this is NOT a first chapter
    const isFirstChapter = unlockedPaths.some(pathId => {
      const chapters = getChaptersForPath(pathId);
      return chapters[0]?.id === chId;
    });
    return !isFirstChapter;
  });
  
  const correctedChapters = [...validUnlockedChapters, ...manuallyUnlocked];
  
  // Only update if there's a difference
  if (JSON.stringify(correctedChapters.sort()) !== JSON.stringify(unlockedChapters.sort())) {
    console.log('Correcting unlocked chapters:', correctedChapters);
    setUnlockedChapters(correctedChapters);
  }
}, [unlockedPaths]); // Run when unlocked paths change

  // Load chapters when a path is selected
  useEffect(() => {
    if (selectedPath) {
      const chapters = getChaptersForPath(selectedPath.id);
      
      // Add visual properties and unlock status
      const enhancedChapters = chapters.map((ch, index) => {
        // First chapter of each path is free, rest cost 50 XP
        const unlockCost = index === 0 ? 0 : 50;
        const isUnlocked = index === 0 || unlockedChapters.includes(ch.id);
        
        return {
          ...ch,
          icon: selectedPath.icon,
          color: selectedPath.gradient,
          glow: `shadow-${selectedPath.glowColor}-500/30`,
          unlocked: isUnlocked,
          requiredXP: unlockCost,
          premium: false,
          completed: false,
          progress: 0
        };
      });
      
      setChaptersList(enhancedChapters);
    }
  }, [selectedPath, unlockedChapters, userXP]);

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
        console.log(`Need ${cost - userXP} more XP to unlock this path`);
      }
    }
  };

  // Chapter click handler - simplified to always show modal
  const handleChapterClick = (chapter: Chapter, index: number) => {
    console.log('Chapter clicked:', chapter.title, 'Index:', index);
    
    setModalChapter(chapter);
    setModalChapterIndex(index);
    setShowChapterModal(true);
  };

  // Handle starting a lesson from the modal
  const handleLessonStart = (lessonId: string) => {
    console.log('Starting lesson:', lessonId);
    
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
      {/* Background */}
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
            unlockedPaths={unlockedPaths}
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
                    onClick={() => handleChapterClick(chapter, index)}
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
        onBack={() => {
          // Return to chapter detail modal
          setCurrentView('chapters');
          setModalChapter(selectedChapter);
          setModalChapterIndex(chaptersList.findIndex(ch => ch.id === selectedChapter.id));
          setShowChapterModal(true);
        }}
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

      {/* Chapter Detail Modal */}
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
            // First chapter is free, rest cost 50 XP
            const unlockCost = modalChapterIndex === 0 ? 0 : 50;
            
            console.log('Unlock attempt:', {
              chapterIndex: modalChapterIndex,
              unlockCost,
              userXP,
              chapterId: modalChapter.id,
              canAfford: userXP >= unlockCost
            });
            
            // Check if already unlocked
            if (unlockedChapters.includes(modalChapter.id)) {
              console.log('Chapter already unlocked, opening...');
              if (modalChapter.lessons && modalChapter.lessons.length > 0) {
                handleLessonStart(modalChapter.lessons[0].id);
              }
              return;
            }
            
            // Check if user has enough XP
            if (userXP >= unlockCost) {
              console.log(`Unlocking chapter... Cost: ${unlockCost} XP`);
              
              // Deduct XP if not free
              if (unlockCost > 0) {
                console.log(`Deducting ${unlockCost} XP from ${userXP}`);
                const newXP = userXP - unlockCost;
                setUserXP(newXP);
                console.log(`XP updated to: ${newXP}`);
              }
              
              // Add to unlocked chapters
              setUnlockedChapters(prev => {
                const updated = [...prev, modalChapter.id];
                console.log('Unlocked chapters:', updated);
                return updated;
              });
              
              // Close modal and start first lesson
              setShowChapterModal(false);
              setTimeout(() => {
                if (modalChapter.lessons && modalChapter.lessons.length > 0) {
                  handleLessonStart(modalChapter.lessons[0].id);
                }
              }, 100);
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