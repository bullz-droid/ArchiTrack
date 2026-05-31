export type UserRole = 'architect' | 'client'

export interface UserMetadata {
  username?: string
  full_name?: string
  role?: string
  bio?: string
  avatar_url?: string
}

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  avatarUrl?: string
  firm?: string
  location?: string
  rating?: number
  reviewCount?: number
  specialties?: string[]
  bio?: string
  experience?: string
  education?: string[]
  certifications?: string[]
  user_metadata?: UserMetadata
}

export interface AuthResponse {
  token: string
  refreshToken?: string | null
  expiresIn?: number | null
  user: User
}

export interface LoginPayload {
  email: string
  password: string
}

export interface RegisterPayload {
  name: string
  email: string
  password: string
  role: UserRole
  firm?: string
  location?: string
}

export interface ArchitectFilters {
  styles: string[]
  budgetRange: [number, number]
  experience: string
  location: string
  projectType: string
}

export interface Project {
  id: string
  title: string
  description: string
  location: string
  year: string
  category: string
  budget: number
  area: number
  tags: string[]
  images: string[]
  challenges: string
  collaboration: string
}

export interface StorageFile {
  id: string
  name: string
  type: string
  url: string
  size: number
  uploadedAt: string
  folder?: string
}

export interface StorageStats {
  used: number
  total: number
}

export interface Connection {
  id: string
  architectId: string
  architectName: string
  status: 'connected' | 'pending'
  lastMessage?: string
  updatedAt: string
}

export interface MatchResult {
  architect: User
  score: number
  compatibility: number
  location: string
  specialties: string[]
  feeRange: string
}
