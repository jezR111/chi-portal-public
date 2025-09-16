// /features/yin/components/apps/community/ShadowWorkCircle.tsx
import { createClient } from '@/lib/db/supabase/client';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Brain,
  EyeOff,
  Feather,
  Heart,
  Lock,
  MessageCircle,
  Moon,
  Shield,
  Sparkles,
  Target,
  Users,
  Zap
} from 'lucide-react';
import { useEffect, useState } from 'react';

interface ShadowPost {
  id: string;
  user_id: string;
  username: string;
  content: string;
  theme: string;  // Changed from emotion to theme
  is_anonymous: boolean;
  created_at: string;
  support_count: number;
  supported_by: string[];
  responses: number;
}

// Core shadow work themes instead of emotions
const shadowThemes = [
  { id: 'self-worth', label: 'Self Worth', icon: Sparkles, color: 'purple', 
    description: 'Struggles with valuing yourself' },
  { id: 'boundaries', label: 'Boundaries', icon: Shield, color: 'blue',
    description: 'Setting and maintaining healthy limits' },
  { id: 'abandonment', label: 'Abandonment', icon: Users, color: 'indigo',
    description: 'Fear of being left or rejected' },
  { id: 'perfectionism', label: 'Perfectionism', icon: Target, color: 'amber',
    description: 'Never feeling good enough' },
  { id: 'control', label: 'Control', icon: Lock, color: 'red',
    description: 'Need to control outcomes or people' },
  { id: 'shame', label: 'Shame & Guilt', icon: EyeOff, color: 'gray',
    description: 'Deep feelings of unworthiness' },
  { id: 'trust', label: 'Trust Issues', icon: Heart, color: 'pink',
    description: 'Difficulty trusting others or yourself' },
  { id: 'identity', label: 'Identity', icon: Brain, color: 'teal',
    description: 'Who am I really?' },
  { id: 'power', label: 'Power Dynamics', icon: Zap, color: 'orange',
    description: 'Relationship with personal power' },
];

export default function ShadowWorkCircle({ profile }: { profile: any }) {
  const [posts, setPosts] = useState<ShadowPost[]>([]);
  const [showShareModal, setShowShareModal] = useState(false);
  const [newPost, setNewPost] = useState('');
  const [selectedTheme, setSelectedTheme] = useState('self-worth'); // Changed from selectedEmotion
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [selectedPost, setSelectedPost] = useState<ShadowPost | null>(null);
  
  const supabase = createClient();

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
      // Transform to shadow post format with theme
      const shadowPosts = data.map(msg => ({
        ...msg,
        theme: msg.metadata?.theme || 'self-worth', // Store theme in metadata
        is_anonymous: msg.metadata?.is_anonymous || false,
        support_count: msg.metadata?.support_count || 0,
        supported_by: msg.metadata?.supported_by || [],
        responses: msg.metadata?.responses || 0,
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

  const sharePost = async () => {
    if (!newPost.trim() || !profile) return;

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // Store theme and other metadata in a JSON field
    const metadata = {
      theme: selectedTheme,
      is_anonymous: isAnonymous,
      support_count: 0,
      supported_by: [],
      responses: 0
    };

    const { error } = await supabase
      .from('community_messages')
      .insert({
        room_id: 'shadow',
        user_id: user.id,
        username: isAnonymous ? 'Anonymous Seeker' : profile.username,
        message: newPost,
        reactions: metadata // Using reactions field to store metadata temporarily
      });

    if (!error) {
      setNewPost('');
      setShowShareModal(false);
      setIsAnonymous(false);
      setSelectedTheme('self-worth');
      loadPosts();
    }
  };

  const sendSupport = async (postId: string) => {
    console.log('Sending support to:', postId);
  };

  // Get theme details
  const getThemeDetails = (themeId: string) => {
    return shadowThemes.find(t => t.id === themeId) || shadowThemes[0];
  };

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-gray-900 via-indigo-900/20 to-gray-900">
      {/* Sacred Space Notice */}
      <div className="p-4 bg-indigo-500/10 border-b border-indigo-500/30">
        <div className="flex items-start gap-3">
          <Shield className="w-5 h-5 text-indigo-400 mt-0.5" />
          <div>
            <h3 className="text-sm font-semibold text-indigo-300 mb-1">
              Sacred Shadow Space
            </h3>
            <p className="text-xs text-indigo-300/70">
              This is a safe container for exploring your shadow themes. Share what patterns you're working with. 
              We witness without judgment, offer support without fixing, and honor each person's journey.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {/* Share Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowShareModal(true)}
          className="w-full mb-6 p-4 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 
                     border border-indigo-500/30 rounded-xl hover:border-indigo-500/50 
                     transition-all group"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-500/20 rounded-lg">
                <Feather className="w-5 h-5 text-indigo-400" />
              </div>
              <div className="text-left">
                <p className="text-white font-medium">Share Your Shadow Work</p>
                <p className="text-xs text-gray-400">What patterns are you exploring?</p>
              </div>
            </div>
            <Moon className="w-5 h-5 text-indigo-400 group-hover:rotate-12 transition-transform" />
          </div>
        </motion.button>

        {/* Shadow Posts */}
        <div className="space-y-4">
          <AnimatePresence>
            {posts.map((post, index) => {
              const theme = getThemeDetails(post.theme);
              const ThemeIcon = theme.icon;
              
              return (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-gray-800/30 backdrop-blur-sm border border-indigo-500/20 
                            rounded-xl p-4 hover:border-indigo-500/30 transition-all"
                >
                  {/* Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      {post.is_anonymous ? (
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-600 to-gray-700 
                                        flex items-center justify-center">
                            <EyeOff className="w-4 h-4 text-gray-400" />
                          </div>
                          <span className="text-sm text-gray-400">Anonymous Seeker</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 
                                        flex items-center justify-center text-white text-sm font-semibold">
                            {post.username[0].toUpperCase()}
                          </div>
                          <span className="text-sm text-indigo-300">{post.username}</span>
                        </div>
                      )}
                      <span className="text-xs text-gray-500">
                        {new Date(post.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    
                    {/* Theme Badge - FIXED to show actual theme */}
                    <div className={`px-3 py-1 bg-${theme.color}-500/20 rounded-full flex items-center gap-1.5`}>
                      <ThemeIcon className="w-3 h-3 text-white" />
                      <span className="text-xs text-white">{theme.label}</span>
                    </div>
                  </div>

                  {/* Content */}
                  <p className="text-gray-200 mb-4 leading-relaxed">
                    {post.content}
                  </p>

                  {/* Actions */}
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => sendSupport(post.id)}
                      className="flex items-center gap-2 text-sm text-gray-400 
                               hover:text-pink-400 transition-colors"
                    >
                      <Heart className="w-4 h-4" />
                      <span>Send Support ({post.support_count})</span>
                    </button>
                    
                    <button
                      onClick={() => setSelectedPost(post)}
                      className="flex items-center gap-2 text-sm text-gray-400 
                               hover:text-indigo-400 transition-colors"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>Witness ({post.responses})</span>
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>

      {/* Share Modal */}
      <AnimatePresence>
        {showShareModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowShareModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="bg-gray-800 rounded-xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <Moon className="w-5 h-5 text-indigo-400" />
                Share Your Shadow Work
              </h3>

              <div className="mb-4">
                <label className="text-sm text-gray-400 mb-2 block">What theme are you working with?</label>
                <div className="grid grid-cols-1 gap-2">
                  {shadowThemes.map((theme) => {
                    const Icon = theme.icon;
                    return (
                      <button
                        key={theme.id}
                        onClick={() => setSelectedTheme(theme.id)}
                        className={`
                          p-3 rounded-lg text-left transition-all
                          ${selectedTheme === theme.id
                            ? `bg-${theme.color}-500/30 border border-${theme.color}-500/50`
                            : 'bg-gray-700/50 border border-gray-600/50 hover:bg-gray-700/70'}
                        `}
                      >
                        <div className="flex items-start gap-3">
                          <Icon className={`w-5 h-5 mt-0.5 ${
                            selectedTheme === theme.id ? 'text-white' : 'text-gray-400'
                          }`} />
                          <div>
                            <p className={`font-medium ${
                              selectedTheme === theme.id ? 'text-white' : 'text-gray-300'
                            }`}>
                              {theme.label}
                            </p>
                            <p className="text-xs text-gray-500 mt-0.5">
                              {theme.description}
                            </p>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <textarea
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
                placeholder="Share what you're experiencing with this pattern. What are you noticing? What feels challenging?"
                className="w-full h-32 bg-gray-900/50 text-white placeholder-gray-500 px-4 py-3 
                         rounded-lg border border-indigo-500/30 focus:border-indigo-500/50 
                         focus:outline-none resize-none mb-4"
              />

              <div className="flex items-center gap-2 mb-4">
                <input
                  type="checkbox"
                  id="anonymous"
                  checked={isAnonymous}
                  onChange={(e) => setIsAnonymous(e.target.checked)}
                  className="rounded border-gray-600 bg-gray-700 text-indigo-500 
                           focus:ring-indigo-500 focus:ring-offset-0"
                />
                <label htmlFor="anonymous" className="text-sm text-gray-400">
                  Share anonymously
                </label>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setShowShareModal(false)}
                  className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white 
                           rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={sharePost}
                  disabled={!newPost.trim()}
                  className="flex-1 px-4 py-2 bg-indigo-500 hover:bg-indigo-600 
                           disabled:opacity-50 text-white rounded-lg transition-colors"
                >
                  Share
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}