// /features/yin/components/apps/community/WallOfInsights.tsx
import { createClient } from '@/lib/db/supabase/client'; // FIXED: Changed from '@/lib/supabase'
import { AnimatePresence, motion } from 'framer-motion';
import {
  BookOpen,
  Brain,
  Heart,
  Plus,
  Sparkles,
  Target,
  TrendingUp
} from 'lucide-react';
import { useEffect, useState } from 'react';
import InsightCard from './components/InsightCard';

interface Insight {
  id: string;
  username: string;
  insight: string;
  category: string;
  likes: number;
  liked_by: string[];
  created_at: string;
  featured: boolean;
}

const categories = [
  { id: 'all', name: 'All Insights', icon: Sparkles, color: 'purple' },
  { id: 'mindfulness', name: 'Mindfulness', icon: Brain, color: 'blue' },
  { id: 'growth', name: 'Personal Growth', icon: TrendingUp, color: 'green' },
  { id: 'relationships', name: 'Relationships', icon: Heart, color: 'pink' },
  { id: 'purpose', name: 'Life Purpose', icon: Target, color: 'amber' },
  { id: 'shadow', name: 'Shadow Work', icon: BookOpen, color: 'indigo' },
];

export default function WallOfInsights({ profile }: { profile: any }) {
  const [insights, setInsights] = useState<Insight[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newInsight, setNewInsight] = useState('');
  const [newCategory, setNewCategory] = useState('mindfulness');
  
  const supabase = createClient(); // ADDED: Initialize Supabase client

  // Rest of component remains the same...
  useEffect(() => {
    loadInsights();
    const subscription = subscribeToInsights();
    return () => {
      subscription?.unsubscribe();
    };
  }, [selectedCategory]);

  const loadInsights = async () => {
    let query = supabase
      .from('community_insights')
      .select('*')
      .order('likes', { ascending: false });

    if (selectedCategory !== 'all') {
      query = query.eq('category', selectedCategory);
    }

    const { data } = await query.limit(50);
    if (data) {
      setInsights(data);
    }
  };

  const subscribeToInsights = () => {
    return supabase
      .channel('insights-wall')
      .on('postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'community_insights'
        },
        () => {
          loadInsights();
        }
      )
      .subscribe();
  };

  const submitInsight = async () => {
    if (!newInsight.trim() || !profile) return;

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase
      .from('community_insights')
      .insert({
        user_id: user.id,
        username: profile.username,
        insight: newInsight,
        category: newCategory
      });

    if (!error) {
      setNewInsight('');
      setShowAddModal(false);
      loadInsights();
    }
  };

  const handleLike = async (insightId: string, currentLikes: number, likedBy: string[]) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const hasLiked = likedBy.includes(user.id);
    const newLikedBy = hasLiked 
      ? likedBy.filter(id => id !== user.id)
      : [...likedBy, user.id];

    await supabase
      .from('community_insights')
      .update({
        likes: hasLiked ? currentLikes - 1 : currentLikes + 1,
        liked_by: newLikedBy
      })
      .eq('id', insightId);
  };

  // Rest of JSX remains the same...
  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-purple-500/20">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <h3 className="text-lg font-semibold text-white">Wall of Insights</h3>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Share Insight
          </button>
        </div>

        {/* Category Filter */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`
                  px-3 py-1.5 rounded-lg flex items-center gap-2 whitespace-nowrap transition-all
                  ${selectedCategory === cat.id 
                    ? `bg-${cat.color}-500/20 border border-${cat.color}-500/50 text-${cat.color}-400` 
                    : 'bg-gray-800/50 border border-gray-700/50 text-gray-400 hover:bg-gray-800/70'}
                `}
              >
                <Icon className="w-4 h-4" />
                <span className="text-sm">{cat.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Insights Grid */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence>
            {insights.map((insight, index) => (
              <InsightCard
                key={insight.id}
                insight={insight}
                onLike={() => handleLike(insight.id, insight.likes, insight.liked_by)}
                delay={index * 0.05}
              />
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Add Insight Modal */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowAddModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="bg-gray-800 rounded-xl p-6 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-400" />
                Share Your Insight
              </h3>

              <textarea
                value={newInsight}
                onChange={(e) => setNewInsight(e.target.value)}
                placeholder="What profound realization would you like to share?"
                className="w-full h-32 bg-gray-900/50 text-white placeholder-gray-500 px-4 py-3 rounded-lg border border-purple-500/30 focus:border-purple-500/50 focus:outline-none resize-none"
              />

              <div className="mt-4">
                <label className="text-sm text-gray-400 mb-2 block">Category</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full bg-gray-900/50 text-white px-4 py-2 rounded-lg border border-purple-500/30 focus:border-purple-500/50 focus:outline-none"
                >
                  {categories.filter(c => c.id !== 'all').map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              <div className="flex gap-2 mt-6">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={submitInsight}
                  disabled={!newInsight.trim()}
                  className="flex-1 px-4 py-2 bg-purple-500 hover:bg-purple-600 disabled:opacity-50 text-white rounded-lg transition-colors"
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