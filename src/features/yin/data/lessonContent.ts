// Add this to your src/features/yin/data/lessonContent.ts file

// If lessonContents doesn't exist, create it:
export const lessonContents: Record<string, any> = {
  // Chapter 1: Overview of The Self
  'L0001-self-overview': {
    sections: [
      {
        type: 'text',
        title: 'Welcome to Your Journey',
        content: `Welcome to the profound journey of self-discovery. In this foundational lesson, we'll explore what it means to truly know yourself beyond the surface level of daily thoughts and emotions.

The journey inward is perhaps the most important journey you'll ever take. It's not about becoming someone different, but about uncovering who you already are beneath the layers of conditioning, expectations, and assumed identities.

As we begin, remember that self-discovery is not a destination but an ongoing process of awareness, acceptance, and integration.`
      },
      {
        type: 'text',
        title: 'The Nature of Self',
        content: `What is the self? This question has been pondered by philosophers, mystics, and seekers throughout human history. At its core, the self is both the observer and the observed - the awareness that witnesses your thoughts, feelings, and experiences, as well as the sum of those experiences themselves.

Consider for a moment: Who is reading these words? There's the part of you processing the information, but there's also an awareness behind that process - a witness to your own thinking.

This dual nature of self - as both participant and observer - forms the foundation of our exploration.`
      },
      {
        type: 'quote',
        content: 'Know thyself, and you shall know the universe and the gods.'
      }
    ],
    meditation: {
      title: 'Self-Awareness Meditation',
      duration: 5,
      guidance: [
        'Find a comfortable position and close your eyes',
        'Take three deep breaths, releasing tension with each exhale',
        'Notice the sensation of being aware - not thinking about awareness, but the direct experience of it',
        'Rest in this simple awareness for the next few minutes',
        'When thoughts arise, simply notice them and return to awareness itself'
      ]
    },
    reflection: [
      {
        question: 'What brought you to this journey of self-discovery?',
        type: 'text'
      },
      {
        question: 'How would you describe yourself without using any external labels (job, relationships, etc.)?',
        type: 'text'
      }
    ]
  },

  'L0002-observer-observed': {
    sections: [
      {
        type: 'text',
        title: 'The Dance of Consciousness',
        content: `In every moment of awareness, there exists a fascinating duality - you are simultaneously the one who observes and that which is observed. This isn't a philosophical abstraction, but a living reality you can explore right now.

When you notice a thought, who notices? When you feel an emotion, who feels? There's the thought or emotion itself, and there's the awareness of it. This distinction is crucial for developing true self-knowledge.`
      },
      {
        type: 'text',
        title: 'Practical Exploration',
        content: `Let's explore this directly. As you read these words, notice that there are multiple layers to your experience:

1. The visual perception of the text
2. The mental process of understanding the words
3. Any thoughts or reactions arising in response
4. The awareness that witnesses all of the above

That witnessing awareness - that's the observer. Everything else - thoughts, sensations, emotions - that's the observed. Neither is more 'you' than the other; both are aspects of your complete self.`
      }
    ],
    exercise: {
      title: 'Observer Practice',
      type: 'awareness',
      duration: 10,
      instructions: [
        'Set a timer for 10 minutes',
        'Sit comfortably and observe your thoughts without judgment',
        'Notice when you get caught up in a thought',
        'Gently return to the position of observer',
        'Note the difference between being lost in thought and observing thought'
      ]
    }
  },

  'L0003-beginning-practice': {
    sections: [
      {
        type: 'text',
        title: 'Establishing Your Practice',
        content: `Self-discovery requires more than intellectual understanding - it requires consistent practice. Today, we'll establish the foundations of a sustainable practice that will support your journey.

A practice doesn't need to be complex or time-consuming. In fact, the most powerful practices are often the simplest. What matters is consistency and sincere engagement.`
      },
      {
        type: 'text',
        title: 'The Three Pillars',
        content: `Your practice will rest on three essential pillars:

**1. Daily Check-in:** A brief moment each morning to connect with yourself before the day begins.

**2. Mindful Moments:** Short pauses throughout the day to return to present awareness.

**3. Evening Reflection:** A gentle review of the day's experiences and insights.

These three simple practices create a container for continuous self-discovery.`
      }
    ],
    exercise: {
      title: 'Create Your Practice Schedule',
      type: 'planning',
      duration: 15,
      instructions: [
        'Choose a specific time for your morning check-in (even just 2 minutes)',
        'Identify 3 moments in your day when you can pause for mindful awareness',
        'Set an evening time for 5 minutes of reflection',
        'Write down your commitment and place it somewhere visible',
        'Start tomorrow with just the morning practice, adding others gradually'
      ]
    }
  },

  // Add more lessons as needed...
  'L0004-understanding-shadow': {
    sections: [
      {
        type: 'text',
        title: 'Meeting the Shadow',
        content: `The shadow represents the parts of ourselves we've hidden, rejected, or denied. These aren't necessarily negative aspects - they're simply parts we've learned to suppress, often from early childhood.

Understanding your shadow is crucial for wholeness. What we deny in ourselves, we often project onto others. What we resist persists. By bringing loving awareness to these hidden aspects, we reclaim our full power and authenticity.`
      }
    ]
  },

  'L0005-ego-development': {
    sections: [
      {
        type: 'text',
        title: 'Understanding the Ego',
        content: `The ego often gets a bad reputation in spiritual circles, but it's actually an essential part of healthy psychological development. The ego is your interface with the world - it helps you navigate daily life, maintain boundaries, and function in society.

The goal isn't to destroy the ego, but to understand it, work with it skillfully, and not let it run the entire show.`
      }
    ]
  }
};

// Main function to get lesson content
export function getLessonContent(lessonId: string) {
  const content = lessonContents[lessonId];
  
  if (!content) {
    console.warn(`No content found for lesson: ${lessonId}`);
    // Return a placeholder structure
    return {
      sections: [
        {
          type: 'text',
          title: 'Content Coming Soon',
          content: `The content for this lesson (${lessonId}) is being prepared. Check back soon for the full lesson experience.`
        }
      ]
    };
  }
  
  return content;
}

// Helper to list all available lesson IDs
export function getAvailableLessonIds() {
  return Object.keys(lessonContents);
}