import { Challenge, challengeService } from '@/features/yin/services/challengeService';
import { motion } from 'framer-motion';
import { Crown, Shield, Target, Trophy, Zap } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { ChallengeTile } from './ChallengeTile';

// Animated background particle
const FloatingGem: React.FC<{ delay: number; color: string }> = ({ delay, color }) => {
  return (
    <motion.div
      className={`absolute w-2 h-2 ${color}`}
      initial={{ 
        x: Math.random() * window.innerWidth,
        y: window.innerHeight + 20,
        rotate: 0
      }}
      animate={{ 
        y: -20,
        rotate: 360,
        opacity: [0, 1, 1, 0]
      }}
      transition={{
        duration: 10 + Math.random() * 5,
        delay: delay,
        repeat: Infinity,
        ease: "linear"
      }}
      style={{
        clipPath: 'polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)',
        filter: `drop-shadow(0 0 6px ${color})`
      }}
    />
  );
};

export const ChallengesView: React.FC = () => {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [currentTier, setCurrentTier] = useState(1);
  const [completedCount, setCompletedCount] = useState(0);
  const [totalChallenges, setTotalChallenges] = useState(0);

  useEffect(() => {
    loadChallenges();
    // Subscribe to challenge updates
    const interval = setInterval(loadChallenges, 1000); // Check for updates
    return () => clearInterval(interval);
  }, []);

  const loadChallenges = () => {
    const availableChallenges = challengeService.getAvailableChallenges();
    const allChallenges = challengeService.getAllChallenges();
    
    setChallenges(availableChallenges);
    setCurrentTier(challengeService.getCurrentTier());
    setCompletedCount(allChallenges.filter(c => c.completed).length);
    setTotalChallenges(allChallenges.length);
  };

  // Add icons and gradients to challenges
  const enhancedChallenges = challenges.map(challenge => {
    const icons: Record<string, React.ComponentType<any>> = {
      'first-steps': Target,
      'daily-practice': Trophy,
      'meditation-master': Shield,
      'gratitude-champion': Crown,
      'breath-warrior': Zap
    };
    
    const gradients: Record<string, string> = {
      'first-steps': 'from-blue-500 via-purple-500 to-pink-500',
      'daily-practice': 'from-yellow-400 via-orange-500 to-red-500',
      'meditation-master': 'from-purple-500 via-indigo-500 to-blue-600',
      'gratitude-champion': 'from-pink-400 via-rose-500 to-red-500',
      'breath-warrior': 'from-cyan-400 via-blue-500 to-indigo-600'
    };
    
    return {
      ...challenge,
      icon: icons[challenge.id] || Trophy,
      gradient: gradients[challenge.id] || 'from-gray-500 to-gray-700'
    };
  });

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Ultra premium animated background */}
      <div className="fixed inset-0 -z-10">
        <motion.div
          className="absolute inset-0"
          animate={{
            background: [
              'radial-gradient(circle at 20% 50%, rgba(120, 119, 198, 0.3) 0%, transparent 50%)',
              'radial-gradient(circle at 80% 50%, rgba(255, 119, 198, 0.3) 0%, transparent 50%)',
              'radial-gradient(circle at 50% 80%, rgba(120, 219, 255, 0.3) 0%, transparent 50%)',
              'radial-gradient(circle at 20% 50%, rgba(120, 119, 198, 0.3) 0%, transparent 50%)',
            ],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/50 via-black/50 to-indigo-900/50" />
        
        {/* Floating gems */}
        {Array.from({ length: 8 }).map((_, i) => (
          <FloatingGem 
            key={i} 
            delay={i * 2} 
            color={['bg-purple-400', 'bg-pink-400', 'bg-blue-400', 'bg-yellow-400'][i % 4]} 
          />
        ))}
      </div>

      <div className="relative z-10 container mx-auto px-6 py-8 max-w-6xl">
        {/* Premium header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-2xl rounded-3xl p-8 border border-white/20 shadow-2xl overflow-hidden relative">
            {/* Animated border gradient */}
            <motion.div
              className="absolute inset-[0px] rounded-3xl opacity-60"
              style={{
                background: 'linear-gradient(90deg, transparent, rgba(139, 92, 246, 0.5), transparent)',
                backgroundSize: '200% 100%'
              }}
              animate={{
                backgroundPosition: ['200% 0%', '-200% 0%']
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "linear"
              }}
            />
            
            <div className="relative">
              <div className="flex items-center justify-between">
                <div>
                  <motion.h1 
                    className="text-5xl font-bold mb-3"
                    style={{
                      background: 'linear-gradient(135deg, #fff 0%, #fbbf24 50%, #fff 100%)',
                      backgroundSize: '200% 200%',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }}
                    animate={{
                      backgroundPosition: ['0% 0%', '100% 100%', '0% 0%']
                    }}
                    transition={{
                      duration: 5,
                      repeat: Infinity,
                      ease: "linear"
                    }}
                  >
                    Epic Challenges
                  </motion.h1>
                  <p className="text-white/80 text-lg">Rise through the tiers and become legendary</p>
                </div>
                
                {/* Stats cards */}
                <div className="flex gap-4">
                  {/* Current Tier */}
                  <motion.div 
                    className="bg-gradient-to-br from-purple-500/20 to-indigo-500/20 backdrop-blur-xl rounded-2xl px-6 py-4 border border-purple-400/30"
                    whileHover={{ 
                      scale: 1.05,
                      boxShadow: '0 20px 40px rgba(139, 92, 246, 0.3)'
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <motion.div
                        animate={{ 
                          rotate: [0, 360],
                          scale: [1, 1.1, 1]
                        }}
                        transition={{ 
                          rotate: { duration: 20, repeat: Infinity, ease: "linear" },
                          scale: { duration: 2, repeat: Infinity }
                        }}
                      >
                        <Crown className="w-8 h-8 text-purple-400" 
                          style={{ filter: 'drop-shadow(0 0 15px rgba(168, 85, 247, 0.6))' }}
                        />
                      </motion.div>
                      <div>
                        <p className="text-purple-200/80 text-sm font-medium">Current Tier</p>
                        <p className="text-3xl font-bold text-purple-300">Tier {currentTier}</p>
                      </div>
                    </div>
                  </motion.div>
                  
                  {/* Progress */}
                  <motion.div 
                    className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 backdrop-blur-xl rounded-2xl px-6 py-4 border border-green-400/30"
                    whileHover={{ 
                      scale: 1.05,
                      boxShadow: '0 20px 40px rgba(34, 197, 94, 0.3)'
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <motion.div
                        animate={{ 
                          y: [0, -5, 0],
                        }}
                        transition={{ 
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                      >
                        <Trophy className="w-8 h-8 text-green-400" 
                          style={{ filter: 'drop-shadow(0 0 15px rgba(34, 197, 94, 0.6))' }}
                        />
                      </motion.div>
                      <div>
                        <p className="text-green-200/80 text-sm font-medium">Completed</p>
                        <p className="text-3xl font-bold text-green-300">
                          {completedCount}/{totalChallenges}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </div>
              
              {/* Master progress bar */}
              <div className="mt-6 relative">
                <div className="h-10 bg-black/40 rounded-full overflow-hidden backdrop-blur-xl border border-white/20">
                  <motion.div
                    className="h-full relative overflow-hidden"
                    initial={{ width: 0 }}
                    animate={{ 
                      width: `${(completedCount / totalChallenges) * 100}%` 
                    }}
                    transition={{ duration: 1.2, ease: "easeOut" }}
                  >
                    {/* Animated gradient fill */}
                    <motion.div
                      className="absolute inset-0"
                      animate={{
                        background: [
                          'linear-gradient(90deg, #10b981, #3b82f6, #8b5cf6)',
                          'linear-gradient(90deg, #3b82f6, #8b5cf6, #ec4899)',
                          'linear-gradient(90deg, #8b5cf6, #ec4899, #10b981)',
                          'linear-gradient(90deg, #10b981, #3b82f6, #8b5cf6)',
                        ],
                        backgroundPosition: ['0% 0%', '100% 0%', '200% 0%', '300% 0%']
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "linear"
                      }}
                      style={{
                        backgroundSize: '300% 100%',
                        boxShadow: 'inset 0 0 30px rgba(139, 92, 246, 0.4)'
                      }}
                    />
                    
                    {/* Shine overlay */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-t from-transparent via-white/30 to-transparent"
                      animate={{
                        x: ['-100%', '200%']
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    />
                  </motion.div>
                  
                  {/* Progress text overlay */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-white font-bold text-lg drop-shadow-lg">
                      Master Progress: {Math.round((completedCount / totalChallenges) * 100)}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Challenges list with premium spacing */}
        <div className="space-y-6">
          {enhancedChallenges.map((challenge, index) => (
            <ChallengeTile
              key={challenge.id}
              challenge={challenge}
              index={index}
            />
          ))}
        </div>

        {/* Motivational footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-12 text-center"
        >
          <motion.p 
            className="text-white/60 text-lg italic"
            animate={{
              opacity: [0.6, 1, 0.6]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            "Every challenge completed brings you closer to mastery"
          </motion.p>
        </motion.div>
      </div>
    </div>
  );
};