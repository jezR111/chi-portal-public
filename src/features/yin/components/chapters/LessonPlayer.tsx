// src/features/yin/components/chapters/LessonPlayer.tsx

import { AnimatePresence, motion } from 'framer-motion';
import {
  BookOpen,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Clock,
  Edit3,
  Headphones,
  Heart,
  Play,
  Sparkles,
  Star,
  Video,
  Volume2
} from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { getLessonContent } from '../../data/lessonContent';

interface LessonPlayerProps {
  lesson: any;
  chapter: any;
  onComplete: () => void;
  onNext: () => void;
  onBack?: () => void;
  onInsightCapture?: (insight: any) => void;
  onMeditationTrigger?: () => void;
  onInsightTrigger?: () => void;
  isFromQuest?: boolean;
}

export const LessonPlayer: React.FC<LessonPlayerProps> = ({
  lesson,
  chapter,
  onComplete,
  onNext,
  onBack,
  onInsightCapture,
  onMeditationTrigger,
  onInsightTrigger,
  isFromQuest = false
}) => {
  const [currentSection, setCurrentSection] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [showMeditation, setShowMeditation] = useState(false);
  const [showExercise, setShowExercise] = useState(false);
  const [showReflection, setShowReflection] = useState(false);
  const [reflectionAnswers, setReflectionAnswers] = useState<Record<number, any>>({});
  
  const [meditationCompleted, setMeditationCompleted] = useState(false);
  const [exerciseCompleted, setExerciseCompleted] = useState(false);
  const [reflectionCompleted, setReflectionCompleted] = useState(false);
  
  const content = getLessonContent(lesson.id);

  // Scroll to top when section changes
useEffect(() => {
  // Try multiple scroll targets to ensure we hit the right container
  
  // 1. Window scroll
  window.scrollTo(0, 0);
  
  // 2. Document elements
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;
  
  // 3. Find the main content container (likely has overflow-y)
  const scrollContainers = document.querySelectorAll('[style*="overflow"], .overflow-y-auto, .overflow-y-scroll, main');
  scrollContainers.forEach(container => {
    container.scrollTop = 0;
  });
  
  // 4. Try to find the Yin page container specifically
  const yinContainer = document.querySelector('.yin-container') || 
                       document.querySelector('[data-scroll-container]') ||
                       document.querySelector('main') ||
                       document.getElementById('main-content');
  
  if (yinContainer) {
    yinContainer.scrollTop = 0;
  }
  
  // 5. As a fallback, find the first scrollable parent
  let element = document.querySelector('.min-h-screen');
  while (element && element !== document.body) {
    if (element.scrollHeight > element.clientHeight) {
      element.scrollTop = 0;
    }
    element = element.parentElement;
  }
}, [currentSection, showMeditation, showExercise, showReflection]);

  if (!content) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <BookOpen className="w-16 h-16 text-purple-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Lesson Content Coming Soon</h2>
          <p className="text-purple-300 mb-6">We're preparing amazing content for this lesson</p>
          <button
            onClick={onNext}
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl text-white font-semibold"
          >
            Continue to Next Lesson
          </button>
        </div>
      </div>
    );
  }
  
  const totalSections = content.sections.length;
  const progress = ((currentSection + 1) / totalSections) * 100;

  const handleSectionComplete = () => {
    if (currentSection < totalSections - 1) {
      setCurrentSection(currentSection + 1);
    } else if (content.meditation && !showMeditation && !meditationCompleted) {
      setShowMeditation(true);
    } else if (content.exercise && !showExercise && !exerciseCompleted) {
      setShowExercise(true);
    } else if (content.reflection && !showReflection && !reflectionCompleted) {
      setShowReflection(true);
    } else {
      handleLessonComplete();
    }
  };

  const handleLessonComplete = () => {
    setIsCompleted(true);
    onComplete();
  };

  const renderSection = (section: any, index: number) => {
    if (index !== currentSection) return null;

    return (
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="max-w-4xl mx-auto"
        >
          {section.type === 'text' && (
            <div className="bg-black/30 backdrop-blur-xl rounded-3xl p-8 border border-purple-500/20">
              {section.title && (
                <h2 className="text-2xl font-bold text-white mb-6">{section.title}</h2>
              )}
              <div className="prose prose-lg prose-invert max-w-none">
                <div 
                  className="text-purple-100/90 leading-relaxed whitespace-pre-line"
                  dangerouslySetInnerHTML={{ __html: section.content.replace(/\n/g, '<br />') }}
                />
              </div>
            </div>
          )}

          {section.type === 'quote' && (
            <div className="bg-gradient-to-r from-purple-900/50 to-pink-900/50 backdrop-blur-xl rounded-3xl p-8 border border-purple-500/30">
              <Sparkles className="w-8 h-8 text-purple-400 mb-4" />
              <p className="text-2xl font-light text-white italic leading-relaxed">
                {section.content}
              </p>
            </div>
          )}

          {section.type === 'video' && (
            <div className="bg-black/30 backdrop-blur-xl rounded-3xl p-8 border border-purple-500/20">
              <div className="flex items-center gap-3 mb-6">
                <Video className="w-6 h-6 text-purple-400" />
                <h3 className="text-xl font-semibold text-white">{section.title}</h3>
                <span className="text-purple-300 text-sm">({section.duration} min)</span>
              </div>
              <div className="aspect-video bg-gray-900/50 rounded-2xl flex items-center justify-center">
                <Play className="w-16 h-16 text-purple-400" />
              </div>
            </div>
          )}

          {section.type === 'audio' && (
            <div className="bg-black/30 backdrop-blur-xl rounded-3xl p-8 border border-purple-500/20">
              <div className="flex items-center gap-3 mb-6">
                <Headphones className="w-6 h-6 text-purple-400" />
                <h3 className="text-xl font-semibold text-white">{section.title}</h3>
              </div>
              <div className="bg-gray-900/50 rounded-2xl p-6 flex items-center justify-center">
                <Volume2 className="w-12 h-12 text-purple-400" />
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    );
  };

  const renderMeditation = () => {
    if (!content.meditation || !showMeditation) return null;

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-4xl mx-auto"
      >
        <div className="bg-gradient-to-br from-indigo-900/50 to-purple-900/50 backdrop-blur-xl rounded-3xl p-8 border border-purple-500/30">
          <div className="text-center mb-8">
            <Heart className="w-12 h-12 text-pink-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">{content.meditation.title}</h2>
            <p className="text-purple-300">Duration: {content.meditation.duration} minutes</p>
            {isFromQuest && (
              <p className="text-amber-300 text-sm mt-2">+5 XP for completing this meditation</p>
            )}
          </div>
          
          <div className="space-y-4">
            {content.meditation.guidance.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-start gap-3"
              >
                <div className="w-8 h-8 bg-purple-600/30 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-purple-300 text-sm font-semibold">{index + 1}</span>
                </div>
                <p className="text-purple-100/80 leading-relaxed">{step}</p>
              </motion.div>
            ))}
          </div>

          <div className="mt-8 flex justify-center gap-4">
            <button
              onClick={() => {
                setMeditationCompleted(true);
                if (isFromQuest && onMeditationTrigger) {
                  onMeditationTrigger();
                }
                setShowMeditation(false);
                handleSectionComplete();
              }}
              className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl text-white font-semibold hover:shadow-lg hover:shadow-purple-500/25 transition-all"
            >
              Complete Meditation
            </button>
            
            <button
              onClick={() => {
                setShowMeditation(false);
                handleSectionComplete();
              }}
              className="px-6 py-3 bg-gray-600/20 text-gray-400 rounded-xl hover:bg-gray-600/30 transition-all"
            >
              Skip for now
            </button>
          </div>
        </div>
      </motion.div>
    );
  };

  const renderExercise = () => {
    if (!content.exercise || !showExercise) return null;

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-4xl mx-auto"
      >
        <div className="bg-gradient-to-br from-emerald-900/50 to-teal-900/50 backdrop-blur-xl rounded-3xl p-8 border border-emerald-500/30">
          <div className="text-center mb-8">
            <Edit3 className="w-12 h-12 text-emerald-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">{content.exercise.title}</h2>
            <p className="text-emerald-300">
              Type: {content.exercise.type} • Duration: {content.exercise.duration} minutes
            </p>
            {isFromQuest && (
              <p className="text-amber-300 text-sm mt-2">+5 XP for completing this exercise</p>
            )}
          </div>
          
          <div className="space-y-4">
            {content.exercise.instructions.map((instruction, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-start gap-3"
              >
                <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-1" />
                <p className="text-emerald-100/80 leading-relaxed">{instruction}</p>
              </motion.div>
            ))}
          </div>

          <div className="mt-8 flex justify-center gap-4">
            <button
              onClick={() => {
                setExerciseCompleted(true);
                setShowExercise(false);
                handleSectionComplete();
              }}
              className="px-8 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-xl text-white font-semibold hover:shadow-lg hover:shadow-emerald-500/25 transition-all"
            >
              Complete Exercise
            </button>
            
            <button
              onClick={() => {
                setShowExercise(false);
                handleSectionComplete();
              }}
              className="px-6 py-3 bg-gray-600/20 text-gray-400 rounded-xl hover:bg-gray-600/30 transition-all"
            >
              Skip for now
            </button>
          </div>
        </div>
      </motion.div>
    );
  };

  const renderReflection = () => {
    if (!content.reflection || !showReflection) return null;

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-4xl mx-auto"
      >
        <div className="bg-gradient-to-br from-amber-900/50 to-orange-900/50 backdrop-blur-xl rounded-3xl p-8 border border-amber-500/30">
          <div className="text-center mb-8">
            <Star className="w-12 h-12 text-amber-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">Reflection Time</h2>
            <p className="text-amber-300">Take a moment to integrate what you've learned</p>
            {isFromQuest && Object.keys(reflectionAnswers).length > 0 && (
              <p className="text-amber-300 text-sm mt-2">+5 XP for completing reflection</p>
            )}
          </div>
          
          <div className="space-y-6">
            {content.reflection.map((prompt, index) => (
              <div key={index} className="bg-black/30 rounded-2xl p-6">
                <p className="text-white mb-4">{prompt.question}</p>
                
                {prompt.type === 'text' && (
                  <textarea
                    className="w-full p-4 bg-gray-900/50 border border-amber-500/30 rounded-xl text-white placeholder-amber-300/50 focus:border-amber-500/50 focus:outline-none"
                    rows={3}
                    placeholder="Share your thoughts..."
                    value={reflectionAnswers[index] || ''}
                    onChange={(e) => setReflectionAnswers({ ...reflectionAnswers, [index]: e.target.value })}
                  />
                )}
                
                {prompt.type === 'rating' && (
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(rating => (
                      <button
                        key={rating}
                        onClick={() => setReflectionAnswers({ ...reflectionAnswers, [index]: rating })}
                        className={`
                          w-10 h-10 rounded-lg flex items-center justify-center transition-all
                          ${reflectionAnswers[index] === rating
                            ? 'bg-amber-500 text-white'
                            : 'bg-gray-900/50 text-amber-300/50 hover:bg-amber-500/20'
                          }
                        `}
                      >
                        {rating}
                      </button>
                    ))}
                  </div>
                )}
                
                {prompt.type === 'choice' && prompt.options && (
                  <div className="space-y-2">
                    {prompt.options.map((option, optionIndex) => (
                      <button
                        key={optionIndex}
                        onClick={() => setReflectionAnswers({ ...reflectionAnswers, [index]: option })}
                        className={`
                          w-full p-3 rounded-xl text-left transition-all
                          ${reflectionAnswers[index] === option
                            ? 'bg-amber-500/30 text-white border border-amber-500/50'
                            : 'bg-gray-900/50 text-amber-100/70 border border-amber-500/20 hover:bg-amber-500/10'
                          }
                        `}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-8 flex justify-center gap-4">
            <button
              onClick={() => {
                setReflectionCompleted(true);
                if (isFromQuest && onInsightCapture && Object.keys(reflectionAnswers).length > 0) {
                  onInsightCapture(reflectionAnswers);
                }
                handleLessonComplete();
              }}
              className="px-8 py-3 bg-gradient-to-r from-amber-600 to-orange-600 rounded-xl text-white font-semibold hover:shadow-lg hover:shadow-amber-500/25 transition-all"
            >
              Submit Reflection
            </button>
            
            <button
              onClick={() => {
                handleLessonComplete();
              }}
              className="px-6 py-3 bg-gray-600/20 text-gray-400 rounded-xl hover:bg-gray-600/30 transition-all"
            >
              Skip Reflection
            </button>
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen relative">
      <div className="sticky top-0 z-20 bg-black/30 backdrop-blur-xl rounded-3xl p-6 mb-8 border border-purple-500/20">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            {onBack && (
              <button
                onClick={onBack}
                className="p-2 hover:bg-purple-500/20 rounded-lg transition-colors"
                aria-label="Back to chapter"
              >
                <ChevronLeft className="w-5 h-5 text-purple-300" />
              </button>
            )}
            
            <div>
              <h1 className="text-2xl font-bold text-white mb-1">{lesson.title}</h1>
              <div className="flex items-center gap-4 text-sm text-purple-300">
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {lesson.duration || 15} min
                </span>
                <span className="flex items-center gap-1">
                  <BookOpen className="w-4 h-4" />
                  {chapter.title}
                </span>
              </div>
            </div>
          </div>
          
          <div className="text-right">
            <p className="text-purple-400 text-sm mb-1">Section {currentSection + 1} of {totalSections}</p>
            <div className="flex items-center gap-2">
              <div className="w-32 h-2 bg-gray-900/50 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-purple-600 to-pink-600"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
              <span className="text-white text-sm font-semibold">{Math.round(progress)}%</span>
            </div>
          </div>
        </div>
      </div>

      <div className="relative">
        {!showMeditation && !showExercise && !showReflection && content.sections.map((section, index) => renderSection(section, index))}
        {renderMeditation()}
        {renderExercise()}
        {renderReflection()}
      </div>

      {!showMeditation && !showExercise && !showReflection && (
        <div className="flex justify-between items-center mt-8">
          <button
            onClick={() => {
              setCurrentSection(Math.max(0, currentSection - 1));
              window.scrollTo(0, 0);
              document.documentElement.scrollTop = 0;
              document.body.scrollTop = 0;
            }}
            disabled={currentSection === 0}
            className={`
              flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all
              ${currentSection === 0
                ? 'bg-gray-900/30 text-gray-600 cursor-not-allowed'
                : 'bg-purple-600/20 text-purple-300 hover:bg-purple-600/30'
              }
            `}
          >
            <ChevronLeft className="w-5 h-5" />
            Previous
          </button>

          <button
            onClick={() => {
              handleSectionComplete();
              window.scrollTo(0, 0);
              document.documentElement.scrollTop = 0;
              document.body.scrollTop = 0;
            }}
            className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl text-white font-semibold hover:shadow-lg hover:shadow-purple-500/25 transition-all"
          >
            {currentSection < totalSections - 1 ? 'Continue' : 
             content.meditation ? 'Start Meditation' :
             content.exercise ? 'Start Exercise' :
             content.reflection ? 'Reflect' : 'Complete Lesson'}
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}

      {isCompleted && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="fixed inset-0 flex items-center justify-center z-50 bg-black/50 backdrop-blur-sm"
        >
          <div className="bg-gradient-to-br from-purple-900 to-pink-900 rounded-3xl p-8 max-w-md text-center">
            <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-white mb-2">Lesson Complete!</h2>
            <p className="text-purple-200 mb-6">You've earned 10 XP</p>
            <button
              onClick={onNext}
              className="px-8 py-3 bg-white text-purple-900 rounded-xl font-semibold hover:bg-purple-100 transition-all"
            >
              Continue Journey
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
};