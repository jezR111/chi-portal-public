// src/features/yin/components/chapters/PathsView.tsx

import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowLeft,
  BookOpen,
  CheckCircle,
  ChevronRight,
  Circle,
  Clock,
  Lock,
  Sparkles,
  Star
} from 'lucide-react';
import React, { useState } from 'react';
import { Chapter, Lesson, Path, pathsData } from '../../data/pathsData';
import { InsightButton } from '../insights/InsightButton';
import { InsightCapture } from '../insights/InsightCapture';
import { MeditationOverlay } from '../meditation/MeditationOverlay';
import { BackgroundEffects } from './BackgroundEffects';
import { LessonPlayer } from './LessonPlayer';

export const PathsView: React.FC = () => {
  const [selectedPath, setSelectedPath] = useState<Path | null>(null);
  const [selectedChapter, setSelectedChapter] = useState<Chapter | null>(null);
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
  const [showInsightCapture, setShowInsightCapture] = useState(false);
  const [showMeditation, setShowMeditation] = useState(false);
  const [currentView, setCurrentView] = useState<'paths' | 'chapters' | 'lesson'>('paths');

  const handlePathSelect = (path: Path) => {
    setSelectedPath(path);
    setCurrentView('chapters');
  };

  const handleChapterSelect = (chapter: Chapter) => {
    setSelectedChapter(chapter);
    setActiveLesson(chapter.lessons[0]);
    setCurrentView('lesson');
  };

  const handleBack = () => {
    if (currentView === 'lesson') {
      setCurrentView('chapters');
      setActiveLesson(null);
    } else if (currentView === 'chapters') {
      setCurrentView('paths');
      setSelectedPath(null);
    }
  };

  const handleInsightSave = (insight: any) => {
    console.log('Insight saved:', insight);
    // Handle insight save to backend
  };

  const handleMeditationComplete = () => {
    setShowMeditation(false);
    // Award XP and continue lesson
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-purple-950/90 to-indigo-950 relative overflow-hidden">
      <BackgroundEffects />
      
      {/* Navigation Header */}
      <div className="relative z-20 bg-black/40 backdrop-blur-xl border-b border-purple-500/20 p-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            {currentView !== 'paths' && (
              <motion.button
                onClick={handleBack}
                className="p-2 hover:bg-purple-500/20 rounded-lg transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <ArrowLeft className="w-5 h-5 text-purple-300" />
              </motion.button>
            )}
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-200 to-purple-100 bg-clip-text text-transparent">
                {currentView === 'paths' && 'Choose Your Path'}
                {currentView === 'chapters' && selectedPath?.title}
                {currentView === 'lesson' && selectedChapter?.title}
              </h1>
              <p className="text-purple-300/80 mt-1">
                {currentView === 'paths' && 'Begin your journey of self-discovery'}
                {currentView === 'chapters' && 'Select a chapter to explore'}
                {currentView === 'lesson' && activeLesson?.title}
              </p>
            </div>
          </div>
          
          {/* Stats */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-purple-500/20 px-4 py-2 rounded-full">
              <Sparkles className="w-4 h-4 text-yellow-400" />
              <span className="text-purple-200 font-medium">Level 3</span>
            </div>
            <div className="flex items-center gap-2 bg-purple-500/20 px-4 py-2 rounded-full">
              <Star className="w-4 h-4 text-purple-400" />
              <span className="text-purple-200 font-medium">2,450 XP</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 p-8">
        <AnimatePresence mode="wait">
          {/* Paths Grid */}
          {currentView === 'paths' && (
            <motion.div
              key="paths"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto"
            >
              {pathsData.map((path, index) => (
                <motion.div
                  key={path.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02, y: -5 }}
                  onClick={() => handlePathSelect(path)}
                  className="cursor-pointer"
                >
                  <div className="relative h-full bg-gradient-to-br from-gray-900/50 to-purple-900/30 backdrop-blur-xl rounded-2xl border border-purple-500/30 p-6 hover:border-purple-400/50 transition-all overflow-hidden group">
                    {/* Animated Background */}
                    <motion.div 
                      className={`absolute inset-0 bg-gradient-to-br ${path.color} opacity-5 group-hover:opacity-10 transition-opacity`}
                    />
                    
                    {/* Glow Effect */}
                    <div className={`absolute -inset-1 bg-gradient-to-br ${path.color} opacity-0 group-hover:opacity-20 blur-xl transition-opacity`} />
                    
                    {/* Content */}
                    <div className="relative">
                      {/* Icon */}
                      <div className={`w-16 h-16 bg-gradient-to-br ${path.color} rounded-xl flex items-center justify-center mb-4 shadow-lg group-hover:shadow-xl transition-shadow`}>
                        <path.icon className="w-8 h-8 text-purple-100" />
                      </div>
                      
                      {/* Title & Description */}
                      <h3 className="text-xl font-bold bg-gradient-to-r from-purple-200 to-purple-100 bg-clip-text text-transparent mb-2">
                        {path.title}
                      </h3>
                      <p className="text-purple-300/90 text-sm leading-relaxed mb-4">
                        {path.description}
                      </p>
                      
                      {/* Stats */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <span className="text-purple-400 text-sm flex items-center gap-1">
                            <BookOpen className="w-4 h-4" />
                            {path.chapters.length} Chapters
                          </span>
                          <span className="text-purple-400 text-sm flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {path.estimatedTime || '2-3 hours'}
                          </span>
                        </div>
                        <ChevronRight className="w-5 h-5 text-purple-400 group-hover:translate-x-1 transition-transform" />
                      </div>
                      
                      {/* Progress Bar */}
                      {path.progress && path.progress > 0 && (
                        <div className="mt-4">
                          <div className="h-2 bg-black/50 rounded-full overflow-hidden">
                            <motion.div
                              className={`h-full bg-gradient-to-r ${path.color}`}
                              initial={{ width: 0 }}
                              animate={{ width: `${path.progress}%` }}
                              transition={{ duration: 1, delay: 0.2 }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* Chapters View */}
          {currentView === 'chapters' && selectedPath && (
            <motion.div
              key="chapters"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-4xl mx-auto"
            >
              {/* Path Description */}
              <div className="bg-gradient-to-br from-gray-900/50 to-purple-900/30 backdrop-blur-xl rounded-2xl border border-purple-500/30 p-6 mb-8">
                <p className="text-purple-200/90 leading-relaxed">
                  {selectedPath.fullDescription || selectedPath.description}
                </p>
              </div>

              {/* Chapters List */}
              <div className="space-y-4">
                {selectedPath.chapters.map((chapter, index) => (
                  <motion.div
                    key={chapter.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => handleChapterSelect(chapter)}
                    className="cursor-pointer group"
                  >
                    <div className="relative bg-gradient-to-br from-gray-900/50 to-purple-900/30 backdrop-blur-xl rounded-xl border border-purple-500/30 p-5 hover:border-purple-400/50 transition-all">
                      {/* Chapter Number */}
                      <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-gradient-to-br from-purple-600 to-purple-700 rounded-full flex items-center justify-center shadow-lg">
                        <span className="text-purple-100 font-bold">{index + 1}</span>
                      </div>
                      
                      <div className="ml-6 flex items-center justify-between">
                        <div className="flex-1">
                          <h4 className="text-lg font-semibold text-purple-100 mb-1">
                            {chapter.title}
                          </h4>
                          <p className="text-purple-300/80 text-sm mb-3">
                            {chapter.description}
                          </p>
                          <div className="flex items-center gap-4">
                            <span className="text-purple-400 text-xs flex items-center gap-1">
                              <BookOpen className="w-3 h-3" />
                              {chapter.lessons.length} Lessons
                            </span>
                            <span className="text-purple-400 text-xs flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {chapter.estimatedTime || '45 min'}
                            </span>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-3">
                          {chapter.completed ? (
                            <CheckCircle className="w-6 h-6 text-green-400" />
                          ) : chapter.locked ? (
                            <Lock className="w-6 h-6 text-purple-500/50" />
                          ) : (
                            <Circle className="w-6 h-6 text-purple-400" />
                          )}
                          <ChevronRight className="w-5 h-5 text-purple-400 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>

                      {/* Chapter Progress */}
                      {chapter.progress && chapter.progress > 0 && (
                        <div className="mt-4 ml-6">
                          <div className="h-1.5 bg-black/50 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-gradient-to-r from-purple-500 to-purple-400"
                              style={{ width: `${chapter.progress}%` }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Lesson View */}
          {currentView === 'lesson' && activeLesson && selectedChapter && (
            <motion.div
              key="lesson"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-4xl mx-auto"
            >
              <LessonPlayer
                lesson={activeLesson}
                chapter={selectedChapter}
                onComplete={() => {
                  // Handle lesson completion
                }}
                onInsightTrigger={() => setShowInsightCapture(true)}
                onMeditationTrigger={() => setShowMeditation(true)}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Floating Insight Button (visible during lessons) */}
      {currentView === 'lesson' && (
        <InsightButton
          lessonId={activeLesson?.id || ''}
          timeInLesson={0}
          onInsightClick={() => setShowInsightCapture(true)}
          position="fixed"
        />
      )}

      {/* Insight Capture Modal */}
      <InsightCapture
        isOpen={showInsightCapture}
        onClose={() => setShowInsightCapture(false)}
        lessonId={activeLesson?.id || ''}
        lessonTitle={activeLesson?.title || ''}
        timeInLesson={0}
        onSave={handleInsightSave}
      />

      {/* Meditation Overlay */}
      <MeditationOverlay
        isOpen={showMeditation}
        onClose={() => setShowMeditation(false)}
        onComplete={handleMeditationComplete}
        duration={3}
        type="meditation"
        mandatory={false}
        lessonId={activeLesson?.id}
        lessonTitle={activeLesson?.title}
      />
    </div>
  );
};

export default PathsView;