// src/features/yin/components/chapters/PathCard.tsx
// Version: 7.0 - Modular with meaningful spiritual icons

import { motion } from 'framer-motion';
import {
  Brain,
  Clock,
  // Spiritual path icons
  Compass, // Shadow Work - Unconscious mind
  Eye, // Energy Bodies - Subtle energies
  Heart, // Awareness - Consciousness expansion
  Infinity,
  Lock, // The Self - Navigation of inner world
  Mountain, // Inward Journey - The climb within
  Sparkles, // Integration - Wholeness
  Sun,
  Zap,
} from 'lucide-react';
import { useState } from 'react';

// Icon mapping for spiritual paths
const pathIconMap: Record<string, any> = {
  'the-self': Compass,
  'inward-journey': Mountain,
  'energy-bodies': Sparkles,
  'heart-wisdom': Heart,
  'shadow-work': Brain,
  'awareness': Eye,
  'integration': Infinity,
  'higher-self': Sun,
};

interface PathCardProps {
  path: any;
  index: number;
  isUnlocked: boolean;
  unlockCost: number;
  progress: number;
  onSelect: (path: any) => void;
}

export default function PathCard({ 
  path, 
  index, 
  isUnlocked, 
  unlockCost, 
  progress,
  onSelect 
}: PathCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const Icon = pathIconMap[path.id] || Compass;
  
  // Enhanced color schemes with spiritual meaning
  const pathColors: Record<string, any> = {
    'the-self': { 
      primary: '#a78bfa', 
      secondary: '#8b5cf6',
      glow: 'rgba(167, 139, 250, 0.5)',
      gradient: 'radial-gradient(ellipse at center, rgba(167, 139, 250, 0.15) 0%, rgba(139, 92, 246, 0.05) 40%, transparent 70%)',
      meaning: 'Purple - Self-discovery & intuition'
    },
    'inward-journey': { 
      primary: '#67e8f9', 
      secondary: '#06b6d4',
      glow: 'rgba(103, 232, 249, 0.5)',
      gradient: 'radial-gradient(ellipse at center, rgba(103, 232, 249, 0.15) 0%, rgba(6, 182, 212, 0.05) 40%, transparent 70%)',
      meaning: 'Cyan - Inner exploration & clarity'
    },
    'energy-bodies': { 
      primary: '#fde68a', 
      secondary: '#f59e0b',
      glow: 'rgba(253, 230, 138, 0.5)',
      gradient: 'radial-gradient(ellipse at center, rgba(253, 230, 138, 0.15) 0%, rgba(245, 158, 11, 0.05) 40%, transparent 70%)',
      meaning: 'Gold - Energy & vitality'
    },
    'heart-wisdom': { 
      primary: '#f9a8d4', 
      secondary: '#ec4899',
      glow: 'rgba(249, 168, 212, 0.5)',
      gradient: 'radial-gradient(ellipse at center, rgba(249, 168, 212, 0.15) 0%, rgba(236, 72, 153, 0.05) 40%, transparent 70%)',
      meaning: 'Pink - Love & compassion'
    },
    'shadow-work': { 
      primary: '#c084fc', 
      secondary: '#9333ea',
      glow: 'rgba(192, 132, 252, 0.5)',
      gradient: 'radial-gradient(ellipse at center, rgba(192, 132, 252, 0.15) 0%, rgba(147, 51, 234, 0.05) 40%, transparent 70%)',
      meaning: 'Violet - Shadow integration'
    },
  };
  
  const colors = pathColors[path.id] || pathColors['the-self'];
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        delay: index * 0.08,
        type: "spring",
        stiffness: 100,
        damping: 20
      }}
      whileHover={isUnlocked ? { y: -8, scale: 1.02 } : {}}
      whileTap={isUnlocked ? { scale: 0.98 } : {}}
      onClick={() => onSelect(path)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative aspect-square cursor-pointer group"
    >
      <div 
        className="relative h-full rounded-3xl overflow-hidden"
        style={{
          background: isUnlocked 
            ? 'linear-gradient(145deg, #1a1a1d 0%, #0f0f11 100%)' 
            : 'linear-gradient(145deg, #131316 0%, #0a0a0b 100%)',
          border: '1px solid rgba(255, 255, 255, 0.03)'
        }}
      >
        {/* Mystical background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div 
            className="absolute inset-0"
            style={{
              backgroundImage: `radial-gradient(circle at 20% 50%, ${colors.primary}40 0%, transparent 50%),
                               radial-gradient(circle at 80% 80%, ${colors.secondary}30 0%, transparent 50%),
                               radial-gradient(circle at 40% 20%, ${colors.primary}20 0%, transparent 50%)`,
            }}
          />
        </div>

        {/* Animated orbs */}
        {isUnlocked && (
          <>
            <motion.div
              className="absolute top-10 right-10 w-20 h-20 rounded-full opacity-20"
              style={{ background: colors.glow }}
              animate={{
                x: isHovered ? -10 : 0,
                y: isHovered ? 10 : 0,
                scale: [1, 1.2, 1],
              }}
              transition={{
                scale: { duration: 4, repeat: Infinity },
                x: { duration: 0.3 },
                y: { duration: 0.3 }
              }}
            />
            <motion.div
              className="absolute bottom-10 left-10 w-16 h-16 rounded-full opacity-15"
              style={{ background: colors.secondary }}
              animate={{
                x: isHovered ? 10 : 0,
                y: isHovered ? -10 : 0,
                scale: [1, 1.3, 1],
              }}
              transition={{
                scale: { duration: 5, repeat: Infinity, delay: 1 },
                x: { duration: 0.3 },
                y: { duration: 0.3 }
              }}
            />
          </>
        )}
        
        {/* Color gradient overlay */}
        <motion.div 
          className="absolute inset-0 transition-opacity duration-700"
          style={{
            background: colors.gradient,
            opacity: isHovered ? 0.8 : 0.4
          }}
        />
        
        {/* Radial glow effect */}
        <motion.div 
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(circle at center, ${colors.glow}, transparent 60%)`,
            opacity: isHovered ? 0.4 : 0.15,
            transform: isHovered ? 'scale(1.5)' : 'scale(1)',
            transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)'
          }}
        />
        
        {/* Lock overlay for locked paths */}
        {!isUnlocked && (
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-10">
            <div className="text-center">
              <Lock className="w-10 h-10 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-300 font-semibold text-lg">Unlock for {unlockCost} XP</p>
              <p className="text-gray-500 text-xs mt-1">Complete previous paths first</p>
            </div>
          </div>
        )}
        
        {/* Content */}
        <div className="relative h-full p-6 flex flex-col items-center justify-center">
          {/* Progress ring */}
          {isUnlocked && progress > 0 && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="absolute top-4 right-4 w-14 h-14 rounded-full flex items-center justify-center z-10"
            >
              <svg className="w-14 h-14 transform -rotate-90">
                <circle
                  cx="28"
                  cy="28"
                  r="24"
                  stroke="rgba(255,255,255,0.1)"
                  strokeWidth="4"
                  fill="none"
                />
                <circle
                  cx="28"
                  cy="28"
                  r="24"
                  stroke={colors.primary}
                  strokeWidth="4"
                  fill="none"
                  strokeDasharray={`${progress * 1.5} 150`}
                  strokeLinecap="round"
                />
              </svg>
              <span className="absolute text-xs font-bold text-white">{progress}%</span>
            </motion.div>
          )}
          
          {/* Main icon with enhanced glow */}
          <motion.div 
            className="relative mb-6"
            animate={{ 
              scale: isHovered ? 1.1 : 1,
              rotate: isHovered ? 5 : 0
            }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            {/* Multiple glow layers */}
            <motion.div 
              className="absolute inset-0 rounded-2xl"
              style={{
                background: `radial-gradient(circle, ${colors.primary}80, transparent 60%)`,
                filter: 'blur(20px)',
                transform: 'scale(2)',
                opacity: isHovered ? 0.9 : 0.4
              }}
            />
            <motion.div 
              className="absolute inset-0 rounded-2xl"
              style={{
                background: `radial-gradient(circle, ${colors.secondary}60, transparent 50%)`,
                filter: 'blur(15px)',
                transform: 'scale(1.5)',
                opacity: isHovered ? 0.7 : 0.3
              }}
            />
            
            <div 
              className="relative w-20 h-20 rounded-2xl flex items-center justify-center"
              style={{
                background: `linear-gradient(135deg, ${colors.primary}30, ${colors.secondary}20)`,
                border: `2px solid ${colors.primary}40`,
                backdropFilter: 'blur(10px)',
                boxShadow: isHovered 
                  ? `0 0 30px ${colors.glow}, inset 0 0 20px ${colors.primary}20`
                  : `0 0 15px ${colors.glow}40`
              }}
            >
              <Icon 
                className="w-10 h-10 transition-all duration-300" 
                style={{ 
                  color: colors.primary,
                  filter: isHovered ? 'drop-shadow(0 0 10px currentColor)' : 'none'
                }} 
              />
            </div>
          </motion.div>
          
          {/* Text content */}
          <div className="text-center mb-4 z-10">
            <h3 className="text-white font-bold text-lg mb-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r transition-all duration-300"
                style={{ 
                  backgroundImage: isHovered ? `linear-gradient(to right, ${colors.primary}, ${colors.secondary})` : 'none' 
                }}>
              {path.title}
            </h3>
            <p className="text-gray-400 text-sm line-clamp-2 leading-relaxed px-2">
              {path.subtitle}
            </p>
            {isHovered && colors.meaning && (
              <motion.p
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-xs mt-2 italic"
                style={{ color: colors.primary + '90' }}
              >
                {colors.meaning}
              </motion.p>
            )}
          </div>
          
          {/* Bottom stats badges */}
          <div className="flex items-center justify-center gap-3 z-10">
            <motion.div 
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full"
              style={{
                background: 'rgba(0, 0, 0, 0.4)',
                border: `1px solid ${colors.primary}30`,
                backdropFilter: 'blur(10px)'
              }}
              whileHover={{ scale: 1.05 }}
            >
              <Zap className="w-3.5 h-3.5" style={{ color: colors.primary }} />
              <span className="font-medium text-sm" style={{ color: colors.primary }}>
                +{path.totalXP}
              </span>
            </motion.div>
            
            <motion.div 
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full"
              style={{
                background: 'rgba(0, 0, 0, 0.4)',
                border: `1px solid rgba(255, 255, 255, 0.1)`,
                backdropFilter: 'blur(10px)'
              }}
              whileHover={{ scale: 1.05 }}
            >
              <Clock className="w-3.5 h-3.5 text-gray-400" />
              <span className="text-gray-400 text-sm">{path.estimatedHours}h</span>
            </motion.div>
          </div>
        </div>
        
        {/* Animated shine effect */}
        <motion.div
          className="absolute inset-0 opacity-0 pointer-events-none"
          style={{
            background: `linear-gradient(135deg, 
              transparent 30%, 
              rgba(255,255,255,0.05) 50%, 
              transparent 70%)`,
          }}
          animate={{
            x: isHovered ? ['100%', '-100%'] : '100%',
            opacity: isHovered ? [0, 1, 0] : 0
          }}
          transition={{
            x: { duration: 0.8 },
            opacity: { duration: 0.3 }
          }}
        />
      </div>
    </motion.div>
  );
}