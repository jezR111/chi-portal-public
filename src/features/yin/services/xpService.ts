// src/features/yin/services/xpService.ts

import { XPActivity, XPResult } from '../types/xp.types';

export class XPService {
  private static instance: XPService;
  
  private readonly STREAK_MILESTONES = {
    3: 50,
    7: 150,
    14: 350,
    21: 600,
    30: 1000,
    60: 2500,
    90: 5000
  };
  
  private readonly PATTERNS = {
    meditation: {
      "3_in_4": { days: 4, required: 3, xp: 75 },
      "5_in_7": { days: 7, required: 5, xp: 150 },
      "10_in_14": { days: 14, required: 10, xp: 400 },
      "20_in_30": { days: 30, required: 20, xp: 1000 }
    },
    insights: {
      "5_single_session": { count: 5, xp: 100 },
      "20_weekly": { count: 20, xp: 300 },
      "50_monthly": { count: 50, xp: 800 }
    },
    deepDive: {
      "2hr_session": { minutes: 120, xp: 200 },
      "5hr_weekly": { minutes: 300, xp: 500 },
      "20hr_monthly": { minutes: 1200, xp: 2000 }
    }
  };
  
  static getInstance(): XPService {
    if (!XPService.instance) {
      XPService.instance = new XPService();
    }
    return XPService.instance;
  }
  
  calculateSessionXP(activity: XPActivity): XPResult {
    let baseXP = 5;
    let bonusXP = 0;
    let multiplier = 1;
    const earnedPatterns: string[] = [];
    
    // Calculate activity-specific XP
    switch (activity.type) {
      case 'meditation':
        const medResult = this.calculateMeditationXP(activity);
        baseXP += medResult.base;
        bonusXP += medResult.bonus;
        break;
        
      case 'insight':
        baseXP += activity.data.insights?.length || 0 * 15;
        break;
        
      case 'lesson':
        baseXP += 10;
        if (activity.data.comprehensionRating && activity.data.comprehensionRating >= 4) {
          bonusXP += (activity.data.comprehensionRating - 3) * 25;
        }
        break;
        
      case 'journal':
        const wordCount = activity.data.wordCount || 0;
        if (wordCount >= 1000) bonusXP += 200;
        else if (wordCount >= 500) bonusXP += 75;
        else if (wordCount >= 100) bonusXP += 20;
        break;
    }
    
    // Check for patterns
    const patternBonus = this.checkPatterns(activity, earnedPatterns);
    bonusXP += patternBonus;
    
    // Apply multipliers
    multiplier = this.calculateMultipliers(activity);
    
    const totalXP = Math.floor((baseXP + bonusXP) * multiplier);
    
    return {
      total: totalXP,
      breakdown: {
        base: baseXP,
        bonus: bonusXP,
        multiplier,
        patterns: earnedPatterns
      }
    };
  }
  
  private calculateMeditationXP(activity: XPActivity): { base: number; bonus: number } {
    const minutes = activity.duration / 60000;
    let base = 0;
    let bonus = 0;
    
    // First time bonus
    if (activity.data.isFirstTime) {
      bonus += 10;
    }
    
    // Duration-based rewards (non-linear)
    if (minutes >= 30) base = 150;
    else if (minutes >= 20) base = 75;
    else if (minutes >= 10) base = 25;
    else base = Math.floor(Math.log(minutes + 1) * 20);
    
    // Streak bonuses
    const streakDays = activity.data.streakDays || 0;
    for (const [days, xp] of Object.entries(this.STREAK_MILESTONES)) {
      if (streakDays >= parseInt(days)) {
        bonus = xp;
      }
    }
    
    return { base, bonus };
  }
  
  private checkPatterns(activity: XPActivity, earnedPatterns: string[]): number {
    let patternBonus = 0;
    
    // This would check against user's history in database
    // Simplified for example
    if (activity.type === 'meditation') {
      const recentCount = activity.data.recentMeditations || 0;
      if (recentCount >= 5) {
        patternBonus += this.PATTERNS.meditation["5_in_7"].xp;
        earnedPatterns.push("5 meditations in 7 days");
      }
    }
    
    if (activity.type === 'insight' && activity.data.insights) {
      if (activity.data.insights.length >= 5) {
        patternBonus += this.PATTERNS.insights["5_single_session"].xp;
        earnedPatterns.push("5 insights in single session");
      }
    }
    
    return patternBonus;
  }
  
  private calculateMultipliers(activity: XPActivity): number {
    let multiplier = 1;
    const hour = new Date(activity.timestamp).getHours();
    const day = new Date(activity.timestamp).getDay();
    
    // Morning practice bonus
    if (hour < 9) multiplier *= 1.5;
    // Late night sage bonus
    else if (hour >= 22) multiplier *= 1.2;
    
    // Weekend warrior bonus
    if (day === 0 || day === 6) multiplier *= 1.3;
    
    // Group practice bonus (if implemented)
    if (activity.data.isGroupSession) multiplier *= 1.4;
    
    return multiplier;
  }
}

export default XPService;