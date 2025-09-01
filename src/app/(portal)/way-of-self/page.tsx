// app/way-of-the-self/page.tsx
'use client'

import {
  BarChart3,
  Bell,
  BookOpen,
  Brain,
  Calendar,
  Check,
  CheckCircle,
  ChevronRight,
  Clock,
  Flame,
  Flower2,
  Heart,
  Home,
  Library,
  Lock,
  Menu,
  Moon,
  Mountain,
  PlayCircle,
  Search,
  Shield,
  Sparkles,
  Star,
  Sun,
  Target,
  TrendingUp,
  Users
} from 'lucide-react'
import { useState } from 'react'

// Import existing components
import HabitTracker from "@/components/way-of-the-self/HabitTracker"
import HermitGuide from "@/components/way-of-the-self/HermitGuide"
import InnerCompass from "@/components/way-of-the-self/InnerCompass"


// Navigation items
const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: Home },
  { id: 'chapters', label: 'Chapters', icon: BookOpen },
  { id: 'mountain', label: 'Mountain Climb', icon: Mountain },
  { id: 'garden', label: 'Growth Garden', icon: Flower2 },
  { id: 'habits', label: 'Habit Tracker', icon: Target },
  { id: 'hermit', label: 'Hermit Guide', icon: Brain },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  { id: 'community', label: 'Community', icon: Users },
  { id: 'library', label: 'Resource Library', icon: Library }
]

// Chapter data structure
const CHAPTERS = [
  { 
    id: 'the-self', 
    title: 'The Self', 
    description: 'Discover your authentic nature and build unshakeable self-worth',
    totalLessons: 8,
    estimatedHours: 4,
    prerequisiteChapters: [],
    isPremium: false
  },
  { 
    id: 'energy-bodies', 
    title: 'Energy Bodies', 
    description: 'Understand and harmonize your physical, emotional, and spiritual energies',
    totalLessons: 10,
    estimatedHours: 5,
    prerequisiteChapters: ['the-self'],
    isPremium: false
  },
  { 
    id: 'shadow-work', 
    title: 'Shadow Work', 
    description: 'Embrace and integrate the hidden aspects of your psyche',
    totalLessons: 12,
    estimatedHours: 6,
    prerequisiteChapters: ['energy-bodies'],
    isPremium: false
  },
  { 
    id: 'inward-journey', 
    title: 'The Inward Journey', 
    description: 'Navigate the depths of consciousness and inner wisdom',
    totalLessons: 10,
    estimatedHours: 5,
    prerequisiteChapters: ['shadow-work'],
    isPremium: true
  },
  { 
    id: 'relating', 
    title: 'Relating to Others', 
    description: 'Transform your relationships through conscious connection',
    totalLessons: 8,
    estimatedHours: 4,
    prerequisiteChapters: ['inward-journey'],
    isPremium: true
  }
]

// Sample user data - replace with actual data from your backend
const SAMPLE_USER_DATA = {
  name: 'Seeker',
  level: 3,
  xp: 2450,
  experience: 2850,
  nextLevel: 5000,
  completedLessons: 12,
  totalLessons: 48,
  completedChapters: ['the-self', 'energy-bodies'],
  focusAreas: ['self-worth', 'boundaries', 'shadow-work'],
  currentChapter: 'shadow-work',
  overallProgress: 35,
  streak: 7,
  totalMeditations: 23,
  meditationMinutes: 156,
  journalEntries: 45,
  habitStreak: 7,
  communityKarma: 128,
  dailyActivities: {
    meditation: true,
    journaling: true,
    reading: false,
    exercise: false
  },
  badges: ['early-bird', 'consistent-learner', 'shadow-worker'],
  recentActivity: [
    { type: 'lesson', title: 'Understanding Your Shadow', time: '2 hours ago' },
    { type: 'meditation', title: 'Morning Mindfulness', time: '5 hours ago' },
    { type: 'journal', title: 'Daily Reflection', time: 'Yesterday' }
  ],
  chapterProgress: [
    { chapterId: 'the-self', progressPercent: 100, completedLessons: ['1-1', '1-2', '1-3', '1-4', '1-5', '1-6', '1-7', '1-8'] },
    { chapterId: 'energy-bodies', progressPercent: 100, completedLessons: ['2-1', '2-2', '2-3', '2-4', '2-5', '2-6', '2-7', '2-8', '2-9', '2-10'] },
    { chapterId: 'shadow-work', progressPercent: 42, completedLessons: ['3-1', '3-2', '3-3', '3-4', '3-5'] }
  ]
}

export default function WayOfSelfDashboard() {
  const [currentView, setCurrentView] = useState('dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [userData, setUserData] = useState(SAMPLE_USER_DATA)
  const [showOnboarding, setShowOnboarding] = useState(!userData.completedChapters.length)
  const [notifications, setNotifications] = useState(3)
  const [darkMode, setDarkMode] = useState(true)
  const [showHermit, setShowHermit] = useState(false)
  const [selectedChapter, setSelectedChapter] = useState(null)
  const [selectedLesson, setSelectedLesson] = useState(null)
  const [showInsightCapture, setShowInsightCapture] = useState(false);
  const [showMeditation, setShowMeditation] = useState(false);

  // Handle assessment completion
  const handleAssessmentComplete = (growthMap: any) => {
    setUserData(prev => ({
      ...prev,
      growthMap,
      focusAreas: growthMap.focusAreas
    }))
    setShowOnboarding(false)
  }

  // Calculate daily progress
  const getDailyProgress = () => {
    const tasks = [
      { name: 'Morning Meditation', completed: userData.dailyActivities.meditation },
      { name: 'Read Chapter', completed: userData.dailyActivities.reading },
      { name: 'Journal Entry', completed: userData.dailyActivities.journaling },
      { name: 'Physical Exercise', completed: userData.dailyActivities.exercise }
    ]
    const completed = tasks.filter(t => t.completed).length
    return { tasks, percentage: (completed / tasks.length) * 100 }
  }

  const dailyProgress = getDailyProgress()

  // Get chapter progress
  const getChapterProgress = (chapterId) => {
    const progress = userData.chapterProgress.find(p => p.chapterId === chapterId)
    return progress?.progressPercent || 0
  }

  // Check if chapter is unlocked
  const isChapterUnlocked = (chapter) => {
    if (!chapter.prerequisiteChapters || chapter.prerequisiteChapters.length === 0) {
      return true
    }
    return chapter.prerequisiteChapters.every(prereqId => {
      const progress = getChapterProgress(prereqId)
      return progress >= 100
    })
  }

  // Handle chapter selection
  const handleChapterSelect = (chapter) => {
    if (!isChapterUnlocked(chapter)) return
    setSelectedChapter(chapter)
    setCurrentView('mountain')
  }

  // Show onboarding if needed
  if (showOnboarding) {
    return <InnerCompass onComplete={handleAssessmentComplete} />
  }

  return (
    <div className={`min-h-screen ${darkMode ? 'dark' : ''}`}>
      <div className="flex h-screen bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900">
        {/* Sidebar */}
        <div className={`${sidebarOpen ? 'w-64' : 'w-20'} transition-all duration-300 bg-black/30 backdrop-blur-xl border-r border-white/10`}>
          {/* Logo */}
          <div className="p-6 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              {sidebarOpen && (
                <div>
                  <h1 className="text-lg font-bold text-white">The Way of the Self</h1>
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
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl transition-all ${
                    currentView === item.id
                      ? 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-white'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
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
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold">
                  {userData.name.charAt(0).toUpperCase()}
                </span>
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
                  <Flame className="w-4 h-4 text-orange-400" />
                  <span className="text-orange-400 font-bold text-sm">{userData.streak}</span>
                  <span className="text-xs text-orange-300">day streak</span>
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

                {/* Dark Mode Toggle */}
                <button
                  onClick={() => setDarkMode(!darkMode)}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  {darkMode ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5 text-white" />}
                </button>

                {/* AI Guide */}
                <button
                  onClick={() => setShowHermit(!showHermit)}
                  className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 px-4 py-2 rounded-full hover:shadow-lg hover:shadow-purple-500/25 transition-all"
                >
                  <span>🕯️</span>
                  <span className="text-white font-medium">Hermit</span>
                </button>
              </div>
            </div>
          </header>

          {/* Main Content Area */}
          <main className="flex-1 overflow-y-auto">
            {currentView === 'dashboard' && (
              <DashboardView userData={userData} dailyProgress={dailyProgress} />
            )}
            
            {currentView === 'chapters' && (
              <ChaptersView 
                chapters={CHAPTERS}
                userData={userData}
                getChapterProgress={getChapterProgress}
                isChapterUnlocked={isChapterUnlocked}
                onChapterSelect={handleChapterSelect}
              />
            )}
            
            {currentView === 'mountain' && (
              <div className="p-8">
                {/* MountainClimb component placeholder */}
                <div className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 p-8">
                  <h2 className="text-2xl font-bold text-white mb-4">Mountain Climb</h2>
                  <p className="text-gray-400 mb-6">
                    Track your progress through {selectedChapter?.title || 'the chapter'}
                  </p>
                  <button
                    onClick={() => setCurrentView('chapters')}
                    className="px-4 py-2 bg-purple-500/20 hover:bg-purple-500/30 rounded-xl text-purple-400 font-medium transition-colors"
                  >
                    ← Back to Chapters
                  </button>
                </div>
              </div>
            )}
            
            {currentView === 'garden' && (
              <div className="p-8">
                {/* GrowthGarden component placeholder */}
                <div className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 p-8">
                  <h2 className="text-2xl font-bold text-white mb-4">Growth Garden</h2>
                  <p className="text-gray-400">
                    Nurture your personal growth and watch your progress bloom.
                  </p>
                </div>
              </div>
            )}
            
            {currentView === 'habits' && (
              <div className="p-8">
                <HabitTracker onDataUpdate={(data: any) => console.log(data)} />
              </div>
            )}
            
            {currentView === 'hermit' && (
              <div className="p-8">
                <div className="max-w-6xl mx-auto">
                  <div className="mb-8">
                    <h2 className="text-3xl font-bold text-white mb-2">Hermit Guide</h2>
                    <p className="text-gray-400">Your AI wisdom companion for inner exploration</p>
                  </div>
                  
                  <div className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 p-8">
                    <div className="text-center py-12">
                      <span className="text-6xl mb-4 block">🕯️</span>
                      <h3 className="text-xl font-semibold text-white mb-2">The Hermit Awaits</h3>
                      <p className="text-gray-400 mb-6">
                        Click below to begin your conversation with the Hermit Guide
                      </p>
                      <button
                        onClick={() => setShowHermit(true)}
                        className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl text-white font-medium hover:shadow-lg hover:shadow-purple-500/25 transition-all"
                      >
                        <Sparkles className="inline-block w-4 h-4 mr-2" />
                        Start Conversation
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {currentView === 'analytics' && (
              <AnalyticsView userData={userData} />
            )}
            
            {currentView === 'community' && (
              <CommunityView userData={userData} />
            )}
            
            {currentView === 'library' && (
              <LibraryView />
            )}
          </main>
        </div>

        {/* Hermit AI Guide */}
        {showHermit && (
          <div className="fixed bottom-0 right-0 z-50">
            <HermitGuide 
              userData={userData}
              currentChapter={userData.currentChapter}
              isMinimized={false}
              onToggleMinimize={() => setShowHermit(false)}
            />
          </div>
        )}
      </div>
    </div>
  )
}

// Dashboard View Component
function DashboardView({ userData, dailyProgress }) {
  return (
    <div className="p-8">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">
          Welcome back, {userData.name} ✨
        </h1>
        <p className="text-gray-400 text-lg">
          You're on day {userData.streak} of your inner journey. Keep exploring!
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
          trend={`${userData.meditationMinutes} minutes`}
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

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Journey */}
        <div className="lg:col-span-2 bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Today's Journey
          </h3>
          
          <div className="space-y-4">
            {dailyProgress.tasks.map((task, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                <div className="flex items-center gap-3">
                  {task.completed ? (
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                  ) : (
                    <div className="w-6 h-6 border-2 border-gray-500 rounded-full" />
                  )}
                  <span className={`font-medium ${
                    task.completed ? 'text-gray-400 line-through' : 'text-white'
                  }`}>
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

        {/* Side Panel */}
        <div className="space-y-6">
          {/* Current Focus */}
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <Target className="w-5 h-5" />
              Current Focus
            </h3>
            
            <div className="space-y-3">
              {userData.focusAreas.map((area, index) => (
                <div key={area} className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${
                    index === 0 ? 'bg-purple-400' : index === 1 ? 'bg-blue-400' : 'bg-green-400'
                  }`} />
                  <span className="text-gray-300 capitalize">{area.replace('-', ' ')}</span>
                </div>
              ))}
            </div>
            
            <button className="w-full mt-4 py-2 bg-purple-500/20 hover:bg-purple-500/30 rounded-xl text-purple-400 font-medium transition-colors">
              Continue Journey →
            </button>
          </div>

          {/* Recent Activity */}
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Recent Activity
            </h3>
            
            <div className="space-y-3">
              {userData.recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 bg-purple-400 rounded-full mt-2" />
                  <div className="flex-1">
                    <p className="text-sm text-white">{activity.title}</p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Chapters View
function ChaptersView({ chapters, userData, getChapterProgress, isChapterUnlocked, onChapterSelect }) {
  return (
    <div className="p-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">Choose Your Path</h2>
        <p className="text-gray-400">Each chapter builds upon the last, creating a complete journey of self-discovery.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {chapters.map((chapter) => {
          const progress = getChapterProgress(chapter.id)
          const isUnlocked = isChapterUnlocked(chapter)
          const isCompleted = progress === 100

          return (
            <button
              key={chapter.id}
              onClick={() => onChapterSelect(chapter)}
              disabled={!isUnlocked}
              className={`relative group text-left bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 transition-all duration-300 ${
                isUnlocked
                  ? 'hover:bg-white/10 hover:scale-105 cursor-pointer'
                  : 'opacity-50 cursor-not-allowed'
              } ${isCompleted ? 'ring-2 ring-green-500/50' : ''}`}
            >
              {chapter.isPremium && (
                <div className="absolute top-4 right-4 bg-yellow-500/10 p-1 rounded-full">
                  <Star className="w-5 h-5 text-yellow-400" />
                </div>
              )}

              <div className={`w-16 h-16 rounded-xl mb-4 flex items-center justify-center ${
                isCompleted
                  ? 'bg-gradient-to-br from-green-500 to-emerald-500'
                  : 'bg-gradient-to-br from-indigo-500 to-purple-500'
              }`}>
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
                <span className="flex items-center gap-1">
                  <BookOpen className="w-3 h-3" />
                  {chapter.totalLessons} lessons
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {chapter.estimatedHours}h
                </span>
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
    </div>
  )
}

// Stat Card Component
function StatCard({ icon: Icon, label, value, color, trend }) {
  const colorClasses = {
    purple: 'from-purple-500 to-pink-500',
    blue: 'from-blue-500 to-cyan-500',
    green: 'from-green-500 to-emerald-500',
    pink: 'from-pink-500 to-rose-500'
  }

  return (
    <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 bg-gradient-to-br ${colorClasses[color]} rounded-xl`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        <span className="text-xs text-gray-400">{trend}</span>
      </div>
      <p className="text-2xl font-bold text-white mb-1">{value}</p>
      <p className="text-sm text-gray-400">{label}</p>
    </div>
  )
}

// Analytics View
function AnalyticsView({ userData }) {
  return (
    <div className="p-8">
      <h2 className="text-3xl font-bold text-white mb-8">Your Growth Analytics</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
          <h3 className="text-xl font-semibold text-white mb-4">Progress Over Time</h3>
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

// Community View
function CommunityView({ userData }) {
  const communityRooms = [
    { name: 'Shadow Work Circle', members: 42, active: true },
    { name: 'Morning Meditation Group', members: 128, active: true },
    { name: 'Journal Sharing', members: 67, active: false },
    { name: 'Dream Analysis', members: 31, active: true }
  ]

  return (
    <div className="p-8">
      <h2 className="text-3xl font-bold text-white mb-8">Community</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          {communityRooms.map((room) => (
            <div key={room.name} className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 hover:bg-white/10 cursor-pointer transition-all">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">{room.name}</h3>
                  <p className="text-gray-400 text-sm">
                    {room.members} members • {room.active ? 'Active now' : 'Last active 2h ago'}
                  </p>
                </div>
                <div className={`w-2 h-2 rounded-full ${
                  room.active ? 'bg-green-400' : 'bg-gray-500'
                }`} />
              </div>
            </div>
          ))}
        </div>
        
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
          <h3 className="text-xl font-semibold text-white mb-4">Community Insights</h3>
          <div className="space-y-3">
            <blockquote className="text-sm text-gray-300 italic border-l-2 border-purple-400 pl-3">
              "The shadow work lessons have completely transformed my perspective..."
            </blockquote>
            <blockquote className="text-sm text-gray-300 italic border-l-2 border-blue-400 pl-3">
              "Day 30 of meditation - I finally understand what stillness means..."
            </blockquote>
            <blockquote className="text-sm text-gray-300 italic border-l-2 border-green-400 pl-3">
              "The community support here is unlike anything I've experienced..."
            </blockquote>
          </div>
        </div>
      </div>
    </div>
  )
}

// Library View
function LibraryView() {
  const resources = [
    { type: 'Guide', title: 'Shadow Work Handbook', icon: BookOpen },
    { type: 'Meditation', title: 'Inner Child Healing', icon: Heart },
    { type: 'Exercise', title: 'Boundary Setting Workshop', icon: Shield },
    { type: 'Audio', title: 'Sleep Meditation Collection', icon: Moon }
  ]

  return (
    <div className="p-8">
      <h2 className="text-3xl font-bold text-white mb-8">Resource Library</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {resources.map((resource) => {
          const Icon = resource.icon
          return (
            <div key={resource.title} className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 hover:bg-white/10 cursor-pointer transition-all">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-purple-500/20 rounded-xl">
                  <Icon className="w-6 h-6 text-purple-400" />
                </div>
                <div>
                  <span className="text-xs text-gray-400">{resource.type}</span>
                  <h3 className="text-white font-semibold">{resource.title}</h3>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
