// src/features/yin/components/quests-and-challenges/quests/individual-quests/InsightQuest.tsx

import { motion } from 'framer-motion';
import { ExternalLink, Lightbulb, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface InsightQuestProps {
  quest: {
    id: string;
    title: string;
    description: string;
    xp: number;
  };
  onComplete: (questId: string, xp: number, data: any) => void;
  onClose: () => void;
}

export const InsightQuest: React.FC<InsightQuestProps> = ({ quest, onComplete, onClose }) => {
  const router = useRouter();
  const [hasVisited, setHasVisited] = useState(false);

  const handleNavigateToInsights = () => {
    setHasVisited(true);
    
    // Mark quest as complete after a short delay
    setTimeout(() => {
      onComplete(quest.id, quest.xp, {
        method: 'redirected_to_insights',
        timestamp: new Date().toISOString()
      });
    }, 500);
    
    // Navigate to your existing insights feature
    router.push('/yin/insights'); // Adjust path to your actual insights route
  };

  const handleQuickCapture = () => {
    // Alternative: Simple inline capture
    const insight = prompt('What insight or realization would you like to capture?');
    
    if (insight && insight.trim().length > 10) {
      onComplete(quest.id, quest.xp, {
        method: 'quick_capture',
        insight: insight.trim(),
        timestamp: new Date().toISOString()
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-xl flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-gradient-to-br from-green-900/90 to-emerald-900/90 rounded-3xl p-8 max-w-md w-full relative backdrop-blur-xl border border-green-500/30"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-lg transition-colors"
        >
          <X className="w-5 h-5 text-white/70" />
        </button>

        <div className="text-center">
          <motion.div
            animate={{ 
              rotate: [0, -10, 10, -10, 10, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            className="inline-block mb-6"
          >
            <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-500 rounded-2xl flex items-center justify-center">
              <Lightbulb className="w-10 h-10 text-white" />
            </div>
          </motion.div>

          <h2 className="text-3xl font-bold text-white mb-3">{quest.title}</h2>
          <p className="text-green-200 mb-8">{quest.description}</p>

          <div className="space-y-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleNavigateToInsights}
              className="w-full py-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 rounded-xl text-white font-semibold transition-all flex items-center justify-center gap-2"
            >
              Open Insight Bank
              <ExternalLink className="w-4 h-4" />
            </motion.button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-green-500/30"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-gradient-to-br from-green-900/90 to-emerald-900/90 text-green-400">
                  or
                </span>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleQuickCapture}
              className="w-full py-3 bg-green-600/30 hover:bg-green-600/40 border border-green-500/50 rounded-xl text-green-300 font-semibold transition-all"
            >
              Quick Capture
            </motion.button>
          </div>

          <p className="text-green-400/60 text-sm mt-6">
            +{quest.xp} XP on completion
          </p>
        </div>
      </motion.div>
    </div>
  );
};