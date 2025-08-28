// src/components/layout/TopBar.tsx
'use client'

import { useAuth } from '@/components/providers/AuthProvider'
import { cn } from '@/lib/utils/cn'
import { Bell, Menu, Moon, Search, Sparkles, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

/**
 * Top navigation bar component
 * Contains search, notifications, theme toggle, and mobile menu trigger
 */
export function TopBar() {
  const [isSearchFocused, setIsSearchFocused] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const { user } = useAuth()
  
  // Use next-themes instead of Chakra
  const { theme, setTheme } = useTheme()

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <header className="sticky top-0 z-30 flex h-16 flex-shrink-0 border-b border-white/10 bg-white/50 backdrop-blur-xl dark:bg-gray-950/50">
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

          {/* Theme Toggle (next-themes) */}
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
          <div className="hidden sm:flex items-center gap-3 border-l border-gray-200 pl-4 dark:border-gray-700">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {user?.displayName || 'User'}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Level 12 · {user?.tier || 'FREE'}
              </p>
            </div>
            <div className="h-9 w-9 rounded-full bg-gradient-to-br from-primary-400 to-purple-600 shadow-lg" />
          </div>
        </div>
      </div>
    </header>
  )
}