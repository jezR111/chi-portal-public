// src/components/way-of-the-self/HermitGuide.tsx
'use client';

import {
  Brain,
  Maximize2,
  Minimize2,
  PenTool,
  Quote,
  Send,
  Sparkles,
  Sunrise,
  X
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

// Types
interface UserData {
  overallProgress?: number;
  completedLessons?: number;
  [key: string]: any;
}

interface Message {
  id: number;
  type: 'hermit' | 'user';
  content: string;
  timestamp: Date;
  isQuote?: boolean;
  followUp?: FollowUp;
}

interface FollowUp {
  type: 'meditation' | 'journal';
  data?: MeditationData;
  prompt?: string;
}

interface MeditationData {
  title: string;
  duration: string;
  description: string;
}

interface WisdomQuote {
  text: string;
  author: string;
  context: string;
}

interface HermitGuideProps {
  userData?: UserData;
  currentChapter?: string | null;
  isMinimized?: boolean;
  onToggleMinimize?: (minimized: boolean) => void;
}

// Socratic questions based on user's journey stage
const SOCRATIC_PROMPTS: Record<string, string[]> = {
  beginning: [
    "What brought you to this moment of seeking growth?",
    "When you imagine your ideal self, what qualities emerge?",
    "What patterns in your life are you ready to transform?"
  ],
  exploring: [
    "What did you notice about yourself today that surprised you?",
    "How did your body feel when you encountered that resistance?",
    "What would change if you fully believed you were worthy?"
  ],
  deepening: [
    "Where in your life are you not being completely honest with yourself?",
    "What wisdom is your discomfort trying to teach you?",
    "How might your shadow be serving you right now?"
  ],
  integrating: [
    "How has your relationship with yourself shifted?",
    "What practices feel most aligned with your authentic self?",
    "Where do you notice the most profound changes manifesting?"
  ]
};

// Contextual wisdom quotes
const WISDOM_QUOTES: WisdomQuote[] = [
  {
    text: "The cave you fear to enter holds the treasure you seek.",
    author: "Joseph Campbell",
    context: "shadow-work"
  },
  {
    text: "Your task is not to seek for love, but merely to seek and find all the barriers within yourself that you have built against it.",
    author: "Rumi",
    context: "self-worth"
  },
  {
    text: "The curious paradox is that when I accept myself just as I am, then I can change.",
    author: "Carl Rogers",
    context: "self-acceptance"
  }
];

// Meditation suggestions based on mood/need
const MEDITATION_LIBRARY: Record<string, MeditationData> = {
  anxious: {
    title: "Finding Your Center",
    duration: "10 min",
    description: "A grounding practice for when the mind feels scattered"
  },
  overwhelmed: {
    title: "The Mountain Meditation",
    duration: "15 min",
    description: "Cultivate stability amidst life's storms"
  },
  disconnected: {
    title: "Heart Opening Practice",
    duration: "12 min",
    description: "Reconnect with your inner warmth and compassion"
  },
  stuck: {
    title: "Flow State Activation",
    duration: "8 min",
    description: "Release resistance and invite movement"
  }
};

export default function HermitGuide({ 
  userData = {},
  currentChapter = null,
  isMinimized = false,
  onToggleMinimize
}: HermitGuideProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [currentPrompt, setCurrentPrompt] = useState<string | null>(null);
  const [showQuickActions, setShowQuickActions] = useState(true);
  const [journalPrompt, setJournalPrompt] = useState<string | null>(null);
  const [suggestedMeditation, setSuggestedMeditation] = useState<MeditationData | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize with welcome message
  useEffect(() => {
    if (messages.length === 0) {
      const welcomeMessage: Message = {
        id: 1,
        type: 'hermit',
        content: "Welcome, seeker. I am here to illuminate your path, not to give you answers, but to help you discover the wisdom that already resides within you.",
        timestamp: new Date()
      };
      setMessages([welcomeMessage]);
    }
  }, [messages.length]);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Generate contextual prompt based on user progress
  useEffect(() => {
    const stage = getUserStage(userData);
    const prompts = SOCRATIC_PROMPTS[stage];
    if (prompts) {
      setCurrentPrompt(prompts[Math.floor(Math.random() * prompts.length)]);
    }
  }, [userData]);

  const getUserStage = (data: UserData): string => {
    const progress = data.overallProgress || 0;
    if (progress < 25) return 'beginning';
    if (progress < 50) return 'exploring';
    if (progress < 75) return 'deepening';
    return 'integrating';
  };

  const handleSend = () => {
    if (!inputValue.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: messages.length + 1,
      type: 'user',
      content: inputValue,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Analyze and respond
    setTimeout(() => {
      const response = generateResponse(inputValue, userData);
      setMessages(prev => [...prev, response]);
      setIsTyping(false);
    }, 1500);
  };

  const generateResponse = (input: string, data: UserData): Message => {
    const lowerInput = input.toLowerCase();
    let content = "";
    let followUp: FollowUp | undefined = undefined;

    // Check for emotional keywords
    if (lowerInput.includes('anxious') || lowerInput.includes('worried')) {
      content = "I sense tension in your words. Anxiety often arises when we're standing at the edge of growth. What is your anxiety protecting you from experiencing?";
      followUp = {
        type: 'meditation',
        data: MEDITATION_LIBRARY.anxious
      };
    } else if (lowerInput.includes('stuck') || lowerInput.includes('blocked')) {
      content = "Feeling stuck is often a sign that you're ready for a deeper truth to emerge. What would you need to release in order to move forward? Sometimes our stuckness is actually a cocoon, preparing us for transformation.";
      followUp = {
        type: 'journal',
        prompt: "What am I afraid will happen if I move forward?"
      };
    } else if (lowerInput.includes('progress') || lowerInput.includes('growing')) {
      content = `I see you've completed ${data.completedLessons || 0} lessons on your journey. But remember, true growth isn't measured in checkboxes. How do you feel you've changed since beginning this path?`;
    } else if (lowerInput.includes('help') || lowerInput.includes('guide')) {
      content = "I'm here not to give you answers, but to help you ask better questions. What is it that you truly seek to understand about yourself?";
    } else {
      // Default Socratic response
      content = "Interesting. And what does that reveal to you about yourself?";
    }

    return {
      id: messages.length + 2,
      type: 'hermit',
      content,
      followUp,
      timestamp: new Date()
    };
  };

  const handleQuickAction = (action: string) => {
    switch(action) {
      case 'reflection':
        setMessages(prev => [...prev, {
          id: prev.length + 1,
          type: 'hermit',
          content: currentPrompt || SOCRATIC_PROMPTS.beginning[0],
          timestamp: new Date()
        }]);
        break;
      case 'wisdom':
        const quote = WISDOM_QUOTES[Math.floor(Math.random() * WISDOM_QUOTES.length)];
        setMessages(prev => [...prev, {
          id: prev.length + 1,
          type: 'hermit',
          content: `"${quote.text}" - ${quote.author}\n\nHow does this wisdom resonate with your current experience?`,
          isQuote: true,
          timestamp: new Date()
        }]);
        break;
      case 'meditation':
        const meditationKeys = Object.keys(MEDITATION_LIBRARY);
        const randomKey = meditationKeys[Math.floor(Math.random() * meditationKeys.length)];
        const meditation = MEDITATION_LIBRARY[randomKey];
        setSuggestedMeditation(meditation);
        setMessages(prev => [...prev, {
          id: prev.length + 1,
          type: 'hermit',
          content: `I sense you could benefit from the "${meditation.title}" practice. ${meditation.description}. Would you like to begin?`,
          followUp: { type: 'meditation', data: meditation },
          timestamp: new Date()
        }]);
        break;
      case 'journal':
        const prompt = "What truth about yourself have you been avoiding?";
        setJournalPrompt(prompt);
        setMessages(prev => [...prev, {
          id: prev.length + 1,
          type: 'hermit',
          content: `Here's something to explore in your journal: "${prompt}"`,
          followUp: { type: 'journal', prompt },
          timestamp: new Date()
        }]);
        break;
    }
    setShowQuickActions(false);
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 p-4 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-full shadow-2xl hover:shadow-purple-500/25 transition-all hover:scale-110 z-50 group"
      >
        <div className="relative">
          <div className="absolute inset-0 bg-purple-400 rounded-full blur-xl opacity-50 group-hover:opacity-75 animate-pulse" />
          <div className="relative flex items-center justify-center">
            <span className="absolute text-4xl animate-float">🕯️</span>
            <Sparkles className="w-6 h-6 text-white opacity-0" />
          </div>
        </div>
      </button>
    );
  }

  return (
    <>
      <div className={`fixed ${isMinimized ? 'bottom-6 right-6' : 'bottom-0 right-0 md:bottom-6 md:right-6'} 
        ${isMinimized ? 'w-72' : 'w-full md:w-96'} 
        ${isMinimized ? 'h-16' : 'h-full md:h-[600px]'} 
        bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-900 
        ${isMinimized ? 'rounded-2xl' : 'md:rounded-2xl'} 
        shadow-2xl border border-white/20 z-50 transition-all duration-300`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="relative">
              <span className="text-2xl">🕯️</span>
              <Sparkles className="absolute -top-1 -right-1 w-3 h-3 text-yellow-400 animate-pulse" />
            </div>
            <div>
              <h3 className="font-semibold text-white">The Hermit</h3>
              <p className="text-xs text-gray-400">Your Inner Guide</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => onToggleMinimize?.(!isMinimized)}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              {isMinimized ? <Maximize2 className="w-4 h-4 text-gray-400" /> : <Minimize2 className="w-4 h-4 text-gray-400" />}
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
            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4" style={{ height: 'calc(100% - 140px)' }}>
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[80%] ${message.type === 'user' ? 'order-2' : 'order-1'}`}>
                    {message.type === 'hermit' && (
                      <div className="flex items-start gap-2 mb-2">
                        <span className="text-xl">🕯️</span>
                      </div>
                    )}
                    
                    <div className={`rounded-2xl px-4 py-3 ${
                      message.type === 'user' 
                        ? 'bg-purple-600 text-white' 
                        : message.isQuote
                        ? 'bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-500/30'
                        : 'bg-white/10 text-white'
                    }`}>
                      <p className="text-sm leading-relaxed whitespace-pre-line">{message.content}</p>
                    </div>
                    
                    {message.followUp && (
                      <div className="mt-2">
                        {message.followUp.type === 'meditation' && message.followUp.data && (
                          <button className="flex items-center gap-2 bg-purple-500/20 hover:bg-purple-500/30 px-3 py-2 rounded-lg transition-colors text-sm">
                            <Sunrise className="w-4 h-4 text-purple-400" />
                            <span className="text-purple-300">Begin {message.followUp.data.duration} meditation</span>
                          </button>
                        )}
                        {message.followUp.type === 'journal' && (
                          <button className="flex items-center gap-2 bg-blue-500/20 hover:bg-blue-500/30 px-3 py-2 rounded-lg transition-colors text-sm">
                            <PenTool className="w-4 h-4 text-blue-400" />
                            <span className="text-blue-300">Open journal</span>
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="flex items-start gap-2">
                  <span className="text-xl">🕯️</span>
                  <div className="bg-white/10 rounded-2xl px-4 py-3">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 bg-white/50 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-2 h-2 bg-white/50 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-2 h-2 bg-white/50 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Actions */}
            {showQuickActions && messages.length <= 2 && (
              <div className="px-4 pb-2">
                <p className="text-xs text-gray-400 mb-2">Quick Guidance:</p>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handleQuickAction('reflection')}
                    className="flex items-center gap-2 bg-white/5 hover:bg-white/10 p-2 rounded-lg transition-colors text-xs"
                  >
                    <Brain className="w-4 h-4 text-purple-400" />
                    <span className="text-gray-300">Reflection</span>
                  </button>
                  <button
                    onClick={() => handleQuickAction('wisdom')}
                    className="flex items-center gap-2 bg-white/5 hover:bg-white/10 p-2 rounded-lg transition-colors text-xs"
                  >
                    <Quote className="w-4 h-4 text-amber-400" />
                    <span className="text-gray-300">Wisdom</span>
                  </button>
                  <button
                    onClick={() => handleQuickAction('meditation')}
                    className="flex items-center gap-2 bg-white/5 hover:bg-white/10 p-2 rounded-lg transition-colors text-xs"
                  >
                    <Sunrise className="w-4 h-4 text-blue-400" />
                    <span className="text-gray-300">Meditate</span>
                  </button>
                  <button
                    onClick={() => handleQuickAction('journal')}
                    className="flex items-center gap-2 bg-white/5 hover:bg-white/10 p-2 rounded-lg transition-colors text-xs"
                  >
                    <PenTool className="w-4 h-4 text-green-400" />
                    <span className="text-gray-300">Journal</span>
                  </button>
                </div>
              </div>
            )}

            {/* Input Area */}
            <div className="border-t border-white/10 p-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Share what's on your heart..."
                  className="flex-1 bg-white/5 rounded-xl px-4 py-2 text-sm outline-none focus:bg-white/10 transition-colors text-white placeholder-gray-400"
                />
                <button
                  onClick={handleSend}
                  className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl hover:shadow-lg hover:shadow-purple-500/25 transition-all"
                >
                  <Send className="w-4 h-4 text-white" />
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-3px); }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </>
  );
}
