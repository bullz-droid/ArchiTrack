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

      {/* Recent Projects */}
      <section>
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-3xl font-black tracking-tighter uppercase mb-2">Recent Studio Work</h2>
            <div className="h-1 w-12 bg-archi-black" />
          </div>
          <Link to="/projects" className="text-[10px] font-bold uppercase tracking-[0.2em] flex items-center gap-3 hover:gap-5 transition-all group">
            Explore All Projects <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map(i => <div key={i} className="h-64 bg-archi-gray animate-pulse" />)}
          </div>
        ) : projects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {projects.map((project: any) => {
              const alert = project.deadline ? getDeadlineAlert(project.deadline) : null;
              return (
                <Link to={`/projects/${project._id}`} key={project._id} className="group block bg-white border border-gray-100 p-8 transition-all hover:border-archi-black hover:shadow-2xl hover:-translate-y-1">
                  <div className="flex justify-between items-start mb-8">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 px-3 py-1 border border-gray-100 group-hover:border-archi-black transition-colors">
                      {project.course || 'Studio'}
                    </span>
                    {alert && (
                      <div className={`flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest px-2 py-1 ${alert.color}`}>
                        <Clock size={10} />
                        {alert.label}
                      </div>
                    )}
                  </div>
                  <h3 className="text-2xl font-black tracking-tighter mb-4 leading-none group-hover:underline underline-offset-4 decoration-1">{project.title}</h3>
                  <p className="text-gray-400 text-sm line-clamp-2 font-light leading-relaxed mb-8">{project.description}</p>
                  
                  <div className="pt-6 border-t border-gray-50 flex justify-between items-center">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-gray-300">
                      {project.files?.length || 0} Assets
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      View <ArrowRight size={12} />
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="py-24 border border-dashed border-gray-200 text-center bg-gray-50/50">
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-300 mb-8">No active projects in studio</p>
            <Link to="/projects" className="text-[10px] font-bold uppercase tracking-widest px-8 py-4 bg-archi-black text-white hover:bg-archi-dark-gray transition-colors">Initialize First Project</Link>
          </div>
        )}
      </section>
    </div>
  );
};

export default Dashboard;
