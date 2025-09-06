// src/features/yin/data/chaptersData.ts

export interface Lesson {
  id: string;
  title: string;
  duration: number; // in minutes
  description: string;
  contentType: 'video' | 'audio' | 'text' | 'mixed';
  completed?: boolean;
  xpReward: number;
}

export interface Chapter {
  id: string;
  pathId: string;
  title: string;
  subtitle: string;
  description: string;
  lessons: Lesson[];
  requiredXP?: number; // XP needed to unlock this chapter
  totalDuration: number; // in minutes
  xpReward: number; // Total XP for completing chapter
}

export const chaptersData: Record<string, Chapter[]> = {
  'the-self': [
    {
      id: 'self-overview',
      pathId: 'the-self',
      title: 'Overview of The Self',
      subtitle: 'Foundation principles',
      description: 'Get a comprehensive understanding of the journey of self-discovery and where you are on your path.',
      totalDuration: 90,
      xpReward: 100,
      lessons: [
        {
          id: 'self-overview-1',
          title: 'Introduction to The Self',
          duration: 15,
          description: 'Understanding the foundation of your being',
          contentType: 'video',
          xpReward: 20
        },
        {
          id: 'self-overview-2',
          title: 'The Journey of Self-Discovery',
          duration: 20,
          description: 'Mapping your personal evolution',
          contentType: 'mixed',
          xpReward: 25
        },
        {
          id: 'self-overview-3',
          title: 'Core Aspects of Being',
          duration: 25,
          description: 'Exploring the fundamental elements',
          contentType: 'text',
          xpReward: 30
        },
        {
          id: 'self-overview-4',
          title: 'Integration Practice',
          duration: 30,
          description: 'Guided meditation and reflection',
          contentType: 'audio',
          xpReward: 25
        }
      ]
    },
    {
      id: 'self-stages',
      pathId: 'the-self',
      title: 'The Stages of Self',
      subtitle: 'Evolution and growth',
      description: 'Explore the different stages of self-evolution and identify where you currently are.',
      totalDuration: 120,
      xpReward: 150,
      requiredXP: 50,
      lessons: [
        {
          id: 'self-stages-1',
          title: 'The Sleeping Self',
          duration: 30,
          description: 'Understanding unconscious patterns',
          contentType: 'video',
          xpReward: 35
        },
        {
          id: 'self-stages-2',
          title: 'The Awakening Self',
          duration: 30,
          description: 'The process of becoming aware',
          contentType: 'mixed',
          xpReward: 40
        },
        {
          id: 'self-stages-3',
          title: 'The Integrated Self',
          duration: 30,
          description: 'Bringing all aspects together',
          contentType: 'video',
          xpReward: 40
        },
        {
          id: 'self-stages-4',
          title: 'The Transcendent Self',
          duration: 30,
          description: 'Moving beyond limitations',
          contentType: 'audio',
          xpReward: 35
        }
      ]
    },
    {
      id: 'self-types',
      pathId: 'the-self',
      title: 'The Types of Selves',
      subtitle: 'Different aspects explored',
      description: 'Discover the various aspects and types of self that exist within you.',
      totalDuration: 75,
      xpReward: 120,
      requiredXP: 100,
      lessons: [
        {
          id: 'self-types-1',
          title: 'The Social Self',
          duration: 25,
          description: 'How you present to the world',
          contentType: 'video',
          xpReward: 40
        },
        {
          id: 'self-types-2',
          title: 'The Private Self',
          duration: 25,
          description: 'Your inner world',
          contentType: 'text',
          xpReward: 40
        },
        {
          id: 'self-types-3',
          title: 'The Shadow Self',
          duration: 25,
          description: 'Hidden aspects and integration',
          contentType: 'mixed',
          xpReward: 40
        }
      ]
    },
    {
      id: 'self-identity',
      pathId: 'the-self',
      title: 'Self Image & Identity',
      subtitle: 'How you see yourself',
      description: 'Explore the construction of self-image and identity, and how to align them with your true self.',
      totalDuration: 90,
      xpReward: 130,
      requiredXP: 150,
      lessons: [
        {
          id: 'self-identity-1',
          title: 'Constructing Self-Image',
          duration: 30,
          description: 'How self-image forms',
          contentType: 'video',
          xpReward: 45
        },
        {
          id: 'self-identity-2',
          title: 'Identity vs Essence',
          duration: 30,
          description: 'Distinguishing between who you think you are and who you truly are',
          contentType: 'mixed',
          xpReward: 45
        },
        {
          id: 'self-identity-3',
          title: 'Reshaping Your Identity',
          duration: 30,
          description: 'Conscious identity evolution',
          contentType: 'audio',
          xpReward: 40
        }
      ]
    },
    {
      id: 'self-elements',
      pathId: 'the-self',
      title: 'Elements of The Self',
      subtitle: 'Core components',
      description: 'Understand the fundamental elements that comprise your sense of self.',
      totalDuration: 100,
      xpReward: 140,
      requiredXP: 200,
      lessons: [
        {
          id: 'self-elements-1',
          title: 'Mind, Body, Spirit',
          duration: 35,
          description: 'The trinity of being',
          contentType: 'video',
          xpReward: 50
        },
        {
          id: 'self-elements-2',
          title: 'Emotions and Feelings',
          duration: 30,
          description: 'The emotional landscape',
          contentType: 'mixed',
          xpReward: 45
        },
        {
          id: 'self-elements-3',
          title: 'Beliefs and Values',
          duration: 35,
          description: 'Your operating system',
          contentType: 'text',
          xpReward: 45
        }
      ]
    },
    {
      id: 'self-soul-ego',
      pathId: 'the-self',
      title: 'The Soul, The Self & The Ego',
      subtitle: 'Understanding the trinity',
      description: 'Explore the relationship between soul, self, and ego in your journey.',
      totalDuration: 110,
      xpReward: 160,
      requiredXP: 250,
      lessons: [
        {
          id: 'self-soul-1',
          title: 'Understanding the Soul',
          duration: 35,
          description: 'Your eternal essence',
          contentType: 'video',
          xpReward: 55
        },
        {
          id: 'self-soul-2',
          title: 'The Role of Ego',
          duration: 35,
          description: 'Friend or foe?',
          contentType: 'mixed',
          xpReward: 55
        },
        {
          id: 'self-soul-3',
          title: 'Balancing the Trinity',
          duration: 40,
          description: 'Creating harmony within',
          contentType: 'audio',
          xpReward: 50
        }
      ]
    },
    {
      id: 'self-journey',
      pathId: 'the-self',
      title: 'The Never Ending Journey of Self',
      subtitle: 'Continuous evolution',
      description: 'Understand the cyclical nature of self-evolution and growth.',
      totalDuration: 80,
      xpReward: 120,
      requiredXP: 300,
      lessons: [
        {
          id: 'self-journey-1',
          title: 'Cycles of Growth',
          duration: 25,
          description: 'The spiral path',
          contentType: 'video',
          xpReward: 40
        },
        {
          id: 'self-journey-2',
          title: 'Death and Rebirth',
          duration: 30,
          description: 'Transformation cycles',
          contentType: 'mixed',
          xpReward: 40
        },
        {
          id: 'self-journey-3',
          title: 'Embracing the Journey',
          duration: 25,
          description: 'Finding peace in process',
          contentType: 'audio',
          xpReward: 40
        }
      ]
    },
    {
      id: 'self-connection',
      pathId: 'the-self',
      title: 'Self Connection',
      subtitle: 'Deepening your relationship',
      description: 'Learn practices to deepen your connection with yourself.',
      totalDuration: 95,
      xpReward: 140,
      requiredXP: 350,
      lessons: [
        {
          id: 'self-connection-1',
          title: 'Inner Dialogue',
          duration: 30,
          description: 'Communicating with yourself',
          contentType: 'video',
          xpReward: 45
        },
        {
          id: 'self-connection-2',
          title: 'Self-Intimacy Practices',
          duration: 35,
          description: 'Building a loving relationship',
          contentType: 'mixed',
          xpReward: 50
        },
        {
          id: 'self-connection-3',
          title: 'Daily Connection Rituals',
          duration: 30,
          description: 'Maintaining the bond',
          contentType: 'audio',
          xpReward: 45
        }
      ]
    }
  ],

  'inward-journey': [
    {
      id: 'inward-growth',
      pathId: 'inward-journey',
      title: 'What is Self Work / Self Growth',
      subtitle: 'The path of transformation',
      description: 'Understanding the nature and purpose of inner work.',
      totalDuration: 75,
      xpReward: 100,
      lessons: [
        {
          id: 'inward-growth-1',
          title: 'Introduction to Self Work',
          duration: 25,
          description: 'Why we do the work',
          contentType: 'video',
          xpReward: 35
        },
        {
          id: 'inward-growth-2',
          title: 'The Growth Mindset',
          duration: 25,
          description: 'Cultivating openness to change',
          contentType: 'mixed',
          xpReward: 30
        },
        {
          id: 'inward-growth-3',
          title: 'Creating Your Practice',
          duration: 25,
          description: 'Building sustainable habits',
          contentType: 'text',
          xpReward: 35
        }
      ]
    },
    {
      id: 'inward-care',
      pathId: 'inward-journey',
      title: 'Self Care',
      subtitle: 'Nurturing your being',
      description: 'Learn to nurture and care for yourself with compassion.',
      totalDuration: 90,
      xpReward: 120,
      lessons: [
        {
          id: 'inward-care-1',
          title: 'Understanding Self-Care',
          duration: 30,
          description: 'Beyond bubble baths',
          contentType: 'video',
          xpReward: 40
        },
        {
          id: 'inward-care-2',
          title: 'Physical Self-Care',
          duration: 30,
          description: 'Caring for your body',
          contentType: 'mixed',
          xpReward: 40
        },
        {
          id: 'inward-care-3',
          title: 'Emotional Self-Care',
          duration: 30,
          description: 'Tending to your heart',
          contentType: 'audio',
          xpReward: 40
        }
      ]
    },
    {
      id: 'inward-wounding',
      pathId: 'inward-journey',
      title: 'Wounding',
      subtitle: 'Healing and integration',
      description: 'Recognize and heal emotional wounds with gentleness.',
      totalDuration: 120,
      xpReward: 150,
      requiredXP: 50,
      lessons: [
        {
          id: 'inward-wound-1',
          title: 'Recognizing Your Wounds',
          duration: 40,
          description: 'Identifying patterns',
          contentType: 'video',
          xpReward: 50
        },
        {
          id: 'inward-wound-2',
          title: 'The Healing Process',
          duration: 40,
          description: 'Steps to integration',
          contentType: 'mixed',
          xpReward: 50
        },
        {
          id: 'inward-wound-3',
          title: 'From Wound to Wisdom',
          duration: 40,
          description: 'Finding the gift',
          contentType: 'audio',
          xpReward: 50
        }
      ]
    },
    // Add remaining chapters for inward-journey...
  ],

  'energy-bodies': [
    {
      id: 'energy-physical',
      pathId: 'energy-bodies',
      title: 'Body - Physical',
      subtitle: 'Your physical vessel',
      description: 'Understand and optimize your physical body as a vessel for consciousness.',
      totalDuration: 105,
      xpReward: 130,
      lessons: [
        {
          id: 'energy-physical-1',
          title: 'The Body as Temple',
          duration: 35,
          description: 'Sacred vessel of consciousness',
          contentType: 'video',
          xpReward: 45
        },
        {
          id: 'energy-physical-2',
          title: 'Energy Flow in the Body',
          duration: 35,
          description: 'Understanding physical energy',
          contentType: 'mixed',
          xpReward: 45
        },
        {
          id: 'energy-physical-3',
          title: 'Optimizing Physical Health',
          duration: 35,
          description: 'Practices for vitality',
          contentType: 'text',
          xpReward: 40
        }
      ]
    },
    {
      id: 'energy-mental',
      pathId: 'energy-bodies',
      title: 'Mind - Mental',
      subtitle: 'The mental landscape',
      description: 'Master your thoughts and mental patterns for clarity and peace.',
      totalDuration: 100,
      xpReward: 140,
      lessons: [
        {
          id: 'energy-mental-1',
          title: 'Understanding the Mind',
          duration: 35,
          description: 'The nature of thought',
          contentType: 'video',
          xpReward: 50
        },
        {
          id: 'energy-mental-2',
          title: 'Mental Energy Management',
          duration: 30,
          description: 'Directing mental focus',
          contentType: 'mixed',
          xpReward: 45
        },
        {
          id: 'energy-mental-3',
          title: 'Clearing Mental Clutter',
          duration: 35,
          description: 'Creating mental space',
          contentType: 'audio',
          xpReward: 45
        }
      ]
    },
    {
      id: 'energy-spiritual',
      pathId: 'energy-bodies',
      title: 'Heart - Spiritual',
      subtitle: 'Spiritual connection',
      description: 'Open your heart to deeper spiritual connection and wisdom.',
      totalDuration: 110,
      xpReward: 150,
      lessons: [
        {
          id: 'energy-spiritual-1',
          title: 'The Heart Center',
          duration: 35,
          description: 'Gateway to spirit',
          contentType: 'video',
          xpReward: 50
        },
        {
          id: 'energy-spiritual-2',
          title: 'Opening the Heart',
          duration: 40,
          description: 'Practices for expansion',
          contentType: 'mixed',
          xpReward: 50
        },
        {
          id: 'energy-spiritual-3',
          title: 'Living from the Heart',
          duration: 35,
          description: 'Heart-centered living',
          contentType: 'audio',
          xpReward: 50
        }
      ]
    },
    {
      id: 'energy-inner',
      pathId: 'energy-bodies',
      title: 'Accessing Inner Being',
      subtitle: 'Gateway to wisdom',
      description: 'Learn to access your inner being and inner wisdom.',
      totalDuration: 95,
      xpReward: 140,
      lessons: [
        {
          id: 'energy-inner-1',
          title: 'The Inner Sanctuary',
          duration: 30,
          description: 'Finding your center',
          contentType: 'video',
          xpReward: 45
        },
        {
          id: 'energy-inner-2',
          title: 'Inner Guidance System',
          duration: 35,
          description: 'Listening to intuition',
          contentType: 'mixed',
          xpReward: 50
        },
        {
          id: 'energy-inner-3',
          title: 'Daily Inner Connection',
          duration: 30,
          description: 'Maintaining alignment',
          contentType: 'audio',
          xpReward: 45
        }
      ]
    }
  ],

  // Add skeleton structure for other paths (to be filled in later)
  'self-relating': [
    {
      id: 'relating-boundaries',
      pathId: 'self-relating',
      title: 'Healthy Boundaries',
      subtitle: 'Creating sacred space',
      description: 'Learn to set and maintain healthy boundaries in all relationships.',
      totalDuration: 90,
      xpReward: 120,
      lessons: [] // To be filled
    }
  ],

  'doing': [
    {
      id: 'doing-action',
      pathId: 'doing',
      title: 'Conscious Action',
      subtitle: 'Acting with presence',
      description: 'Learn to act from a place of presence and awareness.',
      totalDuration: 85,
      xpReward: 110,
      lessons: [] // To be filled
    }
  ],

  'life': [
    {
      id: 'life-living',
      pathId: 'life',
      title: 'Living Fully',
      subtitle: 'Embracing all of life',
      description: 'Learn to embrace the fullness of human experience.',
      totalDuration: 95,
      xpReward: 130,
      lessons: [] // To be filled
    }
  ],

  'self-mastery': [
    {
      id: 'mastery-discipline',
      pathId: 'self-mastery',
      title: 'Inner Discipline',
      subtitle: 'Mastering yourself',
      description: 'Develop the inner discipline required for self-mastery.',
      totalDuration: 100,
      xpReward: 150,
      lessons: [] // To be filled
    }
  ],

  'metaphysics': [
    {
      id: 'meta-reality',
      pathId: 'metaphysics',
      title: 'Nature of Reality',
      subtitle: 'Beyond the physical',
      description: 'Explore the fundamental nature of reality and consciousness.',
      totalDuration: 120,
      xpReward: 180,
      lessons: [] // To be filled
    }
  ]
};

// Helper functions
export const getChaptersForPath = (pathId: string): Chapter[] => {
  return chaptersData[pathId] || [];
};

export const getTotalChapters = (pathId: string): number => {
  return chaptersData[pathId]?.length || 0;
};

export const getTotalLessons = (pathId: string): number => {
  const chapters = chaptersData[pathId] || [];
  return chapters.reduce((total, chapter) => total + chapter.lessons.length, 0);
};

export const getPathDuration = (pathId: string): number => {
  const chapters = chaptersData[pathId] || [];
  return chapters.reduce((total, chapter) => total + chapter.totalDuration, 0);
};

export const getPathTotalXP = (pathId: string): number => {
  const chapters = chaptersData[pathId] || [];
  return chapters.reduce((total, chapter) => total + chapter.xpReward, 0);
};