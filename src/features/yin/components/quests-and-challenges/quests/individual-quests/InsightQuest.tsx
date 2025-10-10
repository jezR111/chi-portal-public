// src/features/yin/components/quests-and-challenges/quests/individual-quests/InsightQuest.tsx

import { AnimatePresence, motion } from 'framer-motion';
import { BookOpen, Lightbulb, Sparkles, X } from 'lucide-react';
import { useState } from 'react';

interface InsightQuestProps {
  quest: {
    id: string;
    title: string;
    description: string;
    xp: number;
  };
  onComplete: (data: any) => void;
  onClose: () => void;
}

const INSIGHT_CATEGORIES = [
  { id: 'personal', label: 'Personal Growth', icon: '🌱', color: 'from-green-500 to-emerald-500' },
  { id: 'relationship', label: 'Relationships', icon: '💝', color: 'from-pink-500 to-rose-500' },
  { id: 'professional', label: 'Professional', icon: '💼', color: 'from-blue-500 to-indigo-500' },
  { id: 'creative', label: 'Creative', icon: '🎨', color: 'from-purple-500 to-pink-500' },
  { id: 'spiritual', label: 'Spiritual', icon: '✨', color: 'from-yellow-500 to-amber-500' },
  { id: 'health', label: 'Health & Body', icon: '🧘', color: 'from-teal-500 to-cyan-500' }
];

const INSIGHT_PROMPTS = [
  "What pattern did you notice today?",
  "What truth became clear to you?",
  "What did you learn about yourself?",
  "What perspective shifted for you?",
  "What connection did you discover?",
  "What wisdom emerged from your experience?"
];

export const InsightQuest: React.FC<InsightQuestProps> = ({ quest, onComplete, onClose }) => {
  const [insight, setInsight] = useState('');
  const [category, setCategory] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [currentPromptIndex] = useState(Math.floor(Math.random() * INSIGHT_PROMPTS.length));

  const wordCount = insight.trim().split(/\s+/).filter(word => word.length > 0).length;
  const minWords = 10;
  const isValid = wordCount >= minWords && category;

  const handleSubmit = async () => {
    if (!isValid) return;
    
    setIsSubmitting(true);
    
    // Prepare insight data
    const insightData = {
      text: insight.trim(),
      category,
      categoryLabel: INSIGHT_CATEGORIES.find(c => c.id === category)?.label,
      wordCount,
      timestamp: Date.now(),
      questId: quest.id
    };
    
    // Save to localStorage (could be replaced with a service)
    try {
      const existingInsights = JSON.parse(localStorage.getItem('insight_bank') || '[]');
      existingInsights.push(insightData);
      localStorage.setItem('insight_bank', JSON.stringify(existingInsights));
    } catch (error) {
      console.error('Failed to save insight:', error);
    }
    
    // Simulate processing delay for better UX
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Complete the quest
    onComplete(insightData);
    
    // Show success animation then auto-close
    setShowSuccess(true);
    setTimeout(() => {
      onClose();
    }, 2000);
  };

  const selectedCategory = INSIGHT_CATEGORIES.find(c => c.id === category);

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-xl flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-gradient-to-br from-indigo-900/95 to-purple-900/95 rounded-3xl p-8 max-w-2xl w-full relative backdrop-blur-xl border border-indigo-500/30"
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-lg transition-colors"
        >
          <X className="w-5 h-5 text-white/70" />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
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
            <BookOpen className="w-12 h-12 text-indigo-400" />
          </motion.div>
          <h2 className="text-3xl font-bold text-white mb-2">{quest.title}</h2>
          <p className="text-indigo-200">{quest.description}</p>
        </div>

        {/* Category Selection */}
        <div className="mb-6">
          <label className="text-indigo-300 text-sm font-medium mb-3 block">
            What area of life does this insight relate to?
          </label>
          <div className="grid grid-cols-3 gap-3">
            {INSIGHT_CATEGORIES.map(cat => (
              <motion.button
                key={cat.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setCategory(cat.id)}
                className={`relative p-4 rounded-xl transition-all ${
                  category === cat.id
                    ? 'bg-gradient-to-br ' + cat.color + ' text-white shadow-lg'
                    : 'bg-white/10 text-white/80 hover:bg-white/15 border border-white/20'
                }`}
              >
                {category === cat.id && (
                  <motion.div
                    layoutId="category-indicator"
                    className="absolute -top-2 -right-2 w-6 h-6 bg-green-400 rounded-full flex items-center justify-center"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                  >
                    <span className="text-xs">✓</span>
                  </motion.div>
                )}
                <span className="block text-2xl mb-1">{cat.icon}</span>
                <span className="text-xs font-medium">{cat.label}</span>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Insight Input */}
        <div className="mb-4">
          <label className="text-indigo-300 text-sm font-medium mb-2 block">
            {INSIGHT_PROMPTS[currentPromptIndex]}
          </label>
          <div className="relative">
            <textarea
              value={insight}
              onChange={(e) => setInsight(e.target.value)}
              placeholder="Share your realization, learning, or moment of clarity..."
              className="w-full h-32 p-4 bg-black/30 border border-indigo-400/30 rounded-xl text-white placeholder-indigo-300/50 resize-none focus:outline-none focus:border-indigo-400/50 transition-all"
              disabled={isSubmitting}
            />
            
            {/* Character/Word counter */}
            <div className="absolute bottom-2 right-2 flex items-center gap-3 text-xs">
              <span className={`transition-colors ${
                wordCount >= minWords ? 'text-green-400' : 'text-indigo-300/60'
              }`}>
                {wordCount} words
              </span>
              {selectedCategory && (
                <span className="text-indigo-300/60">
                  {selectedCategory.icon}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Progress indicator */}
        <div className="mb-6">
          <div className="flex justify-between text-xs text-indigo-300 mb-1">
            <span>Completeness</span>
            <span className="flex items-center gap-2">
              {category && <span>✓ Category</span>}
              {wordCount >= minWords && <span>✓ Insight</span>}
            </span>
          </div>
          <div className="w-full bg-indigo-950/60 rounded-full h-2 overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-indigo-500 to-purple-500"
              initial={{ width: 0 }}
              animate={{
                width: `${Math.min(100, ((category ? 50 : 0) + (wordCount >= minWords ? 50 : (wordCount / minWords) * 50)))}%`
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
          disabled={!isValid || isSubmitting}
          className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all shadow-lg"
        >
          {isSubmitting ? (
            <>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              >
                <Sparkles className="w-5 h-5" />
              </motion.div>
              Capturing Insight...
            </>
          ) : (
            <>
              <Lightbulb className="w-5 h-5" />
              Capture Insight
              <span className="text-sm opacity-80 ml-2">+{quest.xp} XP</span>
            </>
          )}
        </motion.button>

        {/* Tips */}
        {!category && !insight && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="mt-4 p-3 bg-indigo-500/10 rounded-lg border border-indigo-400/20"
          >
            <p className="text-indigo-300/80 text-xs text-center">
              💡 Tip: Think about a moment today when something clicked or made sense
            </p>
          </motion.div>
        )}

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
                    rotate: [0, 360, 360]
                  }}
                  transition={{
                    duration: 0.8,
                    times: [0, 0.5, 1]
                  }}
                >
                  <Lightbulb className="w-20 h-20 text-yellow-400 mx-auto mb-4" />
                </motion.div>
                <h3 className="text-2xl font-bold text-white mb-2">Brilliant Insight!</h3>
                <p className="text-indigo-300">Your wisdom has been captured</p>
                <p className="text-green-400 font-bold text-xl mt-2">+{quest.xp} XP</p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};