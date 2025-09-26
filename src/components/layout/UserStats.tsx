import { calculateLevel } from '@/features/yin/config/xpConfig';
import { useXPDisplay } from '@/features/yin/hooks/useXPDisplay';
import { Coins, TrendingUp } from 'lucide-react';
import React, { useEffect, useState } from 'react';

export const UserStats: React.FC = () => {
  const { 
    totalXP, 
    todayXP, 
    level, 
    levelProgress, 
    levelPercentage,
    streak
  } = useXPDisplay();
  
  const [tokens, setTokens] = useState(100);
  
  // Get level data including title and icon
  const levelData = calculateLevel(totalXP);

  useEffect(() => {
    // Load tokens from localStorage
    const savedTokens = localStorage.getItem('wisdomTokens');
    if (savedTokens) {
      setTokens(parseInt(savedTokens));
    }
  }, []);

  return (
    <div className="space-y-3">
      {/* Level & XP */}
      <div className="bg-purple-950/40 rounded-lg p-3 border border-purple-500/20">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="text-xl">{levelData.icon}</span>
            <span className="text-purple-100 font-medium text-sm">
              {levelData.title}
            </span>
          </div>
          <span className="text-purple-300 text-xs">
            Level {level}
          </span>
        </div>
        <div className="space-y-1">
          <div className="flex justify-between text-xs">
            <span className="text-purple-400">{totalXP} XP</span>
            <span className="text-purple-400">{levelPercentage}%</span>
          </div>
          <div className="w-full bg-purple-950/60 rounded-full h-1.5 overflow-hidden">
            <div 
              className={`h-full bg-gradient-to-r ${levelData.color} transition-all duration-500`}
              style={{ width: `${levelPercentage}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-purple-400/70">
            <span>{levelProgress.currentLevelXP} / {levelProgress.nextLevelXP}</span>
            <span>Today: +{todayXP}</span>
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
            {tokens} ✧
          </span>
        </div>
      </div>

      {/* Streak */}
      {streak > 0 && (
        <div className="bg-green-950/40 rounded-lg p-3 border border-green-500/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-green-400" />
              <span className="text-green-100 font-medium text-sm">
                Streak
              </span>
            </div>
            <span className="text-green-300 font-bold">
              {streak} 🔥
            </span>
          </div>
        </div>
      )}
    </div>
  );
};