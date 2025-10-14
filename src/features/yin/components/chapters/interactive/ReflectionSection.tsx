// src/features/yin/components/chapters/interactive/ReflectionSection.tsx
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import React, { useState } from 'react';

interface ReflectionSectionProps {
  reflections: Array<{
    question: string;
    type: 'text' | 'rating' | 'choice';
    options?: string[];
  }>;
  onComplete: (answers: Record<number, any>) => void;
  onSkip: () => void;
}

export const ReflectionSection: React.FC<ReflectionSectionProps> = ({
  reflections,
  onComplete,
  onSkip
}) => {
  const [answers, setAnswers] = useState<Record<number, any>>({});

  const handleSubmit = () => {
    onComplete(answers);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="max-w-4xl mx-auto"
    >
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-600/20 to-orange-600/20 blur-3xl" />
        
        <div className="relative bg-gradient-to-br from-amber-900/30 to-orange-900/30 backdrop-blur-xl rounded-3xl p-10 border border-amber-500/20">
          <div className="text-center mb-8">
            <motion.div
              className="w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-600 rounded-full mx-auto mb-4 flex items-center justify-center"
              animate={{ rotate: [0, 180, 360] }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
              <Star className="w-8 h-8 text-white" />
            </motion.div>
            <h2 className="text-3xl font-bold text-white mb-2">Reflection Time</h2>
            <p className="text-amber-300">Take a moment to integrate what you've learned</p>
          </div>
          
          <div className="space-y-6">
            {reflections.map((prompt, index) => (
              <motion.div 
                key={index} 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-black/30 rounded-2xl p-6 backdrop-blur-sm"
              >
                <p className="text-white mb-4 font-medium">{prompt.question}</p>
                
                {prompt.type === 'text' && (
                  <textarea
                    className="w-full p-4 bg-white/10 border border-amber-500/30 rounded-xl text-white placeholder-amber-300/50 focus:border-amber-500/50 focus:outline-none resize-none backdrop-blur-sm"
                    rows={3}
                    placeholder="Share your thoughts..."
                    value={answers[index] || ''}
                    onChange={(e) => setAnswers({ ...answers, [index]: e.target.value })}
                  />
                )}
                
                {prompt.type === 'rating' && (
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(rating => (
                      <motion.button
                        key={rating}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setAnswers({ ...answers, [index]: rating })}
                        className={`
                          w-10 h-10 rounded-lg flex items-center justify-center transition-all font-medium
                          ${answers[index] === rating
                            ? 'bg-gradient-to-br from-amber-500 to-orange-500 text-white shadow-lg'
                            : 'bg-white/10 text-amber-300/70 hover:bg-white/20'
                          }
                        `}
                      >
                        {rating}
                      </motion.button>
                    ))}
                  </div>
                )}
                
                {prompt.type === 'choice' && prompt.options && (
                  <div className="space-y-2">
                    {prompt.options.map((option, optionIndex) => (
                      <motion.button
                        key={optionIndex}
                        whileHover={{ x: 5 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setAnswers({ ...answers, [index]: option })}
                        className={`
                          w-full p-3 rounded-xl text-left transition-all
                          ${answers[index] === option
                            ? 'bg-gradient-to-r from-amber-500/30 to-orange-500/30 text-white border border-amber-500/50'
                            : 'bg-white/10 text-amber-100/70 border border-amber-500/20 hover:bg-white/20'
                          }
                        `}
                      >
                        {option}
                      </motion.button>
                    ))}
                  </div>
                )}
              </motion.div>
            ))}
          </div>

          <div className="flex justify-center gap-4 mt-8">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSubmit}
              className="px-8 py-3 bg-gradient-to-r from-amber-600 to-orange-600 rounded-xl text-white font-semibold hover:shadow-lg hover:shadow-amber-500/25 transition-all"
            >
              Submit Reflection
            </motion.button>
            
            <button
              onClick={onSkip}
              className="px-6 py-3 bg-white/10 backdrop-blur-sm text-gray-300 rounded-xl hover:bg-white/20 transition-all"
            >
              Skip Reflection
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};