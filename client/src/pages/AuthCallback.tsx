import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '@/services/supabase'

export default function AuthCallback() {
  const navigate = useNavigate()
  const [message, setMessage] = useState('Finalizing sign-in...')

  useEffect(() => {
    let isMounted = true

    const handleAuth = async () => {
      try {
        const params = new URLSearchParams(window.location.search)
        const code = params.get('code')

        if (code) {
          const { error } = await supabase.auth.exchangeCodeForSession(code)
          if (error) throw error
        }

        const { data: { session }, error } = await supabase.auth.getSession()
        if (error) throw error

        if (session && isMounted) {
          navigate('/dashboard', { replace: true })
          return
        }

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, newSession) => {
          if (newSession && isMounted) {
            navigate('/dashboard', { replace: true })
          }
        })

        const timeout = setTimeout(() => {
          if (isMounted) {
            navigate('/dashboard', { replace: true })
          }
        }, 1500)

        return () => {
          subscription.unsubscribe()
          clearTimeout(timeout)
        }
      } catch (err: unknown) {
        if (isMounted) {
          const errorMessage = err instanceof Error ? err.message : 'Unable to complete authentication.'
          setMessage(errorMessage)
        }
      }
    }

    handleAuth()

    return () => {
      isMounted = false
    }
  }, [navigate])

  return (
    <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center' }}>
      <div style={{ padding: 24, borderRadius: 12, background: 'rgba(0,0,0,0.7)', color: 'white', textAlign: 'center' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Completing authentication...</h2>
        <p style={{ opacity: 0.8 }}>{message}</p>
      </div>
    </div>
  )
}
