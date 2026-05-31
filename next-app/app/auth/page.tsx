'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createBrowserClient } from '../../utils/supabase/client'
import AntiGravityScene from '../../components/auth/AntiGravityScene'

export default function AuthPage() {
  const router = useRouter()
  const supabase = useMemo(() => createBrowserClient(), [])
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [providerLoading, setProviderLoading] = useState<string | null>(null)

  const redirectTo = typeof window !== 'undefined' ? `${window.location.origin}/auth/callback` : process.env.NEXT_PUBLIC_SUPABASE_REDIRECT_URL

  const safeSetError = (message: string | null) => setError(message)

  const handleOAuth = async (provider: 'google' | 'linkedin') => {
    setProviderLoading(provider)
    safeSetError(null)

    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: { redirectTo },
      })

      if (error) throw error
      // Supabase may return a redirect url for some providers
      if (data?.url) window.location.assign(data.url)
    } catch (err) {
      safeSetError((err as Error).message || 'Unable to start OAuth flow.')
    } finally {
      setProviderLoading(null)
    }
  }

  const handleSignUp = async () => {
    setLoading(true)
    safeSetError(null)
    try {
      const { data, error } = await supabase.auth.signUp({ email, password })
      if (error) throw error
      if (!data?.session) {
        // Some flows send an email confirmation instead
        setError('Sign-up started. Check your email to confirm your account.')
        return
      }
      router.replace('/dashboard')
    } catch (err) {
      safeSetError((err as Error).message || 'Unable to create account.')
    } finally {
      setLoading(false)
    }
  }

  const handleSignIn = async () => {
    setLoading(true)
    safeSetError(null)
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) throw error
      if (!data?.session) throw new Error('Login succeeded but no session was created.')
      router.replace('/dashboard')
    } catch (err) {
      safeSetError((err as Error).message || 'Invalid email or password.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-container" style={{ position: 'relative', minHeight: '100vh' }}>
      <AntiGravityScene />

      <main className="auth-card" role="form" aria-labelledby="auth-title" style={{ zIndex: 2 }}>
        <h1 id="auth-title">Welcome</h1>
        {error ? <div style={{ color: '#ffb6c1', marginBottom: 8 }}>{error}</div> : null}

        <label style={{ display: 'block', marginBottom: 8 }}>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
        </label>

        <label style={{ display: 'block', marginBottom: 12 }}>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
        </label>

        <div style={{ display: 'grid', gap: 8 }}>
          <button type="button" onClick={handleSignUp} disabled={loading}>{loading ? 'Creating…' : 'Create Account'}</button>
          <button type="button" onClick={handleSignIn} disabled={loading}>{loading ? 'Signing in…' : 'Sign In'}</button>
        </div>

        <div style={{ margin: '12px 0', textAlign: 'center' }}>or</div>

        <div style={{ display: 'grid', gap: 8 }}>
          <button type="button" onClick={() => handleOAuth('google')} disabled={providerLoading !== null}>{providerLoading === 'google' ? 'Redirecting…' : 'Continue with Google'}</button>
          <button type="button" onClick={() => handleOAuth('linkedin')} disabled={providerLoading !== null}>{providerLoading === 'linkedin' ? 'Redirecting…' : 'Continue with LinkedIn'}</button>
        </div>
      </main>
    </div>
  )
}
