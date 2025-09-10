// src/app/auth/callback/route.ts
import { createServerClient } from '@/lib/db/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const error = requestUrl.searchParams.get('error')
  const origin = requestUrl.origin
  
  if (error) {
    // Handle errors from Supabase
    return NextResponse.redirect(`${origin}/login?error=${error}`)
  }

  if (code) {
    const supabase = createServerClient()
    
    try {
      const { error } = await supabase.auth.exchangeCodeForSession(code)
      
      if (error) {
        console.error('Auth exchange error:', error)
        return NextResponse.redirect(`${origin}/login?error=auth_failed`)
      }
      
      // Successfully authenticated
      return NextResponse.redirect(`${origin}/yin`)
    } catch (err) {
      console.error('Callback error:', err)
      return NextResponse.redirect(`${origin}/login?error=callback_error`)
    }
  }

  // No code or error, redirect to login
  return NextResponse.redirect(`${origin}/login`)
}