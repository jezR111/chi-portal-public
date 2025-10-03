// src/features/yin/services/xpService.ts

import {
  challengeXPCalculator,
  chapterXPCalculator,
  insightXPCalculator,
  journalXPCalculator,
  meditationXPCalculator,
  movementXPCalculator,
  questXPCalculator,
  type BaseModifiers,
  type XPCalculationResult
} from './XpCalculator-index';
import { calculateLevel, calculateProgress, xpToNextLevel } from './xpConfig';
import {
  xpRepository,
  type XPBreakdown
} from './xpRepository';

/**
 * User-facing stats interface
 */
export interface UserStats {
  // Current state
  level: number;
  levelTitle: string;
  levelIcon: string;
  levelColor: string;
  currentXP: number;
  todayXP: number;
  
  // Progress
  levelProgress: number; // percentage
  xpToNextLevel: number;
  
  // Streaks & patterns
  streak: number;
  weeklyXP: number[];
  monthlyAverage: number;
  
  // Breakdown
  breakdown: XPBreakdown;
  
  // Achievements
  totalUnlocked: {
    paths: number;
    chapters: number;
    features: number;
  };
}

/**
 * XP transaction record for history
 */
export interface XPTransaction {
  timestamp: number;
  amount: number;
  source: keyof XPBreakdown;
  description: string;
  calculation?: XPCalculationResult;
}

/**
 * Main XP Service - Orchestrates all XP operations
 */
export class XPService {
  private static instance: XPService;
  private listeners: Set<(stats: UserStats) => void> = new Set();
  private transactionHistory: XPTransaction[] = [];
  private isClient: boolean = typeof window !== 'undefined';
  private cachedStats: UserStats | null = null;
  
  private constructor() {
    // Initialize cached stats immediately
    this.cachedStats = this.getUserStats();
    // Only access localStorage on client side
    if (this.isClient) {
      const saved = localStorage.getItem('xpTransactionHistory');
      if (saved) {
        try {
          this.transactionHistory = JSON.parse(saved);
        } catch (e) {
          console.error('Failed to parse transaction history:', e);
          this.transactionHistory = [];
        }
      }
    }
  }
  
  static getInstance(): XPService {
    if (!XPService.instance) {
      XPService.instance = new XPService();
    }
    return XPService.instance;
  }
  
  /**
   * Get current user stats (read-only view for UI)
   */
  getUserStats(): UserStats {
    // If we have cached stats, use them and update with latest data
    if (this.cachedStats) {
      const data = xpRepository.getXPData();
      const levelInfo = calculateLevel(data.totalXP);
      this.cachedStats = {
        level: levelInfo.level,
        levelTitle: levelInfo.title,
        levelIcon: levelInfo.icon,
        levelColor: levelInfo.color,
        currentXP: data.totalXP,
        todayXP: data.todayXP,
        levelProgress: calculateProgress(data.totalXP),
        xpToNextLevel: xpToNextLevel(data.totalXP),
        streak: data.streakDays,
        weeklyXP: data.weeklyXP || [],
        monthlyAverage: this.calculateMonthlyAverage(data.monthlyXP || []),
        breakdown: data.breakdown,
        totalUnlocked: {
          paths: Array.isArray(data.unlockedContent?.paths) ? data.unlockedContent.paths.length : 0,
          chapters: Array.isArray(data.unlockedContent?.chapters) ? data.unlockedContent.chapters.length : 0,
          features: Array.isArray(data.unlockedContent?.features) ? data.unlockedContent.features.length : 0
        }
      };
      return this.cachedStats;
    }
    // Original getUserStats logic...
    const data = xpRepository.getXPData();
    const levelInfo = calculateLevel(data.totalXP);
    const unlockedContent = data.unlockedContent || {
      paths: [],
      chapters: [],
      features: []
    };
    const stats = {
      level: levelInfo.level,
      levelTitle: levelInfo.title,
      levelIcon: levelInfo.icon,
      levelColor: levelInfo.color,
      currentXP: data.totalXP,
      todayXP: data.todayXP,
      levelProgress: calculateProgress(data.totalXP),
      xpToNextLevel: xpToNextLevel(data.totalXP),
      streak: data.streakDays,
      weeklyXP: data.weeklyXP || [],
      monthlyAverage: this.calculateMonthlyAverage(data.monthlyXP || []),
      breakdown: data.breakdown,
      totalUnlocked: {
        paths: Array.isArray(unlockedContent.paths) ? unlockedContent.paths.length : 0,
        chapters: Array.isArray(unlockedContent.chapters) ? unlockedContent.chapters.length : 0,
        features: Array.isArray(unlockedContent.features) ? unlockedContent.features.length : 0
      }
    };
    this.cachedStats = stats;
    return stats;
  }
  
  /**
   * Subscribe to XP updates
   */
  subscribe(listener: (stats: UserStats) => void): () => void {
    this.listeners.add(listener);
    // Return unsubscribe function
    return () => this.listeners.delete(listener);
  }
  
  /**
   * Notify all listeners of updates
   */
  private notifyListeners(): void {
    const stats = this.getUserStats();
    this.cachedStats = stats; // Update cache
    this.listeners.forEach(listener => listener(stats));
    // Emit custom events for backward compatibility (only on client)
    if (this.isClient) {
      window.dispatchEvent(new CustomEvent('xpUpdated', {
        detail: { stats, timestamp: Date.now() }
      }));
    }
  }
  
  // ========== MAIN XP OPERATIONS ==========
  
  /**
   * Add XP from completing a lesson
   */
  addLessonXP(
    lessonId: string,
    completionTime: number,
    comprehensionScore?: number
  ): XPCalculationResult {
    const modifiers = this.getCurrentModifiers();
    const result = chapterXPCalculator.calculateLessonXP(
      lessonId,
      completionTime,
      comprehensionScore,
      modifiers
    );
    
    this.processXPTransaction(result.total, 'lessons', `Completed lesson: ${lessonId}`, result);
    
    // Update activity history
    const today = new Date().toDateString();
    const history = xpRepository.getXPData().activityHistory.lessons;
    xpRepository.updateActivityHistory('lessons', {
      count: history.count + 1,
      lastDate: today,
      completedIds: [...history.completedIds, lessonId]
    });
    
    return result;
  }
  
  /**
   * Add XP from completing a chapter
   */
  addChapterXP(
    chapterId: string,
    lessonsCompleted: number,
    perfectCompletion: boolean
  ): XPCalculationResult {
    const modifiers = this.getCurrentModifiers();
    const result = chapterXPCalculator.calculateChapterCompleteXP(
      chapterId,
      lessonsCompleted,
      perfectCompletion,
      modifiers
    );
    
    this.processXPTransaction(result.total, 'lessons', `Completed chapter: ${chapterId}`, result);
    
    return result;
  }
  
  /**
   * Add XP from completing a quest
   */
  addQuestXP(
    questType: 'daily' | 'weekly' | 'special',
    questId: string,
    completionData?: {
      timeSpent?: number;
      quality?: number;
      firstTime?: boolean;
    }
  ): XPCalculationResult {
    const modifiers = this.getCurrentModifiers();
    const result = questXPCalculator.calculateQuestXP(
      questType,
      questId,
      completionData,
      modifiers
    );
    
    this.processXPTransaction(result.total, 'quests', `Completed ${questType} quest: ${questId}`, result);
    
    return result;
  }
  
  /**
   * Add XP from meditation
   */
  addMeditationXP(
    duration: number,
    type: 'guided' | 'silent' | 'breathwork' = 'guided'
  ): XPCalculationResult {
    const modifiers = this.getCurrentModifiers();
    const result = meditationXPCalculator.calculateMeditationXP(duration, type, modifiers);
    
    this.processXPTransaction(result.total, 'meditation', `${duration} minute ${type} meditation`, result);
    
    // Update activity history
    const today = new Date().toDateString();
    const history = xpRepository.getXPData().activityHistory.meditation;
    xpRepository.updateActivityHistory('meditation', {
      count: history.count + 1,
      lastDate: today,
      totalMinutes: history.totalMinutes + duration
    });
    
    return result;
  }
  
  /**
   * Add XP from movement/exercise
   */
  addMovementXP(
    exercises: string[],
    duration: number,
    intensity: 'low' | 'medium' | 'high' = 'medium'
  ): XPCalculationResult {
    const modifiers = this.getCurrentModifiers();
    const result = movementXPCalculator.calculateMovementXP(
      exercises,
      duration,
      intensity,
      modifiers
    );
    
    this.processXPTransaction(result.total, 'movement', `${exercises.length} exercises completed`, result);
    
    // Update activity history
    const today = new Date().toDateString();
    const history = xpRepository.getXPData().activityHistory.movement;
    xpRepository.updateActivityHistory('movement', {
      count: history.count + 1,
      lastDate: today,
      totalExercises: history.totalExercises + exercises.length
    });
    
    return result;
  }
  
  /**
   * Add XP from insights
   */
  addInsightXP(
    insights: Array<{
      text: string;
      tags?: string[];
      isBreakthrough?: boolean;
    }>
  ): XPCalculationResult {
    const modifiers = this.getCurrentModifiers();
    const result = insightXPCalculator.calculateInsightXP(insights, modifiers);
    
    this.processXPTransaction(result.total, 'insights', `Captured ${insights.length} insights`, result);
    
    // Update activity history
    const today = new Date().toDateString();
    const history = xpRepository.getXPData().activityHistory.insights;
    xpRepository.updateActivityHistory('insights', {
      count: history.count + 1,
      lastDate: today,
      totalCount: history.totalCount + insights.length
    });
    
    return result;
  }
  
  /**
   * Add XP from journaling
   */
  addJournalXP(
    wordCount: number,
    mood?: string,
    includesReflection?: boolean
  ): XPCalculationResult {
    const modifiers = this.getCurrentModifiers();
    const result = journalXPCalculator.calculateJournalXP(
      wordCount,
      mood,
      includesReflection,
      modifiers
    );
    
    this.processXPTransaction(result.total, 'journal', `Journal entry: ${wordCount} words`, result);
    
    // Update activity history
    const today = new Date().toDateString();
    const history = xpRepository.getXPData().activityHistory.journal;
    xpRepository.updateActivityHistory('journal', {
      count: history.count + 1,
      lastDate: today,
      totalWords: history.totalWords + wordCount
    });
    
    return result;
  }
  
  /**
   * Add XP from challenge completion
   */
  addChallengeXP(
    tier: number,
    challengeId: string,
    daysToComplete: number,
    perfectCompletion?: boolean
  ): XPCalculationResult {
    const modifiers = this.getCurrentModifiers();
    const result = challengeXPCalculator.calculateChallengeXP(
      tier,
      daysToComplete,
      perfectCompletion,
      modifiers
    );
    
    this.processXPTransaction(result.total, 'challenges', `Completed tier ${tier} challenge`, result);
    
    return result;
  }
  
  /**
   * Simple XP addition (for backward compatibility or custom amounts)
   */
  addXP(amount: number, source: keyof XPBreakdown, description?: string): void {
    if (amount <= 0) {
      console.warn('Attempted to add non-positive XP:', amount);
      return;
    }
    
    this.processXPTransaction(amount, source, description || `Added ${amount} XP`);
  }
  
  // ========== XP SPENDING ==========
  
  /**
   * Spend XP to unlock content
   */
  spendXP(amount: number, unlockType: 'path' | 'chapter' | 'feature', unlockId: string): boolean {
    const data = xpRepository.getXPData();
    console.log('Before spending:', { currentXP: data.totalXP, spending: amount }); // Debug log

    // Check if user has enough XP
    if (data.totalXP < amount) {
      console.warn(`Insufficient XP. Need ${amount}, have ${data.totalXP}`);
      return false;
    }

    // Check if already unlocked (skip for activation features)
    if (!unlockId.startsWith('activate-') && xpRepository.isUnlocked(unlockType + 's' as any, unlockId)) {
      console.warn(`Already unlocked: ${unlockType} ${unlockId}`);
      return false;
    }

    // Process the transaction - THIS SHOULD SUBTRACT
    const newTotalXP = data.totalXP - amount; // Explicitly calculate
    xpRepository.updateXPData({
      totalXP: newTotalXP, // Use the calculated value
      spentXP: (data.spentXP || 0) + amount
    });
    console.log('After spending:', { newTotalXP }); // Debug log

    // Record the unlock (skip for activation features)
    if (!unlockId.startsWith('activate-')) {
      xpRepository.recordUnlock(unlockType + 's' as any, unlockId);
    }

    // Log transaction with NEGATIVE amount to show spending
    this.recordTransaction({
      timestamp: Date.now(),
      amount: -amount, // Negative to show it's spent
      source: 'other',
      description: `Unlocked ${unlockType}: ${unlockId}`
    });

    // Notify listeners
    this.notifyListeners();

    // Emit event (only on client)
    if (this.isClient) {
      window.dispatchEvent(new CustomEvent('xpSpent', {
        detail: { amount, unlockType, unlockId, remainingXP: newTotalXP }
      }));
    }

    return true;
  }
  
  /**
   * Release/refund an unlock (e.g., releasing a path for partial XP refund)
   */
  releaseUnlock(unlockType: 'path' | 'chapter' | 'feature', unlockId: string, refundAmount: number): boolean {
    // Check if it's actually unlocked
    if (!xpRepository.isUnlocked(unlockType + 's' as any, unlockId)) {
      console.warn(`Cannot release ${unlockType} ${unlockId} - not currently unlocked`);
      return false;
    }
    
    // Remove the unlock
    xpRepository.removeUnlock(unlockType + 's' as any, unlockId);
    
    // Add the refund XP
    this.processXPTransaction(refundAmount, 'other', `Refund from releasing ${unlockType}: ${unlockId}`);
    
    // Emit event (only on client)
    if (this.isClient) {
      window.dispatchEvent(new CustomEvent('unlockReleased', {
        detail: { unlockType, unlockId, refundAmount }
      }));
    }
    
    return true;
  }
  
  /**
   * Check if user can afford something
   */
  canAfford(cost: number): boolean {
    return xpRepository.getXPData().totalXP >= cost;
  }
  
  /**
   * Check if content is unlocked
   */
  isUnlocked(type: 'paths' | 'chapters' | 'features', id: string): boolean {
    return xpRepository.isUnlocked(type, id);
  }
  
  // ========== PRIVATE HELPERS ==========
  
  /**
   * Process an XP transaction
   */
  private processXPTransaction(
    amount: number,
    source: keyof XPBreakdown,
    description: string,
    calculation?: XPCalculationResult
  ): void {
    const data = xpRepository.getXPData();
    const previousLevel = calculateLevel(data.totalXP);
    
    // Update XP values
    xpRepository.updateXPData({
      totalXP: data.totalXP + amount,
      todayXP: data.todayXP + amount,
      lifetimeXP: (data.lifetimeXP || data.totalXP) + amount
    });
    
    // Update breakdown
    xpRepository.addToBreakdown(source, amount);
    
    // Check for level up
    const newLevel = calculateLevel(data.totalXP + amount);
    if (newLevel.level > previousLevel.level) {
      this.handleLevelUp(previousLevel, newLevel);
    }
    
    // Record transaction
    this.recordTransaction({
      timestamp: Date.now(),
      amount,
      source,
      description,
      calculation
    });
    
    // Update weekly tracking
    xpRepository.updateWeeklyXP(data.todayXP + amount);
    
    // Notify listeners
    this.notifyListeners();
  }
  
  /**
   * Handle level up event
   */
  private handleLevelUp(previousLevel: any, newLevel: any): void {
    if (this.isClient) {
      window.dispatchEvent(new CustomEvent('levelUp', {
        detail: {
          previousLevel: previousLevel.level,
          newLevel: newLevel.level,
          newTitle: newLevel.title,
          newIcon: newLevel.icon
        }
      }));
    }
  }
  
  /**
   * Get current modifiers based on time, streak, etc
   */
  private getCurrentModifiers(): BaseModifiers {
    const data = xpRepository.getXPData();
    const now = new Date();
    const day = now.getDay();
    
    return {
      streakDays: data.streakDays,
      timeOfDay: now,
      isWeekend: day === 0 || day === 6,
      isFirstTime: false, // Caller should set this
      isGroupSession: false // Caller should set this
    };
  }
  
  /**
   * Record a transaction for history
   */
  private recordTransaction(transaction: XPTransaction): void {
    this.transactionHistory.push(transaction);
    
    // Keep only last 100 transactions
    if (this.transactionHistory.length > 100) {
      this.transactionHistory = this.transactionHistory.slice(-100);
    }
    
    // Save to localStorage (only on client)
    if (this.isClient) {
      localStorage.setItem('xpTransactionHistory', JSON.stringify(this.transactionHistory));
    }
  }
  
  /**
   * Calculate monthly average XP
   */
  private calculateMonthlyAverage(monthlyXP: number[]): number {
    if (!monthlyXP || monthlyXP.length === 0) return 0;
    const sum = monthlyXP.reduce((acc, val) => acc + val, 0);
    return Math.floor(sum / monthlyXP.length);
  }
  
  /**
   * Get transaction history
   */
  getTransactionHistory(): XPTransaction[] {
    return [...this.transactionHistory];
  }
  
  /**
   * Reset all XP data (for development/testing)
   */
  reset(): void {
    const shouldReset = process.env.NODE_ENV === 'development' || 
      (this.isClient && confirm('Are you sure you want to reset all XP data?'));
    
    if (shouldReset) {
      xpRepository.reset();
      this.transactionHistory = [];
      if (this.isClient) {
        localStorage.removeItem('xpTransactionHistory');
        window.dispatchEvent(new CustomEvent('xpReset'));
      }
      this.notifyListeners();
    }
  }
  
  /**
   * Export XP data for backup
   */
  exportData(): string {
    return JSON.stringify({
      xpData: xpRepository.exportData(),
      transactionHistory: this.transactionHistory
    }, null, 2);
  }
  
  /**
   * Import XP data from backup
   */
  importData(jsonString: string): boolean {
    try {
      const data = JSON.parse(jsonString);
      
      // Import repository data
      if (data.xpData && xpRepository.importData(data.xpData)) {
        // Import transaction history
        if (data.transactionHistory) {
          this.transactionHistory = data.transactionHistory;
          if (this.isClient) {
            localStorage.setItem('xpTransactionHistory', JSON.stringify(this.transactionHistory));
          }
        }
        
        this.notifyListeners();
        return true;
      }
      
      return false;
    } catch (e) {
      console.error('Failed to import XP data:', e);
      return false;
    }
  }
}

// Export singleton instance
export const xpService = XPService.getInstance();