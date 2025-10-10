// src/features/yin/services/journalService.ts
// Version: 1.0.0 - Client-side journal database for AI analysis

export interface GratitudeEntry {
  id: string;
  gratitudes: string[];
  timestamp: number;
  date: string;
  wordCount: number;
  questId?: string;
}

export interface IntentionEntry {
  id: string;
  focusArea: string;
  focusAreaLabel?: string;
  intention: string;
  affirmation: string;
  timestamp: number;
  date: string;
  questId?: string;
}

export interface InsightEntry {
  id: string;
  text: string;
  category: string;
  categoryLabel?: string;
  wordCount: number;
  timestamp: number;
  date: string;
  questId?: string;
}

class JournalService {
  private readonly GRATITUDE_KEY = 'journal_gratitudes';
  private readonly INTENTION_KEY = 'journal_intentions';
  private readonly INSIGHT_KEY = 'journal_insights';

  // Generate unique ID
  private generateId(): string {
    return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // === GRATITUDES ===
  saveGratitude(gratitudes: string[]): GratitudeEntry {
    const entry: GratitudeEntry = {
      id: this.generateId(),
      gratitudes: gratitudes.filter(g => g.trim()),
      timestamp: Date.now(),
      date: new Date().toISOString().split('T')[0],
      wordCount: gratitudes.join(' ').split(' ').length,
    };

    const existing = this.getAllGratitudes();
    existing.push(entry);
    localStorage.setItem(this.GRATITUDE_KEY, JSON.stringify(existing));
    
    return entry;
  }

  getAllGratitudes(): GratitudeEntry[] {
    try {
      const stored = localStorage.getItem(this.GRATITUDE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  getGratitudesByDateRange(startDate: Date, endDate: Date): GratitudeEntry[] {
    return this.getAllGratitudes().filter(entry => {
      const entryDate = new Date(entry.date);
      return entryDate >= startDate && entryDate <= endDate;
    });
  }

  // === INTENTIONS ===
  saveIntention(data: Omit<IntentionEntry, 'id' | 'timestamp' | 'date'>): IntentionEntry {
    const entry: IntentionEntry = {
      ...data,
      id: this.generateId(),
      timestamp: Date.now(),
      date: new Date().toISOString().split('T')[0],
    };

    const existing = this.getAllIntentions();
    existing.push(entry);
    localStorage.setItem(this.INTENTION_KEY, JSON.stringify(existing));
    
    // Also save as today's intention for quick access
    localStorage.setItem('daily_intention', JSON.stringify(entry));
    
    return entry;
  }

  getAllIntentions(): IntentionEntry[] {
    try {
      const stored = localStorage.getItem(this.INTENTION_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  getTodaysIntention(): IntentionEntry | null {
    const today = new Date().toISOString().split('T')[0];
    const intentions = this.getAllIntentions();
    return intentions.find(i => i.date === today) || null;
  }

  // === INSIGHTS ===
  saveInsight(data: Omit<InsightEntry, 'id' | 'timestamp' | 'date'>): InsightEntry {
    const entry: InsightEntry = {
      ...data,
      id: this.generateId(),
      timestamp: Date.now(),
      date: new Date().toISOString().split('T')[0],
    };

    const existing = this.getAllInsights();
    existing.push(entry);
    localStorage.setItem(this.INSIGHT_KEY, JSON.stringify(existing));
    
    return entry;
  }

  getAllInsights(): InsightEntry[] {
    try {
      const stored = localStorage.getItem(this.INSIGHT_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  getInsightsByCategory(category: string): InsightEntry[] {
    return this.getAllInsights().filter(i => i.category === category);
  }

  // === ANALYSIS HELPERS (for AI) ===
  getJournalSummary() {
    const gratitudes = this.getAllGratitudes();
    const intentions = this.getAllIntentions();
    const insights = this.getAllInsights();

    return {
      totalEntries: gratitudes.length + intentions.length + insights.length,
      gratitudes: {
        count: gratitudes.length,
        mostRecent: gratitudes[gratitudes.length - 1],
        themes: this.extractGratitudeThemes(gratitudes),
      },
      intentions: {
        count: intentions.length,
        mostRecent: intentions[intentions.length - 1],
        focusAreas: this.extractFocusAreaStats(intentions),
      },
      insights: {
        count: insights.length,
        mostRecent: insights[insights.length - 1],
        categories: this.extractInsightCategories(insights),
      },
      dateRange: this.getDateRange([...gratitudes, ...intentions, ...insights]),
    };
  }

  private extractGratitudeThemes(entries: GratitudeEntry[]): Record<string, number> {
    const themes: Record<string, number> = {};
    const keywords = ['people', 'health', 'work', 'nature', 'family', 'friends', 'growth', 'peace'];
    
    entries.forEach(entry => {
      const text = entry.gratitudes.join(' ').toLowerCase();
      keywords.forEach(keyword => {
        if (text.includes(keyword)) {
          themes[keyword] = (themes[keyword] || 0) + 1;
        }
      });
    });
    
    return themes;
  }

  private extractFocusAreaStats(entries: IntentionEntry[]): Record<string, number> {
    const stats: Record<string, number> = {};
    entries.forEach(entry => {
      stats[entry.focusArea] = (stats[entry.focusArea] || 0) + 1;
    });
    return stats;
  }

  private extractInsightCategories(entries: InsightEntry[]): Record<string, number> {
    const categories: Record<string, number> = {};
    entries.forEach(entry => {
      categories[entry.category] = (categories[entry.category] || 0) + 1;
    });
    return categories;
  }

  private getDateRange(entries: any[]): { start: string; end: string } | null {
    if (entries.length === 0) return null;
    
    const dates = entries.map(e => e.date).sort();
    return {
      start: dates[0],
      end: dates[dates.length - 1],
    };
  }

  // === CLEANUP ===
  clearAllData(): void {
    localStorage.removeItem(this.GRATITUDE_KEY);
    localStorage.removeItem(this.INTENTION_KEY);
    localStorage.removeItem(this.INSIGHT_KEY);
    localStorage.removeItem('daily_intention');
  }
}

export const journalService = new JournalService();