// src/app/(portal)/dashboard/page.tsx
'use client'

import {
  BookOpen,
  Calendar,
  Moon,
  Sparkles,
  Sun,
  Target,
  TrendingUp,
  Users,
} from 'lucide-react'

export default function DashboardPage() {
  return (
    <main className="mx-auto max-w-7xl p-4 sm:p-6 lg:p-8 space-y-8">
      {/* Header */}
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold gradient-text">
            Welcome back, Seeker
          </h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Your journey continues. <span className="font-medium">Day 42</span> of transformation.
          </p>
        </div>

        <div className="hidden sm:flex items-center gap-3">
          <div className="rounded-xl px-4 py-2 shadow-lg"
               style={{ backgroundImage: 'linear-gradient(90deg, rgba(132,61,255,.10), rgba(124,58,237,.10))' }}>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary-600" />
              <span className="text-sm font-semibold text-primary-700 dark:text-primary-300">
                12 Day Streak
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Stats */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Current Streak"
          value="12 days"
          icon={<Sparkles className="h-6 w-6 text-primary-600" />}
          barClass="progress-gradient"
          barWidth="75%"
        />
        <StatCard
          title="Habits Completed"
          value={<span className="gradient-text-yin">156</span>}
          icon={<Target className="h-6 w-6 text-yin-600 dark:text-yin-400" />}
          barClass="progress-yin"
          barWidth="90%"
        />
        <StatCard
          title="Journal Entries"
          value={<span className="gradient-text-yang">42</span>}
          icon={<BookOpen className="h-6 w-6 text-yang-600 dark:text-yang-400" />}
          barClass="progress-yang"
          barWidth="60%"
        />
        <StatCard
          title="Community Rank"
          value={<span className="text-purple-600 dark:text-purple-400">#127</span>}
          icon={<Users className="h-6 w-6 text-purple-600 dark:text-purple-400" />}
          barClass="" // plain bar
          barWidth="45%"
          plainBar
        />
      </section>

      {/* Main grid */}
      <section className="grid gap-6 lg:grid-cols-3">
        {/* Left (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Today’s Focus */}
          <div className="widget-container">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-display font-semibold">Today&apos;s Focus</h2>
              <Calendar className="h-5 w-5 text-gray-400" />
            </div>

            <div className="space-y-4">
              {/* Morning Meditation */}
              <FocusItem
                badge={<Moon className="h-5 w-5 text-white" />}
                title="Morning Meditation"
                body="Start your day with 10 minutes of mindful breathing"
                button="Begin Session"
                bgFrom="var(--gradient-yin-start)"
                bgTo="var(--gradient-yin-end)"
              />

              {/* Physical Training */}
              <FocusItem
                badge={<Sun className="h-5 w-5 text-white" />}
                title="Upper Body Strength"
                body="45-minute workout focusing on push movements"
                button="View Workout"
                bgFrom="var(--gradient-yang-start)"
                bgTo="var(--gradient-yang-end)"
              />
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid gap-4 sm:grid-cols-2">
            <button className="widget-container flex items-center justify-center gap-3 py-8 transition hover:scale-105">
              <BookOpen className="h-8 w-8 text-primary-500" />
              <span className="font-semibold">Quick Journal Entry</span>
            </button>

            <button className="widget-container flex items-center justify-center gap-3 py-8 transition hover:scale-105">
              <Target className="h-8 w-8 text-purple-500" />
              <span className="font-semibold">Log Habit</span>
            </button>
          </div>
        </div>

        {/* Right sidebar */}
        <aside className="space-y-6">
          <div className="widget-container">
            <h2 className="mb-4 text-lg font-display font-semibold">Recent Achievements</h2>
            <div className="space-y-3">
              <Achievement color="linear-gradient(135deg, #f59e0b, #d97706)" title="Week Warrior" sub="7-day streak achieved" />
              <Achievement color="linear-gradient(135deg, #3b82f6, #06b6d4)" title="Mind Master" sub="30 meditation sessions" />
            </div>
          </div>

          <div className="widget-container">
            <h2 className="mb-4 text-lg font-display font-semibold">Community</h2>
            <div className="space-y-3">
              <FeedItem who="Sarah" what="completed Day 100! 🎉" when="2 hours ago" />
              <FeedItem who="Mike" what="shared a breakthrough moment" when="5 hours ago" />
            </div>
          </div>
        </aside>
      </section>
    </main>
  )
}

/* ---------------- helpers (same file, lightweight) ---------------- */

function StatCard({
  title,
  value,
  icon,
  barClass,
  barWidth,
  plainBar = false,
}: {
  title: string
  value: React.ReactNode
  icon: React.ReactNode
  barClass: string
  barWidth: string
  plainBar?: boolean
}) {
  return (
    <div className="widget-container group">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400">{title}</p>
          <p className="mt-1 text-2xl font-bold">{value}</p>
        </div>
        <div
          className="rounded-xl p-3"
          style={{ backgroundImage: 'linear-gradient(135deg, rgba(132,61,255,.15), rgba(168,85,247,.15))' }}
        >
          {icon}
        </div>
      </div>

      <div className="mt-3 h-1 w-full rounded-full bg-gray-200 dark:bg-gray-700">
        <div
          className={`h-1 rounded-full ${plainBar ? '' : barClass}`}
          style={{
            width: barWidth,
            background: plainBar ? 'linear-gradient(90deg, #a78bfa, #ec4899)' : undefined,
          }}
        />
      </div>
    </div>
  )
}

function FocusItem({
  badge,
  title,
  body,
  button,
  bgFrom,
  bgTo,
}: {
  badge: React.ReactNode
  title: string
  body: string
  button: string
  bgFrom: string
  bgTo: string
}) {
  return (
    <div
      className="flex items-start gap-4 rounded-xl border p-4"
      style={{
        backgroundImage: `linear-gradient(90deg, color-mix(in oklab, ${bgFrom} 15%, transparent), color-mix(in oklab, ${bgTo} 15%, transparent))`,
        borderColor: 'color-mix(in oklab, var(--ring) 20%, transparent)',
      }}
    >
      <div
        className="rounded-lg p-2 shadow-md"
        style={{ backgroundImage: `linear-gradient(135deg, ${bgFrom}, ${bgTo})` }}
      >
        {badge}
      </div>
      <div className="flex-1">
        <h3 className="font-semibold">{title}</h3>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">{body}</p>
        <button className="mt-3 btn-premium px-3 py-1.5 text-xs">{button}</button>
      </div>
    </div>
  )
}

function Achievement({ color, title, sub }: { color: string; title: string; sub: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="h-10 w-10 rounded-full shadow-md" style={{ backgroundImage: color }} />
      <div>
        <p className="text-sm font-semibold">{title}</p>
        <p className="text-xs text-gray-600 dark:text-gray-400">{sub}</p>
      </div>
    </div>
  )
}

function FeedItem({ who, what, when }: { who: string; what: string; when: string }) {
  return (
    <div className="rounded-lg bg-gray-50 p-3 dark:bg-gray-800/50">
      <p className="text-sm">
        <span className="font-semibold">{who}</span> {what}
      </p>
      <p className="mt-1 text-xs text-gray-500">{when}</p>
    </div>
  )
}
