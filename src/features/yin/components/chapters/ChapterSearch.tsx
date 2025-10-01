//src/features/yin/components/chapters/ChapterSearch.tsx
'use client'

import { AnimatePresence, motion } from 'framer-motion';
import { Filter, Search, X } from 'lucide-react';
import React, { useState } from 'react';

interface ChapterSearchProps {
  onSearch: (query: string) => void;
  onFilter: (filters: FilterOptions) => void;
  totalPaths: number;
  totalChapters: number;
  totalLessons: number;
}

export interface FilterOptions {
  showLocked: boolean;
  showCompleted: boolean;
  difficulty: 'all' | 'beginner' | 'intermediate' | 'advanced';
  category: 'all' | 'self' | 'relationships' | 'energy' | 'practice';
}

export const ChapterSearch: React.FC<ChapterSearchProps> = ({
  onSearch,
  onFilter,
  totalPaths,
  totalChapters,
  totalLessons
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<FilterOptions>({
    showLocked: true,
    showCompleted: true,
    difficulty: 'all',
    category: 'all'
  });

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    onSearch(query);
  };

  const handleFilterChange = (key: keyof FilterOptions, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilter(newFilters);
  };

  const clearSearch = () => {
    setSearchQuery('');
    onSearch('');
  };

  return (
    <div className="mb-6">
      <div className="flex items-center gap-4 mb-4">
        {/* Search Bar */}
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-purple-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Search paths, chapters, or lessons..."
            className="w-full pl-12 pr-10 py-3 bg-purple-900/30 backdrop-blur-sm border border-purple-500/30 rounded-xl text-white placeholder-purple-400/60 focus:outline-none focus:border-purple-400/60 transition-all"
          />
          {searchQuery && (
            <button
              onClick={clearSearch}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 hover:bg-purple-800/30 rounded-lg transition-colors"
            >
              <X className="w-4 h-4 text-purple-400" />
            </button>
          )}
        </div>

        {/* Filter Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowFilters(!showFilters)}
          className={`p-3 rounded-xl border transition-all ${
            showFilters 
              ? 'bg-purple-600/30 border-purple-400/50' 
              : 'bg-purple-900/30 border-purple-500/30 hover:bg-purple-900/40'
          }`}
        >
          <Filter className="w-5 h-5 text-purple-300" />
        </motion.button>
      </div>

      {/* Quick Stats */}
      <div className="flex items-center gap-6 text-sm text-purple-300 mb-4">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-purple-400 rounded-full" />
          <span>{totalPaths} Paths</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-indigo-400 rounded-full" />
          <span>{totalChapters} Chapters</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-pink-400 rounded-full" />
          <span>{totalLessons} Lessons</span>
        </div>
      </div>

      {/* Filter Panel */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-purple-900/20 backdrop-blur-sm rounded-xl border border-purple-500/20 p-6 mb-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Visibility Filters */}
              <div>
                <label className="text-purple-200 text-sm font-medium mb-2 block">
                  Visibility
                </label>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.showLocked}
                      onChange={(e) => handleFilterChange('showLocked', e.target.checked)}
                      className="w-4 h-4 text-purple-600 bg-purple-900/30 border-purple-500/50 rounded focus:ring-purple-500"
                    />
                    <span className="text-purple-300 text-sm">Show Locked</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.showCompleted}
                      onChange={(e) => handleFilterChange('showCompleted', e.target.checked)}
                      className="w-4 h-4 text-purple-600 bg-purple-900/30 border-purple-500/50 rounded focus:ring-purple-500"
                    />
                    <span className="text-purple-300 text-sm">Show Completed</span>
                  </label>
                </div>
              </div>

              {/* Difficulty Filter */}
              <div>
                <label className="text-purple-200 text-sm font-medium mb-2 block">
                  Difficulty
                </label>
                <select
                  value={filters.difficulty}
                  onChange={(e) => handleFilterChange('difficulty', e.target.value)}
                  className="w-full px-3 py-2 bg-purple-900/30 border border-purple-500/30 rounded-lg text-purple-200 focus:outline-none focus:border-purple-400/60"
                >
                  <option value="all">All Levels</option>
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>

              {/* Category Filter */}
              <div>
                <label className="text-purple-200 text-sm font-medium mb-2 block">
                  Category
                </label>
                <select
                  value={filters.category}
                  onChange={(e) => handleFilterChange('category', e.target.value)}
                  className="w-full px-3 py-2 bg-purple-900/30 border border-purple-500/30 rounded-lg text-purple-200 focus:outline-none focus:border-purple-400/60"
                >
                  <option value="all">All Categories</option>
                  <option value="self">The Self</option>
                  <option value="relationships">Relationships</option>
                  <option value="energy">Energy Work</option>
                  <option value="practice">Daily Practice</option>
                </select>
              </div>

              {/* Reset Button */}
              <div className="flex items-end">
                <button
                  onClick={() => {
                    const defaultFilters: FilterOptions = {
                      showLocked: true,
                      showCompleted: true,
                      difficulty: 'all',
                      category: 'all'
                    };
                    setFilters(defaultFilters);
                    onFilter(defaultFilters);
                  }}
                  className="w-full px-4 py-2 bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/30 rounded-lg text-purple-300 transition-colors"
                >
                  Reset Filters
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ChapterSearch;