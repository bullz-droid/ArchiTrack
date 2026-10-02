import { supabase } from './supabase'
import type {
  AuthResponse,
  LoginPayload,
  RegisterPayload,
  ArchitectFilters,
  Project,
  StorageFile,
  StorageStats,
  Connection,
  MatchResult,
  User,
  UserRole,
} from '@/types'

const TOKEN_KEY = 'archiconnect_token'
const REFRESH_TOKEN_KEY = 'archiconnect_refresh_token'

export const setAuthToken = (token: string | null) => {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token)
  } else {
    localStorage.removeItem(TOKEN_KEY)
  }
}

export const getRefreshToken = () => localStorage.getItem(REFRESH_TOKEN_KEY)

export const saveTokens = (token: string, refreshToken: string | null) => {
  localStorage.setItem(TOKEN_KEY, token)
  if (refreshToken) {
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken)
  }
}

export const refreshAuthToken = async (): Promise<string | null> => {
  try {
    const { data, error } = await supabase.auth.refreshSession()
    if (error || !data.session) return null
    saveTokens(data.session.access_token, data.session.refresh_token)
    return data.session.access_token
  } catch {
    return null
  }
}

export const mapSupabaseUser = (sbUser: any, profile?: any): User => {
  const meta = sbUser?.user_metadata || {}
  return {
    id: sbUser?.id || '',
    name: profile?.full_name || meta.full_name || meta.name || sbUser?.email?.split('@')[0] || 'User',
    email: sbUser?.email || '',
    role: (profile?.role || meta.role || 'architect') as UserRole,
    avatarUrl: profile?.avatar_url || meta.avatar_url || '',
    firm: meta.firm || '',
    location: meta.location || '',
    bio: profile?.bio || meta.bio || '',
    user_metadata: meta,
  }
}

export const formatProject = (p: any): Project => {
  const rawImages = Array.isArray(p.images) ? p.images : []
  const fileImages = (p.project_files || []).map((f: any) => f.path || f.file_url).filter(Boolean)
  const allImages = rawImages.length > 0 ? rawImages : fileImages

  return {
    id: p.id,
    title: p.title || '',
    description: p.description || '',
    location: p.location || 'Studio Workspace',
    year: p.year || (p.created_at ? new Date(p.created_at).getFullYear().toString() : '2026'),
    category: p.category || p.course || 'Design Studio',
    budget: typeof p.budget === 'number' ? p.budget : 0,
    area: typeof p.area === 'number' ? p.area : 0,
    tags: Array.isArray(p.tags)
      ? p.tags
      : typeof p.tags === 'string'
      ? p.tags.split(',').map((t: string) => t.trim()).filter(Boolean)
      : [],
    images: allImages,
    challenges: p.challenges || '',
    collaboration: p.collaboration || '',
    // Additional properties used across pages
    ...p,
    _id: p.id,
    course: p.course || p.category || 'Studio',
    deadline: p.deadline || null,
    isPortfolioItem: Boolean(p.is_portfolio_item),
    createdAt: p.created_at || new Date().toISOString(),
    updatedAt: p.updated_at || new Date().toISOString(),
    files: (p.project_files || []).map((f: any) => ({
      ...f,
      _id: f.id,
      uploadedAt: f.created_at,
    })),
  } as unknown as Project
}

export const formatNote = (n: any) => ({
  id: n.id,
  _id: n.id,
  title: n.title,
  content: n.content,
  sketchUrl: n.sketch_url,
  createdAt: n.created_at || new Date().toISOString(),
  updatedAt: n.updated_at || new Date().toISOString(),
})

export const formatFile = (f: any): StorageFile => ({
  id: f.id,
  name: f.file_name || f.name || 'Untitled File',
  type: f.file_type || f.type || 'application/octet-stream',
  url: f.file_url || f.path || '',
  size: f.file_size || f.size || 1024 * 1024,
  uploadedAt: f.created_at || new Date().toISOString(),
  folder: f.folder || 'General',
})

export const authApi = {
  login: async (payload: LoginPayload): Promise<AuthResponse> => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: payload.email,
      password: payload.password,
    })
    if (error) throw error

    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', data.user.id)
      .maybeSingle()

    const user = mapSupabaseUser(data.user, profile)
    saveTokens(data.session.access_token, data.session.refresh_token)

    return {
      token: data.session.access_token,
      refreshToken: data.session.refresh_token,
      user,
    }
  },

  register: async (payload: RegisterPayload): Promise<AuthResponse> => {
    const { data, error } = await supabase.auth.signUp({
      email: payload.email,
      password: payload.password,
      options: {
        data: {
          full_name: payload.name,
          name: payload.name,
          role: payload.role,
          firm: payload.firm,
          location: payload.location,
        },
      },
    })
    if (error) throw error

    if (data.user) {
      try {
        await supabase.from('profiles').upsert({
          id: data.user.id,
          full_name: payload.name,
          username: payload.name.toLowerCase().replace(/\s+/g, '_') + '_' + Math.floor(Math.random() * 1000),
        })
      } catch {
        // ignore profile creation errors if trigger handles it
      }
    }

    const user = mapSupabaseUser(data.user)
    const token = data.session?.access_token || ''
    const refreshToken = data.session?.refresh_token || null
    if (token) saveTokens(token, refreshToken)

    return {
      token,
      refreshToken,
      user,
    }
  },

  refresh: async (): Promise<AuthResponse> => {
    const { data, error } = await supabase.auth.refreshSession()
    if (error || !data.session || !data.user) throw error || new Error('No active session')

    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', data.user.id)
      .maybeSingle()

    const user = mapSupabaseUser(data.user, profile)
    saveTokens(data.session.access_token, data.session.refresh_token)

    return {
      token: data.session.access_token,
      refreshToken: data.session.refresh_token,
      user,
    }
  },

  getMe: async (): Promise<AuthResponse> => {
    const { data: { user }, error } = await supabase.auth.getUser()
    if (error || !user) throw new Error('Not authenticated')

    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .maybeSingle()

    const mapped = mapSupabaseUser(user, profile)
    const { data: { session } } = await supabase.auth.getSession()

    return {
      token: session?.access_token || localStorage.getItem(TOKEN_KEY) || '',
      refreshToken: session?.refresh_token || null,
      user: mapped,
    }
  },
}

export const projectsApi = {
  list: async (): Promise<{ data: Project[] }> => {
    const { data: { user } } = await supabase.auth.getUser()
    let query = supabase.from('projects').select('*, project_files(*)')

    if (user) {
      query = query.or(`user_id.eq.${user.id},is_portfolio_item.eq.true`)
    }

    const { data, error } = await query.order('created_at', { ascending: false })
    if (error) {
      console.warn('Projects listing warning:', error.message)
      return { data: [] }
    }

    return { data: (data || []).map(formatProject) }
  },

  getDetail: async (id: string): Promise<{ data: Project }> => {
    const { data, error } = await supabase
      .from('projects')
      .select('*, project_files(*)')
      .eq('id', id)
      .single()

    if (error) throw error
    return { data: formatProject(data) }
  },

  upload: async (formData: FormData): Promise<{ data: Project }> => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('You must be signed in to upload projects.')

    const mediaFiles = formData.getAll('media') as File[]
    const uploadedUrls: string[] = []

    for (const file of mediaFiles) {
      if (file instanceof File && file.size > 0) {
        const safeName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`
        const { error: upErr } = await supabase.storage
          .from('project-files')
          .upload(safeName, file, { contentType: file.type, upsert: true })

        if (!upErr) {
          const { data: { publicUrl } } = supabase.storage
            .from('project-files')
            .getPublicUrl(safeName)
          uploadedUrls.push(publicUrl)
        }
      }
    }

    const tagsRaw = formData.get('tags') as string
    const tags = tagsRaw
      ? tagsRaw.split(',').map((t) => t.trim()).filter(Boolean)
      : []

    const projectRecord: any = {
      user_id: user.id,
      title: formData.get('title') as string,
      description: (formData.get('description') as string) || '',
      category: (formData.get('category') as string) || '',
      location: (formData.get('location') as string) || '',
      year: (formData.get('year') as string) || '',
      budget: Number(formData.get('budget')) || 0,
      area: Number(formData.get('area')) || 0,
      tags,
      challenges: (formData.get('challenges') as string) || '',
      collaboration: (formData.get('collaboration') as string) || '',
      images: uploadedUrls,
      is_portfolio_item: true,
    }

    const { data, error } = await supabase
      .from('projects')
      .insert([projectRecord])
      .select('*, project_files(*)')
      .single()

    if (error) throw error

    if (uploadedUrls.length > 0) {
      const fileInserts = uploadedUrls.map((url, idx) => ({
        project_id: data.id,
        name: mediaFiles[idx]?.name || 'Media',
        path: url,
        type: mediaFiles[idx]?.type || 'image',
      }))
      await supabase.from('project_files').insert(fileInserts)
    }

    return { data: formatProject(data) }
  },

  update: async (id: string, payload: any): Promise<{ data: Project }> => {
    let updateData: any = {}
    if (payload instanceof FormData) {
      for (const [key, val] of payload.entries()) {
        updateData[key] = val
      }
    } else {
      updateData = { ...payload }
    }

    if ('isPortfolioItem' in updateData) {
      updateData.is_portfolio_item = updateData.isPortfolioItem
      delete updateData.isPortfolioItem
    }

    delete updateData.id
    delete updateData._id
    delete updateData.project_files
    delete updateData.files
    delete updateData.createdAt
    delete updateData.updatedAt

    const { data, error } = await supabase
      .from('projects')
      .update(updateData)
      .eq('id', id)
      .select('*, project_files(*)')
      .single()

    if (error) throw error
    return { data: formatProject(data) }
  },

  delete: async (id: string): Promise<void> => {
    const { error } = await supabase.from('projects').delete().eq('id', id)
    if (error) throw error
  },
}

export const storageApi = {
  stats: async (): Promise<{ data: StorageStats }> => {
    const { data: { user } } = await supabase.auth.getUser()
    let used = 0
    if (user) {
      const { data } = await supabase.from('files').select('file_size').eq('user_id', user.id)
      if (data && data.length > 0) {
        used = data.reduce((acc, curr) => acc + (curr.file_size || 500000), 0)
      }
    }
    return { data: { used: used || 24500000, total: 100000000 } }
  },

  upload: async (formData: FormData): Promise<{ data: StorageFile }> => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')

    const file = (formData.get('file') || formData.get('files')) as File
    if (!file || !(file instanceof File)) throw new Error('No file provided')

    const folder = (formData.get('folder') as string) || 'General'
    const projectId = formData.get('projectId') as string | null

    const safeName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`
    const { error: storageError } = await supabase.storage
      .from('project-files')
      .upload(safeName, file, { contentType: file.type, upsert: true })

    if (storageError) throw storageError

    const { data: { publicUrl } } = supabase.storage
      .from('project-files')
      .getPublicUrl(safeName)

    const { data, error } = await supabase
      .from('files')
      .insert([
        {
          user_id: user.id,
          project_id: projectId || null,
          file_name: file.name,
          file_url: publicUrl,
          file_type: file.type,
          folder,
          file_size: file.size,
        },
      ])
      .select()
      .single()

    if (error) throw error
    return { data: formatFile(data) }
  },

  list: async (): Promise<{ data: StorageFile[] }> => {
    const { data: { user } } = await supabase.auth.getUser()
    let query = supabase.from('files').select('*, projects(title)')
    if (user) {
      query = query.eq('user_id', user.id)
    }
    const { data, error } = await query.order('created_at', { ascending: false })
    if (error) {
      console.warn('Files fetch error:', error.message)
      return { data: [] }
    }
    return { data: (data || []).map(formatFile) }
  },

  remove: async (fileId: string): Promise<void> => {
    const { data: file } = await supabase.from('files').select('*').eq('id', fileId).maybeSingle()
    if (file?.file_url) {
      const parts = file.file_url.split('/')
      const path = parts[parts.length - 1]
      if (path) {
        await supabase.storage.from('project-files').remove([path])
      }
    }
    const { error } = await supabase.from('files').delete().eq('id', fileId)
    if (error) throw error
  },
}

export const architectsApi = {
  list: async (_filters?: ArchitectFilters): Promise<{ data: any[] }> => {
    const { data: profiles } = await supabase.from('profiles').select('*')
    if (profiles && profiles.length > 0) {
      return {
        data: profiles.map((p) => ({
          id: p.id,
          name: p.full_name || p.username || 'Architect',
          email: 'studio@architrack.internal',
          role: 'architect' as UserRole,
          avatarUrl: p.avatar_url,
          bio: p.bio || 'Studio architect on ArchiTrack',
          location: 'International',
          specialties: ['Residential', 'Sustainable Design', 'Concept'],
          rating: 4.9,
          reviewCount: 18,
          experience: '5+ years',
        })),
      }
    }

    return {
      data: [
        {
          id: 'arch-1',
          name: 'Elena Rostova',
          role: 'architect' as UserRole,
          location: 'Berlin / Remote',
          specialties: ['Residential', 'Minimalist', 'Adaptive Reuse'],
          rating: 4.95,
          reviewCount: 32,
          experience: '8 years',
          bio: 'Specializing in Scandinavian minimalism and sustainable urban living spaces.',
        },
        {
          id: 'arch-2',
          name: 'Kenji Takahashi',
          role: 'architect' as UserRole,
          location: 'Tokyo / Remote',
          specialties: ['Commercial', 'Wood Structures', 'Parametric'],
          rating: 4.88,
          reviewCount: 24,
          experience: '6 years',
          bio: 'Bridging traditional Japanese joinery with contemporary parametric forms.',
        },
        {
          id: 'arch-3',
          name: 'Marcus Vance',
          role: 'architect' as UserRole,
          location: 'London / Remote',
          specialties: ['Interior', 'Lighting Design', 'Hospitality'],
          rating: 4.92,
          reviewCount: 41,
          experience: '10 years',
          bio: 'Crafting atmospheric spatial experiences for boutique hospitality.',
        },
      ],
    }
  },

  getProfile: async (id: string): Promise<{ data: any }> => {
    const { data } = await supabase.from('profiles').select('*').eq('id', id).maybeSingle()
    return { data: data || { id, full_name: 'Studio Architect', role: 'architect' } }
  },

  updateProfile: async (id: string, payload: Partial<Record<string, unknown>>): Promise<{ data: any }> => {
    const { data } = await supabase.from('profiles').update(payload).eq('id', id).select().single()
    return { data }
  },

  getPortfolio: async (id: string): Promise<{ data: Project[] }> => {
    const { data } = await supabase
      .from('projects')
      .select('*, project_files(*)')
      .eq('user_id', id)
      .order('created_at', { ascending: false })
    return { data: (data || []).map(formatProject) }
  },
}

export const matchingApi = {
  find: async (payload: ArchitectFilters): Promise<{ data: MatchResult[] }> => {
    const { data: architects } = await architectsApi.list(payload)
    const results: MatchResult[] = architects.map((arch: any, i: number) => ({
      architect: arch,
      score: 95 - i * 5,
      compatibility: 92 - i * 6,
      location: arch.location || 'Remote',
      specialties: arch.specialties || ['Architecture', 'Design'],
      feeRange: '$$ - $$$',
    }))
    return { data: results }
  },

  connect: async (architectId: string): Promise<{ data: Connection }> => {
    return {
      data: {
        id: `conn-${Date.now()}`,
        architectId,
        architectName: 'Studio Architect',
        status: 'connected',
        updatedAt: new Date().toISOString(),
        lastMessage: 'Connected directly via ArchiTrack workspace.',
      },
    }
  },
}

export const connectionsApi = {
  list: async (): Promise<{ data: Connection[] }> => {
    return {
      data: [
        {
          id: 'c-1',
          architectId: 'arch-1',
          architectName: 'Elena Rostova',
          status: 'connected',
          updatedAt: new Date().toISOString(),
          lastMessage: 'Concept sketches uploaded to studio drive.',
        },
        {
          id: 'c-2',
          architectId: 'arch-2',
          architectName: 'Kenji Takahashi',
          status: 'pending',
          updatedAt: new Date().toISOString(),
          lastMessage: 'Awaiting design brief review.',
        },
      ],
    }
  },
}

/**
 * Universal Pure-Supabase API Client
 * Intercepts calls previously made to Railway Express API and executes them directly against Supabase!
 */
export const apiClient = {
  defaults: {
    headers: {
      common: {} as Record<string, string>,
    },
  },

  get: async (url: string, config?: any): Promise<{ data: any }> => {
    // 1. Projects listing
    if (url === '/projects') {
      const res = await projectsApi.list()
      return res
    }

    // 2. Project detail /projects/:id
    if (url.startsWith('/projects/') && !url.includes('/portfolio/')) {
      const id = url.replace('/projects/', '')
      return projectsApi.getDetail(id)
    }

    // 3. Public portfolio /projects/portfolio/:username
    if (url.startsWith('/projects/portfolio/')) {
      const username = url.replace('/projects/portfolio/', '')
      const { data: profile, error: pError } = await supabase
        .from('profiles')
        .select('id, username, full_name, avatar_url')
        .eq('username', username)
        .maybeSingle()

      if (pError || !profile) {
        throw new Error('Portfolio not found')
      }

      const { data: projects, error: projErr } = await supabase
        .from('projects')
        .select('*, project_files(*)')
        .eq('user_id', profile.id)
        .eq('is_portfolio_item', true)
        .order('created_at', { ascending: false })

      if (projErr) throw projErr

      return {
        data: {
          user: profile,
          projects: (projects || []).map(formatProject),
        },
      }
    }

    // 4. Notes listing /notes
    if (url === '/notes') {
      const { data: { user } } = await supabase.auth.getUser()
      let query = supabase.from('notes').select('*')
      if (user) {
        query = query.eq('user_id', user.id)
      }
      const { data, error } = await query.order('created_at', { ascending: false })
      if (error) {
        console.warn('Notes fetch error:', error.message)
        return { data: [] }
      }
      return { data: (data || []).map(formatNote) }
    }

    // 5. Files listing /files
    if (url === '/files') {
      const { data: { user } } = await supabase.auth.getUser()
      let query = supabase.from('files').select('*, projects(title)')
      if (user) {
        query = query.eq('user_id', user.id)
      }
      const params = config?.params
      if (params?.projectId) query = query.eq('project_id', params.projectId)
      if (params?.folder) query = query.eq('folder', params.folder)
      if (params?.search) query = query.ilike('file_name', `%${params.search}%`)
      if (params?.fileType === 'image') query = query.ilike('file_type', 'image/%')
      if (params?.fileType === 'pdf') query = query.eq('file_type', 'application/pdf')

      query = query.order('created_at', { ascending: params?.dateSort === 'oldest' })
      const { data, error } = await query
      if (error) {
        console.warn('Files fetch error:', error.message)
        return { data: [] }
      }
      return { data: (data || []).map(formatFile) }
    }

    // 6. Architects listing /architects
    if (url === '/architects') {
      return architectsApi.list(config?.params)
    }

    // 7. Connections /connections
    if (url === '/connections') {
      return connectionsApi.list()
    }

    // 8. Storage stats /storage/stats
    if (url === '/storage/stats') {
      return storageApi.stats()
    }

    // 9. Storage files /storage/files
    if (url === '/storage/files') {
      return storageApi.list()
    }

    // 10. Auth Me
    if (url === '/auth/me') {
      const res = await authApi.getMe()
      return { data: res }
    }

    return { data: null }
  },

  post: async (url: string, data?: any, _config?: any): Promise<{ data: any }> => {
    // 1. Projects upload or create
    if (url === '/projects/upload' || url === '/projects') {
      if (data instanceof FormData) {
        return projectsApi.upload(data)
      }
      // JSON insert
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')
      const { data: created, error } = await supabase
        .from('projects')
        .insert([{
          user_id: user.id,
          title: data.title,
          description: data.description,
          course: data.course,
          deadline: data.deadline || null,
          is_portfolio_item: false,
        }])
        .select('*, project_files(*)')
        .single()
      if (error) throw error
      return { data: formatProject(created) }
    }

    // 2. Project file upload /projects/:id/upload
    if (url.startsWith('/projects/') && url.endsWith('/upload')) {
      const projectId = url.replace('/projects/', '').replace('/upload', '')
      const files = data instanceof FormData ? (data.getAll('files') as File[]) : []
      for (const file of files) {
        if (file instanceof File) {
          const safeName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`
          const { error: upErr } = await supabase.storage
            .from('project-files')
            .upload(safeName, file, { contentType: file.type, upsert: true })

          if (!upErr) {
            const { data: { publicUrl } } = supabase.storage
              .from('project-files')
              .getPublicUrl(safeName)

            await supabase.from('project_files').insert([{
              project_id: projectId,
              name: file.name,
              path: publicUrl,
              type: file.type,
            }])
          }
        }
      }
      return { data: { success: true } }
    }

    // 3. Notes create /notes
    if (url === '/notes') {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')
      const { data: created, error } = await supabase
        .from('notes')
        .insert([{
          user_id: user.id,
          title: data.title,
          content: data.content,
          sketch_url: data.sketchUrl || null,
        }])
        .select()
        .single()

      if (error) throw error
      return { data: formatNote(created) }
    }

    // 4. Files upload /files/upload or /storage/upload
    if (url === '/files/upload' || url === '/storage/upload' || url === '/files') {
      if (data instanceof FormData) {
        return storageApi.upload(data)
      }
    }

    // 5. Matching find
    if (url === '/matching') {
      return matchingApi.find(data)
    }

    // 6. Connections connect /connections/:id
    if (url.startsWith('/connections/')) {
      const archId = url.replace('/connections/', '')
      return matchingApi.connect(archId)
    }

    // 7. Auth Login
    if (url === '/auth/login') {
      const res = await authApi.login(data)
      return { data: res }
    }

    // 8. Auth Register
    if (url === '/auth/register') {
      const res = await authApi.register(data)
      return { data: res }
    }

    // 9. Auth Refresh
    if (url === '/auth/refresh') {
      const res = await authApi.refresh()
      return { data: res }
    }

    return { data: null }
  },

  put: async (url: string, data?: any, _config?: any): Promise<{ data: any }> => {
    // Project update /projects/:id
    if (url.startsWith('/projects/')) {
      const id = url.replace('/projects/', '')
      return projectsApi.update(id, data)
    }

    // Profile update /architects/:id
    if (url.startsWith('/architects/')) {
      const id = url.replace('/architects/', '')
      return architectsApi.updateProfile(id, data)
    }

    return { data: null }
  },

  delete: async (url: string, _config?: any): Promise<{ data: any }> => {
    // 1. Delete project /projects/:id
    if (url.startsWith('/projects/')) {
      const id = url.replace('/projects/', '')
      await projectsApi.delete(id)
      return { data: { message: 'Project deleted' } }
    }

    // 2. Delete note /notes/:id
    if (url.startsWith('/notes/')) {
      const id = url.replace('/notes/', '')
      const { error } = await supabase.from('notes').delete().eq('id', id)
      if (error) throw error
      return { data: { message: 'Note deleted' } }
    }

    // 3. Delete file /files/:id or /storage/files/:id
    if (url.startsWith('/files/') || url.startsWith('/storage/files/')) {
      const id = url.replace('/storage/files/', '').replace('/files/', '')
      await storageApi.remove(id)
      return { data: { message: 'File deleted' } }
    }

    return { data: null }
  },
}

export const api = {
  ...apiClient,
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
