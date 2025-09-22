// src/features/yin/data/lessons/theSelf/overview/L0001-Self-Overview.ts

import { LessonContent } from '@/features/yin/types/lesson.types';

const L0001SelfOverview: LessonContent = {
  id: 'self-overview-1',
  type: 'mixed',
  sections: [
    {
      type: 'text',
      title: 'The Journey Into Self',
      content: `Well there's some pressure to get this chapter right isn't there? 😊

This is the title and foundation of the book as my own journey has been centred around the concept of Self.

I noticed some people have a strong sense of self from an early age. I wasn't one of those people. My sense of self fluctuated over the years with it being quite absent in the early years (before teens) then strengthened during my time as a teenager and then went through cycles of formation and dissolution from there on.

Having lost and regained myself 15+ times now, this process provided me with many insights, this chapter is the findings of this process...`
    },
    {
      type: 'text', 
      title: 'Your Starting Point',
      content: `Before we dive deeper, take a moment to reflect:

- How would you describe your current sense of self?
- Has your self-perception changed significantly over the years?
- What brought you to explore this journey of self-discovery?

There are no wrong answers - just honest observations.`
    },
    {
      type: 'text',
      title: 'The Core Journey',
      content: `The journey into self is the following:

- Self acceptance
- Ones potential
- Ones truth
- Wholeness
- Centredness
- Full expression
- Energy from outer to inner to outer

Each of these stages represents a crucial phase in understanding and embodying who you truly are.`
    }
  ],
  exercise: {
    type: 'journaling',
    title: 'Self-Reflection Exercise',
    duration: 10,
    instructions: [
      'Take out your journal or a piece of paper',
      'Write about a time when you felt most like yourself',
      'Write about a time when you felt completely lost',
      'What was different between these two experiences?',
      'What patterns do you notice in your relationship with yourself?',
      'Keep these reflections - we will return to them throughout your journey'
    ]
  },
  reflection: [
    {
      question: 'How connected do you feel to your authentic self right now?',
      type: 'rating'
    },
    {
      question: 'What aspect of self-discovery interests you most?',
      type: 'choice',
      options: [
        'Understanding my patterns',
        'Healing past wounds', 
        'Finding my purpose',
        'Developing self-love',
        'Spiritual growth'
      ]
    },
    {
      question: 'What brought you to this journey of self-discovery?',
      type: 'text'
    }
  ]
};

export default L0001SelfOverview;