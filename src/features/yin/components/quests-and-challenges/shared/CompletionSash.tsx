import { motion } from 'framer-motion';
import { Trophy } from 'lucide-react';
import React from 'react';

interface CompletionSashProps {
  show: boolean;
  message?: string;
}

export const CompletionSash: React.FC<CompletionSashProps> = ({ 
  show, 
  message = "All Challenges Complete!" 
}) => {
  if (!show) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -50 }}
      className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50"
    >
      <div className="relative">
        {/* Gold gradient background */}
        <div className="absolute inset-0 bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-400 blur-lg opacity-70" />
        
        {/* Main sash */}
        <div className="relative bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-500 px-8 py-4 rounded-full shadow-2xl border-2 border-yellow-300/50">
          <div className="flex items-center gap-3">
            <Trophy className="w-8 h-8 text-white drop-shadow-lg" />
            <span className="text-white font-bold text-lg drop-shadow-lg">{message}</span>
            <Trophy className="w-8 h-8 text-white drop-shadow-lg" />
          </div>
        </div>
        
        {/* Sparkle effects */}
        <motion.div
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.5, 1, 0.5]
          }}
          transition={{ 
            duration: 2, 
            repeat: Infinity 
          }}
          className="absolute -top-2 -left-2 w-4 h-4 bg-yellow-300 rounded-full blur-sm"
        />
        <motion.div
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.5, 1, 0.5]
          }}
          transition={{ 
            duration: 2, 
            repeat: Infinity,
            delay: 0.5 
          }}
          className="absolute -bottom-2 -right-2 w-4 h-4 bg-yellow-300 rounded-full blur-sm"
        />
      </div>
    </motion.div>
  );
};