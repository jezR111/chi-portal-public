// src/features/yin/repositories/xpRepository.ts
// Version: 2.0.0 - Correctly initializes default unlocked paths


// Check if we're on the client side
const isClient = typeof window !== 'undefined';

// ** FIX: Import the master paths data to determine defaults **
import { paths as masterPaths } from '../data/pathsData';

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
  meditation: {
    count: number;
    lastDate: string;
    totalMinutes: number;
  };
  insights: {
    count: number;
    lastDate: string;
    totalCount: number;
  };
  lessons: {
    count: number;
    lastDate: string;
    completedIds: string[];
  };
  journal: {
    count: number;
    lastDate: string;
    totalWords: number;
  };
  movement: {
    count: number;
    lastDate: string;
    totalExercises: number;
  };
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
  lifetimeXP: number; // Total earned ever (before spending)
}

/**
 * Repository handles all XP data persistence
 * This is the ONLY place that touches localStorage for XP
 */
export class XPRepository {
  private readonly STORAGE_KEY = 'yinProgress';
  private readonly LEGACY_KEY = 'yinXPData'; // For migration
  private memoryCache: XPData | null = null; // For SSR

  /**
   * Get all XP data with daily reset logic
   */
  getXPData(): XPData {
    // If we're on server, return default data from cache or create new
    if (!isClient) {
      if (!this.memoryCache) {
        this.memoryCache = this.getDefaultData();
      }
      return this.memoryCache;
    }

    const saved = localStorage.getItem(this.STORAGE_KEY);
    const today = new Date().toDateString();

    if (saved) {
      try {
        const data = JSON.parse(saved) as XPData;

        // Handle daily reset
        if (data.lastUpdated !== today) {
          return this.performDailyReset(data);
        }

        // Ensure all fields exist
        return this.ensureDataIntegrity(data);
      } catch (e) {
        console.error('Failed to parse XP data:', e);
        // Persist a fresh default so future reads are stable
        const def = this.getDefaultData();
        def.lastUpdated = today;
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(def));
        return def;
      }
    }

    // Check for legacy data
    const legacy = localStorage.getItem(this.LEGACY_KEY);
    if (legacy) {
      try {
        return this.migrateLegacyData(JSON.parse(legacy));
      } catch (e) {
        console.error('Failed to migrate legacy data:', e);
      }
    }

    // No saved or legacy: initialize storage with a full default record (one-time)
    const def = this.getDefaultData();
    def.lastUpdated = today;
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(def));
    return def;
  }

  /**
   * Update XP data (partial updates supported)
   */
  updateXPData(updates: Partial<XPData>): void {
    if (!isClient) {
      // On server, update memory cache
      this.memoryCache = {
        ...this.getXPData(),
        ...updates,
        lastUpdated: new Date().toDateString(),
      };
      return;
    }

    const current = this.getXPData();
    const updated = {
      ...current,
      ...updates,
      lastUpdated: new Date().toDateString(),
    };

    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(updated));
  }

  /**
   * Add XP to a specific breakdown category
   */
  addToBreakdown(category: keyof XPBreakdown, amount: number): void {
    const data = this.getXPData();
    data.breakdown[category] = (data.breakdown[category] || 0) + amount;
    this.updateXPData({ breakdown: data.breakdown });
  }

  /**
   * Update activity history
   */
  updateActivityHistory(
    activity: keyof ActivityHistory,
    updates: Partial<ActivityHistory[keyof ActivityHistory]>
  ): void {
    const data = this.getXPData();
    data.activityHistory[activity] = {
      ...data.activityHistory[activity],
      ...updates,
    } as any;
    this.updateXPData({ activityHistory: data.activityHistory });
  }

  /**
   * Add to weekly XP tracking
   */
  updateWeeklyXP(todayXP: number): void {
    const data = this.getXPData();
    const weeklyXP = Array.isArray(data.weeklyXP)
      ? [...data.weeklyXP]
      : new Array(7).fill(0);

    // Don't add if we're updating the same day
    // This prevents double-counting when multiple XP additions happen in one day
    // The daily reset handles moving todayXP to the weekly array
    // This method should only be called during daily reset
    // Regular XP additions should not call this directly

    this.updateXPData({ weeklyXP });
  }

  /**
   * Record unlocked content
   */
  recordUnlock(type: 'paths' | 'chapters' | 'features', id: string): void {
    const data = this.getXPData();
    const unlockedContent = data.unlockedContent || this.getDefaultUnlockedContent();

    if (!unlockedContent[type].includes(id)) {
      unlockedContent[type].push(id);
      this.updateXPData({ unlockedContent });
    }
  }

  /**
   * Remove an unlock (for refunds/releases)
   */
  removeUnlock(type: 'paths' | 'chapters' | 'features', id: string): void {
    const data = this.getXPData();
    const unlockedContent = data.unlockedContent || this.getDefaultUnlockedContent();

    const index = unlockedContent[type].indexOf(id);
    if (index > -1) {
      unlockedContent[type].splice(index, 1);
      this.updateXPData({ unlockedContent });
    }
  }

  /**
   * Check if content is unlocked
   */
  isUnlocked(type: 'paths' | 'chapters' | 'features', id: string): boolean {
    const data = this.getXPData();
    const unlockedContent = data.unlockedContent || this.getDefaultUnlockedContent();
    return unlockedContent[type].includes(id);
  }

  /**
   * Reset all XP data
   */
  reset(): void {
    if (!isClient) {
      this.memoryCache = null;
      return;
    }

    localStorage.removeItem(this.STORAGE_KEY);
    localStorage.removeItem(this.LEGACY_KEY);
  }

  /**
   * Export data for backup
   */
  exportData(): string {
    return JSON.stringify(this.getXPData(), null, 2);
  }

  /**
   * Import data from backup
   */
  importData(jsonString: string): boolean {
    try {
      const data = JSON.parse(jsonString) as XPData;
      // Validate the structure
      if (typeof data.totalXP === 'number' && data.breakdown) {
        if (isClient) {
          localStorage.setItem(this.STORAGE_KEY, jsonString);
        } else {
          this.memoryCache = data;
        }
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }

  // Private helper methods

  private performDailyReset(data: XPData): XPData {
    const today = new Date().toDateString();
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    // Update weekly tracking (ensure array exists)
    const weeklyXP = Array.isArray(data.weeklyXP) ? [...data.weeklyXP] : new Array(7).fill(0);
    weeklyXP.push(data.todayXP);
    if (weeklyXP.length > 7) weeklyXP.shift();

    // Update monthly tracking (ensure array exists)
    const monthlyXP = Array.isArray(data.monthlyXP) ? [...data.monthlyXP] : new Array(30).fill(0);
    monthlyXP.push(data.todayXP);
    if (monthlyXP.length > 30) monthlyXP.shift();

    // Update streak
    const wasYesterday = data.lastUpdated === yesterday.toDateString();
    const streakDays =
      wasYesterday && data.todayXP > 0
        ? data.streakDays + 1
        : data.todayXP > 0
          ? 1
          : 0;

    // Reset daily values
    const resetData = {
      ...data,
      todayXP: 0,
      lastUpdated: today,
      weeklyXP,
      monthlyXP,
      streakDays,
      breakdown: this.getDefaultBreakdown(), // Reset daily breakdown
    };

    // Save the reset
    if (isClient) {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(resetData));
    }

    return resetData;
  }

  private ensureDataIntegrity(data: Partial<XPData>): XPData {
    const defaultData = this.getDefaultData();

    return {
      ...defaultData,
      ...data,
      // Ensure arrays are arrays
      weeklyXP: Array.isArray(data.weeklyXP) ? data.weeklyXP : defaultData.weeklyXP,
      monthlyXP: Array.isArray(data.monthlyXP) ? data.monthlyXP : defaultData.monthlyXP,
      // Ensure objects are objects
      breakdown: { ...defaultData.breakdown, ...(data.breakdown || {}) },
      activityHistory: { ...defaultData.activityHistory, ...(data.activityHistory || {}) },
      unlockedContent: { ...defaultData.unlockedContent, ...(data.unlockedContent || {}) },
    };
  }

  private migrateLegacyData(legacy: any): XPData {
    const data = this.getDefaultData();

    // Map old structure to new
    data.totalXP = legacy.totalXP || 300;
    data.todayXP = legacy.todayXP || 0;
    data.lastUpdated = legacy.lastUpdated || new Date().toDateString();
    data.streakDays = legacy.streakDays || 0;

    // Ensure arrays are properly initialized
    data.weeklyXP = Array.isArray(legacy.weeklyXP) ? legacy.weeklyXP : new Array(7).fill(0);
    data.monthlyXP = Array.isArray(legacy.monthlyXP) ? legacy.monthlyXP : new Array(30).fill(0);

    if (legacy.breakdown) {
      data.breakdown = { ...data.breakdown, ...legacy.breakdown };
    }

    if (legacy.activityHistory) {
      data.activityHistory = { ...data.activityHistory, ...legacy.activityHistory };
    }

    // Save migrated data
    if (isClient) {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));

      // Keep legacy data as backup but renamed
      localStorage.setItem(this.LEGACY_KEY + '_backup', JSON.stringify(legacy));
      localStorage.removeItem(this.LEGACY_KEY);
    }

    return data;
  }

  private getDefaultData(): XPData {
    return {
      totalXP: 300, // Starting XP from config
      todayXP: 0,
      lastUpdated: new Date().toDateString(),
      breakdown: this.getDefaultBreakdown(),
      streakDays: 0,
      weeklyXP: new Array(7).fill(0),
      monthlyXP: new Array(30).fill(0),
      activityHistory: this.getDefaultActivityHistory(),
      unlockedContent: this.getDefaultUnlockedContent(),
      spentXP: 0,
      lifetimeXP: 300,
    };
  }

  private getDefaultBreakdown(): XPBreakdown {
    return {
      quests: 0,
      challenges: 0,
      lessons: 0,
      meditation: 0,
      insights: 0,
      journal: 0,
      movement: 0,
      other: 0,
    };
  }

  private getDefaultActivityHistory(): ActivityHistory {
    return {
      meditation: { count: 0, lastDate: '', totalMinutes: 0 },
      insights: { count: 0, lastDate: '', totalCount: 0 },
      lessons: { count: 0, lastDate: '', completedIds: [] },
      journal: { count: 0, lastDate: '', totalWords: 0 },
      movement: { count: 0, lastDate: '', totalExercises: 0 },
    };
  }

  private getDefaultUnlockedContent() {
    // ** THE FIX IS HERE **
    // Read from the master paths data to determine which paths are unlocked by default.
    // A path is considered unlocked if `isLocked` is not explicitly `true`.
    const defaultUnlockedPaths = masterPaths
      .filter(path => path.isLocked !== true)
      .map(path => path.id);
    
    return {
      paths: defaultUnlockedPaths, // Now correctly populates all default paths
      chapters: [], // Track unlocked chapter IDs
      features: [], // Track unlocked feature IDs
    };
  }
}

// Export singleton instance
export const xpRepository = new XPRepository();
