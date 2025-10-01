// src/features/yin/services/storageService.ts

interface StorageSchema {
  version: number;
  challenges: {
    active: Record<string, any>;
    completed: any[];
    currentTier: number;
  };
  quests: {
    progress: Record<string, boolean>;
    dailyCompletions: string[];
    lastResetDate: string;
  };
  xp: {
    total: number;
    history: Array<{
      amount: number;
      source: string;
      timestamp: string;
      metadata?: any;
    }>;
  };
  settings: {
    performanceMode: boolean;
    animations: boolean;
    soundEnabled: boolean;
  };
}

type Migration = {
  version: number;
  migrate: (data: any) => any;
};

class StorageService {
  private readonly STORAGE_KEY = 'chi_portal_yin';
  private readonly CURRENT_VERSION = 3;
  private migrations: Migration[] = [
    {
      version: 1,
      migrate: (data: any) => {
        // Migration from v0 to v1: Consolidate separate keys
        return {
          version: 1,
          challenges: {
            active: data.yin_challenges || {},
            completed: data.yin_completed_challenges || [],
            currentTier: parseInt(data.yin_current_tier || '1')
          },
          quests: {
            progress: data.quest_progress || {},
            dailyCompletions: [],
            lastResetDate: new Date().toISOString()
          },
          xp: {
            total: data.totalXP || 0,
            history: []
          },
          settings: {
            performanceMode: false,
            animations: true,
            soundEnabled: true
          }
        };
      }
    },
    {
      version: 2,
      migrate: (data: any) => {
        // Migration from v1 to v2: Add XP history tracking
        return {
          ...data,
          version: 2,
          xp: {
            ...data.xp,
            history: data.xp.history || []
          }
        };
      }
    },
    {
      version: 3,
      migrate: (data: any) => {
        // Migration from v2 to v3: Add performance settings
        return {
          ...data,
          version: 3,
          settings: {
            ...data.settings,
            performanceMode: data.settings?.performanceMode ?? false,
            animations: data.settings?.animations ?? true
          }
        };
      }
    }
  ];

  private data: StorageSchema;

  constructor() {
    this.data = this.load();
  }

  private load(): StorageSchema {
    if (typeof window === 'undefined') {
      return this.getDefaultSchema();
    }

    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      
      if (!stored) {
        // Check for legacy storage keys
        const legacyData = this.loadLegacyData();
        if (legacyData) {
          const migrated = this.migrate(legacyData);
          this.save(migrated);
          return migrated;
        }
        return this.getDefaultSchema();
      }

      const parsed = JSON.parse(stored);
      const version = parsed.version || 0;

      if (version < this.CURRENT_VERSION) {
        console.log(`Migrating storage from v${version} to v${this.CURRENT_VERSION}`);
        const migrated = this.migrate(parsed);
        this.save(migrated);
        return migrated;
      }

      return parsed;
    } catch (error) {
      console.error('Failed to load storage:', error);
      return this.getDefaultSchema();
    }
  }

  private loadLegacyData(): any | null {
    // Attempt to load from old storage keys
    const legacyKeys = [
      'yin_challenges',
      'yin_completed_challenges', 
      'yin_current_tier',
      'quest_progress',
      'totalXP'
    ];

    const hasLegacyData = legacyKeys.some(key => localStorage.getItem(key) !== null);
    
    if (!hasLegacyData) return null;

    const legacyData: any = {};
    legacyKeys.forEach(key => {
      const value = localStorage.getItem(key);
      if (value) {
        try {
          legacyData[key] = JSON.parse(value);
        } catch {
          legacyData[key] = value;
        }
      }
    });

    // Clean up old keys after successful migration
    legacyKeys.forEach(key => localStorage.removeItem(key));
    
    return legacyData;
  }

  private migrate(data: any): StorageSchema {
    let currentData = data;
    const startVersion = currentData.version || 0;

    for (const migration of this.migrations) {
      if (migration.version > startVersion) {
        console.log(`Running migration to v${migration.version}`);
        currentData = migration.migrate(currentData);
      }
    }

    return currentData;
  }

  private getDefaultSchema(): StorageSchema {
    return {
      version: this.CURRENT_VERSION,
      challenges: {
        active: {},
        completed: [],
        currentTier: 1
      },
      quests: {
        progress: {},
        dailyCompletions: [],
        lastResetDate: new Date().toISOString()
      },
      xp: {
        total: 0,
        history: []
      },
      settings: {
        performanceMode: false,
        animations: true,
        soundEnabled: true
      }
    };
  }

  private save(data?: StorageSchema): void {
    if (typeof window === 'undefined') return;
    
    const dataToSave = data || this.data;
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(dataToSave));
    
    // Dispatch event for other components to react
    window.dispatchEvent(new CustomEvent('storageUpdated', { 
      detail: { data: dataToSave }
    }));
  }

  // Public API methods
  public getChallenges() {
    return this.data.challenges;
  }

  public updateChallenges(updates: Partial<StorageSchema['challenges']>) {
    this.data.challenges = {
      ...this.data.challenges,
      ...updates
    };
    this.save();
  }

  public getQuests() {
    return this.data.quests;
  }

  public updateQuests(updates: Partial<StorageSchema['quests']>) {
    this.data.quests = {
      ...this.data.quests,
      ...updates
    };
    this.save();
  }

  public getXP() {
    return this.data.xp;
  }

  public addXP(amount: number, source: string, metadata?: any) {
    this.data.xp.total += amount;
    this.data.xp.history.push({
      amount,
      source,
      timestamp: new Date().toISOString(),
      metadata
    });
    
    // Keep only last 100 history entries
    if (this.data.xp.history.length > 100) {
      this.data.xp.history = this.data.xp.history.slice(-100);
    }
    
    this.save();
  }

  public getSettings() {
    return this.data.settings;
  }

  public updateSettings(updates: Partial<StorageSchema['settings']>) {
    this.data.settings = {
      ...this.data.settings,
      ...updates
    };
    this.save();
  }

  public exportData(): string {
    return JSON.stringify(this.data, null, 2);
  }

  public importData(jsonString: string): boolean {
    try {
      const imported = JSON.parse(jsonString);
      const migrated = this.migrate(imported);
      this.data = migrated;
      this.save();
      return true;
    } catch (error) {
      console.error('Failed to import data:', error);
      return false;
    }
  }

  public reset(scope: 'all' | 'challenges' | 'quests' | 'xp' = 'all') {
    const defaults = this.getDefaultSchema();
    
    switch (scope) {
      case 'challenges':
        this.data.challenges = defaults.challenges;
        break;
      case 'quests':
        this.data.quests = defaults.quests;
        break;
      case 'xp':
        this.data.xp = defaults.xp;
        break;
      case 'all':
        this.data = defaults;
        break;
    }
    
    this.save();
  }
}

export const storageService = new StorageService();