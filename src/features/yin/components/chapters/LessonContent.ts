// src/features/yin/components/chapters/lessonContent.ts - Example lessons with rich content

export const lessonContent = {
  "the-self-overview-1": {
    id: "the-self-overview-1",
    title: "Understanding Your True Nature",
    duration: 15,
    xpReward: 10,
    sections: [
      {
        type: "text",
        content: `
          Welcome to your journey of self-discovery. In this foundational lesson, 
          we explore the difference between who you think you are and who you truly are.
          
          The Self is not your thoughts, emotions, or experiences - it is the conscious 
          awareness that observes all of these. Like the sky that remains unchanged by 
          passing clouds, your true nature remains constant beneath the flux of daily life.
        `
      },
      {
        type: "quote",
        content: "You are not a drop in the ocean. You are the entire ocean in a drop.",
        author: "Rumi"
      },
      {
        type: "meditation",
        title: "Awareness Meditation",
        duration: 5,
        instructions: [
          "Find a comfortable seated position",
          "Close your eyes and take three deep breaths",
          "Notice the sensation of breathing without controlling it",
          "When thoughts arise, simply observe them like clouds passing",
          "Return attention to the breath whenever you notice you've wandered"
        ]
      },
      {
        type: "reflection",
        prompt: "What aspects of yourself feel most permanent? What feels temporary?",
        inputType: "text"
      }
    ]
  },
  
  "the-self-overview-2": {
    id: "the-self-overview-2", 
    title: "The Observer and the Observed",
    duration: 20,
    xpReward: 10,
    prerequisite: "the-self-overview-1", // Sequential unlock
    sections: [
      {
        type: "video",
        url: "/videos/observer-consciousness.mp4",
        thumbnail: "/images/observer-thumb.jpg",
        duration: 8
      },
      {
        type: "text",
        content: `
          Building on our previous exploration, today we dive deeper into the 
          relationship between consciousness (the observer) and its contents 
          (the observed). This fundamental distinction is key to spiritual awakening.
        `
      },
      {
        type: "exercise",
        title: "Witnessing Practice",
        instructions: [
          "Set a timer for 10 minutes",
          "Sit comfortably and observe your thoughts",
          "Label each thought as 'thinking' without judgment",
          "Notice the space between thoughts",
          "Rest in that spacious awareness"
        ]
      },
      {
        type: "journaling",
        prompts: [
          "What did you notice during the witnessing practice?",
          "How does it feel to observe thoughts without engaging?",
          "What insights arose about your true nature?"
        ]
      }
    ]
  },
  
  "the-self-overview-3": {
    id: "the-self-overview-3",
    title: "Beyond Identification",
    duration: 25,
    xpReward: 10,
    prerequisite: "the-self-overview-2",
    sections: [
      {
        type: "audio",
        url: "/audio/guided-inquiry.mp3",
        title: "Guided Self-Inquiry",
        duration: 12
      },
      {
        type: "text",
        content: `
          Who are you when you strip away all labels, roles, and identities? 
          This lesson explores the process of dis-identification - learning to 
          recognize what you are not, to discover what you truly are.
        `
      },
      {
        type: "interactive",
        component: "IdentityLayers", // Custom interactive component
        data: {
          layers: ["Professional Role", "Relationships", "Beliefs", "Body", "Mind", "Awareness"]
        }
      },
      {
        type: "integration",
        title: "Daily Practice",
        content: `
          Throughout your day, pause and ask yourself: "Who is experiencing this?"
          Notice how awareness remains constant while experiences change.
          Record your observations in your journal tonight.
        `
      }
    ]
  }
};