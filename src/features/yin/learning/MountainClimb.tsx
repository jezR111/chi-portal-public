'use client'

import {
  Award,
  CheckCircle,
  ChevronLeft,
  Clock,
  Flag,
  Footprints,
  Lock,
  MapPin,
  Play,
  Star,
  Tent,
  TreePine
} from 'lucide-react'
import { YinChapter, YinLesson } from '../types/yin.types'

interface MountainClimbProps {
  chapter: YinChapter
  lessons: YinLesson[]
  completedLessons: string[]
  currentLessonId?: string
  onLessonSelect: (lesson: YinLesson) => void
  onBack: () => void
}

export default function MountainClimb({
  chapter,
  lessons,
  completedLessons,
  currentLessonId,
  onLessonSelect,
  onBack
}: MountainClimbProps) {
  // Calculate progress
  const progress = lessons.length > 0 
    ? (completedLessons.length / lessons.length) * 100 
    : 0
  const currentAltitude = Math.round((completedLessons.length / Math.max(lessons.length, 1)) * 8848)

  // Determine zone based on progress
  const getZone = () => {
    if (progress < 25) return 'basecamp'
    if (progress < 50) return 'foothills'
    if (progress < 75) return 'ascent'
    return 'summit'
  }

  const zone = getZone()

  // Zone-based styling
  const zoneStyles = {
    basecamp: {
      bg: 'from-green-900 via-emerald-800 to-teal-900',
      sky: 'from-blue-400 to-blue-600',
      clouds: 'opacity-30'
    },
    foothills: {
      bg: 'from-stone-800 via-gray-800 to-slate-800',
      sky: 'from-blue-500 to-indigo-600',
      clouds: 'opacity-50'
    },
    ascent: {
      bg: 'from-gray-900 via-slate-900 to-gray-900',
      sky: 'from-indigo-600 to-purple-700',
      clouds: 'opacity-70'
    },
    summit: {
      bg: 'from-purple-900 via-indigo-900 to-blue-900',
      sky: 'from-purple-700 to-pink-600',
      clouds: 'opacity-20'
    }
  }

  // Create path points for the climbing trail
  const createPath = () => {
    return lessons.map((lesson, index) => {
      const x = 10 + (index / Math.max(lessons.length - 1, 1)) * 80
      const y = 85 - (index / Math.max(lessons.length - 1, 1)) * 70
      const isCompleted = completedLessons.includes(lesson.id)
      const isCurrent = currentLessonId === lesson.id
      const isLocked = index > 0 && !completedLessons.includes(lessons[index - 1].id)
      
      return {
        lesson,
        x,
        y,
        isCompleted,
        isCurrent,
        isLocked,
        index
      }
    })
  }

  const pathPoints = createPath()

  return (
    <div className={`relative min-h-[600px] bg-gradient-to-b ${zoneStyles[zone].sky} overflow-hidden rounded-3xl`}>
      {/* Back Button */}
      <button
        onClick={onBack}
        className="absolute top-4 left-4 z-20 flex items-center gap-2 px-4 py-2 bg-black/20 backdrop-blur-md rounded-xl text-white hover:bg-black/30 transition-colors"
      >
        <ChevronLeft className="w-5 h-5" />
        Back to Chapters
      </button>

      {/* Background elements */}
      <div className="absolute inset-0">
        {/* Stars for higher altitudes */}
        {(zone === 'ascent' || zone === 'summit') && (
          <div className="absolute inset-0">
            {[...Array(30)].map((_, i) => (
              <Star
                key={i}
                className="absolute text-white animate-pulse"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 40}%`,
                  animationDelay: `${Math.random() * 3}s`,
                  fontSize: `${Math.random() * 10 + 5}px`,
                  opacity: Math.random() * 0.7 + 0.3
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Main content */}
      <div className="relative z-10 p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
            {chapter.title}
          </h2>
          <p className="text-white/80">
            Altitude: {currentAltitude}m | {Math.round(progress)}% to Summit
          </p>
        </div>

        {/* Progress Stats */}
        <div className="flex justify-center gap-8 mb-8">
          <div className="bg-white/10 backdrop-blur-md rounded-xl px-4 py-2 flex items-center gap-2">
            <Tent className="w-5 h-5 text-white/80" />
            <span className="text-white font-medium">{completedLessons.length} Camps</span>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-xl px-4 py-2 flex items-center gap-2">
            <Flag className="w-5 h-5 text-white/80" />
            <span className="text-white font-medium">{lessons.length - completedLessons.length} To Go</span>
          </div>
        </div>

        {/* Mountain visualization */}
        <div className="relative h-[400px] mx-auto max-w-4xl">
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <defs>
              <linearGradient id="mountainGradient" x1="0%" y1="100%" x2="0%" y2="0%">
                <stop offset="0%" stopColor="#1e293b" />
                <stop offset="50%" stopColor="#475569" />
                <stop offset="100%" stopColor="#94a3b8" />
              </linearGradient>
            </defs>
            
            <polygon
              points="50,15 85,85 15,85"
              fill="url(#mountainGradient)"
              opacity="0.9"
            />
            
            {progress > 60 && (
              <polygon
                points="50,15 65,45 35,45"
                fill="white"
                opacity="0.8"
              />
            )}

            <polyline
              points={pathPoints.map(p => `${p.x},${p.y}`).join(' ')}
              fill="none"
              stroke="white"
              strokeWidth="0.5"
              strokeDasharray="2,2"
              opacity="0.5"
            />
          </svg>

          {/* Lesson Markers */}
          {pathPoints.map((point) => (
            <div
              key={point.lesson.id}
              className="absolute transform -translate-x-1/2 -translate-y-1/2"
              style={{ 
                left: `${point.x}%`, 
                top: `${point.y}%`,
                zIndex: pathPoints.length - point.index
              }}
            >
              <button
                onClick={() => !point.isLocked && onLessonSelect(point.lesson)}
                disabled={point.isLocked}
                className={`group relative ${point.isLocked ? 'cursor-not-allowed' : 'cursor-pointer'}`}
              >
                <div className={`
                  relative w-12 h-12 rounded-full flex items-center justify-center transition-all
                  ${point.isCompleted 
                    ? 'bg-green-500 scale-100' 
                    : point.isCurrent
                    ? 'bg-yellow-500 animate-pulse scale-110'
                    : point.isLocked
                    ? 'bg-gray-600 opacity-50 scale-90'
                    : 'bg-white/20 hover:bg-white/30 hover:scale-110'
                  }
                `}>
                  {point.isCompleted ? (
                    <CheckCircle className="w-6 h-6 text-white" />
                  ) : point.isCurrent ? (
                    <Footprints className="w-6 h-6 text-white" />
                  ) : point.isLocked ? (
                    <Lock className="w-5 h-5 text-gray-400" />
                  ) : point.index === 0 ? (
                    <Tent className="w-6 h-6 text-white" />
                  ) : point.index === pathPoints.length - 1 ? (
                    <Flag className="w-6 h-6 text-white" />
                  ) : (
                    <MapPin className="w-5 h-5 text-white" />
                  )}
                </div>

                {/* Tooltip */}
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-black/80 text-white text-xs rounded-lg px-3 py-2 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                  <div className="font-semibold">{point.lesson.title}</div>
                  <div className="text-gray-300 flex items-center gap-1 mt-1">
                    <Clock className="w-3 h-3" />
                    {point.lesson.duration} min
                  </div>
                </div>
              </button>
            </div>
          ))}

          {/* Trees at base */}
          <div className="absolute bottom-0 left-0 right-0 flex justify-around">
            <TreePine className="w-8 h-8 text-green-700 opacity-60" />
            <TreePine className="w-10 h-10 text-green-600 opacity-50" />
            <TreePine className="w-6 h-6 text-green-700 opacity-40" />
          </div>

          {/* Summit flag */}
          {progress === 100 && (
            <div className="absolute" style={{ left: '50%', top: '15%' }}>
              <Flag className="w-8 h-8 text-yellow-400 animate-pulse" />
            </div>
          )}
        </div>

        {/* Current Lesson Card */}
        {currentLessonId && (
          <div className="mt-8 max-w-2xl mx-auto">
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-yellow-500 rounded-xl">
                  <Footprints className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-white mb-2">
                    Current Camp: {lessons.find(l => l.id === currentLessonId)?.title}
                  </h3>
                  <p className="text-white/80 mb-4">
                    Continue your journey from where you left off
                  </p>
                  <button 
                    onClick={() => {
                      const lesson = lessons.find(l => l.id === currentLessonId)
                      if (lesson) onLessonSelect(lesson)
                    }}
                    className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg text-white font-medium transition-all inline-flex items-center gap-2"
                  >
                    <Play className="w-4 h-4" />
                    Continue Journey
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Achievement Preview */}
        {progress === 100 && (
          <div className="mt-8 text-center">
            <div className="inline-flex items-center gap-2 bg-yellow-500/20 px-6 py-3 rounded-full">
              <Award className="w-6 h-6 text-yellow-400" />
              <span className="text-yellow-400 font-semibold">Summit Reached!</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
