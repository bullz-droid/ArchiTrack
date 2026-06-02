import { useCallback, useEffect, useState } from 'react'
import { architectsApi } from '@/services/api'
import type { ArchitectFilters, User } from '@/types'

const defaultFilters: ArchitectFilters = {
  styles: [],
  budgetRange: [0, 100000],
  experience: '',
  location: '',
  projectType: '',
}

export const useArchitects = (initialFilters: ArchitectFilters = defaultFilters) => {
  const [architects, setArchitects] = useState<User[]>([])
  const [filters, setFilters] = useState<ArchitectFilters>(initialFilters)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchArchitects = useCallback(async () => {
    setLoading(true)
    try {
      const response = await architectsApi.list(filters)
      setArchitects(response.data)
      setError(null)
    } catch (_err) {
      setError('Unable to fetch architects.')
    } finally {
      setLoading(false)
    }
  }, [filters])

  useEffect(() => {
    fetchArchitects()
  }, [fetchArchitects])

  return {
    architects,
    filters,
    loading,
    error,
    setFilters,
    refreshArchitects: fetchArchitects,
  }
}
