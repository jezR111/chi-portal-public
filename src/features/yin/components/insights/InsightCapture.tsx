// src/features/yin/components/insights/InsightCapture.tsx
'use client'

import { AnimatePresence, motion } from 'framer-motion';
import {
  Brain,
  ChevronDown,
  Heart,
  Lightbulb,
  Save,
  Sparkles,
  Tag,
  X,
  Zap
} from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
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
  selectedText?: string;
}

// Move insightTypes outside the component so it's always available
const insightTypes = [
  { type: 'lightbulb' as InsightType, icon: Lightbulb, label: 'Insight', color: 'from-yellow-500 to-amber-500' },
  { type: 'breakthrough' as InsightType, icon: Zap, label: 'Breakthrough', color: 'from-purple-500 to-pink-500' },
  { type: 'note' as InsightType, icon: Brain, label: 'Reflection', color: 'from-blue-500 to-indigo-500' },
  { type: 'heart' as InsightType, icon: Heart, label: 'Emotional', color: 'from-red-500 to-pink-500' }
];

// Common tags to always show
const commonTags = ['breakthrough', 'reflection', 'question', 'realization', 'pattern'];

// Additional tags in dropdown
const additionalTags = ['connection', 'resistance', 'clarity', 'emotion', 'memory', 'growth', 'challenge', 'insight', 'learning', 'awareness'];

export const InsightCapture: React.FC<InsightCaptureProps> = ({
  isOpen,
  onClose,
  lessonId,
  lessonTitle,
  sectionId,
  timeInLesson,
  onSave,
  selectedText = ''
}) => {
  const [insightText, setInsightText] = useState('');
  const [noteText, setNoteText] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [insightType, setInsightType] = useState<InsightType>('lightbulb');
  const [isRecording, setIsRecording] = useState(false);
  const [voiceNote, setVoiceNote] = useState<Blob | null>(null);
  const [customTag, setCustomTag] = useState('');
  const [showMoreTags, setShowMoreTags] = useState(false);
  
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  // Set initial text when modal opens with selected text
  useEffect(() => {
    if (selectedText && isOpen) {
      setInsightText(selectedText);
      setNoteText('');
      setTimeout(() => {
        if (textareaRef.current && selectedText) {
          textareaRef.current.focus();
        }
      }, 100);
    }
  }, [selectedText, isOpen]);
  
  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        setInsightText('');
        setNoteText('');
        setSelectedTags([]);
        setVoiceNote(null);
        setInsightType('lightbulb');
        setShowMoreTags(false);
        setCustomTag('');
      }, 300);
    }
  }, [isOpen]);
  
  const handleSave = () => {
    const contentToSave = selectedText ? 
      insightText + (noteText ? '\n\n---\n\nNotes: ' + noteText : '') : 
      insightText;
      
    if (!contentToSave.trim() && !voiceNote) {
      return;
    }
    
    const insight: InsightData = {
      id: `insight-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type: insightType,
      content: contentToSave.trim(),
      highlightedText: selectedText || undefined,
      voiceNote: voiceNote || undefined,
      tags: selectedTags,
      timestamp: new Date().toISOString(),
      lessonContext: {
        lessonId,
        lessonTitle,
        sectionId: sectionId || '',
        timeInLesson
      }
    };
    
    try {
      const existingInsights = JSON.parse(localStorage.getItem('userInsights') || '[]');
      existingInsights.push(insight);
      localStorage.setItem('userInsights', JSON.stringify(existingInsights));
      window.dispatchEvent(new Event('storage'));
      
      if (onSave) {
        onSave(insight);
      }
      
      onClose();
    } catch (error) {
      console.error('Failed to save insight:', error);
      alert('Failed to save insight. Please try again.');
    }
  };
  
  const handleTagToggle = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };
  
  const handleAddCustomTag = () => {
    const trimmedTag = customTag.trim().toLowerCase();
    if (trimmedTag && !selectedTags.includes(trimmedTag) && 
        !commonTags.includes(trimmedTag) && !additionalTags.includes(trimmedTag)) {
      setSelectedTags(prev => [...prev, trimmedTag]);
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
          <motion.div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />
          
          <motion.div
            className="relative bg-gradient-to-br from-slate-900 via-purple-900/50 to-slate-900 rounded-3xl border border-purple-500/20 max-w-2xl w-full max-h-[85vh] overflow-hidden"
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
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
            <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto">
              {/* Insight Type Selection */}
              <div>
                <label className="text-white text-sm font-medium mb-3 block">Type of Insight</label>
                <div className="grid grid-cols-4 gap-3">
                  {insightTypes.map(({ type, icon: Icon, label, color }) => (
                    <motion.button
                      key={type}
                      type="button"
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
                  {selectedText ? 'Highlighted Text' : 'What resonated with you?'}
                </label>
                {selectedText && (
                  <div className="mb-3 p-3 bg-purple-600/20 rounded-xl border border-purple-500/30">
                    <p className="text-purple-200 text-sm italic">"{selectedText}"</p>
                  </div>
                )}
                <textarea
                  ref={textareaRef}
                  value={selectedText ? noteText : insightText}
                  onChange={(e) => selectedText ? setNoteText(e.target.value) : setInsightText(e.target.value)}
                  placeholder={selectedText ? "Add your thoughts about this text..." : "Describe your insight, realization, or reflection..."}
                  className="w-full h-32 bg-black/30 border border-purple-500/20 rounded-xl px-4 py-3 text-white placeholder-purple-300/40 focus:outline-none focus:border-purple-400 resize-none"
                />
                <p className="text-purple-300/60 text-xs mt-2">
                  {(selectedText ? noteText : insightText).length} characters
                </p>
              </div>
              
              {/* Voice Note - Only if VoiceNoteRecorder exists */}
              {typeof VoiceNoteRecorder !== 'undefined' && (
                <VoiceNoteRecorder
                  onRecordingComplete={setVoiceNote}
                  isRecording={isRecording}
                  setIsRecording={setIsRecording}
                />
              )}
              
              {/* Tags */}
              <div>
                <label className="text-white text-sm font-medium mb-3 block">
                  Add Tags (helps find patterns)
                </label>
                
                {/* Common Tags */}
                <div className="flex flex-wrap gap-2 mb-3">
                  {commonTags.map(tag => (
                    <motion.button
                      key={tag}
                      type="button"
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
                  
                  {/* More Tags Dropdown */}
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setShowMoreTags(!showMoreTags)}
                      className="px-3 py-1.5 bg-purple-500/20 text-purple-300 hover:bg-purple-500/30 rounded-full text-sm flex items-center gap-1"
                    >
                      More tags
                      <ChevronDown className={`w-3 h-3 transition-transform ${showMoreTags ? 'rotate-180' : ''}`} />
                    </button>
                    
                    <AnimatePresence>
                      {showMoreTags && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="absolute top-full left-0 mt-2 bg-slate-900 border border-purple-500/20 rounded-xl p-3 w-64 z-10"
                        >
                          <div className="flex flex-wrap gap-2">
                            {additionalTags.map(tag => (
                              <button
                                key={tag}
                                type="button"
                                onClick={() => handleTagToggle(tag)}
                                className={`px-2 py-1 rounded-full text-xs transition-all ${
                                  selectedTags.includes(tag)
                                    ? 'bg-purple-600 text-white'
                                    : 'bg-purple-500/20 text-purple-300 hover:bg-purple-500/30'
                                }`}
                              >
                                {tag}
                              </button>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
                
                {/* Custom Tag Input */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={customTag}
                    onChange={(e) => setCustomTag(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddCustomTag();
                      }
                    }}
                    placeholder="Add custom tag..."
                    className="flex-1 bg-black/30 border border-purple-500/20 rounded-lg px-3 py-2 text-white text-sm placeholder-purple-300/40 focus:outline-none focus:border-purple-400"
                  />
                  <button
                    type="button"
                    onClick={handleAddCustomTag}
                    className="px-4 py-2 bg-purple-600 rounded-lg text-white text-sm hover:bg-purple-700 transition-colors"
                  >
                    Add
                  </button>
                </div>
                
                {/* Selected Tags Display */}
                {selectedTags.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {selectedTags.map(tag => (
                      <span
                        key={tag}
                        className="px-3 py-1 bg-purple-600/30 text-purple-200 rounded-full text-sm flex items-center gap-1"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => handleTagToggle(tag)}
                          className="ml-1 hover:text-white"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
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
                    disabled={!insightText.trim() && !noteText.trim() && !voiceNote}
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