// src/features/yin/components/chapters/ChapterSystem.tsx
import {
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Clock,
  Trophy,
  Zap
} from 'lucide-react';
import { useEffect, useState } from 'react';

// Import components
import { useUserProgress } from '../../hooks/useUserProgress';
import { ChapterCard } from './ChapterCard';
import { ChapterDetailModal } from './ChapterDetailModal';
import CoreLearningLoop from './CoreLearningLoop';
import { LessonPlayer } from './LessonPlayer';
import PathsView from './PathsView';

// Import data
import { Chapter, getChaptersForPath } from '../../data/chaptersData';
import { PathData } from '../../data/enhancedPathsData';

const ChapterSystem = ({ userId = 'default-user' }) => {
  const [currentView, setCurrentView] = useState('paths');
  const [selectedPath, setSelectedPath] = useState<PathData | null>(null);
  const [selectedChapter, setSelectedChapter] = useState<Chapter | null>(null);
  const [chaptersList, setChaptersList] = useState<Chapter[]>([]);
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
  const [showChapterModal, setShowChapterModal] = useState(false);
  const [modalChapter, setModalChapter] = useState<Chapter | null>(null);
  
  // User stats - This should come from your backend/localStorage
  const [userXP, setUserXP] = useState(250); // Starting XP
  const [userPathProgress, setUserPathProgress] = useState<Record<string, number>>({
    'the-self': 45,
    'inward-journey': 20,
  });
  
  // Hooks
  const { progress, updateProgress } = useUserProgress(userId);

  // Load chapters when a path is selected
  useEffect(() => {
    if (selectedPath) {
      const chapters = getChaptersForPath(selectedPath.id);
      
      // Add visual properties from path to chapters
      const enhancedChapters = chapters.map(ch => ({
        ...ch,
        icon: selectedPath.icon,
        color: selectedPath.gradient,
        glow: `shadow-${selectedPath.glowColor}-500/30`,
        // Check if user has enough XP to unlock
        unlocked: !ch.requiredXP || userXP >= ch.requiredXP,
        premium: false, // Can be configured per chapter
        completed: false,
        progress: 0 // Would come from user data
      }));
      
      setChaptersList(enhancedChapters);
    }
  }, [selectedPath, userXP]);

  // Handler functions
  const handlePathSelect = (path: PathData) => {
    setSelectedPath(path);
    setCurrentView('chapters');
  };

  const handleChapterClick = (chapter: Chapter) => {
    setModalChapter(chapter);
    setShowChapterModal(true);
  };

  const handleChapterSelect = (chapter: Chapter) => {
    setSelectedChapter(chapter);
    setCurrentView('lessons');
    setCurrentLessonIndex(0);
  };

  const handleLessonComplete = () => {
    const currentLesson = selectedChapter?.lessons?.[currentLessonIndex];
    if (currentLesson) {
      // Award XP for lesson completion
      setUserXP(prev => prev + currentLesson.xpReward);
      updateProgress(currentLesson.id, 'completed');
      
      if (currentLessonIndex < selectedChapter.lessons.length - 1) {
        setCurrentLessonIndex(currentLessonIndex + 1);
      } else {
        // Chapter complete - Award chapter completion XP
        const bonusXP = 50;
        setUserXP(prev => prev + bonusXP);
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
    // Award XP for insights
    setUserXP(prev => prev + 5);
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

  return (
    <div className="min-h-screen relative">
      {/* Animated background */}
      <div className="fixed inset-0 bg-gradient-to-br from-gray-950 via-purple-950/70 to-indigo-950">
        {/* Star field effect */}
        <div className="absolute inset-0">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-white"
              style={{
                width: `${Math.random() * 2}px`,
                height: `${Math.random() * 2}px`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                opacity: Math.random() * 0.8,
                animation: `twinkle ${Math.random() * 5 + 5}s infinite`
              }}
            />
          ))}
        </div>
      </div>

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

            {/* Stats Display */}
            <div className="flex items-center gap-6">
              {/* XP Counter */}
              <div className="flex items-center gap-2 bg-gradient-to-r from-amber-500/20 to-orange-500/20 px-4 py-2 rounded-xl border border-amber-500/30">
                <Zap className="w-5 h-5 text-amber-400" />
                <span className="text-amber-300 font-bold">{userXP} XP</span>
              </div>

              {/* Breadcrumbs */}
              <div className="flex items-center gap-2 text-sm">
                <span 
                  className={currentView === 'paths' ? 'text-white' : 'text-purple-400 cursor-pointer hover:text-white'} 
                  onClick={() => setCurrentView('paths')}
                >
                  Paths
                </span>
                {currentView !== 'paths' && (
                  <>
                    <ChevronRight className="w-4 h-4 text-purple-500" />
                    <span 
                      className={currentView === 'chapters' ? 'text-white' : 'text-purple-400 cursor-pointer hover:text-white'}
                      onClick={() => currentView === 'lessons' && setCurrentView('chapters')}
                    >
                      {selectedPath?.title}
                    </span>
                  </>
                )}
                {currentView === 'lessons' && (
                  <>
                    <ChevronRight className="w-4 h-4 text-purple-500" />
                    <span className="text-white">{selectedChapter?.title}</span>
                  </>
                )}
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
                    onClick={() => handleChapterClick(chapter)}
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
                onMeditationTrigger={() => console.log('Meditation triggered')}
              />
            )}
          </CoreLearningLoop>
        )}
      </div>

      {/* Chapter Detail Modal */}
      {showChapterModal && modalChapter && (
        <ChapterDetailModal
          chapter={modalChapter}
          onClose={() => setShowChapterModal(false)}
          onLessonStart={(lessonId) => {
            handleChapterSelect(modalChapter);
            setShowChapterModal(false);
            const lessonIndex = modalChapter.lessons?.findIndex(l => l.id === lessonId) || 0;
            setCurrentLessonIndex(lessonIndex);
          }}
        />
      )}
    </div>
  );
};

export default ChapterSystem;

// Add CSS for twinkling stars
const starStyles = `
@keyframes twinkle {
  0%, 100% { opacity: 0; }
  50% { opacity: 1; }
}
`;