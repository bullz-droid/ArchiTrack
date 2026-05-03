import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../services/supabase';
import { Mail, Lock, Loader2, ArrowRight, ShieldCheck } from 'lucide-react';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setError(error.message);
        setLoading(false);
      } else {
        localStorage.setItem('username', data.user.user_metadata?.username || '');
        navigate('/dashboard');
      }
    } catch (err: any) {
      console.error('Login failed:', err);
      setError(err.message === 'Failed to fetch' 
        ? 'Cannot connect to Supabase. Check your internet connection and environment variables.' 
        : `An unexpected error occurred: ${err.message}`);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-[#F9FAFB] dark:bg-[#0F172A]">
      {/* Left Side - Visual */}
      <div className="hidden lg:flex lg:w-1/2 bg-primary-600 dark:bg-primary-700 relative overflow-hidden items-center justify-center p-24">
        <div className="absolute top-0 left-0 w-full h-full opacity-10">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] border-[40px] border-white rounded-full"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] border-[60px] border-white rounded-full"></div>
        </div>
        
        <div className="relative z-10 space-y-8 text-white max-w-lg">
          <div className="flex items-center gap-4">
            <span className="h-px w-12 bg-white/40"></span>
            <span className="text-xs font-bold uppercase tracking-[0.4em] text-white/60">Professional Studio Manager</span>
          </div>
          <h2 className="text-7xl font-black tracking-tighter uppercase leading-[0.9]">
            Design <br /> <span className="text-white/40">Beyond</span> <br /> Boundaries.
          </h2>
          <p className="text-xl text-white/60 font-medium leading-relaxed">
            The all-in-one platform for architectural project management, portfolio curation, and studio collaboration.
          </p>
          
          <div className="pt-12 grid grid-cols-2 gap-12 border-t border-white/10">
            <div className="space-y-2">
              <p className="text-4xl font-black tracking-tighter">100%</p>
              <p className="text-xs font-bold uppercase tracking-widest text-white/40">Cloud Sync</p>
            </div>
            <div className="space-y-2">
              <p className="text-4xl font-black tracking-tighter">24/7</p>
              <p className="text-xs font-bold uppercase tracking-widest text-white/40">Studio Access</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 md:p-24 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8">
          <Link to="/" className="text-xl font-black tracking-tighter text-primary-600">ARCHITRACK</Link>
        </div>

        <div className="max-w-md w-full space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
          <div className="space-y-2">
            <h1 className="text-4xl font-black tracking-tighter text-[#111827] dark:text-white uppercase">Welcome <span className="text-primary-600">Back</span></h1>
            <p className="text-gray-500 dark:text-gray-400 font-medium">Continue your architectural journey.</p>
          </div>

          {error && (
            <div className="p-4 bg-red-50 dark:bg-red-900/10 border-l-4 border-red-500 rounded-r-xl flex items-start gap-3">
              <ShieldCheck className="text-red-500 shrink-0 mt-0.5" size={18} />
              <p className="text-sm text-red-600 dark:text-red-400 font-medium">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Studio Email</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary-500 transition-colors" size={18} />
                <input
                  type="email"
                  required
                  placeholder="architect@studio.com"
                  className="w-full pl-12 pr-4 py-4 bg-white dark:bg-[#1E293B] border border-gray-100 dark:border-gray-800 rounded-2xl focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 outline-none transition-all dark:text-white"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Password</label>
                <Link to="#" className="text-[10px] font-bold uppercase tracking-widest text-primary-600 hover:underline">Forgot?</Link>
              </div>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary-500 transition-colors" size={18} />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  className="w-full pl-12 pr-4 py-4 bg-white dark:bg-[#1E293B] border border-gray-100 dark:border-gray-800 rounded-2xl focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 outline-none transition-all dark:text-white"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-2xl transition-all shadow-xl shadow-primary-600/20 active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-3"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  <span>Authenticating...</span>
                </>
              ) : (
                <>
                  <span>Sign Into Studio</span>
                  <ArrowRight size={20} />
                </>
              )}
            </button>
          </form>

          <div className="pt-8 border-t border-gray-100 dark:border-gray-800 text-center">
            <p className="text-gray-500 dark:text-gray-400 font-medium">
              New to ArchiTrack?{' '}
              <Link to="/register" className="text-primary-600 font-bold hover:underline ml-1">
                Initialize Account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
