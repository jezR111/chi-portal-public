// src/app/(portal)/yin/page.tsx
'use client'

import { cn } from '@/lib/utils/cn'
import {
  BarChart3,
  Bell,
  BookOpen,
  Brain,
  Calendar,
  Check,
  Clock,
  Flame,
  Heart,
  Moon,
  Search,
  Shield,
  Sparkles,
  Target,
  TrendingUp,
  Users
} from 'lucide-react'
import { useState } from 'react'

// Import your sidebar
import YinSidebar from '@/components/layout/YinSidebar'

// Import your existing components
import { ChapterSystem } from '@/features/yin/learning/ChapterSystem'
import { MountainClimb } from '@/features/yin/learning/MountainClimb'
import { ProgressTracker } from '@/features/yin/progress/ProgressTracker'

// Import the feature components you provided
//import GrowthGarden from '@/components/way-of-the-self/GrowthGarden'
//import BujoHabitTracker from '@/components/way-of-the-self/HabitTracker'
//import HermitAIGuide from '@/components/way-of-the-self/HermitGuide'

export default function YinRealmPage() {
  const [currentView, setCurrentView] = useState('dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [showHermitModal, setShowHermitModal] = useState(false)
  const [isHermitMinimized, setIsHermitMinimized] = useState(false)
  const [notifications] = useState(3)
  const [userStreak] = useState(7)

  // User data - replace with actual data from your backend
  const userData = {
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
    streakDays: userStreak,
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
    ]
  }

  // Sample data for components
  const mountainLessons = [
    { id: '1', title: 'Introduction to Shadow Work', duration: 10, type: 'video', completed: true },
    { id: '2', title: 'Meeting Your Shadow', duration: 15, type: 'interactive', completed: true },
    { id: '3', title: 'Shadow Integration', duration: 20, type: 'reading', completed: false },
    { id: '4', title: 'Shadow Dialogue', duration: 25, type: 'video', completed: false },
    { id: '5', title: 'Living with Your Shadow', duration: 30, type: 'interactive', completed: false }
  ]

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

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900 relative">
      {/* Sidebar */}
      <YinSidebar
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
        currentView={currentView}
        onViewChange={setCurrentView}
        userData={userData}
      />

      {/* Main Content */}
      <div className={cn(
        "flex-1 flex flex-col overflow-hidden transition-all duration-300",
        sidebarOpen ? "lg:ml-0" : "lg:ml-0"
      )}>
        {/* Header */}
        <header className="bg-black/20 backdrop-blur-xl border-b border-white/10">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-4">
              {/* Mobile Menu Button */}
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              
              {/* Search Bar */}
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
                <span className="text-orange-400 font-bold text-sm">{userStreak}</span>
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

              {/* Theme Toggle */}
              <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                <Moon className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto">
          {/* Dashboard View */}
          {currentView === 'dashboard' && (
            <DashboardView userData={userData} dailyProgress={dailyProgress} />
          )}

          {/* Chapters View */}
          {currentView === 'chapters' && (
            <div className="p-8">
              <ChapterSystem />
            </div>
          )}

          {/* Mountain Climb View */}
          {currentView === 'mountain' && (
            <div className="p-8">
              <MountainClimb 
                chapter={{ 
                  id: userData.currentChapter,
                  title: 'Shadow Work',
                  description: 'Embrace and integrate your shadow self'
                }}
                lessons={mountainLessons}
                currentLessonId="3"
                progress={40}
              />
            </div>
          )}

          {/* Growth Garden View */}
          {currentView === 'garden' && (
            <div className="p-8">
              <GrowthGarden 
                userData={userData}
                onPlantClick={(plant) => console.log('Plant clicked:', plant)}
              />
            </div>
          )}

          {/* Habit Tracker View */}
          {currentView === 'habits' && (
            <div className="p-8">
              <BujoHabitTracker 
                onDataUpdate={(data) => console.log('Habit data updated:', data)}
                initialData={null}
              />
            </div>
          )}

          {/* Hermit Guide View */}
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
                      onClick={() => setShowHermitModal(true)}
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

          {/* Analytics View */}
          {currentView === 'analytics' && (
            <AnalyticsView userData={userData} />
          )}

          {/* Community View */}
          {currentView === 'community' && (
            <CommunityView userData={userData} />
          )}

          {/* Library View */}
          {currentView === 'library' && (
            <LibraryView />
          )}
        </main>
      </div>

      {/* Hermit AI Guide Modal - Floating */}
      {showHermitModal && (
        <div className="fixed bottom-0 right-0 z-50">
          <HermitAIGuide 
            userData={userData}
            currentChapter={userData.currentChapter}
            isMinimized={isHermitMinimized}
            onToggleMinimize={setIsHermitMinimized}
          />
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
        <h1 className="text-4xl font-bold text-white mb-2">
          Welcome back, {userData.name} ✨
        </h1>
        <p className="text-gray-400 text-lg">
          You're on day {userData.streakDays} of your inner journey. Keep exploring!
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
                    "font-medium",
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

        {/* Side Panel */}
        <div className="space-y-6">
          {/* Current Focus */}
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <Target className="w-5 h-5" />
              Current Focus
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

          {/* Recent Activity */}
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Recent Activity
            </h3>
            
            <div className="space-y-3">
              {userData.recentActivity.map((activity: any, index: number) => (
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

// Analytics View
function AnalyticsView({ userData }: any) {
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
          <h3 className="text-xl font-semibold text-white mb-4">Consistency Metrics</h3>
          <ProgressTracker 
            totalChapters={5}
            completedChapters={2}
            currentLevel="Explorer"
            totalXP={userData.xp}
            levelProgress={45}
          />
        </div>
      </div>
    </div>
  )
}

// Community View
function CommunityView({ userData }: any) {
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
                <div className={cn(
                  "w-2 h-2 rounded-full",
                  room.active ? "bg-green-400" : "bg-gray-500"
                )} />
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