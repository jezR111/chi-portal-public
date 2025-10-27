// src/features/yin/components/apps/hermit/EnhancedHermitGuide.tsx
'use client';

import { useAuth } from '@/components/providers/AuthProvider';
import { aiService } from '@/features/yin/services/aiService';
import { progressService } from '@/features/yin/services/progressService';
import {
  Brain,
  Compass,
  Heart,
  Maximize2,
  Minimize2,
  Send,
  Sparkles,
  X
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  metadata?: {
    type?: 'question' | 'insight' | 'guidance' | 'path';
    suggestedActions?: Array<{
      label: string;
      action: () => void;
    }>;
  };
}

interface HermitGuideProps {
  currentChapter?: string;
  currentLesson?: string;
  onNavigateToLesson?: (lessonId: string) => void;
  onOpenInsightCapture?: () => void;
}

export default function EnhancedHermitGuide({
  currentChapter,
  currentLesson,
  onNavigateToLesson,
  onOpenInsightCapture
}: HermitGuideProps) {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPathfinder, setShowPathfinder] = useState(false);
  const [userContext, setUserContext] = useState<any>(null);
  const [isConnected, setIsConnected] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load user context on mount
    loadUserContext();
    
    // Test AI connection
    aiService.testConnection().then(connected => {
      setIsConnected(connected);
      if (!connected) {
        console.error('AI not connected - check console for details');
      }
    });
  }, [user]);

  useEffect(() => {
    // Scroll to bottom on new messages
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const loadUserContext = async () => {
    if (!user?.id) return;
    
    try {
      const progress = await progressService.getUserProgress(user.id);
      setUserContext({
        currentChapter,
        currentLesson,
        completedLessons: progress?.chapterProgress || [],
        userProgress: progress,
        recentInsights: []
      });

      // If new user, show pathfinder
      if (!progress || progress.totalXP === 0) {
        setShowPathfinder(true);
      }
    } catch (error) {
      console.error('Failed to load user context:', error);
    }
  };

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await aiService.getGuidance(input, userContext);
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date(),
        metadata: {
          type: 'guidance'
        }
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Failed to get AI response:', error);
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "I'm having trouble connecting right now. Let me offer you a reflection: What brings you here in this moment?",
        timestamp: new Date()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const startPersonalizedPath = async () => {
    setIsLoading(true);
    try {
      const path = await aiService.getPersonalizedPath(userContext || {});
      
      const pathMessage: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: `I've prepared a personalized path for you:\n\n**Focus Areas:**\n${path.focusAreas.map(area => `• ${area}`).join('\n')}\n\n**Suggested Lessons:**\n${path.suggestedLessons.map(lesson => `• ${lesson}`).join('\n')}`,
        timestamp: new Date(),
        metadata: {
          type: 'path',
          suggestedActions: path.suggestedLessons.map(lesson => ({
            label: `Start: ${lesson}`,
            action: () => onNavigateToLesson?.(lesson)
          }))
        }
      };

      setMessages([pathMessage]);
      setShowPathfinder(false);
    } catch (error) {
      console.error('Failed to generate path:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const quickActions = [
    {
      icon: Compass,
      label: "Find My Path",
      color: "from-blue-500 to-indigo-500",
      action: startPersonalizedPath
    },
    {
      icon: Brain,
      label: "Deep Question",
      color: "from-purple-500 to-pink-500",
      action: async () => {
        const question = "What shadow aspect should I explore today?";
        setInput(question);
        await handleSendMessage();
      }
    },
    {
      icon: Heart,
      label: "Capture Insight",
      color: "from-rose-500 to-pink-500",
      action: () => onOpenInsightCapture?.()
    }
  ];

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 group"
      >
        <div className="relative">
          <div className="absolute inset-0 bg-purple-600 rounded-full blur-xl opacity-50 group-hover:opacity-75 animate-pulse" />
          <div className="relative flex items-center justify-center w-14 h-14 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-full shadow-2xl">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full animate-ping" />
        </div>
      </button>
    );
  }

  return (
    <div className={`fixed z-50 transition-all duration-300 ${
      isMinimized 
        ? 'bottom-6 right-6 w-80 h-16' 
        : 'bottom-0 right-0 md:bottom-6 md:right-6 w-full md:w-[420px] h-full md:h-[600px]'
    }`}>
      <div className="h-full bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 rounded-2xl shadow-2xl border border-purple-500/20 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-purple-500/20">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-full flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              {/* Connection indicator */}
              <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full ${
                isConnected ? 'bg-green-400' : 'bg-red-400'
              }`} title={isConnected ? 'AI Connected' : 'AI Not Connected - Check API Key'} />
            </div>
            <div>
              <h3 className="font-semibold text-white">The Hermit</h3>
              <p className="text-xs text-purple-300">
                {isConnected ? 'Your Inner Guide' : 'Offline Mode'}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsMinimized(!isMinimized)}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              {isMinimized ? 
                <Maximize2 className="w-4 h-4 text-gray-400" /> : 
                <Minimize2 className="w-4 h-4 text-gray-400" />
              }
            </button>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <X className="w-4 h-4 text-gray-400" />
            </button>
          </div>
        </div>

        {!isMinimized && (
          <>
            {/* Quick Actions */}
            {messages.length === 0 && (
              <div className="p-4 border-b border-purple-500/20">
                <div className="grid grid-cols-3 gap-2">
                  {quickActions.map((action, index) => (
                    <button
                      key={index}
                      onClick={action.action}
                      className="flex flex-col items-center gap-2 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-all"
                    >
                      <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${action.color} flex items-center justify-center`}>
                        <action.icon className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-xs text-gray-300">{action.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.length === 0 && !showPathfinder && (
                <div className="text-center py-8">
                  <p className="text-purple-300 mb-2">Welcome, seeker.</p>
                  <p className="text-sm text-gray-400">
                    {isConnected 
                      ? "How may I illuminate your path today?" 
                      : "AI connection pending. Using offline guidance."}
                  </p>
                </div>
              )}

              {showPathfinder && (
                <div className="bg-gradient-to-br from-purple-500/20 to-indigo-500/20 rounded-xl p-6 border border-purple-500/30">
                  <h4 className="text-white font-semibold mb-2">Begin Your Journey</h4>
                  <p className="text-sm text-purple-200 mb-4">
                    Let me create a personalized path based on your needs.
                  </p>
                  <button
                    onClick={startPersonalizedPath}
                    disabled={isLoading}
                    className="w-full py-2 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg text-white font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
                  >
                    {isLoading ? 'Creating Your Path...' : 'Discover My Path'}
                  </button>
                </div>
              )}

              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[85%] ${
                    message.role === 'user' 
                      ? 'bg-gradient-to-br from-purple-600 to-indigo-600' 
                      : 'bg-white/10'
                  } rounded-2xl p-4`}>
                    <p className="text-sm text-white whitespace-pre-wrap">
                      {message.content}
                    </p>
                    
                    {message.metadata?.suggestedActions && (
                      <div className="mt-3 space-y-2">
                        {message.metadata.suggestedActions.map((action, index) => (
                          <button
                            key={index}
                            onClick={action.action}
                            className="w-full text-left text-xs bg-white/10 hover:bg-white/20 rounded-lg p-2 transition-colors"
                          >
                            {action.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white/10 rounded-2xl p-4">
                    <div className="flex gap-2">
                      <span className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" />
                      <span className="w-2 h-2 bg-purple-400 rounded-full animate-pulse delay-75" />
                      <span className="w-2 h-2 bg-purple-400 rounded-full animate-pulse delay-150" />
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-purple-500/20">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Share your thoughts..."
                  className="flex-1 bg-white/5 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-400 focus:bg-white/10 focus:outline-none transition-colors"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={isLoading || !input.trim()}
                  className="p-3 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  <Send className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}