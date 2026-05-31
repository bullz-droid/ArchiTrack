import { useCallback, useState } from 'react'
import { matchingApi } from '@/services/api'
import type { ArchitectFilters, MatchResult } from '@/types'

export const useMatching = () => {
  const [matches, setMatches] = useState<MatchResult[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const findMatches = useCallback(async (filters: ArchitectFilters) => {
    setLoading(true)
    try {
      const response = await matchingApi.find(filters)
      setMatches(response.data)
      setError(null)
    } catch (err) {
      setError('Unable to generate architect matches.')
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    matches,
    loading,
    error,
    findMatches,
  }
}
