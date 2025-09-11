// src/app/auth/callback/route.ts
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  console.log('Callback route hit!')
  try {
    const { createServerClient } = await import('@/lib/db/supabase/server')
    console.log('Server client imported successfully')
    // --- original logic below ---
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
  } catch (error) {
    console.error('Import error:', error)
    return new Response('Server Error', { status: 500 })
  }
}