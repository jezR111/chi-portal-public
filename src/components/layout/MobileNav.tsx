// src/components/layout/MobileNav.tsx
'use client'

import { cn } from '@/lib/utils/cn'
import { Home, Moon, Sun, Target, Users } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const mobileNavigation = [
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  { name: 'Yin', href: '/way-of-self', icon: Moon },
  { name: 'Yang', href: '/vitality', icon: Sun },
  { name: 'Community', href: '/community', icon: Users },
  { name: 'Habits', href: '/habits', icon: Target },
]

/**
 * Mobile bottom navigation bar
 * Fixed at bottom on mobile devices with gradient active states
 */
export function MobileNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-white/10 bg-white/80 backdrop-blur-xl dark:bg-gray-950/80 lg:hidden">
      <div className="flex h-16 items-center justify-around">
        {mobileNavigation.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          
          return (
            <Link
              key={item.name}
              href={item.href}
              className="relative flex flex-col items-center justify-center gap-1 px-2 py-2"
            >
              {/* Active indicator */}
              {isActive && (
                <div className="absolute inset-x-0 -top-px h-0.5 bg-gradient-to-r from-primary-500 to-purple-600" />
              )}
              
              <div className={cn(
                'flex h-8 w-8 items-center justify-center rounded-lg transition-all',
                isActive 
                  ? 'bg-gradient-to-br from-primary-500 to-purple-600 shadow-lg shadow-purple-500/25' 
                  : 'hover:bg-gray-100 dark:hover:bg-gray-800'
              )}>
                <Icon className={cn(
                  'h-5 w-5',
                  isActive ? 'text-white' : 'text-gray-600 dark:text-gray-400'
                )} />
              </div>
              
              <span className={cn(
                'text-xs',
                isActive 
                  ? 'font-semibold text-primary-600 dark:text-primary-400' 
                  : 'text-gray-600 dark:text-gray-400'
              )}>
                {item.name}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}