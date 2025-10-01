// src/features/yin/components/chapters/PathsView.tsx
// Version: 10.0 - Clean component without page wrapper

import { motion } from 'framer-motion';
import {
  Brain,
  ChevronRight,
  Clock,
  Compass,
  Heart,
  Lock,
  Mountain,
  Sparkles,
  Zap
} from 'lucide-react';
import { useState } from 'react';

const pathConfigs: Record<string, any> = {
  'the-self': {
    icon: Compass,
    gradient: 'from-purple-600 to-indigo-600',
    gradientSecondary: 'from-purple-500 to-indigo-500',
    bgColor: 'rgb(147, 51, 234)',
    borderColor: 'border-purple-500/20',
    hoverBorder: 'hover:border-purple-400/30',
  },
  'inward-journey': {
    icon: Mountain,
    gradient: 'from-cyan-500 to-blue-600',
    gradientSecondary: 'from-cyan-400 to-blue-500',
    bgColor: 'rgb(6, 182, 212)',
    borderColor: 'border-cyan-500/20',
    hoverBorder: 'hover:border-cyan-400/30',
  },
  'energy-bodies': {
    icon: Sparkles,
    gradient: 'from-amber-500 to-orange-600',
    gradientSecondary: 'from-amber-400 to-orange-500',
    bgColor: 'rgb(245, 158, 11)',
    borderColor: 'border-amber-500/20',
    hoverBorder: 'hover:border-amber-400/30',
  },
  'heart-wisdom': {
    icon: Heart,
    gradient: 'from-pink-500 to-rose-600',
    gradientSecondary: 'from-pink-400 to-rose-500',
    bgColor: 'rgb(236, 72, 153)',
    borderColor: 'border-pink-500/20',
    hoverBorder: 'hover:border-pink-400/30',
  },
  'shadow-work': {
    icon: Brain,
    gradient: 'from-violet-600 to-purple-700',
    gradientSecondary: 'from-violet-500 to-purple-600',
    bgColor: 'rgb(124, 58, 237)',
    borderColor: 'border-violet-500/20',
    hoverBorder: 'hover:border-violet-400/30',
  }
};

function getPathUnlockCost(index: number): number {
  const costs = [0, 100, 200, 300, 500];
  return costs[index] || 500;
}

interface PathCardProps {
  path: any;
  index: number;
  isUnlocked: boolean;
  progress: number;
  onSelect: (path: any) => void;
}

const PathCard: React.FC<PathCardProps> = ({ path, index, isUnlocked, progress, onSelect }) => {
  const [isHovered, setIsHovered] = useState(false);
  const config = pathConfigs[path.id] || pathConfigs['the-self'];
  const Icon = config.icon;
  const unlockCost = getPathUnlockCost(index);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        delay: index * 0.08,
        type: "spring",
        stiffness: 100,
        damping: 20
      }}
      whileHover={isUnlocked ? { y: -4 } : {}}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onSelect(path)}
      className="relative group cursor-pointer"
    >
      <div className={`
        relative h-[240px] rounded-xl overflow-hidden
        bg-gradient-to-br from-gray-900/95 via-black/95 to-gray-900/95
        border backdrop-blur-xl transition-all duration-300
        ${config.borderColor} ${isUnlocked ? config.hoverBorder : ''}
      `}>
        {/* Background gradient */}
        <div className={`
          absolute inset-0 opacity-10
          bg-gradient-to-br ${config.gradient}
        `} />
        
        {/* Progress ring for unlocked paths */}
        {isUnlocked && progress > 0 && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="absolute top-3 right-3 z-10"
          >
            <div className="relative w-10 h-10">
              <svg className="w-10 h-10 transform -rotate-90">
                <circle
                  cx="20"
                  cy="20"
                  r="16"
                  stroke="rgba(255,255,255,0.1)"
                  strokeWidth="2"
                  fill="none"
                />
                <motion.circle
                  cx="20"
                  cy="20"
                  r="16"
                  stroke={config.bgColor}
                  strokeWidth="2"
                  fill="none"
                  strokeLinecap="round"
                  strokeDasharray={`${progress} 100`}
                  initial={{ strokeDasharray: "0 100" }}
                  animate={{ strokeDasharray: `${progress} 100` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-white font-bold text-[10px]">{progress}%</span>
              </div>
            </div>
          </motion.div>
        )}
        
        {/* Lock overlay for locked paths */}
        {!isUnlocked && (
          <div className="absolute inset-0 bg-black/70 backdrop-blur-md z-10 flex items-center justify-center">
            <motion.div 
              className="text-center"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: index * 0.1 + 0.2 }}
            >
              <Lock className="w-10 h-10 text-gray-400 mx-auto mb-2" />
              <p className="text-white font-bold text-sm mb-1">Locked Path</p>
              <p className="text-amber-400 font-semibold text-xs">
                {unlockCost === 0 ? 'Free to Start' : `${unlockCost} XP to Unlock`}
              </p>
            </motion.div>
          </div>
        )}
        
        {/* Main content */}
        <div className="relative h-full p-5 flex flex-col justify-between z-5">
          {/* Icon and title section */}
          <div className="flex flex-col items-center text-center">
            <motion.div
              animate={{ 
                scale: isHovered && isUnlocked ? 1.05 : 1,
              }}
              transition={{ type: "spring", stiffness: 300 }}
              className="relative mb-3"
            >
              <motion.div
                className={`absolute inset-0 rounded-lg blur-lg ${
                  isUnlocked ? `bg-gradient-to-br ${config.gradient}` : 'bg-gray-700'
                }`}
                animate={{
                  opacity: isHovered && isUnlocked ? 0.6 : 0.3,
                }}
              />
              
              <div className={`
                relative w-12 h-12 rounded-lg flex items-center justify-center
                ${isUnlocked 
                  ? `bg-gradient-to-br ${config.gradient}` 
                  : 'bg-gray-800'
                }
                shadow-lg transition-all duration-300
              `}>
                <Icon className={`w-6 h-6 ${isUnlocked ? 'text-white' : 'text-gray-600'}`} />
              </div>
            </motion.div>
            
            <h3 className={`
              text-lg font-bold mb-1 transition-all
              ${isUnlocked ? 'text-white' : 'text-gray-400'}
            `}>
              {path.title}
            </h3>
            <p className={`text-[11px] mb-3 ${isUnlocked ? 'text-gray-300' : 'text-gray-500'}`}>
              {path.subtitle}
            </p>
          </div>
          
          {/* Stats badges */}
          <div className="flex justify-center gap-2 mb-3">
            <div className={`
              flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px]
              ${isUnlocked 
                ? 'bg-black/40 backdrop-blur-sm border border-white/10' 
                : 'bg-gray-900/50 border border-gray-700/50'
              }
            `}>
              <Zap className={`w-2.5 h-2.5 ${isUnlocked ? 'text-amber-400' : 'text-gray-500'}`} />
              <span className={isUnlocked ? 'text-amber-300 font-medium' : 'text-gray-500'}>
                +{path.totalXP}
              </span>
            </div>
            
            <div className={`
              flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px]
              ${isUnlocked 
                ? 'bg-black/40 backdrop-blur-sm border border-white/10' 
                : 'bg-gray-900/50 border border-gray-700/50'
              }
            `}>
              <Clock className={`w-2.5 h-2.5 ${isUnlocked ? 'text-gray-400' : 'text-gray-600'}`} />
              <span className={isUnlocked ? 'text-gray-300' : 'text-gray-500'}>
                {path.estimatedHours}h
              </span>
            </div>
          </div>
          
          {/* Continue button for unlocked paths */}
          {isUnlocked && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <button className={`
                w-full py-1.5 px-3 rounded-lg font-medium text-[11px]
                bg-gradient-to-r ${config.gradientSecondary}
                text-white shadow-lg
                hover:shadow-xl transition-all
                flex items-center justify-center gap-1
                group
              `}>
                <span>{progress > 0 ? 'Continue' : 'Start'} Path</span>
                <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

interface PathsViewProps {
  paths: any[];
  unlockedPaths: string[];
  userPathProgress: Record<string, number>;
  userXP: number;
  onPathSelect: (path: any) => void;
}

export default function PathsView({ 
  paths, 
  unlockedPaths, 
  userPathProgress, 
  userXP,
  onPathSelect 
}: PathsViewProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {paths.map((path, index) => (
        <PathCard
          key={path.id}
          path={path}
          index={index}
          isUnlocked={index === 0 || unlockedPaths.includes(path.id)}
          progress={userPathProgress[path.id] || 0}
          onSelect={onPathSelect}
        />
      ))}
    </div>
  );
}