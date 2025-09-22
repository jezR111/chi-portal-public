// src/features/yin/components/chapters/PathsView.tsx

import { AnimatePresence, motion } from 'framer-motion';
import {
  BookOpen,
  ChevronRight,
  Clock,
  Eye,
  Flame,
  Play,
  Star,
  Target,
  TrendingUp,
  Trophy,
  Zap
} from 'lucide-react';
import React, { useState } from 'react';
import { getPathUnlockCost } from '../../config/xpConfig';
import { PathData, pathsData } from '../../data/enhancedPathsData';

interface PathsViewProps {
  userXP: number;
  userProgress: Record<string, number>;
  onPathSelect: (path: PathData) => void;
  unlockedPaths: string[];
  onResume?: (progressData: any) => void; // Add this prop
}

// Learning Stats Widget (unchanged)
const LearningStats: React.FC<{ 
  userXP: number, 
  userProgress: Record<string, number>,
  unlockedPaths: string[] 
}> = ({ userXP, userProgress, unlockedPaths }) => {
  const totalPathsStarted = Object.keys(userProgress).filter(k => userProgress[k] > 0).length;
  const averageProgress = Object.values(userProgress).reduce((a, b) => a + b, 0) / (Object.keys(userProgress).length || 1);
  const streak = 7;
  const todayGoal = 30;
  const todayProgress = 15;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-gradient-to-br from-purple-900/50 to-indigo-900/50 backdrop-blur-xl rounded-2xl p-6 border border-purple-500/20"
      >
        <div className="flex items-center justify-between mb-3">
          <Target className="w-5 h-5 text-purple-400" />
          <span className="text-xs text-purple-300">Daily Goal</span>
        </div>
        <div className="mb-2">
          <span className="text-2xl font-bold text-white">{todayProgress}</span>
          <span className="text-purple-300 text-sm">/{todayGoal} min</span>
        </div>
        <div className="h-2 bg-black/30 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
            initial={{ width: 0 }}
            animate={{ width: `${(todayProgress / todayGoal) * 100}%` }}
            transition={{ duration: 1 }}
          />
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-gradient-to-br from-orange-900/50 to-red-900/50 backdrop-blur-xl rounded-2xl p-6 border border-orange-500/20"
      >
        <div className="flex items-center justify-between mb-3">
          <Flame className="w-5 h-5 text-orange-400" />
          <span className="text-xs text-orange-300">Streak</span>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-bold text-white">{streak}</span>
          <span className="text-orange-300 text-sm">days</span>
        </div>
        <p className="text-orange-200/60 text-xs mt-1">Keep it going!</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-gradient-to-br from-amber-900/50 to-yellow-900/50 backdrop-blur-xl rounded-2xl p-6 border border-amber-500/20"
      >
        <div className="flex items-center justify-between mb-3">
          <Zap className="w-5 h-5 text-amber-400" />
          <span className="text-xs text-amber-300">Your XP</span>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-bold text-white">{userXP}</span>
          <span className="text-amber-300 text-sm">XP</span>
        </div>
        <p className="text-amber-200/60 text-xs mt-1">50 XP to next unlock</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-gradient-to-br from-emerald-900/50 to-teal-900/50 backdrop-blur-xl rounded-2xl p-6 border border-emerald-500/20"
      >
        <div className="flex items-center justify-between mb-3">
          <TrendingUp className="w-5 h-5 text-emerald-400" />
          <span className="text-xs text-emerald-300">Progress</span>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-bold text-white">{Math.round(averageProgress)}%</span>
        </div>
        <p className="text-emerald-200/60 text-xs mt-1">{totalPathsStarted} paths started</p>
      </motion.div>
    </div>
  );
};

// UPDATED RecommendedNext Component - Now uses state navigation
const RecommendedNext: React.FC<{ 
  userProgress: Record<string, number>,
  onPathSelect: (path: PathData) => void,
  onResume?: (progressData: any) => void // Add onResume prop
}> = ({ userProgress, onPathSelect, onResume }) => {
  
  const inProgressPaths = Object.entries(userProgress)
    .filter(([_, progress]) => progress > 0 && progress < 100)
    .sort(([_, a], [__, b]) => b - a);
  
  if (inProgressPaths.length === 0) return null;
  
  const [recommendedPathId] = inProgressPaths[0];
  const recommendedPath = pathsData.find(p => p.id === recommendedPathId);
  
  if (!recommendedPath) return null;

  const handleResume = () => {
    // First check if we have last lesson progress
    const savedProgress = localStorage.getItem('lastLessonProgress');
    
    if (savedProgress && onResume) {
      const progress = JSON.parse(savedProgress);
      
      // Check if this saved progress is for the recommended path
      if (progress.pathId === recommendedPathId) {
        // Use the onResume callback to navigate using state
        onResume(progress);
      } else {
        // If saved progress is for a different path, just select the recommended path
        onPathSelect(recommendedPath);
      }
    } else {
      // No saved progress, just open the path
      onPathSelect(recommendedPath);
    }
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="mb-6 bg-gradient-to-r from-purple-900/30 to-pink-900/30 backdrop-blur-xl rounded-2xl p-4 border border-purple-500/20"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-purple-600/30 rounded-xl flex items-center justify-center">
            <recommendedPath.icon className="w-5 h-5 text-purple-300" />
          </div>
          <div>
            <p className="text-xs text-purple-400 mb-1">Continue where you left off</p>
            <p className="text-white font-semibold">{recommendedPath.title}</p>
          </div>
        </div>
        <button 
          onClick={handleResume}
          className="flex items-center gap-2 px-4 py-2 bg-purple-600/30 hover:bg-purple-600/40 rounded-xl text-purple-300 text-sm font-medium transition-all"
        >
          Resume
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
};

// PathCard component (unchanged except for minor type fix)
const PathCard: React.FC<{
  path: PathData & { requiredXP: number };
  isUnlocked: boolean;
  userProgress: number;
  onClick: () => void;
  index: number;
  userXP: number;
}> = ({ path, isUnlocked, userProgress, onClick, index, userXP }) => {
  const [showPreview, setShowPreview] = useState(false);
  const Icon = path.icon;
  const canAfford = userXP >= path.requiredXP;

  const handleClick = () => {
    if (isUnlocked) {
      onClick();
    } else {
      setShowPreview(true);
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.05, duration: 0.3 }}
        whileHover={{ scale: 1.02 }}
        className="relative"
      >
        <div
          onClick={handleClick}
          className={`
            relative h-72 rounded-3xl overflow-hidden cursor-pointer
            transition-all duration-300 hover:shadow-xl
            ${isUnlocked ? 'hover:shadow-purple-500/20' : 'hover:shadow-gray-500/10'}
          `}
        >
          <div className={`
            absolute inset-0 
            ${isUnlocked 
              ? `bg-gradient-to-br ${path.gradient}` 
              : 'bg-gradient-to-br from-gray-900 to-gray-800'
            }
          `} />
          
          {!isUnlocked && (
            <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />
          )}

          <div className="relative h-full p-6 flex flex-col">
            <div className="flex justify-between items-start mb-4">
              <div className={`
                w-14 h-14 rounded-2xl flex items-center justify-center
                ${isUnlocked 
                  ? 'bg-white/20 backdrop-blur-sm' 
                  : 'bg-white/10'
                }
              `}>
                <Icon className={`w-7 h-7 ${isUnlocked ? 'text-white' : 'text-gray-400'}`} />
              </div>
              
              <div className="flex flex-col gap-2 items-end">
                {path.featured && isUnlocked && (
                  <div className="bg-white/20 backdrop-blur-sm px-2 py-1 rounded-full">
                    <Star className="w-3 h-3 text-yellow-300" fill="currentColor" />
                  </div>
                )}
                {path.new && (
                  <div className="bg-emerald-500 px-2 py-0.5 rounded-full">
                    <span className="text-white text-[10px] font-bold">NEW</span>
                  </div>
                )}
                {!isUnlocked && (
                  <div className={`
                    px-3 py-1 rounded-full text-xs font-semibold
                    ${canAfford 
                      ? 'bg-green-500/20 text-green-300 border border-green-500/30' 
                      : 'bg-red-500/20 text-red-300 border border-red-500/30'
                    }
                  `}>
                    {path.requiredXP > 0 ? `${path.requiredXP} XP` : 'Free'}
                  </div>
                )}
              </div>
            </div>

            <div className="flex-1">
              <h3 className={`text-2xl font-bold mb-1 ${isUnlocked ? 'text-white' : 'text-gray-300'}`}>
                {path.title}
              </h3>
              <p className={`text-sm font-medium mb-2 ${isUnlocked ? 'text-white/80' : 'text-gray-400'}`}>
                {path.subtitle}
              </p>
              <p className={`text-xs leading-relaxed line-clamp-2 ${isUnlocked ? 'text-white/60' : 'text-gray-500'}`}>
                {path.description}
              </p>
            </div>

            <div className="space-y-3">
              <div className={`flex items-center gap-3 text-xs ${isUnlocked ? 'text-white/70' : 'text-gray-500'}`}>
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

              {isUnlocked && userProgress > 0 ? (
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-white/60">Progress</span>
                    <span className="text-white font-semibold">{userProgress}%</span>
                  </div>
                  <div className="h-2 bg-black/30 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-white/90 to-white/70"
                      initial={{ width: 0 }}
                      animate={{ width: `${userProgress}%` }}
                      transition={{ duration: 0.8 }}
                    />
                  </div>
                </div>
              ) : !isUnlocked ? (
                <button className={`
                  w-full py-2 rounded-xl text-xs font-semibold transition-all
                  flex items-center justify-center gap-2
                  ${canAfford
                    ? 'bg-purple-600/30 hover:bg-purple-600/40 text-purple-300 border border-purple-500/30'
                    : 'bg-gray-800/50 text-gray-400 border border-gray-700/50'
                  }
                `}>
                  <Eye className="w-3 h-3" />
                  {canAfford ? 'Unlock Path' : 'Preview Content'}
                </button>
              ) : (
                <button className="w-full py-2 bg-white/20 hover:bg-white/30 rounded-xl text-white text-xs font-semibold transition-all flex items-center justify-center gap-2">
                  <Play className="w-3 h-3" />
                  Begin Journey
                </button>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      <AnimatePresence>
        {showPreview && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-8"
            onClick={() => setShowPreview(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-gradient-to-br from-gray-900 to-purple-900 rounded-3xl p-8 max-w-2xl w-full border border-purple-500/30"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start gap-4 mb-6">
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${path.gradient} flex items-center justify-center`}>
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-white mb-2">{path.title}</h2>
                  <p className="text-purple-300">{path.subtitle}</p>
                </div>
              </div>

              <p className="text-purple-100/80 leading-relaxed mb-6">
                {path.longDescription || path.description}
              </p>

              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-black/30 rounded-xl p-4 text-center">
                  <Clock className="w-6 h-6 text-purple-400 mx-auto mb-2" />
                  <p className="text-white font-semibold">{path.estimatedHours} hours</p>
                  <p className="text-purple-300 text-xs">Total time</p>
                </div>
                <div className="bg-black/30 rounded-xl p-4 text-center">
                  <BookOpen className="w-6 h-6 text-purple-400 mx-auto mb-2" />
                  <p className="text-white font-semibold">{path.totalChapters} chapters</p>
                  <p className="text-purple-300 text-xs">{path.totalLessons} lessons</p>
                </div>
                <div className="bg-black/30 rounded-xl p-4 text-center">
                  <Trophy className="w-6 h-6 text-purple-400 mx-auto mb-2" />
                  <p className="text-white font-semibold">+{path.totalXP} XP</p>
                  <p className="text-purple-300 text-xs">Available</p>
                </div>
              </div>

              <div className="flex gap-4">
                {canAfford ? (
                  <>
                    <button
                      onClick={() => {
                        onClick();
                        setShowPreview(false);
                      }}
                      className="flex-1 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl text-white font-semibold hover:shadow-lg hover:shadow-purple-500/25 transition-all"
                    >
                      Unlock for {path.requiredXP} XP
                    </button>
                    <button
                      onClick={() => setShowPreview(false)}
                      className="px-6 py-3 bg-gray-800/50 hover:bg-gray-800/70 rounded-xl text-gray-300 font-semibold transition-all"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <div className="w-full">
                    <div className="py-3 bg-gray-800/50 rounded-xl text-center mb-4">
                      <p className="text-gray-400 font-semibold">
                        Need {path.requiredXP - userXP} more XP
                      </p>
                      <p className="text-gray-500 text-sm mt-1">
                        Current: {userXP} XP | Required: {path.requiredXP} XP
                      </p>
                    </div>
                    
                    <div className="p-4 bg-purple-900/20 rounded-xl border border-purple-500/20 mb-4">
                      <p className="text-purple-300 font-semibold text-sm mb-2">
                        💡 Ways to Earn XP:
                      </p>
                      <ul className="text-purple-200/70 text-xs space-y-1">
                        <li>• Complete lessons: +10 XP each</li>
                        <li>• Finish chapters: +30 XP bonus</li>
                        <li>• Daily practice: +5 XP</li>
                        <li>• Capture insights: +3 XP</li>
                        <li>• Complete meditations: +5 XP</li>
                      </ul>
                    </div>
                    
                    <button
                      onClick={() => setShowPreview(false)}
                      className="w-full px-6 py-3 bg-purple-600/30 hover:bg-purple-600/40 rounded-xl text-purple-300 font-semibold transition-all"
                    >
                      Close
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

// MAIN PathsView Component
const PathsView: React.FC<PathsViewProps> = ({ 
  userXP = 100, 
  userProgress = {}, 
  onPathSelect, 
  unlockedPaths = [],
  onResume // Add this prop
}) => {
  const enhancedProgress = {
    'the-self': 45,
    'inward-journey': 20,
    ...userProgress
  };

  return (
    <div className="min-h-screen">
      <LearningStats 
        userXP={userXP} 
        userProgress={enhancedProgress} 
        unlockedPaths={unlockedPaths}
      />

      {/* Pass onResume to RecommendedNext */}
      <RecommendedNext 
        userProgress={enhancedProgress} 
        onPathSelect={onPathSelect}
        onResume={onResume} 
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {pathsData.map((path, index) => {
          const unlockedCount = unlockedPaths.length;
          let pathRequiredXP = 0;
          
          if (!unlockedPaths.includes(path.id)) {
            pathRequiredXP = getPathUnlockCost(unlockedCount + 1);
          }
          
          const pathWithXP = { ...path, requiredXP: pathRequiredXP };
          
          return (
            <PathCard
              key={path.id}
              path={pathWithXP}
              isUnlocked={unlockedPaths.includes(path.id)}
              userProgress={enhancedProgress[path.id] || 0}
              onClick={() => onPathSelect(path)}
              index={index}
              userXP={userXP}
            />
          );
        })}
      </div>
    </div>
  );
};

export default PathsView;