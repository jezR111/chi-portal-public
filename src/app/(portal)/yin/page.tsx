'use client'

import ChapterSystem from '@/features/yin/learning/ChapterSystem'
import { YinChapter, YinProgress } from '@/features/yin/types/yin.types'
import { Realm } from '@/types/domain'
import { useState } from 'react'

// Mock data for demonstration
const mockChapters: YinChapter[] = [
  {
    id: '1',
    slug: 'the-self',
    title: 'The Self',
    description: 'Understanding your inner landscape and discovering who you truly are beneath the layers of conditioning.',
    order: 1,
    realm: Realm.YIN,
    estimatedHours: 3,
    totalLessons: 5,
    isPremium: false,
    publishedAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '2',
    slug: 'energy-bodies',
    title: 'Energy Bodies',
    description: 'Exploring the subtle energy systems that influence your thoughts, emotions, and physical well-being.',
    order: 2,
    realm: Realm.YIN,
    estimatedHours: 4,
    totalLessons: 6,
    isPremium: false,
    publishedAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '3',
    slug: 'inward-journey',
    title: 'The Inward Journey',
    description: 'Navigating the depths of consciousness through meditation, introspection, and shadow work.',
    order: 3,
    realm: Realm.YIN,
    estimatedHours: 5,
    prerequisiteChapters: ['1'],
    totalLessons: 7,
    isPremium: false,
    publishedAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '4',
    slug: 'relating-to-others',
    title: 'Relating to Others',
    description: 'Understanding how your inner world shapes your relationships and learning conscious communication.',
    order: 4,
    realm: Realm.YIN,
    estimatedHours: 4,
    prerequisiteChapters: ['1', '3'],
    totalLessons: 6,
    isPremium: true,
    publishedAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '5',
    slug: 'integration',
    title: 'Integration & Embodiment',
    description: 'Bringing your inner discoveries into daily life through practical exercises and rituals.',
    order: 5,
    realm: Realm.YIN,
    estimatedHours: 3,
    prerequisiteChapters: ['1', '2', '3'],
    totalLessons: 5,
    isPremium: true,
    publishedAt: new Date(),
    updatedAt: new Date()
  }
]

const mockProgress: YinProgress[] = [
  {
    userId: 'user1',
    chapterId: '1',
    progressPercent: 100,
    completedLessons: ['1', '2', '3', '4', '5'],
    startedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    completedAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000),
    lastAccessedAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000),
    timeSpent: 10800
  },
  {
    userId: 'user1',
    chapterId: '2',
    progressPercent: 100,
    completedLessons: ['1', '2', '3', '4', '5', '6'],
    startedAt: new Date(Date.now() - 24 * 24 * 60 * 60 * 1000),
    completedAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
    lastAccessedAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
    timeSpent: 14400
  },
  {
    userId: 'user1',
    chapterId: '3',
    progressPercent: 45,
    completedLessons: ['1', '2', '3'],
    currentLesson: '4',
    startedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
    lastAccessedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    timeSpent: 7200
  }
]

export default function YinRealmPage() {
  const [userProgress, setUserProgress] = useState<YinProgress[]>(mockProgress)
  const [isPremium] = useState(false) // You can toggle this to test premium features

  const handleProgressUpdate = (progress: YinProgress) => {
    setUserProgress(prev => {
      const existing = prev.findIndex(p => p.chapterId === progress.chapterId)
      if (existing >= 0) {
        const updated = [...prev]
        updated[existing] = progress
        return updated
      }
      return [...prev, progress]
    })
    
    console.log('Progress updated:', progress)
  }

  const handleChapterComplete = (chapterId: string) => {
    console.log('Chapter completed:', chapterId)
    // Here you would trigger achievements, notifications, etc.
  }

  return (
    <ChapterSystem
      userId="user1"
      chapters={mockChapters}
      userProgress={userProgress}
      currentChapterId="3" // Start with chapter 3 (The Inward Journey)
      currentLessonId="4"
      onProgressUpdate={handleProgressUpdate}
      onChapterComplete={handleChapterComplete}
      isPremium={isPremium}
    />
  )
}
