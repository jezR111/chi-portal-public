// src/features/yin/services/notionService.ts
import { PathData } from '../data/enhancedPathsData';

export interface NotionPage {
  id: string;
  title: string;
  url: string;
  content?: string;
  subPages?: NotionPage[];
  parentId?: string;
  highlight?: string;
  timestamp?: string;
}

export interface Chapter {
  id: string;
  pathId: string;
  notionId: string;
  title: string;
  subtitle: string;
  description: string;
  lessons: number;
  duration: string;
  completed: boolean;
  progress: number;
  icon?: any;
  color?: string;
  glow?: string;
  unlocked: boolean;
  premium: boolean;
  lessonList: Lesson[];
  notionUrl?: string;
}

export interface Lesson {
  id: string;
  chapterId: string;
  title: string;
  duration: string;
  completed: boolean;
  content?: string;
  notionUrl?: string;
}

class NotionService {
  private baseUrl = '/api/notion'; // Your API endpoint

  /**
   * Map of Notion page IDs to path IDs
   */
  private notionPathMap = {
    'af01829f-b333-4d99-9dfc-e571195357c1': 'the-self',
    'd4d47a9d-5197-42f7-9e59-46e01f3d1ede': 'inward-journey',
    'b9dfedbe-c00f-48c0-ac8a-76a48c5419ec': 'energy-bodies',
    // Add more mappings as you discover them
  };

  /**
   * Actual chapter structure from your Notion
   * Based on the fetched content
   */
  private chapterStructure = {
    'the-self': [
      { id: '81693883-8317-4c02-9aae-71efe08036bb', title: 'Overview of The Self' },
      { id: 'a24f61f8-a67d-420a-84a5-bfb49a9bbc1a', title: 'The Stages of Self' },
      { id: 'af926c46-a381-485f-b6e7-4d58af0ed282', title: 'The Types of Selves' },
      { id: '048fd49c-11b3-4638-acbc-18e07a37c4a2', title: 'Self Image & Identity' },
      { id: 'a7ee07f7-e16c-401a-a023-3f7c297ce27a', title: 'Elements of The Self' },
      { id: 'd72406be-6d47-4bfb-bf29-5741bd201e7d', title: 'The Soul, The Self & The Ego' },
      { id: 'b7f15e0f-6c76-47a7-b06d-8c7025880a1d', title: 'The Never Ending Journey of Self' },
      { id: '603c1dbf-a4b0-42f6-910e-ff4940a9221c', title: 'Self Connection' }
    ],
    'inward-journey': [
      { id: 'd4c807d6-f385-473f-a55c-e4b4ee24a000', title: 'What is Self Work / Self Growth' },
      { id: 'd80ec384-5dec-4d68-8640-1c05be951ff3', title: 'Self Care' },
      { id: '5b226ae3-0dca-47a4-a914-ae4d135e6fec', title: 'Wounding' },
      { id: 'd0e359f7-88de-4624-aed7-75f3a1119850', title: 'Balancing The Ego' },
      { id: 'a3e40bbe-65b6-467f-ada1-6ac88b86c08e', title: 'Emotions & States of Being' },
      { id: '80618edb-907a-4bee-b43f-8dc51a888328', title: 'Needs' },
      { id: 'cf2a2954-f515-440d-9657-a890eb8e3351', title: 'Victim Mentality & Radical Responsibility' },
      { id: '79dfad93-43ec-4f61-8c86-0de53b57b741', title: 'Self Talk & Criticalness of Self' },
      { id: 'a4a3fe06-38d6-423e-ac26-7d6a0ae9ea2a', title: 'Addiction' },
      { id: 'cdf9917c-e7ef-4d49-8740-422da0d668ef', title: 'Anxiety & Depression' },
      { id: '5f43397e-5e77-4d4d-892e-c5544c37c477', title: 'Humility & Learning' },
      { id: 'ddd8d56f-8435-45d7-aa0b-2e51dc8c03ed', title: 'Confidence & Self Certainty' },
      { id: '13be1965-723e-4e1a-a425-9cc28ba6de0d', title: 'Gratitude vs Lack/Resentment/Entitlement' },
      { id: '45b59656-570f-4196-a4e8-45f388dcc783', title: 'Wellbeing & Fulfilment' },
      { id: '43c3c09a-c337-4d4e-bb8c-5586175b3bfe', title: 'Self Worth, Self Esteem, Self Value' }
    ],
    'energy-bodies': [
      { id: '4a55f629-fc34-48f6-831a-d03c45def58f', title: 'Body - Physical' },
      { id: 'ce34b68a-76fd-4d65-9281-cfc824405908', title: 'Mind - Mental' },
      { id: 'f7e16f0f-efc9-43e1-aada-a9815249881c', title: 'Heart - Spiritual' },
      { id: '6f5dafde-d0cd-454e-86bd-def8aecceacf', title: 'Accessing Inner Being' }
    ]
  };

  /**
   * Search Notion for content
   */
  async searchNotion(query: string): Promise<NotionPage[]> {
    // This would call your actual API endpoint
    // For now, returning mock data based on the structure
    try {
      const response = await fetch(`${this.baseUrl}/search`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query })
      });
      return await response.json();
    } catch (error) {
      console.error('Error searching Notion:', error);
      return [];
    }
  }

  /**
   * Fetch a specific Notion page
   */
  async fetchNotionPage(pageId: string): Promise<NotionPage | null> {
    try {
      const response = await fetch(`${this.baseUrl}/page/${pageId}`);
      return await response.json();
    } catch (error) {
      console.error('Error fetching Notion page:', error);
      return null;
    }
  }

  /**
   * Get chapters for a specific path
   */
  async getChaptersForPath(pathId: string, pathData: PathData): Promise<Chapter[]> {
    const chapterIds = this.chapterStructure[pathId] || [];
    
    return chapterIds.map((chapterInfo, index) => ({
      id: chapterInfo.id,
      pathId: pathId,
      notionId: chapterInfo.id,
      title: chapterInfo.title,
      subtitle: this.generateSubtitle(chapterInfo.title),
      description: this.generateDescription(chapterInfo.title),
      lessons: Math.floor(Math.random() * 5) + 3, // Mock lesson count
      duration: `${Math.floor(Math.random() * 2) + 1}h ${Math.floor(Math.random() * 45) + 15}m`,
      completed: false,
      progress: 0,
      icon: pathData.icon,
      color: pathData.gradient,
      glow: `shadow-${pathData.glowColor}-500/30`,
      unlocked: index === 0 || Math.random() > 0.5, // First chapter always unlocked
      premium: Math.random() > 0.8,
      lessonList: this.generateLessons(chapterInfo.id, chapterInfo.title),
      notionUrl: `https://www.notion.so/${chapterInfo.id}`
    }));
  }

  /**
   * Generate lessons for a chapter (mock data for now)
   */
  private generateLessons(chapterId: string, chapterTitle: string): Lesson[] {
    const lessonCount = Math.floor(Math.random() * 4) + 3;
    const lessons: Lesson[] = [];
    
    for (let i = 0; i < lessonCount; i++) {
      lessons.push({
        id: `${chapterId}-lesson-${i + 1}`,
        chapterId: chapterId,
        title: this.generateLessonTitle(chapterTitle, i + 1),
        duration: `${Math.floor(Math.random() * 15) + 10}min`,
        completed: false,
        content: `Lesson content for ${chapterTitle} - Part ${i + 1}`
      });
    }
    
    return lessons;
  }

  /**
   * Generate appropriate subtitles based on chapter titles
   */
  private generateSubtitle(title: string): string {
    const subtitleMap: Record<string, string> = {
      'Overview of The Self': 'Foundation principles',
      'The Stages of Self': 'Evolution and growth',
      'The Types of Selves': 'Different aspects explored',
      'Self Image & Identity': 'How you see yourself',
      'Elements of The Self': 'Core components',
      'The Soul, The Self & The Ego': 'Understanding the trinity',
      'The Never Ending Journey of Self': 'Continuous evolution',
      'Self Connection': 'Deepening your relationship',
      'What is Self Work / Self Growth': 'The path of transformation',
      'Self Care': 'Nurturing your being',
      'Wounding': 'Healing and integration',
      'Balancing The Ego': 'Finding equilibrium',
      'Body - Physical': 'Your physical vessel',
      'Mind - Mental': 'The mental landscape',
      'Heart - Spiritual': 'Spiritual connection',
      'Accessing Inner Being': 'Gateway to wisdom'
    };
    
    return subtitleMap[title] || 'Explore and discover';
  }

  /**
   * Generate descriptions based on chapter titles
   */
  private generateDescription(title: string): string {
    const descriptionMap: Record<string, string> = {
      'Overview of The Self': 'Get a comprehensive understanding of the journey of self-discovery and where you are on your path.',
      'The Stages of Self': 'Explore the different stages of self-evolution and identify where you currently are.',
      'Self Care': 'Learn to nurture and care for yourself with compassion and create sustainable self-care practices.',
      'Wounding': 'Recognize and heal emotional wounds with gentleness and understanding.',
      'Body - Physical': 'Understand and optimize your physical body as a vessel for consciousness.',
      'Mind - Mental': 'Master your thoughts and mental patterns for clarity and peace.',
      'Heart - Spiritual': 'Open your heart to deeper spiritual connection and wisdom.'
    };
    
    return descriptionMap[title] || 'Dive deep into this transformative chapter of your journey.';
  }

  /**
   * Generate lesson titles based on chapter
   */
  private generateLessonTitle(chapterTitle: string, lessonNumber: number): string {
    const lessonTemplates: Record<number, string> = {
      1: 'Introduction and Overview',
      2: 'Core Concepts',
      3: 'Practical Applications',
      4: 'Integration Practices',
      5: 'Advanced Techniques',
      6: 'Mastery and Beyond'
    };
    
    return lessonTemplates[lessonNumber] || `Lesson ${lessonNumber}`;
  }

  /**
   * Fetch lesson content from Notion
   */
  async getLessonContent(lessonId: string): Promise<string | null> {
    // This would fetch actual content from Notion
    // For now, returning placeholder
    return `
# Lesson Content

This is where the actual lesson content from Notion would appear.

## Key Concepts
- Concept 1
- Concept 2
- Concept 3

## Practice
Engage with the following practices...

## Reflection
Take a moment to reflect on what you've learned...
    `;
  }
}

// Export singleton instance
export const notionService = new NotionService();

// Export types
export type { Chapter, Lesson, NotionPage };
