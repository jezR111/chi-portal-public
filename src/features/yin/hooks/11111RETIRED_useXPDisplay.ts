import { useEffect, useState } from 'react';
import { xpService, type XPData } from '../xp/xpService';

export const useXPDisplay = () => {
  const [xpData, setXPData] = useState<XPData>(() => xpService.getXPData());
  const [totalXP, setTotalXP] = useState(() => xpService.getTotalXP());
  const [todayXP, setTodayXP] = useState(() => xpService.getTodayXP());
  const [level, setLevel] = useState(() => xpService.getLevel());
  const [levelProgress, setLevelProgress] = useState(() => xpService.getLevelProgress());

  useEffect(() => {
    const handleXPUpdate = (e: Event) => {
      const event = e as CustomEvent;
      const data = xpService.getXPData();
      setXPData(data);
      setTotalXP(event.detail.newTotal);
      setTodayXP(event.detail.todayTotal);
      setLevel(event.detail.levelProgress.currentLevel);
      setLevelProgress(event.detail.levelProgress);
    };
    
    const handleLevelUp = (e: Event) => {
      const event = e as CustomEvent;
      // You can trigger a celebration animation here
      console.log(`🎉 Level Up! Now level ${event.detail.newLevel}`);
    };
    
    const handleReset = () => {
      const data = xpService.getXPData();
      setXPData(data);
      setTotalXP(data.totalXP);
      setTodayXP(data.todayXP);
      setLevel(data.levelProgress.currentLevel);
      setLevelProgress(data.levelProgress);
    };
    
    window.addEventListener('xpUpdated', handleXPUpdate);
    window.addEventListener('levelUp', handleLevelUp);
    window.addEventListener('xpReset', handleReset);
    
    return () => {
      window.removeEventListener('xpUpdated', handleXPUpdate);
      window.removeEventListener('levelUp', handleLevelUp);
      window.removeEventListener('xpReset', handleReset);
    };
  }, []);
  
  return {
    xpData,
    totalXP,
    todayXP,
    level,
    levelProgress,
    breakdown: xpData.breakdown,
    weeklyXP: xpData.weeklyXP,
    streak: xpData.streakDays,
    levelPercentage: Math.round((levelProgress.currentLevelXP / levelProgress.nextLevelXP) * 100)
  };
};