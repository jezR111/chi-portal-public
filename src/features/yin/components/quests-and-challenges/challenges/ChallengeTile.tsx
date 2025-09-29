import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle, Crown, Diamond, Lock, Star, Trophy, Zap } from 'lucide-react';
import React, { useEffect, useState } from 'react';

interface ChallengeTileProps {
  challenge: {
    id: string;
    title: string;
    description: string;
    tier: number;
    xpReward: number;
    progress: number;
    maxProgress: number;
    completed: boolean;
    locked: boolean;
    icon?: React.ComponentType<any>;
    gradient?: string;
  };
  index: number;
}

// Animated progress particles
const ProgressParticle: React.FC<{ progress: number }> = ({ progress }) => {
  return (
    <motion.div
      className="absolute h-full"
      style={{ left: `${progress}%` }}
      initial={{ opacity: 0 }}
      animate={{ opacity: [0, 1, 0] }}
      transition={{
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    >
      <div className="relative -top-1">
        <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" 
          style={{ 
            filter: 'drop-shadow(0 0 6px rgba(251, 191, 36, 0.8))'
          }} 
        />
      </div>
    </motion.div>
  );
};

// Energy orb component
const EnergyOrb: React.FC<{ delay: number; color: string }> = ({ delay, color }) => {
  const path = Math.random() > 0.5 ? 'left' : 'right';
  
  return (
    <motion.div
      className={`absolute w-2 h-2 rounded-full ${color}`}
      initial={{ 
        x: path === 'left' ? -20 : 'calc(100% + 20px)',
        y: '50%',
        scale: 0,
        opacity: 0
      }}
      animate={{ 
        x: path === 'left' ? 'calc(100% + 20px)' : -20,
        y: ['50%', '30%', '70%', '50%'],
        scale: [0, 1, 1, 0],
        opacity: [0, 1, 1, 0]
      }}
      transition={{
        duration: 3,
        delay: delay,
        repeat: Infinity,
        ease: "easeInOut"
      }}
      style={{
        filter: `blur(1px) drop-shadow(0 0 10px ${color})`
      }}
    />
  );
};

export const ChallengeTile: React.FC<ChallengeTileProps> = ({ challenge, index }) => {
  const Icon = challenge.icon || Trophy;
  const [isHovered, setIsHovered] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [justCompleted, setJustCompleted] = useState(false);
  
  const progressPercentage = (challenge.progress / challenge.maxProgress) * 100;
  
  // Gradient selection based on tier
  const tierGradients = [
    'from-blue-500 via-purple-500 to-pink-500',
    'from-purple-500 via-pink-500 to-red-500',
    'from-yellow-400 via-orange-500 to-red-600',
    'from-green-400 via-emerald-500 to-teal-600',
    'from-indigo-500 via-purple-600 to-pink-600'
  ];
  
  const gradient = challenge.gradient || tierGradients[challenge.tier % tierGradients.length];

  // Track mouse for holographic effect
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    setMousePosition({ x, y });
  };

  // Tier icon selection
  const getTierIcon = () => {
    if (challenge.tier === 1) return Diamond;
    if (challenge.tier === 2) return Crown;
    if (challenge.tier === 3) return Star;
    return Trophy;
  };

  const TierIcon = getTierIcon();

  // Completion celebration
  useEffect(() => {
    if (challenge.completed && !justCompleted) {
      setJustCompleted(true);
      setTimeout(() => setJustCompleted(false), 3000);
    }
  }, [challenge.completed, justCompleted]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, x: -50, rotateY: -90 }}
      animate={{ opacity: 1, scale: 1, x: 0, rotateY: 0 }}
      transition={{ 
        delay: index * 0.1,
        type: "spring",
        stiffness: 100,
        damping: 20
      }}
      whileHover={{ 
        scale: 1.03,
        x: 10,
        rotateY: 3,
        transition: { type: "spring", stiffness: 300, damping: 20 }
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseMove={handleMouseMove}
      className="relative w-full cursor-pointer group"
      style={{ perspective: 1000 }}
    >
      {/* Animated gradient background */}
      <motion.div 
        className={`absolute inset-0 opacity-40 blur-3xl rounded-3xl`}
        animate={{
          background: isHovered 
            ? [
                `linear-gradient(90deg, #667eea 0%, #764ba2 50%, #f093fb 100%)`,
                `linear-gradient(90deg, #f093fb 0%, #667eea 50%, #764ba2 100%)`,
                `linear-gradient(90deg, #764ba2 0%, #f093fb 50%, #667eea 100%)`,
              ]
            : `linear-gradient(90deg, transparent, transparent)`
        }}
        transition={{
          duration: 3,
          repeat: isHovered ? Infinity : 0,
          ease: "linear"
        }}
      />
      
      {/* Energy orbs for active challenges */}
      {!challenge.locked && !challenge.completed && isHovered && (
        <>
          <EnergyOrb delay={0} color="bg-yellow-400" />
          <EnergyOrb delay={0.5} color="bg-purple-400" />
          <EnergyOrb delay={1} color="bg-blue-400" />
        </>
      )}
      
      {/* Main card */}
      <motion.div 
        className={`
          relative w-full h-36
          bg-gradient-to-br ${gradient}
          rounded-3xl overflow-hidden
          ${challenge.locked ? 'opacity-50' : ''}
          ${challenge.completed ? 'opacity-80' : ''}
        `}
        animate={{
          boxShadow: isHovered 
            ? '0 20px 40px rgba(0,0,0,0.3), 0 0 60px rgba(139, 92, 246, 0.3)' 
            : '0 10px 20px rgba(0,0,0,0.2)'
        }}
        style={{
          transform: isHovered 
            ? `rotateX(${(mousePosition.y - 0.5) * -5}deg) rotateY(${(mousePosition.x - 0.5) * 5}deg)`
            : 'rotateX(0deg) rotateY(0deg)',
          transformStyle: 'preserve-3d',
          transition: 'transform 0.1s ease-out'
        }}
      >
        {/* Holographic overlay */}
        <motion.div
          className="absolute inset-0 opacity-40"
          style={{
            background: `linear-gradient(${90 + mousePosition.x * 45}deg, 
              transparent 20%, 
              rgba(255,255,255,0.2) 40%, 
              transparent 60%,
              rgba(255,255,255,0.1) 80%,
              transparent)`,
          }}
          animate={{
            backgroundPosition: ['0% 0%', '200% 200%'],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        
        {/* Premium glass layers */}
        <div className="absolute inset-0 bg-white/10 backdrop-blur-xl" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-white/20" />
        
        {/* Multi-layer embossed borders */}
        <div className="absolute inset-[1px] rounded-3xl bg-gradient-to-br from-white/40 to-transparent" />
        <div className="absolute inset-[2px] rounded-3xl bg-gradient-to-br from-transparent via-white/10 to-black/30" />
        
        {/* Content container */}
        <div className="relative h-full p-5 flex items-center gap-4">
          {/* Icon section with 3D effect */}
          <motion.div 
            className="relative flex-shrink-0"
            animate={{
              rotate: isHovered ? [0, -10, 10, -10, 10, 0] : 0,
              scale: isHovered ? 1.1 : 1
            }}
            transition={{ duration: 0.8 }}
          >
            {/* Pulsing glow */}
            <motion.div 
              className="absolute inset-0 bg-white/50 rounded-full"
              animate={{
                scale: [1, 1.8, 1],
                opacity: [0.5, 0, 0.5]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              style={{
                filter: 'blur(20px)'
              }}
            />
            
            {/* Icon container */}
            <motion.div 
              className="relative w-20 h-20 bg-gradient-to-br from-white/30 to-white/10 backdrop-blur-xl rounded-2xl flex items-center justify-center border-2 border-white/40 shadow-2xl overflow-hidden"
              whileHover={{
                boxShadow: '0 15px 50px rgba(255,255,255,0.4), inset 0 0 20px rgba(255,255,255,0.2)'
              }}
            >
              {/* Inner shine */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-transparent to-transparent" />
              
              {/* Status icon */}
              <AnimatePresence mode="wait">
                {challenge.locked ? (
                  <motion.div
                    key="locked"
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    exit={{ scale: 0, rotate: 180 }}
                  >
                    <Lock className="w-10 h-10 text-white/70" />
                  </motion.div>
                ) : challenge.completed ? (
                  <motion.div
                    key="completed"
                    initial={{ scale: 0 }}
                    animate={{ 
                      scale: [1, 1.2, 1],
                      rotate: [0, 360]
                    }}
                    transition={{
                      scale: { duration: 2, repeat: Infinity },
                      rotate: { duration: 1 }
                    }}
                  >
                    <CheckCircle className="w-10 h-10 text-green-300" 
                      style={{ filter: 'drop-shadow(0 0 10px rgba(134, 239, 172, 0.6))' }} 
                    />
                  </motion.div>
                ) : (
                  <motion.div
                    key="active"
                    animate={{ y: [0, -5, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Icon className="w-10 h-10 text-white" 
                      style={{ filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.3))' }} 
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
            
            {/* Tier badge with glow */}
            <motion.div 
              className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-xl"
              animate={{
                scale: isHovered ? [1, 1.2, 1] : 1,
                rotate: isHovered ? 360 : 0
              }}
              transition={{ duration: 0.5 }}
              style={{
                boxShadow: '0 4px 20px rgba(251, 191, 36, 0.6), inset 0 0 10px rgba(255,255,255,0.4)'
              }}
            >
              <TierIcon className="w-4 h-4 text-white" />
            </motion.div>
          </motion.div>
          
          {/* Content section */}
          <div className="flex-1 min-w-0">
            {/* Premium embossed text container */}
            <motion.div 
              className="bg-black/30 rounded-xl px-4 py-3 backdrop-blur-xl border border-white/25 mb-3 overflow-hidden relative"
              animate={{
                borderColor: isHovered ? 'rgba(255,255,255,0.4)' : 'rgba(255,255,255,0.25)'
              }}
            >
              {/* Inner gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-black/10" />
              
              <h3 className="relative text-white font-bold text-lg mb-1 drop-shadow-lg">
                {challenge.title}
              </h3>
              <p className="relative text-white/80 text-sm line-clamp-1">
                {challenge.description}
              </p>
            </motion.div>
            
            {/* Progress bar with effects */}
            {!challenge.locked && !challenge.completed && (
              <div className="relative">
                <div className="relative h-6 bg-black/40 rounded-full overflow-hidden backdrop-blur-xl border border-white/20">
                  {/* Background glow */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                  
                  {/* Animated progress fill */}
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPercentage}%` }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="absolute inset-y-0 left-0 bg-gradient-to-r from-green-400 via-emerald-500 to-teal-500 rounded-full"
                    style={{
                      boxShadow: 'inset 0 0 20px rgba(34, 197, 94, 0.4)'
                    }}
                  >
                    {/* Progress shine */}
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
                  
                  {/* Progress particle */}
                  <ProgressParticle progress={progressPercentage} />
                  
                  {/* Progress text */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-white font-bold text-xs drop-shadow-lg">
                      {challenge.progress}/{challenge.maxProgress}
                    </span>
                  </div>
                </div>
              </div>
            )}
            
            {/* Status messages with animations */}
            {challenge.locked && (
              <motion.div 
                className="flex items-center gap-2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <Lock className="w-4 h-4 text-white/60" />
                <span className="text-white/60 text-sm font-medium">
                  Complete Tier {challenge.tier - 1} to unlock
                </span>
              </motion.div>
            )}
            
            {challenge.completed && (
              <motion.div 
                className="flex items-center gap-2"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ 
                  opacity: 1, 
                  scale: [1, 1.05, 1]
                }}
                transition={{
                  scale: { duration: 2, repeat: Infinity }
                }}
              >
                <CheckCircle className="w-4 h-4 text-green-300" />
                <span className="text-green-300 text-sm font-bold">
                  Victory Achieved!
                </span>
              </motion.div>
            )}
          </div>
          
          {/* XP Reward section */}
          <motion.div 
            className="flex-shrink-0"
            animate={{
              scale: isHovered ? 1.05 : 1,
              rotate: isHovered ? [0, -3, 3, 0] : 0
            }}
            transition={{ duration: 0.4 }}
          >
            <div className="relative bg-gradient-to-br from-yellow-500/40 to-orange-500/40 backdrop-blur-xl px-4 py-2 rounded-full border-2 border-yellow-400/50 overflow-hidden">
              {/* Inner glow */}
              <div className="absolute inset-0 bg-gradient-to-t from-transparent to-white/20" />
              
              {/* Sparkle animation */}
              {isHovered && (
                <motion.div
                  className="absolute top-0 right-0"
                  animate={{
                    scale: [0, 1, 0],
                    opacity: [0, 1, 0]
                  }}
                  transition={{
                    duration: 1,
                    repeat: Infinity
                  }}
                >
                  <Zap className="w-3 h-3 text-yellow-200" />
                </motion.div>
              )}
              
              <div className="relative flex items-center gap-2">
                <Trophy className="w-5 h-5 text-yellow-300" 
                  style={{ filter: 'drop-shadow(0 0 8px rgba(253, 224, 71, 0.6))' }}
                />
                <span className="text-yellow-200 font-bold text-base">
                  +{challenge.xpReward}
                </span>
              </div>
            </div>
          </motion.div>
        </div>
        
        {/* Completion celebration effects */}
        {justCompleted && (
          <>
            {/* Confetti particles */}
            {Array.from({ length: 12 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2"
                style={{
                  left: '50%',
                  top: '50%',
                  background: ['#fbbf24', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6'][i % 5]
                }}
                initial={{
                  x: 0,
                  y: 0,
                  scale: 0
                }}
                animate={{
                  x: (Math.random() - 0.5) * 200,
                  y: (Math.random() - 0.5) * 200,
                  scale: [0, 1, 1, 0],
                  rotate: Math.random() * 720
                }}
                transition={{
                  duration: 1.5,
                  ease: "easeOut"
                }}
              />
            ))}
          </>
        )}
        
        {/* Shine sweep effect */}
        <motion.div
          className="absolute inset-0 opacity-0 pointer-events-none rounded-3xl overflow-hidden"
          style={{
            background: `linear-gradient(105deg, 
              transparent 30%, 
              rgba(255,255,255,0.4) 50%, 
              transparent 70%)`,
          }}
          animate={{
            x: isHovered ? ['-150%', '150%'] : '-150%',
            opacity: isHovered ? 1 : 0
          }}
          transition={{
            x: { duration: 0.8 },
            opacity: { duration: 0.2 }
          }}
        />
      </motion.div>
    </motion.div>
  );
};