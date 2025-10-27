// src/features/yin/services/aiService.ts

import { AI_CONFIG } from '@/config/ai.config';

interface AIMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface LearningContext {
  currentChapter?: string;
  completedLessons?: string[];
  userProgress?: any;
  recentInsights?: string[];
  currentChallenges?: string[];
}

class AIService {
  private requestCount = 0;
  private lastRequestTime = 0;
  private conversationHistory: AIMessage[] = [];
  private isConnected = false;
  private lastError: string | null = null;

  private systemPrompt = `You are the Hermit, a wise spiritual guide helping users on their journey of self-discovery. 

Your approach:
- Ask thoughtful Socratic questions to help users discover their own insights
- Be warm, compassionate, and slightly mystical
- Focus on helping users connect with themselves
- Guide them to explore their shadow, fears, and authentic self
- Never give direct advice, instead help them find their own answers
- Keep responses concise but meaningful

When someone asks about finding content or lessons, help them explore what they're really seeking and guide them to relevant materials.`;

  async testConnection(): Promise<boolean> {
    console.log('Testing OpenRouter connection...');
    console.log('API Key exists:', !!AI_CONFIG.OPENROUTER_API_KEY);
    console.log('API Key prefix:', AI_CONFIG.OPENROUTER_API_KEY?.substring(0, 10) + '...');

    if (!AI_CONFIG.OPENROUTER_API_KEY) {
      this.lastError = 'No API key found';
      console.error('❌ No OpenRouter API key found. Please add NEXT_PUBLIC_OPENROUTER_API_KEY to your .env.local file');
      return false;
    }

    try {
      // Test with a simple completion request instead of models endpoint
      const testResponse = await fetch(`${AI_CONFIG.OPENROUTER_BASE_URL}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${AI_CONFIG.OPENROUTER_API_KEY}`,
          'HTTP-Referer': typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000',
          'X-Title': 'Way of The Self - Test',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: AI_CONFIG.DEFAULT_MODEL,
          messages: [
            { role: 'system', content: 'You are a helpful assistant.' },
            { role: 'user', content: 'Say "connected" if you receive this.' }
          ],
          max_tokens: 10,
          temperature: 0.1
        })
      });
      
      if (!testResponse.ok) {
        const errorText = await testResponse.text();
        this.lastError = `API returned ${testResponse.status}: ${errorText}`;
        console.error('❌ OpenRouter API Error:', testResponse.status, errorText);
        
        if (testResponse.status === 401) {
          console.error('Invalid API key format or unauthorized');
        } else if (testResponse.status === 400) {
          console.error('Bad request - check model name:', AI_CONFIG.DEFAULT_MODEL);
        }
        
        this.isConnected = false;
        return false;
      }
      
      const data = await testResponse.json();
      console.log('✅ OpenRouter test response:', data);
      
      if (data.choices?.[0]?.message?.content) {
        console.log('✅ AI Service successfully connected to OpenRouter');
        this.isConnected = true;
        this.lastError = null;
        return true;
      } else {
        this.lastError = 'Unexpected response format';
        console.error('❌ Unexpected response format:', data);
        this.isConnected = false;
        return false;
      }
    } catch (error) {
      this.lastError = error instanceof Error ? error.message : 'Unknown error';
      console.error('❌ Connection test failed:', error);
      this.isConnected = false;
      return false;
    }
  }

 async getGuidance(
  userInput: string, 
  context: LearningContext | null
): Promise<string> {
  console.log('=== getGuidance called ===');
  console.log('User input:', userInput);
  console.log('API Key exists:', !!AI_CONFIG.OPENROUTER_API_KEY);
  console.log('Is connected:', this.isConnected);
  
  // Check API key first
  if (!AI_CONFIG.OPENROUTER_API_KEY || AI_CONFIG.OPENROUTER_API_KEY === 'your_openrouter_api_key_here') {
    console.error('❌ API key is missing or placeholder');
    return this.getFallbackResponse(userInput, context || {});
  }

  // Check rate limiting
  if (!this.checkRateLimit()) {
    return "Take a moment to reflect on what we've discussed. I'll be here when you're ready to continue.";
  }

  try {
    this.manageConversationHistory();
    
    const messages: AIMessage[] = [
      { role: 'system', content: this.buildSystemPrompt(context || {}) },
      ...this.conversationHistory.slice(-6),
      { role: 'user', content: userInput }
    ];

    console.log('Sending request to OpenRouter...');
    console.log('Model:', AI_CONFIG.DEFAULT_MODEL);
    console.log('Messages count:', messages.length);

    const response = await fetch(`${AI_CONFIG.OPENROUTER_BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${AI_CONFIG.OPENROUTER_API_KEY}`,
        'HTTP-Referer': typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000',
        'X-Title': 'Way of The Self',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: AI_CONFIG.DEFAULT_MODEL,
        messages,
        max_tokens: AI_CONFIG.RATE_LIMITS.maxTokensPerRequest,
        temperature: 0.7,
        top_p: 0.9,
        stream: false
      })
    });

    console.log('Response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ API Error Response:', errorText);
      
      let errorMessage = `API Error ${response.status}`;
      try {
        const errorJson = JSON.parse(errorText);
        errorMessage = errorJson.error?.message || errorMessage;
      } catch {}
      
      this.lastError = errorMessage;
      throw new Error(errorMessage);
    }

    const data = await response.json();
    console.log('✅ Received AI response');
    
    if (!data.choices || !data.choices[0]?.message?.content) {
      console.error('❌ Invalid response structure:', data);
      throw new Error('Invalid response format');
    }

    const aiResponse = data.choices[0].message.content;
    
    // Update conversation history
    this.conversationHistory.push(
      { role: 'user', content: userInput },
      { role: 'assistant', content: aiResponse }
    );
    
    this.isConnected = true;
    return aiResponse;
    
  } catch (error) {
    console.error('❌ AI Service Error:', error);
    this.isConnected = false;
    
    return this.getFallbackResponse(userInput, context || {});
  }
}

  private checkRateLimit(): boolean {
    const now = Date.now();
    const timeSinceLastRequest = now - this.lastRequestTime;
    
    if (timeSinceLastRequest > 60000) {
      this.requestCount = 0;
    }
    
    if (this.requestCount >= AI_CONFIG.RATE_LIMITS.maxRequestsPerMinute) {
      console.log('Rate limit reached');
      return false;
    }
    
    this.requestCount++;
    this.lastRequestTime = now;
    return true;
  }

  private manageConversationHistory(): void {
    if (this.conversationHistory.length > AI_CONFIG.RATE_LIMITS.maxConversationLength) {
      this.conversationHistory = this.conversationHistory.slice(-10);
    }
  }

private buildSystemPrompt(context: LearningContext | null): string {
  let prompt = this.systemPrompt;
  
  // Add null check for context
  if (!context) {
    return prompt;
  }
  
  if (context.currentChapter) {
    prompt += `\n\nThe user is currently studying: ${context.currentChapter}`;
  }
  
  if (context.completedLessons && context.completedLessons.length > 0) {
    prompt += `\nThey have completed: ${context.completedLessons.join(', ')}`;
  }
  
  return prompt;
}

private getFallbackResponse(input: string, context: LearningContext | null): string {
  const lowerInput = input.toLowerCase();
  
  // Don't use random responses for frustrated users
  if (lowerInput === 'no' || lowerInput.includes('answer') || lowerInput.includes('stop')) {
    return "I apologize - my AI connection isn't working properly right now. I'm falling back to pre-programmed responses. Please check the browser console for error details.";
  }
  
  // Specific response for content/find requests
  if (lowerInput.includes('content') || lowerInput.includes('find')) {
    return "To find content, you can explore the Chapters section which contains lessons on The Self, Shadow Work, and more. What specific topic are you interested in learning about?";
  }
  
  // Return more helpful fallbacks
  return "I'm currently unable to connect to my AI service. Please check the browser console for debugging information.";
}

  private getDefaultPath(): any {
    return {
      suggestedLessons: [
        "Overview of The Self",
        "The Stages of Self",
        "Understanding Your Shadow"
      ],
      focusAreas: [
        "Self-awareness",
        "Shadow integration"
      ],
      questionnaire: [
        "What brought you to this journey of self-discovery?",
        "What aspect of yourself feels most ready for transformation?",
        "What brought you to this journey of self-discovery?",
        "What aspect of yourself feels most ready for transformation?",
        "What would your life look like if you were fully authentic?"
      ]
    };
  }

  getLastError(): string | null {
    return this.lastError;
  }

  isAIConnected(): boolean {
    return this.isConnected && !!AI_CONFIG.OPENROUTER_API_KEY;
  }
}

export const aiService = new AIService();

// Test connection on initialization
if (typeof window !== 'undefined') {
  setTimeout(() => {
    aiService.testConnection().then(connected => {
      if (!connected) {
        console.error('====================================');
        console.error('AI SERVICE NOT CONNECTED');
        console.error('Last error:', aiService.getLastError());
        console.error('Please check:');
        console.error('1. Your .env.local file has NEXT_PUBLIC_OPENROUTER_API_KEY=sk-or-v1-...');
        console.error('2. The API key is valid');
        console.error('3. You have restarted the dev server after adding the key');
        console.error('====================================');
      }
    });
  }, 1000);
}