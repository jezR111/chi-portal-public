// /features/yin/components/apps/community/hooks/useRealtimeMessages.ts
import { supabase } from '@/lib/supabase';
import { RealtimeChannel } from '@supabase/supabase-js';
import { useEffect, useState } from 'react';

export function useRealtimeMessages(roomId: string) {
  const [messages, setMessages] = useState<any[]>([]);
  const [channel, setChannel] = useState<RealtimeChannel | null>(null);

  useEffect(() => {
    // Load initial messages
    const loadMessages = async () => {
      const { data } = await supabase
        .from('community_messages')
        .select('*')
        .eq('room_id', roomId)
        .order('created_at', { ascending: true })
        .limit(100);
      
      if (data) {
        setMessages(data);
      }
    };

    // Set up real-time subscription
    const setupChannel = () => {
      const newChannel = supabase
        .channel(`room-${roomId}`)
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'community_messages',
            filter: `room_id=eq.${roomId}`
          },
          (payload) => {
            setMessages(prev => [...prev, payload.new]);
          }
        )
        .on(
          'postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
            table: 'community_messages',
            filter: `room_id=eq.${roomId}`
          },
          (payload) => {
            setMessages(prev => 
              prev.map(msg => msg.id === payload.new.id ? payload.new : msg)
            );
          }
        )
        .on(
          'postgres_changes',
          {
            event: 'DELETE',
            schema: 'public',
            table: 'community_messages',
            filter: `room_id=eq.${roomId}`
          },
          (payload) => {
            setMessages(prev => prev.filter(msg => msg.id !== payload.old.id));
          }
        )
        .subscribe();

      setChannel(newChannel);
    };

    loadMessages();
    setupChannel();

    return () => {
      if (channel) {
        supabase.removeChannel(channel);
      }
    };
  }, [roomId]);

  const sendMessage = async (message: string, userId: string, username: string) => {
    const { error } = await supabase
      .from('community_messages')
      .insert({
        room_id: roomId,
        user_id: userId,
        username,
        message
      });

    return { error };
  };

  return { messages, sendMessage };
}