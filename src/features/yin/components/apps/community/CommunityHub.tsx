// /features/yin/components/apps/community/CommunityHub.tsx
import ChatRoom from '@/features/yin/components/apps/community/ChatRoom';
import MeditationRoom from '@/features/yin/components/apps/community/MeditationRoom';
import ShadowWorkCircle from '@/features/yin/components/apps/community/ShadowWorkCircle';
import UserProfile from '@/features/yin/components/apps/community/UserProfile';
import WallOfInsights from '@/features/yin/components/apps/community/WallOfInsights';
import { createClient } from '@/lib/db/supabase/client';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Bell,
  Brain,
  ChevronLeft,
  Heart,
  MessageCircle,
  Moon,
  Settings,
  Sparkles,
  Users,
  Zap
} from 'lucide-react';
import { useEffect, useState } from 'react';

const supabase = createClient();

type Room = 'hub' | 'chat' | 'insights' | 'meditation' | 'shadow' | 'breakout';

interface CommunityProfile {
  username: string;
  avatar_color: string;
  bio?: string;
  journey_level: number;
}

export default function CommunityHub() {
  const [currentRoom, setCurrentRoom] = useState<Room>('hub');
  const [profile, setProfile] = useState<CommunityProfile | null>(null);
  const [showProfileSetup, setShowProfileSetup] = useState(false);
  const [onlineCount, setOnlineCount] = useState(0);
  const [notifications, setNotifications] = useState(0);

  useEffect(() => {
    checkProfile();
    subscribeToPresence();
  }, []);

  const checkProfile = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data: profile } = await supabase
      .from('community_profiles')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (!profile) {
      setShowProfileSetup(true);
    } else {
      setProfile(profile);
    }
  };

  const subscribeToPresence = () => {
    const channel = supabase.channel('online-users')
      .on('presence', { event: 'sync' }, () => {
        const state = channel.presenceState();
        setOnlineCount(Object.keys(state).length);
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          const { data: { user } } = await supabase.auth.getUser();
          if (user) {
            await channel.track({ user_id: user.id });
          }
        }
      });

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const rooms = [
    { 
      id: 'chat', 
      name: 'Community Circle', 
      icon: MessageCircle,
      description: 'Connect with fellow seekers',
      color: 'from-purple-500 to-pink-500',
      active: true
    },
    { 
      id: 'insights', 
      name: 'Wall of Insights', 
      icon: Sparkles,
      description: 'Share your profound realizations',
      color: 'from-amber-500 to-orange-500',
      active: true
    },
    { 
      id: 'meditation', 
      name: 'Meditation Room', 
      icon: Brain,
      description: 'Find stillness together',
      color: 'from-teal-500 to-cyan-500',
      active: true
    },
    { 
      id: 'shadow', 
      name: 'Shadow Work Circle', 
      icon: Moon,
      description: 'Explore your depths safely',
      color: 'from-indigo-500 to-purple-500',
      active: true
    },
    { 
      id: 'breakout', 
      name: 'Breakout Rooms', 
      icon: Users,
      description: 'Topic-focused discussions',
      color: 'from-gray-600 to-gray-700',
      active: false,
      comingSoon: true
    }
  ];

  if (showProfileSetup) {
    return <UserProfile onComplete={() => {
      setShowProfileSetup(false);
      checkProfile();
    }} />;
  }

  if (currentRoom !== 'hub') {
    return (
      <div className="h-full flex flex-col bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900">
        {/* Room Header */}
        <div className="bg-gray-800/50 backdrop-blur-sm border-b border-purple-500/20 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setCurrentRoom('hub')}
                className="p-2 hover:bg-purple-500/20 rounded-lg transition-colors"
              >
                <ChevronLeft className="w-5 h-5 text-purple-400" />
              </button>
              <h2 className="text-xl font-semibold text-white">
                {rooms.find(r => r.id === currentRoom)?.name}
              </h2>
              <div className="flex items-center gap-2 px-3 py-1 bg-green-500/20 rounded-full">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span className="text-xs text-green-400">{onlineCount} online</span>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              {notifications > 0 && (
                <div className="relative">
                  <Bell className="w-5 h-5 text-purple-400" />
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-pink-500 rounded-full text-xs flex items-center justify-center text-white">
                    {notifications}
                  </span>
                </div>
              )}
              <button className="p-2 hover:bg-purple-500/20 rounded-lg transition-colors">
                <Settings className="w-5 h-5 text-purple-400" />
              </button>
            </div>
          </div>
        </div>

        {/* Room Content */}
        <div className="flex-1 overflow-hidden">
          <AnimatePresence mode="wait">
            {currentRoom === 'chat' && <ChatRoom profile={profile} />}
            {currentRoom === 'insights' && <WallOfInsights profile={profile} />}
            {currentRoom === 'meditation' && <MeditationRoom profile={profile} />}
            {currentRoom === 'shadow' && <ShadowWorkCircle profile={profile} />}
          </AnimatePresence>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900 p-6 overflow-y-auto">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-white mb-2">
          Community Sanctuary
        </h1>
        <p className="text-purple-300">
          Connect, share, and grow with fellow seekers on the path
        </p>
        
        {/* Stats Bar */}
        <div className="flex gap-4 mt-4">
          <div className="flex items-center gap-2 px-3 py-1 bg-purple-500/20 rounded-full">
            <Zap className="w-4 h-4 text-yellow-400" />
            <span className="text-sm text-purple-200">
              Level {profile?.journey_level || 1}
            </span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1 bg-green-500/20 rounded-full">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span className="text-sm text-green-400">{onlineCount} seekers online</span>
          </div>
        </div>
      </motion.div>

      {/* Room Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {rooms.map((room, index) => {
          const Icon = room.icon;
          return (
            <motion.div
              key={room.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              <button
                onClick={() => !room.comingSoon && setCurrentRoom(room.id as Room)}
                disabled={room.comingSoon}
                className={`
                  w-full p-6 rounded-xl backdrop-blur-sm border transition-all
                  ${room.comingSoon 
                    ? 'bg-gray-800/30 border-gray-700/50 opacity-50 cursor-not-allowed' 
                    : 'bg-gray-800/50 border-purple-500/30 hover:bg-gray-800/70 hover:border-purple-500/50 hover:scale-[1.02]'}
                `}
              >
                <div className="flex items-start gap-4">
                  <div className={`
                    p-3 rounded-lg bg-gradient-to-br ${room.color}
                    ${room.comingSoon ? 'opacity-50' : ''}
                  `}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1 text-left">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-white">
                        {room.name}
                      </h3>
                      {room.comingSoon && (
                        <span className="text-xs px-2 py-0.5 bg-purple-500/20 text-purple-300 rounded-full">
                          Coming Soon
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-400">
                      {room.description}
                    </p>
                  </div>
                </div>
              </button>
            </motion.div>
          );
        })}
      </div>

      {/* Community Guidelines */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-8 p-4 bg-purple-500/10 border border-purple-500/30 rounded-lg"
      >
        <div className="flex items-center gap-2 mb-2">
          <Heart className="w-4 h-4 text-pink-400" />
          <h4 className="text-sm font-semibold text-purple-200">Community Guidelines</h4>
        </div>
        <p className="text-xs text-purple-300">
          This is a sacred space for growth and healing. Please be respectful, supportive, 
          and maintain confidentiality. We're all on this journey together.
        </p>
      </motion.div>
    </div>
  );
}