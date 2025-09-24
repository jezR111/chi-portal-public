import { calculateLevel, calculateProgress } from '@/features/yin/config/levelConfig';
import { Coins, TrendingUp, Trophy } from 'lucide-react';
import { useEffect, useState } from 'react';

export function UserStats() {
  const [stats, setStats] = useState({
    xp: 0,
    tokens: 100,
    streak: 0,
    level: 1,
    title: 'Seeker'
  });

  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Load initial stats
    loadStats();

    // Listen for updates
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'userProgress') {
        loadStats();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const loadStats = () => {
    const saved = localStorage.getItem('userProgress');
    if (saved) {
      const data = JSON.parse(saved);
      const level = calculateLevel(data.xp || 0);
      const prog = calculateProgress(data.xp || 0);
      
      setStats({
        xp: data.xp || 0,
        tokens: data.tokens || 100,
        streak: data.streak || 0,
        level: level.level,
        title: level.title
      });
      setProgress(prog);
    }
  };

  return (
    <div className="space-y-3">
      {/* Level & XP */}
      <div className="bg-purple-950/40 rounded-lg p-3 border border-purple-500/20">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4 text-purple-400" />
            <span className="text-purple-100 font-medium text-sm">
              {stats.title}
            </span>
          </div>
          <span className="text-purple-300 text-xs">
            Level {stats.level}
          </span>
        </div>
        <div className="space-y-1">
          <div className="flex justify-between text-xs">
            <span className="text-purple-400">{stats.xp} XP</span>
            <span className="text-purple-400">{progress}%</span>
          </div>
          <div className="w-full bg-purple-950/60 rounded-full h-1.5 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-purple-500 to-purple-400 transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Wisdom Tokens */}
      <div className="bg-amber-950/40 rounded-lg p-3 border border-amber-500/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Coins className="w-4 h-4 text-amber-400" />
            <span className="text-amber-100 font-medium text-sm">
              Wisdom Tokens
            </span>
          </div>
          <span className="text-amber-300 font-bold">
            {stats.tokens} ✧
          </span>
        </div>
      </div>

      {/* Streak */}
      {stats.streak > 0 && (
        <div className="bg-green-950/40 rounded-lg p-3 border border-green-500/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-green-400" />
              <span className="text-green-100 font-medium text-sm">
                Streak
              </span>
            </div>
            <span className="text-green-300 font-bold">
              {stats.streak} 🔥
            </span>
          </div>
        </div>
      )}
    </div>
  );
}