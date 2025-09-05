// src/features/yin/components/chapters/ChapterSystem.tsx
import { ChapterCard } from '@/features/yin/components/chapters/ChapterCard';
import { ChapterDetailModal } from '@/features/yin/components/chapters/ChapterDetailModal';
import { LessonPlayer } from '@/features/yin/components/chapters/LessonPlayer';
import {
  Activity,
  BookOpen,
  Brain,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Clock,
  Compass,
  Crown,
  Heart,
  Infinity,
  Lock,
  PlayCircle,
  Sparkles,
  Zap
} from 'lucide-react';
import React, { useEffect, useState } from 'react';

// Path data with Notion IDs
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
  {
    id: 'energy-bodies',
    notionId: 'b9dfedbe-c00f-48c0-ac8a-76a48c5419ec',
    title: 'Energy Bodies',
    subtitle: 'Subtle Systems',
    description: 'Understand and work with your subtle energy systems',
    icon: Zap,
    gradient: 'from-blue-600 to-cyan-600',
    glowColor: 'blue',
    chapters: []
  },
  {
    id: 'inward-journey',
    notionId: 'd4d47a9d-5197-42f7-9e59-46e01f3d1ede',
    title: 'The Inward Journey',
    subtitle: 'Inner Exploration',
    description: 'Navigate your inner landscape and discover hidden treasures within',
    icon: Compass,
    gradient: 'from-violet-600 to-purple-600',
    glowColor: 'violet',
    chapters: []
  },
  {
    id: 'self-relating',
    notionId: 'a3ce0891-a8df-4d62-b95f-b1146a32436b',
    title: 'Self Relating to Others',
    subtitle: 'Connection & Boundaries',
    description: 'Master the art of authentic relationships and healthy boundaries',
    icon: Heart,
    gradient: 'from-pink-600 to-rose-600',
    glowColor: 'pink',
    chapters: []
  },
  {
    id: 'doing',
    title: 'Doing',
    subtitle: 'Aligned Action',
    description: 'Transform intention into purposeful action aligned with your truth',
    icon: Activity,
    gradient: 'from-orange-600 to-red-600',
    glowColor: 'orange',
    chapters: []
  },
  {
    id: 'self-mastery',
    title: 'Self Mastery',
    subtitle: 'Ultimate Control',
    description: 'Achieve mastery over mind, emotions, and reactions',
    icon: Crown,
    gradient: 'from-amber-600 to-yellow-600',
    glowColor: 'amber',
    chapters: []
  },
  {
    id: 'life',
    title: 'Life',
    subtitle: 'Living Fully',
    description: 'Understand the greater patterns and purpose of existence',
    icon: Sparkles,
    gradient: 'from-emerald-600 to-green-600',
    glowColor: 'emerald',
    chapters: []
  },
  {
    id: 'metaphysics',
    title: 'Metaphysics',
    subtitle: 'Beyond Physical',
    description: 'Explore the nature of reality and consciousness itself',
    icon: Infinity,
    gradient: 'from-indigo-600 to-purple-700',
    glowColor: 'indigo',
    chapters: []
  }
];

// Mock chapter data for demonstration
const mockChapters = {
  'the-self': [
    { id: '1', title: 'Overview of The Self', description: 'Understanding your foundation', lessons: 6, duration: '2h 15m', completed: true, progress: 100 },
    { id: '2', title: 'The Stages of Self', description: 'Evolution of self-awareness', lessons: 8, duration: '3h 20m', completed: false, progress: 45 },
    { id: '3', title: 'Types of Selves', description: 'Different aspects of identity', lessons: 7, duration: '2h 45m', completed: false, progress: 0 },
    { id: '4', title: 'Self Image & Identity', description: 'How we see ourselves', lessons: 5, duration: '2h 00m', completed: false, progress: 0, locked: true }
  ],
  'energy-bodies': [
    { id: '1', title: 'Introduction to Energy', description: 'Understanding subtle energies', lessons: 5, duration: '1h 45m', completed: true, progress: 100 },
    { id: '2', title: 'The Seven Chakras', description: 'Energy centers explained', lessons: 7, duration: '3h 00m', completed: false, progress: 60 },
    { id: '3', title: 'Aura & Energy Fields', description: 'Your energetic boundary', lessons: 6, duration: '2h 30m', completed: false, progress: 0, locked: true }
  ]
};

// Path Card Component
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
        {/* Animated gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        {/* Floating particles effect */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white/30 rounded-full animate-float"
              style={{
                left: `${20 + i * 15}%`,
                top: `${80 - i * 10}%`,
                animationDelay: `${i * 0.2}s`,
                animationDuration: `${3 + i * 0.5}s`
              }}
            />
          ))}
        </div>

        {/* Content */}
        <div className="relative z-10 h-full p-6 flex flex-col">
          {/* Icon Container */}
          <div className="mb-4">
            <div className="w-16 h-16 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <Icon className="w-8 h-8 text-white" />
            </div>
          </div>

          {/* Title & Description */}
          <div className="flex-1">
            <h3 className="text-2xl font-bold text-white mb-1">{path.title}</h3>
            <p className="text-white/80 text-sm mb-2">{path.subtitle}</p>
            <p className="text-white/60 text-xs leading-relaxed">{path.description}</p>
          </div>

          {/* Progress */}
          {progress > 0 && (
            <div className="mt-4">
              <div className="flex justify-between text-xs text-white/80 mb-1">
                <span>Progress</span>
                <span>{progress}%</span>
              </div>
              <div className="h-2 bg-black/30 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-white/60 to-white/40 transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}

          {/* Status Badge */}
          <div className="absolute top-6 right-6">
            {isCompleted && (
              <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
            )}
          </div>

          {/* Hover Indicator */}
          <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <ChevronRight className="w-6 h-6 text-white/80" />
          </div>
        </div>
      </div>
    </div>
  );
};

// Chapter List Item
const ChapterCard = ({ chapter, index, onClick }) => {
  return (
    <div 
      onClick={() => !chapter.locked && onClick()}
      className={`
        relative bg-black/30 backdrop-blur-xl rounded-xl p-5 
        border border-purple-500/20 transition-all duration-300
        ${chapter.locked ? 'opacity-50 cursor-not-allowed' : 'hover:bg-black/40 hover:border-purple-400/40 cursor-pointer'}
      `}
    >
      {/* Chapter Number */}
      <div className="absolute -left-3 -top-3 w-10 h-10 bg-gradient-to-br from-purple-600 to-purple-800 rounded-full flex items-center justify-center shadow-lg">
        <span className="text-white font-bold text-sm">{index + 1}</span>
      </div>

      <div className="ml-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h4 className="text-lg font-semibold text-white mb-1">{chapter.title}</h4>
            <p className="text-purple-300 text-sm">{chapter.description}</p>
          </div>
          {chapter.locked ? (
            <Lock className="w-5 h-5 text-gray-500 ml-3" />
          ) : chapter.completed ? (
            <CheckCircle className="w-5 h-5 text-green-400 ml-3" />
          ) : (
            <PlayCircle className="w-5 h-5 text-purple-400 ml-3" />
          )}
        </div>

        <div className="flex items-center gap-4 text-xs">
          <span className="text-purple-400 flex items-center gap-1">
            <BookOpen className="w-3 h-3" />
            {chapter.lessons} lessons
          </span>
          <span className="text-purple-400 flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {chapter.duration}
          </span>
        </div>

        {chapter.progress > 0 && (
          <div className="mt-3">
            <div className="h-1.5 bg-black/50 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-purple-500 to-purple-400 transition-all"
                style={{ width: `${chapter.progress}%` }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Main Chapter System Component
const ChapterSystem = () => {
  const [currentView, setCurrentView] = useState('paths'); // paths | chapters | lessons
  const [selectedPath, setSelectedPath] = useState(null);
  const [selectedChapter, setSelectedChapter] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showChapterModal, setShowChapterModal] = useState(false);
  const [modalChapter, setModalChapter] = useState(null);


  // Load chapters when a path is selected
  useEffect(() => {
    if (selectedPath && mockChapters[selectedPath.id]) {
      setChapters(mockChapters[selectedPath.id]);
    }
  }, [selectedPath]);

  const handlePathSelect = (path) => {
    setSelectedPath(path);
    setCurrentView('chapters');
    // Here you would fetch chapters from Notion using path.notionId
  };

  const handleChapterSelect = (chapter) => {
    setSelectedChapter(chapter);
    setCurrentView('lessons');
    // Here you would fetch lessons from Notion
  };

  const handleBack = () => {
    if (currentView === 'lessons') {
      setCurrentView('chapters');
      setSelectedChapter(null);
    } else if (currentView === 'chapters') {
      setCurrentView('paths');
      setSelectedPath(null);
      setChapters([]);
    }
  };

const handleChapterClick = (chapter) => {
  setModalChapter(chapter);
  setShowChapterModal(true);
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
              <span className={currentView === 'paths' ? 'text-white' : 'text-purple-400 cursor-pointer hover:text-white'} onClick={() => setCurrentView('paths')}>
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
                progress={Math.floor(Math.random() * 100)} // Mock progress
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
              {chapters.map((chapter, index) => (
                <ChapterCard
                  key={chapter.id}
                  chapter={chapter}
                  index={index}
                  onClick={() => !chapter.locked && handleChapterClick(chapter)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Lessons View */}
        {currentView === 'lessons' && selectedChapter && (
          <LessonPlayer
            lesson={selectedChapter.lessons[0]} // or track current lesson index
            chapter={selectedChapter}
            onComplete={handleLessonComplete}
            onNext={handleNextLesson}
            onInsightCapture={handleInsightCapture}
          />
        )}
      </div> {/* <--- THIS IS THE CORRECTED LINE TO ADD */}


{showChapterModal && modalChapter && (
  <ChapterDetailModal
    chapter={modalChapter}
    onClose={() => setShowChapterModal(false)}
    onLessonStart={(lessonId) => {
      handleChapterSelect(modalChapter);
      setShowChapterModal(false);
    }}
  />
)}

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) translateX(0); }
          33% { transform: translateY(-10px) translateX(5px); }
          66% { transform: translateY(5px) translateX(-5px); }
        }
        .animate-float {
          animation: float ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};
export default ChapterSystem;