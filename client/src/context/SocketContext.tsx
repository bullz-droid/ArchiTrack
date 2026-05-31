import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { io, Socket } from 'socket.io-client'
import { useAuth } from './AuthContext'
import type { ReactNode } from 'react'

interface SocketContextValue {
  socket: Socket | null
  onlineUsers: string[]
  matchNotifications: string[]
  connectionRequests: string[]
  portfolioUpdates: string[]
}

const SocketContext = createContext<SocketContextValue | undefined>(undefined)

export const SocketProvider = ({ children }: { children: ReactNode }) => {
  const { token } = useAuth()
  const [socket, setSocket] = useState<Socket | null>(null)
  const [onlineUsers, setOnlineUsers] = useState<string[]>([])
  const [matchNotifications, setMatchNotifications] = useState<string[]>([])
  const [connectionRequests, setConnectionRequests] = useState<string[]>([])
  const [portfolioUpdates, setPortfolioUpdates] = useState<string[]>([])
  const socketUrl = import.meta.env.VITE_SOCKET_URL || import.meta.env.VITE_API_URL || 'http://localhost:5000'

  useEffect(() => {
    if (!token) {
      setSocket(null)
      return
    }

    const client = io(socketUrl, {
      auth: { token },
      transports: ['websocket'],
    })

    setSocket(client)

    client.on('connect', () => {
      client.emit('join', { token })
    })

    client.on('onlineUsers', (users: string[]) => {
      setOnlineUsers(users)
    })

    client.on('newMatch', (payload: { message: string }) => {
      setMatchNotifications((prev) => [payload.message, ...prev])
    })

    client.on('connectionRequest', (payload: { message: string }) => {
      setConnectionRequests((prev) => [payload.message, ...prev])
    })

    client.on('portfolioUpdate', (payload: { message: string }) => {
      setPortfolioUpdates((prev) => [payload.message, ...prev])
    })

    return () => {
      client.disconnect()
    }
  }, [socketUrl, token])

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
