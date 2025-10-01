//src/features/yin/components/chapters/AchievementSystem.tsx

'use client'

import { AnimatePresence, motion } from 'framer-motion';
import { Award, BookOpen, Crown, Flame, Gem, Heart, Lock, Shield, Star, Target, Trophy, Zap } from 'lucide-react';
import React, { useEffect, useState } from 'react';

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: any;
  color: string;
  requirement: {
    type: 'xp' | 'lessons' | 'streak' | 'paths' | 'special';
    value: number;
    current?: number;
  };
  unlocked: boolean;
  unlockedAt?: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

interface AchievementSystemProps {
  totalXP: number;
  completedLessons: string[];
  streak?: number;
  pathsCompleted?: number;
  onAchievementUnlock?: (achievement: Achievement) => void;
}

export const AchievementSystem: React.FC<AchievementSystemProps> = ({
  totalXP,
  completedLessons,
  streak = 0,
  pathsCompleted = 0,
  onAchievementUnlock
}) => {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [showNotification, setShowNotification] = useState(false);
  const [latestAchievement, setLatestAchievement] = useState<Achievement | null>(null);

  // Define all achievements
  const allAchievements: Achievement[] = [
    // XP Achievements
    {
      id: 'first-steps',
      title: 'First Steps',
      description: 'Earn your first 100 XP',
      icon: Trophy,
      color: 'from-yellow-400 to-amber-600',
      requirement: { type: 'xp', value: 100 },
      unlocked: false,
      rarity: 'common'
    },
    {
      id: 'explorer',
      title: 'Explorer',
      description: 'Reach 500 XP',
      icon: Target,
      color: 'from-blue-400 to-blue-600',
      requirement: { type: 'xp', value: 500 },
      unlocked: false,
      rarity: 'rare'
    },
    {
      id: 'wisdom-seeker',
      title: 'Wisdom Seeker',
      description: 'Reach 1000 XP',
      icon: BookOpen,
      color: 'from-purple-400 to-purple-600',
      requirement: { type: 'xp', value: 1000 },
      unlocked: false,
      rarity: 'epic'
    },
    {
      id: 'enlightened',
      title: 'Enlightened',
      description: 'Reach 5000 XP',
      icon: Crown,
      color: 'from-pink-400 to-pink-600',
      requirement: { type: 'xp', value: 5000 },
      unlocked: false,
      rarity: 'legendary'
    },
    
    // Lesson Achievements
    {
      id: 'dedicated-student',
      title: 'Dedicated Student',
      description: 'Complete 5 lessons',
      icon: Star,
      color: 'from-green-400 to-green-600',
      requirement: { type: 'lessons', value: 5 },
      unlocked: false,
      rarity: 'common'
    },
    {
      id: 'knowledge-hunter',
      title: 'Knowledge Hunter',
      description: 'Complete 20 lessons',
      icon: Zap,
      color: 'from-indigo-400 to-indigo-600',
      requirement: { type: 'lessons', value: 20 },
      unlocked: false,
      rarity: 'rare'
    },
    {
      id: 'scholar',
      title: 'Scholar',
      description: 'Complete 50 lessons',
      icon: Shield,
      color: 'from-cyan-400 to-cyan-600',
      requirement: { type: 'lessons', value: 50 },
      unlocked: false,
      rarity: 'epic'
    },
    
    // Streak Achievements
    {
      id: 'consistent',
      title: 'Consistent',
      description: '7 day streak',
      icon: Flame,
      color: 'from-orange-400 to-orange-600',
      requirement: { type: 'streak', value: 7 },
      unlocked: false,
      rarity: 'common'
    },
    {
      id: 'committed',
      title: 'Committed',
      description: '30 day streak',
      icon: Heart,
      color: 'from-red-400 to-red-600',
      requirement: { type: 'streak', value: 30 },
      unlocked: false,
      rarity: 'epic'
    },
    
    // Special Achievement
    {
      id: 'inner-peace',
      title: 'Inner Peace',
      description: 'Complete The Self path',
      icon: Gem,
      color: 'from-teal-400 to-teal-600',
      requirement: { type: 'special', value: 1 },
      unlocked: false,
      rarity: 'legendary'
    }
  ];

  // Check for newly unlocked achievements
  useEffect(() => {
    const updatedAchievements = allAchievements.map(achievement => {
      let shouldUnlock = false;
      
      switch (achievement.requirement.type) {
        case 'xp':
          shouldUnlock = totalXP >= achievement.requirement.value;
          break;
        case 'lessons':
          shouldUnlock = completedLessons.length >= achievement.requirement.value;
          break;
        case 'streak':
          shouldUnlock = streak >= achievement.requirement.value;
          break;
        case 'paths':
          shouldUnlock = pathsCompleted >= achievement.requirement.value;
          break;
        default:
          shouldUnlock = false;
      }
      
      // Check if this is newly unlocked
      const wasUnlocked = achievements.find(a => a.id === achievement.id)?.unlocked || false;
      if (shouldUnlock && !wasUnlocked) {
        const unlockedAchievement = {
          ...achievement,
          unlocked: true,
          unlockedAt: new Date().toISOString()
        };
        
        // Show notification
        setLatestAchievement(unlockedAchievement);
        setShowNotification(true);
        setTimeout(() => setShowNotification(false), 5000);
        
        if (onAchievementUnlock) {
          onAchievementUnlock(unlockedAchievement);
        }
        
        return unlockedAchievement;
      }
      
      return {
        ...achievement,
        unlocked: shouldUnlock,
        requirement: {
          ...achievement.requirement,
          current: achievement.requirement.type === 'xp' ? totalXP :
                   achievement.requirement.type === 'lessons' ? completedLessons.length :
                   achievement.requirement.type === 'streak' ? streak : pathsCompleted
        }
      };
    });
    
    setAchievements(updatedAchievements);
  }, [totalXP, completedLessons, streak, pathsCompleted]);

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'from-gray-400 to-gray-600';
      case 'rare': return 'from-blue-400 to-blue-600';
      case 'epic': return 'from-purple-400 to-purple-600';
      case 'legendary': return 'from-yellow-400 to-amber-500';
      default: return 'from-gray-400 to-gray-600';
    }
  };

  const getRarityBorder = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'border-gray-500/30';
      case 'rare': return 'border-blue-500/30';
      case 'epic': return 'border-purple-500/30';
      case 'legendary': return 'border-yellow-500/30';
      default: return 'border-gray-500/30';
    }
  };

  const unlockedCount = achievements.filter(a => a.unlocked).length;
  const totalCount = achievements.length;
  const completionPercent = (unlockedCount / totalCount) * 100;

  return (
    <>
      {/* Achievement Unlock Notification */}
      <AnimatePresence>
        {showNotification && latestAchievement && (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -50, scale: 0.9 }}
            className="fixed top-24 left-1/2 transform -translate-x-1/2 z-50"
          >
            <div className="bg-gradient-to-r from-yellow-900/90 to-amber-900/90 backdrop-blur-xl p-6 rounded-2xl border border-yellow-500/50 shadow-2xl">
              <div className="flex items-center gap-4">
                <div className={`p-4 bg-gradient-to-br ${latestAchievement.color} rounded-xl`}>
                  <latestAchievement.icon className="w-8 h-8 text-white" />
                </div>
                <div>
                  <p className="text-yellow-300 text-sm font-semibold">Achievement Unlocked!</p>
                  <h3 className="text-2xl font-bold text-white">{latestAchievement.title}</h3>
                  <p className="text-yellow-200 text-sm mt-1">{latestAchievement.description}</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Achievement Display Panel */}
      <div className="bg-purple-900/30 backdrop-blur-sm rounded-2xl p-6 border border-purple-500/30">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-2xl font-bold text-white mb-2">Achievements</h3>
            <p className="text-purple-300">
              {unlockedCount} of {totalCount} unlocked
            </p>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-2 mb-2">
              <Award className="w-6 h-6 text-yellow-400" />
              <span className="text-2xl font-bold text-white">{Math.round(completionPercent)}%</span>
            </div>
            <div className="w-32 h-2 bg-purple-900/50 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-yellow-400 to-amber-500"
                initial={{ width: 0 }}
                animate={{ width: `${completionPercent}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>
        </div>

        {/* Achievement Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {achievements.map((achievement) => (
            <motion.div
              key={achievement.id}
              whileHover={achievement.unlocked ? { scale: 1.05 } : {}}
              className={`
                relative p-4 rounded-xl border backdrop-blur-sm transition-all
                ${achievement.unlocked 
                  ? `bg-gradient-to-br ${achievement.color} border-white/20` 
                  : 'bg-gray-800/50 border-gray-700/50'
                }
                ${getRarityBorder(achievement.rarity)}
              `}
            >
              {!achievement.unlocked && (
                <div className="absolute inset-0 bg-black/60 rounded-xl flex items-center justify-center">
                  <Lock className="w-8 h-8 text-gray-500" />
                </div>
              )}
              
              <div className={achievement.unlocked ? '' : 'opacity-30'}>
                <div className="flex justify-between items-start mb-2">
                  <achievement.icon className="w-8 h-8 text-white" />
                  {achievement.unlocked && (
                    <motion.div
                      initial={{ rotate: 0 }}
                      animate={{ rotate: 360 }}
                      transition={{ duration: 0.5 }}
                    >
                      <Star className="w-4 h-4 text-yellow-300" />
                    </motion.div>
                  )}
                </div>
                <h4 className="text-white font-bold text-sm mb-1">{achievement.title}</h4>
                <p className="text-white/80 text-xs mb-2">{achievement.description}</p>
                
                {/* Progress bar for locked achievements */}
                {!achievement.unlocked && achievement.requirement.current !== undefined && (
                  <div className="mt-2">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-gray-400">Progress</span>
                      <span className="text-gray-400">
                        {achievement.requirement.current}/{achievement.requirement.value}
                      </span>
                    </div>
                    <div className="h-1 bg-gray-700 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-gray-400 to-gray-500"
                        style={{ 
                          width: `${Math.min(100, (achievement.requirement.current! / achievement.requirement.value) * 100)}%` 
                        }}
                      />
                    </div>
                  </div>
                )}
                
                {/* Rarity indicator */}
                <div className="mt-2">
                  <span className={`
                    text-xs font-semibold uppercase
                    ${achievement.rarity === 'legendary' ? 'text-yellow-300' :
                      achievement.rarity === 'epic' ? 'text-purple-300' :
                      achievement.rarity === 'rare' ? 'text-blue-300' :
                      'text-gray-300'}
                  `}>
                    {achievement.rarity}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </>
  );
};

export default AchievementSystem;