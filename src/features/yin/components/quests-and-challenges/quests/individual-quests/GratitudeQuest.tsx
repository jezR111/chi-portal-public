import { AnimatePresence, motion } from 'framer-motion';
import { Heart, Sparkles, X } from 'lucide-react';
import { useState } from 'react';

interface GratitudeQuestProps {
  quest: {
    id: string;
    title: string;
    description: string;
    xp: number;
  };
  onComplete: (questId: string, xp: number, data: any) => void;
  onClose: () => void;
}

export const GratitudeQuest: React.FC<GratitudeQuestProps> = ({ quest, onComplete, onClose }) => {
  const [gratitudes, setGratitudes] = useState(['', '', '', '', '']);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = async () => {
    if (!gratitudes.every(g => g.trim())) return;
    
    setIsSubmitting(true);
    
    // Prepare gratitude data
    const gratitudeData = {
      gratitudes: gratitudes.filter(g => g.trim()),
      timestamp: Date.now(),
      wordCount: gratitudes.join(' ').split(' ').length
    };
    
    // Simulate save delay for better UX
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Complete the quest with gratitude data
    onComplete(quest.id, quest.xp, gratitudeData);
    
    // Show success animation
    setShowSuccess(true);
    setTimeout(() => {
      onClose();
    }, 2000);
  };

  const inspirationalPrompts = [
    "A person who made you smile today...",
    "A small joy you experienced...",
    "Something beautiful you noticed...",
    "A skill or ability you have...",
    "A memory that brings you peace..."
  ];

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-xl flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-gradient-to-br from-pink-900 to-rose-900 rounded-3xl p-8 max-w-2xl w-full max-h-[80vh] overflow-y-auto relative"
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-lg transition-colors"
        >
          <X className="w-5 h-5 text-white/70" />
        </button>

        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            animate={{
              rotate: [0, 10, -10, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatDelay: 3
            }}
            className="inline-block mb-4"
          >
            <Heart className="w-12 h-12 text-pink-400" />
          </motion.div>
          <h2 className="text-3xl font-bold text-white mb-2">{quest.title}</h2>
          <p className="text-pink-200">{quest.description}</p>
        </div>

        {/* Gratitude Inputs */}
        <div className="space-y-4">
          {gratitudes.map((gratitude, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`bg-black/30 rounded-xl p-4 transition-all ${
                currentIndex === index ? 'ring-2 ring-pink-400 bg-black/40' : ''
              }`}
            >
              <label className="text-pink-300 text-sm mb-2 block flex items-center justify-between">
                <span>Gratitude #{index + 1}</span>
                {gratitude.trim() && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="text-green-400"
                  >
                    ✓
                  </motion.span>
                )}
              </label>
              <input
                type="text"
                value={gratitude}
                onChange={(e) => {
                  const newGratitudes = [...gratitudes];
                  newGratitudes[index] = e.target.value;
                  setGratitudes(newGratitudes);
                }}
                onFocus={() => setCurrentIndex(index)}
                placeholder={inspirationalPrompts[index]}
                className="w-full bg-white/10 text-white placeholder-pink-300/50 p-3 rounded-lg border border-pink-500/30 focus:border-pink-400 focus:outline-none transition-all"
                disabled={isSubmitting}
              />
            </motion.div>
          ))}
        </div>

        {/* Progress indicator */}
        <div className="mt-6 mb-4">
          <div className="flex justify-between text-xs text-pink-300 mb-1">
            <span>Progress</span>
            <span>{gratitudes.filter(g => g.trim()).length} / 5</span>
          </div>
          <div className="w-full bg-pink-950/60 rounded-full h-2 overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-pink-500 to-rose-500"
              initial={{ width: 0 }}
              animate={{
                width: `${(gratitudes.filter(g => g.trim()).length / 5) * 100}%`
              }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        {/* Submit Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleSubmit}
          disabled={!gratitudes.every(g => g.trim()) || isSubmitting}
          className="w-full py-3 bg-gradient-to-r from-pink-600 to-rose-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-semibold flex items-center justify-center gap-2 transition-all"
        >
          {isSubmitting ? (
            <>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              >
                <Sparkles className="w-5 h-5" />
              </motion.div>
              Saving Gratitudes...
            </>
          ) : (
            <>
              <Heart className="w-5 h-5" />
              Submit Gratitudes
            </>
          )}
        </motion.button>

        {/* Success Overlay */}
        <AnimatePresence>
          {showSuccess && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/80 rounded-3xl flex items-center justify-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", damping: 15 }}
                className="text-center"
              >
                <motion.div
                  animate={{
                    scale: [1, 1.2, 1],
                  }}
                  transition={{
                    duration: 0.5,
                    repeat: 3
                  }}
                >
                  <Heart className="w-20 h-20 text-pink-400 mx-auto mb-4" />
                </motion.div>
                <h3 className="text-2xl font-bold text-white mb-2">Beautiful!</h3>
                <p className="text-pink-300">Your gratitude radiates positive energy</p>
                <p className="text-green-400 font-bold text-xl mt-2">+{quest.xp} XP</p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};