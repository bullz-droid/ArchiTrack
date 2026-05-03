import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { Folder, Calendar, PenTool, ArrowRight, Clock, Globe } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Dashboard: React.FC = () => {
  const { session } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ projects: 0, deadlines: 0, notes: 0 });

  const username = session?.user?.user_metadata?.username || session?.user?.email?.split('@')[0] || 'studio';

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [projectsRes, notesRes] = await Promise.all([
          api.get('/projects'),
          api.get('/notes')
        ]);
        setProjects(projectsRes.data.slice(0, 3));
        setStats({
          projects: projectsRes.data.length,
          deadlines: projectsRes.data.filter((p: any) => p.deadline && new Date(p.deadline) > new Date()).length,
          notes: notesRes.data.length
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const getDeadlineAlert = (date: string) => {
    const deadline = new Date(date);
    const today = new Date();
    const diffTime = deadline.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return { label: 'Overdue', color: 'text-red-500 bg-red-50' };
    if (diffDays <= 3) return { label: `Due in ${diffDays}d`, color: 'text-orange-500 bg-orange-50' };
    return null;
  };

  return (
    <div className="space-y-12">
      <header className="relative">
        <div className="flex items-center gap-4 mb-4">
          <span className="h-px w-8 bg-primary-500"></span>
          <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary-500">Overview</span>
        </div>
        <h1 className="text-5xl font-black tracking-tighter mb-4 text-[#111827] dark:text-white uppercase leading-none">
          STUDIO <br /> <span className="text-primary-600 dark:text-primary-400">WORKSPACE</span>
        </h1>
        <p className="text-gray-500 dark:text-gray-400 text-lg font-medium max-w-2xl">
          Centralized management for architectural projects, design iterations, and studio deadlines.
        </p>
      </header>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Link to="/projects" className="bg-white dark:bg-[#1E293B] border border-gray-100 dark:border-gray-800 p-8 rounded-2xl shadow-sm hover:shadow-xl hover:border-primary-500/50 transition-all duration-500 group relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Folder size={64} />
          </div>
          <div className="flex justify-between items-start mb-8">
            <div className="p-3 bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 rounded-xl group-hover:bg-primary-600 group-hover:text-white transition-all duration-500">
              <Folder size={24} />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500">Total Projects</span>
          </div>
          <p className="text-5xl font-black tracking-tighter text-[#111827] dark:text-white">{stats.projects}</p>
        </Link>

        <Link to="/deadlines" className="bg-white dark:bg-[#1E293B] border border-gray-100 dark:border-gray-800 p-8 rounded-2xl shadow-sm hover:shadow-xl hover:border-primary-500/50 transition-all duration-500 group relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Calendar size={64} />
          </div>
          <div className="flex justify-between items-start mb-8">
            <div className="p-3 bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 rounded-xl group-hover:bg-orange-600 group-hover:text-white transition-all duration-500">
              <Calendar size={24} />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500">Active Deadlines</span>
          </div>
          <p className="text-5xl font-black tracking-tighter text-[#111827] dark:text-white">{stats.deadlines}</p>
        </Link>

        <Link to="/notes" className="bg-white dark:bg-[#1E293B] border border-gray-100 dark:border-gray-800 p-8 rounded-2xl shadow-sm hover:shadow-xl hover:border-primary-500/50 transition-all duration-500 group relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <PenTool size={64} />
          </div>
          <div className="flex justify-between items-start mb-8">
            <div className="p-3 bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 rounded-xl group-hover:bg-purple-600 group-hover:text-white transition-all duration-500">
              <PenTool size={24} />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500">Design Log</span>
          </div>
          <p className="text-5xl font-black tracking-tighter text-[#111827] dark:text-white">{stats.notes}</p>
        </Link>

        <Link to="/portfolio" className="bg-primary-600 dark:bg-primary-700 p-8 rounded-2xl shadow-xl shadow-primary-600/20 hover:bg-primary-700 dark:hover:bg-primary-600 transition-all duration-500 group relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-20 group-hover:opacity-40 transition-opacity text-white">
            <Globe size={64} />
          </div>
          <div className="flex justify-between items-start mb-8">
            <div className="p-3 bg-white/20 text-white rounded-xl">
              <Globe size={24} />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-white/60">Portfolio Status</span>
          </div>
          <p className="text-xl font-black tracking-tighter text-white uppercase mt-4">Live at /{username}</p>
          <div className="mt-6 flex items-center gap-2 text-white/80 group-hover:text-white transition-all">
            <span className="text-[9px] font-bold uppercase tracking-widest">Public Profile</span>
            <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-12 pt-8">
        <div className="xl:col-span-2 space-y-8">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-black tracking-tighter uppercase text-[#111827] dark:text-white">Recent Projects</h3>
            <Link to="/projects" className="text-[10px] font-bold uppercase tracking-widest text-primary-600 hover:underline">View All Archives</Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {loading ? (
              [1, 2].map(i => <div key={i} className="h-48 bg-gray-100 dark:bg-gray-800 rounded-3xl animate-pulse" />)
            ) : projects.length > 0 ? (
              projects.map((p: any) => (
                <Link key={p._id} to={`/projects/${p._id}`} className="group bg-white dark:bg-[#1E293B] border border-gray-100 dark:border-gray-800 p-8 rounded-3xl transition-all hover:shadow-xl hover:border-primary-500/30">
                  <div className="flex justify-between items-start mb-6">
                    <span className="px-2 py-1 bg-gray-50 dark:bg-gray-900/50 text-[8px] font-bold uppercase tracking-widest text-gray-400 rounded-md border border-gray-100 dark:border-gray-800">
                      {p.course || 'Studio'}
                    </span>
                    <ArrowRight size={16} className="text-gray-200 group-hover:text-primary-500 group-hover:translate-x-1 transition-all" />
                  </div>
                  <h4 className="text-xl font-black tracking-tighter uppercase text-[#111827] dark:text-white mb-2">{p.title}</h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400 font-medium line-clamp-2">{p.description}</p>
                </Link>
              ))
            ) : (
              <div className="col-span-full py-12 text-center bg-gray-50 dark:bg-gray-900/50 rounded-3xl border border-dashed border-gray-200 dark:border-gray-800">
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">No active projects</p>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-black tracking-tighter uppercase text-[#111827] dark:text-white">Upcoming</h3>
            <Link to="/deadlines" className="text-[10px] font-bold uppercase tracking-widest text-primary-600 hover:underline">Full Schedule</Link>
          </div>
          
          <div className="bg-white dark:bg-[#1E293B] border border-gray-100 dark:border-gray-800 p-6 rounded-3xl shadow-sm space-y-6">
            {loading ? (
              [1, 2, 3].map(i => <div key={i} className="h-16 bg-gray-50 dark:bg-gray-900/50 rounded-2xl animate-pulse" />)
            ) : projects.some((p: any) => p.deadline) ? (
              projects.filter((p: any) => p.deadline).slice(0, 3).map((p: any) => {
                const alert = getDeadlineAlert(p.deadline);
                return (
                  <div key={p._id} className="flex items-center gap-4 group">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${alert?.color || 'bg-gray-50 dark:bg-gray-900/50 text-gray-400'}`}>
                      <Clock size={18} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-[#111827] dark:text-white truncate uppercase tracking-tight">{p.title}</p>
                      <p className="text-[10px] text-gray-400 font-medium uppercase tracking-widest">{alert?.label || 'Scheduled'}</p>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="py-6 text-center">
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-300">All clear</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
