// src/features/yin/services/chapterService.ts

import { LessonData } from '../types/chapter.types';

interface ChapterProgress {
  chapterId: string;
  progress: number;
  unlocked: boolean;
  lessons?: LessonData[];
}

class ChapterService {
  private baseUrl = process.env.NEXT_PUBLIC_API_URL || '/api';
  
  async getUserChapterData(userId: string): Promise<ChapterProgress[]> {
    try {
      const response = await fetch(`${this.baseUrl}/users/${userId}/chapters`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getAuthToken()}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch chapter data');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching chapter data:', error);
      
      // Return default data on error
      return this.getDefaultChapterProgress();
    }
  }
  
  async unlockChapter(userId: string, chapterId: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/users/${userId}/chapters/${chapterId}/unlock`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getAuthToken()}`
        }
      });
      
      return response.ok;
    } catch (error) {
      console.error('Error unlocking chapter:', error);
      return false;
    }
  }
  
  async updateProgress(userId: string, chapterId: string, progress: number): Promise<void> {
    try {
      await fetch(`${this.baseUrl}/users/${userId}/chapters/${chapterId}/progress`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getAuthToken()}`
        },
        body: JSON.stringify({ progress })
      });
    } catch (error) {
      console.error('Error updating progress:', error);
      
      // Save to local storage as fallback
      this.saveLocalProgress(userId, chapterId, progress);
    }
  }
  
  async getLessonContent(lessonId: string): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/lessons/${lessonId}/content`, {
        headers: {
          'Authorization': `Bearer ${this.getAuthToken()}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch lesson content');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching lesson content:', error);
      return null;
    }
  }
  
  private getAuthToken(): string {
    // Get from your auth system
    return localStorage.getItem('authToken') || '';
  }
  
  private getDefaultChapterProgress(): ChapterProgress[] {
    return [
      {
        chapterId: 'chapter-1',
        progress: 0,
        unlocked: true
      }
    ];
  }
  
  private saveLocalProgress(userId: string, chapterId: string, progress: number): void {
    const key = `chapter_progress_${userId}_${chapterId}`;
    localStorage.setItem(key, JSON.stringify({ progress, timestamp: Date.now() }));
  }
}

export const chapterService = new ChapterService();