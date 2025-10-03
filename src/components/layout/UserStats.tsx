// src/components/layout/UserStats.tsx
// Version: 2.0 - Using centralized XP system

import { useXP } from '@/features/yin/xp/useXP';
import { Coins, TrendingUp } from 'lucide-react';
import React, { useEffect, useState } from 'react';

export const UserStats: React.FC = () => {
  const { 
    currentXP,
    todayXP,
    level,
    levelTitle,
    levelProgress,
    xpToNextLevel,
    streak,
    levelColor,
    levelIcon
  } = useXP();
  
  const [tokens, setTokens] = useState(100);
  
  useEffect(() => {
    // Load tokens from localStorage
    const savedTokens = localStorage.getItem('wisdomTokens');
    if (savedTokens) {
      setTokens(parseInt(savedTokens));
    }
  }, []);

  // Calculate percentage for progress bar
  const progressPercent = Math.min(100, Math.floor((levelProgress / (levelProgress + xpToNextLevel)) * 100));

  return (
    <div className="space-y-3">
      {/* Level & XP */}
      <div className="bg-purple-950/40 rounded-lg p-3 border border-purple-500/20">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="text-xl">{levelIcon}</span>
            <span className="text-purple-100 font-medium text-sm">
              {levelTitle}
            </span>
          </div>
          <span className="text-purple-300 text-xs">
            Level {level}
          </span>
        </div>
        <div className="space-y-1">
          <div className="flex justify-between text-xs">
            <span className="text-purple-400">{currentXP} XP</span>
            <span className="text-purple-400">{progressPercent}%</span>
          </div>
          <div className="w-full bg-purple-950/60 rounded-full h-1.5 overflow-hidden">
            <div 
              className={`h-full bg-gradient-to-r ${levelColor} transition-all duration-500`}
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-purple-400/70">
            <span>{xpToNextLevel} to next level</span>
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

      {/* XP Debug Info (remove in production) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="text-xs text-gray-500 p-2 bg-gray-800 rounded">
          <div>Current: {currentXP}</div>
          <div>Today: {todayXP}</div>
          <div>Level: {level}</div>
          <div>Progress: {levelProgress}</div>
          <div>To Next: {xpToNextLevel}</div>
        </div>
      )}
    </div>
  );
};