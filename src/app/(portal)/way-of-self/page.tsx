// src/app/(portal)/way-of-self/page.tsx
'use client'

import { cn } from '@/lib/utils/cn'
import {
  BarChart3,
  Bell,
  BookOpen,
  Brain,
  Calendar,
  Check,
  Flower2,
  Home,
  Menu,
  MessageCircle,
  Moon,
  Mountain,
  Search,
  Sparkles,
  Target,
  TrendingUp,
  Users
} from 'lucide-react'
import { useTheme } from 'next-themes'
import { useState } from 'react'

// Import the existing components you've built
import { ChapterSystem } from '@/features/yin/learning/ChapterSystem'
import { MountainClimb } from '@/features/yin/learning/MountainClimb'
import { ProgressTracker } from '@/features/yin/progress/ProgressTracker'

// Navigation items
const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: Home },
  { id: 'chapters', label: 'Chapters', icon: BookOpen },
  { id: 'mountain', label: 'Mountain Climb', icon: Mountain },
  { id: 'garden', label: 'Growth Garden', icon: Flower2 },
  { id: 'habits', label: 'Habit Tracker', icon: Target },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  { id: 'community', label: 'Community', icon: Users }
]

// Sample user data
const SAMPLE_USER_DATA = {
  name: 'Seeker',
  level: 3,
  xp: 2450,
  completedChapters: ['the-self', 'energy-bodies'],
  focusAreas: ['self-worth', 'boundaries', 'shadow-work'],
  currentChapter: 'inward-journey',
  overallProgress: 35,
  streak: 7,
  totalMeditations: 23,
  journalEntries: 45,
  communityKarma: 128
}

export default function WayOfSelfPage() {
  const [currentView, setCurrentView] = useState('dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [userData] = useState(SAMPLE_USER_DATA)
  const [notifications] = useState(3)
  const [showHermit, setShowHermit] = useState(false)
  const { theme, setTheme } = useTheme()
  
  // Calculate daily progress
  const getDailyProgress = () => {
    const tasks = [
      { name: 'Morning Meditation', completed: true },
      { name: 'Read Chapter', completed: true },
      { name: 'Journal Entry', completed: false },
      { name: 'Evening Reflection', completed: false }
    ]
    const completed = tasks.filter(t => t.completed).length
    return { tasks, percentage: (completed / tasks.length) * 100 }
  }

  const dailyProgress = getDailyProgress()

  return (
    <div className="flex h-[calc(100vh-4rem)] relative">
      {/* Sidebar */}
      <div className={cn(
        "transition-all duration-300 bg-black/30 backdrop-blur-xl border-r border-white/10",
        sidebarOpen ? "w-64" : "w-20"
      )}>
        {/* Logo */}
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-primary-500 to-purple-600 rounded-xl">
              <Moon className="w-6 h-6 text-white" />
            </div>
            {sidebarOpen && (
              <div>
                <h1 className="text-lg font-bold text-white">Way of the Self</h1>
                <p className="text-xs text-gray-400">Transform Within</p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2">
          {NAV_ITEMS.map(item => {
            const Icon = item.icon
            return (
              <button
                key={item.id}
                onClick={() => setCurrentView(item.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2 rounded-xl transition-all",
                  currentView === item.id
                    ? "bg-gradient-to-r from-primary-500/20 to-purple-500/20 text-white"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                )}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                {sidebarOpen && <span className="font-medium">{item.label}</span>}
              </button>
            )
          })}
        </nav>

        {/* User Section */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-purple-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold">S</span>
            </div>
            {sidebarOpen && (
              <div className="flex-1">
                <p className="text-sm font-medium text-white">{userData.name}</p>
                <p className="text-xs text-gray-400">Level {userData.level} • {userData.xp} XP</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-black/20 backdrop-blur-xl border-b border-white/10">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <Menu className="w-5 h-5 text-white" />
              </button>
              
              <div className="relative hidden md:block">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search chapters, lessons, or community..."
                  className="pl-10 pr-4 py-2 bg-white/5 rounded-xl text-white placeholder-gray-500 outline-none focus:bg-white/10 transition-colors w-96"
                />
              </div>
            </div>

            <div className="flex items-center gap-4">
              {/* Streak Counter */}
              <div className="flex items-center gap-2 bg-orange-500/20 px-3 py-1.5 rounded-full">
                <span className="text-orange-400 font-bold text-sm">{userData.streak}</span>
                <span className="text-2xl">🔥</span>
              </div>

              {/* Notifications */}
              <button className="relative p-2 hover:bg-white/10 rounded-lg transition-colors">
                <Bell className="w-5 h-5 text-white" />
                {notifications > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-pink-500 rounded-full text-xs text-white flex items-center justify-center">
                    {notifications}
                  </span>
                )}
              </button>

              {/* AI Guide */}
              <button
                onClick={() => setShowHermit(!showHermit)}
                className="flex items-center gap-2 bg-gradient-to-r from-primary-500 to-purple-600 px-4 py-2 rounded-full hover:shadow-lg hover:shadow-purple-500/25 transition-all"
              >
                <Sparkles className="w-4 w-4" />
                <span className="text-white font-medium">Hermit</span>
              </button>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900">
          {currentView === 'dashboard' && (
            <DashboardView userData={userData} dailyProgress={dailyProgress} />
          )}
          {currentView === 'chapters' && (
            <div className="p-8">
              <ChapterSystem />
            </div>
          )}
          {currentView === 'mountain' && (
            <div className="p-8">
              <MountainClimb 
                chapter={{ 
                  id: 'inward-journey',
                  title: 'The Inward Journey',
                  description: 'Explore the depths of your consciousness'
                }}
                lessons={[
                  { id: '1', title: 'Introduction to Inner Work', duration: 10, type: 'video', completed: true },
                  { id: '2', title: 'Meditation Basics', duration: 15, type: 'interactive', completed: true },
                  { id: '3', title: 'Shadow Work Fundamentals', duration: 20, type: 'reading', completed: false },
                  { id: '4', title: 'Dream Analysis', duration: 25, type: 'video', completed: false },
                  { id: '5', title: 'Integration Practices', duration: 30, type: 'interactive', completed: false }
                ]}
                currentLessonId="3"
                progress={40}
              />
            </div>
          )}
          {currentView === 'garden' && (
            <GrowthGardenView userData={userData} />
          )}
          {currentView === 'habits' && (
            <HabitTrackerView userData={userData} />
          )}
          {currentView === 'analytics' && (
            <AnalyticsView userData={userData} />
          )}
          {currentView === 'community' && (
            <CommunityView userData={userData} />
          )}
        </main>
      </div>

      {/* Hermit AI Guide Modal */}
      {showHermit && (
        <div className="absolute right-4 top-20 w-96 bg-black/80 backdrop-blur-xl rounded-2xl border border-white/10 p-6 z-50">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Hermit Guide</h3>
            <button 
              onClick={() => setShowHermit(false)}
              className="text-gray-400 hover:text-white"
            >
              ✕
            </button>
          </div>
          <div className="space-y-4">
            <p className="text-gray-300 text-sm">
              Welcome, seeker. I am here to guide you through your inner journey. What wisdom do you seek today?
            </p>
            <div className="p-3 bg-white/5 rounded-lg">
              <p className="text-purple-300 text-sm">
                💡 Today's insight: "The shadow you fear holds the light you seek."
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// Dashboard View Component
function DashboardView({ userData, dailyProgress }: any) {
  return (
    <div className="p-8">
      {/* Welcome Section */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">
          Welcome back, {userData.name} ✨
        </h2>
        <p className="text-gray-400">
          You're on day {userData.streak} of your journey. Keep climbing!
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          icon={TrendingUp}
          label="Overall Progress"
          value={`${userData.overallProgress}%`}
          color="purple"
          trend="+5% this week"
        />
        <StatCard
          icon={Brain}
          label="Meditations"
          value={userData.totalMeditations}
          color="blue"
          trend="3 this week"
        />
        <StatCard
          icon={BookOpen}
          label="Journal Entries"
          value={userData.journalEntries}
          color="green"
          trend="12 this month"
        />
        <StatCard
          icon={Users}
          label="Community Karma"
          value={userData.communityKarma}
          color="pink"
          trend="+15 points"
        />
      </div>

      {/* Daily Progress & Focus Areas */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Journey */}
        <div className="lg:col-span-2 bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Today's Journey
          </h3>
          
          <div className="space-y-4">
            {dailyProgress.tasks.map((task: any, index: number) => (
              <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                <div className="flex items-center gap-3">
                  {task.completed ? (
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                  ) : (
                    <div className="w-6 h-6 border-2 border-gray-500 rounded-full" />
                  )}
                  <span className={cn(
                    task.completed ? "text-gray-400 line-through" : "text-white"
                  )}>
                    {task.name}
                  </span>
                </div>
                {!task.completed && (
                  <button className="text-purple-400 hover:text-purple-300 text-sm font-medium">
                    Start →
                  </button>
                )}
              </div>
            ))}
          </div>
          
          <div className="mt-6">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-400">Daily Completion</span>
              <span className="text-white font-medium">{Math.round(dailyProgress.percentage)}%</span>
            </div>
            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all"
                style={{ width: `${dailyProgress.percentage}%` }}
              />
            </div>
          </div>
        </div>

        {/* Focus Areas */}
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <Target className="w-5 h-5" />
            Your Focus Areas
          </h3>
          
          <div className="space-y-3">
            {userData.focusAreas.map((area: string, index: number) => (
              <div key={area} className="flex items-center gap-3">
                <div className={cn(
                  "w-2 h-2 rounded-full",
                  index === 0 ? "bg-purple-400" : index === 1 ? "bg-blue-400" : "bg-green-400"
                )} />
                <span className="text-gray-300 capitalize">{area.replace('-', ' ')}</span>
              </div>
            ))}
          </div>
          
          <button className="w-full mt-4 py-2 bg-purple-500/20 hover:bg-purple-500/30 rounded-xl text-purple-400 font-medium transition-colors">
            Continue Journey →
          </button>
        </div>
      </div>
    </div>
  )
}

// Stat Card Component
function StatCard({ icon: Icon, label, value, color, trend }: any) {
  const colorClasses: any = {
    purple: 'from-purple-500 to-pink-500',
    blue: 'from-blue-500 to-cyan-500',
    green: 'from-green-500 to-emerald-500',
    pink: 'from-pink-500 to-rose-500'
  }

  return (
    <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
      <div className="flex items-start justify-between mb-4">
        <div className={cn("p-3 bg-gradient-to-br rounded-xl", colorClasses[color])}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        <span className="text-xs text-gray-400">{trend}</span>
      </div>
      <p className="text-2xl font-bold text-white mb-1">{value}</p>
      <p className="text-sm text-gray-400">{label}</p>
    </div>
  )
}

// Placeholder views for features not yet implemented
function GrowthGardenView({ userData }: any) {
  return (
    <div className="p-8">
      <h2 className="text-3xl font-bold text-white mb-8">Growth Garden</h2>
      <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-12 border border-white/10 text-center">
        <Flower2 className="w-16 h-16 text-purple-400 mx-auto mb-4" />
        <p className="text-gray-400">Your growth garden will bloom here soon...</p>
      </div>
    </div>
  )
}

function HabitTrackerView({ userData }: any) {
  return (
    <div className="p-8">
      <h2 className="text-3xl font-bold text-white mb-8">Habit Tracker</h2>
      <ProgressTracker 
        totalChapters={5}
        completedChapters={2}
        currentLevel="Explorer"
        totalXP={2450}
        levelProgress={45}
      />
    </div>
  )
}

function AnalyticsView({ userData }: any) {
  return (
    <div className="p-8">
      <h2 className="text-3xl font-bold text-white mb-8">Your Growth Analytics</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
          <h3 className="text-xl font-semibold text-white mb-4">Growth Over Time</h3>
          <div className="h-64 flex items-center justify-center">
            <BarChart3 className="w-16 h-16 text-gray-600" />
            <p className="text-gray-400 ml-4">Chart visualization coming soon</p>
          </div>
        </div>
        
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
          <h3 className="text-xl font-semibold text-white mb-4">Habit Consistency</h3>
          <div className="space-y-4">
            {['Meditation', 'Journaling', 'Reading', 'Exercise'].map((habit) => (
              <div key={habit}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-400">{habit}</span>
                  <span className="text-white">{Math.floor(Math.random() * 30 + 70)}%</span>
                </div>
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-green-500 to-emerald-500"
                    style={{ width: `${Math.floor(Math.random() * 30 + 70)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function CommunityView({ userData }: any) {
  return (
    <div className="p-8">
      <h2 className="text-3xl font-bold text-white mb-8">Community Echoing Cavern</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          {['Shadow Work Circle', 'Morning Meditation Group', 'Journal Sharing'].map((room) => (
            <div key={room} className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 hover:bg-white/10 cursor-pointer transition-all">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">{room}</h3>
                  <p className="text-gray-400 text-sm">
                    {Math.floor(Math.random() * 50 + 10)} members online
                  </p>
                </div>
                <MessageCircle className="w-5 h-5 text-purple-400" />
              </div>
            </div>
          ))}
        </div>
        
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
          <h3 className="text-xl font-semibold text-white mb-4">Insight Wall</h3>
          <div className="space-y-3">
            <blockquote className="text-sm text-gray-300 italic border-l-2 border-purple-400 pl-3">
              "The shadow work lesson completely shifted my perspective..."
            </blockquote>
            <blockquote className="text-sm text-gray-300 italic border-l-2 border-blue-400 pl-3">
              "Day 30 of meditation - I finally understand stillness..."
            </blockquote>
          </div>
        </div>
      </div>
    </div>
  )
}