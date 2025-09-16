// /features/yin/components/apps/community/components/MessageBubble.tsx
import { motion } from 'framer-motion';
import { Heart, Reply, Smile } from 'lucide-react';

interface MessageBubbleProps {
  message: {
    id: string;
    username: string;
    message: string;
    created_at: string;
    reactions?: any[];
  };
  isOwn: boolean;
  onReply: () => void;
}

export default function MessageBubble({ message, isOwn, onReply }: MessageBubbleProps) {
  const time = new Date(message.created_at).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit'
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
    >
      <div className={`max-w-[70%] ${isOwn ? 'items-end' : 'items-start'}`}>
        <div className="flex items-baseline gap-2 mb-1">
          {!isOwn && (
            <span className="text-xs font-medium text-purple-400">
              {message.username}
            </span>
          )}
          <span className="text-xs text-gray-500">{time}</span>
        </div>
        
        <div className={`
          group relative px-4 py-2 rounded-2xl
          ${isOwn 
            ? 'bg-purple-500 text-white' 
            : 'bg-gray-800/70 text-gray-100 border border-gray-700/50'}
        `}>
          <p className="whitespace-pre-wrap break-words">{message.message}</p>
          
          {/* Quick Actions */}
          <div className={`
            absolute -bottom-6 ${isOwn ? 'right-0' : 'left-0'}
            opacity-0 group-hover:opacity-100 transition-opacity
            flex gap-1 bg-gray-800 rounded-lg p-1 shadow-lg
          `}>
            <button 
              onClick={onReply}
              className="p-1 hover:bg-purple-500/20 rounded transition-colors"
            >
              <Reply className="w-3 h-3 text-purple-400" />
            </button>
            <button className="p-1 hover:bg-purple-500/20 rounded transition-colors">
              <Heart className="w-3 h-3 text-purple-400" />
            </button>
            <button className="p-1 hover:bg-purple-500/20 rounded transition-colors">
              <Smile className="w-3 h-3 text-purple-400" />
            </button>
          </div>
        </div>

        {/* Reactions */}
        {message.reactions && message.reactions.length > 0 && (
          <div className="flex gap-1 mt-1">
            {message.reactions.map((reaction: any, index: number) => (
              <span 
                key={index}
                className="text-xs bg-gray-800/50 px-2 py-0.5 rounded-full"
              >
                {reaction.emoji} {reaction.count}
              </span>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}