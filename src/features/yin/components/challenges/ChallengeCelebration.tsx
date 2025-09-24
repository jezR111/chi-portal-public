import { AnimatePresence, motion } from 'framer-motion';
import { Sparkles, Star, Trophy } from 'lucide-react';
import { useEffect, useState } from 'react';

export const ChallengeCelebration = () => {
  const [celebration, setCelebration] = useState<{
    show: boolean;
    challengeName: string;
    xpReward: number;
  }>({ show: false, challengeName: '', xpReward: 0 });

  useEffect(() => {
    const handleCelebration = (e: CustomEvent) => {
      setCelebration({
        show: true,
        challengeName: e.detail.challengeName,
        xpReward: e.detail.xpReward
      });
      
      // Auto-hide after 4 seconds
      setTimeout(() => {
        setCelebration(prev => ({ ...prev, show: false }));
      }, 4000);
    };

    window.addEventListener('challengeCompleted', handleCelebration as EventListener);
    return () => {
      window.removeEventListener('challengeCompleted', handleCelebration as EventListener);
    };
  }, []);

  return (
    <AnimatePresence>
      {celebration.show && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          className="fixed inset-0 flex items-center justify-center z-[100] pointer-events-none"
        >
          {/* Background overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm pointer-events-auto"
            onClick={() => setCelebration(prev => ({ ...prev, show: false }))}
          />
          
          {/* Celebration card */}
          <motion.div
            initial={{ y: 50, rotate: -5 }}
            animate={{ y: 0, rotate: 0 }}
            exit={{ y: -50, rotate: 5 }}
            className="relative bg-gradient-to-br from-amber-600 via-yellow-500 to-orange-500 rounded-3xl p-8 max-w-md mx-4 shadow-2xl"
          >
            {/* Sparkles animation */}
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ scale: 0, rotate: 0 }}
                animate={{ 
                  scale: [0, 1, 0],
                  rotate: [0, 180, 360],
                  x: [0, (i % 2 ? 100 : -100) * Math.random()],
                  y: [0, -100 * Math.random()]
                }}
                transition={{ 
                  duration: 2,
                  delay: i * 0.1,
                  ease: "easeOut"
                }}
                className="absolute top-1/2 left-1/2"
              >
                <Sparkles className="w-6 h-6 text-yellow-200" />
              </motion.div>
            ))}
            
            {/* Trophy icon */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", bounce: 0.5, delay: 0.2 }}
              className="w-20 h-20 bg-white/20 backdrop-blur rounded-full flex items-center justify-center mx-auto mb-4"
            >
              <Trophy className="w-12 h-12 text-white" />
            </motion.div>
            
            {/* Text */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-center"
            >
              <h2 className="text-3xl font-bold text-white mb-2">
                Challenge Complete!
              </h2>
              <p className="text-yellow-100 text-lg mb-4">
                {celebration.challengeName}
              </p>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5, type: "spring" }}
                className="inline-flex items-center gap-2 bg-white/20 backdrop-blur px-6 py-3 rounded-full"
              >
                <Star className="w-6 h-6 text-yellow-300" />
                <span className="text-2xl font-bold text-white">
                  +{celebration.xpReward} XP
                </span>
              </motion.div>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};