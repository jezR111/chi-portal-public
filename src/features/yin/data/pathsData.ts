// src/features/yin/data/pathsData.ts

import { Path } from '../types/chapter.types';

export const paths: Path[] = [
  {
    id: 'the-self',
    title: 'The Self',
    subtitle: 'Foundation of Being',
    description: 'Discover your authentic self and build a strong foundation of self-awareness.',
    icon: '🧘',
    duration: '12h',
    chapters: 8,
    totalXP: 500,
    color: 'purple',
    progress: 45
  },
  {
    id: 'inward-journey',
    title: 'The Inward Journey',
    subtitle: 'Path of Inner Exploration',
    description: 'Navigate your inner landscape with wisdom and courage.',
    icon: '🌊',
    duration: '10h',
    chapters: 7,
    totalXP: 450,
    color: 'blue',
    progress: 20
  },
  {
    id: 'energy-bodies',
    title: 'Energy Bodies',
    subtitle: 'Subtle Energy Systems',
    description: 'Explore the subtle dimensions of your energetic being.',
    icon: '⚡',
    duration: '15h',
    chapters: 9,
    totalXP: 600,
    color: 'yellow',
    isNew: true
  },
  {
    id: 'self-relating-others',
    title: 'Self Relating to Others',
    subtitle: 'Conscious Relationships',
    description: 'Transform how you connect with others and the world.',
    icon: '❤️',
    duration: '14h',
    chapters: 8,
    totalXP: 550,
    color: 'pink',
    isLocked: true
  },
  {
    id: 'somatic-healing',
    title: 'Somatic Healing',
    subtitle: 'Body Wisdom',
    description: 'Heal and integrate through the wisdom of your body.',
    icon: '🌿',
    duration: '11h',
    chapters: 6,
    totalXP: 400,
    color: 'green',
    isLocked: true
  },
  {
    id: 'archetypal-realms',
    title: 'Archetypal Realms',
    subtitle: 'Universal Patterns',
    description: 'Explore the archetypal dimensions of consciousness.',
    icon: '🔮',
    duration: '13h',
    chapters: 7,
    totalXP: 500,
    color: 'indigo',
    isLocked: true
  },
  {
    id: 'shadow-integration',
    title: 'Shadow Integration',
    subtitle: 'Embracing the Dark',
    description: 'Integrate the hidden and rejected aspects of yourself.',
    icon: '🌑',
    duration: '9h',
    chapters: 5,
    totalXP: 350,
    color: 'gray',
    isLocked: true
  },
  {
    id: 'creative-consciousness',
    title: 'Creative Consciousness',
    subtitle: 'Artistic Expression',
    description: 'Express your spiritual journey through creative practice.',
    icon: '🎨',
    duration: '16h',
    chapters: 10,
    totalXP: 650,
    color: 'violet',
    isLocked: true
  }
];