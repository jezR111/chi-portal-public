// /features/yin/components/apps/community/MeditationRoom.tsx
import { createClient } from '@/lib/db/supabase/client'; // FIXED: Changed from '@/lib/supabase'
import { motion } from 'framer-motion';
import { Brain, Heart, Users, Volume2, VolumeX } from 'lucide-react';
import { useEffect, useState } from 'react';

interface MeditatorPresence {
  id: string;
  username: string;
  meditation_intention?: string;
  joined_at: string;
}

export default function MeditationRoom({ profile }: { profile: any }) {
  const [meditators, setMeditators] = useState<MeditatorPresence[]>([]);
  const [intention, setIntention] = useState('');
  const [isJoined, setIsJoined] = useState(false);
  const [sessionTime, setSessionTime] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(false);
  
  const supabase = createClient(); // ADDED: Initialize Supabase client

  // Rest of component remains the same...
  useEffect(() => {
    loadPresence();
    const subscription = subscribeToPresence();
    
    return () => {
      leaveRoom();
      subscription?.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (isJoined) {
      const timer = setInterval(() => {
        setSessionTime(prev => prev + 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [isJoined]);

  const loadPresence = async () => {
    const { data } = await supabase
      .from('meditation_presence')
      .select('*')
      .eq('is_active', true);

    if (data) {
      setMeditators(data);
    }
  };

  const subscribeToPresence = () => {
    return supabase
      .channel('meditation-room')
      .on('postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'meditation_presence'
        },
        () => {
          loadPresence();
        }
      )
      .subscribe();
  };

  const joinRoom = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user || !profile) return;

    await supabase
      .from('meditation_presence')
      .upsert({
        user_id: user.id,
        username: profile.username,
        meditation_intention: intention,
        is_active: true
      });

    setIsJoined(true);
  };

  const leaveRoom = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    await supabase
      .from('meditation_presence')
      .update({ is_active: false })
      .eq('user_id', user.id);

    setIsJoined(false);
    setSessionTime(0);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="h-full flex flex-col items-center justify-center p-8">
      {/* Rest of the component JSX remains the same */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-2xl w-full"
      >
        {/* Meditation Circle */}
        <div className="relative mb-8">
          <div className="w-64 h-64 mx-auto relative">
            {/* Breathing Circle */}
            <motion.div
              animate={{
                scale: isJoined ? [1, 1.2, 1] : 1,
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="absolute inset-0 rounded-full bg-gradient-to-br from-purple-500/20 to-cyan-500/20 backdrop-blur-sm"
            />
            
            {/* Center Content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <Brain className="w-12 h-12 text-cyan-400 mb-2" />
              {isJoined ? (
                <>
                  <div className="text-2xl font-mono text-white">
                    {formatTime(sessionTime)}
                  </div>
                  <div className="text-xs text-cyan-300 mt-1">
                    Breathe
                  </div>
                </>
              ) : (
                <div className="text-cyan-300">
                  Ready to Begin
                </div>
              )}
            </div>
          </div>

          {/* Meditator Avatars */}
          <div className="absolute inset-0 pointer-events-none">
            {meditators.map((meditator, index) => {
              const angle = (index / meditators.length) * 2 * Math.PI;
              const x = Math.cos(angle) * 150 + 128;
              const y = Math.sin(angle) * 150 + 128;
              
              return (
                <motion.div
                  key={meditator.id}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0 }}
                  className="absolute w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-xs font-semibold"
                  style={{
                    left: `${x}px`,
                    top: `${y}px`,
                    transform: 'translate(-50%, -50%)'
                  }}
                  title={`${meditator.username}: ${meditator.meditation_intention || 'Meditating'}`}
                >
                  {meditator.username[0].toUpperCase()}
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Controls */}
        {!isJoined ? (
          <div className="space-y-4">
            <input
              type="text"
              value={intention}
              onChange={(e) => setIntention(e.target.value)}
              placeholder="Set your intention (optional)"
              className="w-full bg-gray-800/50 text-white placeholder-gray-500 px-4 py-3 rounded-lg border border-purple-500/30 focus:border-purple-500/50 focus:outline-none"
            />
            <button
              onClick={joinRoom}
              className="w-full px-6 py-3 bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600 text-white rounded-lg transition-all flex items-center justify-center gap-2"
            >
              <Brain className="w-5 h-5" />
              Enter Meditation
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex gap-2">
              <button
                onClick={() => setSoundEnabled(!soundEnabled)}
                className="flex-1 px-4 py-2 bg-gray-800/50 hover:bg-gray-800/70 text-white rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                {soundEnabled ? 'Sound On' : 'Sound Off'}
              </button>
              <button
                onClick={leaveRoom}
                className="flex-1 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-colors"
              >
                Leave Session
              </button>
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="mt-8 flex items-center justify-center gap-6 text-sm">
          <div className="flex items-center gap-2 text-gray-400">
            <Users className="w-4 h-4" />
            <span>{meditators.length} meditating</span>
          </div>
          <div className="flex items-center gap-2 text-gray-400">
            <Heart className="w-4 h-4" />
            <span>Collective presence</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}