import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutGrid, LogOut, User, Folder, Calendar, PenTool, Bell, X, Clock, Globe, Share2, Library } from 'lucide-react';
import api from '../services/api';
import { isBefore, addDays } from 'date-fns';
import { supabase } from '../services/supabase';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);

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
    <div className="min-h-screen flex bg-white text-archi-black">
      {/* Sidebar */}
      <aside className="w-64 border-r border-gray-100 flex flex-col h-screen sticky top-0">
        <div className="p-8">
          <Link to="/" className="text-2xl font-bold tracking-tighter">ARCHITRACK</Link>
          <p className="text-[10px] uppercase tracking-widest text-gray-400 mt-1">Design Studio Manager</p>
        </div>

        <nav className="flex-1 px-4 space-y-1">
          <Link to="/dashboard" className="flex items-center gap-3 px-4 py-3 text-sm font-medium hover:bg-archi-gray transition-colors group">
            <LayoutGrid size={18} className="text-gray-400 group-hover:text-archi-black" />
            <span>Dashboard</span>
          </Link>
          <Link to="/projects" className="flex items-center gap-3 px-4 py-3 text-sm font-medium hover:bg-archi-gray transition-colors group">
            <Folder size={18} className="text-gray-400 group-hover:text-archi-black" />
            <span>Projects</span>
          </Link>
          <Link to="/deadlines" className="flex items-center gap-3 px-4 py-3 text-sm font-medium hover:bg-archi-gray transition-colors group">
            <Calendar size={18} className="text-gray-400 group-hover:text-archi-black" />
            <span>Deadlines</span>
          </Link>
          <Link to="/library" className="flex items-center gap-3 px-4 py-3 text-sm font-medium hover:bg-archi-gray transition-colors group">
            <Library size={18} className="text-gray-400 group-hover:text-archi-black" />
            <span>Archi Library</span>
          </Link>
          <Link to="/notes" className="flex items-center gap-3 px-4 py-3 text-sm font-medium hover:bg-archi-gray transition-colors group">
            <PenTool size={18} className="text-gray-400 group-hover:text-archi-black" />
            <span>Design Log</span>
          </Link>
          <div className="pt-4 mt-4 border-t border-gray-50 space-y-1">
            <Link to="/portfolio" className="flex items-center gap-3 px-4 py-3 text-sm font-medium hover:bg-archi-gray transition-colors group">
              <User size={18} className="text-gray-400 group-hover:text-archi-black" />
              <span>Portfolio Manager</span>
            </Link>
            <Link 
              to={`/portfolio/${localStorage.getItem('username') || 'user'}`} 
              target="_blank"
              className="flex items-center justify-between px-4 py-3 text-sm font-medium hover:bg-archi-gray transition-colors group"
            >
              <div className="flex items-center gap-3">
                <Globe size={18} className="text-gray-400 group-hover:text-archi-black" />
                <span>View Live Site</span>
              </div>
              <Share2 size={14} className="text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>
          </div>
        </nav>

        <div className="p-4 border-t border-gray-100">
          <div className="flex items-center gap-3 px-4 py-3 mb-2">
            <div className="w-8 h-8 bg-archi-black text-white flex items-center justify-center text-xs font-bold">
              {user?.user_metadata.username?.charAt(0).toUpperCase()}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-medium truncate">{user?.user_metadata.username}</p>
              <p className="text-[10px] text-gray-400 truncate">{user?.email}</p>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2 text-sm font-medium text-red-500 hover:bg-red-50 transition-colors"
          >
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto relative">
        <header className="h-20 border-b border-gray-50 flex items-center justify-end px-12 sticky top-0 bg-white/80 backdrop-blur-sm z-40">
          <div className="relative">
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 hover:bg-archi-gray transition-all relative"
            >
              <Bell size={20} />
              {notifications.length > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-4 w-80 bg-white border border-gray-100 shadow-2xl z-50 p-6 space-y-4">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Notifications</h4>
                  <button onClick={() => setShowNotifications(false)}><X size={14} /></button>
                </div>
                {notifications.length > 0 ? (
                  notifications.map((n) => (
                    <div key={n.id} className="p-3 bg-archi-gray/30 border-l-2 border-red-500 space-y-1">
                      <div className="flex items-center gap-2">
                        <Clock size={12} className="text-red-500" />
                        <span className="text-[10px] font-bold uppercase tracking-tight">{n.title}</span>
                      </div>
                      <p className="text-[11px] text-gray-600 leading-tight">{n.message}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-[10px] text-center text-gray-400 uppercase tracking-widest py-8">No new alerts</p>
                )}
              </div>
            )}
          </div>
        </header>

        <div className="max-w-6xl mx-auto p-12">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
