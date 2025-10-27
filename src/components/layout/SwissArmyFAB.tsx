// src/components/layout/SwissArmyFAB.tsx
import { motion } from 'framer-motion';
import { Lightbulb } from 'lucide-react';
import React from 'react';

interface SwissArmyFABProps {
  onOpenCaptureModal: () => void;
}

export const SwissArmyFAB: React.FC<SwissArmyFABProps> = ({ onOpenCaptureModal }) => {
  return (
    <motion.div 
      className="fixed bottom-8 right-8 z-50"
      initial={{ scale: 0, y: 50 }}
      animate={{ scale: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 0.5 }}
    >
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onOpenCaptureModal}
        className="flex items-center gap-2 px-5 py-3 rounded-full shadow-2xl bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:shadow-purple-500/25 transition-shadow"
        aria-label="Capture a new insight"
      >
        <Lightbulb className="w-5 h-5" />
        <span className="font-semibold text-sm">New Insight</span>
      </motion.button>
    </motion.div>
  );
};