// src/features/yin/services/insightService.ts

import { InsightCollection, InsightData, InsightStats } from '../types/insight.types';

class InsightService {
  private baseUrl = process.env.NEXT_PUBLIC_API_URL || '/api';
  
  async getUserInsights(userId: string): Promise<InsightCollection> {
    try {
      const response = await fetch(`${this.baseUrl}/users/${userId}/insights`, {
        headers: {
          'Authorization': `Bearer ${this.getAuthToken()}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch insights');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching insights:', error);
      return this.getLocalInsights(userId);
    }
  }
  
  async saveInsight(userId: string, insight: InsightData): Promise<InsightData> {
    try {
      // Handle voice note upload if present
      if (insight.voiceNote) {
        const voiceUrl = await this.uploadVoiceNote(insight.voiceNote);
        insight.content = voiceUrl; // Store URL reference
      }
      
      const response = await fetch(`${this.baseUrl}/users/${userId}/insights`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getAuthToken()}`
        },
        body: JSON.stringify(insight)
      });
      
      if (!response.ok) {
        throw new Error('Failed to save insight');
      }
      
      const saved = await response.json();
      
      // Save locally as well
      this.saveLocalInsight(userId, saved);
      
      return saved;
    } catch (error) {
      console.error('Error saving insight:', error);
      
      // Save locally and return
      insight.id = `local_${Date.now()}`;
      this.saveLocalInsight(userId, insight);
      return insight;
    }
  }
  
  async deleteInsight(userId: string, insightId: string): Promise<void> {
    try {
      await fetch(`${this.baseUrl}/users/${userId}/insights/${insightId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${this.getAuthToken()}`
        }
      });
    } catch (error) {
      console.error('Error deleting insight:', error);
    }
    
    // Delete locally as well
    this.deleteLocalInsight(userId, insightId);
  }
  
  async getInsightStats(userId: string): Promise<InsightStats> {
    try {
      const response = await fetch(`${this.baseUrl}/users/${userId}/insights/stats`, {
        headers: {
          'Authorization': `Bearer ${this.getAuthToken()}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch insight stats');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching insight stats:', error);
      return this.calculateLocalStats(userId);
    }
  }
  
  async calculateInsightXP(userId: string, insight: InsightData): Promise<number> {
    let xp = 15; // Base XP
    
    // Bonus for breakthrough
    if (insight.type === 'breakthrough') {
      xp += 35;
    }
    
    // Bonus for tags
    xp += insight.tags.length * 5;
    
    // Bonus for voice note
    if (insight.voiceNote) {
      xp += 10;
    }
    
    return xp;
  }
  
  private async uploadVoiceNote(blob: Blob): Promise<string> {
    const formData = new FormData();
    formData.append('audio', blob, 'voice-note.webm');
    
    try {
      const response = await fetch(`${this.baseUrl}/upload/audio`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.getAuthToken()}`
        },
        body: formData
      });
      
      if (!response.ok) {
        throw new Error('Failed to upload voice note');
      }
      
      const { url } = await response.json();
      return url;
    } catch (error) {
      console.error('Error uploading voice note:', error);
      // Convert to base64 and store locally
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(blob);
      });
    }
  }
  
  private getAuthToken(): string {
    return localStorage.getItem('authToken') || '';
  }
  
  private getLocalInsights(userId: string): InsightCollection {
    const stored = localStorage.getItem(`insights_${userId}`);
    if (stored) {
      return JSON.parse(stored);
    }
    
    return {
      userId,
      insights: [],
      totalCount: 0,
      tags: []
    };
  }
  
  private saveLocalInsight(userId: string, insight: InsightData): void {
    const collection = this.getLocalInsights(userId);
    collection.insights.unshift(insight);
    collection.totalCount++;
    
    // Update tags
    insight.tags.forEach(tag => {
      const existing = collection.tags.find(t => t.tag === tag);
      if (existing) {
        existing.count++;
      } else {
        collection.tags.push({ tag, count: 1 });
      }
    });
    
    localStorage.setItem(`insights_${userId}`, JSON.stringify(collection));
  }
  
  private deleteLocalInsight(userId: string, insightId: string): void {
    const collection = this.getLocalInsights(userId);
    collection.insights = collection.insights.filter(i => i.id !== insightId);
    collection.totalCount = collection.insights.length;
    localStorage.setItem(`insights_${userId}`, JSON.stringify(collection));
  }
  
  private calculateLocalStats(userId: string): InsightStats {
    const collection = this.getLocalInsights(userId);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    
    const todayInsights = collection.insights.filter(i => 
      new Date(i.timestamp).toDateString() === today.toDateString()
    ).length;
    
    const weekInsights = collection.insights.filter(i => 
      new Date(i.timestamp) > weekAgo
    ).length;
    
    return {
      totalInsights: collection.totalCount,
      todayInsights,
      weekInsights,
      topTags: collection.tags.sort((a, b) => b.count - a.count).slice(0, 5),
      streakDays: 0, // Would calculate from dates
      lastInsightDate: collection.insights[0]?.timestamp || new Date()
    };
  }
}

export const insightService = new InsightService();