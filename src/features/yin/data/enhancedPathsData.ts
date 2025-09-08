// src/features/yin/data/enhancedPathsData.ts
import {
  Activity,
  Brain,
  Compass,
  Crown,
  Heart,
  Infinity,
  Sparkles,
  Zap
} from 'lucide-react';

export interface PathPrerequisite {
  pathId: string;
  minProgress?: number; // Minimum progress % required in prerequisite path
  minXP?: number; // Minimum XP required
}

export interface PathData {
  id: string;
  notionId: string;
  title: string;
  subtitle: string;
  description: string;
  longDescription?: string;
  icon: any;
  gradient: string;
  glowColor: string;
  shadowColor: string;
  accentColor: string;
  
  // Progression system
  tier: 'foundation' | 'intermediate' | 'advanced' | 'mastery';
  prerequisites?: PathPrerequisite[];
  requiredXP: number; // XP needed to unlock
  totalXP: number; // Total XP available in this path
  
  // Visual states
  locked?: boolean;
  featured?: boolean;
  new?: boolean;

  // Stats
  estimatedHours: number;
  totalChapters: number;
  totalLessons: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  
  // Benefits/rewards for completing
  benefits: string[];
  unlocks?: string[]; // What paths this unlocks

// Add this new property
  allowNonSequentialUnlock?: boolean; // Allow any chapter to be unlocked with XP
}

export const pathsData: PathData[] = [
  // FOUNDATION TIER - Always Available
  {
    id: 'the-self',
    notionId: 'af01829f-b333-4d99-9dfc-e571195357c1',
    title: 'The Self',
    subtitle: 'Foundation of Being',
    description: 'Discover your authentic self and build a strong foundation of self-awareness',
    longDescription: 'Begin your journey by understanding who you truly are beneath the layers of conditioning. This foundational path explores self-awareness, self-compassion, and the core aspects of your being.',
    icon: Brain,
    gradient: 'from-purple-600 via-purple-500 to-indigo-600',
    glowColor: 'purple',
    shadowColor: 'shadow-purple-500/50',
    accentColor: 'purple',
    tier: 'foundation',
    requiredXP: 0, // Always unlocked
    totalXP: 500,
    locked: false,
    featured: true,
    estimatedHours: 12,
    totalChapters: 8,
    totalLessons: 42,
    difficulty: 'beginner',
    benefits: [
      'Develop deep self-awareness',
      'Build emotional intelligence',
      'Strengthen self-compassion'
    ],
    unlocks: ['energy-bodies', 'self-relating']
  },
  {
    id: 'inward-journey',
    notionId: '12c91f1b-d297-40d4-ada7-a57a01a97c12',
    title: 'The Inward Journey',
    subtitle: 'Path of Inner Exploration',
    description: 'Navigate your inner landscape with wisdom and courage',
    longDescription: 'Learn the art of introspection and inner navigation. Discover meditation practices, contemplative techniques, and ways to explore your consciousness.',
    icon: Compass,
    gradient: 'from-indigo-600 via-blue-500 to-purple-600',
    glowColor: 'indigo',
    shadowColor: 'shadow-indigo-500/50',
    accentColor: 'indigo',
    tier: 'foundation',
    requiredXP: 0, // Always unlocked
    totalXP: 450,
    locked: false,
    estimatedHours: 10,
    totalChapters: 7,
    totalLessons: 38,
    difficulty: 'beginner',
    benefits: [
      'Master meditation techniques',
      'Develop inner guidance',
      'Access deeper wisdom'
    ],
    unlocks: ['energy-bodies', 'life'],
    allowNonSequentialUnlock: true, // Add this

  },
  
  // INTERMEDIATE TIER - Requires some progress
  {
    id: 'energy-bodies',
    notionId: 'e8d3f4a2-9b5c-4e6d-8f7a-2c3d4e5f6a7b',
    title: 'Energy Bodies',
    subtitle: 'Subtle Energy Systems',
    description: 'Explore the subtle dimensions of your energetic being',
    longDescription: 'Discover the chakras, meridians, and energy fields that comprise your subtle body. Learn to sense, cleanse, and balance your energy.',
    icon: Zap,
    gradient: 'from-yellow-500 via-amber-500 to-orange-500',
    glowColor: 'amber',
    shadowColor: 'shadow-amber-500/50',
    accentColor: 'amber',
    tier: 'intermediate',
    prerequisites: [
      { pathId: 'the-self', minProgress: 30 },
      { pathId: 'inward-journey', minProgress: 20 }
    ],
    requiredXP: 200,
    totalXP: 600,
    locked: true,
    new: true,
    estimatedHours: 15,
    totalChapters: 9,
    totalLessons: 48,
    difficulty: 'intermediate',
    benefits: [
      'Understand energy anatomy',
      'Balance chakras',
      'Increase vitality'
    ],
    unlocks: ['self-mastery']
  },
  {
    id: 'self-relating',
    notionId: 'f3a4b5c6-d7e8-9f0a-1b2c-3d4e5f6a7b8c',
    title: 'Self Relating to Others',
    subtitle: 'Conscious Relationships',
    description: 'Transform how you connect with others and the world',
    longDescription: 'Explore the dance between self and other. Learn healthy boundaries, authentic communication, and conscious relating.',
    icon: Heart,
    gradient: 'from-pink-500 via-rose-500 to-red-500',
    glowColor: 'pink',
    shadowColor: 'shadow-pink-500/50',
    accentColor: 'pink',
    tier: 'intermediate',
    prerequisites: [
      { pathId: 'the-self', minProgress: 50 }
    ],
    requiredXP: 250,
    totalXP: 550,
    locked: true,
    estimatedHours: 14,
    totalChapters: 8,
    totalLessons: 45,
    difficulty: 'intermediate',
    benefits: [
      'Improve relationships',
      'Set healthy boundaries',
      'Enhance communication'
    ],
    unlocks: ['doing', 'life'],
    allowNonSequentialUnlock: true, // Add this

  },
  {
    id: 'doing',
    notionId: 'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d',
    title: 'Doing',
    subtitle: 'Conscious Action',
    description: 'Align your actions with your highest purpose',
    longDescription: 'Learn to act from a place of presence and purpose. Discover how to bring consciousness into daily activities and work.',
    icon: Activity,
    gradient: 'from-green-500 via-emerald-500 to-teal-500',
    glowColor: 'emerald',
    shadowColor: 'shadow-emerald-500/50',
    accentColor: 'emerald',
    tier: 'intermediate',
    prerequisites: [
      { pathId: 'self-relating', minProgress: 40 }
    ],
    requiredXP: 300,
    totalXP: 500,
    locked: true,
    estimatedHours: 12,
    totalChapters: 7,
    totalLessons: 40,
    difficulty: 'intermediate',
    benefits: [
      'Increase productivity',
      'Find flow states',
      'Align work with purpose'
    ],
    unlocks: ['self-mastery']
  },
  
  // ADVANCED TIER
  {
    id: 'life',
    notionId: 'b2c3d4e5-f6a7-8b9c-0d1e-2f3a4b5c6d7e',
    title: 'Life',
    subtitle: 'Living Fully',
    description: 'Embrace the fullness of human experience',
    longDescription: 'Integrate all aspects of your journey into a life fully lived. Learn to dance with joy and sorrow, success and failure.',
    icon: Sparkles,
    gradient: 'from-violet-500 via-purple-500 to-pink-500',
    glowColor: 'violet',
    shadowColor: 'shadow-violet-500/50',
    accentColor: 'violet',
    tier: 'advanced',
    prerequisites: [
      { pathId: 'inward-journey', minProgress: 60 },
      { pathId: 'self-relating', minProgress: 50 }
    ],
    requiredXP: 500,
    totalXP: 700,
    locked: true,
    estimatedHours: 18,
    totalChapters: 10,
    totalLessons: 52,
    difficulty: 'advanced',
    benefits: [
      'Live authentically',
      'Find life purpose',
      'Experience fulfillment'
    ],
    unlocks: ['metaphysics']
  },
  
  // MASTERY TIER
  {
    id: 'self-mastery',
    notionId: 'c3d4e5f6-a7b8-9c0d-1e2f-3a4b5c6d7e8f',
    title: 'Self Mastery',
    subtitle: 'The Art of Being',
    description: 'Master the art of conscious living and being',
    longDescription: 'The culmination of your inner work. Achieve mastery over your thoughts, emotions, and actions while maintaining presence and flow.',
    icon: Crown,
    gradient: 'from-amber-600 via-yellow-500 to-amber-400',
    glowColor: 'amber',
    shadowColor: 'shadow-yellow-500/50',
    accentColor: 'yellow',
    tier: 'mastery',
    prerequisites: [
      { pathId: 'energy-bodies', minProgress: 70 },
      { pathId: 'doing', minProgress: 60 }
    ],
    requiredXP: 800,
    totalXP: 1000,
    locked: true,
    estimatedHours: 24,
    totalChapters: 12,
    totalLessons: 64,
    difficulty: 'advanced',
    benefits: [
      'Achieve inner mastery',
      'Maintain equanimity',
      'Embody wisdom'
    ],
    unlocks: ['metaphysics']
  },
  {
    id: 'metaphysics',
    notionId: 'd4e5f6a7-b8c9-0d1e-2f3a-4b5c6d7e8f9a',
    title: 'Metaphysics',
    subtitle: 'Beyond the Physical',
    description: 'Explore the nature of reality and consciousness',
    longDescription: 'Journey into the deepest questions of existence. Explore consciousness, reality, time, and the nature of being itself.',
    icon: Infinity,
    gradient: 'from-indigo-600 via-purple-600 to-blue-600',
    glowColor: 'indigo',
    shadowColor: 'shadow-indigo-500/50',
    accentColor: 'indigo',
    tier: 'mastery',
    prerequisites: [
      { pathId: 'life', minProgress: 80 },
      { pathId: 'self-mastery', minProgress: 70 }
    ],
    requiredXP: 1000,
    totalXP: 1200,
    locked: true,
    estimatedHours: 30,
    totalChapters: 14,
    totalLessons: 72,
    difficulty: 'advanced',
    benefits: [
      'Understand reality deeply',
      'Experience unity consciousness',
      'Transcend limitations'
    ]
  }
];

// Helper functions
export const getUnlockedPaths = (userXP: number, userProgress: Record<string, number>): string[] => {
  return pathsData
    .filter(path => {
      // Check XP requirement
      if (path.requiredXP > userXP) return false;
      
      // Check prerequisites
      if (path.prerequisites) {
        return path.prerequisites.every(prereq => {
          const progress = userProgress[prereq.pathId] || 0;
          return progress >= (prereq.minProgress || 0);
        });
      }
      
      return true;
    })
    .map(path => path.id);
};

export const getPathsByTier = (tier: string) => {
  return pathsData.filter(path => path.tier === tier);
};

export const getNextUnlockablePaths = (userXP: number, userProgress: Record<string, number>) => {
  const unlocked = getUnlockedPaths(userXP, userProgress);
  return pathsData.filter(path => 
    !unlocked.includes(path.id) && 
    path.requiredXP <= userXP + 100 // Paths close to being unlocked
  );
};