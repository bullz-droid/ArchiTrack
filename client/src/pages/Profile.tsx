import React, { useEffect, useState } from 'react'
import { Camera, CheckCircle, Loader2, User as UserIcon } from 'lucide-react'
import toast from 'react-hot-toast'
import { supabase } from '../services/supabase'
import type { UserMetadata } from '@/types'

type ProfileFormData = {
  username: string
  full_name: string
  role: string
  bio: string
  avatar_url: string
}

const defaultProfile: ProfileFormData = {
  username: '',
  full_name: '',
  role: 'Architect',
  bio: '',
  avatar_url: '',
}

const Profile: React.FC = () => {
  const [profile, setProfile] = useState<ProfileFormData>(defaultProfile)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadProfile = async () => {
      setLoading(true)
      setError(null)

      const { data, error } = await supabase.auth.getUser()
      if (error) {
        setError(error.message)
        setLoading(false)
        return
      }

      const metadata = data.user?.user_metadata as UserMetadata | null
      if (!data.user) {
        setError('No authenticated Supabase user found.')
        setLoading(false)
        return
      }

      setProfile({
        username: metadata?.username ?? '',
        full_name: metadata?.full_name ?? '',
        role: metadata?.role ?? 'Architect',
        bio: metadata?.bio ?? '',
        avatar_url: metadata?.avatar_url ?? '',
      })
      setLoading(false)
    }

    loadProfile()
  }, [])

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = event.target
    setProfile((current) => ({ ...current, [name]: value }))
  }

  const handleUpdate = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setUpdating(true)
    setError(null)

    try {
      const { error } = await supabase.auth.updateUser({
        data: {
          username: profile.username,
          full_name: profile.full_name,
          role: profile.role,
          bio: profile.bio,
          avatar_url: profile.avatar_url,
        },
      })

      if (error) throw error

      toast.success('Profile updated successfully.')
    } catch (updateError) {
      const message = updateError instanceof Error ? updateError.message : 'Unable to save profile.'
      setError(message)
      toast.error(message)
    } finally {
      setUpdating(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-[60vh] grid place-items-center text-slate-500">
        <div className="flex items-center gap-3">
          <Loader2 className="h-5 w-5 animate-spin" />
          Loading profile…
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto space-y-10 px-4 py-8">
      <header>
        <div className="flex items-center gap-3 mb-3">
          <span className="h-px w-8 bg-blue-600"></span>
          <span className="text-[10px] font-semibold uppercase tracking-[0.32em] text-blue-600">Account Settings</span>
        </div>
        <h1 className="text-4xl font-black tracking-tight text-slate-900">
          Studio <span className="text-blue-600">Profile</span>
        </h1>
      </header>

      {error ? (
        <div className="rounded-3xl border border-red-200 bg-red-50 px-6 py-4 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      <div className="grid gap-10 md:grid-cols-3">
        <section className="space-y-6">
          <div className="group relative overflow-hidden rounded-[2rem] border border-slate-200 bg-slate-50 p-8 text-center shadow-sm">
            {profile.avatar_url ? (
              <img src={profile.avatar_url} alt="Avatar" className="mx-auto h-32 w-32 rounded-full object-cover" />
            ) : (
              <div className="mx-auto flex h-32 w-32 items-center justify-center rounded-full bg-slate-200 text-slate-500">
                <UserIcon size={36} />
              </div>
            )}

            <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/0 transition duration-300 group-hover:bg-black/30">
              <Camera className="h-6 w-6 text-white opacity-0 transition duration-300 group-hover:opacity-100" />
            </div>

            <div className="space-y-2 pt-8">
              <h2 className="text-xl font-semibold text-slate-900">{profile.username || 'Studio Member'}</h2>
              <p className="text-xs uppercase tracking-[0.3em] text-slate-500">{profile.role}</p>
            </div>
          </div>
        </section>

        <form
          onSubmit={handleUpdate}
          className="md:col-span-2 space-y-8 rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm"
        >
          <div className="grid gap-6 md:grid-cols-2">
            <label className="space-y-2">
              <span className="text-xs uppercase tracking-[0.24em] text-slate-500">Username</span>
              <input
                name="username"
                value={profile.username}
                onChange={handleInputChange}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </label>
            <label className="space-y-2">
              <span className="text-xs uppercase tracking-[0.24em] text-slate-500">Full Name</span>
              <input
                name="full_name"
                value={profile.full_name}
                onChange={handleInputChange}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </label>
          </div>

          <label className="space-y-2">
            <span className="text-xs uppercase tracking-[0.24em] text-slate-500">Professional Role</span>
            <select
              name="role"
              value={profile.role}
              onChange={handleInputChange}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            >
              <option value="Architect">Architect</option>
              <option value="Interior Designer">Interior Designer</option>
              <option value="Landscape Architect">Landscape Architect</option>
              <option value="Urban Planner">Urban Planner</option>
              <option value="Student">Student</option>
            </select>
          </label>

          <label className="space-y-2">
            <span className="text-xs uppercase tracking-[0.24em] text-slate-500">Bio / Design Philosophy</span>
            <textarea
              name="bio"
              rows={5}
              value={profile.bio}
              onChange={handleInputChange}
              className="w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              placeholder="Share a short description of your design approach."
            />
          </label>

          <button
            type="submit"
            disabled={updating}
            className="inline-flex w-full items-center justify-center gap-3 rounded-2xl bg-blue-600 px-6 py-4 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {updating ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Saving…
              </>
            ) : (
              <>
                <CheckCircle className="h-4 w-4" />
                Save profile
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  )
}

export default Profile
