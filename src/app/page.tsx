// src/app/page.tsx
import { ArrowRight, Heart, Moon, Sparkles, Sun, Zap } from 'lucide-react'
import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="relative flex min-h-screen flex-col">
      {/* Navigation */}
      <nav className="sticky top-0 z-40 w-full border-b border-white/10 bg-white/50 backdrop-blur-xl dark:bg-gray-950/50">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-purple-600 text-white shadow-lg shadow-purple-500/25">
              <Sparkles className="h-6 w-6" />
            </div>
            <span className="font-display text-xl font-bold gradient-text">Chi Portal</span>
          </div>
          
          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className="px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:text-primary-600 dark:text-gray-300 dark:hover:text-primary-400"
            >
              Sign In
            </Link>
            <Link
              href="/register"
              className="btn-premium flex items-center gap-2 px-4 py-2 text-sm"
            >
              Get Started
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-1">
        <section className="relative overflow-hidden px-4 py-24 sm:px-6 lg:px-8">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center">
              {/* Badge */}
              <div className="mb-8 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-primary-500/10 to-purple-500/10 px-4 py-2 text-sm font-medium text-primary-700 dark:text-primary-300">
                <Sparkles className="h-4 w-4" />
                Transform Your Inner & Outer World
              </div>

              {/* Heading */}
              <h1 className="mb-6 text-5xl font-display font-bold tracking-tight sm:text-6xl lg:text-7xl">
                <span className="gradient-text">Harmonize Your</span>
                <br />
                <span className="relative">
                  <span className="gradient-text-yin">Yin</span>
                  <Moon className="absolute -right-8 top-0 h-8 w-8 text-yin-500 animate-float" />
                </span>
                {' & '}
                <span className="relative">
                  <span className="gradient-text-yang">Yang</span>
                  <Sun className="absolute -right-8 top-0 h-8 w-8 text-yang-500 animate-float" style={{ animationDelay: '3s' }} />
                </span>
              </h1>

              {/* Description */}
              <p className="mx-auto mb-10 max-w-2xl text-lg text-gray-600 dark:text-gray-300">
                Embark on a transformative journey that balances your inner self-development 
                with physical vitality. Unlock your full potential through guided practices, 
                AI-powered insights, and a supportive community.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Link
                  href="/register"
                  className="btn-premium flex items-center gap-2 px-8 py-4 text-base"
                >
                  Start Your Journey
                  <ArrowRight className="h-5 w-5" />
                </Link>
                <Link
                  href="/demo"
                  className="btn-glass flex items-center gap-2 px-8 py-4 text-base text-gray-700 dark:text-gray-200"
                >
                  Watch Demo
                </Link>
              </div>
            </div>

            {/* Features Grid */}
            <div className="mt-24 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {/* Yin Feature */}
              <div className="widget-container group relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-yin-500/10 to-yin-600/10 opacity-0 transition-opacity group-hover:opacity-100" />
                <Moon className="mb-4 h-10 w-10 text-yin-500" />
                <h3 className="mb-2 text-xl font-display font-semibold">Way of the Self (Yin)</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Journey inward through meditation, journaling, and self-reflection to unlock your true potential.
                </p>
              </div>

              {/* Yang Feature */}
              <div className="widget-container group relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-yang-500/10 to-yang-600/10 opacity-0 transition-opacity group-hover:opacity-100" />
                <Sun className="mb-4 h-10 w-10 text-yang-500" />
                <h3 className="mb-2 text-xl font-display font-semibold">Vitality (Yang)</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Optimize your physical health through training plans, nutrition tracking, and recovery protocols.
                </p>
              </div>

              {/* Balance Feature */}
              <div className="widget-container group relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 to-purple-600/10 opacity-0 transition-opacity group-hover:opacity-100" />
                <Zap className="mb-4 h-10 w-10 text-primary-500" />
                <h3 className="mb-2 text-xl font-display font-semibold">Perfect Balance</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Achieve harmony between mind and body with AI-powered insights and personalized guidance.
                </p>
              </div>

              {/* Community Feature */}
              <div className="widget-container group relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-600/10 opacity-0 transition-opacity group-hover:opacity-100" />
                <Heart className="mb-4 h-10 w-10 text-purple-500" />
                <h3 className="mb-2 text-xl font-display font-semibold">Supportive Community</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Connect with like-minded individuals on similar journeys and grow together.
                </p>
              </div>

              {/* AI Feature */}
              <div className="widget-container group relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-cyan-600/10 opacity-0 transition-opacity group-hover:opacity-100" />
                <Sparkles className="mb-4 h-10 w-10 text-blue-500" />
                <h3 className="mb-2 text-xl font-display font-semibold">AI Light Guide</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Get personalized insights and guidance from our AI-powered spiritual mentor.
                </p>
              </div>

              {/* Gamification Feature */}
              <div className="widget-container group relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-emerald-600/10 opacity-0 transition-opacity group-hover:opacity-100" />
                <Zap className="mb-4 h-10 w-10 text-green-500" />
                <h3 className="mb-2 text-xl font-display font-semibold">Gamified Progress</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Track habits, build streaks, and unlock achievements as you transform.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-white/50 backdrop-blur-xl dark:bg-gray-950/50">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary-500" />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                © 2024 Chi Portal. Transform within.
              </span>
            </div>
            <div className="flex gap-6 text-sm">
              <Link href="/privacy" className="text-gray-600 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400">
                Privacy
              </Link>
              <Link href="/terms" className="text-gray-600 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400">
                Terms
              </Link>
              <Link href="/contact" className="text-gray-600 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400">
                Contact
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}