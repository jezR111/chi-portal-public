// src/components/layout/YinSidebar.tsx
'use client'

import { cn } from '@/lib/utils/cn'
import {
  BarChart3,
  BookOpen,
  ChevronRight,
  Flower2,
  Home,
  Library,
  Lightbulb,
  LogOut,
  Menu,
  MessageCircle,
  Moon,
  Mountain,
  Settings,
  Sparkles,
  Target,
  Trophy,
  Users,
  X
} from 'lucide-react'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

interface YinSidebarProps {
  isOpen: boolean
  onToggle: () => void
  currentView: string
  onViewChange: (view: string) => void
  userData?: {
    name: string
    level: number
    xp: number
    avatar?: string
  }
}

// Main navigation items
const PRIMARY_NAV = [
  { 
    id: 'dashboard', 
    label: 'Dashboard', 
    icon: Home,
    description: 'Your journey overview'
  },
  { 
    id: 'chapters', 
    label: 'Chapters', 
    icon: BookOpen,
    description: 'Learn and grow'
  },
  { 
    id: 'mountain', 
    label: 'Mountain Climb', 
    icon: Mountain,
    description: 'Track your ascent'
  },
  { 
    id: 'garden', 
    label: 'Growth Garden', 
    icon: Flower2,
    description: 'Nurture your growth'
  },
  { 
    id: 'habits', 
    label: 'Habit Tracker', 
    icon: Target,
    description: 'Build consistency'
  },
  { 
    id: 'hermit', 
    label: 'Hermit Guide', 
    icon: Sparkles,
    description: 'AI wisdom companion'
  }
]

// Secondary navigation items
const SECONDARY_NAV = [
  { 
    id: 'insights', 
    label: 'Insight Bank', 
    icon: Lightbulb,
    description: 'Your captured wisdom',
    route: '/yin/insights'
  },
  { 
    id: 'analytics', 
    label: 'Analytics', 
    icon: BarChart3,
    description: 'Your growth metrics'
  },
  { 
    id: 'community', 
    label: 'Community', 
    icon: Users,
    description: 'Connect with others'
  },
  { 
    id: 'library', 
    label: 'Resource Library', 
    icon: Library,
    description: 'Tools & materials'
  }
]

export default function YinSidebar({
  isOpen,
  onToggle,
  currentView,
  onViewChange,
  userData = {
    name: 'Seeker',
    level: 3,
    xp: 2450
  }
}: YinSidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [insightCount, setInsightCount] = useState(0)

  // Load insight count
  useEffect(() => {
    const loadInsightCount = () => {
      const insights = JSON.parse(localStorage.getItem('userInsights') || '[]')
      setInsightCount(insights.length)
    }
    loadInsightCount()
    window.addEventListener('storage', loadInsightCount)
    return () => window.removeEventListener('storage', loadInsightCount)
  }, [])

  const handleLogout = () => {
    if (confirm('Are you sure you want to logout?')) {
      localStorage.removeItem('authToken')
      router.push('/login')
    }
  }

  const handleNavClick = (item: any) => {
    if (item.route) {
      router.push(item.route)
    } else {
      onViewChange(item.id)
    }
  }

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "fixed left-0 top-0 h-full bg-gradient-to-b from-gray-900 via-purple-900/10 to-gray-900",
        "border-r border-white/10 backdrop-blur-xl transition-all duration-300 z-50",
        "flex flex-col",
        isOpen ? "w-72" : "w-20",
        "lg:relative lg:translate-x-0",
        !isOpen && "lg:w-20",
        isOpen && "lg:w-72"
      )}>
        {/* Header */}
        <div className="p-4 lg:p-6 border-b border-white/10">
          <div className="flex items-center justify-between">
            <div className={cn(
              "flex items-center gap-3",
              !isOpen && "lg:justify-center"
            )}>
              {/* Logo */}
              <div className="relative">
                <div className="p-2.5 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl shadow-lg shadow-purple-500/25">
                  <Moon className="w-6 h-6 text-white" />
                </div>
                <Sparkles className="absolute -top-1 -right-1 w-3 h-3 text-yellow-400 animate-pulse" />
              </div>
              
              {/* Title */}
              {isOpen && (
                <div className="animate-fadeIn">
                  <h1 className="text-lg font-bold text-white">Yin Realm</h1>
                  <p className="text-xs text-gray-400">Inner Journey</p>
                </div>
              )}
            </div>

            {/* Mobile Close Button */}
            <button
              onClick={onToggle}
              className="lg:hidden p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>

        {/* Main Navigation */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-6">
          {/* Primary Nav */}
          <div>
            {isOpen && (
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-3">
                Your Journey
              </h3>
            )}
            <div className="space-y-1">
              {PRIMARY_NAV.map(item => {
                const Icon = item.icon
                const isActive = currentView === item.id
                
                return (
                  <button
                    key={item.id}
                    onClick={() => onViewChange(item.id)}
                    className={cn(
                      "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all group relative",
                      isActive
                        ? "bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-white border border-purple-500/30"
                        : "text-gray-400 hover:text-white hover:bg-white/5"
                    )}
                  >
                    <Icon className={cn(
                      "w-5 h-5 flex-shrink-0",
                      isActive && "text-purple-400"
                    )} />
                    
                    {isOpen ? (
                      <div className="flex-1 text-left">
                        <span className="font-medium block">{item.label}</span>
                        {isActive && (
                          <span className="text-xs text-gray-400">{item.description}</span>
                        )}
                      </div>
                    ) : (
                      <div className="absolute left-full ml-2 px-2 py-1 bg-gray-800 rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
                        <span className="text-xs text-white">{item.label}</span>
                      </div>
                    )}
                    
                    {isOpen && isActive && (
                      <div className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-pulse" />
                    )}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Quests & Challenges - Quick Access */}
      {isOpen && (
  <div className="animate-fadeIn px-3 mt-4">
    <button
      onClick={() => onViewChange('quests')}
      className="w-full group relative overflow-hidden rounded-full"
    >
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-r from-slate-500 via-gray-400 to-slate-500 opacity-75 group-hover:opacity-100 transition-opacity" />
      
      {/* Glass effect overlay */}
      <div className="relative backdrop-blur-sm bg-white/5 px-6 py-3.5 border border-white/20">
        <div className="flex items-center justify-center gap-3">
          <Trophy className="w-5 h-5 text-amber-400" />
          <span className="font-medium text-white tracking-wide">QUESTS & CHALLENGES</span>
          <ChevronRight className="w-4 h-4 text-white/70 group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
      
      {/* Shimmer effect on hover */}
      <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
    </button>
  </div>
)}

          {/* Secondary Nav */}
          <div>
            {isOpen && (
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-3">
                Resources
              </h3>
            )}
            <div className="space-y-1">
              {SECONDARY_NAV.map(item => {
                const Icon = item.icon
                const isActive = pathname === item.route || currentView === item.id
                
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item)}
                    className={cn(
                      "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all group relative",
                      isActive
                        ? "bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-white"
                        : "text-gray-400 hover:text-white hover:bg-white/5"
                    )}
                  >
                    <Icon className={cn(
                      "w-5 h-5 flex-shrink-0",
                      item.id === 'insights' && "text-amber-400"
                    )} />
                    
                    {isOpen ? (
                      <div className="flex-1 flex items-center justify-between">
                        <span className="font-medium">{item.label}</span>
                        {item.id === 'insights' && insightCount > 0 && (
                          <span className="bg-amber-500/20 text-amber-300 text-xs px-2 py-0.5 rounded-full">
                            {insightCount}
                          </span>
                        )}
                      </div>
                    ) : (
                      <>
                        <div className="absolute left-full ml-2 px-2 py-1 bg-gray-800 rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
                          <span className="text-xs text-white">{item.label}</span>
                        </div>
                        {item.id === 'insights' && insightCount > 0 && (
                          <span className="absolute -top-1 -right-1 w-5 h-5 bg-amber-500 text-white text-xs rounded-full flex items-center justify-center">
                            {insightCount > 99 ? '99+' : insightCount}
                          </span>
                        )}
                      </>
                    )}
                  </button>
                )
              })}
            </div>
          </div>
        </nav>

        {/* User Section */}
        <div className="border-t border-white/10 p-4">
          {/* User Profile */}
          <div className={cn(
            "flex items-center gap-3 mb-3",
            !isOpen && "justify-center"
          )}>
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg shadow-purple-500/25">
                <span className="text-white font-bold text-sm">
                  {userData.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-gray-900" />
            </div>
            
            {isOpen && (
              <div className="flex-1 animate-fadeIn">
                <p className="text-sm font-semibold text-white">{userData.name}</p>
                <p className="text-xs text-gray-400">
                  Level {userData.level} • {userData.xp} XP
                </p>
              </div>
            )}
          </div>

          {/* Bottom Actions */}
          {isOpen ? (
            <div className="flex gap-2 animate-fadeIn">
              <button 
                onClick={() => router.push('/yin/settings')}
                className="flex-1 p-2 hover:bg-white/10 rounded-lg transition-colors group relative"
                aria-label="Settings"
              >
                <Settings className="w-4 h-4 text-gray-400 group-hover:text-white mx-auto" />
              </button>
              <button 
                onClick={() => router.push('/yin/messages')}
                className="flex-1 p-2 hover:bg-white/10 rounded-lg transition-colors group relative"
                aria-label="Messages"
              >
                <MessageCircle className="w-4 h-4 text-gray-400 group-hover:text-white mx-auto" />
              </button>
              <button 
                onClick={handleLogout}
                className="flex-1 p-2 hover:bg-white/10 rounded-lg transition-colors group"
                aria-label="Logout"
              >
                <LogOut className="w-4 h-4 text-gray-400 group-hover:text-white mx-auto" />
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              <button 
                onClick={() => router.push('/yin/settings')}
                className="w-full p-2 hover:bg-white/10 rounded-lg transition-colors group"
                aria-label="Settings"
              >
                <Settings className="w-4 h-4 text-gray-400 group-hover:text-white mx-auto" />
              </button>
              <button 
                onClick={() => router.push('/yin/messages')}
                className="w-full p-2 hover:bg-white/10 rounded-lg transition-colors group"
                aria-label="Messages"
              >
                <MessageCircle className="w-4 h-4 text-gray-400 group-hover:text-white mx-auto" />
              </button>
              <button 
                onClick={handleLogout}
                className="w-full p-2 hover:bg-white/10 rounded-lg transition-colors group"
                aria-label="Logout"
              >
                <LogOut className="w-4 h-4 text-gray-400 group-hover:text-white mx-auto" />
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* Toggle Button (Desktop) */}
      <button
        onClick={onToggle}
        className={cn(
          "hidden lg:flex fixed top-24 z-40",
          "w-8 h-8 items-center justify-center",
          "bg-gray-900 border border-white/10 rounded-r-lg",
          "hover:bg-white/10 transition-all",
          isOpen ? "left-72" : "left-20"
        )}
      >
        <Menu className="w-4 h-4 text-white" />
      </button>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateX(-10px); }
          to { opacity: 1; transform: translateX(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </>
  )
}