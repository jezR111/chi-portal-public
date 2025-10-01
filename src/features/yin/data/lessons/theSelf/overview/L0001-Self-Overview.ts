// src/features/yin/data/lessons/theSelf/overview/L0001-Self-Overview.ts
// Version: 2.1.0 - Working Lesson File
// Last Updated: 2024-01-20

import { Lesson } from '../../../../types/lesson.types';

const lesson: Lesson = {
  id: 'the-self-intro-001',
  title: 'Awakening to the Self',
  subtitle: 'Your First Step on the Journey Within',
  duration: 15,
  xpReward: 30,
  
  objectives: [
    'Understand the concept of the authentic self',
    'Recognize the difference between ego and true self',
    'Begin your practice of self-observation'
  ],

  sections: [
    {
      id: 'intro',
      type: 'content',
      title: 'Welcome to Your Journey',
      content: `
# Welcome, Seeker

You stand at the threshold of a profound journey—not outward into the world, but inward into the vast landscape of your own being.

This path you're about to walk has been traveled by mystics, philosophers, and seekers throughout human history. Each step you take adds your unique footprint to this ancient way.

## Why This Journey Matters

In our modern world, we're constantly pulled outward:
- Social media demands our attention
- Work consumes our energy
- Endless distractions fragment our focus

Yet the most important relationship—the one with ourselves—often remains unexplored.

*This changes today.*
      `,
      insightPrompt: 'What brought you to this moment of seeking?',
      estimatedDuration: 3
    },
    {
      id: 'concept',
      type: 'content',
      title: 'The Authentic Self vs. The Ego',
      content: `
## Two Selves Within

Within you exist two aspects of self:

### The Ego-Self
- The constructed identity
- Built from external validation
- Driven by fear and desire
- Always comparing, judging, seeking

### The Authentic Self
- Your essential nature
- Present before conditioning
- Naturally peaceful and whole
- The observer behind all experience

## A Simple Practice

Close your eyes for a moment. 

Notice your thoughts... 

Now notice that you're *aware* of your thoughts.

**That awareness—that's your authentic self observing.**

The thoughts, emotions, and sensations are like clouds passing through the sky of your consciousness. You are the sky itself—vast, unchanging, and free.
      `,
      practicePrompt: 'Take 2 minutes to observe your thoughts without judgment',
      estimatedDuration: 5
    },
    {
      id: 'shadow-intro',
      type: 'interactive',
      title: 'Meeting Your Shadow',
      content: `
## The Hidden Self

Carl Jung spoke of the "shadow"—the parts of ourselves we've hidden, rejected, or denied.

Your shadow isn't your enemy. It's the guardian of your wholeness, holding the pieces of you that await integration.

### Shadow Recognition Exercise

Think of someone who really irritates you. What specific quality bothers you most?

Now, gently ask yourself:
- Where might this quality exist within me?
- How have I rejected this part of myself?
- What would accepting this aspect look like?

**Remember:** This isn't about judgment. It's about wholeness.
      `,
      interactionType: 'reflection',
      reflectionQuestions: [
        'What quality in others triggers you most?',
        'How might this be a reflection of your own shadow?',
        'What would integrating this quality with compassion look like?'
      ],
      estimatedDuration: 4
    },
    {
      id: 'practice',
      type: 'meditation',
      title: 'Your First Practice: Witness Consciousness',
      content: `
## Becoming the Witness

Let's establish your foundational practice—one you'll return to throughout this journey.

### The Practice

1. **Find Your Seat**
   - Sit comfortably, spine naturally upright
   - Hands resting gently
   - Eyes closed or soft gaze

2. **Establish Presence**
   - Take three conscious breaths
   - Feel your body in space
   - Arrive fully in this moment

3. **Become the Witness**
   - Notice thoughts arising and passing
   - Notice emotions flowing through
   - Notice sensations in the body
   - Remain as the observer of all

4. **Rest in Awareness**
   - You are not your thoughts
   - You are not your emotions
   - You are the awareness itself
   - Rest here for 5 minutes

### Integration

After your practice, carry this witness consciousness into your day. Can you maintain this observer perspective during:
- Conversations?
- Work tasks?
- Emotional moments?

This is your practice—becoming the witness of your own experience.
      `,
      meditationDuration: 5,
      meditationPrompts: [
        'Notice thoughts without following them',
        'Return to the observer perspective',
        'Rest in pure awareness'
      ],
      estimatedDuration: 7
    },
    {
      id: 'closing',
      type: 'content',
      title: 'Carrying It Forward',
      content: `
## Your Journey Has Begun

You've taken the first step on the path of self-discovery. This isn't just learning—it's remembering who you truly are.

### Three Keys to Remember

1. **You are not your thoughts**—you are the awareness observing them
2. **Your shadow holds your wholeness**—integration, not rejection, is the path
3. **Practice makes presence**—return to witness consciousness throughout your day

### Your Daily Practice

Before you continue to the next lesson, commit to:
- 5 minutes of witness consciousness meditation each morning
- One moment of shadow recognition each day
- Three conscious breaths whenever you feel reactive

## Until We Meet Again

The path of self-discovery is not always easy, but it is always worthwhile. Each step reveals more of your true nature—infinite, whole, and free.

*Walk gently, observe deeply, and trust the journey.*
      `,
      insightPrompt: 'What is your biggest takeaway from this lesson?',
      estimatedDuration: 3
    }
  ],

  insightTriggers: [
    'What brought you to seek your authentic self?',
    'How does your ego-self differ from your true nature?',
    'What shadow aspect are you ready to integrate?'
  ],

  practiceIntegration: {
    daily: [
      '5-minute witness consciousness meditation',
      'Three moments of conscious breathing',
      'One shadow recognition practice'
    ],
    weekly: [
      'Journal about your observer experiences',
      'Practice maintaining witness consciousness during a challenging conversation',
      'Identify and dialogue with one shadow aspect'
    ]
  },

  prerequisites: [],
  nextLessons: ['the-self-intro-002']
};

export default lesson;