// File: src/features/yin/services/lessonRepository.ts
// Version: 3.0.0
// Description: This repository loads pre-processed lesson data from the local file system.
// It no longer calls the Notion API directly, ensuring high performance and reliability.

// Helper function to dynamically import the processed JSON files from the data directory.
async function loadProcessedLesson(lessonId: string): Promise<any | null> {
    try {
        // Dynamically import the JSON file corresponding to the lessonId.
        const lessonModule = await import(`../data/lessons/processed/${lessonId}.json`);
        // The actual data is on the 'default' property of the imported module.
        return lessonModule.default;
    } catch (error) {
        console.error(`Could not find or load processed lesson file for ID: ${lessonId}. Did you run the sync script?`);
        return null;
    }
}

export class LessonRepository {
  // A simple in-memory cache to prevent re-reading files from disk multiple times during a session.
  private static lessonCache: Map<string, any> = new Map();

  /**
   * Retrieves a single lesson by its ID.
   * @param lessonId The unique identifier for the lesson (which matches the Notion Page ID).
   * @returns The processed lesson data object, or null if not found.
   */
  static async getLesson(lessonId: string): Promise<any | null> {
    // 1. Check the in-memory cache first for immediate access.
    if (this.lessonCache.has(lessonId)) {
        return this.lessonCache.get(lessonId);
    }

    // 2. If not in cache, load the processed JSON file from the filesystem.
    const lessonData = await loadProcessedLesson(lessonId);
    
    if (lessonData) {
        // 3. If found, store it in the cache for subsequent requests.
        this.lessonCache.set(lessonId, lessonData);
    }
    
    return lessonData;
  }
}

