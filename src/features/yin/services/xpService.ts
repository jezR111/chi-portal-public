import { LEVELS, XP_CONFIG } from '../config/xpConfig';
import { XPActivity, XPResult } from '../types/xp.types';

export interface XPBreakdown {
  quests: number;
  challenges: number;
  lessons: number;
  meditation: number;
  insights: number;
  journal: number;
  other: number;
}

export interface XPData {
  totalXP: number;
  todayXP: number;
  lastUpdated: string;
  breakdown: XPBreakdown;
  streakDays: number;
  weeklyXP: number[];
  levelProgress: {
    currentLevel: number;
    currentLevelXP: number;
    nextLevelXP: number;
  };
  patterns: {
    earned: string[];
    history: Record<string, number>;
  };
  activityHistory: {
    meditation: { count: number; lastDate: string; totalMinutes: number };
    insights: { count: number; lastDate: string; totalCount: number };
    lessons: { count: number; lastDate: string };
    journal: { count: number; lastDate: string; totalWords: number };
  };
}

export type XPSource = 'quests' | 'challenges' | 'lessons' | 'meditation' | 'insights' | 'journal' | 'other';

export class XPService {
  private static instance: XPService;
  private readonly STORAGE_KEY = 'yinXPData';
  
  // Use LEVELS from config
  private readonly LEVEL_THRESHOLDS = LEVELS.map(l => l.minXP);
  
  // Update STREAK_MILESTONES to use config values
  private readonly STREAK_MILESTONES = {
    3: XP_CONFIG.REWARDS.STREAK_3DAY,
    7: XP_CONFIG.REWARDS.STREAK_7DAY,
    14: XP_CONFIG.REWARDS.STREAK_14DAY,
    30: XP_CONFIG.REWARDS.STREAK_30DAY,
    60: 2500,
    90: 5000
  };
  
  private readonly PATTERNS = {
    meditation: {
      "3_in_4": { days: 4, required: 3, xp: 75, name: "3 meditations in 4 days" },
      "5_in_7": { days: 7, required: 5, xp: 150, name: "5 meditations in 7 days" },
      "10_in_14": { days: 14, required: 10, xp: 400, name: "10 meditations in 14 days" },
      "20_in_30": { days: 30, required: 20, xp: 1000, name: "20 meditations in 30 days" }
    },
    insights: {
      "5_single_session": { count: 5, xp: 100, name: "5 insights in single session" },
      "20_weekly": { count: 20, xp: 300, name: "20 insights this week" },
      "50_monthly": { count: 50, xp: 800, name: "50 insights this month" }
    },
    deepDive: {
      "2hr_session": { minutes: 120, xp: 200, name: "2 hour deep session" },
      "5hr_weekly": { minutes: 300, xp: 500, name: "5 hours this week" },
      "20hr_monthly": { minutes: 1200, xp: 2000, name: "20 hours this month" }
    }
  };
  
  static getInstance(): XPService {
    if (!XPService.instance) {
      XPService.instance = new XPService();
    }
    return XPService.instance;
  }
  
  // Get level info based on XP
  getLevelInfo(xp?: number): {
    level: number;
    title: string;
    color: string;
    icon: string;
    minXP: number;
    maxXP: number;
  } {
    const totalXP = xp ?? this.getTotalXP();
    const levelData = LEVELS.find(l => totalXP >= l.minXP && totalXP <= l.maxXP) || LEVELS[0];
    return {
      level: levelData.level,
      title: levelData.title,
      color: levelData.color,
      icon: levelData.icon,
      minXP: levelData.minXP,
      maxXP: levelData.maxXP
    };
  }
  
  // Get level title
  getLevelTitle(xp?: number): string {
    return this.getLevelInfo(xp).title;
  }
  
  // Get level icon
  getLevelIcon(xp?: number): string {
    return this.getLevelInfo(xp).icon;
  }
  
  // Get level color
  getLevelColor(xp?: number): string {
    return this.getLevelInfo(xp).color;
  }
  
  // Get stored XP data with daily reset logic
  getXPData(): XPData {
    const saved = localStorage.getItem(this.STORAGE_KEY);
    const today = new Date().toDateString();
    
    if (saved) {
      const data = JSON.parse(saved);
      
      // Reset daily XP if new day
      if (data.lastUpdated !== today) {
        // Add yesterday's XP to weekly tracking
        const weeklyXP = data.weeklyXP || new Array(7).fill(0);
        weeklyXP.push(data.todayXP || 0);
        if (weeklyXP.length > 7) weeklyXP.shift();
        
        // Update streak
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const wasYesterday = data.lastUpdated === yesterday.toDateString();
        const streakDays = wasYesterday && data.todayXP > 0 ? (data.streakDays || 0) + 1 : 0;
        
        // Reset daily values
        data.todayXP = 0;
        data.lastUpdated = today;
        data.weeklyXP = weeklyXP;
        data.streakDays = streakDays;
        
        // Reset daily breakdown
        const dailyBreakdown = data.breakdown || {};
        Object.keys(dailyBreakdown).forEach(key => {
          if (!data.totalBreakdown) data.totalBreakdown = {};
          data.totalBreakdown[key] = (data.totalBreakdown[key] || 0) + dailyBreakdown[key];
        });
        data.breakdown = this.getDefaultBreakdown();
        
        // Persist the reset
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
      }
      
      // Calculate level progress
      data.levelProgress = this.calculateLevelProgress(data.totalXP);
      
      // Ensure all fields exist
      if (!data.patterns) data.patterns = { earned: [], history: {} };
      if (!data.activityHistory) data.activityHistory = this.getDefaultActivityHistory();
      if (!data.breakdown) data.breakdown = this.getDefaultBreakdown();
      
      return data;
    }
    
    // Default data for new users
    const defaultData: XPData = {
      totalXP: XP_CONFIG.INITIAL_XP,
      todayXP: 0,
      lastUpdated: today,
      breakdown: this.getDefaultBreakdown(),
      streakDays: 0,
      weeklyXP: new Array(7).fill(0),
      levelProgress: this.calculateLevelProgress(XP_CONFIG.INITIAL_XP),
      patterns: { earned: [], history: {} },
      activityHistory: this.getDefaultActivityHistory()
    };
    
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(defaultData));
    return defaultData;
  }
  
  private getDefaultBreakdown(): XPBreakdown {
    return { quests: 0, challenges: 0, lessons: 0, meditation: 0, insights: 0, journal: 0, other: 0 };
  }
  
  private getDefaultActivityHistory() {
    return {
      meditation: { count: 0, lastDate: '', totalMinutes: 0 },
      insights: { count: 0, lastDate: '', totalCount: 0 },
      lessons: { count: 0, lastDate: '' },
      journal: { count: 0, lastDate: '', totalWords: 0 }
    };
  }
  
  // Calculate level progress
  private calculateLevelProgress(totalXP: number): XPData['levelProgress'] {
    const levelInfo = this.getLevelInfo(totalXP);
    const currentLevelData = LEVELS[levelInfo.level - 1];
    const nextLevelData = LEVELS[levelInfo.level] || null;
    
    const currentLevelXP = totalXP - currentLevelData.minXP;
    const nextLevelXP = nextLevelData 
      ? nextLevelData.minXP - currentLevelData.minXP
      : 500; // XP needed for levels beyond max
    
    return { 
      currentLevel: levelInfo.level, 
      currentLevelXP, 
      nextLevelXP 
    };
  }
  
  // Calculate XP for a session using activity data
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
        baseXP += (activity.data.insights?.length || 0) * XP_CONFIG.REWARDS.INSIGHT_BASIC;
        break;
        
      case 'lesson':
        baseXP += XP_CONFIG.REWARDS.LESSON_COMPLETE;
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
    
    // Use config values for meditation XP
    if (minutes >= 30) base = XP_CONFIG.REWARDS.MEDITATION_30MIN;
    else if (minutes >= 20) base = XP_CONFIG.REWARDS.MEDITATION_20MIN;
    else if (minutes >= 10) base = XP_CONFIG.REWARDS.MEDITATION_10MIN;
    else if (minutes >= 5) base = XP_CONFIG.REWARDS.MEDITATION_5MIN;
    else base = Math.floor(Math.log(minutes + 1) * 20);
    
    // Streak bonuses
    const streakDays = this.getXPData().streakDays;
    for (const [days, xp] of Object.entries(this.STREAK_MILESTONES)) {
      if (streakDays >= parseInt(days)) {
        bonus = xp;
      }
    }
    
    return { base, bonus };
  }
  
  private checkPatterns(activity: XPActivity, earnedPatterns: string[]): number {
    let patternBonus = 0;
    const data = this.getXPData();
    
    // Check meditation patterns
    if (activity.type === 'meditation') {
      const recentCount = activity.data.recentMeditations || data.activityHistory.meditation.count;
      
      for (const [key, pattern] of Object.entries(this.PATTERNS.meditation)) {
        if (recentCount >= pattern.required && !data.patterns.history[key]) {
          patternBonus += pattern.xp;
          earnedPatterns.push(pattern.name);
          // Mark pattern as earned
          data.patterns.history[key] = Date.now();
        }
      }
    }
    
    // Check insight patterns
    if (activity.type === 'insight' && activity.data.insights) {
      if (activity.data.insights.length >= 5) {
        const patternKey = '5_single_session';
        if (!data.patterns.history[patternKey]) {
          patternBonus += this.PATTERNS.insights[patternKey].xp;
          earnedPatterns.push(this.PATTERNS.insights[patternKey].name);
          data.patterns.history[patternKey] = Date.now();
        }
      }
    }
    
    // Update patterns in storage if any were earned
    if (earnedPatterns.length > 0) {
      data.patterns.earned.push(...earnedPatterns);
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
    }
    
    return patternBonus;
  }
  
  private calculateMultipliers(activity: XPActivity): number {
    let multiplier = 1;
    const hour = new Date(activity.timestamp).getHours();
    const day = new Date(activity.timestamp).getDay();
    
    // Use config multipliers
    if (hour < 9) multiplier *= XP_CONFIG.MULTIPLIERS.MORNING_PRACTICE;
    else if (hour >= 22) multiplier *= XP_CONFIG.MULTIPLIERS.EVENING_PRACTICE;
    
    if (day === 0 || day === 6) multiplier *= XP_CONFIG.MULTIPLIERS.WEEKEND_WARRIOR;
    
    if (activity.data.isGroupSession) multiplier *= XP_CONFIG.MULTIPLIERS.GROUP_SESSION;
    
    if (activity.data.isFirstTime) multiplier *= XP_CONFIG.MULTIPLIERS.FIRST_TIME;
    
    // Streak multiplier (additional)
    const streakDays = this.getXPData().streakDays;
    if (streakDays >= 30) multiplier *= 1.5;
    else if (streakDays >= 14) multiplier *= 1.3;
    else if (streakDays >= 7) multiplier *= 1.2;
    else if (streakDays >= 3) multiplier *= 1.1;
    
    return multiplier;
  }
  
  // Add XP from activity (combines calculation and storage)
  addActivityXP(activity: XPActivity): XPResult {
    const xpResult = this.calculateSessionXP(activity);
    
    const sourceMap: Record<string, XPSource> = {
      'meditation': 'meditation',
      'insight': 'insights',
      'lesson': 'lessons',
      'journal': 'journal',
      'quest': 'quests',
      'challenge': 'challenges'
    };
    
    const source = sourceMap[activity.type] || 'other';
    
    this.addXP(xpResult.total, source, {
      activity: activity.type,
      patterns: xpResult.breakdown.patterns,
      multiplier: xpResult.breakdown.multiplier
    });
    
    this.updateActivityHistory(activity);
    
    return xpResult;
  }
  
  // Simple XP addition (for backwards compatibility)
  addXP(amount: number, source: XPSource, metadata?: any): void {
    if (amount <= 0) {
      console.warn('Attempted to add non-positive XP amount:', amount);
      return;
    }
    
    const data = this.getXPData();
    const previousLevel = data.levelProgress.currentLevel;
    
    data.totalXP += amount;
    data.todayXP += amount;
    data.breakdown[source] = (data.breakdown[source] || 0) + amount;
    data.lastUpdated = new Date().toDateString();
    
    data.levelProgress = this.calculateLevelProgress(data.totalXP);
    
    const leveledUp = data.levelProgress.currentLevel > previousLevel;
    
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
    
    window.dispatchEvent(new CustomEvent('xpUpdated', {
      detail: { 
        amount,
        source,
        newTotal: data.totalXP,
        todayTotal: data.todayXP,
        breakdown: data.breakdown,
        levelProgress: data.levelProgress,
        leveledUp,
        metadata
      }
    }));
    
    if (leveledUp) {
      const newLevelInfo = this.getLevelInfo(data.totalXP);
      window.dispatchEvent(new CustomEvent('levelUp', {
        detail: {
          newLevel: data.levelProgress.currentLevel,
          previousLevel,
          totalXP: data.totalXP,
          title: newLevelInfo.title,
          icon: newLevelInfo.icon
        }
      }));
    }
  }
  
  private updateActivityHistory(activity: XPActivity): void {
    const data = this.getXPData();
    const today = new Date().toDateString();
    
    switch (activity.type) {
      case 'meditation':
        data.activityHistory.meditation.count++;
        data.activityHistory.meditation.lastDate = today;
        data.activityHistory.meditation.totalMinutes += activity.duration / 60000;
        break;
      case 'insight':
        data.activityHistory.insights.count++;
        data.activityHistory.insights.lastDate = today;
        data.activityHistory.insights.totalCount += activity.data.insights?.length || 0;
        break;
      case 'lesson':
        data.activityHistory.lessons.count++;
        data.activityHistory.lessons.lastDate = today;
        break;
      case 'journal':
        data.activityHistory.journal.count++;
        data.activityHistory.journal.lastDate = today;
        data.activityHistory.journal.totalWords += activity.data.wordCount || 0;
        break;
    }
    
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
  }
  
  // Getter methods
  getTotalXP(): number {
    return this.getXPData().totalXP;
  }
  
  getTodayXP(): number {
    return this.getXPData().todayXP;
  }
  
  getLevel(): number {
    return this.getXPData().levelProgress.currentLevel;
  }
  
  getLevelProgress(): XPData['levelProgress'] {
    return this.getXPData().levelProgress;
  }
  
  getWeeklyXP(): number[] {
    return this.getXPData().weeklyXP;
  }
  
  getStreak(): number {
    return this.getXPData().streakDays;
  }
  
  getBreakdown(): XPBreakdown {
    return this.getXPData().breakdown;
  }
  
  getActivityHistory() {
    return this.getXPData().activityHistory;
  }
  
  getPatterns() {
    return this.getXPData().patterns;
  }
  
  // Spend XP method (for unlocking content)
  spendXP(amount: number, reason: string): boolean {
    const data = this.getXPData();
    if (data.totalXP < amount) {
      return false;
    }
    
    data.totalXP -= amount;
    data.levelProgress = this.calculateLevelProgress(data.totalXP);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
    
    window.dispatchEvent(new CustomEvent('xpSpent', {
      detail: {
        amount,
        reason,
        remainingXP: data.totalXP
      }
    }));
    
    return true;
  }
  
  // Check if user can afford something
  canAfford(cost: number): boolean {
    return this.getTotalXP() >= cost;
  }
  
  // Debug method to set XP directly (for testing)
  setXP(totalXP: number): void {
    if (process.env.NODE_ENV === 'development') {
      const data = this.getXPData();
      data.totalXP = totalXP;
      data.levelProgress = this.calculateLevelProgress(totalXP);
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
      
      window.dispatchEvent(new CustomEvent('xpUpdated', {
        detail: { 
          amount: 0,
          source: 'other',
          newTotal: data.totalXP,
          todayTotal: data.todayXP,
          breakdown: data.breakdown,
          levelProgress: data.levelProgress,
          leveledUp: false
        }
      }));
    }
  }
  
  // Reset all XP data
  reset(): void {
    localStorage.removeItem(this.STORAGE_KEY);
    window.dispatchEvent(new CustomEvent('xpReset'));
  }
}

// Export singleton instance
export const xpService = XPService.getInstance();

// Also export class for type definitions
export default XPService;