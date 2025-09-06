// src/features/yin/data/lessonContent.ts

export interface LessonContent {
  id: string;
  type: 'video' | 'text' | 'audio' | 'mixed' | 'exercise';
  sections: LessonSection[];
  meditation?: MeditationContent;
  exercise?: ExerciseContent;
  reflection?: ReflectionPrompt[];
}

export interface LessonSection {
  type: 'text' | 'video' | 'audio' | 'quote' | 'image';
  content: string;
  duration?: number;
  title?: string;
}

export interface MeditationContent {
  title: string;
  duration: number;
  audioUrl?: string;
  guidance: string[];
}

export interface ExerciseContent {
  title: string;
  instructions: string[];
  duration: number;
  type: 'journaling' | 'movement' | 'breathing' | 'visualization';
}

export interface ReflectionPrompt {
  question: string;
  type: 'text' | 'rating' | 'choice';
  options?: string[];
}

// Sample lesson content for "Introduction to The Self"
export const lessonContents: Record<string, LessonContent> = {
  'self-overview-1': {
    id: 'self-overview-1',
    type: 'mixed',
    sections: [
      {
        type: 'text',
        title: 'Welcome to Your Journey',
        content: `
Welcome, beautiful soul, to the beginning of a profound journey—the journey back to yourself.

In this moment, as you read these words, you're taking the first step on a path that countless seekers have walked before you, yet one that is uniquely yours. The journey of self-discovery is both the most ancient and the most personal quest a human being can undertake.

### What is "The Self"?

The Self is not just who you think you are. It's not merely your name, your job, your relationships, or your achievements. The Self is the essence that remains when all the external identifiers fall away. It's the consciousness that observes your thoughts, the awareness behind your experiences, the unchanging presence that has been with you since your first memory.

### Why This Journey Matters

In our modern world, we're often pulled outward—toward achievements, distractions, and the endless demands of daily life. We lose touch with our inner compass, our authentic voice, our true nature. This disconnection is the root of much of our suffering, confusion, and sense of emptiness.

This journey is about coming home to yourself. It's about:
- Recognizing the patterns that no longer serve you
- Healing the wounds that keep you stuck
- Discovering your authentic expression
- Living from a place of wholeness rather than fragmentation
        `
      },
      {
        type: 'quote',
        content: '"The privilege of a lifetime is to become who you truly are." - Carl Jung'
      },
      {
        type: 'text',
        title: 'The Layers of Self',
        content: `
### Understanding Your Layers

Like an onion, the Self has many layers:

**1. The Surface Self**
This is the persona you present to the world—your social mask. It's necessary for functioning in society, but it's not the whole of who you are.

**2. The Emotional Self**
Beneath the surface lie your emotions, both those you express and those you hide. This layer holds your joys, fears, anger, and love.

**3. The Shadow Self**
Deeper still is the shadow—the parts of yourself you've rejected or hidden, often since childhood. These aren't necessarily "bad" parts; they're simply aspects you learned weren't acceptable.

**4. The Authentic Self**
At your core lies your authentic self—your true nature before conditioning, before wounds, before the world told you who to be.

**5. The Essential Self**
The deepest layer is pure consciousness itself—the observer, the witness, the eternal aspect of your being.
        `
      },
      {
        type: 'video',
        title: 'Watch: The Journey Inward',
        content: 'https://example.com/intro-video.mp4',
        duration: 5
      }
    ],
    meditation: {
      title: 'Meeting Yourself Meditation',
      duration: 10,
      guidance: [
        'Find a comfortable seated position and close your eyes.',
        'Take three deep breaths, releasing any tension with each exhale.',
        'Place your hand on your heart and feel its rhythm.',
        'Silently ask yourself: "Who am I beneath all the roles I play?"',
        'Don\'t search for an answer. Simply be present with the question.',
        'Notice what arises—thoughts, feelings, sensations.',
        'Welcome whatever comes without judgment.',
        'Rest in this space of open awareness for the next few minutes.',
        'When ready, slowly open your eyes and return to the room.'
      ]
    },
    reflection: [
      {
        question: 'What brought you to this journey of self-discovery?',
        type: 'text'
      },
      {
        question: 'How connected do you currently feel to your authentic self?',
        type: 'rating'
      },
      {
        question: 'What aspect of self-exploration interests you most?',
        type: 'choice',
        options: [
          'Healing past wounds',
          'Understanding my patterns',
          'Finding my purpose',
          'Developing self-love',
          'Spiritual awakening'
        ]
      }
    ]
  },

  'self-overview-2': {
    id: 'self-overview-2',
    type: 'mixed',
    sections: [
      {
        type: 'text',
        title: 'Mapping Your Personal Evolution',
        content: `
### The Journey of Becoming

Your journey of self-discovery is not a destination but an ongoing process of becoming. Like a river that constantly flows yet maintains its essential nature, you are both changing and changeless.

### The Cycles of Growth

Personal evolution doesn't happen in a straight line. It moves in spirals, where we revisit similar themes at deeper levels of understanding. You might notice patterns in your life:

**The Awakening Cycle**
- Something disrupts your normal life
- You question what you've taken for granted
- New awareness emerges
- You can never go back to not knowing

**The Integration Cycle**
- You discover something new about yourself
- There's resistance from old patterns
- A period of practice and patience
- Eventually, the new becomes natural

**The Expansion Cycle**
- You outgrow your current container
- Discomfort signals the need for change
- You step into a larger version of yourself
- A new baseline is established
        `
      },
      {
        type: 'text',
        title: 'Your Personal Map',
        content: `
### Creating Your Journey Map

As you progress through this program, you'll begin to see patterns in your own evolution. Consider these questions as waypoints on your map:

**Where You've Been**
- What experiences have shaped who you are?
- What wounds are asking for healing?
- What patterns keep repeating in your life?

**Where You Are**
- What is currently shifting within you?
- What feels stable and what feels in flux?
- What are you ready to release?

**Where You're Going**
- What is calling to you?
- What qualities want to emerge?
- Who are you becoming?
        `
      }
    ],
    exercise: {
      title: 'Journey Mapping Exercise',
      type: 'journaling',
      duration: 15,
      instructions: [
        'Take out your journal or a piece of paper',
        'Draw a timeline of your life from birth to now',
        'Mark the major turning points—moments when you changed',
        'Notice any patterns or cycles that repeat',
        'Circle three events that most shaped who you are today',
        'Write a brief reflection on what you notice',
        'Keep this map—we\'ll return to it throughout your journey'
      ]
    },
    reflection: [
      {
        question: 'What patterns did you notice in your life timeline?',
        type: 'text'
      },
      {
        question: 'What cycle are you currently in?',
        type: 'choice',
        options: ['Awakening', 'Integration', 'Expansion', 'Rest', 'Uncertainty']
      }
    ]
  },

  'self-overview-3': {
    id: 'self-overview-3',
    type: 'mixed',
    sections: [
      {
        type: 'text',
        title: 'Core Aspects of Being',
        content: `
### The Fundamental Elements

At your core, you are composed of several fundamental aspects that work together to create your experience of being human:

**Consciousness**
The aware presence that observes all experience. This is the "I Am" that has been constant throughout your life.

**Energy**
The life force that animates you. It flows through your body, emotions, and thoughts, creating your moment-to-moment experience.

**Intelligence**
Not just mental intelligence, but the wisdom of your body, the knowing of your heart, and the insight of your spirit.

**Love**
Your capacity for connection, compassion, and care—both for yourself and others.

**Will**
Your power to choose, to direct your energy, to create change in your life.

### The Dance of Being

These aspects don't exist in isolation. They dance together, creating the rich tapestry of your human experience:

- When **consciousness** meets **energy**, you experience aliveness
- When **intelligence** meets **love**, you find wisdom
- When **will** meets **consciousness**, you discover freedom
- When **energy** meets **love**, you feel passion
- When all five align, you experience wholeness
        `
      },
      {
        type: 'quote',
        content: '"You are not a drop in the ocean. You are the entire ocean in a drop." - Rumi'
      }
    ],
    meditation: {
      title: 'Connecting with Your Core',
      duration: 15,
      guidance: [
        'Sit comfortably and close your eyes',
        'Feel your consciousness—the aware presence reading these words',
        'Feel your energy—the aliveness in your body',
        'Feel your intelligence—the knowing beyond thought',
        'Feel your love—the warmth in your heart',
        'Feel your will—your power to choose',
        'Now feel all five aspects present at once',
        'Rest in this wholeness for the remainder of the meditation'
      ]
    }
  },

  // Inward Journey Lessons
  'inward-care-1': {
    id: 'inward-care-1',
    type: 'mixed',
    sections: [
      {
        type: 'text',
        title: 'Understanding Self-Care',
        content: `
### Beyond Bubble Baths

Self-care has become a buzzword, often reduced to face masks and spa days. While these can be beautiful practices, true self-care goes much deeper. It's about creating a sustainable relationship with yourself that honors your needs on all levels.

### What Self-Care Really Means

**Self-care is self-respect in action.**

It's the practice of treating yourself with the same kindness, attention, and respect you would offer to someone you love deeply. It's about:

- Recognizing your needs before you reach burnout
- Setting boundaries that protect your energy
- Nourishing your body, mind, and spirit consistently
- Making choices that support your long-term wellbeing
- Creating space for rest and renewal

### The Four Pillars of Self-Care

**1. Physical Care**
- Nourishing food that energizes you
- Movement that feels good in your body
- Adequate sleep and rest
- Medical care when needed

**2. Emotional Care**
- Processing feelings rather than suppressing them
- Seeking support when needed
- Engaging in activities that bring joy
- Practicing self-compassion

**3. Mental Care**
- Managing stress and overwhelm
- Engaging in learning and growth
- Taking breaks from mental stimulation
- Practicing mindfulness

**4. Spiritual Care**
- Connecting with purpose and meaning
- Spending time in nature
- Practicing gratitude
- Engaging in practices that connect you to something greater
        `
      }
    ],
    exercise: {
      title: 'Self-Care Assessment',
      type: 'journaling',
      duration: 10,
      instructions: [
        'Rate each area of self-care from 1-10',
        'Physical Care: How well are you caring for your body?',
        'Emotional Care: How well are you tending to your feelings?',
        'Mental Care: How well are you supporting your mind?',
        'Spiritual Care: How well are you nourishing your spirit?',
        'Circle the area that needs the most attention',
        'Write three small actions you could take this week in that area'
      ]
    }
  }
};

// Helper function to get lesson content
export const getLessonContent = (lessonId: string): LessonContent | null => {
  return lessonContents[lessonId] || null;
};