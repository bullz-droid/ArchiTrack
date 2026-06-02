import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '@/services/supabase'

export default function AuthCallback() {
  const navigate = useNavigate()
  const [message, setMessage] = useState('Finalizing sign-in...')

  useEffect(() => {
    const completeSignIn = async () => {
      try {
        await supabase.auth.initialize()
        const { data, error } = await supabase.auth.getSession()
        if (error || !data?.session) {
          setMessage(error?.message ?? 'OAuth callback failed.')
          return
        }
        navigate('/dashboard', { replace: true })
      } catch (error) {
        if (error instanceof Error) {
          setMessage(error.message)
        } else {
          setMessage('Unable to complete authentication.')
        }
      }
    }

    completeSignIn()
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
