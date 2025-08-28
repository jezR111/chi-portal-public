'use client'

import { Award, Flame, TrendingUp } from 'lucide-react'

interface ProgressTrackerProps {
  overallProgress: number
  totalChapters: number
  completedChapters: number
  streak?: number
  showLabels?: boolean
}

export default function ProgressTracker({
  overallProgress,
  totalChapters,
  completedChapters,
  streak = 0,
  showLabels = true
}: ProgressTrackerProps) {
  // Determine level based on progress
  const getLevel = () => {
    if (overallProgress < 20) return { level: 1, title: 'Seeker' }
    if (overallProgress < 40) return { level: 2, title: 'Explorer' }
    if (overallProgress < 60) return { level: 3, title: 'Wanderer' }
    if (overallProgress < 80) return { level: 4, title: 'Pathfinder' }
    if (overallProgress < 100) return { level: 5, title: 'Wayfarer' }
    return { level: 6, title: 'Master' }
  }

  const userLevel = getLevel()

  return (
    <div className="flex items-center gap-4">
      {/* Overall Progress Circle */}
      <div className="relative">
        <svg className="w-16 h-16 transform -rotate-90">
          <circle
            cx="32"
            cy="32"
            r="28"
            stroke="currentColor"
            strokeWidth="4"
            fill="none"
            className="text-white/20"
          />
          <circle
            cx="32"
            cy="32"
            r="28"
            stroke="currentColor"
            strokeWidth="4"
            fill="none"
            strokeDasharray={`${2 * Math.PI * 28}`}
            strokeDashoffset={`${2 * Math.PI * 28 * (1 - overallProgress / 100)}`}
            className="text-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-500"
            style={{
              stroke: 'url(#progress-gradient)',
            }}
          />
          <defs>
            <linearGradient id="progress-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#6366f1" />
              <stop offset="100%" stopColor="#a855f7" />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-white font-bold text-sm">{Math.round(overallProgress)}%</span>
        </div>
      </div>

      {/* Stats */}
      <div className="flex flex-col gap-2">
        {/* Level Badge */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-purple-500/20 px-2 py-1 rounded-lg">
            <Award className="w-4 h-4 text-purple-400" />
            {showLabels && (
              <span className="text-xs text-purple-300 font-medium">
                Level {userLevel.level}: {userLevel.title}
              </span>
            )}
            {!showLabels && (
              <span className="text-xs text-purple-300 font-bold">
                Lvl {userLevel.level}
              </span>
            )}
          </div>
        </div>

        {/* Progress Stats */}
        <div className="flex items-center gap-3">
          {/* Chapters */}
          <div className="flex items-center gap-1">
            <TrendingUp className="w-3 h-3 text-green-400" />
            <span className="text-xs text-gray-400">
              {completedChapters}/{totalChapters} {showLabels && 'Chapters'}
            </span>
          </div>

          {/* Streak */}
          {streak > 0 && (
            <div className="flex items-center gap-1">
              <Flame className="w-3 h-3 text-orange-400" />
              <span className="text-xs text-gray-400">
                {streak} {showLabels && 'day streak'}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
