// src/features/yin/components/QuestButton.tsx
// Version: 1.0.0 - Initial implementation of QuestButton component
import { motion } from 'framer-motion';
import { Flame, Sparkles } from 'lucide-react';

interface QuestButtonProps {
  onClick: () => void;
  questsAvailable: number;
  dailyStreak: number;
}

export default function QuestButton({ onClick, questsAvailable, dailyStreak }: QuestButtonProps) {
  return (
    <motion.button
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className="fixed bottom-24 right-6 z-40 group block md:hidden" // Just add block md:hidden
    >
      {/* Rest of component stays the same */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full blur-xl opacity-50 group-hover:opacity-75 transition-opacity" />
        <div className="relative bg-gradient-to-r from-purple-500 to-pink-500 rounded-full p-4 shadow-2xl border border-purple-400/30">
          <Sparkles className="w-6 h-6 text-white" />
        </div>
        
        {questsAvailable > 0 && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center border-2 border-gray-900"
          >
            {questsAvailable}
          </motion.div>
        )}
        
        {dailyStreak > 0 && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-2 -left-2 bg-orange-500 text-white text-xs font-bold rounded-full px-2 py-1 flex items-center gap-1 border-2 border-gray-900"
          >
            <Flame className="w-3 h-3" />
            {dailyStreak}
          </motion.div>
        )}
      </div>
      
      <div className="absolute bottom-full right-0 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
        <div className="bg-gray-800 text-white text-sm px-3 py-2 rounded-lg whitespace-nowrap border border-purple-500/30">
          Daily Quests & Challenges
        </div>
      </div>
    </motion.button>
  );
}