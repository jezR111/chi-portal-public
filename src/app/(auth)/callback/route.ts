// src/app/auth/callback/route.ts
import { createServerClient } from '@/lib/db/supabase/client'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const error = requestUrl.searchParams.get('error')
  
  if (error) {
    // Handle errors
    return NextResponse.redirect(new URL(`/login?error=${error}`, request.url))
  }

  if (code) {
    const supabase = createServerClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (error) {
      return NextResponse.redirect(new URL('/login?error=auth_failed', request.url))
    }
  }

  // Redirect to Yin realm after successful auth
  return NextResponse.redirect(new URL('/yin', request.url))
}