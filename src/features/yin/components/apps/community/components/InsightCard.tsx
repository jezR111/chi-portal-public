// /features/yin/components/apps/community/components/InsightCard.tsx
import { motion } from 'framer-motion';
import { Bookmark, Heart, Share2, Star } from 'lucide-react';

interface InsightCardProps {
  insight: {
    id: string;
    username: string;
    insight: string;
    category: string;
    likes: number;
    liked_by: string[];
    created_at: string;
    featured: boolean;
  };
  onLike: () => void;
  delay?: number;
}

const categoryColors: Record<string, string> = {
  mindfulness: 'from-blue-500 to-cyan-500',
  growth: 'from-green-500 to-emerald-500',
  relationships: 'from-pink-500 to-rose-500',
  purpose: 'from-amber-500 to-orange-500',
  shadow: 'from-indigo-500 to-purple-500',
};

export default function InsightCard({ insight, onLike, delay = 0 }: InsightCardProps) {
  const gradientClass = categoryColors[insight.category] || 'from-purple-500 to-pink-500';
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ delay }}
      whileHover={{ y: -4 }}
      className="relative group"
    >
      <div className="absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-10 
                    rounded-xl transition-opacity duration-300 blur-xl"
           style={{ backgroundImage: `linear-gradient(to right, var(--tw-gradient-stops))` }}
      />
      
      <div className="relative bg-gray-800/50 backdrop-blur-sm border border-purple-500/20 
                    rounded-xl p-5 hover:border-purple-500/40 transition-all">
        {/* Featured Badge */}
        {insight.featured && (
          <div className="absolute -top-2 -right-2 p-1.5 bg-yellow-500 rounded-full">
            <Star className="w-3 h-3 text-white fill-white" />
          </div>
        )}

        {/* Category Tag */}
        <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full 
                      bg-gradient-to-r ${gradientClass} bg-opacity-20 mb-3`}>
          <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${gradientClass}`} />
          <span className="text-xs text-white font-medium capitalize">
            {insight.category}
          </span>
        </div>

        {/* Insight Text */}
        <blockquote className="text-gray-100 mb-4 italic leading-relaxed">
          "{insight.insight}"
        </blockquote>

        {/* Footer */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 
                          flex items-center justify-center text-white text-xs font-semibold">
              {insight.username[0].toUpperCase()}
            </div>
            <span className="text-xs text-gray-400">{insight.username}</span>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1">
            <button
              onClick={onLike}
              className="p-1.5 hover:bg-purple-500/20 rounded-lg transition-colors group/btn"
            >
              <Heart className="w-4 h-4 text-purple-400 group-hover/btn:text-pink-400 
                              group-hover/btn:fill-pink-400 transition-colors" />
            </button>
            <span className="text-xs text-gray-500 mr-2">{insight.likes}</span>
            
            <button className="p-1.5 hover:bg-purple-500/20 rounded-lg transition-colors">
              <Share2 className="w-4 h-4 text-purple-400" />
            </button>
            
            <button className="p-1.5 hover:bg-purple-500/20 rounded-lg transition-colors">
              <Bookmark className="w-4 h-4 text-purple-400" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}