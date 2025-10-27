// src/config/ai.config.ts
// version 1.0.0

// Free and affordable AI models on OpenRouter
export const AI_MODELS = {
  // Free models
  FREE: {
    MISTRAL_NEMO: 'mistralai/mistral-nemo:free',
    MYTHOMAX: 'gryphe/mythomax-l2-13b:free',
    TOPPY: 'undi95/toppy-m-7b:free',
    CINEMATIKA: 'openrouter/cinematika-7b:free',
    NEURAL_CHAT: 'intel/neural-chat-7b:free',
  },
  
  // Very affordable models (< $0.001 per 1k tokens)
  BUDGET: {
    MISTRAL_7B: 'mistralai/mistral-7b-instruct', // $0.00007/1k
    GEMMA_7B: 'google/gemma-7b-it', // $0.00007/1k
    LLAMA_3_8B: 'meta-llama/llama-3-8b-instruct', // $0.00007/1k
    MIXTRAL: 'mistralai/mixtral-8x7b-instruct', // $0.00027/1k
    NOUS_HERMES: 'nousresearch/nous-hermes-2-mixtral-8x7b-dpo', // $0.00027/1k
  },
  
  // Mid-tier models ($0.001-0.005 per 1k tokens)
  STANDARD: {
    CLAUDE_HAIKU: 'anthropic/claude-3-haiku', // $0.00025/$0.00125
    GPT_3_5: 'openai/gpt-3.5-turbo', // $0.0005/$0.0015
    GEMINI_PRO: 'google/gemini-pro', // $0.000125/$0.000375
    LLAMA_3_70B: 'meta-llama/llama-3-70b-instruct', // $0.00059/$0.00079
  },
  
  // Premium models (when you need the best)
  PREMIUM: {
    CLAUDE_SONNET: 'anthropic/claude-3.5-sonnet', // $0.003/$0.015
    GPT_4_TURBO: 'openai/gpt-4-turbo', // $0.01/$0.03
    CLAUDE_OPUS: 'anthropic/claude-3-opus', // $0.015/$0.075
  }
};

export const AI_CONFIG = {
  // Default to free model
  DEFAULT_MODEL: AI_MODELS.FREE.MISTRAL_NEMO,
  
  // OpenRouter configuration
  OPENROUTER_API_KEY: process.env.NEXT_PUBLIC_OPENROUTER_API_KEY || '',
  OPENROUTER_BASE_URL: 'https://openrouter.ai/api/v1',
  
  // Model selection based on use case
  MODELS_BY_USE_CASE: {
    general_chat: AI_MODELS.FREE.MISTRAL_NEMO,
    deep_reflection: AI_MODELS.FREE.MISTRAL_NEMO, // Upgrade to BUDGET.MIXTRAL later
    content_analysis: AI_MODELS.FREE.MISTRAL_NEMO,
    personalization: AI_MODELS.FREE.MISTRAL_NEMO,
  },
  
  // Rate limiting for free tier
  RATE_LIMITS: {
    maxRequestsPerMinute: 10,
    maxTokensPerRequest: 500,
    maxConversationLength: 20, // messages
  }
};