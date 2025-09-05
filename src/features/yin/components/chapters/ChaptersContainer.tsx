// src/features/yin/components/chapters/PathsView.tsx
import {
  Activity,
  ArrowLeft, BookOpen,
  Brain,
  CheckCircle, ChevronRight, Circle, Clock,
  Compass,
  Crown,
  Flame,
  Heart,
  Infinity,
  Lock,
  Mountain,
  Shield,
  Sparkles,
  Star, Zap
} from 'lucide-react';
import { useEffect, useState } from 'react';

// Path Data Structure with Notion IDs
const pathsData = [
  {
    id: 'the-self',
    notionId: 'af01829f-b333-4d99-9dfc-e571195357c1',
    title: 'The Self',
    icon: Brain,
    description: 'Discover your authentic self and build a strong foundation of self-awareness',
    color: 'from-purple-600 to-purple-800',
    glow: 'shadow-purple-500/50',
    estimatedTime: '4-6 weeks',
    chapters: [], // Will be populated from Notion
    progress: 45,
    unlocked: true
  },
  {
    id: 'energy-bodies',
    notionId: 'b9dfedbe-c00f-48c0-ac8a-76a48c5419ec',
    title: 'Energy Bodies',
    icon: Zap,
    description: 'Understand and work with your subtle energy systems',
    color: 'from-indigo-600 to-blue-700',
    glow: 'shadow-indigo-500/50',
    estimatedTime: '3-4 weeks',
    chapters: [],
    progress: 20,
    unlocked: true
  },
  {
    id: 'inward-journey',
    notionId: 'd4d47a9d-5197-42f7-9e59-46e01f3d1ede',
    title: 'The Inward Journey',
    icon: Compass,
    description: 'Navigate your inner landscape and discover hidden treasures within',
    color: 'from-purple-700 to-pink-700',
    glow: 'shadow-pink-500/50',
    estimatedTime: '5-6 weeks',
    chapters: [],
    progress: 0,
    unlocked: true
  },
  {
    id: 'self-relating',
    title: 'The Self Relating to Others',
    icon: Heart,
    description: 'Master the art of authentic relationships and healthy boundaries',
    color: 'from-pink-600 to-rose-700',
    glow: 'shadow-rose-500/50',
    estimatedTime: '4-5 weeks',
    chapters: [],
    progress: 0,
    unlocked: false
  },
  {
    id: 'doing',
    title: 'Doing',
    icon: Activity,
    description: 'Align your actions with your authentic self and purpose',
    color: 'from-orange-600 to-red-700',
    glow: 'shadow-orange-500/50',
    estimatedTime: '3-4 weeks',
    chapters: [],
    progress: 0,
    unlocked: false
  },
  {
    id: 'self-mastery',
    title: 'Self Mastery',
    icon: Crown,
    description: 'Achieve mastery over your mind, emotions, and reactions',
    color: 'from-yellow-600 to-orange-700',
    glow: 'shadow-yellow-500/50',
    estimatedTime: '6-8 weeks',
    chapters: [],
    progress: 0,
    unlocked: false
  },
  {
    id: 'life',
    title: 'Life',
    icon: Sparkles,
    description: 'Understand the greater patterns and purpose of existence',
    color: 'from-green-600 to-teal-700',
    glow: 'shadow-green-500/50',
    estimatedTime: '4-5 weeks',
    chapters: [],
    progress: 0,
    unlocked: false
  },
  {
    id: 'metaphysics',
    title: 'Metaphysics',
    icon: Infinity,
    description: 'Explore the nature of reality and consciousness itself',
    color: 'from-indigo-700 to-purple-900',
    glow: 'shadow-indigo-600/50',
    estimatedTime: '8-10 weeks',
    chapters: [],
    progress: 0,
    unlocked: false
  }
];

// Mock chapter data for demonstration
const mockChapters = {
  'the-self': [
    { id: '1', title: 'Overview of The Self', description: 'Understanding the foundation', lessons: 5, completed: true, progress: 100 },
    { id: '2', title: 'The Stages of Self', description: 'Evolution of self-awareness', lessons: 7, completed: false, progress: 60 },
    { id: '3', title: 'The Types of Selves', description: 'Different aspects of identity', lessons: 6, completed: false, progress: 0, locked: false },
    { id: '4', title: 'Self Image & Identity', description: 'How we see ourselves', lessons: 8, completed: false, progress: 0, locked: true }
  ],
  'energy-bodies': [
    { id: '1', title: 'Introduction to Energy', description: 'Understanding subtle energies', lessons: 4, completed: true, progress: 100 },
    { id: '2', title: 'The Chakra System', description: 'Seven energy centers', lessons: 7, completed: false, progress: 30 },
    { id: '3', title: 'Aura and Energy Fields', description: 'Your energetic boundary', lessons: 5, completed: false, progress: 0, locked: true }
  ],
  'inward-journey': [
    { id: '1', title: 'Beginning the Journey', description: 'First steps inward', lessons: 6, completed: false, progress: 0 },
    { id: '2', title: 'Meditation Foundations', description: 'Building your practice', lessons: 8, completed: false, progress: 0, locked: true }
  ]
};

// Background Effects Component
const BackgroundEffects = () => (
  <div className="fixed inset-0 pointer-events-none">
    {/* Fixed gradient without white - addressing the dashboard issue */}
    <div className="absolute inset-0 bg-gradient-to-br from-gray-950 via-purple-950 to-indigo-950" />
    
    {/* Animated orbs */}
    <div className="absolute inset-0 opacity-30">
      <div className="absolute top-0 left-0 w-96 h-96 bg-purple-800 rounded-full filter blur-3xl animate-pulse" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-800 rounded-full filter blur-3xl animate-pulse delay-1000" />
      <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-pink-900 rounded-full filter blur-3xl animate-pulse delay-2000" />
    </div>

    {/* Floating particles */}
    <div className="absolute inset-0">
      {[...Array(30)].map((_, i) => (
        <div
          key={i}
          className="absolute animate-float"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 10}s`,
            animationDuration: `${15 + Math.random() * 20}s`
          }}
        >
          <div className="w-1 h-1 bg-purple-400 rounded-full opacity-60" />
        </div>
      ))}
    </div>
  </div>
);

// Path Card Component
const PathCard = ({ path, onClick }) => {
  const Icon = path.icon;
  
  return (
    <div 
      onClick={() => path.unlocked && onClick()}
      className={`relative group cursor-pointer transform transition-all duration-300 ${
        path.unlocked ? 'hover:scale-105' : 'opacity-50 cursor-not-allowed'
      }`}
    >
      <div className={`relative h-72 bg-gradient-to-br ${path.color} rounded-2xl p-6 overflow-hidden ${path.glow} shadow-xl hover:shadow-2xl transition-all`}>
        {/* Glass overlay */}
        <div className="absolute inset-0 bg-white/5 backdrop-blur-sm" />
        
        {/* Content */}
        <div className="relative z-10">
          {/* Header */}
          <div className="flex justify-between items-start mb-4">
            <div className="w-14 h-14 bg-white/10 backdrop-blur rounded-xl flex items-center justify-center">
              <Icon className="w-7 h-7 text-white" />
            </div>
            {!path.unlocked && (
              <Lock className="w-5 h-5 text-white/50" />
            )}
            {path.progress > 0 && (
              <div className="px-2 py-1 bg-white/20 rounded-full">
                <span className="text-xs text-white font-medium">{path.progress}%</span>
              </div>
            )}
          </div>

          {/* Title & Description */}
          <h3 className="text-2xl font-bold text-white mb-2">{path.title}</h3>
          <p className="text-white/80 text-sm leading-relaxed mb-4">{path.description}</p>
          
          {/* Stats */}
          <div className="flex items-center gap-3 text-white/60 text-xs mb-4">
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {path.estimatedTime}
            </span>
            <span className="flex items-center gap-1">
              <BookOpen className="w-3 h-3" />
              {path.chapters.length || '8-12'} chapters
            </span>
          </div>

          {/* Progress Bar */}
          {path.progress > 0 && (
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/30">
              <div 
                className="h-full bg-gradient-to-r from-white/40 to-white/60 transition-all"
                style={{ width: `${path.progress}%` }}
              />
            </div>
          )}

          {/* Hover indicator */}
          {path.unlocked && (
            <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
              <ChevronRight className="w-6 h-6 text-white/80" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Chapter List Item
const ChapterItem = ({ chapter, index, onClick }) => {
  return (
    <div 
      onClick={() => !chapter.locked && onClick()}
      className={`relative bg-white/5 backdrop-blur-xl rounded-xl p-5 transition-all ${
        chapter.locked ? 'opacity-50 cursor-not-allowed' : 'hover:bg-white/10 cursor-pointer'
      }`}
    >
      {/* Chapter Number */}
      <div className="absolute -left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-gradient-to-br from-purple-600 to-purple-700 rounded-full flex items-center justify-center shadow-lg">
        <span className="text-white font-bold text-sm">{index + 1}</span>
      </div>
      
      <div className="ml-8 flex items-center justify-between">
        <div className="flex-1">
          <h4 className="text-lg font-semibold text-white mb-1">{chapter.title}</h4>
          <p className="text-purple-300 text-sm mb-3">{chapter.description}</p>
          <div className="flex items-center gap-4">
            <span className="text-purple-400 text-xs flex items-center gap-1">
              <BookOpen className="w-3 h-3" />
              {chapter.lessons} lessons
            </span>
            {chapter.progress > 0 && (
              <span className="text-purple-400 text-xs">
                {chapter.progress}% complete
              </span>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          {chapter.completed ? (
            <CheckCircle className="w-6 h-6 text-green-400" />
          ) : chapter.locked ? (
            <Lock className="w-6 h-6 text-purple-500/50" />
          ) : (
            <Circle className="w-6 h-6 text-purple-400" />
          )}
          {!chapter.locked && (
            <ChevronRight className="w-5 h-5 text-purple-400 group-hover:translate-x-1 transition-transform" />
          )}
        </div>
      </div>

      {/* Progress bar */}
      {chapter.progress > 0 && (
        <div className="mt-4 ml-8">
          <div className="h-1 bg-black/50 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-purple-500 to-purple-400 transition-all"
              style={{ width: `${chapter.progress}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

// Main Paths View Component
const PathsView = () => {
  const [currentView, setCurrentView] = useState('paths');
  const [selectedPath, setSelectedPath] = useState(null);
  const [selectedChapter, setSelectedChapter] = useState(null);
  const [chapters, setChapters] = useState([]);

  // Simulate fetching chapters from Notion when a path is selected
  useEffect(() => {
    if (selectedPath && mockChapters[selectedPath.id]) {
      setChapters(mockChapters[selectedPath.id]);
    } else {
      setChapters([]);
    }
  }, [selectedPath]);

  const handlePathSelect = (path) => {
    setSelectedPath(path);
    setCurrentView('chapters');
  };

  const handleChapterSelect = (chapter) => {
    setSelectedChapter(chapter);
    setCurrentView('lessons');
  };

  const handleBack = () => {
    if (currentView === 'lessons') {
      setCurrentView('chapters');
      setSelectedChapter(null);
    } else if (currentView === 'chapters') {
      setCurrentView('paths');
      setSelectedPath(null);
    }
  };

  return (
    <div className="min-h-screen relative">
      <BackgroundEffects />
      
      {/* Header */}
      <div className="relative z-20 bg-black/30 backdrop-blur-xl border-b border-purple-500/20 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-4">
            {currentView !== 'paths' && (
              <button
                onClick={handleBack}
                className="p-2 hover:bg-purple-500/20 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-purple-300" />
              </button>
            )}
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-200 to-pink-200 bg-clip-text text-transparent">
                {currentView === 'paths' && 'Choose Your Path'}
                {currentView === 'chapters' && selectedPath?.title}
                {currentView === 'lessons' && selectedChapter?.title}
              </h1>
              <p className="text-purple-300 mt-1">
                {currentView === 'paths' && 'Begin your journey inward with guided exploration'}
                {currentView === 'chapters' && 'Select a chapter to dive deeper'}
                {currentView === 'lessons' && 'Complete lessons to progress'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 p-8 max-w-7xl mx-auto">
        {/* Paths Grid */}
        {currentView === 'paths' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {pathsData.map((path, index) => (
              <PathCard
                key={path.id}
                path={path}
                onClick={() => handlePathSelect(path)}
              />
            ))}
          </div>
        )}

        {/* Chapters List */}
        {currentView === 'chapters' && selectedPath && (
          <div className="max-w-4xl mx-auto">
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-purple-500/20 p-6 mb-8">
              <p className="text-purple-200 leading-relaxed">
                {selectedPath.description}. This path contains {chapters.length || '8-12'} chapters that will guide you through a transformative journey of self-discovery.
              </p>
            </div>

            <div className="space-y-4">
              {chapters.length > 0 ? (
                chapters.map((chapter, index) => (
                  <ChapterItem
                    key={chapter.id}
                    chapter={chapter}
                    index={index}
                    onClick={() => handleChapterSelect(chapter)}
                  />
                ))
              ) : (
                <div className="text-center py-12 text-purple-300">
                  <Sparkles className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Loading chapters from your journey...</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Lessons View */}
        {currentView === 'lessons' && selectedChapter && (
          <div className="max-w-4xl mx-auto">
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-purple-500/20 p-8">
              <div className="text-center">
                <Mountain className="w-16 h-16 text-purple-400 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-white mb-2">{selectedChapter.title}</h2>
                <p className="text-purple-300 mb-6">{selectedChapter.description}</p>
                <p className="text-purple-400">
                  This chapter contains {selectedChapter.lessons} lessons
                </p>
                <button className="mt-6 px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-purple-500/25 transition-all">
                  Start First Lesson
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Stats Footer */}
      <div className="relative z-10 mt-12 p-8">
        <div className="max-w-7xl mx-auto flex justify-center gap-8">
          <div className="text-center">
            <Flame className="w-6 h-6 text-orange-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-white">7</p>
            <p className="text-sm text-purple-400">Day Streak</p>
          </div>
          <div className="text-center">
            <Star className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-white">2,450</p>
            <p className="text-sm text-purple-400">Total XP</p>
          </div>
          <div className="text-center">
            <Shield className="w-6 h-6 text-purple-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-white">Level 3</p>
            <p className="text-sm text-purple-400">Explorer</p>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) translateX(0); }
          33% { transform: translateY(-20px) translateX(10px); }
          66% { transform: translateY(10px) translateX(-10px); }
        }
      `}</style>
    </div>
  );
};

export default PathsView;