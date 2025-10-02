// src/features/yin/components/chapters/PathsView.tsx
// Version: 16.0 - Polished Active Path UI, Functional XP, and Simplified Cards

import { AnimatePresence, motion } from 'framer-motion';
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
import React, { useState } from 'react';

// --- CONFIGURATION ---
const DEACTIVATE_PATH_COST = 75;
const ACTIVATE_PATH_COST = 25;

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

// ============================================================================
// --- REUSABLE UI COMPONENTS ---
// ============================================================================

const ConfirmationDialog: React.FC<{
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  title: string;
  description: React.ReactNode;
  confirmText: string;
}> = ({ isOpen, onConfirm, onCancel, title, description, confirmText }) => (
  <AnimatePresence>
    {isOpen && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
        onClick={onCancel}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-md rounded-2xl bg-gradient-to-br from-gray-900 to-black p-6 border border-purple-500/20 shadow-2xl"
        >
          <h2 className="text-xl font-bold text-white">{title}</h2>
          <div className="mt-2 text-sm text-gray-400">{description}</div>
          <div className="mt-6 flex justify-end gap-3">
            <button onClick={onCancel} className="px-4 py-2 rounded-lg text-sm font-medium text-gray-300 bg-white/5 hover:bg-white/10 transition-colors">
              Cancel
            </button>
            <button onClick={onConfirm} className="px-4 py-2 rounded-lg text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 transition-colors">
              {confirmText}
            </button>
          </div>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);

const PathCard: React.FC<{
  path: any;
  index: number;
  onSetActive: (path: any) => void;
}> = ({ path, index, onSetActive }) => {
  const config = pathConfigs[path.id] || pathConfigs['the-self'];
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, type: "spring", stiffness: 100, damping: 20 }}
      className="relative group"
    >
      <div className={`relative h-full min-h-[260px] rounded-xl overflow-hidden bg-gradient-to-br from-gray-900/80 via-black/80 to-gray-900/80 border backdrop-blur-xl transition-all duration-300 ${config.borderColor} hover:border-purple-400/30`}>
        <div className={`absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity bg-gradient-to-br ${config.gradient}`} />
        <div className="relative h-full p-5 flex flex-col justify-between z-5">
            <div className="flex flex-col items-center text-center">
                <motion.div whileHover={{ scale: 1.05 }} transition={{ type: "spring", stiffness: 300 }} className="relative mb-3">
                    <motion.div className={`absolute inset-0 rounded-lg blur-lg bg-gradient-to-br ${config.gradient}`} initial={{opacity: 0.3}} whileHover={{opacity: 0.6}} />
                    <div className={`relative w-12 h-12 rounded-lg flex items-center justify-center bg-gradient-to-br ${config.gradient} shadow-lg transition-all duration-300`}><Icon className="w-6 h-6 text-white" /></div>
                </motion.div>
                <h3 className="text-lg font-bold mb-1 text-white">{path.title}</h3>
                <p className="text-[11px] mb-3 text-gray-300">{path.subtitle}</p>
            </div>
            <div className="flex justify-center gap-2 mb-3">
                <div className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] bg-black/40 backdrop-blur-sm border border-white/10"><Zap className="w-2.5 h-2.5 text-amber-400" /><span className="text-amber-300 font-medium">+{path.totalXP}</span></div>
                <div className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] bg-black/40 backdrop-blur-sm border border-white/10"><Clock className="w-2.5 h-2.5 text-gray-400" /><span className="text-gray-300">{path.estimatedHours}h</span></div>
            </div>
            <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                <button onClick={() => onSetActive(path)} className={`w-full py-2 px-3 rounded-lg font-semibold text-sm bg-gradient-to-r ${config.gradientSecondary} text-white shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-1`}>
                    <span>Set as Active Path</span>
                </button>
            </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

const LockedPathCard: React.FC<{ path: any; index: number; onSelect: (path:any) => void }> = ({ path, index, onSelect }) => {
    const unlockCost = getPathUnlockCost(index);
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05, type: "spring", stiffness: 100, damping: 20 }}
            className="relative h-28 bg-gray-900/50 rounded-xl border border-gray-700/50 flex items-center justify-center text-center p-4 cursor-pointer hover:bg-gray-900/80 transition-colors"
            onClick={() => onSelect(path)}
        >
            <Lock className="w-6 h-6 text-gray-500 mb-2" />
            <div className="ml-4 text-left">
                <p className="text-gray-400 font-semibold text-sm">{path.title}</p>
                <p className="text-amber-400 font-medium text-xs">{unlockCost > 0 ? `${unlockCost} XP to Unlock` : 'Complete previous path'}</p>
            </div>
        </motion.div>
    );
}

const ActivePathCard: React.FC<{ path: any; onDeactivate: () => void; onExplore: (path: any) => void; onResume: (path: any) => void; }> = ({ path, onDeactivate, onExplore, onResume }) => {
    const config = pathConfigs[path.id] || pathConfigs['the-self'];
    const Icon = config.icon;
    return(
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
            className="relative group rounded-2xl overflow-hidden border border-purple-400/30 bg-gradient-to-br from-purple-900/80 via-black/80 to-purple-900/80 p-6 shadow-2xl shadow-purple-900/50"
        >
            <div className="flex flex-col md:flex-row items-center gap-6">
                <motion.div whileHover={{ scale: 1.05 }} className={`relative w-24 h-24 rounded-2xl flex items-center justify-center bg-gradient-to-br ${config.gradient} shadow-lg shrink-0`}>
                    <motion.div className={`absolute inset-0 rounded-2xl blur-xl bg-gradient-to-br ${config.gradient}`} animate={{ opacity: 0.5 }}/>
                    <Icon className="w-12 h-12 text-white" />
                </motion.div>
                <div className="flex-1 text-center md:text-left">
                    <p className="text-sm font-semibold text-purple-300">YOUR ACTIVE PATH</p>
                    <h2 className="text-3xl font-bold text-white mt-1">{path.title}</h2>
                    <p className="text-gray-300 mt-2">{path.description}</p>
                    <div className="flex items-center gap-4 mt-4 justify-center md:justify-start">
                        <div className="flex items-center gap-1.5 text-sm"><Zap className="w-4 h-4 text-amber-400" /><span className="text-amber-300 font-medium">+{path.totalXP} XP</span></div>
                        <div className="flex items-center gap-1.5 text-sm"><Clock className="w-4 h-4 text-gray-400" /><span className="text-gray-300">{path.estimatedHours}h Est.</span></div>
                    </div>
                </div>
                <div className="w-full md:w-auto flex flex-col items-center gap-3">
                     <button onClick={() => onResume(path)} className="w-full md:w-48 py-3 px-6 rounded-xl font-semibold bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all flex items-center justify-center gap-2 group">
                        <span>Resume</span>
                        <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                    <div className="flex items-center gap-4">
                        <button onClick={() => onExplore(path)} className="px-4 py-2 text-xs bg-white/5 hover:bg-white/10 rounded-md text-gray-300 transition-colors">Explore Path</button>
                        <button onClick={onDeactivate} className="text-xs text-gray-500 hover:text-gray-400 transition-colors">Change Focus</button>
                    </div>
                </div>
            </div>
        </motion.div>
    )
}

// ============================================================================
// --- MAIN VIEW COMPONENT ---
// ============================================================================

interface PathsViewProps {
  paths: any[];
  unlockedPaths: string[];
  userPathProgress: Record<string, number>;
  userXP: number;
  onPathSelect: (path: any) => void;
  // NOTE: These props are now optional to prevent runtime errors.
  // The component will manage state internally if they are not provided.
  activePathId?: string | null;
  onSetActivePath?: (pathId: string | null) => void;
  onUpdateXP?: (newXP: number) => void;
}

export default function PathsView({ 
  paths, 
  unlockedPaths, 
  userPathProgress, 
  userXP,
  onPathSelect,
  activePathId: activePathIdProp,
  onSetActivePath,
  onUpdateXP
}: PathsViewProps) {

  // Internal state management as a fallback if props are not provided
  const [internalActivePathId, setInternalActivePathId] = useState<string | null>(paths.find((p, i) => i === 0 || unlockedPaths.includes(p.id))?.id || null);
  const [internalUserXP, setInternalUserXP] = useState(userXP);

  const activePathId = onSetActivePath ? activePathIdProp : internalActivePathId;
  const currentXP = onUpdateXP ? userXP : internalUserXP;
  
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    path: any | null;
    action: 'activate' | 'deactivate' | null;
  }>({ isOpen: false, path: null, action: null });

  const handleOpenModal = (path: any, action: 'activate' | 'deactivate') => {
    setModalState({ isOpen: true, path, action });
  };

  const handleCloseModal = () => {
    setModalState({ isOpen: false, path: null, action: null });
  };
  
  const handleConfirmAction = () => {
    if (modalState.path && modalState.action) {
      let cost = 0;
      let newActivePathId: string | null = activePathId;

      if (modalState.action === 'activate') {
        cost = activePathId ? DEACTIVATE_PATH_COST + ACTIVATE_PATH_COST : ACTIVATE_PATH_COST;
        if (currentXP >= cost) {
          newActivePathId = modalState.path.id;
        } else {
          alert("Not enough XP!"); // Replace with a polished notification
          handleCloseModal();
          return;
        }
      } else { // Deactivate
        cost = DEACTIVATE_PATH_COST;
         if (currentXP >= cost) {
          newActivePathId = null;
        } else {
          alert("Not enough XP to change focus!"); // Replace with a polished notification
          handleCloseModal();
          return;
        }
      }
      
      const newXP = currentXP - cost;

      if (onUpdateXP) {
        onUpdateXP(newXP);
      } else {
        setInternalUserXP(newXP);
      }
      
      if (onSetActivePath) {
        onSetActivePath(newActivePathId);
      } else {
        setInternalActivePathId(newActivePathId);
      }
    }
    handleCloseModal();
  };

  const handleResumePath = (path: any) => {
    console.log(`Resuming path: ${path.title}`);
    onPathSelect(path);
  };
  
  const activePath = paths.find(p => p.id === activePathId);
  const otherUnlocked = paths.filter(p => p.id !== activePathId && (unlockedPaths.includes(p.id) || paths.indexOf(p) === 0));
  const locked = paths.filter((path, index) => index !== 0 && !unlockedPaths.includes(path.id));

  return (
    <>
      <ConfirmationDialog
        isOpen={modalState.isOpen}
        onCancel={handleCloseModal}
        onConfirm={handleConfirmAction}
        title={modalState.action === 'activate' ? `Set New Active Path?` : `Change Your Focus?`}
        confirmText={modalState.action === 'activate' ? 'Confirm & Set Path' : 'Confirm & Change'}
        description={
            modalState.action === 'activate' ? 
            (
                <>
                    <p>Setting "{modalState.path?.title}" as your active path will help you focus your journey.</p>
                    {activePathId && <p className="mt-2">This will first deactivate your current path, which has a cost.</p>}
                    <p className="font-bold text-amber-300 mt-4">Total Cost: {activePathId ? DEACTIVATE_PATH_COST + ACTIVATE_PATH_COST : ACTIVATE_PATH_COST} XP</p>
                </>
            ) : (
                 <>
                    <p>Changing your focus will cost XP to encourage consistency. Are you sure you wish to proceed?</p>
                     <p className="font-bold text-amber-300 mt-4">Cost: {DEACTIVATE_PATH_COST} XP</p>
                </>
            )
        }
      />

      <div className="space-y-12">
        {activePath && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
              <h2 className="text-2xl font-bold text-white mb-4">Your Active Path</h2>
              <ActivePathCard 
                  path={activePath}
                  onDeactivate={() => handleOpenModal(activePath, 'deactivate')}
                  onExplore={onPathSelect}
                  onResume={handleResumePath}
              />
          </motion.div>
        )}

        {otherUnlocked.length > 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
            <h2 className="text-2xl font-bold text-white mb-4">{activePath ? 'Other Available Paths' : 'Choose Your Path'}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {otherUnlocked.map((path, index) => (
                <PathCard
                  key={path.id}
                  path={path}
                  index={index}
                  onSetActive={() => handleOpenModal(path, 'activate')}
                />
              ))}
            </div>
          </motion.div>
        )}
        
        {locked.length > 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
            <div className="border-t border-purple-500/20 my-16" />
            <h2 className="text-2xl font-bold text-white mb-4">Paths to Unlock</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {locked.map((path, index) => (
                <LockedPathCard
                  key={path.id}
                  path={path}
                  index={paths.indexOf(path)}
                  onSelect={onPathSelect}
                />
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </>
  );
}

