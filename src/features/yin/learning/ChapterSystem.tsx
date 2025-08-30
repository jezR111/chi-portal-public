'use client'

import {
  BookOpen,
  CheckCircle,
  ChevronRight,
  Clock,
  Lock,
  Mountain,
  PlayCircle,
  Star,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

// --- MOCK IMPLEMENTATIONS of Missing Components & Types ---
// In a real app, these would be in separate files. They are included here
// to make this component runnable in a standalone environment.

// 1. Mock Types
export enum LessonType {
  CONCEPT = 'CONCEPT',
  PRACTICE = 'PRACTICE',
  MEDITATION = 'MEDITATION',
}

export enum LearningMode {
  READ = 'READ',
  LISTEN = 'LISTEN',
}

export interface YinChapter {
  id: string;
  title: string;
  description: string;
  prerequisiteChapters: string[];
  totalLessons: number;
  estimatedHours: number;
  isPremium: boolean;
  lessons?: YinLesson[]; // Optional lessons array
}

export interface YinLesson {
  id: string;
  chapterId: string;
  title: string;
  slug: string;
  order: number;
  duration: number;
  content: string;
  objectives: string[];
  type: LessonType;
  isPremium: boolean;
}

export interface YinProgress {
  userId: string;
  chapterId: string;
  progressPercent: number;
  completedLessons: string[];
  startedAt: Date;
  lastAccessedAt: Date;
  timeSpent: number;
}


// 2. Mock Components
const ProgressTracker = ({ title, overallProgress }: { title?: string, overallProgress: number }) => (
  <div className="p-2 bg-gray-700/50 rounded-lg">
    <p className="text-sm text-gray-300">{title || 'Progress'}</p>
    <div className="w-full bg-gray-600 rounded-full h-2.5">
      <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${overallProgress}%` }}></div>
    </div>
    <p className="text-right text-xs mt-1">{overallProgress}%</p>
  </div>
);

const LessonViewer = ({ lesson, onBack, onComplete }: { lesson: YinLesson, onBack: () => void, onComplete: () => void }) => (
  <div className="p-8 bg-gray-800 rounded-lg">
    <button onClick={onBack} className="mb-4 text-blue-400 hover:underline">{'<'} Back to Mountain</button>
    <h1 className="text-3xl font-bold mb-4">{lesson.title}</h1>
    <p className="mb-6">{lesson.content}</p>
    <button onClick={onComplete} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition">Complete Lesson</button>
  </div>
);

const MountainClimb = ({ chapter, lessons, onLessonSelect, onBack }: { chapter: YinChapter, lessons: YinLesson[], onLessonSelect: (lesson: YinLesson) => void, onBack: () => void }) => (
    <div className="p-8 bg-gray-800 rounded-lg">
        <button onClick={onBack} className="mb-4 text-blue-400 hover:underline">{'<'} Back to Chapters</button>
        <h2 className="text-2xl font-bold mb-4">Mountain Climb: {chapter.title}</h2>
        <ul className="space-y-2">
            {lessons.map(lesson => (
                <li key={lesson.id} onClick={() => onLessonSelect(lesson)} className="cursor-pointer p-3 bg-gray-700 rounded hover:bg-gray-600">
                    {lesson.title}
                </li>
            ))}
        </ul>
    </div>
);


// --- MOCK DATA (for standalone testing) ---
const MOCK_CHAPTERS: YinChapter[] = [
    { id: '1', title: 'Chapter 1: The Awakening', description: 'Begin your journey by understanding the core principles of self-awareness.', prerequisiteChapters: [], totalLessons: 2, estimatedHours: 1, isPremium: false },
    { id: '2', title: 'Chapter 2: The Inner World', description: 'Explore the landscape of your thoughts and emotions.', prerequisiteChapters: ['1'], totalLessons: 2, estimatedHours: 2, isPremium: false },
    { id: '3', title: 'Chapter 3: The Shadow Self', description: 'Confront and integrate the hidden aspects of your psyche.', prerequisiteChapters: ['2'], totalLessons: 2, estimatedHours: 2, isPremium: true },
];

const MOCK_USER_PROGRESS: YinProgress[] = [
    { userId: '123', chapterId: '1', progressPercent: 100, completedLessons: ['1-1', '1-2'], startedAt: new Date(), lastAccessedAt: new Date(), timeSpent: 3600 },
    { userId: '123', chapterId: '2', progressPercent: 50, completedLessons: ['2-1'], startedAt: new Date(), lastAccessedAt: new Date(), timeSpent: 1800 },
];


// --- COMPONENT PROPS INTERFACE ---
interface ChapterSystemProps {
  userId: string
  chapters: YinChapter[]
  userProgress: YinProgress[]
  currentChapterId?: string
  currentLessonId?: string
  onProgressUpdate?: (progress: YinProgress) => void
  onChapterComplete?: (chapterId: string) => void
  isPremium?: boolean
}

// --- MAIN CHAPTER SYSTEM COMPONENT ---
export default function ChapterSystem({
  userId,
  chapters = MOCK_CHAPTERS,
  userProgress = MOCK_USER_PROGRESS,
  currentChapterId,
  currentLessonId,
  onProgressUpdate,
  onChapterComplete,
  isPremium = false,
}: ChapterSystemProps) {
  const [selectedChapter, setSelectedChapter] = useState<YinChapter | null>(null)
  const [selectedLesson, setSelectedLesson] = useState<YinLesson | null>(null)
  const [lessons, setLessons] = useState<YinLesson[]>([])
  const [viewMode, setViewMode] = useState<'chapters' | 'lesson' | 'mountain'>('chapters')
  const [learningMode, setLearningMode] = useState<LearningMode>(LearningMode.READ)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (currentChapterId) {
      const chapter = chapters.find((c) => c.id === currentChapterId)
      if (chapter) {
        setSelectedChapter(chapter)
        loadChapterLessons(chapter.id)
      }
    }
  }, [currentChapterId, chapters])

  const loadChapterLessons = async (chapterId: string) => {
    setIsLoading(true)
    try {
      console.log(`Fetching lessons for chapter: ${chapterId}`)
      const mockLessons: YinLesson[] = [
        { id: `${chapterId}-1`, chapterId, title: 'Introduction to Self-Discovery', slug: 'intro-self-discovery', order: 1, duration: 15, content: '# Welcome to Your Journey...', objectives: ['Understand the concept of self'], type: LessonType.CONCEPT, isPremium: false },
        { id: `${chapterId}-2`, chapterId, title: 'The Mirror of Awareness', slug: 'mirror-awareness', order: 2, duration: 20, content: '# Looking Within...', objectives: ['Practice self-observation'], type: LessonType.PRACTICE, isPremium: chapterId === '3' },
      ]
      setLessons(mockLessons)
    } catch (error) {
      console.error('Failed to load lessons:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getChapterProgress = (chapterId: string): number => {
    const progress = userProgress.find((p) => p.chapterId === chapterId)
    return progress?.progressPercent || 0
  }

  const isChapterUnlocked = (chapter: YinChapter): boolean => {
    if (!chapter.prerequisiteChapters || chapter.prerequisiteChapters.length === 0) {
      return true
    }
    return chapter.prerequisiteChapters.every((prereqId) => {
      const progress = getChapterProgress(prereqId)
      return progress >= 100
    })
  }

  const handleChapterSelect = (chapter: YinChapter) => {
    if (!isChapterUnlocked(chapter)) return
    if (chapter.isPremium && !isPremium) {
      alert('This is a premium chapter. Please upgrade to access.')
      return
    }
    setSelectedChapter(chapter)
    loadChapterLessons(chapter.id)
    setViewMode('mountain')
  }

  const handleLessonSelect = (lesson: YinLesson) => {
    setSelectedLesson(lesson)
    setViewMode('lesson')
  }

  const handleLessonComplete = (lessonId: string) => {
    if (!selectedChapter) return

    const progress = userProgress.find((p) => p.chapterId === selectedChapter.id) || {
      userId,
      chapterId: selectedChapter.id,
      progressPercent: 0,
      completedLessons: [],
      startedAt: new Date(),
      lastAccessedAt: new Date(),
      timeSpent: 0,
    }

    const updatedProgress: YinProgress = {
      ...progress,
      completedLessons: [...new Set([...progress.completedLessons, lessonId])],
      progressPercent: Math.round(
        ((progress.completedLessons.length + 1) / lessons.length) * 100
      ),
      lastAccessedAt: new Date(),
    }

    onProgressUpdate?.(updatedProgress)

    if (updatedProgress.progressPercent === 100) {
      onChapterComplete?.(selectedChapter.id)
    }

    const currentIndex = lessons.findIndex((l) => l.id === lessonId)
    if (currentIndex < lessons.length - 1) {
      setSelectedLesson(lessons[currentIndex + 1])
    } else {
      setViewMode('mountain')
    }
  }
  
  const overallProgress = useMemo(() => {
    if (!userProgress || userProgress.length === 0 || chapters.length === 0) return 0
    const totalProgress = userProgress.reduce((acc, p) => acc + (p.progressPercent || 0), 0)
    return Math.round(totalProgress / chapters.length)
  }, [userProgress, chapters]);

  const renderChapterGrid = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {chapters.map((chapter) => {
        const progress = getChapterProgress(chapter.id)
        const isUnlocked = isChapterUnlocked(chapter)
        const isCompleted = progress === 100

        return (
          <button
            key={chapter.id}
            onClick={() => handleChapterSelect(chapter)}
            disabled={!isUnlocked}
            className={`relative group text-left bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 transition-all duration-300 ${
              isUnlocked
                ? 'hover:bg-white/10 hover:scale-105 cursor-pointer'
                : 'opacity-50 cursor-not-allowed'
            } ${isCompleted ? 'ring-2 ring-green-500/50' : ''}`}
          >
            {chapter.isPremium && !isPremium && (
              <div className="absolute top-4 right-4 bg-yellow-500/10 p-1 rounded-full">
                <Star className="w-5 h-5 text-yellow-400" />
              </div>
            )}

            <div
              className={`w-16 h-16 rounded-xl mb-4 flex items-center justify-center ${
                isCompleted
                  ? 'bg-gradient-to-br from-green-500 to-emerald-500'
                  : 'bg-gradient-to-br from-indigo-500 to-purple-500'
              }`}
            >
              {isCompleted ? (
                <CheckCircle className="w-8 h-8 text-white" />
              ) : !isUnlocked ? (
                <Lock className="w-8 h-8 text-white" />
              ) : (
                <Mountain className="w-8 h-8 text-white" />
              )}
            </div>

            <h3 className="text-xl font-semibold text-white mb-2">{chapter.title}</h3>
            <p className="text-gray-400 text-sm mb-4 line-clamp-2 h-10">{chapter.description}</p>

            <div className="flex items-center justify-between text-xs text-gray-500">
              <span className="flex items-center gap-1"><BookOpen className="w-3 h-3" />{chapter.totalLessons} lessons</span>
              <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{chapter.estimatedHours}h</span>
            </div>

            {progress > 0 && (
              <div className="mt-4">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-400">Progress</span>
                  <span className="text-white font-medium">{progress}%</span>
                </div>
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            )}

            {isUnlocked && (
              <div className="mt-4 flex items-center justify-center gap-2 text-white opacity-0 group-hover:opacity-100 transition-opacity">
                <PlayCircle className="w-4 h-4" />
                <span className="font-medium">{progress > 0 ? 'Continue' : 'Start'} Journey</span>
                <ChevronRight className="w-4 h-4" />
              </div>
            )}
          </button>
        )
      })}
    </div>
  )

  return (
    <div className="min-h-screen text-white">
      <div className="container mx-auto px-4 py-8">
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500" />
          </div>
        ) : viewMode === 'chapters' ? (
          <>
            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-white mb-4">Choose Your Path</h2>
              <p className="text-gray-400">Each chapter builds upon the last, creating a complete journey of self-discovery.</p>
            </div>
            {renderChapterGrid()}
          </>
        ) : viewMode === 'mountain' && selectedChapter ? (
          <MountainClimb
            chapter={selectedChapter}
            lessons={lessons}
            completedLessons={userProgress.find((p) => p.chapterId === selectedChapter.id)?.completedLessons || []}
            currentLessonId={currentLessonId}
            onLessonSelect={handleLessonSelect}
            onBack={() => setViewMode('chapters')}
          />
        ) : viewMode === 'lesson' && selectedLesson ? (
          <LessonViewer
            lesson={selectedLesson}
            learningMode={learningMode}
            onModeChange={setLearningMode}
            onComplete={() => handleLessonComplete(selectedLesson.id)}
            onBack={() => setViewMode('mountain')}
          />
        ) : null}
      </div>
    </div>
  )
}
