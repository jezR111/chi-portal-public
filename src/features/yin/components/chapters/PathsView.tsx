// src/features/yin/components/chapters/PathsView.tsx
import { motion } from 'framer-motion';
import {
  BookOpen,
  ChevronRight,
  Clock,
  Lock,
  Star,
  Zap
} from 'lucide-react';
import React from 'react';
import { getUnlockedPaths, PathData, pathsData } from '../../data/enhancedPathsData';

interface PathsViewProps {
  userXP: number;
  userProgress: Record<string, number>;
  onPathSelect: (path: PathData) => void;
}

const PathCard: React.FC<{
  path: PathData;
  isUnlocked: boolean;
  userProgress: number;
  onClick: () => void;
  index: number;
}> = ({ path, isUnlocked, userProgress, onClick, index }) => {
  const Icon = path.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      whileHover={isUnlocked ? { scale: 1.02 } : {}}
      className="relative"
    >
      <div
        onClick={isUnlocked ? onClick : undefined}
        className={`
          relative h-64 rounded-3xl overflow-hidden
          ${isUnlocked ? 'cursor-pointer' : 'cursor-not-allowed'}
          transition-all duration-300
        `}
      >
        {/* Background gradient - different for locked vs unlocked */}
        {isUnlocked ? (
          <div className={`absolute inset-0 bg-gradient-to-br ${path.gradient}`} />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900/90 to-gray-800/90" />
        )}
        
        {/* Subtle pattern overlay */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.1),transparent_50%)]" />
        </div>

        {/* Content for unlocked paths */}
        {isUnlocked ? (
          <div className="relative h-full p-6 flex flex-col">
            {/* Top badges */}
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-2">
                {/* Tier badge */}
                <div className={`
                  px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider
                  bg-white/20 text-white/90 backdrop-blur-sm
                `}>
                  {path.tier}
                </div>
              </div>
              <div className="flex gap-1">
                {path.featured && (
                  <div className="w-6 h-6 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                    <Star className="w-3 h-3 text-yellow-300" fill="currentColor" />
                  </div>
                )}
                {path.new && (
                  <div className="px-2 py-0.5 bg-emerald-500 rounded-full">
                    <span className="text-white text-[10px] font-bold">NEW</span>
                  </div>
                )}
              </div>
            </div>

            {/* Main content */}
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-white mb-1">{path.title}</h3>
              <p className="text-white/80 text-sm font-medium mb-2">{path.subtitle}</p>
              <p className="text-white/60 text-xs leading-relaxed line-clamp-2">{path.description}</p>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-4 text-white/70 text-xs mb-3">
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {path.estimatedHours}h
              </span>
              <span className="flex items-center gap-1">
                <BookOpen className="w-3 h-3" />
                {path.totalChapters} chapters
              </span>
              <span className="flex items-center gap-1">
                <Zap className="w-3 h-3" />
                +{path.totalXP} XP
              </span>
            </div>

            {/* Progress bar */}
            {userProgress > 0 && (
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-white/60">Progress</span>
                  <span className="text-white font-semibold">{userProgress}%</span>
                </div>
                <div className="h-2 bg-black/30 rounded-full overflow-hidden backdrop-blur-sm">
                  <motion.div
                    className="h-full bg-gradient-to-r from-white/90 to-white/70"
                    initial={{ width: 0 }}
                    animate={{ width: `${userProgress}%` }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                  />
                </div>
              </div>
            )}
          </div>
        ) : (
          // Content for locked paths
          <div className="relative h-full flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-3">
                <Lock className="w-8 h-8 text-white/40" />
              </div>
              <p className="text-white/60 text-sm font-medium mb-1">Requires {path.requiredXP} XP</p>
              <p className="text-white/40 text-xs">Complete prerequisites first</p>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

const JourneyMap: React.FC<{ userProgress: Record<string, number>, unlockedPaths: string[] }> = ({ userProgress, unlockedPaths }) => {
  const tiers = [
    { name: 'Foundation', count: 2, color: 'from-blue-500 to-blue-600' },
    { name: 'Intermediate', count: 3, color: 'from-purple-500 to-purple-600' },
    { name: 'Advanced', count: 1, color: 'from-orange-500 to-orange-600' },
    { name: 'Mastery', count: 2, color: 'from-amber-500 to-yellow-500' }
  ];

  return (
    <div className="flex items-center justify-center gap-4 mb-12">
      {tiers.map((tier, index) => (
        <React.Fragment key={tier.name}>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: index * 0.1, type: "spring" }}
            className="text-center"
          >
            <div className={`
              w-32 h-32 rounded-full flex items-center justify-center relative
              ${pathsData.filter(p => p.tier.toLowerCase() === tier.name.toLowerCase())
                .some(p => unlockedPaths.includes(p.id))
                ? `bg-gradient-to-br ${tier.color}` 
                : 'bg-gray-800/50'}
              shadow-2xl
            `}>
              <div>
                <div className="text-white font-bold text-lg">{tier.name}</div>
                <div className="text-white/70 text-xs">{tier.count} paths</div>
              </div>
            </div>
          </motion.div>
          {index < tiers.length - 1 && (
            <ChevronRight className="w-6 h-6 text-purple-400/30" />
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

const PathsView: React.FC<PathsViewProps> = ({ userXP = 250, userProgress = {}, onPathSelect }) => {
  const unlockedPaths = getUnlockedPaths(userXP, userProgress);

  // Add some demo progress
  const enhancedProgress = {
    'the-self': 45,
    'inward-journey': 20,
    ...userProgress
  };

  return (
    <div className="min-h-screen">
      {/* Journey Map */}
      <JourneyMap userProgress={enhancedProgress} unlockedPaths={unlockedPaths} />

      {/* Paths Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {pathsData.map((path, index) => (
          <PathCard
            key={path.id}
            path={path}
            isUnlocked={unlockedPaths.includes(path.id)}
            userProgress={enhancedProgress[path.id] || 0}
            onClick={() => onPathSelect(path)}
            index={index}
          />
        ))}
      </div>
    </div>
  );
};

export default PathsView;