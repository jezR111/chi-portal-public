// src/features/yin/services/notionService.ts
// Version: 1.2.0 - Refactored Notion service with improved error handling and lesson fetching
// This service now fetches lesson data from our own API route

export class NotionLessonService {
  static async fetchLesson(pageId: string) {
    try {
      const response = await fetch(`/api/notion/${pageId}`);
      
      if (!response.ok) {
        // Try to parse the error, but handle cases where it might not be JSON
        let errorDetails = `Request failed with status ${response.status}`;
        try {
          const errorData = await response.json();
          // Now we will see the detailed error from the server
          console.error('NotionLessonService: Detailed API error:', errorData);
          errorDetails = errorData.details || errorData.error || errorDetails;
        } catch (e) {
          console.error('NotionLessonService: Could not parse error response.');
        }
        return null;
      }
      
      const data = await response.json();
      return data;

    } catch (error) {
      console.error('NotionLessonService: Network or client-side error:', error);
      return null;
    }
  }
}

