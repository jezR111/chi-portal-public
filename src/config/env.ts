import { z } from 'zod'

/**
 * Environment variable schema with validation
 * Ensures all required env vars are present and properly typed
 */
const envSchema = z.object({
  // Application
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  NEXT_PUBLIC_APP_URL: z.string().url(),
  NEXT_PUBLIC_APP_NAME: z.string().default('Chi Portal'),
  
  // Database
  DATABASE_URL: z.string().min(1),
  DATABASE_POOL_MIN: z.string().transform(Number).default('2'),
  DATABASE_POOL_MAX: z.string().transform(Number).default('10'),
  
  // Redis
  REDIS_URL: z.string().optional(),
  UPSTASH_REDIS_REST_URL: z.string().min(1),
  UPSTASH_REDIS_REST_TOKEN: z.string().min(1),
  
  // Authentication
  JWT_SECRET: z.string().min(32),
  JWT_REFRESH_SECRET: z.string().min(32),
  MAGIC_LINK_SECRET: z.string().min(32),
  
  // Google OAuth
  GOOGLE_CLIENT_ID: z.string().min(1),
  GOOGLE_CLIENT_SECRET: z.string().min(1),
  
  // Email
  RESEND_API_KEY: z.string().min(1),
  EMAIL_FROM: z.string().email(),
  
  // Storage (Cloudflare R2)
  R2_ACCOUNT_ID: z.string().optional(),
  R2_ACCESS_KEY_ID: z.string().optional(),
  R2_SECRET_ACCESS_KEY: z.string().optional(),
  R2_BUCKET_NAME: z.string().optional(),
  R2_PUBLIC_URL: z.string().url().optional(),
  
  // Payments (Stripe)
  STRIPE_SECRET_KEY: z.string().optional(),
  STRIPE_WEBHOOK_SECRET: z.string().optional(),
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: z.string().optional(),
  
  // AI Services
  OPENAI_API_KEY: z.string().optional(),
  ANTHROPIC_API_KEY: z.string().optional(),
  GOOGLE_AI_API_KEY: z.string().optional(),
  
  // AI Rate Limits
  AI_CHAT_LIMIT_FREE: z.string().transform(Number).default('10'),
  AI_CHAT_LIMIT_PREMIUM: z.string().transform(Number).default('500'),
  AI_JOURNAL_LIMIT_FREE: z.string().transform(Number).default('20'),
  AI_JOURNAL_LIMIT_PREMIUM: z.string().transform(Number).default('1000'),
  
  // Feature Flags
  ENABLE_AI_CHAT: z.string().transform(v => v === 'true').default('true'),
  ENABLE_COMMUNITY: z.string().transform(v => v === 'true').default('true'),
  ENABLE_YANG_REALM: z.string().transform(v => v === 'true').default('true'),
  ENABLE_ACHIEVEMENTS: z.string().transform(v => v === 'true').default('true'),
  
  // Analytics (optional)
  POSTHOG_KEY: z.string().optional(),
  MIXPANEL_TOKEN: z.string().optional(),
  
  // Monitoring (optional)
  SENTRY_DSN: z.string().optional(),
  LOGTAIL_SOURCE_TOKEN: z.string().optional(),
})

type Env = z.infer<typeof envSchema>

// Parse and validate environment variables
const parseEnv = (): Env => {
  try {
    return envSchema.parse(process.env)
  } catch (error) {
    if (error instanceof z.ZodError) {
      const missing = error.errors
        .filter(err => err.message === 'Required')
        .map(err => err.path.join('.'))
      
      const invalid = error.errors
        .filter(err => err.message !== 'Required')
        .map(err => `${err.path.join('.')}: ${err.message}`)
      
      console.error('❌ Environment validation failed:')
      if (missing.length > 0) {
        console.error('Missing variables:', missing.join(', '))
      }
      if (invalid.length > 0) {
        console.error('Invalid variables:', invalid.join(', '))
      }
      
      throw new Error('Environment validation failed')
    }
    throw error
  }
}

// Export validated environment variables
export const env = parseEnv()

// Type-safe environment helpers
export const isDev = env.NODE_ENV === 'development'
export const isProd = env.NODE_ENV === 'production'
export const isTest = env.NODE_ENV === 'test'

// Feature flag helpers
export const features = {
  aiChat: env.ENABLE_AI_CHAT,
  community: env.ENABLE_COMMUNITY,
  yangRealm: env.ENABLE_YANG_REALM,
  achievements: env.ENABLE_ACHIEVEMENTS,
} as const

// AI limits by tier
export const aiLimits = {
  chat: {
    free: env.AI_CHAT_LIMIT_FREE,
    premium: env.AI_CHAT_LIMIT_PREMIUM,
  },
  journal: {
    free: env.AI_JOURNAL_LIMIT_FREE,
    premium: env.AI_JOURNAL_LIMIT_PREMIUM,
  },
} as const