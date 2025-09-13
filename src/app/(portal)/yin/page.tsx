// src/app/(portal)/yin/page.tsx
'use client'

import { createClient } from '@/lib/db/supabase/client'
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
  LogOut,
  Moon,
  Search,
  Shield,
  Sparkles,
  Target,
  TrendingUp,
  Users
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

// Import your sidebar and components (keeping all your existing imports)
import YinSidebar from '@/components/layout/YinSidebar'
import GrowthGarden from '@/features/yin/components/apps/garden/GrowthGarden'
import BujoHabitTracker from '@/features/yin/components/apps/habits/HabitTracker'
import HermitAIGuide from '@/features/yin/components/apps/hermit/HermitGuide'
import MountainClimb from '@/features/yin/components/apps/MountainClimb'
import ChapterSystem from '@/features/yin/components/chapters/ChapterSystem'
import QuestButton from '@/features/yin/components/quests/QuestButton'
import QuestSidebar from '@/features/yin/components/quests/QuestSidebar'
import { useQuests } from '@/features/yin/hooks/useQuests'
import ProgressTracker from '@/features/yin/progress/ProgressTracker'

// Main Component
export default function YinRealmPage() {
  const [currentView, setCurrentView] = useState('dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [showHermitModal, setShowHermitModal] = useState(false)
  const [isHermitMinimized, setIsHermitMinimized] = useState(false)
  const [notifications] = useState(3)
  const [userStreak] = useState(7)
  
  // Authentication and user data states
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  // Check authentication and fetch user data
// src/app/(portal)/yin/page.tsx - Add detailed logging
useEffect(() => {
  let mounted = true;

  const checkUser = async () => {
    console.log('🔍 Starting auth check...')
    
    try {
      // Check cookies first
      const cookies = document.cookie
      console.log('🍪 Cookies:', cookies)
      
      // Check session - only declare once!
      const { data: { session }, error } = await supabase.auth.getSession()
      console.log('📦 Session:', session)
      console.log('❌ Error:', error)
      
      if (!mounted) return;
      
      if (!session) {
        console.log('No session, redirecting to login')
        router.push('/login')
        return
      }
      
      console.log('✅ Session found:', session.user.email)
      setUser(session.user)
      
      // Fetch user profile
      const { data: profileData } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', session.user.id)
        .single()
        
      // Fetch yin progress
      const { data: progressData } = await supabase
        .from('yin_progress')
        .select('*')
        .eq('user_id', session.user.id)
        .single()
        
      if (mounted) {
        setProfile({ ...profileData, ...progressData })
        console.log('Profile data:', profileData)
        console.log('Progress data:', progressData)
      }
    } catch (error) {
      console.error('💥 Error in checkUser:', error)
    } finally {
      if (mounted) {
        setLoading(false)
      }
    }
  }
  
  // Initial check
  checkUser()

  // Listen for changes
  const { data: { subscription } } = supabase.auth.onAuthStateChange(
    (event, session) => {
      console.log('🔄 Auth state changed:', event, session?.user?.email)
      if (event === 'SIGNED_IN' && session) {
        console.log('✅ User signed in via event')
        checkUser()
      } else if (event === 'SIGNED_OUT' || !session) {
        console.log('🚪 User signed out or no session')
        router.push('/login')
      }
    }
  )

  return () => {
    mounted = false
    subscription.unsubscribe()
  }
}, [supabase, router])

  // Handle sign out
  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  // Quest system hook
  const {
    isQuestSidebarOpen,
    toggleQuestSidebar,
    setIsQuestSidebarOpen,
    completeQuest,
    progressChallenge,
    questsAvailable,
    dailyStreak
  } = useQuests()

  // Show loading state
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-950">
        <div className="text-white">Loading your journey...</div>
      </div>
    )
  }

  // Merge database data with defaults
  const userData = {
    name: profile?.display_name || profile?.username || 'Seeker',
    level: profile?.level || 1,
    xp: profile?.xp || 300,
    experience: profile?.total_xp || 300,
    nextLevel: 5000,
    completedLessons: profile?.completed_lessons?.length || 0,
    totalLessons: 48,
    completedChapters: profile?.unlocked_chapters || [],
    unlockedPaths: profile?.unlocked_paths || ['the-self'],
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

  const mountainLessons = [
    { id: '1', title: 'Introduction to Shadow Work', duration: 10, type: 'video', completed: true },
    { id: '2', title: 'Meeting Your Shadow', duration: 15, type: 'interactive', completed: true },
    { id: '3', title: 'Shadow Integration', duration: 20, type: 'reading', completed: false },
    { id: '4', title: 'Shadow Dialogue', duration: 25, type: 'video', completed: false },
    { id: '5', title: 'Living with Your Shadow', duration: 30, type: 'interactive', completed: false }
  ]

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
    <div className="flex h-screen relative overflow-hidden">
      {/* Starry Background */}
      <StarryBackground />
      
      {/* Debug Info Panel - Remove in production */}
      {user && (
        <div className="fixed top-20 right-4 bg-purple-900/90 backdrop-blur p-4 rounded-lg shadow-xl z-50 text-white text-sm max-w-xs">
          <h3 className="font-bold mb-2 text-purple-200">🔮 Auth Debug</h3>
          <div className="space-y-1 text-xs">
            <p><span className="text-purple-300">Email:</span> {user.email}</p>
            <p><span className="text-purple-300">ID:</span> {user.id.substring(0, 8)}...</p>
            <p><span className="text-purple-300">Username:</span> {profile?.username}</p>
            <p><span className="text-purple-300">Level:</span> {profile?.level || 1}</p>
            <p><span className="text-purple-300">XP:</span> {profile?.xp || 300}</p>
            <p><span className="text-purple-300">Paths:</span> {profile?.unlocked_paths?.join(', ')}</p>
          </div>
          <button 
            onClick={handleSignOut}
            className="mt-3 w-full px-3 py-1 bg-red-600/80 rounded hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
          >
            <LogOut className="w-3 h-3" />
            Sign Out
          </button>
        </div>
      )}
      
      {/* Main App Container */}
      <div className="relative z-10 flex w-full">
        {/* Sidebar */}
        <YinSidebar
          isOpen={sidebarOpen}
          onToggle={() => setSidebarOpen(!sidebarOpen)}
          currentView={currentView}
          onViewChange={setCurrentView}
          userData={userData}
        />

        {/* Main Content - keeping all your existing content */}
        <div className={cn(
          "flex-1 flex flex-col overflow-hidden transition-all duration-300",
          sidebarOpen ? "lg:ml-0" : "lg:ml-0"
        )}>
          {/* Header - keeping your existing header */}
          <header className="bg-black/30 backdrop-blur-xl border-b border-purple-500/20">
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="lg:hidden p-2 hover:bg-purple-500/20 rounded-lg transition-colors"
                >
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
                
                <div className="relative hidden md:block">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-purple-400" />
                  <input
                    type="text"
                    placeholder="Search chapters, lessons, or community..."
                    className="pl-10 pr-4 py-2 bg-purple-900/30 border border-purple-500/20 rounded-xl text-white placeholder-purple-400/60 outline-none focus:bg-purple-900/40 focus:border-purple-400/40 transition-all w-96"
                  />
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 bg-orange-500/20 px-3 py-1.5 rounded-full border border-orange-500/30">
                  <Flame className="w-4 h-4 text-orange-400" />
                  <span className="text-orange-400 font-bold text-sm">{userStreak}</span>
                  <span className="text-xs text-orange-300">day streak</span>
                </div>

                <button className="relative p-2 hover:bg-purple-500/20 rounded-lg transition-colors">
                  <Bell className="w-5 h-5 text-purple-300" />
                  {notifications > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-pink-500 rounded-full text-xs text-white flex items-center justify-center">
                      {notifications}
                    </span>
                  )}
                </button>

                <button className="p-2 hover:bg-purple-500/20 rounded-lg transition-colors">
                  <Moon className="w-5 h-5 text-purple-300" />
                </button>
              </div>
            </div>
          </header>

          {/* Main Content Area - keeping all your existing views */}
          <main className="flex-1 overflow-y-auto">
            {currentView === 'dashboard' && (
              <DashboardView userData={userData} dailyProgress={dailyProgress} />
            )}

            {currentView === 'chapters' && (
              <div className="p-8">
                <ChapterSystem />
              </div>
            )}

            {/* Rest of your views remain the same */}
            {currentView === 'mountain' && (
              <div className="p-8">
                <MountainClimb 
                  chapter={{ 
                    id: userData.currentChapter,
                    title: 'Shadow Work',
                    description: 'Embrace and integrate your shadow self'
                  }}
                  lessons={mountainLessons}
                  onLessonSelect={() => console.log('Lesson selected')}
                  onBack={() => setCurrentView('dashboard')}
                />
              </div>
            )}

            {/* All other views remain unchanged */}
            {currentView === 'garden' && (
              <div className="p-8">
                <GrowthGarden 
                  userData={userData}
                  onPlantClick={(plant) => console.log('Plant clicked:', plant)}
                />
              </div>
            )}

            {currentView === 'habits' && (
              <div className="p-8">
                <BujoHabitTracker 
                  onDataUpdate={(data) => console.log('Habit data updated:', data)}
                  initialData={null}
                />
              </div>
            )}

            {currentView === 'hermit' && (
              <div className="p-8">
                <div className="max-w-6xl mx-auto">
                  <div className="mb-8">
                    <h2 className="text-3xl font-bold text-white mb-2">Hermit Guide</h2>
                    <p className="text-purple-300">Your AI wisdom companion for inner exploration</p>
                  </div>
                  
                  <div className="bg-black/30 backdrop-blur-xl rounded-3xl border border-purple-500/20 p-8">
                    <div className="text-center py-12">
                      <span className="text-6xl mb-4 block">🕯️</span>
                      <h3 className="text-xl font-semibold text-white mb-2">The Hermit Awaits</h3>
                      <p className="text-purple-300 mb-6">
                        Click below to begin your conversation with the Hermit Guide
                      </p>
                      <button
                        onClick={() => setShowHermitModal(true)}
                        className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl text-white font-medium hover:shadow-lg hover:shadow-purple-500/25 transition-all"
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

        {/* Hermit AI Guide Modal */}
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

      {/* Quest Button - Floating Bottom Right */}
      <QuestButton
        onClick={toggleQuestSidebar}
        questsAvailable={questsAvailable}
        dailyStreak={dailyStreak}
      />
      
      {/* Quest Sidebar - Overlay */}
      <QuestSidebar
        isOpen={isQuestSidebarOpen}
        onClose={() => setIsQuestSidebarOpen(false)}
        onQuestComplete={completeQuest}
        onChallengeProgress={progressChallenge}
      />
    </div>
  )
}

// Keep your StarryBackground component exactly as is
const StarryBackground = () => {
  const [stars, setStars] = useState<any[]>([])

  useEffect(() => {
    const generateStars = () => {
      const starArray = []
      for (let i = 0; i < 150; i++) {
        starArray.push({
          id: `star-${i}`,
          size: Math.random() * 2 + 0.5,
          x: Math.random() * 100,
          y: Math.random() * 100,
          duration: Math.random() * 3 + 2,
          delay: Math.random() * 2
        })
      }
      return starArray
    }
    setStars(generateStars())
  }, [])

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      <div className="absolute inset-0 bg-gradient-to-br from-gray-950 via-purple-950/70 to-indigo-950" />
      
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 left-20 w-96 h-96 bg-purple-800 rounded-full filter blur-[100px] animate-pulse" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-indigo-800 rounded-full filter blur-[100px] animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-900 rounded-full filter blur-[120px] animate-pulse delay-2000" />
      </div>

      {stars.map((star) => (
        <div
          key={star.id}
          className="absolute rounded-full bg-white animate-twinkle"
          style={{
            width: `${star.size}px`,
            height: `${star.size}px`,
            left: `${star.x}%`,
            top: `${star.y}%`,
            animationDuration: `${star.duration}s`,
            animationDelay: `${star.delay}s`,
            boxShadow: '0 0 6px rgba(255, 255, 255, 0.8)'
          }}
        />
      ))}

      <div className="absolute top-20 right-0 w-32 h-0.5 bg-gradient-to-r from-transparent via-white to-transparent opacity-60 animate-shooting-star" />
      <div className="absolute top-40 right-0 w-24 h-0.5 bg-gradient-to-r from-transparent via-white to-transparent opacity-40 animate-shooting-star-delayed" />

      <style jsx>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0.2; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.2); }
        }
        @keyframes shooting-star {
          0% { transform: translateX(300px) translateY(0); opacity: 1; }
          100% { transform: translateX(-300px) translateY(100px); opacity: 0; }
        }
        @keyframes shooting-star-delayed {
          0% { transform: translateX(300px) translateY(0); opacity: 1; }
          100% { transform: translateX(-400px) translateY(150px); opacity: 0; }
        }
        .animate-shooting-star {
          animation: shooting-star 3s ease-in-out infinite;
        }
        .animate-shooting-star-delayed {
          animation: shooting-star-delayed 4s ease-in-out infinite;
          animation-delay: 1.5s;
        }
        .animate-twinkle {
          animation: twinkle var(--duration) ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}

// Keep all your other view components exactly as they are
function DashboardView({ userData, dailyProgress }: any) {
  // Your existing DashboardView code remains unchanged
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-200 to-pink-200 mb-2">
          Welcome back, {userData.name} ✨
        </h1>
        <p className="text-purple-300 text-lg">
          You're on day {userData.streakDays} of your inner journey. Keep exploring!
        </p>
      </div>

      {/* Rest of your dashboard code remains the same */}
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-black/30 backdrop-blur-xl rounded-2xl p-6 border border-purple-500/20">
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-purple-400" />
            Today's Journey
          </h3>
          
          <div className="space-y-4">
            {dailyProgress.tasks.map((task: any, index: number) => (
              <div key={index} className="flex items-center justify-between p-3 bg-purple-900/20 rounded-xl border border-purple-500/10">
                <div className="flex items-center gap-3">
                  {task.completed ? (
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                  ) : (
                    <div className="w-6 h-6 border-2 border-purple-500 rounded-full" />
                  )}
                  <span className={cn(
                    "font-medium",
                    task.completed ? "text-purple-400 line-through" : "text-white"
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
              <span className="text-purple-400">Daily Completion</span>
              <span className="text-white font-medium">{Math.round(dailyProgress.percentage)}%</span>
            </div>
            <div className="h-2 bg-black/50 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all"
                style={{ width: `${dailyProgress.percentage}%` }}
              />
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-black/30 backdrop-blur-xl rounded-2xl p-6 border border-purple-500/20">
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <Target className="w-5 h-5 text-purple-400" />
              Current Focus
            </h3>
            
            <div className="space-y-3">
              {userData.focusAreas.map((area: string, index: number) => (
                <div key={area} className="flex items-center gap-3">
                  <div className={cn(
                    "w-2 h-2 rounded-full",
                    index === 0 ? "bg-purple-400" : index === 1 ? "bg-blue-400" : "bg-green-400"
                  )} />
                  <span className="text-purple-300 capitalize">{area.replace('-', ' ')}</span>
                </div>
              ))}
            </div>
            
            <button className="w-full mt-4 py-2 bg-purple-600/30 hover:bg-purple-600/40 rounded-xl text-purple-300 font-medium transition-colors border border-purple-500/30">
              Continue Journey →
            </button>
          </div>

          <div className="bg-black/30 backdrop-blur-xl rounded-2xl p-6 border border-purple-500/20">
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-purple-400" />
              Recent Activity
            </h3>
            
            <div className="space-y-3">
              {userData.recentActivity.map((activity: any, index: number) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 bg-purple-400 rounded-full mt-2" />
                  <div className="flex-1">
                    <p className="text-sm text-white">{activity.title}</p>
                    <p className="text-xs text-purple-500">{activity.time}</p>
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

// Keep all your other components (StatCard, AnalyticsView, CommunityView, LibraryView) exactly as they are
function StatCard({ icon: Icon, label, value, color, trend }: any) {
  const colorClasses: any = {
    purple: 'from-purple-600 to-purple-800',
    blue: 'from-blue-600 to-blue-800',
    green: 'from-green-600 to-green-800',
    pink: 'from-pink-600 to-pink-800'
  }

  return (
    <div className="bg-black/30 backdrop-blur-xl rounded-2xl p-6 border border-purple-500/20">
      <div className="flex items-start justify-between mb-4">
        <div className={cn("p-3 bg-gradient-to-br rounded-xl shadow-lg", colorClasses[color])}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        <span className="text-xs text-purple-400">{trend}</span>
      </div>
      <p className="text-2xl font-bold text-white mb-1">{value}</p>
      <p className="text-sm text-purple-400">{label}</p>
    </div>
  )
}

// Keep AnalyticsView, CommunityView, and LibraryView unchanged
function AnalyticsView({ userData }: any) {
  return (
    <div className="p-8">
      <h2 className="text-3xl font-bold text-white mb-8">Your Growth Analytics</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-black/30 backdrop-blur-xl rounded-2xl p-6 border border-purple-500/20">
          <h3 className="text-xl font-semibold text-white mb-4">Progress Over Time</h3>
          <div className="h-64 flex items-center justify-center">
            <BarChart3 className="w-16 h-16 text-purple-600" />
            <p className="text-purple-400 ml-4">Chart visualization coming soon</p>
          </div>
        </div>
        
        <div className="bg-black/30 backdrop-blur-xl rounded-2xl p-6 border border-purple-500/20">
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
            <div key={room.name} className="bg-black/30 backdrop-blur-xl rounded-2xl p-6 border border-purple-500/20 hover:bg-black/40 cursor-pointer transition-all">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">{room.name}</h3>
                  <p className="text-purple-400 text-sm">
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
        
        <div className="bg-black/30 backdrop-blur-xl rounded-2xl p-6 border border-purple-500/20">
          <h3 className="text-xl font-semibold text-white mb-4">Community Insights</h3>
          <div className="space-y-3">
            <blockquote className="text-sm text-purple-300 italic border-l-2 border-purple-400 pl-3">
              "The shadow work lessons have completely transformed my perspective..."
            </blockquote>
            <blockquote className="text-sm text-purple-300 italic border-l-2 border-blue-400 pl-3">
              "Day 30 of meditation - I finally understand what stillness means..."
            </blockquote>
            <blockquote className="text-sm text-purple-300 italic border-l-2 border-green-400 pl-3">
              "The community support here is unlike anything I've experienced..."
            </blockquote>
          </div>
        </div>
      </div>
    </div>
  )
}

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
            <div key={resource.title} className="bg-black/30 backdrop-blur-xl rounded-2xl p-6 border border-purple-500/20 hover:bg-black/40 cursor-pointer transition-all">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-purple-600/30 rounded-xl">
                  <Icon className="w-6 h-6 text-purple-400" />
                </div>
                <div>
                  <span className="text-xs text-purple-400">{resource.type}</span>
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