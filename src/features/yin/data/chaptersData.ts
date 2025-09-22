// src/features/yin/data/chaptersData.ts

export function getChaptersForPath(pathId: string): Chapter[] {
  switch(pathId) {
    case 'the-self':
      return [
        {
          id: 'the-self-overview',
          title: 'Overview of The Self',
          subtitle: 'Foundation principles',
          description: 'Get a comprehensive understanding...',
          lessons: [
            {
              id: 'L0001-self-overview',  // This MUST match the key in theSelfLessons
              title: 'The Journey Into Self',
              description: 'Understanding the foundation of your personal journey',
              duration: 15,
              xpReward: 10,
              type: 'content'
            },
            // more lessons
          ]
        }
      ];
    // other cases
  }
}