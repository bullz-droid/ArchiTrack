import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../services/supabase';
import { User, Mail, Briefcase, Camera, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

const Profile: React.FC = () => {
  const { user, session } = useAuth();
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [profile, setProfile] = useState({
    username: '',
    full_name: '',
    role: 'Architect',
    bio: '',
    avatar_url: ''
  });

  useEffect(() => {
    if (user) {
      setProfile({
        username: user.user_metadata?.username || '',
        full_name: user.user_metadata?.full_name || '',
        role: user.user_metadata?.role || 'Architect',
        bio: user.user_metadata?.bio || '',
        avatar_url: user.user_metadata?.avatar_url || ''
      });
    }
  }, [user]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdating(true);
    
    try {
      const { error } = await supabase.auth.updateUser({
        data: profile
      });

      if (error) throw error;
      toast.success('Profile updated successfully');
    } catch (err: any) {
      toast.error(err.message || 'Failed to update profile');
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12">
      <header>
        <div className="flex items-center gap-4 mb-4">
          <span className="h-px w-8 bg-primary-500"></span>
          <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary-500">Account Settings</span>
        </div>
        <h1 className="text-5xl font-black tracking-tighter text-[#111827] dark:text-white uppercase">Studio <span className="text-primary-600">Profile</span></h1>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
        {/* Avatar Section */}
        <div className="space-y-6">
          <div className="relative group w-full aspect-square bg-gray-100 dark:bg-gray-800 rounded-3xl overflow-hidden flex items-center justify-center border border-gray-100 dark:border-gray-800 shadow-xl shadow-gray-200/50 dark:shadow-none transition-all hover:border-primary-500/50">
            {profile.avatar_url ? (
              <img src={profile.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <User size={64} className="text-gray-300" />
            )}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
              <Camera className="text-white" size={32} />
            </div>
          </div>
          <div className="text-center space-y-2">
            <h3 className="font-bold text-xl">{profile.username || 'Studio Member'}</h3>
            <p className="text-xs text-gray-400 uppercase tracking-widest font-bold">{profile.role}</p>
          </div>
        </div>

        {/* Form Section */}
        <div className="md:col-span-2">
          <form onSubmit={handleUpdate} className="bg-white dark:bg-[#1E293B] p-10 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-xl shadow-gray-200/50 dark:shadow-none space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Username</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
                  <input 
                    type="text"
                    value={profile.username}
                    onChange={(e) => setProfile({...profile, username: e.target.value})}
                    className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-900/50 border-none rounded-xl focus:ring-2 focus:ring-primary-500/20 outline-none transition-all"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Full Name</label>
                <input 
                  type="text"
                  value={profile.full_name}
                  onChange={(e) => setProfile({...profile, full_name: e.target.value})}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900/50 border-none rounded-xl focus:ring-2 focus:ring-primary-500/20 outline-none transition-all"
                  placeholder="John Doe"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Professional Role</label>
              <select 
                value={profile.role}
                onChange={(e) => setProfile({...profile, role: e.target.value})}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900/50 border-none rounded-xl focus:ring-2 focus:ring-primary-500/20 outline-none transition-all"
              >
                <option value="Architect">Architect</option>
                <option value="Interior Designer">Interior Designer</option>
                <option value="Landscape Architect">Landscape Architect</option>
                <option value="Urban Planner">Urban Planner</option>
                <option value="Student">Student</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Bio / Design Philosophy</label>
              <textarea 
                rows={4}
                value={profile.bio}
                onChange={(e) => setProfile({...profile, bio: e.target.value})}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900/50 border-none rounded-xl focus:ring-2 focus:ring-primary-500/20 outline-none transition-all resize-none"
                placeholder="Brief description of your style or expertise..."
              />
            </div>

            <button 
              type="submit"
              disabled={updating}
              className="w-full py-4 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-3 shadow-lg shadow-primary-600/20 disabled:opacity-50"
            >
              {updating ? <Loader2 className="animate-spin" size={20} /> : <CheckCircle size={20} />}
              <span>{updating ? 'Saving Changes...' : 'Save Profile Settings'}</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
