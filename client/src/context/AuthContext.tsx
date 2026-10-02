import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { authApi, mapSupabaseUser, saveTokens, setAuthToken } from '../services/api'
import { supabase } from '@/services/supabase'
import type { LoginPayload, RegisterPayload, User } from '@/types'

interface AuthContextType {
  user: User | null
  token: string | null
  loading: boolean
  login: (payload: LoginPayload) => Promise<void>
  register: (payload: RegisterPayload) => Promise<void>
  logout: () => void
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)
const TOKEN_KEY = 'archiconnect_token'

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(TOKEN_KEY))
  const [loading, setLoading] = useState(true)

  const syncUser = async (sessionUser: any) => {
    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', sessionUser.id)
        .maybeSingle()

      const mapped = mapSupabaseUser(sessionUser, profile)
      setUser(mapped)
    } catch {
      setUser(mapSupabaseUser(sessionUser))
    }
  }

  useEffect(() => {
    let mounted = true

    const initializeAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (session && mounted) {
          setToken(session.access_token)
          setAuthToken(session.access_token)
          saveTokens(session.access_token, session.refresh_token)
          await syncUser(session.user)
        }
      } catch (err) {
        console.warn('Auth initialization warning:', err)
      } finally {
        if (mounted) setLoading(false)
      }
    }

    initializeAuth()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user && mounted) {
        setToken(session.access_token)
        setAuthToken(session.access_token)
        saveTokens(session.access_token, session.refresh_token)
        await syncUser(session.user)
      } else if (!session && mounted) {
        setUser(null)
        setToken(null)
        setAuthToken(null)
        localStorage.removeItem(TOKEN_KEY)
        localStorage.removeItem('archiconnect_refresh_token')
      }
      if (mounted) setLoading(false)
    })

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [])

  const login = async (payload: LoginPayload) => {
    const data = await authApi.login(payload)
    setUser(data.user)
    setToken(data.token)
    saveTokens(data.token, data.refreshToken || null)
    setAuthToken(data.token)
  }

  const register = async (payload: RegisterPayload) => {
    const data = await authApi.register(payload)
    setUser(data.user)
    setToken(data.token)
    saveTokens(data.token, data.refreshToken || null)
    setAuthToken(data.token)
  }

  const logout = async () => {
    try {
      await supabase.auth.signOut()
    } catch {
      // ignore
    }
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem('archiconnect_refresh_token')
    setAuthToken(null)
    setUser(null)
    setToken(null)
  }

  const refreshUser = async () => {
    try {
      const { data: { user: currentUser } } = await supabase.auth.getUser()
      if (currentUser) {
        await syncUser(currentUser)
      } else {
        await logout()
      }
    } catch {
      await logout()
    }
  }

  const value = useMemo(
    () => ({ user, token, loading, login, register, logout, refreshUser }),
    [user, token, loading],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
