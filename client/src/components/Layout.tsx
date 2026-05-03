import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutGrid, 
  LogOut, 
  User, 
  Folder, 
  Calendar, 
  PenTool, 
  Bell, 
  X, 
  Clock, 
  Library,
  Sun,
  Moon,
  Search,
  Settings
} from 'lucide-react';
import api from '../services/api';
import { isBefore, addDays } from 'date-fns';
import { supabase } from '../services/supabase';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return document.documentElement.classList.contains('dark');
  });

  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    if (newMode) {
      document.documentElement.classList.add('dark');
      localStorage.theme = 'dark';
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.theme = 'light';
    }
  };

  useEffect(() => {
    const fetchDeadlines = async () => {
      try {
        const res = await api.get('/projects');
        const upcoming = res.data
          .filter((p: any) => p.deadline && isBefore(new Date(p.deadline), addDays(new Date(), 3)) && !isBefore(new Date(p.deadline), new Date()))
          .map((p: any) => ({
            id: p._id,
            title: 'Upcoming Deadline',
            message: `${p.title} is due in less than 3 days.`,
            type: 'warning',
            date: p.deadline
          }));
        setNotifications(upcoming);
      } catch (err) {
        console.error(err);
      }
    };
    if (user) fetchDeadlines();
  }, [user]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex bg-[#F9FAFB] dark:bg-[#0F172A] text-[#111827] dark:text-[#F1F5F9] transition-colors duration-300">
      {/* Sidebar */}
      <aside className="w-64 border-r border-gray-100 dark:border-gray-800 bg-white dark:bg-[#1E293B] flex flex-col h-screen sticky top-0 transition-colors duration-300">
        <div className="p-8">
          <Link to="/" className="text-2xl font-bold tracking-tighter text-primary-600 dark:text-primary-400">ARCHITRACK</Link>
          <p className="text-[10px] uppercase tracking-widest text-gray-400 dark:text-gray-500 mt-1 font-semibold">Studio Manager</p>
        </div>

        <nav className="flex-1 px-4 space-y-1">
          <Link to="/dashboard" className="flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-all group">
            <LayoutGrid size={18} className="text-gray-400 group-hover:text-primary-600 dark:group-hover:text-primary-400" />
            <span>Dashboard</span>
          </Link>
          <Link to="/projects" className="flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-all group">
            <Folder size={18} className="text-gray-400 group-hover:text-primary-600 dark:group-hover:text-primary-400" />
            <span>Projects</span>
          </Link>
          <Link to="/deadlines" className="flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-all group">
            <Calendar size={18} className="text-gray-400 group-hover:text-primary-600 dark:group-hover:text-primary-400" />
            <span>Deadlines</span>
          </Link>
          <Link to="/library" className="flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-all group">
            <Library size={18} className="text-gray-400 group-hover:text-primary-600 dark:group-hover:text-primary-400" />
            <span>Archi Library</span>
          </Link>
          <Link to="/notes" className="flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-all group">
            <PenTool size={18} className="text-gray-400 group-hover:text-primary-600 dark:group-hover:text-primary-400" />
            <span>Design Log</span>
          </Link>
          <div className="pt-4 mt-4 border-t border-gray-50 dark:border-gray-800 space-y-1">
            <Link to="/portfolio" className="flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-all group">
              <Globe size={18} className="text-gray-400 group-hover:text-primary-600 dark:group-hover:text-primary-400" />
              <span>Portfolio Manager</span>
            </Link>
            <Link to="/profile" className="flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-all group">
              <User size={18} className="text-gray-400 group-hover:text-primary-600 dark:group-hover:text-primary-400" />
              <span>Studio Profile</span>
            </Link>
            <Link to="/settings" className="flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-all group">
              <Settings size={18} className="text-gray-400 group-hover:text-primary-600 dark:group-hover:text-primary-400" />
              <span>Settings</span>
            </Link>
          </div>
        </nav>

        <div className="p-4 border-t border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-3 px-4 py-3 mb-2 rounded-xl bg-gray-50 dark:bg-gray-800/50">
            <div className="w-10 h-10 rounded-full bg-primary-600 text-white flex items-center justify-center text-sm font-bold shadow-lg shadow-primary-600/20">
              {user?.user_metadata.username?.charAt(0).toUpperCase()}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-bold truncate">{user?.user_metadata.username}</p>
              <p className="text-[10px] text-gray-400 dark:text-gray-500 truncate font-medium">{user?.email}</p>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-lg transition-all"
          >
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto relative">
        <header className="h-20 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between px-12 sticky top-0 bg-white/80 dark:bg-[#0F172A]/80 backdrop-blur-xl z-40 transition-colors duration-300">
          <div className="flex-1 max-w-md relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary-500 transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Search projects, files..." 
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-800/50 border-none rounded-xl text-sm focus:ring-2 focus:ring-primary-500/20 transition-all outline-none"
            />
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={toggleDarkMode}
              className="p-2.5 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-all text-gray-500 dark:text-gray-400 border border-transparent hover:border-gray-100 dark:hover:border-gray-700"
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            <div className="relative">
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2.5 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-all text-gray-500 dark:text-gray-400 relative border border-transparent hover:border-gray-100 dark:hover:border-gray-700"
              >
                <Bell size={20} />
                {notifications.length > 0 && (
                  <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white dark:ring-[#0F172A]" />
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-4 w-80 bg-white dark:bg-[#1E293B] border border-gray-100 dark:border-gray-800 rounded-2xl shadow-2xl z-50 p-6 space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="text-xs font-bold uppercase tracking-widest text-gray-400">Notifications</h4>
                    <button onClick={() => setShowNotifications(false)} className="text-gray-400 hover:text-gray-600"><X size={16} /></button>
                  </div>
                  <div className="space-y-3 max-h-[400px] overflow-auto">
                    {notifications.length > 0 ? (
                      notifications.map((n) => (
                        <div key={n.id} className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl border-l-4 border-primary-500 space-y-1">
                          <div className="flex items-center gap-2">
                            <Clock size={14} className="text-primary-500" />
                            <span className="text-xs font-bold">{n.title}</span>
                          </div>
                          <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">{n.message}</p>
                        </div>
                      ))
                    ) : (
                      <div className="py-12 text-center space-y-3">
                        <Bell size={32} className="mx-auto text-gray-200 dark:text-gray-700" />
                        <p className="text-xs text-gray-400 uppercase tracking-widest font-bold">All clear</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="h-8 w-px bg-gray-100 dark:bg-gray-800 mx-2" />

            <button 
              onClick={() => navigate('/profile')}
              className="flex items-center gap-3 pl-2 pr-1 py-1 rounded-full hover:bg-gray-50 dark:hover:bg-gray-800 transition-all border border-transparent hover:border-gray-100 dark:hover:border-gray-700"
            >
              <span className="text-sm font-bold hidden md:block">{user?.user_metadata.username}</span>
              <div className="w-8 h-8 rounded-full bg-primary-600 text-white flex items-center justify-center text-xs font-bold shadow-md shadow-primary-600/20 overflow-hidden">
                {user?.user_metadata.avatar_url ? (
                  <img src={user.user_metadata.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  user?.user_metadata.username?.charAt(0).toUpperCase()
                )}
              </div>
            </button>
          </div>
        </header>

        <div className="max-w-7xl mx-auto p-8 md:p-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
