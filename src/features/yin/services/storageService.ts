// Version: 1.0.0 - Centralized and migratable storage service

interface StorageSchema {
  version: number;
  challenges: {
    active: Record<string, { progress: number }>;
    completed: { id: string; completedDate: string }[];
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
    // Define migrations from older versions if needed
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
        const newSchema = this.getDefaultSchema();
        this.save(newSchema);
        return newSchema;
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
      console.error('Failed to load or parse storage, resetting to default:', error);
      const newSchema = this.getDefaultSchema();
      this.save(newSchema);
      return newSchema;
    }
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
    
    // Ensure the final version is set
    currentData.version = this.CURRENT_VERSION;

    return currentData as StorageSchema;
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
        total: 300, // Start with some initial XP
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
    
    window.dispatchEvent(new CustomEvent('storageUpdated', { 
      detail: { data: dataToSave }
    }));
  }

  // --- Public API methods ---

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

  public updateXP(updates: Partial<StorageSchema['xp']>) {
    this.data.xp = {
      ...this.data.xp,
      ...updates
    };
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
  
  public reset(scope: 'all' | 'challenges' | 'quests' | 'xp' = 'all'): void {
    const defaults = this.getDefaultSchema();
    
    switch (scope) {
      case 'challenges':
        this.data.challenges = defaults.challenges;
        console.log('Challenge data has been reset.');
        break;
      case 'quests':
        this.data.quests = defaults.quests;
        console.log('Quest data has been reset.');
        break;
      case 'xp':
        this.data.xp = defaults.xp;
        console.log('XP data has been reset.');
        break;
      case 'all':
        this.data = defaults;
        console.log('All storage data has been reset.');
        break;
    }
    
    this.save();
    // Force a reload of the app to ensure all components get the fresh state
    if (typeof window !== 'undefined') {
      window.location.reload();
    }
  }
}

export const storageService = new StorageService();