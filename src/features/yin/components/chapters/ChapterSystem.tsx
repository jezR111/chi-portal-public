import {
  BookOpen,
  ChevronLeft,
  Clock,
  Trophy,
  Zap
} from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';

// Import components
import { ChapterCard } from './ChapterCard';
import { ChapterDetailModal } from './ChapterDetailModal';
import { LessonPlayer } from './LessonPlayer';
import PathsView from './PathsView';

// Import data and config
import { XP_CONFIG } from '../../config/xpConfig';
import { Chapter, getChaptersForPath } from '../../data/chaptersData';
import { PathData, pathsData } from '../../data/enhancedPathsData';
import { useUserProgress } from '../../hooks/useUserProgress';

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

const ChapterSystem = ({ 
  userId = 'default-user',
  resumeData,
  onResume
}: ChapterSystemProps) => {
  const [currentView, setCurrentView] = useState('paths');
  const [selectedPath, setSelectedPath] = useState<PathData | null>(null);
  const [selectedChapter, setSelectedChapter] = useState<Chapter | null>(null);
  const [chaptersList, setChaptersList] = useState<Chapter[]>([]);
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
  const [currentSection, setCurrentSection] = useState(0);
  
  // Modal state
  const [showChapterModal, setShowChapterModal] = useState(false);
  const [modalChapter, setModalChapter] = useState<Chapter | null>(null);
  const [modalChapterIndex, setModalChapterIndex] = useState(0);
  
  // Initialize state from localStorage or defaults
  const [userXP, setUserXP] = useState(() => {
    const saved = localStorage.getItem('yinProgress');
    if (saved) {
      const data = JSON.parse(saved);
      return data.savedXP ?? 300;
    }
    return 300;
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
      const cleanedChapters = (data.savedUnlockedChapters || []).filter((chapterId: string) => {
        return true;
      });
      return cleanedChapters;
    }
    return [];
  });
  
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);
  const [userPathProgress, setUserPathProgress] = useState<Record<string, number>>({});
  
  // Hooks
  const { progress } = useUserProgress(userId);

  const handleResume = useCallback((progressData: any) => {
    console.log('Handling resume with data:', progressData);
    
    if (!progressData) return;
    
    // Find the path from the static import
    const path = pathsData.find(p => p.id === progressData.pathId);
    if (!path) {
      console.error('Path not found:', progressData.pathId);
      return;
    }
    
    // Get chapters for this path
    const chapters = getChaptersForPath(progressData.pathId);
    if (!chapters || chapters.length === 0) {
      console.error('No chapters found for path:', progressData.pathId);
      return;
    }
    
    // Find the specific chapter
    const chapter = chapters.find(ch => ch.id === progressData.chapterId);
    if (!chapter) {
      console.error('Chapter not found:', progressData.chapterId);
      return;
    }
    
    // Find lesson index
    const lessonIndex = chapter.lessons?.findIndex(l => l.id === progressData.lessonId);
    if (lessonIndex === undefined || lessonIndex < 0) {
      console.error('Lesson not found:', progressData.lessonId);
      return;
    }
    
    // Enhance chapters with additional properties
    const enhancedChapters = chapters.map((ch, index) => {
      const isFirstChapter = index === 0;
      const isUnlocked = isFirstChapter || unlockedChapters.includes(ch.id);
      const unlockCost = isFirstChapter ? 0 : 50;
      
      const chapterLessons = ch.lessons || [];
      const completedLessonsInChapter = chapterLessons.filter(
        lesson => completedLessons.includes(lesson.id)
      ).length;
      const progressPercentage = chapterLessons.length > 0 
        ? (completedLessonsInChapter / chapterLessons.length) * 100 
        : 0;
      
      return {
        ...ch,
        progress: Math.round(progressPercentage),
        completedLessons: completedLessonsInChapter,
        totalLessons: chapterLessons.length,
        icon: path.icon,
        color: path.gradient,
        glow: `shadow-${path.glowColor}-500/30`,
        unlocked: isUnlocked,
        requiredXP: unlockCost,
        canUnlock: !isFirstChapter,
        premium: false,
        completed: progressPercentage === 100,
        totalDuration: ch.lessons?.reduce((sum, l) => sum + (l.duration || 15), 0) || 60,
        xpReward: ch.lessons?.reduce((sum, l) => sum + (l.xpReward || 10), 0) || 100
      };
    });
    
    // Set chapters list
    setChaptersList(enhancedChapters);
    
    // Set states in correct order
    setSelectedPath(path);
    setSelectedChapter(chapter);
    setCurrentLessonIndex(lessonIndex);
    
    // IMPORTANT: Set the section from progressData
    if (progressData.section !== undefined && progressData.section !== null) {
      setCurrentSection(progressData.section);
      console.log('Setting section to:', progressData.section);
    }
    
    // Navigate directly to lessons view
    setCurrentView('lessons');
    
    console.log('Resume successful:', {
      path: path.id,
      chapter: chapter.id,
      lessonIndex,
      section: progressData.section || 0
    });
  }, [unlockedChapters, completedLessons]);

  // Handle initial resume if resumeData is provided
  useEffect(() => {
    if (resumeData && resumeData.lessonId) {
      handleResume(resumeData);
    }
  }, [resumeData, handleResume]);

  // One-time cleanup on mount
  useEffect(() => {
    const saved = localStorage.getItem('yinProgress');
    if (saved) {
      const data = JSON.parse(saved);
      
      if (data.savedUnlockedChapters) {
        const cleaned = data.savedUnlockedChapters.filter((chapterId: string) => {
          const allPaths = ['the-self', 'inward-journey', 'energy-bodies', 'self-relating', 'doing', 'life', 'self-mastery', 'metaphysics'];
          
          for (const pathId of allPaths) {
            const chapters = getChaptersForPath(pathId);
            if (chapters && Array.isArray(chapters) && chapters.length > 0 && chapters[0].id === chapterId) {
              return false;
            }
          }
          
          return true;
        });
        
        if (JSON.stringify(cleaned) !== JSON.stringify(data.savedUnlockedChapters)) {
          console.log('Cleaning up unlocked chapters:', cleaned);
          setUnlockedChapters(cleaned);
          
          const cleanedData = {
            ...data,
            savedUnlockedChapters: cleaned
          };
          localStorage.setItem('yinProgress', JSON.stringify(cleanedData));
        }
      }
    }
  }, []);

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

  // Load chapters when a path is selected
  useEffect(() => {
    if (selectedPath) {
      const chapters = getChaptersForPath(selectedPath.id);
      
      if (!chapters || chapters.length === 0) {
        setChaptersList([]);
        return;
      }

      const enhancedChapters = chapters.map((ch, index) => {
        const isFirstChapter = index === 0;
        const isUnlocked = isFirstChapter || unlockedChapters.includes(ch.id);
        const unlockCost = isFirstChapter ? 0 : 50;

        const chapterLessons = ch.lessons || [];
        const completedLessonsInChapter = chapterLessons.filter(
          lesson => completedLessons.includes(lesson.id)
        ).length;
        const progressPercentage = chapterLessons.length > 0 
          ? (completedLessonsInChapter / chapterLessons.length) * 100 
          : 0;
        
        return {
          ...ch,
          progress: Math.round(progressPercentage),
          completedLessons: completedLessonsInChapter,
          totalLessons: chapterLessons.length,
          icon: selectedPath.icon,
          color: selectedPath.gradient,
          glow: `shadow-${selectedPath.glowColor}-500/30`,
          unlocked: isUnlocked,
          requiredXP: unlockCost,
          canUnlock: !isFirstChapter,
          premium: false,
          completed: progressPercentage === 100,
          totalDuration: ch.lessons?.reduce((sum, l) => sum + (l.duration || 15), 0) || 60,
          xpReward: ch.lessons?.reduce((sum, l) => sum + (l.xpReward || 10), 0) || 100
        };
      });
      
      setChaptersList(enhancedChapters);
    }
  }, [selectedPath, unlockedChapters, completedLessons]);

  // Path selection handler
  const handlePathSelect = (path: PathData) => {
    const pathIndex = unlockedPaths.length;
    
    if (pathIndex === 0) {
      setUnlockedPaths([path.id]);
      setSelectedPath(path);
      setCurrentView('chapters');
    } 
    else if (unlockedPaths.includes(path.id)) {
      setSelectedPath(path);
      setCurrentView('chapters');
    }
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

  // Chapter click handler
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
      setUserXP(prev => prev + XP_CONFIG.REWARDS.LESSON_COMPLETE);
      setCompletedLessons(prev => [...prev, currentLesson.id]);
      
      if (currentLessonIndex < selectedChapter.lessons.length - 1) {
        setCurrentLessonIndex(currentLessonIndex + 1);
      } else {
        setUserXP(prev => prev + XP_CONFIG.REWARDS.CHAPTER_COMPLETE);
        
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

  // Debug function to reset progress
  const resetProgress = () => {
    setUserXP(300);
    setUnlockedPaths([]);
    setUnlockedChapters([]);
    setCompletedLessons([]);
    setUserPathProgress({});
    localStorage.removeItem('yinProgress');
    console.log('Progress reset!');
    window.location.reload();
  };

  return (
    <div className="min-h-screen relative">
      {/* Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-gray-950 via-purple-950/70 to-indigo-950" />

      {/* Header */}
      <div className="sticky top-0 z-30 bg-black/30 backdrop-blur-xl border-b border-purple-500/20 p-6">
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

            {/* XP Display and Debug Controls */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 bg-gradient-to-r from-amber-500/20 to-orange-500/20 px-4 py-2 rounded-xl border border-amber-500/30">
                <Zap className="w-5 h-5 text-amber-400" />
                <span className="text-amber-300 font-bold">{userXP} XP</span>
              </div>
              
              {process.env.NODE_ENV === 'development' && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={resetProgress}
                    className="px-3 py-1 bg-red-500/20 text-red-400 rounded text-sm hover:bg-red-500/30"
                  >
                    Reset
                  </button>
                  <button
                    onClick={() => setUserXP(prev => prev + 100)}
                    className="px-3 py-1 bg-green-500/20 text-green-400 rounded text-sm hover:bg-green-500/30"
                  >
                    +100 XP
                  </button>
                </div>
              )}
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
            onResume={handleResume}
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
          <LessonPlayer
            lesson={selectedChapter.lessons[currentLessonIndex]}
            chapter={selectedChapter}
            initialSection={currentSection}
            onComplete={handleLessonComplete}
            onNext={handleNextLesson}
            onBack={() => {
              setCurrentView('chapters');
              setTimeout(() => {
                setModalChapter(selectedChapter);
                setModalChapterIndex(chaptersList.findIndex(ch => ch.id === selectedChapter.id));
                setShowChapterModal(true);
                setSelectedChapter(null);
              }, 100);
            }}
            onInsightCapture={handleInsightCapture}
            onInsightTrigger={() => console.log('Insight triggered')}
            onMeditationTrigger={() => {
              console.log('Meditation triggered');
              setUserXP(prev => prev + XP_CONFIG.REWARDS.MEDITATION_COMPLETE);
            }}
            onSectionChange={(section: number) => {
              const progressData = {
                pathId: selectedPath?.id,
                chapterId: selectedChapter.id,
                lessonId: selectedChapter.lessons[currentLessonIndex].id,
                section: section,
                timestamp: Date.now()
              };
              localStorage.setItem('lastLessonProgress', JSON.stringify(progressData));
            }}
          />
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
            const isFirstChapter = modalChapterIndex === 0;
            const unlockCost = isFirstChapter ? 0 : 50;
            
            console.log('Unlock attempt:', {
              chapterTitle: modalChapter.title,
              chapterIndex: modalChapterIndex,
              isFirstChapter,
              unlockCost,
              userXP,
              chapterId: modalChapter.id,
              alreadyUnlocked: unlockedChapters.includes(modalChapter.id)
            });
            
            if (isFirstChapter) {
              console.log('First chapter - free access');
              if (modalChapter.lessons && modalChapter.lessons.length > 0) {
                handleLessonStart(modalChapter.lessons[0].id);
              }
              return;
            }
            
            if (unlockedChapters.includes(modalChapter.id)) {
              console.log('Chapter already unlocked');
              if (modalChapter.lessons && modalChapter.lessons.length > 0) {
                handleLessonStart(modalChapter.lessons[0].id);
              }
              return;
            }
            
            if (userXP >= unlockCost) {
              console.log(`Unlocking chapter with ${unlockCost} XP`);
              
              setUserXP(prev => prev - unlockCost);
              setUnlockedChapters(prev => [...prev, modalChapter.id]);
              
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