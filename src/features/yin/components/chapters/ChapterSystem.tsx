// src/features/yin/components/chapters/ChapterSystem.tsx
import {
  Brain,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import React, { useEffect, useState } from 'react';

// Import your existing components
import { useChapterData } from '../../hooks/useChapterData';
import { useUserProgress } from '../../hooks/useUserProgress';
import { ChapterCard } from './ChapterCard';
import { ChapterDetailModal } from './ChapterDetailModal';
import CoreLearningLoop from './CoreLearningLoop';
import { LessonPlayer } from './LessonPlayer';
import { ProgressBar } from './ProgressBar';

// Path data with Notion IDs - FIXED: Added icon mapping
const pathsData = [
  {
    id: 'the-self',
    notionId: 'af01829f-b333-4d99-9dfc-e571195357c1',
    title: 'The Self',
    subtitle: 'Foundation of Being',
    description: 'Discover your authentic self and build a strong foundation of self-awareness',
    icon: Brain,
    gradient: 'from-purple-600 to-indigo-600',
    glowColor: 'purple',
    chapters: []
  },
  // ... rest of paths data
];

// Mock chapter data - FIXED: Added icon property to chapters
const mockChapters = {
  'the-self': [
    { 
      id: '1', 
      title: 'Overview of The Self', 
      subtitle: 'Foundation principles',
      description: 'Understanding your foundation', 
      lessons: 6, 
      duration: '2h 15m', 
      completed: true, 
      progress: 100,
      icon: Brain, // Added icon
      color: 'from-purple-600 to-indigo-600', // Added color gradient
      glow: 'shadow-purple-500/30', // Added glow
      unlocked: true,
      premium: false,
      lessonList: [
        { id: '1', title: 'Introduction', completed: true, duration: '15min' },
        { id: '2', title: 'Core Concepts', completed: true, duration: '20min' },
        // ... more lessons
      ]
    },
    // ... more chapters with icons
  ],
  'energy-bodies': [
    // Similar structure
  ]
};

// Path Card Component - REMOVED duplicate, using external one
const PathCard = ({ path, onClick, isCompleted, progress }) => {
  const Icon = path.icon;
  const glowColors = {
    purple: 'shadow-purple-500/30 hover:shadow-purple-500/50',
    blue: 'shadow-blue-500/30 hover:shadow-blue-500/50',
    violet: 'shadow-violet-500/30 hover:shadow-violet-500/50',
    pink: 'shadow-pink-500/30 hover:shadow-pink-500/50',
    orange: 'shadow-orange-500/30 hover:shadow-orange-500/50',
    amber: 'shadow-amber-500/30 hover:shadow-amber-500/50',
    emerald: 'shadow-emerald-500/30 hover:shadow-emerald-500/50',
    indigo: 'shadow-indigo-500/30 hover:shadow-indigo-500/50'
  };

  return (
    <div 
      onClick={onClick}
      className={`
        relative group cursor-pointer transform transition-all duration-500
        hover:scale-105 hover:-translate-y-2
      `}
    >
      <div className={`
        relative h-72 rounded-2xl overflow-hidden
        bg-gradient-to-br ${path.gradient}
        shadow-xl ${glowColors[path.glowColor]}
        border border-white/10
      `}>
        {/* Content */}
        <div className="relative z-10 h-full p-6 flex flex-col">
          <div className="mb-4">
            <div className="w-16 h-16 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center">
              <Icon className="w-8 h-8 text-white" />
            </div>
          </div>
          <div className="flex-1">
            <h3 className="text-2xl font-bold text-white mb-1">{path.title}</h3>
            <p className="text-white/80 text-sm mb-2">{path.subtitle}</p>
            <p className="text-white/60 text-xs leading-relaxed">{path.description}</p>
          </div>
          {progress > 0 && (
            <ProgressBar progress={progress} className="mt-4" />
          )}
        </div>
      </div>
    </div>
  );
};

// Main Chapter System Component - FIXED
const ChapterSystem = ({ userId = 'default-user' }) => {
  const [currentView, setCurrentView] = useState('paths');
  const [selectedPath, setSelectedPath] = useState(null);
  const [selectedChapter, setSelectedChapter] = useState(null);
  const [chaptersList, setChaptersList] = useState([]); // FIXED: Renamed to avoid conflict
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
  const [showChapterModal, setShowChapterModal] = useState(false);
  const [modalChapter, setModalChapter] = useState(null);
  
  // Hooks
  const { progress, updateProgress } = useUserProgress(userId);
  const { chapters: fetchedChapters, fetchChaptersForPath } = useChapterData();

  // Load chapters when a path is selected
  useEffect(() => {
    if (selectedPath && mockChapters[selectedPath.id]) {
      // Add the path's icon to each chapter for consistency
      const chaptersWithIcons = mockChapters[selectedPath.id].map(ch => ({
        ...ch,
        icon: ch.icon || selectedPath.icon,
        color: ch.color || selectedPath.gradient,
        glow: ch.glow || `shadow-${selectedPath.glowColor}-500/30`
      }));
      setChaptersList(chaptersWithIcons);
    }
  }, [selectedPath]);

  // Handler functions - FIXED: Added missing handlers
  const handlePathSelect = (path) => {
    setSelectedPath(path);
    setCurrentView('chapters');
    // fetchChaptersForPath(path.notionId); // Uncomment when API is ready
  };

  const handleChapterClick = (chapter) => {
    setModalChapter(chapter);
    setShowChapterModal(true);
  };

  const handleChapterSelect = (chapter) => {
    setSelectedChapter(chapter);
    setCurrentView('lessons');
    setCurrentLessonIndex(0);
  };

  const handleLessonComplete = () => {
    const currentLesson = selectedChapter?.lessonList?.[currentLessonIndex];
    if (currentLesson) {
      updateProgress(currentLesson.id, 'completed');
      
      // Move to next lesson or complete chapter
      if (currentLessonIndex < selectedChapter.lessonList.length - 1) {
        setCurrentLessonIndex(currentLessonIndex + 1);
      } else {
        // Chapter complete
        updateProgress(selectedChapter.id, 'chapter-completed');
        setCurrentView('chapters');
      }
    }
  };

  const handleNextLesson = () => {
    if (currentLessonIndex < selectedChapter.lessonList.length - 1) {
      setCurrentLessonIndex(currentLessonIndex + 1);
    }
  };

  const handleInsightCapture = (insight) => {
    console.log('Insight captured:', insight);
    // Save insight to backend
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
                  {currentView === 'chapters' && 'Select a chapter to continue your journey'}
                  {currentView === 'lessons' && 'Complete lessons to progress through the chapter'}
                </p>
              </div>
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
                  <span className={currentView === 'chapters' ? 'text-white' : 'text-purple-400'}>
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

      {/* Main Content */}
      <div className="relative z-10 p-8 max-w-7xl mx-auto">
        {/* Paths Grid */}
        {currentView === 'paths' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {pathsData.map((path) => (
              <PathCard
                key={path.id}
                path={path}
                onClick={() => handlePathSelect(path)}
                isCompleted={false}
                progress={Math.floor(Math.random() * 100)}
              />
            ))}
          </div>
        )}

        {/* Chapters List */}
        {currentView === 'chapters' && (
          <div>
            {selectedPath && (
              <div className="mb-8 bg-black/30 backdrop-blur-xl rounded-2xl p-6 border border-purple-500/20">
                <div className="flex items-center gap-4">
                  {React.createElement(selectedPath.icon, { className: "w-12 h-12 text-purple-400" })}
                  <div>
                    <h2 className="text-2xl font-bold text-white">{selectedPath.title}</h2>
                    <p className="text-purple-300">{selectedPath.description}</p>
                  </div>
                </div>
              </div>
            )}

            <div className="grid gap-4">
              {chaptersList.map((chapter, index) => (
                <ChapterCard
                  key={chapter.id}
                  chapter={chapter}
                  onClick={() => handleChapterClick(chapter)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Lessons View with CoreLearningLoop */}
        {currentView === 'lessons' && selectedChapter && selectedChapter.lessonList && (
          <CoreLearningLoop
            chapter={selectedChapter}
            lessons={selectedChapter.lessonList}
            userId={userId}
            onProgress={updateProgress}
            onCompletion={() => setCurrentView('chapters')}
          >
            {({ currentLesson, progress: lessonProgress, actions }) => (
              <LessonPlayer
                lesson={currentLesson || selectedChapter.lessonList[currentLessonIndex]}
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
            // Find and set the lesson index
            const lessonIndex = modalChapter.lessonList?.findIndex(l => l.id === lessonId) || 0;
            setCurrentLessonIndex(lessonIndex);
          }}
        />
      )}
    </div>
  );
};

export default ChapterSystem;