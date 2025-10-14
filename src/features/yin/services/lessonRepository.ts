// File: src/features/yin/services/lessonRepository.ts
// Version: 4.0.0 - Fixed to handle actual directory structure

interface ProcessedLesson {
  id: string;
  title: string;
  path: string;
  chapter: string;
  order: number;
  source: string;
  lastSynced: string;
  sections: Array<{
    type: 'text' | 'image' | 'video';
    content?: string;
    url?: string;
    caption?: string;
  }>;
}

export class LessonRepository {
  private static lessonCache: Map<string, ProcessedLesson | null> = new Map();
  private static pathIndex: Map<string, { path: string; chapter: string }> = new Map();
  
  /**
   * Initialize the repository with path information from the generated index
   */
  static setPathIndex(index: Record<string, { path: string; chapter: string }>) {
    this.pathIndex.clear();
    Object.entries(index).forEach(([lessonId, info]) => {
      this.pathIndex.set(lessonId, info);
    });
  }

  /**
   * Retrieves a lesson by its ID, searching through the path/chapter structure
   */
  static async getLesson(lessonId: string): Promise<ProcessedLesson | null> {
    // Check cache first
    if (this.lessonCache.has(lessonId)) {
      return this.lessonCache.get(lessonId) || null;
    }

    try {
      // Get path info from index
      const pathInfo = this.pathIndex.get(lessonId);
      
      if (pathInfo) {
        // Try to import from known location
        const module = await import(
          `../data/lessons/processed/${pathInfo.path}/${pathInfo.chapter}/${lessonId}.json`
        );
        const lessonData = module.default;
        this.lessonCache.set(lessonId, lessonData);
        return lessonData;
      }

      // Fallback: scan all paths (slower but works without index)
      // This is a temporary measure until generatePaths runs
      const paths = ['the-self', 'the-stages-of-self']; // Add more as needed
      
      for (const possiblePath of paths) {
        try {
          const module = await import(
            `../data/lessons/processed/${possiblePath}/*/${lessonId}.json`
          );
          const lessonData = module.default;
          this.lessonCache.set(lessonId, lessonData);
          return lessonData;
        } catch {
          // Continue searching
        }
      }
      
      console.error(`Lesson ${lessonId} not found in any path`);
      return null;
      
    } catch (error) {
      console.error(`Error loading lesson ${lessonId}:`, error);
      this.lessonCache.set(lessonId, null);
      return null;
    }
  }

  /**
   * Clear the cache (useful for development)
   */
  static clearCache() {
    this.lessonCache.clear();
  }
}