/**
 * Core domain types for Chi Portal
 * These types define the shape of our data across the application
 */

// User & Authentication
export interface User {
  id: string
  email: string
  username?: string
  displayName?: string
  avatarUrl?: string
  role: UserRole
  tier: UserTier
  preferences: UserPreferences
  createdAt: Date
  updatedAt: Date
  lastLoginAt?: Date
  emailVerifiedAt?: Date
}

export enum UserRole {
  USER = 'USER',
  MODERATOR = 'MODERATOR',
  ADMIN = 'ADMIN',
}

export enum UserTier {
  FREE = 'FREE',
  PREMIUM = 'PREMIUM',
  LIFETIME = 'LIFETIME',
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system'
  emailNotifications: boolean
  dashboardLayout?: DashboardLayout
  onboardingCompleted: boolean
  extra?: Record<string, unknown> // JSONB field for flexibility
}

export interface DashboardLayout {
  widgets: WidgetConfig[]
  gridCols: number
  gridGap: number
}

export interface WidgetConfig {
  id: string
  type: WidgetType
  position: { x: number; y: number; w: number; h: number }
  settings?: Record<string, unknown>
  visible: boolean
}

export enum WidgetType {
  HABIT_TRACKER = 'HABIT_TRACKER',
  STREAK_COUNTER = 'STREAK_COUNTER',
  PROGRESS_CHART = 'PROGRESS_CHART',
  JOURNAL_QUICK_ADD = 'JOURNAL_QUICK_ADD',
  REALM_PROGRESS = 'REALM_PROGRESS',
  AI_INSIGHTS = 'AI_INSIGHTS',
  COMMUNITY_FEED = 'COMMUNITY_FEED',
  UPCOMING_EVENTS = 'UPCOMING_EVENTS',
}

// Habits & Progress
export interface Habit {
  id: string
  userId: string
  name: string
  description?: string
  realm: Realm
  frequency: HabitFrequency
  targetCount: number
  currentStreak: number
  longestStreak: number
  totalCompletions: number
  isActive: boolean
  color?: string
  icon?: string
  createdAt: Date
  updatedAt: Date
}

export enum Realm {
  YIN = 'YIN',
  YANG = 'YANG',
  BALANCE = 'BALANCE',
}

export enum HabitFrequency {
  DAILY = 'DAILY',
  WEEKLY = 'WEEKLY',
  MONTHLY = 'MONTHLY',
}

export interface HabitLog {
  id: string
  habitId: string
  userId: string
  completedAt: Date
  value?: number
  note?: string
}

// Journal
export interface JournalEntry {
  id: string
  userId: string
  title?: string
  content: string
  realm?: Realm
  mood?: number // 1-10 scale
  tags: string[]
  aiThemes?: string[] // AI-analyzed themes
  isPrivate: boolean
  meta?: JournalMeta // JSONB for flexibility
  createdAt: Date
  updatedAt: Date
}

export interface JournalMeta {
  weather?: string
  location?: string
  promptUsed?: string
  aiInsights?: string
  linkedHabits?: string[]
  [key: string]: unknown
}

// Content & Lessons
export interface Chapter {
  id: string
  realm: Realm
  slug: string
  title: string
  description: string
  order: number
  requiredProgress?: number
  requiredChapters?: string[]
  estimatedMinutes: number
  isPremium: boolean
  publishedAt?: Date
  content?: string // MDX content if stored in DB
}

export interface UserProgress {
  id: string
  userId: string
  chapterId: string
  completedAt?: Date
  progressPercent: number
  lastAccessedAt: Date
  notes?: string
}

// Assessments
export interface Assessment {
  id: string
  realm: Realm
  slug: string
  title: string
  description: string
  questions: AssessmentQuestion[]
  scoringMethod: ScoringMethod
  isPremium: boolean
  createdAt: Date
}

export interface AssessmentQuestion {
  id: string
  text: string
  type: 'single' | 'multiple' | 'scale' | 'text'
  options?: string[]
  minValue?: number
  maxValue?: number
  required: boolean
}

export enum ScoringMethod {
  SUM = 'SUM',
  AVERAGE = 'AVERAGE',
  WEIGHTED = 'WEIGHTED',
  CUSTOM = 'CUSTOM',
}

export interface AssessmentResponse {
  id: string
  userId: string
  assessmentId: string
  answers: Record<string, unknown> // JSONB for flexibility
  score?: number
  insights?: string
  completedAt: Date
}

// Gamification
export interface Achievement {
  id: string
  slug: string
  name: string
  description: string
  category: AchievementCategory
  points: number
  tier: AchievementTier
  iconUrl?: string
  requirement: AchievementRequirement
}

export enum AchievementCategory {
  HABIT = 'HABIT',
  STREAK = 'STREAK',
  JOURNAL = 'JOURNAL',
  LEARNING = 'LEARNING',
  COMMUNITY = 'COMMUNITY',
  SPECIAL = 'SPECIAL',
}

export enum AchievementTier {
  BRONZE = 'BRONZE',
  SILVER = 'SILVER',
  GOLD = 'GOLD',
  PLATINUM = 'PLATINUM',
}

export interface AchievementRequirement {
  type: string
  target: number
  metadata?: Record<string, unknown>
}

export interface UserAchievement {
  id: string
  userId: string
  achievementId: string
  unlockedAt: Date
  progress: number
  notified: boolean
}

// Community
export interface CommunityPost {
  id: string
  userId: string
  realm?: Realm
  title: string
  content: string
  tags: string[]
  upvotes: number
  commentCount: number
  isPinned: boolean
  isFeatured: boolean
  createdAt: Date
  updatedAt: Date
}

export interface Challenge {
  id: string
  realm: Realm
  title: string
  description: string
  startDate: Date
  endDate: Date
  requirements: ChallengeRequirement[]
  rewards: ChallengeReward[]
  participantCount: number
  isActive: boolean
}

export interface ChallengeRequirement {
  type: string
  description: string
  target: number
}

export interface ChallengeReward {
  type: 'achievement' | 'points' | 'badge' | 'premium_days'
  value: string | number
}

// Subscriptions
export interface Subscription {
  id: string
  userId: string
  tier: UserTier
  status: SubscriptionStatus
  stripeCustomerId?: string
  stripeSubscriptionId?: string
  currentPeriodStart: Date
  currentPeriodEnd: Date
  cancelAtPeriodEnd: boolean
  createdAt: Date
  updatedAt: Date
}

export enum SubscriptionStatus {
  ACTIVE = 'ACTIVE',
  PAST_DUE = 'PAST_DUE',
  CANCELED = 'CANCELED',
  INCOMPLETE = 'INCOMPLETE',
  TRIALING = 'TRIALING',
}