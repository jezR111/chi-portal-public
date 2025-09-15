// src/app/(portal)/dashboard/page.tsx

'use client';

import { useUserProgress } from '@/features/yin/hooks/useUserProgress';
import { motion } from 'framer-motion';
import {
  Award,
  BookOpen,
  Calendar,
  Flame,
  Headphones, MessageCircle,
  Sparkles,
  Target,
  TrendingUp,
  Users
} from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

// YinYangPortal with glowing text
const YinYangPortal = () => {
  const [hoveredRealm, setHoveredRealm] = useState<'yin' | 'yang' | null>(null);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
      className="relative"
    >
      {/* Glow effect */}
      <motion.div 
        className="absolute -inset-8 blur-3xl opacity-30"
        animate={{
          opacity: hoveredRealm ? 0.4 : 0.3,
        }}
        transition={{ duration: 0.3 }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 rounded-full" />
      </motion.div>

      {/* Main container - using Unicode yin-yang symbol */}
      <div className="relative w-72 h-72 flex items-center justify-center">
        <div className="text-[280px] leading-none select-none filter drop-shadow-[0_0_30px_rgba(100,200,255,0.4)]">
          ☯
        </div>

        {/* Interactive overlays */}
        <Link href="/yin">
          <div 
            className="absolute inset-y-0 left-0 w-1/2 cursor-pointer z-10"
            onMouseEnter={() => setHoveredRealm('yin')}
            onMouseLeave={() => setHoveredRealm(null)}
          />
        </Link>
        
        <Link href="/yang">
          <div 
            className="absolute inset-y-0 right-0 w-1/2 cursor-pointer z-10"
            onMouseEnter={() => setHoveredRealm('yang')}
            onMouseLeave={() => setHoveredRealm(null)}
          />
        </Link>

        {/* Hover effect */}
        {hoveredRealm && (
          <motion.div
            className="absolute inset-0 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className={`absolute inset-0 ${
              hoveredRealm === 'yin' 
                ? 'bg-gradient-to-r from-purple-500/20 to-transparent' 
                : 'bg-gradient-to-l from-orange-500/20 to-transparent'
            } rounded-full`} />
          </motion.div>
        )}
      </div>

      {/* Labels with glowing effects */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="flex w-full">
          <motion.div 
            className="flex-1 text-center -ml-6"
            animate={{ scale: hoveredRealm === 'yin' ? 1.1 : 1 }}
          >
            <p 
              className="text-white font-bold text-xl"
              style={{ 
                textShadow: '0 0 20px rgba(255,255,255,0.8), 0 0 40px rgba(255,255,255,0.6), 0 0 60px rgba(255,255,255,0.4)' 
              }}
            >
              Yin
            </p>
            <p className="text-gray-300 text-xs">Inner Journey</p>
          </motion.div>
          <motion.div 
            className="flex-1 text-center ml-6"
            animate={{ scale: hoveredRealm === 'yang' ? 1.1 : 1 }}
          >
            <p 
              className="text-white font-bold text-xl"
              style={{ 
                textShadow: '0 0 20px rgba(0,0,0,0.9), 0 0 40px rgba(0,0,0,0.7), 0 0 60px rgba(0,0,0,0.5)' 
              }}
            >
              Yang
            </p>
            <p className="text-gray-300 text-xs">Physical Path</p>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default function DashboardPage() {
  const { user, xp, level } = useUserProgress();
  const [greeting, setGreeting] = useState('');
  const [mounted, setMounted] = useState(false);
  const [currentQuote, setCurrentQuote] = useState({ text: '', author: '' });

  useEffect(() => {
    setMounted(true);
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good Morning');
    else if (hour < 17) setGreeting('Good Afternoon');
    else setGreeting('Good Evening');

    const dailyQuotes = [
      { text: "The journey of a thousand miles begins with a single step.", author: "Lao Tzu" },
      { text: "In the depth of winter, I finally learned that within me there lay an invincible summer.", author: "Albert Camus" },
      { text: "The wound is the place where the Light enters you.", author: "Rumi" }
    ];
    setCurrentQuote(dailyQuotes[Math.floor(Math.random() * dailyQuotes.length)]);
  }, []);

  const stats = {
    streak: 7,
    todayXP: 45,
    weeklyProgress: 68,
    yinHealing: {
      total: 65,
      healed: 40,
      healing: 15,
      unhealed: 10
    },
    yangHealing: {
      total: 35,
      healed: 15,
      healing: 10,
      unhealed: 10
    },
    totalHours: 23.5,
    communityRank: 127
  };

  const communityPulse = [
    { user: 'Sarah', action: 'completed Shadow Work Chapter', time: '2m ago' },
    { user: 'Mike', action: 'achieved 30 day streak', time: '15m ago' },
    { user: 'Luna', action: 'unlocked Energy Bodies path', time: '1h ago' }
  ];

  const upcomingWorkshops = [
    { title: 'Shadow Integration', date: 'Tomorrow', time: '7:00 PM', spots: 12 },
    { title: 'Breathwork Journey', date: 'Friday', time: '6:00 PM', spots: 8 },
    { title: 'Movement Medicine', date: 'Sunday', time: '10:00 AM', spots: 15 }
  ];

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black relative overflow-hidden">
      {/* Subtle animated background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.01]" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-900/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-900/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-6 max-w-7xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 text-center"
        >
          <h1 className="text-3xl font-bold text-white mb-1">
            {greeting}, {user?.name || 'Seeker'} ✨
          </h1>
          <p className="text-gray-400 text-sm">
            Level {level} • {xp} XP • Day {stats.streak} of your journey
          </p>
        </motion.div>

        {/* Main Grid Layout */}
        <div className="grid grid-cols-12 gap-4">
          
          {/* Left Column */}
          <div className="col-span-12 lg:col-span-3 space-y-4">
            {/* Journey Progress */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white/[0.03] backdrop-blur-md rounded-xl p-4 border border-white/10"
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-white font-medium">Journey Progress</h3>
                <TrendingUp className="w-4 h-4 text-purple-400" />
              </div>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-400">Level {level}</span>
                    <span className="text-purple-400">{xp} XP</span>
                  </div>
                  <div className="bg-black/30 rounded-full h-2">
                    <div className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-500" 
                         style={{ width: `${(xp % 100)}%` }} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/5">
                  <div className="text-center">
                    <p className="text-xl font-bold text-white">{stats.todayXP}</p>
                    <p className="text-xs text-gray-400">Today's XP</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xl font-bold text-white">{stats.totalHours}h</p>
                    <p className="text-xs text-gray-400">Total Time</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Daily Practice Rings */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white/[0.03] backdrop-blur-md rounded-xl p-4 border border-white/10"
            >
              <h3 className="text-white font-medium mb-3">Daily Practice</h3>
              <div className="flex justify-around">
                {[
                  { label: 'Meditate', value: 100, color: 'text-purple-400' },
                  { label: 'Move', value: 75, color: 'text-orange-400' },
                  { label: 'Reflect', value: 50, color: 'text-blue-400' }
                ].map((ring) => (
                  <div key={ring.label} className="text-center">
                    <div className="relative w-12 h-12 mb-1">
                      <svg className="w-12 h-12 transform -rotate-90">
                        <circle cx="24" cy="24" r="20" stroke="currentColor" 
                                strokeWidth="4" fill="none" className="text-white/10" />
                        <circle cx="24" cy="24" r="20" stroke="currentColor" 
                                strokeWidth="4" fill="none" className={ring.color}
                                strokeDasharray={`${ring.value * 1.26} 999`}
                                strokeLinecap="round" />
                      </svg>
                    </div>
                    <p className="text-xs text-gray-400">{ring.label}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Energy Balance */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white/[0.03] backdrop-blur-md rounded-xl p-4 border border-white/10"
            >
              <h3 className="text-white font-medium mb-3">Energy Balance</h3>
              <div className="space-y-3">
                {/* Yin Healing Bar */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-purple-300">Yin</span>
                    <span className="text-xs text-gray-400">{stats.yinHealing.total}% Active</span>
                  </div>
                  <div className="relative h-6 bg-black/30 rounded-full overflow-hidden">
                    <div className="absolute inset-y-0 left-0 flex">
                      <div className="h-full bg-gradient-to-r from-purple-900 to-purple-800" 
                           style={{ width: `${stats.yinHealing.unhealed * 2}px` }} />
                      <div className="h-full bg-gradient-to-r from-purple-600 to-purple-500" 
                           style={{ width: `${stats.yinHealing.healing * 2}px` }} />
                      <div className="h-full bg-gradient-to-r from-yellow-600 to-amber-500" 
                           style={{ width: `${stats.yinHealing.healed * 2}px` }} />
                    </div>
                  </div>
                  <div className="flex justify-between mt-1">
                    <span className="text-[10px] text-gray-500">Shadow</span>
                    <span className="text-[10px] text-amber-500">Divine</span>
                  </div>
                </div>

                {/* Yang Healing Bar */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-orange-300">Yang</span>
                    <span className="text-xs text-gray-400">{stats.yangHealing.total}% Active</span>
                  </div>
                  <div className="relative h-6 bg-black/30 rounded-full overflow-hidden">
                    <div className="absolute inset-y-0 right-0 flex flex-row-reverse">
                      <div className="h-full bg-gradient-to-l from-orange-900 to-orange-800" 
                           style={{ width: `${stats.yangHealing.unhealed * 2}px` }} />
                      <div className="h-full bg-gradient-to-l from-orange-600 to-orange-500" 
                           style={{ width: `${stats.yangHealing.healing * 2}px` }} />
                      <div className="h-full bg-gradient-to-l from-yellow-600 to-amber-500" 
                           style={{ width: `${stats.yangHealing.healed * 2}px` }} />
                    </div>
                  </div>
                  <div className="flex justify-between mt-1">
                    <span className="text-[10px] text-amber-500">Divine</span>
                    <span className="text-[10px] text-gray-500">Shadow</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Center - Yin Yang Portal */}
          <div className="col-span-12 lg:col-span-6 flex flex-col items-center justify-center py-8">
            <YinYangPortal />

            {/* Quick Access Cards */}
            <div className="grid grid-cols-3 gap-3 mt-8 w-full max-w-md">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Link href="/yin/meditation">
                  <div className="bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 rounded-lg p-4 text-center transition-all cursor-pointer group">
                    <Headphones className="w-6 h-6 text-purple-400 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                    <p className="text-xs text-gray-300">Meditate</p>
                  </div>
                </Link>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <Link href="/workshops">
                  <div className="bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 rounded-lg p-4 text-center transition-all cursor-pointer group">
                    <Calendar className="w-6 h-6 text-blue-400 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                    <p className="text-xs text-gray-300">Workshops</p>
                  </div>
                </Link>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <Link href="/community">
                  <div className="bg-green-500/10 hover:bg-green-500/20 border border-green-500/30 rounded-lg p-4 text-center transition-all cursor-pointer group">
                    <MessageCircle className="w-6 h-6 text-green-400 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                    <p className="text-xs text-gray-300">Connect</p>
                  </div>
                </Link>
              </motion.div>
            </div>
          </div>

          {/* Right Column */}
          <div className="col-span-12 lg:col-span-3 space-y-4">
            {/* Community Pulse */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white/[0.03] backdrop-blur-md rounded-xl p-4 border border-white/10"
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-white font-medium">Community Pulse</h3>
                <Users className="w-4 h-4 text-blue-400" />
              </div>
              <div className="space-y-3">
                {communityPulse.map((item, i) => (
                  <div key={i} className="text-sm">
                    <p className="text-gray-300">
                      <span className="text-white font-medium">{item.user}</span>
                      {' '}{item.action}
                    </p>
                    <p className="text-gray-500 text-xs">{item.time}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Upcoming Workshops */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white/[0.03] backdrop-blur-md rounded-xl p-4 border border-white/10"
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-white font-medium">Upcoming</h3>
                <Calendar className="w-4 h-4 text-green-400" />
              </div>
              <div className="space-y-2">
                {upcomingWorkshops.map((workshop, i) => (
                  <div key={i} className="bg-white/5 rounded-lg p-2 hover:bg-white/10 transition-colors cursor-pointer">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-white text-sm font-medium">{workshop.title}</p>
                        <p className="text-gray-400 text-xs">{workshop.date} • {workshop.time}</p>
                      </div>
                      <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded-full">
                        {workshop.spots} spots
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Achievement Grid */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white/[0.03] backdrop-blur-md rounded-xl p-4 border border-white/10"
            >
              <h3 className="text-white font-medium mb-3">Achievements</h3>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { icon: Flame, label: 'Streak', value: `${stats.streak}d`, color: 'text-orange-400' },
                  { icon: Award, label: 'Rank', value: `#${stats.communityRank}`, color: 'text-purple-400' },
                  { icon: BookOpen, label: 'Lessons', value: '23', color: 'text-blue-400' },
                  { icon: Target, label: 'Quests', value: '45', color: 'text-green-400' }
                ].map((stat) => (
                  <div key={stat.label} className="bg-white/5 rounded-lg p-2 text-center hover:bg-white/10 transition-colors">
                    <stat.icon className={`w-4 h-4 ${stat.color} mx-auto mb-1`} />
                    <p className="text-white text-sm font-medium">{stat.value}</p>
                    <p className="text-gray-500 text-xs">{stat.label}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Bottom Quote Section */}
        {currentQuote.text && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="mt-8"
          >
            <div className="bg-white/[0.03] backdrop-blur-md rounded-xl p-6 border border-white/10 text-center">
              <Sparkles className="w-5 h-5 text-amber-400 mx-auto mb-3" />
              <p className="text-gray-300 italic text-lg">
                "{currentQuote.text}"
              </p>
              <p className="text-gray-500 text-sm mt-2">- {currentQuote.author}</p>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}