import { useCallback, useEffect, useState } from 'react'
import { storageApi } from '@/services/api'
import type { StorageFile, StorageStats } from '@/types'

export const useStorage = () => {
  const [files, setFiles] = useState<StorageFile[]>([])
  const [stats, setStats] = useState<StorageStats>({ used: 0, total: 100000000 })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchStorage = useCallback(async () => {
    setLoading(true)
    try {
      const [fileResponse, statsResponse] = await Promise.all([storageApi.list(), storageApi.stats()])
      setFiles(fileResponse.data)
      setStats(statsResponse.data)
      setError(null)
    } catch (err) {
      setError('Unable to load storage metadata.')
    } finally {
      setLoading(false)
    }
  }, [])

  const uploadFiles = useCallback(async (formData: FormData) => {
    setLoading(true)
    try {
      const response = await storageApi.upload(formData)
      setFiles((prev) => [response.data, ...prev])
      setError(null)
      return response.data
    } catch (err) {
      setError('Upload failed.')
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const removeFile = useCallback(async (fileId: string) => {
    setLoading(true)
    try {
      await storageApi.remove(fileId)
      setFiles((prev) => prev.filter((item) => item.id !== fileId))
      setError(null)
    } catch (err) {
      setError('Could not delete the file.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchStorage()
  }, [fetchStorage])

  return {
    files,
    stats,
    loading,
    error,
    refreshStorage: fetchStorage,
    uploadFiles,
    removeFile,
  }
}
