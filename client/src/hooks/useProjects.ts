import { useCallback, useEffect, useState } from 'react'
import { projectsApi } from '@/services/api'
import type { Project } from '@/types'

export const useProjects = () => {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchProjects = useCallback(async () => {
    setLoading(true)
    try {
      const response = await projectsApi.list()
      setProjects(response.data)
      setError(null)
    } catch (err) {
      setError('Unable to load project listings.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchProjects()
  }, [fetchProjects])

  return {
    projects,
    loading,
    error,
    refreshProjects: fetchProjects,
  }
}
