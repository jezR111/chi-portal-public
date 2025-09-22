// src/features/yin/components/quests/GratitudeQuest.tsx
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import { useState } from 'react';

export const GratitudeQuest = ({ quest, onComplete }) => {
  const [gratitudes, setGratitudes] = useState(['', '', '', '', '']);
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleSubmit = () => {
    if (gratitudes.every(g => g.trim())) {
      onComplete(quest.id, quest.xp, { gratitudes });
    }
  };

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-xl flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-gradient-to-br from-pink-900 to-rose-900 rounded-3xl p-8 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
      >
        <h2 className="text-3xl font-bold text-white text-center mb-2">{quest.title}</h2>
        <p className="text-pink-200 text-center mb-8">{quest.description}</p>

        <div className="space-y-4">
          {gratitudes.map((gratitude, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`bg-black/30 rounded-xl p-4 ${currentIndex === index ? 'ring-2 ring-pink-400' : ''}`}
            >
              <label className="text-pink-300 text-sm mb-2 block">
                Gratitude #{index + 1}
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
                placeholder="I am grateful for..."
                className="w-full bg-white/10 text-white placeholder-pink-300/50 p-3 rounded-lg border border-pink-500/30 focus:border-pink-400 focus:outline-none"
              />
            </motion.div>
          ))}
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleSubmit}
          disabled={!gratitudes.every(g => g.trim())}
          className="mt-6 w-full py-3 bg-gradient-to-r from-pink-600 to-rose-600 disabled:opacity-50 text-white rounded-xl font-semibold flex items-center justify-center gap-2"
        >
          <Heart className="w-5 h-5" />
          Submit Gratitudes
        </motion.button>
      </motion.div>
    </div>
  );
};