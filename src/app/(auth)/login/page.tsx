// src/app/(auth)/login/page.tsx
'use client'

import { createClient } from '@/lib/db/supabase/client'
import { ArrowRight, Chrome, Loader2, Mail } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState('')
  const router = useRouter()
  const supabase = createClient()

  const handleMagicLink = async (e: React.FormEvent) => {
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
        },
      })

      if (error) throw error
      
      setMessage('Check your email for the magic link!')
    } catch (error: any) {
      setMessage(error.message || 'Something went wrong')
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
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
      setMessage(error.message || 'Failed to sign in with Google')
    }
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Dark Background with subtle gradient */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-black" />
        
        {/* Floating Orbs - more subtle */}
        <div className="absolute top-20 left-20 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-gray-500/10 rounded-full blur-3xl animate-pulse" />
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          {/* Logo Area */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 mb-4 relative">
              {/* Glow effect behind yin-yang */}
              <div className="absolute inset-0 bg-white/20 rounded-full blur-xl scale-150 animate-pulse" />
              
              {/* White/Charcoal Yin-Yang Symbol */}
              <svg viewBox="0 0 100 100" className="w-full h-full animate-spin-slow relative z-10">
                <circle cx="50" cy="50" r="48" fill="white" stroke="currentColor" strokeWidth="2" className="text-gray-800" />
                <path d="M50,2 A48,48 0 0,1 50,98 A24,24 0 0,0 50,50 A24,24 0 0,1 50,2" fill="currentColor" className="text-gray-800" />
                <circle cx="50" cy="26" r="8" fill="white" />
                <circle cx="50" cy="74" r="8" fill="currentColor" className="text-gray-800" />
              </svg>
            </div>
            <h1 className="text-4xl font-bold text-white">
              Welcome Back
            </h1>
            <p className="mt-2 text-gray-400">Continue your journey to balance</p>
          </div>

          {/* Form Card - darker theme */}
          <div className="bg-white/5 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/10 p-8">
            {/* Toggle */}
            <div className="flex justify-center mb-6">
              <div className="inline-flex rounded-full bg-gray-800/50 border border-gray-700 p-1">
                <button
                  className="px-4 py-2 rounded-full bg-white text-gray-900 shadow-sm font-medium"
                >
                  Sign In
                </button>
                
                  href="/register"
                  className="px-4 py-2 rounded-full text-gray-300 hover:text-white transition-colors"
                >
                  Sign Up
                </a>
              </div>
            </div>

            {/* Google Sign In */}
            <button
              onClick={handleGoogleLogin}
              className="w-full flex items-center justify-center gap-3 bg-white text-gray-900 rounded-2xl px-4 py-3 font-medium hover:bg-gray-100 transition-all transform hover:scale-[1.02] shadow-lg"
            >
              <Chrome className="w-5 h-5" />
              Continue with Google
            </button>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-700" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-3 bg-gray-900/50 text-gray-400">or</span>
              </div>
            </div>

            {/* Magic Link Form */}
            <form onSubmit={handleMagicLink} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-gray-500 focus:bg-gray-800/70 transition-all"
                  placeholder="you@example.com"
                  required
                  disabled={isLoading}
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-gray-700 to-gray-800 text-white rounded-xl px-4 py-3 font-medium hover:from-gray-600 hover:to-gray-700 transition-all transform hover:scale-[1.02] shadow-lg disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Mail className="w-4 h-4" />
                    Send Magic Link
                  </>
                )}
              </button>
            </form>

            {/* Message */}
            {message && (
              <div className={`mt-4 p-3 rounded-lg text-center text-sm ${
                message.includes('Check') 
                  ? 'bg-green-500/10 text-green-400 border border-green-500/20' 
                  : 'bg-red-500/10 text-red-400 border border-red-500/20'
              }`}>
                {message}
              </div>
            )}

            {/* Footer */}
            <div className="mt-6 text-center">
              <a 
                href="/yin" 
                className="text-gray-500 hover:text-gray-300 text-xs transition-colors inline-flex items-center gap-1"
              >
                Skip to explore
                <ArrowRight className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}