// src/features/yin/components/quests-and-challenges/challenges/ChallengeTile.tsx
// Version: 7.1.0 - Fixed syntax and quest completion tracking

import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle, ChevronDown, Crown, Diamond, Lock, Star, Trophy, Zap } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React from 'react';
import { ChallengeDefinition } from './ChallengeRegistry';

interface ChallengeTileProps {
  challenge: ChallengeDefinition & {
    progress: number;
    completed: boolean;
    locked: boolean;
    completedReqs?: string[];
  };
  index: number;
}

// Quest configuration
const QUEST_CONFIG = {
  'meditation': {
    title: 'Mindful Meditation',
    icon: '🧘',
    path: '/yin?quest=meditation',
    color: 'from-purple-500 to-indigo-500'
  },
  'gratitude': {
    title: 'Gratitude Journal',
    icon: '🙏',
    path: '/yin?quest=gratitude',
    color: 'from-pink-500 to-rose-500'
  },
  'movement': {
    title: 'Energy Flow',
    icon: '💫',
    path: '/yin?quest=movement',
    color: 'from-green-500 to-teal-500'
  },
  'planning': {
    title: 'Set Daily Intention',
    icon: '🎯',
    path: '/yin?quest=planning',
    color: 'from-blue-500 to-cyan-500'
  },
  'reflection': {
    title: 'Capture Insight',
    icon: '💡',
    path: '/yin?quest=reflection',
    color: 'from-yellow-500 to-amber-500'
  },
  'journaling': {
    title: 'Journaling',
    icon: '📝',
    path: '/yin?quest=journaling',
    color: 'from-indigo-500 to-purple-500'
  }
};

const getQuestTitle = (id: string): string => {
  const config = QUEST_CONFIG[id as keyof typeof QUEST_CONFIG];
  return config?.title || `${id.charAt(0).toUpperCase() + id.slice(1)}`;
};

const getTierIcon = (tier?: number) => {
  if (tier === 1) return Diamond;
  if (tier === 2) return Crown;
  if (tier === 3) return Star;
  return Trophy;
};

const getQuestCompletionStatus = (): Record<string, boolean> => {
  const saved = localStorage.getItem('quest_progress');
  if (!saved) return {};
  try {
    return JSON.parse(saved);
  } catch {
    return {};
  }
};

export const ChallengeTile: React.FC<ChallengeTileProps> = ({ challenge, index }) => {
  console.log(`Data for challenge "${challenge.name}":`, challenge);
  
  const [isExpanded, setIsExpanded] = React.useState(false);
  const router = useRouter();

  // Get current quest completion status
  const questCompletionStatus = getQuestCompletionStatus();
  
  // These are needed for the requirements mapping
  const requirementsById = challenge.questTracking?.trackQuestsById || [];
  const requirementsByCategory = challenge.questTracking?.trackQuestCategories || [];
  const allRequirements = [...requirementsById, ...requirementsByCategory];
  
  const TierIcon = getTierIcon(challenge.tier);
  
// Check if requirements are met based on current quest status
  const checkRequirementsMet = () => {
     const completedReqs: string[] = [];

    // FIX: Iterate through the combined list of all requirements
    allRequirements.forEach(reqId => {
      if (questCompletionStatus[reqId]) {
        completedReqs.push(reqId);
      }
    });
    
    return completedReqs;
  };
  
  // Use actual completion status instead of stored completedReqs
  const actualCompletedReqs = checkRequirementsMet();
  const progress = actualCompletedReqs.length;
  const progressPercentage = challenge.required > 0 ? (progress / challenge.required) * 100 : 0;

  const handleNavigate = (path: string) => {
    setIsExpanded(false);
    router.push(path);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden shadow-lg"
    >
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-6 text-left hover:bg-white/5 transition-colors"
      >
        <div className="flex items-center gap-5">
          {/* Icon with tier badge */}
          <div className="relative">
            <div className={`w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg flex items-center justify-center shadow-md ${challenge.locked ? 'opacity-50' : ''}`}>
              {challenge.locked ? (
                <Lock className="w-8 h-8 text-white/70" />
              ) : challenge.completed ? (
                <CheckCircle className="w-8 h-8 text-green-300" />
              ) : (
                <Trophy className="w-8 h-8 text-white" />
              )}
            </div>
            {/* Tier badge */}
            {challenge.tier && (
              <div className="absolute -top-2 -right-2 w-7 h-7 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-md border border-white/20">
                <TierIcon className="w-4 h-4 text-white" />
              </div>
            )}
          </div>
          
          <div>
            <h3 className="text-xl font-bold text-white">{challenge.name}</h3>
            <p className="text-white/70">{challenge.description}</p>
            
            {/* Status indicators */}
            {challenge.locked && (
              <div className="flex items-center gap-2 mt-2">
                <Lock className="w-4 h-4 text-white/50" />
                <span className="text-white/50 text-sm">
                  Complete Tier {(challenge.tier || 1) - 1} to unlock
                </span>
              </div>
            )}
            
            {challenge.completed && (
              <div className="flex items-center gap-2 mt-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span className="text-green-400 text-sm font-semibold">
                  Victory Achieved!
                </span>
              </div>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-yellow-400" />
            <span className="text-xl font-bold text-yellow-400">+{challenge.xp} XP</span>
          </div>
          <motion.div animate={{ rotate: isExpanded ? 180 : 0 }}>
            <ChevronDown className="w-6 h-6 text-white/70" />
          </motion.div>
        </div>
      </button>

      {/* Requirements Section */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-6 pt-2">
              <div className="bg-black/20 p-4 rounded-lg border border-white/10">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-white">Requirements to Complete:</h4>
                  <span className="px-2 py-1 bg-white/10 rounded-full text-xs font-bold text-white/80">
                    {actualCompletedReqs.length} / {allRequirements.length}
                  </span>
                </div>
                
                <ul className="space-y-3">
                  {allRequirements.map((reqId, idx) => {
                    // Check actual completion status from localStorage
                    const isComplete = questCompletionStatus[reqId] || false;
                    const isCategory = requirementsByCategory.includes(reqId);
                    const questConfig = !isCategory ? QUEST_CONFIG[reqId as keyof typeof QUEST_CONFIG] : null;
                    const title = isCategory 
                      ? `Complete any quest in the "${getQuestTitle(reqId)}" category` 
                      : `Complete the "${getQuestTitle(reqId)}" quest`;

                    return (
                      <motion.li 
                        key={reqId} 
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: idx * 0.05 }}
                        className="flex items-center justify-between p-3 bg-white/5 rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          {/* Icon/Status */}
                          {isComplete ? (
                            <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                          ) : questConfig ? (
                            <span className="text-xl flex-shrink-0">{questConfig.icon}</span>
                          ) : (
                            <Star className="w-5 h-5 text-amber-400 flex-shrink-0" />
                          )}
                          
                          {/* Title */}
                          <div className="flex flex-col">
                            <span className={`text-sm ${isComplete ? 'text-gray-500 line-through' : 'text-white/80'}`}>
                              {title}
                            </span>
                            {!isComplete && !isCategory && (
                              <span className="text-xs text-white/50 mt-0.5">
                                Available in quest section
                              </span>
                            )}
                          </div>
                        </div>
                        
                        {/* Status badges only - no action buttons */}
                        {!isComplete && (
                          <div className="px-3 py-1 bg-white/10 rounded-full">
                            <span className="text-xs font-bold text-white/50">Not yet started</span>
                          </div>
                        )}
                        
                        {isComplete && (
                          <div className="px-3 py-1 bg-green-500/20 rounded-full">
                            <span className="text-xs font-bold text-green-400">Completed</span>
                          </div>
                        )}
                      </motion.li>
                    );
                  })}
                  
                  {/* Fallback for when no requirements data is available */}
                  {allRequirements.length === 0 && challenge.id === 'first-steps' && (
                    <>
                      {['meditation', 'gratitude', 'movement'].map((questId, idx) => {
                        const questConfig = QUEST_CONFIG[questId as keyof typeof QUEST_CONFIG];
                        const isComplete = questCompletionStatus[questId] || false;
                        
                        return (
                          <motion.li
                            key={questId}
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: idx * 0.05 }}
                            className="flex items-center justify-between p-3 bg-white/5 rounded-lg"
                          >
                            <div className="flex items-center gap-3">
                              {isComplete ? (
                                <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                              ) : (
                                <span className="text-xl flex-shrink-0">{questConfig?.icon}</span>
                              )}
                              <div className="flex flex-col">
                                <span className={`text-sm ${isComplete ? 'text-gray-500 line-through' : 'text-white/80'}`}>
                                  Complete the "{questConfig?.title}" quest
                                </span>
                                {!isComplete && (
                                  <span className="text-xs text-white/50 mt-0.5">
                                    Available in quest section
                                  </span>
                                )}
                              </div>
                            </div>
                            
                            {!isComplete && (
                              <div className="px-3 py-1 bg-white/10 rounded-full">
                                <span className="text-xs font-bold text-white/50">Not yet started</span>
                              </div>
                            )}
                            
                            {isComplete && (
                              <div className="px-3 py-1 bg-green-500/20 rounded-full">
                                <span className="text-xs font-bold text-green-400">Completed</span>
                              </div>
                            )}
                          </motion.li>
                        );
                      })}
                    </>
                  )}
                </ul>
                
                {/* Footer */}
                  {actualCompletedReqs.length < challenge.required && (
                  <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between">
                    <span className="text-xs text-white/50">
                      Complete {challenge.required - progress} more to unlock reward
                    </span>
                    <div className="flex items-center gap-2">
                      <Trophy className="w-4 h-4 text-yellow-400" />
                      <span className="text-xs font-bold text-yellow-400">
                        {challenge.xp} XP waiting
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Progress bar */}
      {!challenge.locked && !challenge.completed && (
        <div className="relative h-4 bg-black/30">
          <motion.div
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-amber-400 to-orange-500"
            initial={{ width: 0 }}
            animate={{ width: `${progressPercentage}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-white font-bold text-xs drop-shadow-lg">
            {actualCompletedReqs.length} / {challenge.required}
          </span>
          </div>
        </div>
      )}
    </motion.div>
  );
};