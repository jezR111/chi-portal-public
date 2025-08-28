'use client'

import {
  BookOpen,
  CheckCircle,
  ChevronRight,
  Clock,
  Lock,
  Mountain,
  PlayCircle,
  Star
} from 'lucide-react'
import { useEffect, useState } from 'react'
import ProgressTracker from '../progress/ProgressTracker'
import { LearningMode, LessonType, YinChapter, YinLesson, YinProgress } from '../types/yin.types'
import LessonViewer from './LessonViewer'
import MountainClimb from './MountainClimb'

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

export default function ChapterSystem({
  userId,
  chapters,
  userProgress,
  currentChapterId,
  currentLessonId,
  onProgressUpdate,
  onChapterComplete,
  isPremium = false
}: ChapterSystemProps) {
  const [selectedChapter, setSelectedChapter] = useState<YinChapter | null>(null)
  const [selectedLesson, setSelectedLesson] = useState<YinLesson | null>(null)
  const [lessons, setLessons] = useState<YinLesson[]>([])
  const [viewMode, setViewMode] = useState<'chapters' | 'lesson' | 'mountain'>('chapters')
  const [learningMode, setLearningMode] = useState<LearningMode>(LearningMode.READ)
  const [isLoading, setIsLoading] = useState(false)

  // Initialize with current chapter/lesson
  useEffect(() => {
    if (currentChapterId) {
      const chapter = chapters.find(c => c.id === currentChapterId)
      if (chapter) {
        setSelectedChapter(chapter)
        loadChapterLessons(chapter.id)
      }
    }
  }, [currentChapterId, chapters])

  // Load lessons for a chapter
  const loadChapterLessons = async (chapterId: string) => {
    setIsLoading(true)
    try {
      // TODO: Fetch from API/Notion
      // For now, using mock data
      const mockLessons: YinLesson[] = [
        {
          id: '1',
          chapterId,
          title: 'Introduction to Self-Discovery',
          slug: 'intro-self-discovery',
          order: 1,
          duration: 15,
          content: '# Welcome to Your Journey\n\nThis is where your transformation begins...',
          objectives: ['Understand the concept of self', 'Begin your inner journey'],
          type: LessonType.CONCEPT,
        },
        {
          id: '2',
          chapterId,
          title: 'The Mirror of Awareness',
          slug: 'mirror-awareness',
          order: 2,
          duration: 20,
          content: '# Looking Within\n\nTrue awareness comes from observation without judgment...',
          objectives: ['Practice self-observation', 'Develop awareness'],
          type: LessonType.PRACTICE,
        }
      ]
      setLessons(mockLessons)
    } catch (error) {
      console.error('Failed to load lessons:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Get progress for a specific chapter
  const getChapterProgress = (chapterId: string): number => {
    const progress = userProgress.find(p => p.chapterId === chapterId)
    return progress?.progressPercent || 0
  }

  // Check if chapter is unlocked
  const isChapterUnlocked = (chapter: YinChapter): boolean => {
    if (!chapter.prerequisiteChapters || chapter.prerequisiteChapters.length === 0) {
      return true
    }
    return chapter.prerequisiteChapters.every(prereqId => {
      const progress = getChapterProgress(prereqId)
      return progress >= 100
    })
  }

  // Handle chapter selection
  const handleChapterSelect = (chapter: YinChapter) => {
    if (!isChapterUnlocked(chapter)) {
      return
    }
    if (chapter.isPremium && !isPremium) {
      // TODO: Show upgrade prompt
      return
    }
    setSelectedChapter(chapter)
    loadChapterLessons(chapter.id)
    setViewMode('mountain')
  }

  // Handle lesson selection
  const handleLessonSelect = (lesson: YinLesson) => {
    setSelectedLesson(lesson)
    setViewMode('lesson')
  }

  // Handle lesson completion
  const handleLessonComplete = (lessonId: string) => {
    if (!selectedChapter) return

    const progress = userProgress.find(p => p.chapterId === selectedChapter.id) || {
      userId,
      chapterId: selectedChapter.id,
      progressPercent: 0,
      completedLessons: [],
      startedAt: new Date(),
      lastAccessedAt: new Date(),
      timeSpent: 0
    }

    const updatedProgress: YinProgress = {
      ...progress,
      completedLessons: [...new Set([...progress.completedLessons, lessonId])],
      progressPercent: Math.round(
        ((progress.completedLessons.length + 1) / lessons.length) * 100
      ),
      lastAccessedAt: new Date()
    }

    onProgressUpdate?.(updatedProgress)

    if (updatedProgress.progressPercent === 100) {
      onChapterComplete?.(selectedChapter.id)
    }

    // Move to next lesson or back to mountain view
    const currentIndex = lessons.findIndex(l => l.id === lessonId)
    if (currentIndex < lessons.length - 1) {
      setSelectedLesson(lessons[currentIndex + 1])
    } else {
      setViewMode('mountain')
    }
  }

  // Render chapter grid
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
            disabled={!isUnlocked || (chapter.isPremium && !isPremium)}
            className={`
              relative group bg-white/5 backdrop-blur-xl rounded-2xl p-6 
              border border-white/10 transition-all duration-300
              ${isUnlocked 
                ? 'hover:bg-white/10 hover:scale-105 cursor-pointer' 
                : 'opacity-50 cursor-not-allowed'
              }
              ${isCompleted ? 'ring-2 ring-green-500/50' : ''}
            `}
          >
            {/* Premium Badge */}
            {chapter.isPremium && (
              <div className="absolute top-4 right-4">
                <Star className="w-5 h-5 text-yellow-400" />
              </div>
            )}

            {/* Chapter Icon */}
            <div className={`
              w-16 h-16 rounded-xl mb-4 flex items-center justify-center
              ${isCompleted 
                ? 'bg-gradient-to-br from-green-500 to-emerald-500' 
                : 'bg-gradient-to-br from-indigo-500 to-purple-500'
              }
            `}>
              {isCompleted ? (
                <CheckCircle className="w-8 h-8 text-white" />
              ) : !isUnlocked ? (
                <Lock className="w-8 h-8 text-white" />
              ) : (
                <Mountain className="w-8 h-8 text-white" />
              )}
            </div>

            {/* Chapter Info */}
            <h3 className="text-xl font-semibold text-white mb-2">
              {chapter.title}
            </h3>
            <p className="text-gray-400 text-sm mb-4 line-clamp-2">
              {chapter.description}
            </p>

            {/* Chapter Stats */}
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span className="flex items-center gap-1">
                <BookOpen className="w-3 h-3" />
                {chapter.totalLessons} lessons
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {chapter.estimatedHours}h
              </span>
            </div>

            {/* Progress Bar */}
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

            {/* Start/Continue Button */}
            {isUnlocked && (
              <div className="mt-4 flex items-center justify-center gap-2 text-white">
                <PlayCircle className="w-4 h-4" />
                <span className="font-medium">
                  {progress > 0 ? 'Continue' : 'Start'} Journey
                </span>
                <ChevronRight className="w-4 h-4" />
              </div>
            )}
          </button>
        )
      })}
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-900">
      {/* Header */}
      <div className="bg-black/20 backdrop-blur-xl border-b border-white/10">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">
                The Way of the Self
              </h1>
              <p className="text-gray-400">
                Your journey to inner transformation
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              <ProgressTracker
                overallProgress={
                  Math.round(
                    userProgress.reduce((acc, p) => acc + p.progressPercent, 0) / 
                    Math.max(chapters.length, 1)
                  )
                }
                totalChapters={chapters.length}
                completedChapters={
                  userProgress.filter(p => p.progressPercent === 100).length
                }
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500" />
          </div>
        ) : viewMode === 'chapters' ? (
          <>
            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-white mb-4">
                Choose Your Path
              </h2>
              <p className="text-gray-400">
                Each chapter builds upon the last, creating a complete journey of self-discovery
              </p>
            </div>
            {renderChapterGrid()}
          </>
        ) : viewMode === 'mountain' && selectedChapter ? (
          <MountainClimb
            chapter={selectedChapter}
            lessons={lessons}
            completedLessons={
              userProgress.find(p => p.chapterId === selectedChapter.id)?.completedLessons || []
            }
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
