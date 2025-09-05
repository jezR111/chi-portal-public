'use client'

import {
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Clock,
  Headphones,
  Pause,
  Play,
  RotateCcw,
  Settings,
  SkipForward,
  Video,
  Volume2,
  VolumeX
} from 'lucide-react'
import { useState } from 'react'
import { LearningMode, YinLesson } from '../types/yin.types'

interface LessonViewerProps {
  lesson: YinLesson
  learningMode: LearningMode
  onModeChange: (mode: LearningMode) => void
  onComplete: () => void
  onBack: () => void
}

const LEARNING_MODES = {
  [LearningMode.READ]: { icon: BookOpen, label: 'Read', color: 'blue' },
  [LearningMode.LISTEN]: { icon: Headphones, label: 'Listen', color: 'purple' },
  [LearningMode.WATCH]: { icon: Video, label: 'Watch', color: 'pink' }
}

export default function LessonViewer({
  lesson,
  learningMode,
  onModeChange,
  onComplete,
  onBack
}: LessonViewerProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [volume, setVolume] = useState(0.8)
  const [playbackSpeed, setPlaybackSpeed] = useState(1)
  const [showSettings, setShowSettings] = useState(false)
  const [progress, setProgress] = useState(0)
  const [fontSize, setFontSize] = useState<'small' | 'medium' | 'large'>('medium')

  // Parse MDX content (simplified for now)
  const renderContent = () => {
    // In production, use MDX processor
    const paragraphs = lesson.content.split('\n\n')
    return paragraphs.map((p, i) => {
      if (p.startsWith('#')) {
        const level = p.match(/^#+/)?.[0].length || 1
        const text = p.replace(/^#+\s*/, '')
        
        // Create heading based on level
        const headingClass = `
          ${level === 1 ? 'text-3xl' : level === 2 ? 'text-2xl' : 'text-xl'}
          font-bold text-white mb-4
        `
        
        if (level === 1) {
          return <h1 key={i} className={headingClass}>{text}</h1>
        } else if (level === 2) {
          return <h2 key={i} className={headingClass}>{text}</h2>
        } else if (level === 3) {
          return <h3 key={i} className={headingClass}>{text}</h3>
        } else {
          return <h4 key={i} className={headingClass}>{text}</h4>
        }
      }
      return (
        <p key={i} className={`
          text-gray-200 leading-relaxed mb-4
          ${fontSize === 'small' ? 'text-sm' : fontSize === 'large' ? 'text-lg' : 'text-base'}
        `}>
          {p}
        </p>
      )
    })
  }

  const handleComplete = () => {
    setProgress(100)
    onComplete()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-900">
      {/* Header */}
      <div className="bg-black/20 backdrop-blur-xl border-b border-white/10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-white hover:text-gray-300 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
              Back to Mountain
            </button>

            <div className="flex items-center gap-4">
              <span className="text-gray-400 text-sm flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {lesson.duration} min
              </span>
              
              {/* Settings */}
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <Settings className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Lesson Title & Objectives */}
        <div className="max-w-4xl mx-auto mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">{lesson.title}</h1>
          
          {lesson.objectives.length > 0 && (
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
              <h3 className="text-lg font-semibold text-white mb-3">Learning Objectives</h3>
              <ul className="space-y-2">
                {lesson.objectives.map((objective, i) => (
                  <li key={i} className="flex items-start gap-2 text-gray-300">
                    <span className="text-purple-400 mt-1">•</span>
                    <span>{objective}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Mode Selector */}
        <div className="flex justify-center gap-2 mb-8">
          {Object.entries(LEARNING_MODES).map(([mode, config]) => {
            const Icon = config.icon
            const isAvailable = 
              mode === LearningMode.READ || 
              (mode === LearningMode.LISTEN && lesson.audioUrl) ||
              (mode === LearningMode.WATCH && lesson.videoUrl)
            
            return (
              <button
                key={mode}
                onClick={() => isAvailable && onModeChange(mode as LearningMode)}
                disabled={!isAvailable}
                className={`
                  flex items-center gap-2 px-4 py-2 rounded-xl transition-all
                  ${learningMode === mode
                    ? `bg-${config.color}-500 text-white shadow-lg shadow-${config.color}-500/25`
                    : isAvailable
                    ? 'bg-white/10 text-gray-400 hover:bg-white/20'
                    : 'bg-white/5 text-gray-600 cursor-not-allowed opacity-50'
                  }
                `}
              >
                <Icon className="w-4 h-4" />
                <span className="font-medium">{config.label}</span>
              </button>
            )
          })}
        </div>

        {/* Content Area */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 p-8">
            {/* Read Mode */}
            {learningMode === LearningMode.READ && (
              <div className="prose prose-invert max-w-none">
                {renderContent()}
              </div>
            )}

            {/* Listen Mode */}
            {learningMode === LearningMode.LISTEN && (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="relative mb-8">
                  <div className="w-32 h-32 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                    <Headphones className="w-16 h-16 text-white" />
                  </div>
                  {isPlaying && (
                    <div className="absolute inset-0 rounded-full border-4 border-purple-400 animate-ping" />
                  )}
                </div>
                
                <div className="flex items-center gap-4 mb-4">
                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
                  >
                    {isPlaying ? <Pause className="w-6 h-6 text-white" /> : <Play className="w-6 h-6 text-white" />}
                  </button>
                  
                  <button className="p-2 hover:bg-white/10 rounded-full transition-colors">
                    <RotateCcw className="w-5 h-5 text-gray-400" />
                  </button>
                  
                  <button className="p-2 hover:bg-white/10 rounded-full transition-colors">
                    <SkipForward className="w-5 h-5 text-gray-400" />
                  </button>
                  
                  <button
                    onClick={() => setVolume(volume > 0 ? 0 : 0.8)}
                    className="p-2 hover:bg-white/10 rounded-full transition-colors"
                  >
                    {volume > 0 ? <Volume2 className="w-5 h-5 text-gray-400" /> : <VolumeX className="w-5 h-5 text-gray-400" />}
                  </button>
                </div>
                
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <span>Speed:</span>
                  {[0.75, 1, 1.25, 1.5, 2].map(speed => (
                    <button
                      key={speed}
                      onClick={() => setPlaybackSpeed(speed)}
                      className={`px-2 py-1 rounded ${
                        playbackSpeed === speed ? 'bg-purple-500 text-white' : 'hover:bg-white/10'
                      }`}
                    >
                      {speed}x
                    </button>
                  ))}
                </div>

                {/* Transcript */}
                <div className="w-full mt-8 p-4 bg-black/20 rounded-xl max-h-64 overflow-y-auto">
                  <p className="text-gray-300 text-sm leading-relaxed">
                    {lesson.content}
                  </p>
                </div>
              </div>
            )}

            {/* Watch Mode */}
            {learningMode === LearningMode.WATCH && (
              <div className="relative aspect-video bg-black rounded-xl overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <Video className="w-16 h-16 text-gray-600" />
                  <p className="absolute bottom-4 text-gray-400 text-sm">
                    Video player would go here
                  </p>
                </div>
              </div>
            )}

            {/* Progress Bar */}
            <div className="mt-8">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-400">Lesson Progress</span>
                <span className="text-white font-medium">{progress}%</span>
              </div>
              <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-between items-center mt-8">
              <button
                onClick={() => setProgress(Math.max(0, progress - 10))}
                className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
                Previous Section
              </button>

              {progress < 100 ? (
                <button
                  onClick={() => setProgress(Math.min(100, progress + 20))}
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl text-white font-semibold hover:shadow-lg hover:shadow-purple-500/25 transition-all"
                >
                  Continue
                  <ChevronRight className="w-5 h-5" />
                </button>
              ) : (
                <button
                  onClick={handleComplete}
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl text-white font-semibold hover:shadow-lg hover:shadow-green-500/25 transition-all"
                >
                  Complete Lesson
                  <ChevronRight className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Settings Panel */}
        {showSettings && (
          <div className="fixed top-20 right-4 bg-black/80 backdrop-blur-xl rounded-2xl p-6 border border-white/20 z-50">
            <h3 className="text-white font-semibold mb-4">Reading Settings</h3>
            
            <div className="space-y-4">
              <div>
                <label className="text-gray-400 text-sm">Font Size</label>
                <div className="flex gap-2 mt-2">
                  {(['small', 'medium', 'large'] as const).map(size => (
                    <button
                      key={size}
                      onClick={() => setFontSize(size)}
                      className={`px-3 py-1 rounded ${
                        fontSize === size ? 'bg-purple-500 text-white' : 'bg-white/10 text-gray-400'
                      }`}
                    >
                      {size.charAt(0).toUpperCase() + size.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
