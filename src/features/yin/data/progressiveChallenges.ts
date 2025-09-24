// src/features/yin/data/progressiveChallenges.ts

export interface Challenge {
  id: string;
  title: string;
  description: string;
  category: 'foundation' | 'habit' | 'mastery' | 'transformation';
  xpRequirement: number; // XP needed to unlock this challenge
  xpReward: number;
  target: number;
  current: number;
  completed: boolean;
  icon: string;
  color: string;
}

// All challenges in order - only 3 shown at a time
export const allChallenges: Challenge[] = [
  // Starter Challenges (0 XP required)
  {
    id: 'first-steps',
    title: 'First Steps',
    description: 'Complete your first quest',
    category: 'foundation',
    xpRequirement: 0,
    xpReward: 20,
    target: 1,
    current: 0,
    completed: false,
    icon: '👣',
    color: 'from-purple-600 to-purple-500'
  },
  {
    id: 'daily-practice',
    title: 'Daily Practice',
    description: 'Complete all 3 daily quests',
    category: 'foundation',
    xpRequirement: 0,
    xpReward: 30,
    target: 3,
    current: 0,
    completed: false,
    icon: '🎯',
    color: 'from-blue-600 to-blue-500'
  },
  {
    id: 'knowledge-seeker',
    title: 'Knowledge Seeker',
    description: 'Complete 3 lessons',
    category: 'foundation',
    xpRequirement: 0,
    xpReward: 40,
    target: 3,
    current: 0,
    completed: false,
    icon: '📚',
    color: 'from-green-600 to-green-500'
  },

  // Building Momentum (50 XP required)
  {
    id: 'consistency-builder',
    title: 'Consistency Builder',
    description: 'Build a 3-day streak',
    category: 'habit',
    xpRequirement: 50,
    xpReward: 50,
    target: 3,
    current: 0,
    completed: false,
    icon: '🔥',
    color: 'from-orange-600 to-orange-500'
  },
  {
    id: 'insight-collector',
    title: 'Insight Collector',
    description: 'Capture 5 insights',
    category: 'habit',
    xpRequirement: 50,
    xpReward: 40,
    target: 5,
    current: 0,
    completed: false,
    icon: '💡',
    color: 'from-amber-600 to-amber-500'
  },
  {
    id: 'meditation-foundation',
    title: 'Meditation Foundation',
    description: 'Complete 5 meditation sessions',
    category: 'habit',
    xpRequirement: 50,
    xpReward: 45,
    target: 5,
    current: 0,
    completed: false,
    icon: '🧘',
    color: 'from-indigo-600 to-indigo-500'
  },

  // Deepening Practice (150 XP required)
  {
    id: 'week-warrior',
    title: 'Week Warrior',
    description: 'Achieve a 7-day streak',
    category: 'habit',
    xpRequirement: 150,
    xpReward: 75,
    target: 7,
    current: 0,
    completed: false,
    icon: '⚔️',
    color: 'from-purple-600 to-pink-600'
  },
  {
    id: 'chapter-master',
    title: 'Chapter Master',
    description: 'Complete an entire chapter',
    category: 'mastery',
    xpRequirement: 150,
    xpReward: 100,
    target: 1,
    current: 0,
    completed: false,
    icon: '📖',
    color: 'from-teal-600 to-cyan-600'
  },
  {
    id: 'wisdom-keeper',
    title: 'Wisdom Keeper',
    description: 'Capture 15 insights',
    category: 'mastery',
    xpRequirement: 150,
    xpReward: 60,
    target: 15,
    current: 0,
    completed: false,
    icon: '🗝️',
    color: 'from-rose-600 to-pink-600'
  },

  // Advanced Challenges (300 XP required)
  {
    id: 'path-walker',
    title: 'Path Walker',
    description: 'Complete 10 lessons',
    category: 'mastery',
    xpRequirement: 300,
    xpReward: 120,
    target: 10,
    current: 0,
    completed: false,
    icon: '🛤️',
    color: 'from-violet-600 to-purple-600'
  },
  {
    id: 'mindful-master',
    title: 'Mindful Master',
    description: 'Complete 15 meditation sessions',
    category: 'mastery',
    xpRequirement: 300,
    xpReward: 100,
    target: 15,
    current: 0,
    completed: false,
    icon: '🌸',
    color: 'from-pink-600 to-rose-600'
  },
  {
    id: 'streak-legend',
    title: 'Streak Legend',
    description: 'Maintain a 14-day streak',
    category: 'transformation',
    xpRequirement: 300,
    xpReward: 150,
    target: 14,
    current: 0,
    completed: false,
    icon: '🌟',
    color: 'from-amber-600 to-orange-600'
  },

  // Continue with more challenges...
];

// Function to get the next 3 available challenges
export function getActiveChallenges(userXP: number, completedChallengeIds: string[]): Challenge[] {
  // Filter out completed challenges and those with XP requirements too high
  const availableChallenges = allChallenges.filter(challenge => 
    !completedChallengeIds.includes(challenge.id) && 
    challenge.xpRequirement <= userXP
  );

  // Return the first 3 available challenges
  return availableChallenges.slice(0, 3);
}

// Function to get upcoming challenges (locked but visible)
export function getUpcomingChallenges(userXP: number, completedChallengeIds: string[]): Challenge[] {
  // Get challenges that are locked due to XP requirement
  const lockedChallenges = allChallenges.filter(challenge => 
    !completedChallengeIds.includes(challenge.id) && 
    challenge.xpRequirement > userXP
  );

  // Return the first 3 locked challenges
  return lockedChallenges.slice(0, 3);
}

// Function to check if all challenges are completed
export function allChallengesCompleted(completedChallengeIds: string[]): boolean {
  return completedChallengeIds.length >= allChallenges.length;
}