// src/features/yin/components/chapters/UnlockConfirmDialog.tsx
// Version: 8.0 - Complete confirmation dialog with proper validation

import { AnimatePresence, motion } from 'framer-motion';
import {
  AlertCircle,
  Award,
  ChevronRight,
  Lock,
  Sparkles,
  TrendingUp,
  X,
  Zap
} from 'lucide-react';
import { useEffect, useState } from 'react';

interface UnlockConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  type: 'path' | 'chapter';
  item: {
    title: string;
    subtitle?: string;
    description?: string;
    icon?: any;
    totalXP?: number;
    estimatedHours?: number;
  } | null;
  cost: number;
  currentXP: number;
  insufficientXP?: boolean;
}

export default function UnlockConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  type,
  item,
  cost,
  currentXP,
  insufficientXP = false
}: UnlockConfirmDialogProps) {
  const [isClosing, setIsClosing] = useState(false);
  const remainingXP = currentXP - cost;
  const canAfford = remainingXP >= 0 && !insufficientXP;
  const xpNeeded = cost - currentXP;

  // Handle close with animation
  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
      setIsClosing(false);
    }, 200);
  };

  // Reset closing state when dialog opens
  useEffect(() => {
    if (isOpen) {
      setIsClosing(false);
    }
  }, [isOpen]);

  if (!isOpen || !item) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={handleClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ 
              scale: isClosing ? 0.9 : 1, 
              opacity: isClosing ? 0 : 1, 
              y: isClosing ? 20 : 0 
            }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="relative bg-gradient-to-br from-purple-900/95 via-indigo-900/95 to-purple-900/95 rounded-3xl p-8 max-w-md w-full border border-purple-500/30 shadow-2xl shadow-purple-900/50 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-purple-600 rounded-full filter blur-3xl opacity-10 -translate-y-32 translate-x-32" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-600 rounded-full filter blur-3xl opacity-10 translate-y-32 -translate-x-32" />

            {/* Close button */}
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-lg transition-colors z-10"
            >
              <X className="w-5 h-5 text-purple-300" />
            </button>

            {/* Header with animated icon */}
            <div className="relative flex items-center gap-4 mb-6">
              <motion.div
                initial={{ rotate: -180, scale: 0 }}
                animate={{ rotate: 0, scale: 1 }}
                transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
                className="relative"
              >
                <div className="absolute inset-0 bg-amber-500 blur-xl opacity-30 animate-pulse" />
                <div className={`
                  relative w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg
                  ${insufficientXP 
                    ? 'bg-gradient-to-br from-red-500 to-orange-600' 
                    : 'bg-gradient-to-br from-amber-500 to-orange-600'
                  }
                `}>
                  {insufficientXP ? (
                    <AlertCircle className="w-7 h-7 text-white" />
                  ) : (
                    <Lock className="w-7 h-7 text-white" />
                  )}
                </div>
              </motion.div>
              
              <div className="flex-1 pr-8">
                <h3 className="text-2xl font-bold text-white">
                  {insufficientXP ? 'Not Enough XP' : `Unlock ${type === 'path' ? 'Path' : 'Chapter'}`}
                </h3>
                <p className="text-purple-300 text-sm mt-1">
                  {insufficientXP 
                    ? `You need ${xpNeeded} more XP` 
                    : 'Confirm your purchase'
                  }
                </p>
              </div>
            </div>
            
            {/* Item details card */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-black/30 rounded-2xl p-5 mb-6 border border-purple-500/20"
            >
              <div className="flex items-start gap-3 mb-3">
                {item.icon && (
                  <div className="w-10 h-10 bg-purple-600/30 rounded-lg flex items-center justify-center">
                    <item.icon className="w-6 h-6 text-purple-400" />
                  </div>
                )}
                <div className="flex-1">
                  <p className="text-xs text-purple-400 uppercase tracking-wide mb-1">
                    {type === 'path' ? 'Learning Path' : 'Chapter'}
                  </p>
                  <p className="text-xl font-semibold text-white">{item.title}</p>
                  {item.subtitle && (
                    <p className="text-purple-300 text-sm italic mt-1">{item.subtitle}</p>
                  )}
                </div>
              </div>
              
              {item.description && (
                <p className="text-purple-200/80 text-sm leading-relaxed">
                  {item.description}
                </p>
              )}
              
              {/* Additional stats for paths */}
              {type === 'path' && (item.totalXP || item.estimatedHours) && (
                <div className="flex items-center gap-4 mt-4 pt-3 border-t border-purple-500/20">
                  {item.totalXP && (
                    <div className="flex items-center gap-1.5 text-sm">
                      <Award className="w-4 h-4 text-amber-400" />
                      <span className="text-purple-300">+{item.totalXP} XP available</span>
                    </div>
                  )}
                  {item.estimatedHours && (
                    <div className="flex items-center gap-1.5 text-sm">
                      <TrendingUp className="w-4 h-4 text-purple-400" />
                      <span className="text-purple-300">{item.estimatedHours}h content</span>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
            
            {/* XP Breakdown */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-gradient-to-br from-purple-900/50 to-indigo-900/50 rounded-xl p-4 mb-6 space-y-3 border border-purple-500/20"
            >
              <div className="flex items-center justify-between">
                <span className="text-purple-300 flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  Current XP
                </span>
                <motion.span 
                  className="text-white font-semibold text-lg"
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  {currentXP.toLocaleString()}
                </motion.span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-purple-300 flex items-center gap-2">
                  <Zap className="w-4 h-4" />
                  Unlock Cost
                </span>
                <motion.span 
                  className={`font-semibold text-lg ${insufficientXP ? 'text-red-400' : 'text-amber-300'}`}
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.45 }}
                >
                  -{cost.toLocaleString()}
                </motion.span>
              </div>
              
              <div className="border-t border-purple-500/30 pt-3">
                <div className="flex items-center justify-between">
                  <span className="text-purple-300 font-medium">
                    {insufficientXP ? 'XP Needed' : 'After Purchase'}
                  </span>
                  <motion.span 
                    className={`font-bold text-lg ${
                      insufficientXP ? 'text-red-400' : canAfford ? 'text-white' : 'text-red-400'
                    }`}
                    initial={{ scale: 1.2, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    {insufficientXP 
                      ? `+${xpNeeded.toLocaleString()} XP`
                      : `${remainingXP.toLocaleString()} XP`
                    }
                  </motion.span>
                </div>
              </div>
            </motion.div>

            {/* Warnings and tips */}
            {canAfford && remainingXP < 100 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-3 mb-6"
              >
                <p className="text-amber-300 text-sm flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>This will leave you with less than 100 XP. Consider completing some quests first!</span>
                </p>
              </motion.div>
            )}

            {insufficientXP && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 mb-6"
              >
                <p className="text-red-300 text-sm mb-2">
                  You need <span className="font-bold">{xpNeeded} more XP</span> to unlock this {type}.
                </p>
                <p className="text-red-200/80 text-xs">
                  💡 Tip: Complete lessons, daily quests, and challenges to earn XP quickly!
                </p>
              </motion.div>
            )}
            
            {/* Action buttons */}
            <div className="flex gap-3">
              {!insufficientXP && canAfford ? (
                <>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      onConfirm();
                      handleClose();
                    }}
                    className="flex-1 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white font-bold py-3.5 px-6 rounded-xl shadow-lg hover:shadow-amber-500/30 transition-all flex items-center justify-center gap-2 group"
                  >
                    <Zap className="w-5 h-5" />
                    <span>Unlock for {cost} XP</span>
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleClose}
                    className="px-6 py-3.5 bg-gray-800/50 hover:bg-gray-800/70 text-gray-300 font-semibold rounded-xl border border-gray-700/50 transition-all"
                  >
                    Cancel
                  </motion.button>
                </>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleClose}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold py-3.5 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  <span>OK, I'll Earn More XP</span>
                  <Sparkles className="w-4 h-4" />
                </motion.button>
              )}
            </div>

            {/* Bottom tip for insufficient XP */}
            {insufficientXP && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="text-center text-xs text-purple-400 mt-4"
              >
                Pro tip: Daily quests reset every 24 hours! 🎯
              </motion.p>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}