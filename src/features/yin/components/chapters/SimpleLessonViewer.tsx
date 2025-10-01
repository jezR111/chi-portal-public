'use client'

import { ArrowLeft, ArrowRight, BookOpen, CheckCircle, Clock, X } from 'lucide-react';
import React, { useState } from 'react';

interface SimpleLessonViewerProps {
  lesson: {
    id: string;
    title: string;
    duration: number;
    content?: string;
    objectives?: string[];
  };
  onComplete: () => void;
  onClose: () => void;
}

const SimpleLessonViewer: React.FC<SimpleLessonViewerProps> = ({
  lesson,
  onComplete,
  onClose
}) => {
  const [currentSection, setCurrentSection] = useState(0);
  const [sectionsCompleted, setSectionsCompleted] = useState<number[]>([]);
  
  // Mock lesson sections
  const sections = [
    {
      title: "Introduction",
      content: `Welcome to ${lesson.title}. This lesson will guide you through essential concepts and practices for your inner journey.`,
      duration: Math.floor(lesson.duration * 0.2)
    },
    {
      title: "Core Concepts",
      content: "Here you'll learn the fundamental principles. Take your time to absorb these ideas - they form the foundation of your practice.",
      duration: Math.floor(lesson.duration * 0.4)
    },
    {
      title: "Practice Exercise",
      content: "Now let's put these concepts into practice. Find a quiet space and follow along with this guided exercise.",
      duration: Math.floor(lesson.duration * 0.3)
    },
    {
      title: "Reflection",
      content: "Take a moment to reflect on what you've learned. How does this apply to your daily life?",
      duration: Math.floor(lesson.duration * 0.1)
    }
  ];

  const markSectionComplete = () => {
    if (!sectionsCompleted.includes(currentSection)) {
      setSectionsCompleted([...sectionsCompleted, currentSection]);
    }
  };

  const handleNext = () => {
    markSectionComplete();
    if (currentSection < sections.length - 1) {
      setCurrentSection(currentSection + 1);
    }
  };

  const handlePrevious = () => {
    if (currentSection > 0) {
      setCurrentSection(currentSection - 1);
    }
  };

  const handleComplete = () => {
    markSectionComplete();
    onComplete();
  };

  const progress = ((sectionsCompleted.length / sections.length) * 100);
  const isLastSection = currentSection === sections.length - 1;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-4xl bg-gradient-to-br from-purple-950 via-indigo-950 to-purple-950 rounded-2xl shadow-2xl border border-purple-500/20">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-purple-500/20">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-600/20 rounded-xl">
              <BookOpen className="w-6 h-6 text-purple-400" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">{lesson.title}</h2>
              <div className="flex items-center gap-4 mt-1">
                <span className="flex items-center gap-1 text-purple-300 text-sm">
                  <Clock className="w-4 h-4" />
                  {lesson.duration} minutes
                </span>
                <span className="text-purple-400 text-sm">
                  Section {currentSection + 1} of {sections.length}
                </span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-purple-500/20 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-purple-300" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="px-6 pt-4">
          <div className="flex justify-between text-xs mb-2">
            <span className="text-purple-300">Progress</span>
            <span className="text-purple-300">{Math.round(progress)}% Complete</span>
          </div>
          <div className="h-2 bg-purple-900/30 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Section Tabs */}
          <div className="flex gap-2 mb-6">
            {sections.map((section, index) => (
              <button
                key={index}
                onClick={() => setCurrentSection(index)}
                className={`
                  flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all
                  ${currentSection === index 
                    ? 'bg-purple-600/30 text-white border border-purple-500/30' 
                    : sectionsCompleted.includes(index)
                    ? 'bg-green-900/20 text-green-300 border border-green-500/20'
                    : 'bg-purple-900/20 text-purple-400 hover:bg-purple-900/30'
                  }
                `}
              >
                {sectionsCompleted.includes(index) && (
                  <CheckCircle className="inline w-4 h-4 mr-1" />
                )}
                {section.title}
              </button>
            ))}
          </div>

          {/* Section Content */}
          <div className="bg-purple-900/20 rounded-xl p-6 min-h-[300px]">
            <h3 className="text-xl font-bold text-white mb-4">
              {sections[currentSection].title}
            </h3>
            <p className="text-purple-100 leading-relaxed mb-4">
              {sections[currentSection].content}
            </p>
            
            {/* Objectives (if first section) */}
            {currentSection === 0 && lesson.objectives && (
              <div className="mt-6">
                <h4 className="text-lg font-semibold text-purple-200 mb-3">
                  Learning Objectives:
                </h4>
                <ul className="space-y-2">
                  {lesson.objectives.map((objective, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-purple-400 rounded-full mt-2" />
                      <span className="text-purple-200">{objective}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Mock interactive element */}
            {currentSection === 2 && (
              <div className="mt-6 p-4 bg-indigo-900/30 rounded-lg border border-indigo-500/20">
                <p className="text-indigo-300 text-sm mb-3">Practice Exercise:</p>
                <p className="text-white">
                  Take 5 deep breaths, focusing on the sensation of air entering and leaving your body.
                </p>
                <button className="mt-4 px-4 py-2 bg-indigo-600/30 hover:bg-indigo-600/40 text-indigo-200 rounded-lg transition-colors">
                  Start Timer
                </button>
              </div>
            )}
          </div>

          {/* Estimated time for section */}
          <p className="text-center text-purple-400 text-sm mt-4">
            Estimated time: {sections[currentSection].duration} minutes
          </p>
        </div>

        {/* Footer Navigation */}
        <div className="flex items-center justify-between p-6 border-t border-purple-500/20">
          <button
            onClick={handlePrevious}
            disabled={currentSection === 0}
            className={`
              flex items-center gap-2 px-4 py-2 rounded-lg transition-all
              ${currentSection === 0
                ? 'bg-gray-800/30 text-gray-500 cursor-not-allowed'
                : 'bg-purple-600/30 hover:bg-purple-600/40 text-purple-200'
              }
            `}
          >
            <ArrowLeft className="w-4 h-4" />
            Previous
          </button>

          <div className="flex gap-2">
            {sections.map((_, index) => (
              <div
                key={index}
                className={`
                  w-2 h-2 rounded-full transition-all
                  ${currentSection === index
                    ? 'w-8 bg-purple-400'
                    : sectionsCompleted.includes(index)
                    ? 'bg-green-400'
                    : 'bg-purple-700'
                  }
                `}
              />
            ))}
          </div>

          {isLastSection ? (
            <button
              onClick={handleComplete}
              className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg transition-all"
            >
              Complete Lesson
              <CheckCircle className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="flex items-center gap-2 px-4 py-2 bg-purple-600/30 hover:bg-purple-600/40 text-purple-200 rounded-lg transition-all"
            >
              Next
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default SimpleLessonViewer;