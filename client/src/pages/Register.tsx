import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../services/supabase';

const Register: React.FC = () => {
  const [username, setUsername] = useState('');
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
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username,
          }
        }
      });

      if (error) {
        setError(error.message);
        setLoading(false);
      } else {
        localStorage.setItem('username', username);
        navigate('/dashboard');
      }
    } catch (err: any) {
      console.error('Registration failed:', err);
      setError(err.message === 'Failed to fetch' 
        ? 'Cannot connect to Supabase. Check your internet connection and environment variables.' 
        : `An unexpected error occurred: ${err.message}`);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-archi-gray/30 px-4">
      <div className="max-w-md w-full bg-white p-12 border border-gray-100 shadow-sm">
        <div className="mb-12 text-center">
          <h1 className="text-3xl font-bold tracking-tighter mb-2">ARCHITRACK</h1>
          <p className="text-xs uppercase tracking-widest text-gray-400">Join the design studio</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-600 text-sm border-l-4 border-red-500">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-[10px] uppercase tracking-widest font-bold text-gray-400 mb-2">Username</label>
            <input
              type="text"
              required
              className="input-field"
              placeholder="studio_name"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-[10px] uppercase tracking-widest font-bold text-gray-400 mb-2">Email</label>
            <input
              type="email"
              required
              className="input-field"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-[10px] uppercase tracking-widest font-bold text-gray-400 mb-2">Password</label>
            <input
              type="password"
              required
              className="input-field"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary mt-4 py-3 disabled:bg-gray-400"
          >
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            Already have an account?{' '}
            <Link to="/login" className="text-archi-black font-bold hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
