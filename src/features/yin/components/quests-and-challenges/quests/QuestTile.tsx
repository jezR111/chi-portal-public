import { motion, useAnimation } from 'framer-motion';
import { Check, Clock, Zap } from 'lucide-react';
import React, { useEffect, useState } from 'react';

interface QuestTileProps {
  quest: {
    id: string;
    title: string;
    description: string;
    icon: React.ComponentType<any>;
    gradient: string;
    xp: number;
    duration?: string;
    completed?: boolean;
  };
  onClick: () => void;
  index: number;
}

export const QuestTile: React.FC<QuestTileProps> = ({ quest, onClick, index }) => {
  const Icon = quest.icon;
  const [isHovered, setIsHovered] = useState(false);
  const controls = useAnimation();

  // Define accent colors for each quest type with gradients
  const accentColors: Record<string, { primary: string; secondary: string; glow: string; gradient: string }> = {
    'meditation': { 
      primary: '#818cf8', 
      secondary: '#6366f1',
      glow: 'rgba(129, 140, 248, 0.5)',
      gradient: 'radial-gradient(ellipse at center, rgba(129, 140, 248, 0.15) 0%, rgba(99, 102, 241, 0.05) 40%, transparent 70%)'
    },
    'gratitude': { 
      primary: '#f9a8d4', 
      secondary: '#ec4899',
      glow: 'rgba(249, 168, 212, 0.5)',
      gradient: 'radial-gradient(ellipse at center, rgba(249, 168, 212, 0.15) 0%, rgba(236, 72, 153, 0.05) 40%, transparent 70%)'
    },
    'breathing': { 
      primary: '#67e8f9', 
      secondary: '#06b6d4',
      glow: 'rgba(103, 232, 249, 0.5)',
      gradient: 'radial-gradient(ellipse at center, rgba(103, 232, 249, 0.15) 0%, rgba(6, 182, 212, 0.05) 40%, transparent 70%)'
    },
    'learning': { 
      primary: '#86efac', 
      secondary: '#10b981',
      glow: 'rgba(134, 239, 172, 0.5)',
      gradient: 'radial-gradient(ellipse at center, rgba(134, 239, 172, 0.15) 0%, rgba(16, 185, 129, 0.05) 40%, transparent 70%)'
    },
    'movement': { 
      primary: '#fde68a', 
      secondary: '#f59e0b',
      glow: 'rgba(253, 230, 138, 0.5)',
      gradient: 'radial-gradient(ellipse at center, rgba(253, 230, 138, 0.15) 0%, rgba(245, 158, 11, 0.05) 40%, transparent 70%)'
    },
  };

const colors = accentColors[quest.id.replace('quest-', '')] || accentColors['meditation'];

  // Pulse animation for completed state
  useEffect(() => {
    if (quest.completed) {
      controls.start({
        scale: [1, 1.02, 1],
        transition: {
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }
      });
    }
  }, [quest.completed, controls]);

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
      whileHover={{ 
        y: -8,
        transition: { type: "spring", stiffness: 400, damping: 25 }
      }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative aspect-square cursor-pointer"
    >
      {/* Main card with color bleeding from icon */}
      <motion.div 
        className="relative h-full rounded-3xl overflow-hidden"
        animate={controls}
        style={{
          background: quest.completed 
            ? 'linear-gradient(145deg, #1a1a1d 0%, #0f0f11 100%)' 
            : 'linear-gradient(145deg, #131316 0%, #0a0a0b 100%)',
          border: '1px solid rgba(255, 255, 255, 0.03)'
        }}
      >
        {/* Reverberated icon pattern in background for depth */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Top left echo */}
          <div className="absolute -top-8 -left-8 opacity-[0.03]">
            <Icon className="w-32 h-32" style={{ color: colors.primary }} />
          </div>
          {/* Bottom right echo */}
          <div className="absolute -bottom-12 -right-12 opacity-[0.04]">
            <Icon className="w-40 h-40" style={{ color: colors.primary }} />
          </div>
          {/* Center large echo */}
          <motion.div 
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.02]"
            animate={{
              scale: isHovered ? 1.2 : 1,
              rotate: isHovered ? 15 : 0
            }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <Icon className="w-56 h-56" style={{ color: colors.primary }} />
          </motion.div>
          {/* Top right small echo */}
          <div className="absolute top-4 right-4 opacity-[0.05]">
            <Icon className="w-20 h-20" style={{ color: colors.primary }} />
          </div>
        </div>
        
        {/* Color bleed from icon - covers entire tile */}
        <motion.div 
          className="absolute inset-0 transition-opacity duration-700"
          style={{
            background: colors.gradient,
            opacity: isHovered ? 0.8 : 0.4
          }}
        />
        
        {/* Additional radial glow for depth */}
        <motion.div 
          className="absolute inset-0"
          style={{
            background: `radial-gradient(circle at center, ${colors.glow}, transparent 60%)`,
            opacity: isHovered ? 0.3 : 0.1,
            transform: isHovered ? 'scale(1.5)' : 'scale(1)',
            transition: 'all 0.5s ease'
          }}
        />
        
        {/* Content container - fully centered */}
        <div className="relative h-full p-6 flex flex-col items-center justify-center">
          {/* Completed state indicator */}
          {quest.completed && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute top-4 right-4 w-7 h-7 rounded-full flex items-center justify-center z-10"
              style={{
                backgroundColor: colors.glow,
                border: `1.5px solid ${colors.primary}`
              }}
            >
              <Check className="w-4 h-4" style={{ color: colors.primary }} />
            </motion.div>
          )}
          
          {/* Icon with enhanced glow */}
          <motion.div 
            className="relative mb-6"
            animate={{
              scale: isHovered ? 1.1 : 1,
            }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            {/* Enhanced icon glow - 150% radiance */}
            <motion.div 
              className="absolute inset-0 rounded-2xl"
              style={{
                background: `radial-gradient(circle, ${colors.primary}60, transparent 50%)`,
                filter: 'blur(25px)',
                transform: 'scale(1.5)',
                opacity: isHovered ? 0.8 : 0.5
              }}
              animate={{
                scale: isHovered ? 2 : 1.5
              }}
              transition={{ duration: 0.4 }}
            />
            
            {/* Icon container */}
            <div 
              className="relative w-20 h-20 rounded-2xl flex items-center justify-center"
              style={{
                background: `linear-gradient(135deg, ${colors.primary}20, ${colors.secondary}15)`,
                border: `1px solid ${colors.primary}30`,
                backdropFilter: 'blur(10px)'
              }}
            >
              <Icon className="w-10 h-10" style={{ color: colors.primary }} />
            </div>
          </motion.div>
          
          {/* Text content - vertically centered */}
          <div className="text-center mb-6">
            <h3 className="text-white font-semibold text-lg mb-2">
              {quest.title}
            </h3>
            <p className="text-gray-400 text-sm line-clamp-2 leading-relaxed px-2">
              {quest.description}
            </p>
          </div>
          
          {/* Bottom badges */}
          <div className="flex items-center justify-center gap-3">
            {/* XP Badge */}
            <motion.div 
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full"
              style={{
                background: 'rgba(0, 0, 0, 0.3)',
                border: `1px solid ${colors.primary}20`,
                backdropFilter: 'blur(10px)'
              }}
              whileHover={{ scale: 1.05 }}
            >
              <Zap className="w-3.5 h-3.5" style={{ color: colors.primary }} />
              <span className="text-gray-300 font-medium text-sm">+{quest.xp}</span>
            </motion.div>
            
            {/* Duration Badge */}
            {quest.duration && (
              <motion.div 
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full"
                style={{
                  background: 'rgba(0, 0, 0, 0.3)',
                  border: `1px solid rgba(255, 255, 255, 0.1)`,
                  backdropFilter: 'blur(10px)'
                }}
                whileHover={{ scale: 1.05 }}
              >
                <Clock className="w-3.5 h-3.5 text-gray-500" />
                <span className="text-gray-500 text-sm">{quest.duration}</span>
              </motion.div>
            )}
          </div>
        </div>
        
        {/* Subtle shine effect on hover */}
        <motion.div
          className="absolute inset-0 opacity-0 pointer-events-none"
          style={{
            background: `linear-gradient(135deg, 
              transparent 30%, 
              rgba(255,255,255,0.03) 50%, 
              transparent 70%)`,
          }}
          animate={{
            x: isHovered ? ['100%', '-100%'] : '100%',
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