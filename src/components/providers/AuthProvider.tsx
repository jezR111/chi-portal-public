// src/components/providers/AuthProvider.tsx
'use client'

import type { User } from '@/types/domain'
import { usePathname, useRouter } from 'next/navigation'
import { createContext, useContext, useState } from 'react'

interface AuthContextType {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (email: string) => Promise<void>
  logout: () => Promise<void>
  refreshSession: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Public routes that don't require authentication
const publicRoutes = ['/login', '/register', '/magic-link', '/', '/privacy', '/terms', '/contact']

interface AuthProviderProps {
  children: React.ReactNode
}

/**
 * Authentication provider
 * Manages user session and authentication state
 */
export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(false) // Changed to false for now
  const router = useRouter()
  const pathname = usePathname()

  // TEMPORARILY DISABLED - API not built yet
  // useEffect(() => {
  //   checkAuth()
  // }, [])

  // TEMPORARILY DISABLED - Allow navigation without auth
  // useEffect(() => {
  //   if (!isLoading) {
  //     const isPublicRoute = publicRoutes.includes(pathname)
      
  //     if (!user && !isPublicRoute) {
  //       router.push('/login')
  //     } else if (user && (pathname === '/login' || pathname === '/register')) {
  //       router.push('/dashboard')
  //     }
  //   }
  // }, [user, isLoading, pathname, router])

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/v1/auth/me', {
        credentials: 'include',
      })

      if (response.ok) {
        const userData = await response.json()
        setUser(userData)
      } else {
        setUser(null)
      }
    } catch (error) {
      console.error('Auth check failed:', error)
      setUser(null)
    } finally {
      setIsLoading(false)
    }
  }

  const login = async (email: string) => {
    try {
      const response = await fetch('/api/v1/auth/magic-link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      if (!response.ok) {
        throw new Error('Login failed')
      }

      // Magic link sent, redirect to check email page
      router.push('/magic-link?email=' + encodeURIComponent(email))
    } catch (error) {
      console.error('Login error:', error)
      throw error
    }
  }

  const logout = async () => {
    try {
      await fetch('/api/v1/auth/logout', {
        method: 'POST',
        credentials: 'include',
      })
      
      setUser(null)
      router.push('/login')
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  const refreshSession = async () => {
    await checkAuth()
  }

  const value = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    logout,
    refreshSession,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

/**
 * Hook to access auth context
 */
export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}