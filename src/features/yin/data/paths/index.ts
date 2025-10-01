// src/features/yin/data/paths/index.ts
// Version: 3.0.0 - Flat lesson structure with chapter organization
// Last Updated: 2024-01-20

import { Lesson } from '../../types/lesson.types';

export interface PathContent {
  id: string;
  title: string;
  chapters: ChapterContent[];
}

export interface ChapterContent {
  id: string;
  title: string;
  description: string;
  lessons: LessonReference[];
  requiredProgress?: number;
}

export interface LessonReference {
  id: string;
  title: string;
  chapterNumber: number;
  lessonNumber: number;
  filename: string;
  load: () => Promise<Lesson | null>;
}

// Helper to create placeholder lesson
function createPlaceholderLesson(id: string, title: string): Lesson {
  return {
    id,
    title,
    subtitle: 'Content coming soon',
    duration: 10,
    xpReward: 30,
    objectives: ['This lesson is being prepared'],
    sections: [
      {
        id: 'placeholder',
        type: 'content',
        title: title,
        content: `# ${title}\n\nThis lesson content is currently being developed.\n\nPlease explore other available lessons while we prepare this content for you.`,
        estimatedDuration: 5
      }
    ],
    insightTriggers: [],
    prerequisites: [],
    nextLessons: []
  };
}

// Safe loader with fallback
async function loadLesson(path: string, id: string, title: string): Promise<Lesson> {
  try {
    const module = await import(path);
    return module.default || module[Object.keys(module)[0]];
  } catch {
    return createPlaceholderLesson(id, title);
  }
}

// Path: The Self - with flat lesson structure
export const theSelfPath: PathContent = {
  id: 'the-self',
  title: 'The Self',
  chapters: [
    {
      id: 'the-self-ch01-introduction',
      title: 'Introduction to the Self',
      description: 'Discover your authentic self and build a strong foundation of self-awareness',
      lessons: [
        {
          id: 'the-self-01-01',
          title: 'Awakening to the Self',
          chapterNumber: 1,
          lessonNumber: 1,
          filename: '01-01-awakening-to-self',
          load: () => loadLesson(
            './the-self/lessons/01-01-awakening-to-self',
            'the-self-01-01',
            'Awakening to the Self'
          )
        },
        {
          id: 'the-self-01-02',
          title: 'The Observer and the Observed',
          chapterNumber: 1,
          lessonNumber: 2,
          filename: '01-02-observer-observed',
          load: () => loadLesson(
            './the-self/lessons/01-02-observer-observed',
            'the-self-01-02',
            'The Observer and the Observed'
          )
        },
        {
          id: 'the-self-01-03',
          title: 'Beginning Your Practice',
          chapterNumber: 1,
          lessonNumber: 3,
          filename: '01-03-beginning-practice',
          load: () => loadLesson(
            './the-self/lessons/01-03-beginning-practice',
            'the-self-01-03',
            'Beginning Your Practice'
          )
        }
      ],
      requiredProgress: 0
    },
    {
      id: 'the-self-ch02-shadow',
      title: 'Meeting Your Shadow',
      description: 'Explore the hidden aspects of yourself with compassion and courage',
      lessons: [
        {
          id: 'the-self-02-01',
          title: 'Understanding the Shadow',
          chapterNumber: 2,
          lessonNumber: 1,
          filename: '02-01-understanding-shadow',
          load: () => loadLesson(
            './the-self/lessons/02-01-understanding-shadow',
            'the-self-02-01',
            'Understanding the Shadow'
          )
        },
        {
          id: 'the-self-02-02',
          title: 'Shadow Dialogue Technique',
          chapterNumber: 2,
          lessonNumber: 2,
          filename: '02-02-shadow-dialogue',
          load: () => loadLesson(
            './the-self/lessons/02-02-shadow-dialogue',
            'the-self-02-02',
            'Shadow Dialogue Technique'
          )
        },
        {
          id: 'the-self-02-03',
          title: 'Integration Practices',
          chapterNumber: 2,
          lessonNumber: 3,
          filename: '02-03-integration-practices',
          load: () => loadLesson(
            './the-self/lessons/02-03-integration-practices',
            'the-self-02-03',
            'Integration Practices'
          )
        },
        {
          id: 'the-self-02-04',
          title: 'Shadow in Relationships',
          chapterNumber: 2,
          lessonNumber: 4,
          filename: '02-04-shadow-relationships',
          load: () => loadLesson(
            './the-self/lessons/02-04-shadow-relationships',
            'the-self-02-04',
            'Shadow in Relationships'
          )
        }
      ],
      requiredProgress: 25
    },
    {
      id: 'the-self-ch03-patterns',
      title: 'Recognizing Patterns',
      description: 'Identify and transform limiting patterns and beliefs',
      lessons: [
        {
          id: 'the-self-03-01',
          title: 'The Nature of Patterns',
          chapterNumber: 3,
          lessonNumber: 1,
          filename: '03-01-nature-of-patterns',
          load: () => loadLesson(
            './the-self/lessons/03-01-nature-of-patterns',
            'the-self-03-01',
            'The Nature of Patterns'
          )
        },
        {
          id: 'the-self-03-02',
          title: 'Childhood Conditioning',
          chapterNumber: 3,
          lessonNumber: 2,
          filename: '03-02-childhood-conditioning',
          load: () => loadLesson(
            './the-self/lessons/03-02-childhood-conditioning',
            'the-self-03-02',
            'Childhood Conditioning'
          )
        },
        {
          id: 'the-self-03-03',
          title: 'Breaking Free',
          chapterNumber: 3,
          lessonNumber: 3,
          filename: '03-03-breaking-free',
          load: () => loadLesson(
            './the-self/lessons/03-03-breaking-free',
            'the-self-03-03',
            'Breaking Free'
          )
        },
        {
          id: 'the-self-03-04',
          title: 'Creating New Pathways',
          chapterNumber: 3,
          lessonNumber: 4,
          filename: '03-04-new-pathways',
          load: () => loadLesson(
            './the-self/lessons/03-04-new-pathways',
            'the-self-03-04',
            'Creating New Pathways'
          )
        },
        {
          id: 'the-self-03-05',
          title: 'Pattern Mastery',
          chapterNumber: 3,
          lessonNumber: 5,
          filename: '03-05-pattern-mastery',
          load: () => loadLesson(
            './the-self/lessons/03-05-pattern-mastery',
            'the-self-03-05',
            'Pattern Mastery'
          )
        }
      ],
      requiredProgress: 50
    },
    {
      id: 'the-self-ch04-integration',
      title: 'Self Integration',
      description: 'Bring all aspects of yourself into harmony and wholeness',
      lessons: [
        {
          id: 'the-self-04-01',
          title: 'The Art of Integration',
          chapterNumber: 4,
          lessonNumber: 1,
          filename: '04-01-art-of-integration',
          load: () => loadLesson(
            './the-self/lessons/04-01-art-of-integration',
            'the-self-04-01',
            'The Art of Integration'
          )
        },
        {
          id: 'the-self-04-02',
          title: 'Inner Child Work',
          chapterNumber: 4,
          lessonNumber: 2,
          filename: '04-02-inner-child',
          load: () => loadLesson(
            './the-self/lessons/04-02-inner-child',
            'the-self-04-02',
            'Inner Child Work'
          )
        },
        {
          id: 'the-self-04-03',
          title: 'Masculine & Feminine',
          chapterNumber: 4,
          lessonNumber: 3,
          filename: '04-03-masculine-feminine',
          load: () => loadLesson(
            './the-self/lessons/04-03-masculine-feminine',
            'the-self-04-03',
            'Masculine & Feminine'
          )
        },
        {
          id: 'the-self-04-04',
          title: 'The Integrated Self',
          chapterNumber: 4,
          lessonNumber: 4,
          filename: '04-04-integrated-self',
          load: () => loadLesson(
            './the-self/lessons/04-04-integrated-self',
            'the-self-04-04',
            'The Integrated Self'
          )
        },
        {
          id: 'the-self-04-05',
          title: 'Living Your Truth',
          chapterNumber: 4,
          lessonNumber: 5,
          filename: '04-05-living-truth',
          load: () => loadLesson(
            './the-self/lessons/04-05-living-truth',
            'the-self-04-05',
            'Living Your Truth'
          )
        },
        {
          id: 'the-self-04-06',
          title: 'Celebration & Embodiment',
          chapterNumber: 4,
          lessonNumber: 6,
          filename: '04-06-celebration',
          load: () => loadLesson(
            './the-self/lessons/04-06-celebration',
            'the-self-04-06',
            'Celebration & Embodiment'
          )
        }
      ],
      requiredProgress: 75
    }
  ]
};

// Path: The Inward Journey
export const inwardJourneyPath: PathContent = {
  id: 'inward-journey',
  title: 'The Inward Journey',
  chapters: [
    {
      id: 'inward-ch01-preparation',
      title: 'Preparing for the Journey',
      description: 'Navigate your inner landscape with wisdom and courage',
      lessons: [
        {
          id: 'inward-01-01',
          title: 'The Call to Journey Inward',
          chapterNumber: 1,
          lessonNumber: 1,
          filename: '01-01-the-call',
          load: () => loadLesson(
            './inward-journey/lessons/01-01-the-call',
            'inward-01-01',
            'The Call to Journey Inward'
          )
        },
        {
          id: 'inward-01-02',
          title: 'Creating Sacred Space',
          chapterNumber: 1,
          lessonNumber: 2,
          filename: '01-02-sacred-space',
          load: () => loadLesson(
            './inward-journey/lessons/01-02-sacred-space',
            'inward-01-02',
            'Creating Sacred Space'
          )
        },
        {
          id: 'inward-01-03',
          title: 'Tools for the Journey',
          chapterNumber: 1,
          lessonNumber: 3,
          filename: '01-03-tools',
          load: () => loadLesson(
            './inward-journey/lessons/01-03-tools',
            'inward-01-03',
            'Tools for the Journey'
          )
        }
      ],
      requiredProgress: 0
    }
  ]
};

// Path: Energy Bodies
export const energyBodiesPath: PathContent = {
  id: 'energy-bodies',
  title: 'Energy Bodies',
  chapters: [
    {
      id: 'energy-ch01-introduction',
      title: 'Introduction to Energy',
      description: 'Explore the subtle dimensions of your being',
      lessons: [
        {
          id: 'energy-01-01',
          title: 'The Subtle Body',
          chapterNumber: 1,
          lessonNumber: 1,
          filename: '01-01-subtle-body',
          load: () => loadLesson(
            './energy-bodies/lessons/01-01-subtle-body',
            'energy-01-01',
            'The Subtle Body'
          )
        },
        {
          id: 'energy-01-02',
          title: 'Sensing Energy',
          chapterNumber: 1,
          lessonNumber: 2,
          filename: '01-02-sensing-energy',
          load: () => loadLesson(
            './energy-bodies/lessons/01-02-sensing-energy',
            'energy-01-02',
            'Sensing Energy'
          )
        },
        {
          id: 'energy-01-03',
          title: 'Energy Hygiene',
          chapterNumber: 1,
          lessonNumber: 3,
          filename: '01-03-energy-hygiene',
          load: () => loadLesson(
            './energy-bodies/lessons/01-03-energy-hygiene',
            'energy-01-03',
            'Energy Hygiene'
          )
        }
      ],
      requiredProgress: 0
    }
  ]
};

// Master registry
export const pathsContentRegistry: Record<string, PathContent> = {
  'the-self': theSelfPath,
  'inward-journey': inwardJourneyPath,
  'energy-bodies': energyBodiesPath,
};

// Helper to get specific lesson
export async function getLesson(pathId: string, chapterId: string, lessonId: string) {
  const path = pathsContentRegistry[pathId];
  const chapter = path?.chapters.find(c => c.id === chapterId);
  const lesson = chapter?.lessons.find(l => l.id === lessonId);
  
  if (!lesson) {
    throw new Error(`Lesson ${lessonId} not found`);
  }
  
  return await lesson.load();
}

// Search functionality
export function searchContent(query: string) {
  const results = [];
  const searchTerm = query.toLowerCase().trim();
  
  for (const [pathId, path] of Object.entries(pathsContentRegistry)) {
    // Search paths
    if (path.title.toLowerCase().includes(searchTerm)) {
      results.push({
        type: 'path',
        id: pathId,
        title: path.title,
        match: 'title'
      });
    }
    
    // Search chapters and lessons
    for (const chapter of path.chapters) {
      if (chapter.title.toLowerCase().includes(searchTerm) ||
          chapter.description.toLowerCase().includes(searchTerm)) {
        results.push({
          type: 'chapter',
          pathId,
          id: chapter.id,
          title: chapter.title,
          description: chapter.description,
          match: chapter.title.toLowerCase().includes(searchTerm) ? 'title' : 'description'
        });
      }
      
      for (const lesson of chapter.lessons) {
        if (lesson.title.toLowerCase().includes(searchTerm)) {
          results.push({
            type: 'lesson',
            pathId,
            chapterId: chapter.id,
            id: lesson.id,
            title: lesson.title,
            chapter: `Ch ${lesson.chapterNumber}`,
            match: 'title'
          });
        }
      }
    }
  }
  
  return results.slice(0, 20);
}

// Utility to get all lessons for a path (useful for progress tracking)
export function getAllLessonsForPath(pathId: string): LessonReference[] {
  const path = pathsContentRegistry[pathId];
  if (!path) return [];
  
  return path.chapters.reduce((all, chapter) => {
    return [...all, ...chapter.lessons];
  }, [] as LessonReference[]);
}

// Utility to get lesson by filename (useful for migrations)
export function getLessonByFilename(pathId: string, filename: string): LessonReference | undefined {
  const lessons = getAllLessonsForPath(pathId);
  return lessons.find(l => l.filename === filename);
}