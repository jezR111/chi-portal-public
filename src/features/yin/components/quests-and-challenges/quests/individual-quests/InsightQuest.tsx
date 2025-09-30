// src/features/yin/components/quests-and-challenges/quests/individual-quests/InsightQuest.tsx

import { motion } from 'framer-motion';
import { Lightbulb, Send, X } from 'lucide-react';
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
  const [insight, setInsight] = useState('');
  const [category, setCategory] = useState('');

  const INSIGHT_CATEGORIES = [
    { id: 'personal', label: 'Personal Growth', icon: '🌱' },
    { id: 'relationship', label: 'Relationships', icon: '💝' },
    { id: 'professional', label: 'Professional', icon: '💼' },
    { id: 'creative', label: 'Creative', icon: '🎨' },
    { id: 'spiritual', label: 'Spiritual', icon: '✨' }
  ];

  const handleSubmit = () => {
    if (insight.trim().length > 20 && category) {
      // Save to localStorage or your insight service
      const insightData = {
        text: insight,
        category,
        timestamp: new Date().toISOString()
      };
      
      // You could save this to your insight bank service
      const existingInsights = JSON.parse(localStorage.getItem('insight_bank') || '[]');
      existingInsights.push(insightData);
      localStorage.setItem('insight_bank', JSON.stringify(existingInsights));
      
      onComplete(quest.id, quest.xp, insightData);
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

        <div className="flex items-center gap-3 mb-6">
          <Lightbulb className="w-8 h-8 text-green-400" />
          <h2 className="text-3xl font-bold text-white">{quest.title}</h2>
        </div>

        <p className="text-green-200 mb-6">{quest.description}</p>

        {/* Category Selection */}
        <div className="mb-4">
          <label className="text-white/80 text-sm mb-2 block">Category</label>
          <div className="grid grid-cols-3 gap-2">
            {INSIGHT_CATEGORIES.map(cat => (
              <button
                key={cat.id}
                onClick={() => setCategory(cat.id)}
                className={`p-2 rounded-lg text-xs font-medium transition-all ${
                  category === cat.id
                    ? 'bg-green-500 text-white'
                    : 'bg-green-500/20 text-green-300 hover:bg-green-500/30'
                }`}
              >
                <span className="block text-lg mb-1">{cat.icon}</span>
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Insight Input */}
        <textarea
          value={insight}
          onChange={(e) => setInsight(e.target.value)}
          placeholder="What insight or realization did you have today?"
          className="w-full h-32 p-4 bg-black/30 border border-green-400/30 rounded-xl text-white placeholder-white/50 resize-none focus:outline-none focus:border-green-400/50 mb-4"
        />

        <div className="flex items-center justify-between mb-4">
          <span className="text-green-300 text-sm">
            {insight.length} / 20 minimum characters
          </span>
          <span className="text-green-400 text-sm">+{quest.xp} XP</span>
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleSubmit}
          disabled={insight.trim().length < 20 || !category}
          className="w-full py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:from-green-800/50 disabled:to-emerald-800/50 rounded-xl text-white font-semibold transition-all flex items-center justify-center gap-2"
        >
          Capture Insight
          <Send className="w-4 h-4" />
        </motion.button>
      </motion.div>
    </div>
  );
};