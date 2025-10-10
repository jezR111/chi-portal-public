// src/features/yin/components/quests-and-challenges/quests/individual-quests/DailyIntentionQuest.tsx
// Version: 2.2.0 - With AI analysis data structure

import { AnimatePresence, motion } from 'framer-motion';
import { ChevronRight, Sparkles, Target, X } from 'lucide-react';
import { useState } from 'react';

interface DailyIntentionQuestProps {
  quest: {
    id: string;
    title: string;
    description: string;
    xp: number;
  };
  onComplete: (data: any) => void;
  onClose: () => void;
}

const INTENTION_PROMPTS = [
  "What's the most important thing you want to accomplish today?",
  "How do you want to feel by the end of today?",
  "What would make today meaningful for you?",
  "What energy do you want to bring to your interactions today?",
  "What habit or practice will you focus on today?",
  "What gift will you give yourself today?",
  "How will you show up as your best self today?"
];

const FOCUS_AREAS = [
  { id: 'productivity', label: 'Productivity', icon: '⚡', color: 'from-blue-500 to-cyan-500' },
  { id: 'creativity', label: 'Creativity', icon: '🎨', color: 'from-purple-500 to-pink-500' },
  { id: 'relationships', label: 'Relationships', icon: '💝', color: 'from-pink-500 to-rose-500' },
  { id: 'health', label: 'Health', icon: '🌱', color: 'from-green-500 to-emerald-500' },
  { id: 'learning', label: 'Learning', icon: '📚', color: 'from-indigo-500 to-purple-500' },
  { id: 'mindfulness', label: 'Mindfulness', icon: '🧘', color: 'from-teal-500 to-cyan-500' }
];

const AFFIRMATION_STARTERS = [
  "I am capable of...",
  "Today I choose...",
  "I am worthy of...",
  "I trust myself to...",
  "I embrace...",
  "I am becoming..."
];

export const DailyIntentionQuest: React.FC<DailyIntentionQuestProps> = ({ quest, onComplete, onClose }) => {
  const [selectedArea, setSelectedArea] = useState<string>('');
  const [intention, setIntention] = useState('');
  const [affirmation, setAffirmation] = useState('');
  const [step, setStep] = useState<'area' | 'intention' | 'affirmation'>('area');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  
  const [currentPromptIndex] = useState(Math.floor(Math.random() * INTENTION_PROMPTS.length));
  const [affirmationStarter] = useState(AFFIRMATION_STARTERS[Math.floor(Math.random() * AFFIRMATION_STARTERS.length)]);

  const progress = step === 'area' ? 33 : step === 'intention' ? 66 : 100;

  const handleAreaSelect = (areaId: string) => {
    setSelectedArea(areaId);
    setTimeout(() => setStep('intention'), 300);
  };

  const handleIntentionSubmit = () => {
    if (intention.trim().length > 10) {
      setStep('affirmation');
    }
  };

  const handleComplete = async () => {
    if (!affirmation.trim() || isSubmitting) return;
    
    setIsSubmitting(true);
    
    const focusAreaData = FOCUS_AREAS.find(a => a.id === selectedArea);
    
    const intentionData = {
      // Core data
      intention: intention.trim(),
      affirmation: affirmation.trim(),
      focusArea: selectedArea,
      focusAreaLabel: focusAreaData?.label,
      
      // Temporal data for tracking progression
      timestamp: Date.now(),
      date: new Date().toISOString().split('T')[0],
      weekNumber: Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 1).getTime()) / (7 * 24 * 60 * 60 * 1000)),
      
      // Metadata for AI analysis
      intentionWordCount: intention.trim().split(/\s+/).length,
      intentionCharCount: intention.trim().length,
      
      // Depth indicators (for AI to analyze progression)
      containsSelfReference: /\b(I|me|my|myself)\b/i.test(intention),
      containsOthersReference: /\b(others|people|someone|community|team|family|friends)\b/i.test(intention),
      containsGrowthWords: /\b(grow|learn|improve|develop|become|progress|evolve)\b/i.test(intention),
      containsServiceWords: /\b(help|serve|support|give|contribute|share)\b/i.test(intention),
      containsBeingWords: /\b(be|being|presence|mindful|aware|conscious)\b/i.test(intention),
      containsDoingWords: /\b(do|accomplish|achieve|complete|finish|create)\b/i.test(intention),
      
      questId: quest.id
    };

    try {
      localStorage.setItem('daily_intention', JSON.stringify(intentionData));
      
      const history = JSON.parse(localStorage.getItem('intention_history') || '[]');
      history.push(intentionData);
      
      const ninetyDaysAgo = Date.now() - (90 * 24 * 60 * 60 * 1000);
      const recentHistory = history.filter((item: any) => item.timestamp > ninetyDaysAgo);
      
      localStorage.setItem('intention_history', JSON.stringify(recentHistory));
    } catch (error) {
      console.error('Failed to save intention:', error);
    }

    await new Promise(resolve => setTimeout(resolve, 500));
    onComplete(intentionData);
    
    setShowSuccess(true);
    setTimeout(() => onClose(), 2000);
  };

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-xl flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-gradient-to-br from-blue-900/95 to-cyan-900/95 rounded-3xl p-8 max-w-lg w-full relative backdrop-blur-xl border border-blue-500/30"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-lg transition-colors"
        >
          <X className="w-5 h-5 text-white/70" />
        </button>

        <div className="text-center mb-6">
          <motion.div
            animate={{
              rotate: showSuccess ? 360 : [0, 10, -10, 0],
              scale: showSuccess ? 1.2 : [1, 1.1, 1]
            }}
            transition={{
              duration: showSuccess ? 1 : 2,
              repeat: showSuccess ? 0 : Infinity,
              repeatDelay: 3
            }}
            className="inline-block mb-4"
          >
            <Target className="w-12 h-12 text-blue-400" />
          </motion.div>
          <h2 className="text-3xl font-bold text-white mb-2">{quest.title}</h2>
          <p className="text-blue-200">{quest.description}</p>
        </div>

        <div className="mb-6">
          <div className="flex justify-between text-xs text-blue-300 mb-2">
            <span>Setting Intention</span>
            <span>{Math.round(progress)}% Complete</span>
          </div>
          <div className="w-full bg-blue-950/60 rounded-full h-2 overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-blue-500 to-cyan-500"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          </div>
        </div>

        <div className="flex justify-center gap-4 mb-8">
          {['Focus', 'Intention', 'Affirmation'].map((label, idx) => {
            const steps = ['area', 'intention', 'affirmation'];
            const currentStepIndex = steps.indexOf(step);
            const isActive = idx === currentStepIndex;
            const isComplete = idx < currentStepIndex;
            
            return (
              <div key={label} className="flex items-center gap-2">
                <motion.div
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-all ${
                    isActive ? 'bg-blue-500 text-white' : 
                    isComplete ? 'bg-green-500 text-white' : 
                    'bg-white/20 text-white/50'
                  }`}
                  animate={{ scale: isActive ? 1.1 : 1 }}
                >
                  {isComplete ? '✓' : idx + 1}
                </motion.div>
                <span className={`text-xs hidden sm:block ${
                  isActive ? 'text-blue-300' : 'text-white/50'
                }`}>
                  {label}
                </span>
                {idx < 2 && (
                  <ChevronRight className={`w-4 h-4 ${
                    isComplete ? 'text-green-400' : 'text-white/30'
                  }`} />
                )}
              </div>
            );
          })}
        </div>

        <AnimatePresence mode="wait">
          {step === 'area' && (
            <motion.div
              key="area"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <h3 className="text-xl text-white text-center">
                What area will you focus on today?
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {FOCUS_AREAS.map(area => (
                  <motion.button
                    key={area.id}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleAreaSelect(area.id)}
                    className={`relative p-4 rounded-xl transition-all ${
                      selectedArea === area.id 
                        ? `bg-gradient-to-br ${area.color} shadow-lg` 
                        : 'bg-white/10 hover:bg-white/15 border border-white/20'
                    }`}
                  >
                    {selectedArea === area.id && (
                      <motion.div
                        layoutId="selection"
                        className="absolute -top-2 -right-2 w-6 h-6 bg-green-400 rounded-full flex items-center justify-center"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                      >
                        <span className="text-xs font-bold">✓</span>
                      </motion.div>
                    )}
                    <span className="text-3xl mb-2 block">{area.icon}</span>
                    <span className="text-white font-medium text-sm">{area.label}</span>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}

          {step === 'intention' && (
            <motion.div
              key="intention"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <div className="text-center">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full mb-3">
                  <span className="text-xl">{FOCUS_AREAS.find(a => a.id === selectedArea)?.icon}</span>
                  <span className="text-blue-300 text-sm font-medium">
                    {FOCUS_AREAS.find(a => a.id === selectedArea)?.label}
                  </span>
                </div>
                <p className="text-blue-200 text-sm">{INTENTION_PROMPTS[currentPromptIndex]}</p>
              </div>
              
              <textarea
                value={intention}
                onChange={(e) => setIntention(e.target.value)}
                placeholder="Today, I intend to..."
                className="w-full h-32 p-4 bg-black/30 border border-blue-400/30 rounded-xl text-white placeholder-blue-300/50 resize-none focus:outline-none focus:border-blue-400/50 transition-all"
                autoFocus
              />
              
              <div className="flex justify-between items-center">
                <button
                  onClick={() => setStep('area')}
                  className="text-blue-300 hover:text-blue-200 text-sm transition-colors"
                >
                  ← Back
                </button>
                <span className={`text-sm ${
                  intention.trim().length > 10 ? 'text-green-400' : 'text-blue-300/60'
                }`}>
                  {intention.trim().split(' ').filter(w => w).length} words
                </span>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleIntentionSubmit}
                  disabled={intention.trim().length < 10}
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl text-white font-semibold transition-all flex items-center gap-2"
                >
                  Continue
                  <ChevronRight className="w-4 h-4" />
                </motion.button>
              </div>
            </motion.div>
          )}

          {step === 'affirmation' && (
            <motion.div
              key="affirmation"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <div className="text-center">
                <h3 className="text-xl text-white mb-2">Seal it with an affirmation</h3>
                <p className="text-blue-200 text-sm">
                  Create a positive statement to carry with you
                </p>
              </div>
              
              <div className="bg-black/20 rounded-lg p-3 border border-blue-400/20">
                <p className="text-blue-300 text-sm mb-1">Your intention:</p>
                <p className="text-white/90 italic">"{intention}"</p>
              </div>
              
              <textarea
                value={affirmation}
                onChange={(e) => setAffirmation(e.target.value)}
                placeholder={affirmationStarter}
                className="w-full h-24 p-4 bg-black/30 border border-blue-400/30 rounded-xl text-white placeholder-blue-300/50 resize-none focus:outline-none focus:border-blue-400/50 transition-all"
                autoFocus
              />
              
              <div className="flex justify-between items-center">
                <button
                  onClick={() => setStep('intention')}
                  className="text-blue-300 hover:text-blue-200 text-sm transition-colors"
                >
                  ← Back
                </button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleComplete}
                  disabled={!affirmation.trim() || isSubmitting}
                  className="px-8 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl text-white font-bold text-lg transition-all flex items-center justify-center gap-2 shadow-lg"
                >
                  {isSubmitting ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      >
                        <Sparkles className="w-5 h-5" />
                      </motion.div>
                      Setting Intention...
                    </>
                  ) : (
                    <>
                      Set Daily Intention
                      <span className="text-sm opacity-80 ml-1">+{quest.xp} XP</span>
                    </>
                  )}
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

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
                className="text-center px-6"
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
                  <Target className="w-20 h-20 text-blue-400 mx-auto mb-4" />
                </motion.div>
                <h3 className="text-2xl font-bold text-white mb-2">Intention Set!</h3>
                <p className="text-blue-300">Your focus is clear</p>
                <p className="text-green-400 font-bold text-xl mt-2">+{quest.xp} XP</p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};