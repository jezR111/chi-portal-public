// src/features/yin/components/insights/InsightCapture.tsx

import { AnimatePresence, motion } from 'framer-motion';
import {
  Brain,
  Heart,
  Lightbulb,
  Save,
  Sparkles,
  Tag,
  X,
  Zap
} from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import { useInsights } from '../../hooks/useInsights';
import { InsightData, InsightType } from '../../types/insight.types';
import { VoiceNoteRecorder } from './VoiceNoteRecorder';

interface InsightCaptureProps {
  isOpen: boolean;
  onClose: () => void;
  lessonId: string;
  lessonTitle: string;
  sectionId?: string;
  timeInLesson: number;
  onSave: (insight: InsightData) => void;
}

export const InsightCapture: React.FC<InsightCaptureProps> = ({
  isOpen,
  onClose,
  lessonId,
  lessonTitle,
  sectionId,
  timeInLesson,
  onSave
}) => {
  const [insightText, setInsightText] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [insightType, setInsightType] = useState<InsightType>('lightbulb');
  const [isRecording, setIsRecording] = useState(false);
  const [voiceNote, setVoiceNote] = useState<Blob | null>(null);
  const [customTag, setCustomTag] = useState('');
  const [mood, setMood] = useState<number>(5);
  const [energy, setEnergy] = useState<number>(5);
  
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { saveInsight } = useInsights();
  
  useEffect(() => {
    if (isOpen && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [isOpen]);
  
  const suggestedTags = [
    'breakthrough', 'reflection', 'question', 'realization',
    'pattern', 'connection', 'resistance', 'clarity',
    'emotion', 'memory', 'growth', 'challenge'
  ];
  
  const insightTypes = [
    { type: 'lightbulb' as InsightType, icon: Lightbulb, label: 'Insight', color: 'from-yellow-500 to-amber-500' },
    { type: 'breakthrough' as InsightType, icon: Zap, label: 'Breakthrough', color: 'from-purple-500 to-pink-500' },
    { type: 'note' as InsightType, icon: Brain, label: 'Reflection', color: 'from-blue-500 to-indigo-500' },
    { type: 'heart' as InsightType, icon: Heart, label: 'Emotional', color: 'from-red-500 to-pink-500' }
  ];
  
  const handleSave = async () => {
    if (!insightText.trim() && !voiceNote) return;
    
    const insight: InsightData = {
      id: `insight-${Date.now()}`,
      type: insightType,
      content: insightText,
      voiceNote: voiceNote || undefined,
      tags: selectedTags,
      timestamp: new Date(),
      lessonContext: {
        lessonId,
        lessonTitle,
        sectionId: sectionId || '',
        timeInLesson
      },
      metadata: {
        mood,
        energy
      }
    };
    
    await saveInsight(insight);
    onSave(insight);
    
    // Reset form
    setInsightText('');
    setSelectedTags([]);
    setVoiceNote(null);
    setInsightType('lightbulb');
    setMood(5);
    setEnergy(5);
    
    // Close after short delay
    setTimeout(onClose, 500);
  };
  
  const handleTagToggle = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };
  
  const handleAddCustomTag = () => {
    if (customTag.trim() && !selectedTags.includes(customTag.trim())) {
      setSelectedTags(prev => [...prev, customTag.trim()]);
      setCustomTag('');
    }
  };
  
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
          
          {/* Modal */}
          <motion.div
            className="relative bg-gradient-to-br from-slate-900 via-purple-900/50 to-slate-900 rounded-3xl border border-purple-500/20 max-w-2xl w-full max-h-[90vh] overflow-hidden"
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            {/* Header */}
            <div className="relative p-6 border-b border-purple-500/20">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 to-pink-600/10" />
              
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-xl transition-colors z-10"
              >
                <X className="w-5 h-5 text-white" />
              </button>
              
              <div className="relative">
                <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
                  <Sparkles className="w-6 h-6 text-yellow-400" />
                  Capture Your Insight
                </h2>
                <p className="text-purple-300/80 text-sm">
                  From: {lessonTitle} • {Math.floor(timeInLesson / 60)}:{(timeInLesson % 60).toString().padStart(2, '0')}
                </p>
              </div>
            </div>
            
            {/* Content */}
            <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto custom-scrollbar">
              {/* Insight Type Selection */}
              <div>
                <label className="text-white text-sm font-medium mb-3 block">Type of Insight</label>
                <div className="grid grid-cols-4 gap-3">
                  {insightTypes.map(({ type, icon: Icon, label, color }) => (
                    <motion.button
                      key={type}
                      onClick={() => setInsightType(type)}
                      className={`p-3 rounded-xl border transition-all ${
                        insightType === type
                          ? `bg-gradient-to-br ${color} border-transparent text-white`
                          : 'bg-black/30 border-purple-500/20 text-purple-300 hover:bg-black/40'
                      }`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Icon className="w-5 h-5 mx-auto mb-1" />
                      <span className="text-xs">{label}</span>
                    </motion.button>
                  ))}
                </div>
              </div>
              
              {/* Text Input */}
              <div>
                <label className="text-white text-sm font-medium mb-3 block">
                  What resonated with you?
                </label>
                <textarea
                  ref={textareaRef}
                  value={insightText}
                  onChange={(e) => setInsightText(e.target.value)}
                  placeholder="Describe your insight, realization, or reflection..."
                  className="w-full h-32 bg-black/30 border border-purple-500/20 rounded-xl px-4 py-3 text-white placeholder-purple-300/40 focus:outline-none focus:border-purple-400 resize-none"
                />
                <p className="text-purple-300/60 text-xs mt-2">
                  {insightText.length} characters
                </p>
              </div>
              
              {/* Voice Note */}
              <VoiceNoteRecorder
                onRecordingComplete={setVoiceNote}
                isRecording={isRecording}
                setIsRecording={setIsRecording}
              />
              
              {/* Tags */}
              <div>
                <label className="text-white text-sm font-medium mb-3 block">
                  Add Tags (helps find patterns)
                </label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {suggestedTags.map(tag => (
                    <motion.button
                      key={tag}
                      onClick={() => handleTagToggle(tag)}
                      className={`px-3 py-1.5 rounded-full text-sm transition-all ${
                        selectedTags.includes(tag)
                          ? 'bg-purple-600 text-white'
                          : 'bg-purple-500/20 text-purple-300 hover:bg-purple-500/30'
                      }`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Tag className="w-3 h-3 inline mr-1" />
                      {tag}
                    </motion.button>
                  ))}
                </div>
                
                {/* Custom Tag Input */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={customTag}
                    onChange={(e) => setCustomTag(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddCustomTag()}
                    placeholder="Add custom tag..."
                    className="flex-1 bg-black/30 border border-purple-500/20 rounded-lg px-3 py-2 text-white text-sm placeholder-purple-300/40 focus:outline-none focus:border-purple-400"
                  />
                  <button
                    onClick={handleAddCustomTag}
                    className="px-4 py-2 bg-purple-600 rounded-lg text-white text-sm hover:bg-purple-700 transition-colors"
                  >
                    Add
                  </button>
                </div>
              </div>
              
              {/* Mood & Energy (Optional) */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-white text-sm font-medium mb-2 block">
                    Mood Level
                  </label>
                  <div className="flex items-center gap-2">
                    {[...Array(10)].map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setMood(i + 1)}
                        className={`w-8 h-8 rounded-lg transition-all ${
                          i < mood
                            ? 'bg-gradient-to-t from-pink-500 to-purple-500'
                            : 'bg-gray-700'
                        }`}
                      />
                    ))}
                  </div>
                </div>
                
                <div>
                  <label className="text-white text-sm font-medium mb-2 block">
                    Energy Level
                  </label>
                  <div className="flex items-center gap-2">
                    {[...Array(10)].map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setEnergy(i + 1)}
                        className={`w-8 h-8 rounded-lg transition-all ${
                          i < energy
                            ? 'bg-gradient-to-t from-yellow-500 to-orange-500'
                            : 'bg-gray-700'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Footer */}
            <div className="p-6 border-t border-purple-500/20">
              <div className="flex items-center justify-between">
                <p className="text-purple-300/60 text-sm">
                  {selectedTags.length > 0 && `${selectedTags.length} tags selected`}
                </p>
                
                <div className="flex gap-3">
                  <button
                    onClick={onClose}
                    className="px-6 py-2.5 bg-gray-700 rounded-xl text-white hover:bg-gray-600 transition-colors"
                  >
                    Cancel
                  </button>
                  
                  <motion.button
                    onClick={handleSave}
                    disabled={!insightText.trim() && !voiceNote}
                    className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl text-white font-semibold flex items-center gap-2 hover:shadow-lg hover:shadow-purple-500/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Save className="w-5 h-5" />
                    Save Insight
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default InsightCapture;