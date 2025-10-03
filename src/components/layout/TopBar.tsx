// src/components/layout/TopBar.tsx
'use client'

import { useAuth } from '@/components/providers/AuthProvider'
import { useXP } from '@/features/yin/xp/useXP'
import { cn } from '@/lib/utils/cn'
import { AnimatePresence, motion } from 'framer-motion'
import { Bell, ChevronDown, LogOut, Menu, Moon, Search, Settings, Sparkles, Sun, User, Zap } from 'lucide-react'
import { useTheme } from 'next-themes'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

/**
 * Top navigation bar component
 * Now uses centralized XP system via useXP hook
 */
export function TopBar() {
  const [isSearchFocused, setIsSearchFocused] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [profileMenuOpen, setProfileMenuOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const { user, signOut } = useAuth()
  const pathname = usePathname()
  
  // Get XP data from centralized system
  const { 
    level,
    levelTitle,
    levelIcon,
    levelColor,
    currentXP,
    todayXP,
    levelProgress,
    xpToNextLevel,
    streak
  } = useXP()
  
  // Use next-themes
  const { theme, setTheme } = useTheme()

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  const isYinRealm = pathname?.includes('/yin')
  const isYangRealm = pathname?.includes('/yang')

  const getRealmStyles = () => {
    if (isYinRealm) {
      return 'bg-gradient-to-r from-purple-900/50 via-indigo-900/50 to-purple-900/50 border-b border-purple-500/20'
    }
    if (isYangRealm) {
      return 'bg-gradient-to-r from-orange-900/50 via-red-900/50 to-orange-900/50 border-b border-orange-500/20'
    }
    return 'bg-white/50 dark:bg-gray-950/50 border-b border-white/10'
  }

  return (
    <header className={cn(
      "sticky top-0 z-30 flex h-16 flex-shrink-0 backdrop-blur-xl",
      getRealmStyles()
    )}>
      <div className="flex flex-1 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Mobile menu button */}
        <button
          type="button"
          className="lg:hidden inline-flex items-center justify-center rounded-lg p-2 text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <Menu className="h-6 w-6" />
        </button>

        {/* Search Bar */}
        <div className="flex flex-1 items-center justify-center px-2 lg:ml-6 lg:justify-start">
          <div className="w-full max-w-lg lg:max-w-xs">
            <div
              className={cn(
                'relative rounded-xl transition-all duration-200',
                isSearchFocused && 'scale-105'
              )}
            >
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Search
                  className={cn(
                    'h-5 w-5 transition-colors',
                    isSearchFocused
                      ? 'text-primary-500'
                      : 'text-gray-400 dark:text-gray-500'
                  )}
                />
              </div>
              <input
                className={cn(
                  'block w-full rounded-xl border bg-white/50 py-2 pl-10 pr-3 text-sm placeholder-gray-500 transition-all',
                  'focus:border-primary-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20',
                  'dark:bg-gray-900/50 dark:focus:bg-gray-900',
                  isSearchFocused
                    ? 'border-primary-500 shadow-lg shadow-primary-500/10'
                    : 'border-gray-200 dark:border-gray-700'
                )}
                placeholder="Search chapters, lessons, or community..."
                type="search"
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
              />
            </div>
          </div>
        </div>

        {/* Right side actions */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* XP & Streak Display - Simplified for all screen sizes */}
          <div className="flex items-center gap-2">
            {/* Streak (if exists) */}
            {streak > 0 && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center gap-1 px-2 py-1 bg-orange-600/20 rounded-lg"
              >
                <span className="text-xs sm:text-sm">🔥</span>
                <span className="text-xs sm:text-sm text-orange-400 font-semibold">{streak}</span>
              </motion.div>
            )}
            
            {/* XP Display */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-2 px-3 py-1.5 bg-purple-600/20 rounded-lg border border-purple-500/30"
            >
              <Zap className="w-4 h-4 text-yellow-400" />
              <span className="text-sm font-bold text-white">{currentXP || 0} XP</span>
            </motion.div>
          </div>

          {/* AI Assistant Button - Premium Feature */}
          {user?.tier === 'PREMIUM' && (
            <button
              className="hidden sm:inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary-500 to-purple-600 px-3 py-1.5 text-xs font-semibold text-white shadow-lg transition-all hover:shadow-xl hover:scale-105"
              aria-label="AI Assistant"
            >
              <Sparkles className="h-4 w-4" />
              <span className="hidden md:inline">AI Guide</span>
            </button>
          )}

          {/* Notifications */}
          <button
            className="relative rounded-lg p-2 text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800"
            aria-label="Notifications"
          >
            <Bell className="h-5 w-5" />
            {/* Notification badge */}
            <span className="absolute right-1.5 top-1.5 flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500" />
            </span>
          </button>

          {/* Theme Toggle */}
          {mounted && (
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="rounded-lg p-2 text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </button>
          )}

          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => setProfileMenuOpen(!profileMenuOpen)}
              className="hidden sm:flex items-center gap-3 border-l border-gray-200 pl-4 dark:border-gray-700"
            >
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {user?.displayName || 'User'}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {levelTitle} · Level {level}
                </p>
              </div>
              <div className="relative">
                <div className={`h-9 w-9 rounded-full bg-gradient-to-br ${levelColor} shadow-lg`} />
                <span className="absolute inset-0 flex items-center justify-center text-white font-bold">
                  {user?.displayName?.charAt(0).toUpperCase() || 'U'}
                </span>
              </div>
              <ChevronDown className={cn(
                "w-4 h-4 text-gray-400 transition-transform",
                profileMenuOpen && "rotate-180"
              )} />
            </button>

            {/* Profile Dropdown */}
            <AnimatePresence>
              {profileMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-900 rounded-xl shadow-xl border border-gray-200 dark:border-gray-800 overflow-hidden"
                >
                  {/* Profile Header */}
                  <div className="p-4 bg-gradient-to-br from-purple-600/10 to-indigo-600/10">
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 bg-gradient-to-br ${levelColor} rounded-full flex items-center justify-center`}>
                        <span className="text-2xl">{levelIcon}</span>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-gray-900 dark:text-white">
                          {user?.displayName || 'Seeker'}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {levelTitle} · Level {level}
                        </p>
                        <p className="text-xs text-purple-600 dark:text-purple-400 font-semibold">
                          {currentXP.toLocaleString()} XP
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Menu Items */}
                  <div className="p-2">
                    <a 
                      href="/profile"
                      className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    >
                      <User className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-700 dark:text-gray-300">Profile</span>
                    </a>
                    
                    <a 
                      href="/settings"
                      className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    >
                      <Settings className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-700 dark:text-gray-300">Settings</span>
                    </a>
                    
                    <hr className="my-2 border-gray-200 dark:border-gray-800" />
                    
                    <button
                      onClick={() => signOut()}
                      className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-left"
                    >
                      <LogOut className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-700 dark:text-gray-300">Sign Out</span>
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  )
}