// src/features/yin/data/lessonContent.ts

import { theSelfLessons } from './lessons/theSelf';

export const lessonContents = {
  ...theSelfLessons,
  // Placeholders for lessons not yet created - these also need to match chaptersData.ts
  'self-overview-2': {
    id: 'self-overview-2',
    type: 'mixed',
    sections: [{ type: 'text', title: 'Coming Soon', content: 'Content being prepared...' }]
  },
  'self-overview-3': {
    id: 'self-overview-3',
    type: 'mixed',
    sections: [{ type: 'text', title: 'Coming Soon', content: 'Content being prepared...' }]
  },
  'self-overview-4': {
    id: 'self-overview-4',
    type: 'mixed',
    sections: [{ type: 'text', title: 'Coming Soon', content: 'Content being prepared...' }]
  }
};

export const getLessonContent = (lessonId: string) => {
  return lessonContents[lessonId] || null;
};