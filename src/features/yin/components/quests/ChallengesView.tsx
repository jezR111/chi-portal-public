// src/features/yin/components/quests/ChallengesView.tsx

import { motion } from 'framer-motion';
import {
  Activity,
  Award,
  Brain,
  Calendar,
  CheckCircle,
  Flame,
  Heart,
  Star,
  Trophy,
  Zap
} from 'lucide-react';
import { useEffect, useState } from 'react';

interface Challenge {
  id: string;
  title: string;
  description: string;
  type: 'streak' | 'milestone' | 'achievement' | 'completion';
  icon: any;
  target: number;
  current: number;
  reward: number;
  unlocked: boolean;
  gradient: string;
  category: 'beginner' | 'intermediate' | 'advanced';
}

const CHALLENGES: Challenge[] = [
  // Beginner Challenges (Easy to achieve)
  {
    id: 'first-meditation',
    title: 'First Steps',
    description: 'Complete your first meditation',
    type: 'completion',
    icon: Brain,
    target: 1,
    current: 0,
    reward: 10,
    unlocked: false,
    gradient: 'from-purple-600 to-indigo-600',
    category: 'beginner'
  },
  {
    id: 'first-gratitude',
    title: 'Grateful Heart',
    description: 'Complete your first gratitude practice',
    type: 'completion',
    icon: Heart,
    target: 1,
    current: 0,
    reward: 10,
    unlocked: false,
    gradient: 'from-pink-600 to-rose-600',
    category: 'beginner'
  },
  {
    id: 'first-movement',
    title: 'Body Awareness',
    description: 'Complete your first movement practice',
    type: 'completion',
    icon: Activity,
    target: 1,
    current: 0,
    reward: 10,
    unlocked: false,
    gradient: 'from-green-600 to-emerald-600',
    category: 'beginner'
  },
  {
    id: 'all-activities',
    title: 'Well Rounded',
    description: 'Complete all 3 types of activities',
    type: 'achievement',
    icon: Star,
    target: 3,
    current: 0,
    reward: 30,
    unlocked: false,
    gradient: 'from-amber-600 to-yellow-600',
    category: 'beginner'
  },
  
  // Intermediate Challenges
  {
    id: 'meditation-streak-3',
    title: 'Mindful Consistency',
    description: 'Complete 3 meditations in a row',
    type: 'streak',
    icon: Brain,
    target: 3,
    current: 0,
    reward: 25,
    unlocked: false,
    gradient: 'from-purple-600 to-indigo-600',
    category: 'intermediate'
  },
  {
    id: 'gratitude-streak-3',
    title: 'Gratitude Flow',
    description: 'Complete 3 gratitude practices in a row',
    type: 'streak',
    icon: Heart,
    target: 3,
    current: 0,
    reward: 25,
    unlocked: false,
    gradient: 'from-pink-600 to-rose-600',
    category: 'intermediate'
  },
  {
    id: '3-day-active',
    title: '3-Day Warrior',
    description: 'Be active for 3 days in a row',
    type: 'streak',
    icon: Flame,
    target: 3,
    current: 0,
    reward: 40,
    unlocked: false,
    gradient: 'from-orange-600 to-red-600',
    category: 'intermediate'
  },
  {
    id: '3-in-5-days',
    title: 'Consistent Practice',
    description: 'Complete activities 3 times in 5 days',
    type: 'milestone',
    icon: Calendar,
    target: 3,
    current: 0,
    reward: 35,
    unlocked: false,
    gradient: 'from-blue-600 to-cyan-600',
    category: 'intermediate'
  },
  {
    id: 'activity-streak-5',
    title: 'Dedication',
    description: 'Complete any activity 5 days in a row',
    type: 'streak',
    icon: Trophy,
    target: 5,
    current: 0,
    reward: 50,
    unlocked: false,
    gradient: 'from-amber-600 to-orange-600',
    category: 'intermediate'
  },
  
  // Advanced Challenges
  {
    id: 'triple-meditation',
    title: 'Meditation Master',
    description: 'Complete 3 separate 3-day meditation streaks',
    type: 'achievement',
    icon: Brain,
    target: 3,
    current: 0,
    reward: 100,
    unlocked: false,
    gradient: 'from-purple-700 to-indigo-700',
    category: 'advanced'
  },
  {
    id: 'week-warrior',
    title: '7-Day Champion',
    description: 'Complete activities for 7 days straight',
    type: 'streak',
    icon: Flame,
    target: 7,
    current: 0,
    reward: 100,
    unlocked: false,
    gradient: 'from-orange-700 to-red-700',
    category: 'advanced'
  },
  {
    id: 'total-50',
    title: 'Devoted Practitioner',
    description: 'Complete 50 total activities',
    type: 'milestone',
    icon: Award,
    target: 50,
    current: 0,
    reward: 200,
    unlocked: false,
    gradient: 'from-gold-600 to-amber-600',
    category: 'advanced'
  }
];

export const ChallengesView = () => {
  const [challenges, setChallenges] = useState(CHALLENGES);
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'beginner' | 'intermediate' | 'advanced'>('all');

  useEffect(() => {
    const savedProgress = localStorage.getItem('challengeProgress');
    if (savedProgress) {
      const progress = JSON.parse(savedProgress);
      setChallenges(prev => prev.map(challenge => ({
        ...challenge,
        current: progress[challenge.id]?.current || challenge.current,
        unlocked: progress[challenge.id]?.unlocked || challenge.unlocked
      })));
    }
  }, []);

  const filteredChallenges = selectedCategory === 'all' 
    ? challenges 
    : challenges.filter(c => c.category === selectedCategory);

  const totalUnlocked = challenges.filter(c => c.unlocked).length;
  const totalRewards = challenges.filter(c => c.unlocked).reduce((sum, c) => sum + c.reward, 0);
  
  // Calculate progress by category
  const beginnerProgress = challenges.filter(c => c.category === 'beginner' && c.unlocked).length;
  const intermediateProgress = challenges.filter(c => c.category === 'intermediate' && c.unlocked).length;
  const advancedProgress = challenges.filter(c => c.category === 'advanced' && c.unlocked).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900 p-6">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="bg-black/30 backdrop-blur-xl rounded-3xl p-6 border border-white/10">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Challenges</h1>
              <p className="text-gray-400">Start small, grow consistently</p>
            </div>
            
            <div className="flex gap-6">
              <div className="text-center">
                <div className="flex items-center gap-2 mb-1">
                  <Trophy className="w-5 h-5 text-amber-400" />
                  <span className="text-2xl font-bold text-white">{totalUnlocked}/{challenges.length}</span>
                </div>
                <p className="text-xs text-gray-400">Completed</p>
              </div>
              
              <div className="text-center">
                <div className="flex items-center gap-2 mb-1">
                  <Zap className="w-5 h-5 text-purple-400" />
                  <span className="text-2xl font-bold text-purple-400">+{totalRewards}</span>
                </div>
                <p className="text-xs text-gray-400">XP Earned</p>
              </div>
            </div>
          </div>

          {/* Category Progress */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-green-600/10 rounded-xl p-3 border border-green-500/20">
              <p className="text-xs text-green-400 mb-1">Beginner</p>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-2 bg-black/50 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-green-500" 
                    style={{ width: `${(beginnerProgress / 4) * 100}%` }}
                  />
                </div>
                <span className="text-xs text-white">{beginnerProgress}/4</span>
              </div>
            </div>
            
            <div className="bg-blue-600/10 rounded-xl p-3 border border-blue-500/20">
              <p className="text-xs text-blue-400 mb-1">Intermediate</p>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-2 bg-black/50 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-blue-500" 
                    style={{ width: `${(intermediateProgress / 5) * 100}%` }}
                  />
                </div>
                <span className="text-xs text-white">{intermediateProgress}/5</span>
              </div>
            </div>
            
            <div className="bg-purple-600/10 rounded-xl p-3 border border-purple-500/20">
              <p className="text-xs text-purple-400 mb-1">Advanced</p>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-2 bg-black/50 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-purple-500" 
                    style={{ width: `${(advancedProgress / 3) * 100}%` }}
                  />
                </div>
                <span className="text-xs text-white">{advancedProgress}/3</span>
              </div>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-2">
            {['all', 'beginner', 'intermediate', 'advanced'].map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category as any)}
                className={`px-4 py-2 rounded-lg capitalize transition-all ${
                  selectedCategory === category
                    ? 'bg-purple-600/30 text-white border border-purple-500/30'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Challenges Grid */}
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-6">
        {filteredChallenges.map((challenge, index) => {
          const Icon = challenge.icon;
          const progress = (challenge.current / challenge.target) * 100;
          
          return (
            <motion.div
              key={challenge.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="relative group"
            >
              <div className={`
                relative bg-black/40 backdrop-blur-sm rounded-2xl p-6
                border ${challenge.unlocked ? 'border-green-500/30' : 'border-white/10'}
                hover:border-purple-500/30 transition-all
              `}>
                {challenge.unlocked && (
                  <div className="absolute -top-3 -right-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center shadow-lg">
                      <CheckCircle className="w-6 h-6 text-white" />
                    </div>
                  </div>
                )}

                <div className="flex items-start gap-4">
                  <div className={`
                    w-16 h-16 bg-gradient-to-br ${challenge.gradient}
                    rounded-2xl flex items-center justify-center shadow-lg
                    ${challenge.unlocked ? 'opacity-100' : 'opacity-70'}
                  `}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>

                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-white mb-1">{challenge.title}</h3>
                    <p className="text-gray-400 text-sm mb-3">{challenge.description}</p>
                    
                    <div className="mb-3">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-400">Progress</span>
                        <span className={challenge.unlocked ? 'text-green-400' : 'text-white'}>
                          {challenge.current}/{challenge.target}
                        </span>
                      </div>
                      <div className="h-3 bg-black/50 rounded-full overflow-hidden">
                        <motion.div
                          className={`h-full bg-gradient-to-r ${challenge.gradient}`}
                          initial={{ width: 0 }}
                          animate={{ width: `${Math.min(progress, 100)}%` }}
                          transition={{ duration: 1, delay: index * 0.1 }}
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        challenge.category === 'beginner' ? 'bg-green-500/20 text-green-300' :
                        challenge.category === 'intermediate' ? 'bg-blue-500/20 text-blue-300' :
                        'bg-purple-500/20 text-purple-300'
                      }`}>
                        {challenge.category}
                      </span>
                      <span className="text-amber-400 font-bold text-sm">+{challenge.reward} XP</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};