// /features/yin/components/apps/community/ChatRoom.tsx
import { createClient } from '@/lib/db/supabase/client'; // FIXED: Changed from '@/lib/supabase'
import { Hash, Reply, Send, Smile } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import MessageBubble from './components/MessageBubble';

interface Message {
  id: string;
  user_id: string;
  username: string;
  message: string;
  created_at: string;
  reactions: any[];
  reply_to?: string;
}

export default function ChatRoom({ profile }: { profile: any }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [replyingTo, setReplyingTo] = useState<Message | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  
  const supabase = createClient(); // ADDED: Initialize Supabase client

  // Rest of the component remains the same...
  useEffect(() => {
    loadMessages();
    const subscription = subscribeToMessages();
    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadMessages = async () => {
    const { data } = await supabase
      .from('community_messages')
      .select('*')
      .eq('room_id', 'general')
      .order('created_at', { ascending: true })
      .limit(100);

    if (data) {
      setMessages(data);
    }
  };

  const subscribeToMessages = () => {
    return supabase
      .channel('chat-room')
      .on('postgres_changes', 
        { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'community_messages',
          filter: 'room_id=eq.general'
        },
        (payload) => {
          setMessages(prev => [...prev, payload.new as Message]);
        }
      )
      .on('presence', { event: 'sync' }, () => {
        // Handle typing indicators
      })
      .subscribe();
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !profile) return;

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase
      .from('community_messages')
      .insert({
        room_id: 'general',
        user_id: user.id,
        username: profile.username,
        message: newMessage,
        reply_to: replyingTo?.id
      });

    if (!error) {
      setNewMessage('');
      setReplyingTo(null);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <div className="flex items-center gap-2 mb-4 text-purple-400">
          <Hash className="w-4 h-4" />
          <span className="text-sm">general</span>
        </div>

        {messages.map((message) => (
          <MessageBubble
            key={message.id}
            message={message}
            isOwn={message.user_id === profile?.user_id}
            onReply={() => setReplyingTo(message)}
          />
        ))}

        {typingUsers.length > 0 && (
          <div className="flex items-center gap-2 text-gray-400 text-sm">
            <div className="flex gap-1">
              <span className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
            <span>{typingUsers.join(', ')} typing...</span>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Reply Preview */}
      {replyingTo && (
        <div className="px-4 py-2 bg-purple-500/10 border-l-2 border-purple-500 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Reply className="w-4 h-4 text-purple-400" />
            <span className="text-sm text-purple-300">
              Replying to {replyingTo.username}
            </span>
          </div>
          <button 
            onClick={() => setReplyingTo(null)}
            className="text-gray-400 hover:text-white"
          >
            ×
          </button>
        </div>
      )}

      {/* Input Area */}
      <div className="p-4 border-t border-purple-500/20">
        <div className="flex gap-2">
          <button className="p-2 text-purple-400 hover:bg-purple-500/20 rounded-lg transition-colors">
            <Smile className="w-5 h-5" />
          </button>
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Share your thoughts..."
            className="flex-1 bg-gray-800/50 text-white placeholder-gray-500 px-4 py-2 rounded-lg border border-purple-500/30 focus:border-purple-500/50 focus:outline-none"
          />
          <button
            onClick={sendMessage}
            disabled={!newMessage.trim()}
            className="px-4 py-2 bg-purple-500 hover:bg-purple-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-colors flex items-center gap-2"
          >
            <Send className="w-4 h-4" />
            Send
          </button>
        </div>
      </div>
    </div>
  );
}