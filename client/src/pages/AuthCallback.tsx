import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '@/services/supabase'

export default function AuthCallback() {
  const navigate = useNavigate()
  const [message, setMessage] = useState('Finalizing sign-in...')

  useEffect(() => {
    supabase.auth.getSessionFromUrl({ storeSession: true })
      .then(({ data, error }) => {
        if (error || !data?.session) {
          setMessage(error?.message ?? 'OAuth callback failed.')
          return
        }
        // Session stored in Supabase client storage; navigate to dashboard
        navigate('/dashboard', { replace: true })
      })
      .catch((err) => setMessage((err as Error).message || 'Unable to complete authentication.'))
  }, [navigate])

  return (
    <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center' }}>
      <div style={{ padding: 20, borderRadius: 12, background: 'rgba(0,0,0,0.5)', color: 'white' }}>
        <h2>Completing authentication...</h2>
        <p>{message}</p>
      </div>
    </div>
  )
}
