import axios, { AxiosError } from 'axios'
import { toast } from 'react-hot-toast'
import type { AuthResponse, LoginPayload, RegisterPayload, ArchitectFilters, Project, StorageFile, StorageStats, Connection, MatchResult } from '@/types'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
const TOKEN_KEY = 'archiconnect_token'
const REFRESH_TOKEN_KEY = 'archiconnect_refresh_token'
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

export const setAuthToken = (token: string | null) => {
  if (token) {
    apiClient.defaults.headers.common.Authorization = `Bearer ${token}`
  } else {
    delete apiClient.defaults.headers.common.Authorization
  }
}

export const refreshAuthToken = async (): Promise<string | null> => {
  const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY)
  if (!refreshToken) {
    return null
  }

  try {
    const response = await apiClient.post('/auth/refresh', { refreshToken })
    const { token, refreshToken: newRefreshToken } = response.data
    if (token) {
      localStorage.setItem(TOKEN_KEY, token)
      setAuthToken(token)
    }
    if (newRefreshToken) {
      localStorage.setItem(REFRESH_TOKEN_KEY, newRefreshToken)
    }
    return token
  } catch {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(REFRESH_TOKEN_KEY)
    setAuthToken(null)
    return null
  }
}

let isRefreshing = false
let refreshSubscribers: Array<(token: string | null) => void> = []

const subscribeTokenRefresh = (callback: (token: string | null) => void) => {
  refreshSubscribers.push(callback)
}

const onRefreshed = (token: string | null) => {
  refreshSubscribers.forEach((callback) => callback(token))
  refreshSubscribers = []
}

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as any

    if (error.response?.status === 401 && !originalRequest?._retry) {
      originalRequest._retry = true

      if (!isRefreshing) {
        isRefreshing = true
        const newToken = await refreshAuthToken()
        isRefreshing = false
        onRefreshed(newToken)

        if (newToken) {
          originalRequest.headers.Authorization = `Bearer ${newToken}`
          return apiClient(originalRequest)
        }
      }

      return new Promise((resolve, reject) => {
        subscribeTokenRefresh(async (token) => {
          if (!token) {
            toast.error('Session expired. Please sign in again.')
            window.location.href = '/auth/login'
            return reject(error)
          }

          originalRequest.headers.Authorization = `Bearer ${token}`
          resolve(apiClient(originalRequest))
        })
      })
    }

    if (error.response?.status === 401) {
      toast.error('Session expired. Please sign in again.')
      localStorage.removeItem(TOKEN_KEY)
      localStorage.removeItem(REFRESH_TOKEN_KEY)
      setAuthToken(null)
      window.location.href = '/auth/login'
    }

    return Promise.reject(error)
  },
)

export const authApi = {
  login: async (payload: LoginPayload): Promise<AuthResponse> => {
    const response = await apiClient.post('/auth/login', payload)
    return response.data
  },
  register: async (payload: RegisterPayload): Promise<AuthResponse> => {
    const response = await apiClient.post('/auth/register', payload)
    return response.data
  },
  refresh: async (): Promise<AuthResponse> => {
    const response = await apiClient.post('/auth/refresh', {
      refreshToken: localStorage.getItem(REFRESH_TOKEN_KEY),
    })
    return response.data
  },
  getMe: async (): Promise<AuthResponse> => {
    const response = await apiClient.get('/auth/me')
    return response.data
  },
}

export const getRefreshToken = () => localStorage.getItem(REFRESH_TOKEN_KEY)
export const saveTokens = (token: string, refreshToken: string | null) => {
  localStorage.setItem(TOKEN_KEY, token)
  setAuthToken(token)
  if (refreshToken) {
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken)
  }
}


export const architectsApi = {
  list: async (filters?: ArchitectFilters): Promise<{ data: any[] }> => {
    const response = await apiClient.get('/architects', { params: filters })
    return response.data
  },
  getProfile: async (id: string): Promise<{ data: any }> => {
    const response = await apiClient.get(`/architects/${id}`)
    return response.data
  },
  updateProfile: async (id: string, payload: Partial<Record<string, unknown>>): Promise<{ data: any }> => {
    const response = await apiClient.put(`/architects/${id}`, payload)
    return response.data
  },
  getPortfolio: async (id: string): Promise<{ data: Project[] }> => {
    const response = await apiClient.get(`/architects/${id}/portfolio`)
    return response.data
  },
}

export const projectsApi = {
  upload: async (formData: FormData): Promise<{ data: Project }> => {
    const response = await apiClient.post('/projects/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return response.data
  },
  list: async (): Promise<{ data: Project[] }> => {
    const response = await apiClient.get('/projects')
    return response.data
  },
  getDetail: async (id: string): Promise<{ data: Project }> => {
    const response = await apiClient.get(`/projects/${id}`)
    return response.data
  },
  update: async (id: string, payload: FormData): Promise<{ data: Project }> => {
    const response = await apiClient.put(`/projects/${id}`, payload, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return response.data
  },
  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/projects/${id}`)
  },
}

export const matchingApi = {
  find: async (payload: ArchitectFilters): Promise<{ data: MatchResult[] }> => {
    const response = await apiClient.post('/matching', payload)
    return response.data
  },
  connect: async (architectId: string): Promise<{ data: Connection }> => {
    const response = await apiClient.post(`/connections/${architectId}`)
    return response.data
  },
}

export const connectionsApi = {
  list: async (): Promise<{ data: Connection[] }> => {
    const response = await apiClient.get('/connections')
    return response.data
  },
}

export const storageApi = {
  stats: async (): Promise<{ data: StorageStats }> => {
    const response = await apiClient.get('/storage/stats')
    return response.data
  },
  upload: async (formData: FormData): Promise<{ data: StorageFile }> => {
    const response = await apiClient.post('/storage/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return response.data
  },
  list: async (): Promise<{ data: StorageFile[] }> => {
    const response = await apiClient.get('/storage/files')
    return response.data
  },
  remove: async (fileId: string): Promise<void> => {
    await apiClient.delete(`/storage/files/${fileId}`)
  },
}

export const api = {
  authApi,
  architectsApi,
  projectsApi,
  matchingApi,
  connectionsApi,
  storageApi,
  setAuthToken,
  apiClient,
}

export default apiClient
