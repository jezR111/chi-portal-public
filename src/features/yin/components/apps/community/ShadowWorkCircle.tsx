// /features/yin/components/apps/community/ShadowWorkCircle.tsx
import { createClient } from '@/lib/db/supabase/client';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ChevronRight,
  EyeOff,
  Feather,
  Info,
  Lock,
  MessageCircle,
  Send,
  Shield,
  Sparkles,
  StickyNote,
  Target,
  Users,
  X
} from 'lucide-react';
import { useEffect, useState } from 'react';

// Types
interface ShadowPost {
  id: string;
  user_id: string;
  username: string;
  content: string;
  theme: string;
  is_anonymous: boolean;
  created_at: string;
  support_count: number;
  supported_by: string[];
  responses: any[];
  reflections?: Record<string, string>;
  support_notes?: SupportNote[];
  emoji_reactions?: Record<string, string[]>;
}

interface SupportNote {
  id: string;
  user_id: string;
  message: string;
  color: string;
  position: number;
}

// Theme Configuration
const shadowThemes = [
  { 
    id: 'self-worth', 
    label: 'Self Worth', 
    icon: Sparkles, 
    color: 'purple',
    bgGradient: 'from-purple-900/20 to-purple-800/20',
    borderColor: 'border-purple-500/30',
    gradient: 'from-purple-500 to-pink-500',
    description: 'Struggles with valuing yourself',
    examples: {
      impact_self: 'I feel undeserving, compare myself constantly, reject compliments',
      impact_others: 'I might push people away or seek constant validation',
      driving_force: 'Childhood experiences where I felt not good enough',
      future_projection: 'I might miss opportunities and stay in unhealthy situations',
      higher_self: 'I would recognize my inherent worth regardless of achievements'
    }
  },
  { 
    id: 'boundaries', 
    label: 'Boundaries', 
    icon: Shield, 
    color: 'blue',
    bgGradient: 'from-blue-900/20 to-cyan-900/20',
    borderColor: 'border-blue-500/30',
    gradient: 'from-blue-500 to-cyan-500',
    description: 'Setting and maintaining healthy limits',
    examples: {
      impact_self: 'I feel exhausted, resentful, taken advantage of',
      impact_others: 'They might not know where they stand with me',
      driving_force: 'Fear of rejection or conflict, need to be liked',
      future_projection: 'Burnout and damaged relationships',
      higher_self: 'Clear, kind boundaries that honor everyone\'s needs'
    }
  },
  { 
    id: 'abandonment', 
    label: 'Abandonment', 
    icon: Users, 
    color: 'indigo',
    bgGradient: 'from-indigo-900/20 to-purple-900/20',
    borderColor: 'border-indigo-500/30',
    gradient: 'from-indigo-500 to-purple-500',
    description: 'Fear of being left or rejected',
    examples: {
      impact_self: 'Anxiety in relationships, clinging or pushing away',
      impact_others: 'They might feel suffocated or confused',
      driving_force: 'Past experiences of being left, attachment wounds',
      future_projection: 'Self-fulfilling prophecy of relationship loss',
      higher_self: 'Trust in my worth and ability to handle change'
    }
  },
  { 
    id: 'perfectionism', 
    label: 'Perfectionism', 
    icon: Target, 
    color: 'amber',
    bgGradient: 'from-amber-900/20 to-orange-900/20',
    borderColor: 'border-amber-500/30',
    gradient: 'from-amber-500 to-orange-500',
    description: 'Never feeling good enough',
    examples: {
      impact_self: 'Paralysis, procrastination, chronic stress',
      impact_others: 'They might feel judged or inadequate around me',
      driving_force: 'Fear of criticism, need for control',
      future_projection: 'Missed opportunities and chronic dissatisfaction',
      higher_self: 'Embrace progress over perfection, self-compassion'
    }
  },
  { 
    id: 'control', 
    label: 'Control', 
    icon: Lock, 
    color: 'red',
    bgGradient: 'from-red-900/20 to-pink-900/20',
    borderColor: 'border-red-500/30',
    gradient: 'from-red-500 to-pink-500',
    description: 'Need to control outcomes or people',
    examples: {
      impact_self: 'Anxiety when things are uncertain, rigid thinking',
      impact_others: 'They might feel micromanaged or rebel',
      driving_force: 'Fear of chaos, past experiences of powerlessness',
      future_projection: 'Isolation and increased anxiety',
      higher_self: 'Trust in life\'s flow, focus on what I can influence'
    }
  }
];

const reflectionQuestions = [
  { 
    id: 'impact_self',
    question: 'How is this pattern showing up in your life?',
    hint: 'Describe specific ways this affects your daily experience'
  },
  { 
    id: 'impact_others',
    question: 'How might this be affecting your relationships?',
    hint: 'Consider how others might experience or respond to this pattern'
  },
  { 
    id: 'driving_force',
    question: 'What do you think created this pattern?',
    hint: 'Explore past experiences, fears, or needs that might be at the root'
  },
  { 
    id: 'future_projection',
    question: 'Where will this lead if nothing changes?',
    hint: 'Imagine the trajectory if this pattern continues'
  },
  { 
    id: 'higher_self',
    question: 'How would your higher self handle this?',
    hint: 'Step into your highest perspective - what would that version of you do?'
  }
];

const presetSupportMessages = [
  "You've got this",
  "We see you",
  "Proud of you",
  "Keep going",
  "You're loved",
  "Stay strong",
  "We're here",
  "You matter",
  "Sending love",
  "Beautiful soul"
];

const supportEmojis = ['❤️', '🙏', '🔥', '😥', '🙌', '🤗'];

const noteColors = [
  { name: 'yellow', gradient: 'from-yellow-200 to-amber-300' },
  { name: 'pink', gradient: 'from-pink-200 to-rose-300' },
  { name: 'blue', gradient: 'from-blue-200 to-sky-300' },
  { name: 'green', gradient: 'from-green-200 to-emerald-300' }
];

export default function ShadowWorkCircle({ profile }: { profile: any }) {
  // State Management
  const [posts, setPosts] = useState<ShadowPost[]>([]);
  const [showShareModal, setShowShareModal] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState<typeof shadowThemes[0] | null>(null);
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [reflections, setReflections] = useState<Record<string, string>>({});
  const [showExamples, setShowExamples] = useState(false);
  const [expandedPost, setExpandedPost] = useState<string | null>(null);
  const [witnessInput, setWitnessInput] = useState('');
  const [activeWitnessPost, setActiveWitnessPost] = useState<string | null>(null);
  const [showSupportModal, setShowSupportModal] = useState<string | null>(null);
  const [customSupportMessage, setCustomSupportMessage] = useState('');
  
  const supabase = createClient();

  // Data Loading & Subscriptions
  useEffect(() => {
    loadPosts();
    const subscription = subscribeToPosts();
    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  const loadPosts = async () => {
    const { data } = await supabase
      .from('community_messages')
      .select('*')
      .eq('room_id', 'shadow')
      .order('created_at', { ascending: false })
      .limit(20);

    if (data) {
      const shadowPosts = data.map(msg => ({
        ...msg,
        theme: msg.reactions?.theme || 'self-worth',
        is_anonymous: msg.reactions?.is_anonymous || false,
        support_count: msg.reactions?.support_count || 0,
        supported_by: msg.reactions?.supported_by || [],
        responses: msg.reactions?.responses || [],
        reflections: msg.reactions?.reflections || {},
        support_notes: msg.reactions?.support_notes || [],
        emoji_reactions: msg.reactions?.emoji_reactions || {},
        content: msg.message
      }));
      setPosts(shadowPosts as any);
    }
  };

  const subscribeToPosts = () => {
    return supabase
      .channel('shadow-circle')
      .on('postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'community_messages',
          filter: 'room_id=eq.shadow'
        },
        () => {
          loadPosts();
        }
      )
      .subscribe();
  };

  // Event Handlers
  const sharePost = async () => {
    if (!selectedTheme) return;
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const fullMessage = Object.entries(reflections)
      .map(([key, value]) => {
        const question = reflectionQuestions.find(q => q.id === key);
        return question ? `**${question.question}**\n${value}` : '';
      })
      .filter(Boolean)
      .join('\n\n');

    const metadata = {
      theme: selectedTheme.id,
      is_anonymous: isAnonymous,
      support_count: 0,
      supported_by: [],
      responses: [],
      reflections,
      support_notes: [],
      emoji_reactions: {}
    };

    const { error } = await supabase
      .from('community_messages')
      .insert({
        room_id: 'shadow',
        user_id: user.id,
        username: isAnonymous ? 'Anonymous Seeker' : profile.username,
        message: fullMessage,
        reactions: metadata
      });

    if (!error) {
      resetForm();
      loadPosts();
    }
  };

  const addSupportNote = async (postId: string, message: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data: post } = await supabase
      .from('community_messages')
      .select('reactions')
      .eq('id', postId)
      .single();

    if (post) {
      const existingNotes = post.reactions?.support_notes || [];
      const newNote: SupportNote = {
        id: Date.now().toString(),
        user_id: user.id,
        message,
        color: noteColors[Math.floor(Math.random() * noteColors.length)].name,
        position: existingNotes.length % 4
      };

      const updatedReactions = {
        ...post.reactions,
        support_notes: [...existingNotes, newNote].slice(-4)
      };

      await supabase
        .from('community_messages')
        .update({ reactions: updatedReactions })
        .eq('id', postId);
      
      setShowSupportModal(null);
      setCustomSupportMessage('');
      loadPosts();
    }
  };

  const addEmojiReaction = async (postId: string, emoji: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data: post } = await supabase
      .from('community_messages')
      .select('reactions')
      .eq('id', postId)
      .single();

    if (post) {
      const emojiReactions = post.reactions?.emoji_reactions || {};
      const users = emojiReactions[emoji] || [];
      
      const userIndex = users.indexOf(user.id);
      if (userIndex > -1) {
        users.splice(userIndex, 1);
      } else {
        users.push(user.id);
      }
      
      emojiReactions[emoji] = users;

      const updatedReactions = {
        ...post.reactions,
        emoji_reactions: emojiReactions
      };

      await supabase
        .from('community_messages')
        .update({ reactions: updatedReactions })
        .eq('id', postId);
      
      loadPosts();
    }
  };

  const addWitnessResponse = async (postId: string) => {
    if (!witnessInput.trim()) return;

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data: post } = await supabase
      .from('community_messages')
      .select('reactions')
      .eq('id', postId)
      .single();

    if (post) {
      const updatedReactions = {
        ...post.reactions,
        responses: [...(post.reactions?.responses || []), {
          user_id: user.id,
          username: profile?.username || 'Seeker',
          message: witnessInput,
          created_at: new Date().toISOString()
        }]
      };

      await supabase
        .from('community_messages')
        .update({ reactions: updatedReactions })
        .eq('id', postId);
      
      setWitnessInput('');
      setActiveWitnessPost(null);
      loadPosts();
    }
  };

  const resetForm = () => {
    setShowShareModal(false);
    setSelectedTheme(null);
    setCurrentStep(0);
    setReflections({});
    setIsAnonymous(false);
  };

  const currentQuestion = reflectionQuestions[currentStep];
  const canProgress = reflections[currentQuestion?.id]?.trim().length > 0;

  // Helper functions for positioning
  const getNoteStyle = (index: number) => {
    const positions = [
      { bottom: '10px', right: '10px', rotate: '12deg' },
      { bottom: '20px', right: '25px', rotate: '-8deg' },
      { bottom: '35px', right: '5px', rotate: '5deg' },
      { bottom: '15px', right: '40px', rotate: '-12deg' }
    ];
    
    const pos = positions[index % positions.length];
    return {
      bottom: pos.bottom,
      right: pos.right,
      transform: `rotate(${pos.rotate})`,
      zIndex: 10 + index
    };
  };

  const getEmojiPosition = (emoji: string, index: number) => {
    const positions = [
      { top: '10px', left: '10px' },
      { top: '10px', left: '50px' },
      { top: '50px', left: '10px' },
      { bottom: '60px', left: '10px' },
      { bottom: '60px', left: '50px' },
      { top: '50px', left: '50px' }
    ];
    
    const emojiIndex = supportEmojis.indexOf(emoji);
    const posIndex = (emojiIndex + index) % positions.length;
    return positions[posIndex];
  };

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-gray-900 via-indigo-900/10 to-gray-900">
      {/* Header */}
      <div className="p-4 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border-b border-indigo-500/30">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-lg">
            <Shield className="w-5 h-5 text-indigo-400" />
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-indigo-300 mb-1">
              Sacred Shadow Space
            </h3>
            <p className="text-xs text-indigo-300/70">
              Explore your patterns with guided reflection. We witness without judgment.
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowShareModal(true)}
            className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 
                     text-white rounded-lg hover:from-indigo-600 hover:to-purple-600 
                     transition-all flex items-center gap-2 text-sm font-medium shadow-lg"
          >
            <Feather className="w-4 h-4" />
            <span>Begin Exploration</span>
          </motion.button>
        </div>
      </div>

      {/* Shadow Posts Grid */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">

// /features/yin/components/apps/community/ShadowWorkCircle.tsx
// Card section with improved layout - replace the posts.map section in your component

{posts.map((post, index) => {
  const theme = shadowThemes.find(t => t.id === post.theme) || shadowThemes[0];
  const ThemeIcon = theme.icon;
  
  return (
    <motion.div
      key={post.id}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.05 }}
      className="relative"
    >
      {/* Main Card - Theme Colored with padding bottom for notes area */}
      <div className={`bg-gradient-to-br ${theme.bgGradient} backdrop-blur-sm 
                    ${theme.borderColor} border rounded-2xl p-5 pb-16
                    hover:shadow-xl transition-all relative overflow-visible`}>
        
        {/* Emoji Reactions - compact row in bottom corners */}
        <div className="absolute bottom-2 left-2 flex gap-1 z-20">
          {Object.entries(post.emoji_reactions || {})
            .slice(0, 3)
            .map(([emoji, users], i) => {
              if (!users || users.length === 0) return null;
              return (
                <motion.div
                  key={emoji}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ 
                    opacity: 1, 
                    scale: 1,
                    y: [0, -2, 0]
                  }}
                  transition={{
                    delay: i * 0.05,
                    y: {
                      duration: 2 + Math.random(),
                      repeat: Infinity,
                      ease: "easeInOut"
                    }
                  }}
                  className="flex items-center"
                >
                  <span className="text-xl">{emoji}</span>
                  {users.length > 1 && (
                    <span className="text-[10px] text-gray-300 ml-0.5">{users.length}</span>
                  )}
                </motion.div>
              );
          })}
        </div>
        <div className="absolute bottom-2 right-2 flex gap-1 z-20">
          {Object.entries(post.emoji_reactions || {})
            .slice(3, 6)
            .map(([emoji, users], i) => {
              if (!users || users.length === 0) return null;
              return (
                <motion.div
                  key={emoji}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ 
                    opacity: 1, 
                    scale: 1,
                    y: [0, -2, 0]
                  }}
                  transition={{
                    delay: i * 0.05,
                    y: {
                      duration: 2 + Math.random(),
                      repeat: Infinity,
                      ease: "easeInOut"
                    }
                  }}
                  className="flex items-center"
                >
                  <span className="text-xl">{emoji}</span>
                  {users.length > 1 && (
                    <span className="text-[10px] text-gray-300 ml-0.5">{users.length}</span>
                  )}
                </motion.div>
              );
          })}
        </div>

        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            {post.is_anonymous ? (
              <>
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-600 to-gray-700 
                              flex items-center justify-center">
                  <EyeOff className="w-5 h-5 text-gray-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-300">Anonymous</p>
                  <p className="text-xs text-gray-500">
                    {new Date(post.created_at).toLocaleDateString()}
                  </p>
                </div>
              </>
            ) : (
              <>
                <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${theme.gradient}
                              flex items-center justify-center text-white font-bold`}>
                  {post.username[0].toUpperCase()}
                </div>
                <div>
                  <p className="text-sm text-white">{post.username}</p>
                  <p className="text-xs text-gray-400">
                    {new Date(post.created_at).toLocaleDateString()}
                  </p>
                </div>
              </>
            )}
          </div>
          
          <div className={`px-3 py-1.5 bg-gradient-to-r ${theme.gradient} rounded-lg 
                        flex items-center gap-2 shadow-lg`}>
            <ThemeIcon className="w-4 h-4 text-white" />
            <span className="text-xs font-medium text-white">{theme.label}</span>
          </div>
        </div>

        {/* Content Preview */}
        <div 
          className="text-gray-200 mb-4 cursor-pointer"
          onClick={() => setExpandedPost(expandedPost === post.id ? null : post.id)}
        >
          <div className="space-y-2">
            {post.content.split('\n\n').slice(0, expandedPost === post.id ? undefined : 1).map((section, i) => {
              const lines = section.split('\n');
              const isQuestion = lines[0].startsWith('**') && lines[0].endsWith('**');
              
              if (isQuestion && lines.length > 1) {
                const question = lines[0].replace(/\*\*/g, '');
                const answer = lines.slice(1).join('\n');
                return (
                  <div key={i} className="space-y-1">
                    <p className="text-xs text-indigo-300 font-medium">{question}</p>
                    <p className="text-sm text-gray-200 leading-relaxed">
                      {answer.length > 100 && expandedPost !== post.id 
                        ? answer.substring(0, 100) + '...' 
                        : answer}
                    </p>
                  </div>
                );
              }
              return null;
            })}
          </div>
          
          {expandedPost !== post.id && post.content.length > 200 && (
            <p className="text-xs text-indigo-400 hover:text-indigo-300 mt-2">
              Read more →
            </p>
          )}
        </div>

        {/* Witness Responses */}
        {post.responses && post.responses.length > 0 && (
          <div className="mb-3 p-3 bg-gray-900/30 rounded-lg space-y-1.5 border border-gray-700/30">
            <p className="text-xs text-gray-400 font-medium">Witnessing:</p>
            {post.responses.slice(0, 2).map((response: any, i: number) => (
              <div key={i} className="text-sm">
                <span className="text-purple-400">{response.username}:</span>
                <span className="text-gray-300 ml-1">{response.message}</span>
              </div>
            ))}
            {post.responses.length > 2 && (
              <p className="text-xs text-gray-500">+{post.responses.length - 2} more</p>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-2 mb-3">
          <button
            onClick={() => setShowSupportModal(post.id)}
            className="flex-1 flex items-center justify-center gap-2 text-sm py-2 px-3
                     bg-pink-500/10 hover:bg-pink-500/20 border border-pink-500/30 
                     hover:border-pink-500/50 rounded-lg transition-all text-pink-300"
          >
            <StickyNote className="w-4 h-4" />
            <span>Support</span>
          </button>
          
          <button
            onClick={() => setActiveWitnessPost(activeWitnessPost === post.id ? null : post.id)}
            className="flex-1 flex items-center justify-center gap-2 text-sm py-2 px-3
                     bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/30 
                     hover:border-indigo-500/50 rounded-lg transition-all text-indigo-300"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Witness</span>
          </button>
        </div>

        {/* Witness Input */}
        <AnimatePresence>
          {activeWitnessPost === post.id && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-3"
            >
              <div className="flex gap-2">
                <input
                  type="text"
                  value={witnessInput}
                  onChange={(e) => setWitnessInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addWitnessResponse(post.id)}
                  placeholder="Share your witnessing..."
                  className="flex-1 bg-gray-900/50 text-white placeholder-gray-500 px-3 py-2
                           rounded-lg border border-indigo-500/30 focus:border-indigo-500/50 
                           focus:outline-none text-sm"
                  autoFocus
                />
                <button
                  onClick={() => addWitnessResponse(post.id)}
                  className="p-2 bg-indigo-500/20 hover:bg-indigo-500/30 
                           border border-indigo-500/30 hover:border-indigo-500/50 
                           rounded-lg transition-all"
                >
                  <Send className="w-4 h-4 text-indigo-400" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Support Notes - Clustered center-bottom */}
        {post.support_notes && post.support_notes.length > 0 && (
          <div className="absolute bottom-1 left-1/2 -translate-x-1/2 pointer-events-none">
            <div className="relative h-14 w-48">
              {post.support_notes.map((note: SupportNote, i: number) => {
                const color = noteColors.find(c => c.name === note.color) || noteColors[0];
                
                // Rotation variety
                const rotations = ['-10deg', '7deg', '-5deg', '9deg', '-8deg', '6deg', '-7deg', '8deg'];
                const rotation = rotations[i % rotations.length];
                
                // Cluster notes in center with natural spread
                let xPos, yPos, zIndex;
                
                if (i === 0) {
                  // First note centered
                  xPos = 0;
                  yPos = 0;
                  zIndex = 0;
                } else if (i < 4) {
                  // Next 3 notes slightly spread
                  const positions = [
                    { x: -25, y: 2 },  // left
                    { x: 25, y: 2 },   // right
                    { x: 0, y: -8 }    // top-center
                  ];
                  const pos = positions[i - 1];
                  xPos = pos.x;
                  yPos = pos.y;
                  zIndex = i;
                } else {
                  // Additional notes overlap more closely
                  const angle = (i * 137.5) % 360; // Golden angle for natural spread
                  const radius = 15 + (Math.floor((i - 4) / 3) * 10);
                  xPos = Math.cos(angle * Math.PI / 180) * radius;
                  yPos = Math.sin(angle * Math.PI / 180) * radius * 0.3 - (Math.floor((i - 4) / 4) * 5);
                  zIndex = i;
                }
                
                return (
                  <motion.div
                    key={note.id}
                    initial={{ opacity: 0, scale: 0, rotate: 0 }}
                    animate={{ 
                      opacity: 0.93, 
                      scale: 1,
                      rotate: rotation
                    }}
                    whileHover={{ scale: 1.1, zIndex: 100 }}
                    transition={{ 
                      delay: i * 0.02,
                      type: "spring",
                      stiffness: 400,
                      damping: 15
                    }}
                    className={`absolute p-1.5 rounded shadow-md bg-gradient-to-br ${color.gradient}
                              text-gray-800 text-[10px] font-semibold w-16 h-10 
                              flex items-center justify-center text-center`}
                    style={{
                      left: `calc(50% + ${xPos}px)`,
                      bottom: `${yPos}px`,
                      transform: `translateX(-50%) rotate(${rotation})`,
                      zIndex: zIndex,
                      boxShadow: '0 1px 3px rgba(0,0,0,0.25)'
                    }}
                  >
                    <span className="leading-tight block break-words">{note.message}</span>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
})}
        </div>
      </div>

      {/* Support Modal with Emoji Options */}
      <AnimatePresence>
        {showSupportModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowSupportModal(null)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="bg-gray-800 rounded-xl p-6 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg font-semibold text-white mb-4">Send Support</h3>
              
              <div className="space-y-4">
                {/* Emoji Reactions */}
                <div>
                  <p className="text-sm text-gray-400 mb-2">React with emoji:</p>
                  <div className="flex gap-3 justify-center">
                    {supportEmojis.map(emoji => (
                      <button
                        key={emoji}
                        onClick={() => {
                          addEmojiReaction(showSupportModal, emoji);
                          setShowSupportModal(null);
                        }}
                        className="text-3xl hover:scale-125 transition-transform"
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-700"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-gray-800 text-gray-400">or</span>
                  </div>
                </div>

                {/* Preset Messages */}
                <div>
                  <p className="text-sm text-gray-400 mb-2">Send a note:</p>
                  <div className="grid grid-cols-2 gap-2">
                    {presetSupportMessages.map(msg => (
                      <button
                        key={msg}
                        onClick={() => addSupportNote(showSupportModal, msg)}
                        className="p-2 bg-gradient-to-r from-pink-500/10 to-purple-500/10 
                                 hover:from-pink-500/20 hover:to-purple-500/20
                                 border border-pink-500/30 rounded-lg text-sm text-white
                                 transition-all"
                      >
                        {msg}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Custom Message */}
                <div>
                  <p className="text-sm text-gray-400 mb-2">Or write your own:</p>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={customSupportMessage}
                      onChange={(e) => setCustomSupportMessage(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && customSupportMessage.trim()) {
                          addSupportNote(showSupportModal, customSupportMessage);
                        }
                      }}
                      placeholder="Your message..."
                      className="flex-1 bg-gray-900/50 text-white placeholder-gray-500 px-3 py-2
                               rounded-lg border border-indigo-500/30 focus:border-indigo-500/50 
                               focus:outline-none text-sm"
                      maxLength={20}
                    />
                    <button
                      onClick={() => {
                        if (customSupportMessage.trim()) {
                          addSupportNote(showSupportModal, customSupportMessage);
                        }
                      }}
                      className="p-2 bg-indigo-500 hover:bg-indigo-600 rounded-lg transition-all"
                    >
                      <Send className="w-4 h-4 text-white" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Share Modal - Same as before */}
      <AnimatePresence>
        {showShareModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => resetForm()}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 
                       max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-indigo-500/20
                       shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={resetForm}
                className="absolute top-4 right-4 p-2 hover:bg-gray-700/50 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>

              {!selectedTheme ? (
                <>
                  <h3 className="text-xl font-semibold text-white mb-2">
                    What shadow pattern are you exploring?
                  </h3>
                  <p className="text-sm text-gray-400 mb-6">
                    Choose a theme that resonates with your current journey
                  </p>
                  
                  <div className="grid grid-cols-1 gap-3">
                    {shadowThemes.map((theme) => {
                      const Icon = theme.icon;
                      return (
                        <motion.button
                          key={theme.id}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setSelectedTheme(theme)}
                          className={`p-4 rounded-xl text-left transition-all 
                                   bg-gradient-to-r ${theme.bgGradient}
                                   ${theme.borderColor} border hover:shadow-lg group`}
                        >
                          <div className="flex items-start gap-4">
                            <div className={`p-3 rounded-xl bg-gradient-to-br ${theme.gradient}
                                         group-hover:shadow-lg transition-all`}>
                              <Icon className="w-5 h-5 text-white" />
                            </div>
                            <div className="flex-1">
                              <p className="font-medium text-white mb-1">
                                {theme.label}
                              </p>
                              <p className="text-sm text-gray-300">
                                {theme.description}
                              </p>
                            </div>
                            <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-white 
                                                  transition-colors mt-3" />
                          </div>
                        </motion.button>
                      );
                    })}
                  </div>
                </>
              ) : (
                <>
                  <div className="mb-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className={`p-3 rounded-xl bg-gradient-to-br ${selectedTheme.gradient}`}>
                        <selectedTheme.icon className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-white">
                          Exploring: {selectedTheme.label}
                        </h3>
                        <p className="text-sm text-gray-400">
                          Question {currentStep + 1} of {reflectionQuestions.length}
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-1.5">
                      {reflectionQuestions.map((_, i) => (
                        <motion.div
                          key={i}
                          initial={{ scaleX: 0 }}
                          animate={{ scaleX: i <= currentStep ? 1 : 0.3 }}
                          className={`flex-1 h-1.5 rounded-full ${
                            i <= currentStep 
                              ? 'bg-gradient-to-r from-indigo-500 to-purple-500' 
                              : 'bg-gray-700'
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="text-white font-medium">
                          {currentQuestion.question}
                        </h4>
                        <button
                          onClick={() => setShowExamples(!showExamples)}
                          className="p-1.5 hover:bg-purple-500/20 rounded-lg transition-colors"
                          title="Show example"
                        >
                          <Info className="w-4 h-4 text-purple-400" />
                        </button>
                      </div>
                      
                      <p className="text-sm text-gray-400 mb-3">
                        {currentQuestion.hint}
                      </p>
                      
                      <AnimatePresence>
                        {showExamples && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="mb-3 p-3 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 
                                     border border-indigo-500/30 rounded-lg"
                          >
                            <p className="text-xs text-indigo-300 mb-1 font-medium">
                              Example for {selectedTheme.label}:
                            </p>
                            <p className="text-sm text-gray-300 italic">
                              "{selectedTheme.examples[currentQuestion.id as keyof typeof selectedTheme.examples]}"
                            </p>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      <textarea
                        value={reflections[currentQuestion.id] || ''}
                        onChange={(e) => setReflections({
                          ...reflections,
                          [currentQuestion.id]: e.target.value
                        })}
                        placeholder="Take a moment to reflect deeply..."
                        className="w-full h-32 bg-gray-900/50 text-white placeholder-gray-500 px-4 py-3 
                                 rounded-xl border border-indigo-500/30 focus:border-indigo-500/50 
                                 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 resize-none
                                 transition-all"
                        autoFocus
                      />
                    </div>

                    <div className="flex justify-between items-center pt-4">
                      <button
                        onClick={() => {
                          if (currentStep === 0) {
                            setSelectedTheme(null);
                          } else {
                            setCurrentStep(currentStep - 1);
                          }
                        }}
                        className="px-4 py-2 bg-gray-700/50 hover:bg-gray-700 text-white 
                                 rounded-lg transition-all"
                      >
                        Back
                      </button>

                      {currentStep < reflectionQuestions.length - 1 ? (
                        <button
                          onClick={() => setCurrentStep(currentStep + 1)}
                          disabled={!canProgress}
                          className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 
                                   hover:from-indigo-600 hover:to-purple-600 disabled:opacity-50 
                                   disabled:cursor-not-allowed text-white rounded-lg transition-all 
                                   flex items-center gap-2"
                        >
                          Next
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      ) : (
                        <button
                          onClick={sharePost}
                          disabled={!canProgress}
                          className="px-6 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 
                                   hover:from-indigo-600 hover:to-purple-600 disabled:opacity-50 
                                   disabled:cursor-not-allowed text-white rounded-lg transition-all 
                                   font-medium shadow-lg"
                        >
                          Share with Circle
                        </button>
                      )}
                    </div>

                    <div className="flex items-center gap-3 pt-4 border-t border-gray-700/50">
                      <label htmlFor="anonymous" className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          id="anonymous"
                          checked={isAnonymous}
                          onChange={(e) => setIsAnonymous(e.target.checked)}
                          className="w-4 h-4 rounded border-gray-600 bg-gray-700 text-indigo-500 
                                   focus:ring-indigo-500 focus:ring-offset-0"
                        />
                        <span className="text-sm text-gray-400">Share anonymously</span>
                      </label>
                    </div>
                  </div>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}