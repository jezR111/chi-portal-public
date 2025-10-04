// src/features/yin/repositories/xpRepository.ts
// Version: 4.0.0 - Final, self-healing data sanitization to prevent corruption

// Check if we're on the client side
const isClient = typeof window !== 'undefined';

import { paths } from '../data/pathsData';

export interface XPBreakdown {
  quests: number;
  challenges: number;
  lessons: number;
  meditation: number;
  insights: number;
  journal: number;
  movement: number;
  other: number;
}

export interface ActivityHistory {
  meditation: { count: number; lastDate: string; totalMinutes: number; };
  insights: { count: number; lastDate: string; totalCount: number; };
  lessons: { count: number; lastDate: string; completedIds: string[]; };
  journal: { count: number; lastDate: string; totalWords: number; };
  movement: { count: number; lastDate: string; totalExercises: number; };
}

export interface XPData {
  totalXP: number;
  todayXP: number;
  lastUpdated: string;
  breakdown: XPBreakdown;
  streakDays: number;
  weeklyXP: number[];
  monthlyXP: number[];
  activityHistory: ActivityHistory;
  unlockedContent: {
    paths: string[];
    chapters: string[];
    features: string[];
  };
  spentXP: number;
  lifetimeXP: number;
}

// ** NEW: Self-healing data sanitizer **
function sanitizeData(data: any): XPData {
    const defaultData = xpRepository.getDefaultData();
    const sanitized = { ...defaultData, ...data };

    const numericFields: (keyof XPData)[] = ['totalXP', 'todayXP', 'streakDays', 'spentXP', 'lifetimeXP'];

    for (const field of numericFields) {
        if (typeof sanitized[field] !== 'number' || isNaN(sanitized[field])) {
            console.error(
                `[XPRepository] Data corruption detected in field: '${field}'. ` +
                `Value was: '${sanitized[field]}'. Resetting to 0.`
            );
            sanitized[field] = 0; // A safe, non-breaking fallback
        }
    }
    
    if (sanitized.breakdown) {
        for (const key in sanitized.breakdown) {
            if(typeof sanitized.breakdown[key as keyof XPBreakdown] !== 'number' || isNaN(sanitized.breakdown[key as keyof XPBreakdown])) {
                sanitized.breakdown[key as keyof XPBreakdown] = 0;
            }
        }
    }

    return sanitized as XPData;
}

export class XPRepository {
  private readonly STORAGE_KEY = 'yinProgress';
  private readonly LEGACY_KEY = 'yinXPData';
  private memoryCache: XPData | null = null;

  getXPData(): XPData {
    if (!isClient) {
      if (!this.memoryCache) {
        this.memoryCache = this.getDefaultData();
      }
      return this.memoryCache;
    }

    const saved = localStorage.getItem(this.STORAGE_KEY);
    
    if (!saved) {
        const def = this.getDefaultData();
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(def));
        return def;
    }

    let data;
    try {
        data = JSON.parse(saved);
    } catch (e) {
        console.error(
            `[XPRepository] CRITICAL: Failed to parse localStorage JSON, indicating severe data corruption. ` +
            `The corrupted data will be overwritten with a clean default state to ensure app stability.`,
            { error: e, corruptedData: saved }
        );
        // Overwrite the bad data with a clean slate to prevent this error from recurring.
        const def = this.getDefaultData();
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(def));
        return def;
    }
    
    const sanitized = sanitizeData(data);
    const today = new Date().toDateString();

    if (sanitized.lastUpdated !== today) {
      return this.performDailyReset(sanitized);
    }

    return sanitized;
  }

  updateXPData(updates: Partial<XPData>): void {
    if (!isClient) {
      this.memoryCache = { ...this.getXPData(), ...updates, lastUpdated: new Date().toDateString() };
      return;
    }
    const current = this.getXPData();
    const updated = { ...current, ...updates, lastUpdated: new Date().toDateString() };
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(updated));
  }

  // ... other methods like addToBreakdown, recordUnlock etc. remain the same ...
  addToBreakdown(category: keyof XPBreakdown, amount: number): void {
    const data = this.getXPData();
    data.breakdown[category] = (data.breakdown[category] || 0) + amount;
    this.updateXPData({ breakdown: data.breakdown });
  }

  recordUnlock(type: 'paths' | 'chapters' | 'features', id: string): void {
    const data = this.getXPData();
    const unlockedContent = data.unlockedContent || this.getDefaultUnlockedContent();
    if (!unlockedContent[type].includes(id)) {
      unlockedContent[type].push(id);
      this.updateXPData({ unlockedContent });
    }
  }

  isUnlocked(type: 'paths' | 'chapters' | 'features', id: string): boolean {
    const data = this.getXPData();
    return data.unlockedContent[type].includes(id);
  }

  reset(): void {
    if (!isClient) {
      this.memoryCache = null;
      return;
    }
    localStorage.removeItem(this.STORAGE_KEY);
  }

  private performDailyReset(data: XPData): XPData {
    const today = new Date().toDateString();
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    const weeklyXP = [...(data.weeklyXP || [])];
    weeklyXP.push(data.todayXP);
    if (weeklyXP.length > 7) weeklyXP.shift();

    const wasYesterday = data.lastUpdated === yesterday.toDateString();
    const streakDays = wasYesterday && data.todayXP > 0 ? data.streakDays + 1 : (data.todayXP > 0 ? 1 : 0);

    const resetData = {
      ...data,
      todayXP: 0,
      lastUpdated: today,
      weeklyXP,
      streakDays,
    };
    
    if (isClient) {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(resetData));
    }
    return resetData;
  }
  
  // Public for sanitizer access
  getDefaultData(): XPData {
    const defaultUnlockedPaths = paths
      .filter(p => !p.isLocked)
      .map(p => p.id);
      
    return {
      totalXP: 300,
      todayXP: 0,
      lastUpdated: new Date().toDateString(),
      breakdown: { quests: 0, challenges: 0, lessons: 0, meditation: 0, insights: 0, journal: 0, movement: 0, other: 0 },
      streakDays: 0,
      weeklyXP: new Array(7).fill(0),
      monthlyXP: new Array(30).fill(0),
      activityHistory: {
        meditation: { count: 0, lastDate: '', totalMinutes: 0 },
        insights: { count: 0, lastDate: '', totalCount: 0 },
        lessons: { count: 0, lastDate: '', completedIds: [] },
        journal: { count: 0, lastDate: '', totalWords: 0 },
        movement: { count: 0, lastDate: '', totalExercises: 0 },
      },
      unlockedContent: {
        paths: defaultUnlockedPaths,
        chapters: [],
        features: [],
      },
      spentXP: 0,
      lifetimeXP: 300,
    };
  }
}

export const xpRepository = new XPRepository();

