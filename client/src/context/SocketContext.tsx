import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { supabase } from '@/services/supabase'
import { useAuth } from './AuthContext'
import type { ReactNode } from 'react'

interface SocketContextValue {
  socket: any
  onlineUsers: string[]
  matchNotifications: string[]
  connectionRequests: string[]
  portfolioUpdates: string[]
}

const SocketContext = createContext<SocketContextValue | undefined>(undefined)

export const SocketProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth()
  const [onlineUsers, setOnlineUsers] = useState<string[]>([])
  const [matchNotifications, setMatchNotifications] = useState<string[]>([])
  const [connectionRequests, setConnectionRequests] = useState<string[]>([])
  const [portfolioUpdates, setPortfolioUpdates] = useState<string[]>([])

  useEffect(() => {
    if (!user) {
      return
    }

    const channel = supabase.channel('architrack_workspace', {
      config: {
        presence: { key: user.id },
      },
    })

    channel
      .on('presence', { event: 'sync' }, () => {
        const state = channel.presenceState()
        const users = Object.keys(state)
        setOnlineUsers(users)
      })
      .on('broadcast', { event: 'newMatch' }, ({ payload }) => {
        if (payload?.message) {
          setMatchNotifications((prev) => [payload.message, ...prev])
        }
      })
      .on('broadcast', { event: 'connectionRequest' }, ({ payload }) => {
        if (payload?.message) {
          setConnectionRequests((prev) => [payload.message, ...prev])
        }
      })
      .on('broadcast', { event: 'portfolioUpdate' }, ({ payload }) => {
        if (payload?.message) {
          setPortfolioUpdates((prev) => [payload.message, ...prev])
        }
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          await channel.track({
            id: user.id,
            name: user.name,
            role: user.role,
            online_at: new Date().toISOString(),
          })
        }
      })

    return () => {
      supabase.removeChannel(channel)
    }
  }, [user])

  const socket = useMemo(
    () => ({
      emit: (_event: string, _data?: any) => {},
      on: (_event: string, _callback: any) => {},
      off: (_event: string, _callback?: any) => {},
      connected: true,
    }),
    [],
  )

  const value = useMemo(
    () => ({ socket, onlineUsers, matchNotifications, connectionRequests, portfolioUpdates }),
    [socket, onlineUsers, matchNotifications, connectionRequests, portfolioUpdates],
  )

  return <SocketContext.Provider value={value}>{children}</SocketContext.Provider>
}

export const useSocket = () => {
  const context = useContext(SocketContext)
  if (!context) {
    throw new Error('useSocket must be used within SocketProvider')
  }
  return context
}
