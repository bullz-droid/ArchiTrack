import { useCallback, useEffect, useState } from 'react'
import { connectionsApi } from '@/services/api'
import type { Connection } from '@/types'

export const useConnections = () => {
  const [connections, setConnections] = useState<Connection[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchConnections = useCallback(async () => {
    setLoading(true)
    try {
      const response = await connectionsApi.list()
      setConnections(response.data)
      setError(null)
    } catch (_err) {
      setError('Unable to load connections.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchConnections()
  }, [fetchConnections])

  return {
    connections,
    loading,
    error,
    refreshConnections: fetchConnections,
  }
}
