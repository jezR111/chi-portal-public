// src/app/auth/callback/route.ts
import { createServerClient } from '@/lib/db/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  console.log('Callback route hit!')
  
  const searchParams = request.nextUrl.searchParams
  const code = searchParams.get('code')
  const origin = request.nextUrl.origin
  
  if (code) {
    const supabase = createServerClient()
    
    try {
      const { error } = await supabase.auth.exchangeCodeForSession(code)
      
      if (error) {
        console.error('Auth exchange error:', error)
        return NextResponse.redirect(`${origin}/login?error=auth_failed`)
      }
      
      return NextResponse.redirect(`${origin}/yin`)
    } catch (err) {
      console.error('Callback error:', err)
      return NextResponse.redirect(`${origin}/login?error=callback_error`)
    }
  }
  
  return NextResponse.redirect(`${origin}/login`)
}