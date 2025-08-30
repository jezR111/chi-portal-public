// src/components/way-of-the-self/CoreLearningLoop.tsx
'use client';

import {
  BookOpen,
  Brain,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Clock,
  Headphones,
  Lightbulb,
  MessageSquare,
  Pause,
  PenTool,
  Play,
  RotateCcw,
  SkipForward,
  Star,
  Target,
  Video,
  Volume2,
  VolumeX
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

// Learning modes
const LEARNING_MODES = {
  read: { icon: BookOpen, label: 'Read', color: 'blue' },
  listen: { icon: Headphones, label: 'Listen', color: 'purple' },
  watch: { icon: Video, label: 'Watch', color: 'pink' }
};

// Knowledge check question types
const QUESTION_TYPES = {
  reflection: { icon: Brain, label: 'Reflection' },
  application: { icon: Target, label: 'Application' },
  scenario: { icon: MessageSquare, label: 'Scenario' }
};

interface Lesson {
  id?: string;
  title?: string;
}

interface CompletionData {
  lessonId?: string;
  timeSpent: number;
  engagementScore: number;
  ahaMonments: AhaMoment[];
  fieldNotes: string;
  questAccepted: boolean;
  mode: string;
}

interface AhaMoment {
  id: number;
  section: number;
  timestamp: number;
  content: string;
}

interface CoreLearningLoopProps {
  lesson?: Lesson;
  onComplete?: (data: CompletionData) => void;
  onProgress?: (progress: number) => void;
  userPreferences?: {
    mode: string;
    speed: number;
  };
}

export default function CoreLearningLoop({
  lesson,
  onComplete,
  onProgress,
  userPreferences = { mode: 'read', speed: 1 }
}: CoreLearningLoopProps) {
  const [currentMode, setCurrentMode] = useState(userPreferences.mode);
  const [currentSection, setCurrentSection] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [playbackSpeed, setPlaybackSpeed] = useState(userPreferences.speed);
  const [showFieldNotes, setShowFieldNotes] = useState(false);
  const [ahaMonments, setAhaMoments] = useState<AhaMoment[]>([]);
  const [fieldNotes, setFieldNotes] = useState('');
  const [currentNote, setCurrentNote] = useState('');
  const [showKnowledgeCheck, setShowKnowledgeCheck] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<any>(null);
  const [questComplete, setQuestComplete] = useState(false);
  const [timeSpent, setTimeSpent] = useState(0);
  const [engagementScore, setEngagementScore] = useState(0);
  
  const audioRef = useRef<HTMLAudioElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const startTimeRef = useRef(Date.now());

  // Sample lesson content structure
  const lessonContent = {
    title: lesson?.title || "Understanding Your Inner Landscape",
    sections: [
      {
        id: 1,
        title: "Opening Reflection",
        content: `Before we begin, take a moment to notice where you are right now. 
        Not just physically, but emotionally and mentally. What brought you to this moment? 
        What are you hoping to discover?`,
        audioUrl: null, // Would be actual audio URL
        videoUrl: null, // Would be actual video URL
        duration: "3 min"
      },
      {
        id: 2,
        title: "Core Concept",
        content: `The Self is not a fixed entity but a dynamic, evolving consciousness. 
        It encompasses your thoughts, emotions, body sensations, and the witness that observes 
        all of these. Understanding this multiplicity is the first step toward integration.`,
        duration: "5 min"
      },
      {
        id: 3,
        title: "Practical Application",
        content: `Try this: Close your eyes and identify three aspects of yourself - 
        the thinker (mental self), the feeler (emotional self), and the observer (witness self). 
        Notice how they can exist simultaneously yet distinctly.`,
        duration: "4 min"
      }
    ],
    knowledgeCheck: {
      question: "Which scenario best represents healthy self-awareness?",
      type: "scenario",
      options: [
        {
          id: 'a',
          text: "Constantly analyzing every thought and emotion",
          feedback: "Over-analysis can create distance from authentic experience."
        },
        {
          id: 'b',
          text: "Observing your patterns with curiosity and compassion",
          feedback: "Yes! This balanced approach allows growth without judgment.",
          correct: true
        },
        {
          id: 'c',
          text: "Avoiding difficult emotions entirely",
          feedback: "Avoidance prevents integration and healing."
        },
        {
          id: 'd',
          text: "Identifying completely with every feeling",
          feedback: "Over-identification can lead to being overwhelmed."
        }
      ]
    },
    quest: {
      title: "Daily Witness Practice",
      description: "For the next 3 days, spend 5 minutes each morning observing your thoughts without judgment. Note any patterns you discover.",
      duration: "3 days",
      reward: "Unlock: Advanced Self-Observation Techniques"
    }
  };

  // Track time spent
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeSpent(Math.floor((Date.now() - startTimeRef.current) / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Calculate engagement score
  useEffect(() => {
    const score = 
      (ahaMonments.length * 20) + 
      (fieldNotes.length > 0 ? 30 : 0) + 
      (showKnowledgeCheck ? 25 : 0) +
      (questComplete ? 25 : 0);
    setEngagementScore(Math.min(100, score));
  }, [ahaMonments, fieldNotes, showKnowledgeCheck, questComplete]);

  const handleAhaMoment = () => {
    const newMoment: AhaMoment = {
      id: Date.now(),
      section: currentSection,
      timestamp: timeSpent,
      content: lessonContent.sections[currentSection].title
    };
    setAhaMoments([...ahaMonments, newMoment]);
    
    // Visual feedback
    const button = document.getElementById('aha-button');
    button?.classList.add('animate-ping');
    setTimeout(() => button?.classList.remove('animate-ping'), 1000);
  };

  const handleFieldNote = () => {
    if (currentNote.trim()) {
      setFieldNotes(prev => prev + '\n\n' + `[${formatTime(timeSpent)}] ${currentNote}`);
      setCurrentNote('');
      setShowFieldNotes(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleModeSwitch = (mode: string) => {
    setCurrentMode(mode);
    setIsPlaying(false);
    
    // In real implementation, would load appropriate media
    if (mode === 'listen' && audioRef.current) {
      audioRef.current.play();
      setIsPlaying(true);
    } else if (mode === 'watch' && videoRef.current) {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleKnowledgeCheckAnswer = (option: any) => {
    setSelectedAnswer(option);
    
    if (option.correct) {
      setTimeout(() => {
        setShowKnowledgeCheck(false);
        setQuestComplete(true);
      }, 2000);
    }
  };

  const completeLesson = () => {
    const completionData: CompletionData = {
      lessonId: lesson?.id,
      timeSpent,
      engagementScore,
      ahaMonments,
      fieldNotes,
      questAccepted: questComplete,
      mode: currentMode
    };
    
    onComplete?.(completionData);
  };

  const section = lessonContent.sections[currentSection];
  const progress = ((currentSection + 1) / lessonContent.sections.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <div className="bg-black/30 backdrop-blur-xl border-b border-white/10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                <ChevronLeft className="w-5 h-5 text-white" />
              </button>
              <div>
                <h1 className="text-xl font-semibold text-white">{lessonContent.title}</h1>
                <p className="text-sm text-gray-400">Section {currentSection + 1} of {lessonContent.sections.length}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <Clock className="w-4 h-4" />
                <span>{formatTime(timeSpent)}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <div className="w-32 h-2 bg-white/20 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <span className="text-sm text-white font-medium">{Math.round(progress)}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mode Selector */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-center gap-2 mb-8">
          {Object.entries(LEARNING_MODES).map(([mode, config]) => {
            const Icon = config.icon;
            return (
              <button
                key={mode}
                onClick={() => handleModeSwitch(mode)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
                  currentMode === mode
                    ? `bg-${config.color}-500 text-white shadow-lg shadow-${config.color}-500/25`
                    : 'bg-white/10 text-gray-400 hover:bg-white/20'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="font-medium">{config.label}</span>
              </button>
            );
          })}
        </div>

        {/* Main Content Area */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 p-8">
            {/* Section Title */}
            <div className="mb-6">
              <h2 className="text-2xl font-semibold text-white mb-2">{section.title}</h2>
              <p className="text-sm text-gray-400">Estimated time: {section.duration}</p>
            </div>

            {/* Content Display */}
            {currentMode === 'read' && (
              <div className="prose prose-invert max-w-none">
                <p className="text-lg leading-relaxed text-gray-200 whitespace-pre-line">
                  {section.content}
                </p>
              </div>
            )}

            {currentMode === 'listen' && (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="relative mb-8">
                  <div className="w-32 h-32 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                    <Headphones className="w-16 h-16 text-white" />
                  </div>
                  {isPlaying && (
                    <div className="absolute inset-0 rounded-full border-4 border-purple-400 animate-ping" />
                  )}
                </div>
                
                <div className="flex items-center gap-4 mb-4">
                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
                  >
                    {isPlaying ? <Pause className="w-6 h-6 text-white" /> : <Play className="w-6 h-6 text-white" />}
                  </button>
                  
                  <button className="p-2 hover:bg-white/10 rounded-full transition-colors">
                    <RotateCcw className="w-5 h-5 text-gray-400" />
                  </button>
                  
                  <button className="p-2 hover:bg-white/10 rounded-full transition-colors">
                    <SkipForward className="w-5 h-5 text-gray-400" />
                  </button>
                  
                  <button
                    onClick={() => setVolume(volume > 0 ? 0 : 0.8)}
                    className="p-2 hover:bg-white/10 rounded-full transition-colors"
                  >
                    {volume > 0 ? <Volume2 className="w-5 h-5 text-gray-400" /> : <VolumeX className="w-5 h-5 text-gray-400" />}
                  </button>
                </div>
                
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <span>Speed:</span>
                  {[0.75, 1, 1.25, 1.5, 2].map(speed => (
                    <button
                      key={speed}
                      onClick={() => setPlaybackSpeed(speed)}
                      className={`px-2 py-1 rounded ${
                        playbackSpeed === speed ? 'bg-purple-500 text-white' : 'hover:bg-white/10'
                      }`}
                    >
                      {speed}x
                    </button>
                  ))}
                </div>
              </div>
            )}

            {currentMode === 'watch' && (
              <div className="relative aspect-video bg-black rounded-xl overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <Video className="w-16 h-16 text-gray-600" />
                </div>
                {/* Video player would go here */}
              </div>
            )}

            {/* Interactive Tools */}
            <div className="flex items-center justify-between mt-8 pt-8 border-t border-white/10">
              <div className="flex items-center gap-2">
                <button
                  id="aha-button"
                  onClick={handleAhaMoment}
                  className="group flex items-center gap-2 px-4 py-2 bg-yellow-500/20 hover:bg-yellow-500/30 rounded-xl transition-all"
                >
                  <Lightbulb className="w-5 h-5 text-yellow-400 group-hover:scale-110 transition-transform" />
                  <span className="text-yellow-400 font-medium">Aha! Moment</span>
                  {ahaMonments.length > 0 && (
                    <span className="ml-1 px-2 py-0.5 bg-yellow-500 text-black text-xs rounded-full font-bold">
                      {ahaMonments.length}
                    </span>
                  )}
                </button>
                
                <button
                  onClick={() => setShowFieldNotes(!showFieldNotes)}
                  className="group flex items-center gap-2 px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 rounded-xl transition-all"
                >
                  <PenTool className="w-5 h-5 text-blue-400 group-hover:scale-110 transition-transform" />
                  <span className="text-blue-400 font-medium">Field Notes</span>
                </button>
              </div>

              <div className="flex items-center gap-2">
                {currentSection > 0 && (
                  <button
                    onClick={() => setCurrentSection(currentSection - 1)}
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5 text-gray-400" />
                  </button>
                )}
                
                {currentSection < lessonContent.sections.length - 1 ? (
                  <button
                    onClick={() => setCurrentSection(currentSection + 1)}
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl font-medium hover:shadow-lg hover:shadow-purple-500/25 transition-all"
                  >
                    Next Section
                    <ChevronRight className="w-5 h-5" />
                  </button>
                ) : !showKnowledgeCheck ? (
                  <button
                    onClick={() => setShowKnowledgeCheck(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl font-medium hover:shadow-lg hover:shadow-green-500/25 transition-all"
                  >
                    Knowledge Check
                    <Brain className="w-5 h-5" />
                  </button>
                ) : null}
              </div>
            </div>
          </div>

          {/* Field Notes Panel */}
          {showFieldNotes && (
            <div className="mt-4 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <PenTool className="w-5 h-5" />
                Your Field Notes
              </h3>
              
              <textarea
                value={currentNote}
                onChange={(e) => setCurrentNote(e.target.value)}
                placeholder="Capture your thoughts, insights, and reflections..."
                className="w-full h-32 bg-white/5 rounded-xl p-4 text-white placeholder-gray-500 outline-none focus:bg-white/10 transition-colors resize-none"
              />
              
              <div className="flex justify-between items-center mt-4">
                <p className="text-sm text-gray-400">
                  {fieldNotes.split('\n').filter(n => n).length} notes captured
                </p>
                <button
                  onClick={handleFieldNote}
                  className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg font-medium transition-colors"
                >
                  Save Note
                </button>
              </div>
              
              {fieldNotes && (
                <div className="mt-4 pt-4 border-t border-white/10">
                  <pre className="text-sm text-gray-300 whitespace-pre-wrap">{fieldNotes}</pre>
                </div>
              )}
            </div>
          )}

          {/* Knowledge Check */}
          {showKnowledgeCheck && (
            <div className="mt-8 bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-purple-500/20 rounded-xl">
                  <Brain className="w-6 h-6 text-purple-400" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white">Knowledge Check</h3>
                  <p className="text-sm text-gray-400">Reflection & Integration</p>
                </div>
              </div>

              <p className="text-lg text-white mb-6">{lessonContent.knowledgeCheck.question}</p>

              <div className="space-y-3">
                {lessonContent.knowledgeCheck.options.map(option => (
                  <button
                    key={option.id}
                    onClick={() => handleKnowledgeCheckAnswer(option)}
                    disabled={selectedAnswer !== null}
                    className={`w-full text-left p-4 rounded-xl transition-all ${
                      selectedAnswer?.id === option.id
                        ? option.correct
                          ? 'bg-green-500/20 border-2 border-green-500'
                          : 'bg-red-500/20 border-2 border-red-500'
                        : 'bg-white/5 hover:bg-white/10 border-2 border-transparent'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-gray-400 font-medium">{option.id.toUpperCase()}.</span>
                      <div className="flex-1">
                        <p className="text-white">{option.text}</p>
                        {selectedAnswer?.id === option.id && (
                          <p className="text-sm text-gray-400 mt-2">{option.feedback}</p>
                        )}
                      </div>
                      {selectedAnswer?.id === option.id && (
                        <div>
                          {option.correct ? (
                            <CheckCircle className="w-5 h-5 text-green-400" />
                          ) : (
                            <span className="text-red-400">✗</span>
                          )}
                        </div>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quest Unlock */}
          {questComplete && (
            <div className="mt-8 bg-gradient-to-br from-amber-500/20 to-orange-500/20 backdrop-blur-xl rounded-3xl border border-amber-500/30 p-8">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-amber-500/20 rounded-xl">
                  <Target className="w-8 h-8 text-amber-400" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-white mb-2">
                    🎯 Quest Unlocked: {lessonContent.quest.title}
                  </h3>
                  <p className="text-gray-300 mb-4">{lessonContent.quest.description}</p>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-400">Duration: {lessonContent.quest.duration}</span>
                    <span className="text-sm text-amber-400">Reward: {lessonContent.quest.reward}</span>
                  </div>
                  <button
                    onClick={completeLesson}
                    className="mt-4 px-6 py-2 bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl font-medium hover:shadow-lg hover:shadow-amber-500/25 transition-all"
                  >
                    Accept Quest & Complete Lesson
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Engagement Score */}
          <div className="mt-8 text-center">
            <div className="inline-flex items-center gap-2 bg-white/5 rounded-full px-4 py-2">
              <Star className="w-5 h-5 text-yellow-400" />
              <span className="text-sm text-gray-400">Engagement Score:</span>
              <span className="text-white font-semibold">{engagementScore}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
