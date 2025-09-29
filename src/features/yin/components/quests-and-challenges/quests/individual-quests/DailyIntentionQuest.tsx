// src/features/yin/components/quests-and-challenges/quests/individual-quests/DailyIntentionQuest.tsx

import { motion } from 'framer-motion';
import { ChevronRight, Sparkles, Target, X } from 'lucide-react';
import { useState } from 'react';

interface DailyIntentionQuestProps {
  quest: {
    id: string;
    title: string;
    description: string;
    xp: number;
  };
  onComplete: (questId: string, xp: number, data: any) => void;
  onClose: () => void;
}

const INTENTION_PROMPTS = [
  "What's the most important thing you want to accomplish today?",
  "How do you want to feel by the end of today?",
  "What would make today meaningful for you?",
  "What energy do you want to bring to your interactions today?",
  "What habit or practice will you focus on today?"
];

const FOCUS_AREAS = [
  { id: 'productivity', label: 'Productivity', icon: '⚡', color: 'from-blue-500 to-cyan-500' },
  { id: 'creativity', label: 'Creativity', icon: '🎨', color: 'from-purple-500 to-pink-500' },
  { id: 'relationships', label: 'Relationships', icon: '💝', color: 'from-pink-500 to-rose-500' },
  { id: 'health', label: 'Health', icon: '🌱', color: 'from-green-500 to-emerald-500' },
  { id: 'learning', label: 'Learning', icon: '📚', color: 'from-indigo-500 to-purple-500' },
  { id: 'mindfulness', label: 'Mindfulness', icon: '🧘', color: 'from-teal-500 to-cyan-500' }
];

export const DailyIntentionQuest: React.FC<DailyIntentionQuestProps> = ({ quest, onComplete, onClose }) => {
  const [selectedArea, setSelectedArea] = useState<string>('');
  const [intention, setIntention] = useState('');
  const [affirmation, setAffirmation] = useState('');
  const [step, setStep] = useState<'area' | 'intention' | 'affirmation' | 'complete'>('area');
  
  const randomPrompt = INTENTION_PROMPTS[Math.floor(Math.random() * INTENTION_PROMPTS.length)];

  const handleAreaSelect = (areaId: string) => {
    setSelectedArea(areaId);
    setStep('intention');
  };

  const handleIntentionSubmit = () => {
    if (intention.trim().length > 10) {
      setStep('affirmation');
    }
  };

  const handleComplete = () => {
    if (affirmation.trim()) {
      setStep('complete');
      
      const intentionData = {
        focusArea: selectedArea,
        intention,
        affirmation,
        date: new Date().toISOString()
      };

      // Save to localStorage for daily review
      localStorage.setItem('daily_intention', JSON.stringify(intentionData));

      setTimeout(() => {
        onComplete(quest.id, quest.xp, intentionData);
      }, 2000);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-xl flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-gradient-to-br from-blue-900/90 to-cyan-900/90 rounded-3xl p-8 max-w-lg w-full relative backdrop-blur-xl border border-blue-500/30"
      >
        {/* Header */}
        <div className="absolute top-4 right-4">
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-white/70" />
          </button>
        </div>

        <div className="flex items-center gap-3 mb-6">
          <Target className="w-8 h-8 text-blue-400" />
          <h2 className="text-3xl font-bold text-white">{quest.title}</h2>
        </div>

        {/* Progress dots */}
        <div className="flex justify-center gap-2 mb-8">
          {['area', 'intention', 'affirmation'].map((s, idx) => (
            <div
              key={s}
              className={`h-2 w-12 rounded-full transition-all ${
                step === 'complete' || 
                ['area', 'intention', 'affirmation'].indexOf(step) > idx
                  ? 'bg-blue-400'
                  : step === s
                  ? 'bg-blue-400/50'
                  : 'bg-white/20'
              }`}
            />
          ))}
        </div>

        {/* Step Content */}
        {step === 'area' && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h3 className="text-xl text-white mb-4">Choose your focus area for today</h3>
            <div className="grid grid-cols-2 gap-3">
              {FOCUS_AREAS.map(area => (
                <motion.button
                  key={area.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleAreaSelect(area.id)}
                  className={`p-4 rounded-xl bg-gradient-to-br ${area.color} bg-opacity-20 backdrop-blur-sm border border-white/20 hover:border-white/40 transition-all`}
                >
                  <span className="text-3xl mb-2 block">{area.icon}</span>
                  <span className="text-white font-medium">{area.label}</span>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {step === 'intention' && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
          >
            <div>
              <h3 className="text-xl text-white mb-2">Set Your Intention</h3>
              <p className="text-blue-200 text-sm mb-4">{randomPrompt}</p>
            </div>
            
            <textarea
              value={intention}
              onChange={(e) => setIntention(e.target.value)}
              placeholder="Today, I intend to..."
              className="w-full h-32 p-4 bg-black/30 border border-blue-400/30 rounded-xl text-white placeholder-white/50 resize-none focus:outline-none focus:border-blue-400/50"
              autoFocus
            />
            
            <div className="flex justify-between items-center">
              <span className="text-blue-300 text-sm">
                {intention.length} characters
              </span>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleIntentionSubmit}
                disabled={intention.trim().length < 10}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800/50 rounded-xl text-white font-semibold transition-all flex items-center gap-2"
              >
                Continue
                <ChevronRight className="w-4 h-4" />
              </motion.button>
            </div>
          </motion.div>
        )}

        {step === 'affirmation' && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
          >
            <div>
              <h3 className="text-xl text-white mb-2">Create Your Affirmation</h3>
              <p className="text-blue-200 text-sm mb-4">
                Write a positive statement that supports your intention
              </p>
            </div>
            
            <textarea
              value={affirmation}
              onChange={(e) => setAffirmation(e.target.value)}
              placeholder="I am..."
              className="w-full h-24 p-4 bg-black/30 border border-blue-400/30 rounded-xl text-white placeholder-white/50 resize-none focus:outline-none focus:border-blue-400/50"
              autoFocus
            />
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleComplete}
              disabled={!affirmation.trim()}
              className="w-full py-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 disabled:from-blue-800/50 disabled:to-cyan-800/50 rounded-xl text-white font-semibold transition-all"
            >
              Set Daily Intention
            </motion.button>
          </motion.div>
        )}

        {step === 'complete' && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-center py-8"
          >
            <Sparkles className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-white mb-2">Intention Set!</h3>
            <p className="text-blue-300 mb-4">Your focus is clear for today</p>
            <div className="bg-black/30 rounded-xl p-4 mb-4">
              <p className="text-white/80 italic">"{intention}"</p>
            </div>
            <p className="text-cyan-300">+{quest.xp} XP earned</p>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};