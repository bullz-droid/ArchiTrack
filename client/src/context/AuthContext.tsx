import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { authApi, refreshAuthToken, saveTokens, setAuthToken } from '../services/api'
import { supabase } from '@/services/supabase'
import type { LoginPayload, RegisterPayload, User } from '@/types'

interface AuthContextType {
  user: User | null
  token: string | null
  loading: boolean
  login: (_payload: LoginPayload) => Promise<void>
  register: (_payload: RegisterPayload) => Promise<void>
  logout: () => void
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)
const TOKEN_KEY = 'archiconnect_token'

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(TOKEN_KEY))
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const initializeAuth = async () => {
      // If redirected back from Supabase OAuth, parse session from URL and persist it.
      try {
        await supabase.auth.initialize()
        const { data: sessionData, error } = await supabase.auth.getSession()
        if (error) {
          // ignore - not every load is an OAuth callback
        } else if (sessionData?.session) {
          const newToken = sessionData.session.access_token
          const newRefresh = sessionData.session.refresh_token
          if (newToken) {
            localStorage.setItem(TOKEN_KEY, newToken)
            if (newRefresh) localStorage.setItem('archiconnect_refresh_token', newRefresh)
            setAuthToken(newToken)
            setToken(newToken)
            try {
              const me = await authApi.getMe()
              setUser(me.user)
            } catch {
              // if server-side user fetch fails, proceed to normal flow
            }
          }
        }
      } catch {
        // ignore
      }

      if (token) {
        setAuthToken(token)
        try {
          const data = await authApi.getMe()
          setUser(data.user)
        } catch {
          const newToken = await refreshAuthToken()
          if (newToken) {
            setToken(newToken)
            try {
              const data = await authApi.getMe()
              setUser(data.user)
            } catch {
              setUser(null)
              setToken(null)
              localStorage.removeItem(TOKEN_KEY)
              setAuthToken(null)
            }
          } else {
            setUser(null)
            setToken(null)
            localStorage.removeItem(TOKEN_KEY)
            localStorage.removeItem('archiconnect_refresh_token')
            setAuthToken(null)
          }
        }
      }
      setLoading(false)
    }

    initializeAuth()
  }, [token])

  const login = async (payload: LoginPayload) => {
    const data = await authApi.login(payload)
    setUser(data.user)
    setToken(data.token)
    saveTokens(data.token, data.refreshToken || null)
  }

  const register = async (payload: RegisterPayload) => {
    const data = await authApi.register(payload)
    setUser(data.user)
    setToken(data.token)
    saveTokens(data.token, data.refreshToken || null)
  }

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem('archiconnect_refresh_token')
    setAuthToken(null)
    setUser(null)
    setToken(null)
  }, [])

  const refreshUser = useCallback(async () => {
    try {
      const data = await authApi.getMe()
      setUser(data.user)
    } catch {
      logout()
    }
  }, [logout])

  const value = useMemo(
    () => ({ user, token, loading, login, register, logout, refreshUser }),
    [user, token, loading, refreshUser, logout],
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
