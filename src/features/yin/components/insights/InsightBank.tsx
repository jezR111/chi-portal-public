// src/features/yin/components/insights/InsightBank.tsx
'use client'

import { AnimatePresence, motion } from 'framer-motion';
import {
  Brain,
  Heart,
  Lightbulb,
  Search,
  Sparkles,
  Tag,
  Trash2,
  X,
  Zap
} from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { InsightData, InsightType } from '../../types/insight.types';

const insightTypeConfig = {
  lightbulb: { icon: Lightbulb, color: 'from-yellow-500 to-amber-500', label: 'Insight' },
  breakthrough: { icon: Zap, color: 'from-purple-500 to-pink-500', label: 'Breakthrough' },
  note: { icon: Brain, color: 'from-blue-500 to-indigo-500', label: 'Reflection' },
  heart: { icon: Heart, color: 'from-red-500 to-pink-500', label: 'Emotional' }
};

export const InsightBank: React.FC = () => {
  const [insights, setInsights] = useState<InsightData[]>([]);
  const [filteredInsights, setFilteredInsights] = useState<InsightData[]>([]);
  const [selectedType, setSelectedType] = useState<InsightType | 'all'>('all');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedInsight, setSelectedInsight] = useState<InsightData | null>(null);
  const [allTags, setAllTags] = useState<string[]>([]);

  // Load insights from localStorage
  useEffect(() => {
    const loadInsights = () => {
      try {
        const stored = localStorage.getItem('userInsights');
        if (stored) {
          const parsedInsights = JSON.parse(stored);
          
          // Remove duplicates based on ID
          const uniqueInsights = parsedInsights.filter((insight: InsightData, index: number, self: InsightData[]) =>
            index === self.findIndex((i) => i.id === insight.id)
          );
          
          // If we removed duplicates, update localStorage
          if (uniqueInsights.length !== parsedInsights.length) {
            localStorage.setItem('userInsights', JSON.stringify(uniqueInsights));
            console.log(`Removed ${parsedInsights.length - uniqueInsights.length} duplicate insights`);
          }
          
          // Sort by timestamp, newest first
          const sortedInsights = uniqueInsights.sort((a: InsightData, b: InsightData) => 
            new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
          );
          setInsights(sortedInsights);
          
          // Extract all unique tags
          const tags = new Set<string>();
          sortedInsights.forEach((insight: InsightData) => {
            insight.tags?.forEach(tag => tags.add(tag));
          });
          setAllTags(Array.from(tags).sort());
          
          console.log(`Loaded ${sortedInsights.length} insights from localStorage`);
        }
      } catch (error) {
        console.error('Failed to load insights:', error);
        setInsights([]);
      }
    };

    loadInsights();

    // Listen for storage events (updates from other components)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'userInsights' || !e.key) {
        loadInsights();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    // Also listen for custom storage event (for same-tab updates)
    window.addEventListener('storage', loadInsights as any);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('storage', loadInsights as any);
    };
  }, []);

  // Filter insights based on selected filters
  useEffect(() => {
    let filtered = [...insights];

    // Filter by type
    if (selectedType !== 'all') {
      filtered = filtered.filter(insight => insight.type === selectedType);
    }

    // Filter by tags
    if (selectedTags.length > 0) {
      filtered = filtered.filter(insight =>
        selectedTags.every(tag => insight.tags?.includes(tag))
      );
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(insight =>
        insight.content.toLowerCase().includes(query) ||
        insight.highlightedText?.toLowerCase().includes(query) ||
        insight.lessonContext.lessonTitle.toLowerCase().includes(query)
      );
    }

    setFilteredInsights(filtered);
  }, [insights, selectedType, selectedTags, searchQuery]);

  const handleDeleteInsight = (id: string) => {
    if (confirm('Are you sure you want to delete this insight?')) {
      const updatedInsights = insights.filter(i => i.id !== id);
      localStorage.setItem('userInsights', JSON.stringify(updatedInsights));
      setInsights(updatedInsights);
      if (selectedInsight?.id === id) {
        setSelectedInsight(null);
      }
    }
  };

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      const hours = date.getHours();
      const minutes = date.getMinutes();
      return `Today at ${hours}:${minutes.toString().padStart(2, '0')}`;
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 p-6">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
              <Sparkles className="w-8 h-8 text-yellow-400" />
              Your Insight Bank
            </h1>
            <p className="text-purple-300">
              {insights.length} total insights captured • {filteredInsights.length} showing
            </p>
          </div>
          
          {insights.length > 0 && (
            <div className="bg-purple-600/20 rounded-xl px-4 py-2 border border-purple-500/30">
              <p className="text-purple-200 text-sm">Latest insight</p>
              <p className="text-white font-semibold">{formatDate(insights[0]?.timestamp)}</p>
            </div>
          )}
        </div>

        {/* Filters */}
        <div className="space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-purple-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search insights..."
              className="w-full pl-10 pr-4 py-3 bg-black/30 border border-purple-500/20 rounded-xl text-white placeholder-purple-400/50 focus:outline-none focus:border-purple-400"
            />
          </div>

          {/* Type Filter */}
          <div className="flex items-center gap-4">
            <span className="text-purple-300 text-sm">Type:</span>
            <div className="flex gap-2">
              <button
                onClick={() => setSelectedType('all')}
                className={`px-4 py-2 rounded-lg transition-all ${
                  selectedType === 'all'
                    ? 'bg-purple-600 text-white'
                    : 'bg-black/30 text-purple-300 hover:bg-black/40'
                }`}
              >
                All
              </button>
              {Object.entries(insightTypeConfig).map(([type, config]) => {
                const Icon = config.icon;
                return (
                  <button
                    key={type}
                    onClick={() => setSelectedType(type as InsightType)}
                    className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all ${
                      selectedType === type
                        ? `bg-gradient-to-r ${config.color} text-white`
                        : 'bg-black/30 text-purple-300 hover:bg-black/40'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {config.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Tag Filter */}
          {allTags.length > 0 && (
            <div className="flex items-start gap-4">
              <span className="text-purple-300 text-sm mt-2">Tags:</span>
              <div className="flex flex-wrap gap-2">
                {allTags.map(tag => (
                  <button
                    key={tag}
                    onClick={() => {
                      setSelectedTags(prev =>
                        prev.includes(tag)
                          ? prev.filter(t => t !== tag)
                          : [...prev, tag]
                      );
                    }}
                    className={`px-3 py-1.5 rounded-full text-sm transition-all ${
                      selectedTags.includes(tag)
                        ? 'bg-purple-600 text-white'
                        : 'bg-purple-500/20 text-purple-300 hover:bg-purple-500/30'
                    }`}
                  >
                    <Tag className="w-3 h-3 inline mr-1" />
                    {tag}
                  </button>
                ))}
                {selectedTags.length > 0 && (
                  <button
                    onClick={() => setSelectedTags([])}
                    className="px-3 py-1.5 bg-red-500/20 text-red-300 hover:bg-red-500/30 rounded-full text-sm"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Insights Grid */}
      <div className="max-w-7xl mx-auto">
        {filteredInsights.length === 0 ? (
          <div className="text-center py-12">
            <Brain className="w-16 h-16 text-purple-400 mx-auto mb-4" />
            <h3 className="text-xl text-white mb-2">
              {insights.length === 0 ? 'No insights yet' : 'No matching insights'}
            </h3>
            <p className="text-purple-300">
              {insights.length === 0 
                ? 'Start highlighting text in lessons to capture insights!'
                : 'Try adjusting your filters'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <AnimatePresence>
              {filteredInsights.map((insight, index) => {
                const config = insightTypeConfig[insight.type];
                const Icon = config.icon;
                
                return (
                  <motion.div
                    key={insight.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: index * 0.05 }}
                    className="relative group"
                  >
                    <div className="bg-black/40 backdrop-blur-sm rounded-xl p-5 border border-purple-500/20 hover:border-purple-400/40 transition-all cursor-pointer"
                         onClick={() => setSelectedInsight(insight)}>
                      {/* Header */}
                      <div className="flex items-start justify-between mb-3">
                        <div className={`w-10 h-10 bg-gradient-to-br ${config.color} rounded-lg flex items-center justify-center`}>
                          <Icon className="w-5 h-5 text-white" />
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteInsight(insight.id);
                          }}
                          className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-red-500/20 rounded-lg transition-all"
                        >
                          <Trash2 className="w-4 h-4 text-red-400" />
                        </button>
                      </div>

                      {/* Content */}
                      <div className="space-y-2">
                        {insight.highlightedText && (
                          <p className="text-purple-200 text-sm italic line-clamp-2">
                            "{insight.highlightedText}"
                          </p>
                        )}
                        {insight.content !== insight.highlightedText && (
                          <p className="text-white/90 text-sm line-clamp-3">
                            {insight.content.replace(insight.highlightedText || '', '').trim()}
                          </p>
                        )}
                      </div>

                      {/* Footer */}
                      <div className="mt-4 space-y-2">
                        {/* Tags */}
                        {insight.tags && insight.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {insight.tags.slice(0, 3).map(tag => (
                              <span key={tag} className="px-2 py-0.5 bg-purple-600/20 text-purple-300 rounded-full text-xs">
                                {tag}
                              </span>
                            ))}
                            {insight.tags.length > 3 && (
                              <span className="px-2 py-0.5 bg-purple-600/20 text-purple-300 rounded-full text-xs">
                                +{insight.tags.length - 3}
                              </span>
                            )}
                          </div>
                        )}
                        
                        {/* Metadata */}
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-purple-400">{insight.lessonContext.lessonTitle}</span>
                          <span className="text-purple-400/60">{formatDate(insight.timestamp)}</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Insight Detail Modal */}
      <AnimatePresence>
        {selectedInsight && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setSelectedInsight(null)}
            />
            
            <motion.div
              className="relative bg-gradient-to-br from-slate-900 via-purple-900/50 to-slate-900 rounded-3xl border border-purple-500/20 max-w-2xl w-full max-h-[80vh] overflow-hidden"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
            >
              {/* Modal Header */}
              <div className="p-6 border-b border-purple-500/20">
                <button
                  onClick={() => setSelectedInsight(null)}
                  className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-xl transition-colors"
                >
                  <X className="w-5 h-5 text-white" />
                </button>
                
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 bg-gradient-to-br ${insightTypeConfig[selectedInsight.type].color} rounded-xl flex items-center justify-center`}>
                    {React.createElement(insightTypeConfig[selectedInsight.type].icon, {
                      className: "w-6 h-6 text-white"
                    })}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">
                      {insightTypeConfig[selectedInsight.type].label}
                    </h3>
                    <p className="text-purple-300 text-sm">
                      {formatDate(selectedInsight.timestamp)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Modal Content */}
              <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
                {selectedInsight.highlightedText && (
                  <div className="p-4 bg-purple-600/20 rounded-xl border border-purple-500/30">
                    <p className="text-purple-200 italic">"{selectedInsight.highlightedText}"</p>
                  </div>
                )}
                
                {selectedInsight.content !== selectedInsight.highlightedText && (
                  <div>
                    <h4 className="text-white font-semibold mb-2">Your Notes</h4>
                    <p className="text-purple-100/90 whitespace-pre-wrap">
                      {selectedInsight.content.replace(selectedInsight.highlightedText || '', '').trim()}
                    </p>
                  </div>
                )}

                {/* Tags */}
                {selectedInsight.tags && selectedInsight.tags.length > 0 && (
                  <div>
                    <h4 className="text-white font-semibold mb-2">Tags</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedInsight.tags.map(tag => (
                        <span key={tag} className="px-3 py-1 bg-purple-600/30 text-purple-200 rounded-full text-sm">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Context */}
                <div className="p-4 bg-black/30 rounded-xl">
                  <h4 className="text-white font-semibold mb-2">Context</h4>
                  <div className="space-y-1 text-sm">
                    <p className="text-purple-300">
                      <span className="text-purple-400">Lesson:</span> {selectedInsight.lessonContext.lessonTitle}
                    </p>
                    {selectedInsight.lessonContext.sectionId && (
                      <p className="text-purple-300">
                        <span className="text-purple-400">Section:</span> {selectedInsight.lessonContext.sectionId}
                      </p>
                    )}
                    <p className="text-purple-300">
                      <span className="text-purple-400">Time in lesson:</span> {Math.floor(selectedInsight.lessonContext.timeInLesson / 60)}:{(selectedInsight.lessonContext.timeInLesson % 60).toString().padStart(2, '0')}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default InsightBank;