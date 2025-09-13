// src/app/test-auth/page.tsx
'use client'

import { createClient } from '@/lib/db/supabase/client'
import { useEffect, useState } from 'react'

export default function TestAuth() {
  const [session, setSession] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('Test page session:', session)
      setSession(session)
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        console.log('Test page auth change:', _event)
        setSession(session)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  if (loading) return <div>Loading...</div>

  return (
    <div className="p-8">
      <h1>Auth Test</h1>
      {session ? (
        <div>
          <p>Logged in as: {session.user.email}</p>
          <button onClick={() => supabase.auth.signOut()}>Sign Out</button>
        </div>
      ) : (
        <p>Not logged in</p>
      )}
    </div>
  )
}