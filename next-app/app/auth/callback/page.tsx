'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createBrowserClient } from '../../../utils/supabase/client'

export default function AuthCallbackPage() {
  const router = useRouter()
  const [message, setMessage] = useState('Finalizing sign-in...')

  useEffect(() => {
    const supabase = createBrowserClient()

    supabase.auth.getSessionFromUrl({ storeSession: true })
      .then(({ data, error }) => {
        if (error || !data?.session) {
          setMessage(error?.message ?? 'OAuth callback failed.')
          return
        }
        router.replace('/dashboard')
      })
      .catch((err) => setMessage((err as Error).message || 'Unable to complete authentication.'))
  }, [router])

  return (
    <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center' }}>
      <div style={{ padding: 24, borderRadius: 16, background: 'rgba(0,0,0,0.48)', color: 'white' }}>
        <h1>Completing authentication...</h1>
        <p>{message}</p>
      </div>
    </div>
  )
}
