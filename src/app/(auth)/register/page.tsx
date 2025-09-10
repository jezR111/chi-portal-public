// src/app/(auth)/register/page.tsx
'use client'

import { createClient } from '@/lib/db/supabase/client'
import { Chrome, Loader2, Mail, Sparkles, User } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function RegisterPage() {
  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState('')
  const router = useRouter()
  const supabase = createClient()

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage('')

    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: process.env.NEXT_PUBLIC_APP_URL 
            ? `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`
            : `${window.location.origin}/auth/callback`,
          data: {
            username: username || `seeker_${Date.now()}`,
          }
        }
      })

      if (error) throw error
      
      setMessage('Check your email for the magic link!')
    } catch (error: any) {
      setMessage(error.message || 'Something went wrong')
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleSignUp = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: process.env.NEXT_PUBLIC_APP_URL 
            ? `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`
            : `${window.location.origin}/auth/callback`,
        },
      })
      
      if (error) throw error
    } catch (error: any) {
      setMessage(error.message || 'Failed to sign up with Google')
    }
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Yin-Yang Background */}
      <div className="absolute inset-0">
        {/* Base gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-orange-100 via-purple-100 to-indigo-100" />
        
        {/* Purple overlay for depth */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-transparent to-orange-900/20" />
        
        {/* Floating Orbs */}
        <div className="absolute top-20 left-20 w-96 h-96 bg-purple-400/30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-orange-400/30 rounded-full blur-3xl animate-pulse" />
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          {/* Logo Area */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 mb-4">
              {/* Yin-Yang Symbol */}
              <svg viewBox="0 0 100 100" className="w-full h-full animate-spin-slow">
                <circle cx="50" cy="50" r="48" fill="white" stroke="currentColor" strokeWidth="2" className="text-purple-600" />
                <path d="M50,2 A48,48 0 0,1 50,98 A24,24 0 0,0 50,50 A24,24 0 0,1 50,2" fill="currentColor" className="text-purple-600" />
                <circle cx="50" cy="26" r="8" fill="white" />
                <circle cx="50" cy="74" r="8" fill="currentColor" className="text-purple-600" />
              </svg>
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-orange-600 bg-clip-text text-transparent">
              Find Your Flow
            </h1>
            <p className="mt-2 text-gray-600">Begin your journey to balance</p>
          </div>

          {/* Form Card */}
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-200/50 p-8">
            {/* Toggle */}
            <div className="flex justify-center mb-6">
              <div className="inline-flex rounded-full bg-gray-100 p-1">
                
                  href="/login"
                  className="px-4 py-2 rounded-full text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Sign In
                </a>
                <button
                  className="px-4 py-2 rounded-full bg-white shadow-sm text-gray-900 font-medium"
                >
                  Sign Up
                </button>
              </div>
            </div>

            {/* Google Sign Up */}
            <button
              onClick={handleGoogleSignUp}
              className="w-full flex items-center justify-center gap-3 bg-white border-2 border-gray-200 text-gray-700 rounded-2xl px-4 py-3 font-medium hover:border-purple-300 hover:bg-purple-50 transition-all"
            >
              <Chrome className="w-5 h-5" />
              Continue with Google
            </button>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-3 bg-white/80 text-gray-500">or</span>
              </div>
            </div>

            {/* Sign Up Form */}
            <form onSubmit={handleSignUp} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Username (optional)
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-purple-400 focus:bg-white transition-all"
                    placeholder="Choose a username"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-purple-400 focus:bg-white transition-all"
                    placeholder="you@example.com"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl px-4 py-3 font-medium hover:from-purple-700 hover:to-indigo-700 transition-all transform hover:scale-[1.02] shadow-lg disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Creating account...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Begin Your Journey
                  </>
                )}
              </button>
            </form>

            {/* Message */}
            {message && (
              <div className={`mt-4 p-3 rounded-lg text-center text-sm ${
                message.includes('Check') 
                  ? 'bg-green-500/10 text-green-600 border border-green-500/30' 
                  : 'bg-red-500/10 text-red-600 border border-red-500/30'
              }`}>
                {message}
              </div>
            )}

            {/* Terms */}
            <p className="mt-6 text-center text-xs text-gray-500">
              By signing up, you agree to our{' '}
              <a href="/terms" className="text-purple-600 hover:underline">Terms</a>
              {' and '}
              <a href="/privacy" className="text-purple-600 hover:underline">Privacy Policy</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}