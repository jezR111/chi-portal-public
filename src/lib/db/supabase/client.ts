// src/lib/supabase/client.ts
import { createClient } from '@/lib/db/supabase/client'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

// For client components
export const createClient = () => {
  return createClient()
}

// For server components/route handlers
export const createServerClient = () => {
  const cookieStore = cookies()
  return createRouteHandlerClient({ cookies: () => cookieStore })
}