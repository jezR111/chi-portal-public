/**
 * Yin Realm Types - Way of the Self
 * Chapter-based learning system with Notion integration
 */

import { Realm, User } from '@/types/domain'

// Core Chapter Types
export interface YinChapter {
  id: string
  notionId?: string // Notion page ID for sync
  slug: string
  title: string
  description: string
  order: number
  realm: Realm.YIN
  estimatedHours: number
  prerequisiteChapters?: string[]
  coverImageUrl?: string
  icon?: string
  totalLessons: number
  isPremium: boolean
  publishedAt?: Date
  updatedAt: Date
}

export interface YinLesson {
  id: string
  chapterId: string
  notionId?: string
  title: string
  slug: string
  order: number
  duration: number // in minutes
  content: string // MDX content
  objectives: string[]
  type: LessonType
  videoUrl?: string
  audioUrl?: string
  exercises?: Exercise[]
  knowledgeCheck?: KnowledgeCheck
  resources?: LessonResource[]
}

export enum LessonType {
  CONCEPT = 'CONCEPT',
  PRACTICE = 'PRACTICE',
  MEDITATION = 'MEDITATION',
  REFLECTION = 'REFLECTION',
  INTEGRATION = 'INTEGRATION'
}

export interface Exercise {
  id: string
  type: 'journal' | 'meditation' | 'activity' | 'reflection'
  title: string
  instructions: string
  duration?: number
  isRequired: boolean
}

export interface KnowledgeCheck {
  id: string
  questions: KnowledgeQuestion[]
  passingScore: number
}

export interface KnowledgeQuestion {
  id: string
  text: string
  type: 'single' | 'multiple' | 'reflection'
  options?: QuestionOption[]
  correctAnswers?: string[]
  explanation?: string
}

export interface QuestionOption {
  id: string
  text: string
  feedback?: string
}

export interface LessonResource {
  id: string
  title: string
  type: 'pdf' | 'link' | 'video' | 'audio' | 'image'
  url: string
  description?: string
}

// Progress Tracking
export interface YinProgress {
  userId: string
  chapterId: string
  lessonId?: string
  progressPercent: number
  completedLessons: string[]
  currentLesson?: string
  startedAt: Date
  completedAt?: Date
  lastAccessedAt: Date
  timeSpent: number // in seconds
  notes?: string
  bookmarks?: Bookmark[]
}

export interface Bookmark {
  lessonId: string
  position: number
  note?: string
  createdAt: Date
}

// Learning Modes
export enum LearningMode {
  READ = 'READ',
  LISTEN = 'LISTEN',
  WATCH = 'WATCH'
}

export interface LearningPreferences {
  preferredMode: LearningMode
  playbackSpeed: number
  autoplay: boolean
  fontSize: 'small' | 'medium' | 'large'
  theme: 'light' | 'dark' | 'sepia'
}

// Assessment & Growth
export interface InnerCompassAssessment {
  id: string
  userId: string
  completedAt: Date
  focusAreas: GrowthArea[]
  strengths: GrowthArea[]
  scores: Record<GrowthArea, number>
  recommendedPath: string[]
}

export enum GrowthArea {
  SELF_WORTH = 'self-worth',
  BOUNDARIES = 'boundaries',
  EMOTIONAL_MASTERY = 'emotional-mastery',
  CONNECTION = 'connection',
  SHADOW_WORK = 'shadow-work',
  PURPOSE = 'purpose'
}

// Growth Garden
export interface GrowthPlant {
  id: string
  userId: string
  type: GrowthArea
  growth: number // 0-100
  plantedDate: Date
  lastWatered: Date
  position: { x: number; y: number }
}

// Mountain Climb Visualization
export interface MountainProgress {
  chapterId: string
  currentAltitude: number // 0-8848 (Everest height)
  camps: CampProgress[]
  zone: 'basecamp' | 'foothills' | 'ascent' | 'summit'
  weatherCondition: 'sunny' | 'cloudy' | 'stormy' | 'clear'
}

export interface CampProgress {
  lessonId: string
  altitude: number
  completed: boolean
  completedAt?: Date
}

// Hermit AI Guide
export interface HermitMessage {
  id: string
  type: 'user' | 'hermit'
  content: string
  timestamp: Date
  followUp?: {
    type: 'meditation' | 'journal' | 'reflection'
    data: any
  }
  isQuote?: boolean
}

export interface HermitContext {
  userStage: 'beginning' | 'exploring' | 'deepening' | 'integrating'
  currentChapter?: string
  recentTopics: string[]
  emotionalState?: string
}

// Habit Tracking (Yin-specific)
export interface YinHabit {
  id: string
  userId: string
  name: string
  type: YinHabitType
  icon: string
  color: string
  frequency: 'daily' | 'weekly' | 'monthly'
  currentStreak: number
  longestStreak: number
  completions: HabitCompletion[]
  isActive: boolean
  createdAt: Date
}

export enum YinHabitType {
  MEDITATION = 'meditation',
  JOURNALING = 'journaling',
  READING = 'reading',
  GRATITUDE = 'gratitude',
  MINDFULNESS = 'mindfulness',
  SHADOW_WORK = 'shadow-work',
  SELF_CARE = 'self-care'
}

export interface HabitCompletion {
  date: Date
  state: 'completed' | 'partial' | 'missed'
  note?: string
}

// Achievements
export interface YinAchievement {
  id: string
  slug: string
  name: string
  description: string
  category: 'learning' | 'practice' | 'consistency' | 'mastery'
  tier: 'bronze' | 'silver' | 'gold' | 'platinum'
  iconUrl?: string
  requirement: {
    type: string
    target: number
    metadata?: Record<string, any>
  }
  unlockedAt?: Date
  progress: number
}

// Notion Sync Types
export interface NotionSyncStatus {
  lastSyncAt: Date
  status: 'synced' | 'syncing' | 'error' | 'pending'
  chaptersUpdated: number
  lessonsUpdated: number
  error?: string
}

export interface NotionContent {
  pageId: string
  title: string
  content: string // MDX format
  properties: Record<string, any>
  lastEditedTime: Date
}

// View States
export interface YinDashboardState {
  currentView: YinView
  selectedChapter?: YinChapter
  selectedLesson?: YinLesson
  showHermit: boolean
  showOnboarding: boolean
  sidebarOpen: boolean
}

export enum YinView {
  DASHBOARD = 'dashboard',
  CHAPTERS = 'chapters',
  MOUNTAIN = 'mountain',
  GARDEN = 'garden',
  HABITS = 'habits',
  ANALYTICS = 'analytics',
  COMMUNITY = 'community'
}

// User Data for Yin Realm
export interface YinUserData {
  user: User
  assessment?: InnerCompassAssessment
  progress: YinProgress[]
  habits: YinHabit[]
  plants: GrowthPlant[]
  achievements: YinAchievement[]
  preferences: LearningPreferences
  currentChapter?: string
  currentLesson?: string
  overallProgress: number
  totalMeditations: number
  journalEntries: number
  communityKarma: number
  streak: number
}
