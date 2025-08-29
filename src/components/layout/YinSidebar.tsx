// src/components/layout/YinSidebar.tsx
'use client'

import { cn } from '@/lib/utils/cn'
import {
  BarChart3,
  BookOpen,
  Compass,
  Flower2,
  Heart,
  Home,
  Library,
  LogOut,
  Menu,
  MessageCircle,
  Moon,
  Mountain,
  Settings,
  Shield,
  Sparkles,
  Target,
  Users,
  X
} from 'lucide-react'
import { usePathname } from 'next/navigation'

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

// Growth areas for quick access
const GROWTH_AREAS = [
  { id: 'self-worth', label: 'Self Worth', icon: Heart, color: 'text-pink-400' },
  { id: 'boundaries', label: 'Boundaries', icon: Shield, color: 'text-blue-400' },
  { id: 'shadow-work', label: 'Shadow Work', icon: Moon, color: 'text-purple-400' },
  { id: 'purpose', label: 'Purpose', icon: Compass, color: 'text-yellow-400' }
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

          {/* Growth Areas - Quick Access */}
          {isOpen && (
            <div className="animate-fadeIn">
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-3">
                Focus Areas
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {GROWTH_AREAS.map(area => {
                  const Icon = area.icon
                  return (
                    <button
                      key={area.id}
                      className="flex items-center gap-2 p-2 bg-white/5 hover:bg-white/10 rounded-lg transition-all group"
                    >
                      <Icon className={cn("w-4 h-4", area.color)} />
                      <span className="text-xs text-gray-300 group-hover:text-white">
                        {area.label}
                      </span>
                    </button>
                  )
                })}
              </div>
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
                const isActive = currentView === item.id
                
                return (
                  <button
                    key={item.id}
                    onClick={() => onViewChange(item.id)}
                    className={cn(
                      "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all group relative",
                      isActive
                        ? "bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-white"
                        : "text-gray-400 hover:text-white hover:bg-white/5"
                    )}
                  >
                    <Icon className="w-5 h-5 flex-shrink-0" />
                    
                    {isOpen ? (
                      <span className="font-medium">{item.label}</span>
                    ) : (
                      <div className="absolute left-full ml-2 px-2 py-1 bg-gray-800 rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
                        <span className="text-xs text-white">{item.label}</span>
                      </div>
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
          {isOpen && (
            <div className="flex gap-2 animate-fadeIn">
              <button className="flex-1 p-2 hover:bg-white/10 rounded-lg transition-colors group">
                <Settings className="w-4 h-4 text-gray-400 group-hover:text-white mx-auto" />
              </button>
              <button className="flex-1 p-2 hover:bg-white/10 rounded-lg transition-colors group">
                <MessageCircle className="w-4 h-4 text-gray-400 group-hover:text-white mx-auto" />
              </button>
              <button className="flex-1 p-2 hover:bg-white/10 rounded-lg transition-colors group">
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