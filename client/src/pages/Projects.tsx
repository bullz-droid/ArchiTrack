import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { Plus, Clock, MoreHorizontal, ArrowRight, LayoutGrid, List, Search, Filter, Folder, Calendar } from 'lucide-react';
import toast from 'react-hot-toast';

const Projects: React.FC = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [newProject, setNewProject] = useState({ title: '', description: '', course: '', deadline: '' });

  const fetchProjects = async () => {
    try {
      const res = await api.get('/projects');
      setProjects(res.data);
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Failed to fetch projects');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        ...newProject,
        deadline: newProject.deadline || null
      };
      await api.post('/projects', payload);
      setShowModal(false);
      setNewProject({ title: '', description: '', course: '', deadline: '' });
      toast.success('Project initialized successfully');
      fetchProjects();
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Failed to initialize project');
    }
  };

  const getDeadlineAlert = (date: string) => {
    const deadline = new Date(date);
    const today = new Date();
    const diffTime = deadline.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return { label: 'Overdue', color: 'text-red-500 bg-red-50 dark:bg-red-900/10' };
    if (diffDays <= 3) return { label: `Due in ${diffDays}d`, color: 'text-orange-500 bg-orange-50 dark:bg-orange-900/10' };
    return { label: `Due in ${diffDays}d`, color: 'text-blue-500 bg-blue-50 dark:bg-blue-900/10' };
  };

  return (
    <div className="space-y-12">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <span className="h-px w-8 bg-primary-500"></span>
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary-500">Studio Library</span>
          </div>
          <h1 className="text-5xl font-black tracking-tighter text-[#111827] dark:text-white uppercase leading-none">
            Digital <span className="text-primary-600">Archives</span>
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-lg font-medium max-w-xl">
            Manage your architectural portfolio and project iterations.
          </p>
        </div>
        <button 
          onClick={() => setShowModal(true)} 
          className="bg-primary-600 hover:bg-primary-700 text-white font-bold py-4 px-8 rounded-2xl transition-all flex items-center gap-3 shadow-xl shadow-primary-600/20 active:scale-95 self-start md:self-auto"
        >
          <Plus size={20} />
          <span>Initialize Project</span>
        </button>
      </header>

      {/* Toolbar */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white dark:bg-[#1E293B] p-4 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
        <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-900/50 p-1 rounded-xl">
          <button 
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white dark:bg-[#1E293B] shadow-sm text-primary-600' : 'text-gray-400 hover:text-gray-600'}`}
          >
            <LayoutGrid size={18} />
          </button>
          <button 
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-white dark:bg-[#1E293B] shadow-sm text-primary-600' : 'text-gray-400 hover:text-gray-600'}`}
          >
            <List size={18} />
          </button>
        </div>

        <div className="flex flex-1 items-center gap-4 max-w-md w-full">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input 
              type="text" 
              placeholder="Search projects..." 
              className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-900/50 border-none rounded-xl text-sm focus:ring-2 focus:ring-primary-500/20 outline-none transition-all"
            />
          </div>
          <button className="p-2 text-gray-400 hover:text-primary-600 transition-colors">
            <Filter size={20} />
          </button>
        </div>
      </div>

      {/* Projects Display */}
      {loading ? (
        <div className={viewMode === 'grid' ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" : "space-y-4"}>
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="h-64 bg-gray-100 dark:bg-gray-800 rounded-3xl animate-pulse" />
          ))}
        </div>
      ) : projects.length > 0 ? (
        <div className={viewMode === 'grid' ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" : "space-y-4"}>
          {projects.map((project: any) => {
            const alert = project.deadline ? getDeadlineAlert(project.deadline) : null;
            
            if (viewMode === 'grid') {
              return (
                <Link 
                  to={`/projects/${project._id}`} 
                  key={project._id} 
                  className="group bg-white dark:bg-[#1E293B] border border-gray-100 dark:border-gray-800 p-8 rounded-3xl transition-all duration-500 hover:shadow-2xl hover:border-primary-500/50 relative overflow-hidden flex flex-col h-full"
                >
                  <div className="flex justify-between items-start mb-8">
                    <div className="px-3 py-1 bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 text-[9px] font-bold uppercase tracking-widest rounded-lg border border-primary-100 dark:border-primary-800/50">
                      {project.course || 'General'}
                    </div>
                    {alert && (
                      <div className={`px-2 py-1 rounded-lg text-[9px] font-bold uppercase tracking-widest flex items-center gap-1.5 ${alert.color}`}>
                        <Clock size={10} />
                        {alert.label}
                      </div>
                    )}
                  </div>
                  
                  <h3 className="text-2xl font-black tracking-tighter text-[#111827] dark:text-white uppercase mb-4 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 text-sm font-medium leading-relaxed line-clamp-3 mb-8">
                    {project.description}
                  </p>

                  <div className="mt-auto pt-6 border-t border-gray-50 dark:border-gray-800 flex items-center justify-between">
                    <div className="flex -space-x-2">
                      {[1, 2, 3].map(i => (
                        <div key={i} className="w-7 h-7 rounded-full border-2 border-white dark:border-[#1E293B] bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-[8px] font-bold">
                          {i}
                        </div>
                      ))}
                    </div>
                    <div className="text-primary-600 dark:text-primary-400 opacity-0 group-hover:opacity-100 transition-all transform translate-x-4 group-hover:translate-x-0">
                      <ArrowRight size={20} />
                    </div>
                  </div>
                </Link>
              );
            }

            return (
              <Link 
                to={`/projects/${project._id}`} 
                key={project._id} 
                className="group flex items-center gap-6 bg-white dark:bg-[#1E293B] border border-gray-100 dark:border-gray-800 p-4 rounded-2xl hover:shadow-lg transition-all"
              >
                <div className="w-12 h-12 bg-primary-50 dark:bg-primary-900/20 rounded-xl flex items-center justify-center text-primary-600 dark:text-primary-400">
                  <Folder size={24} />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-[#111827] dark:text-white truncate uppercase tracking-tight">{project.title}</h4>
                  <p className="text-xs text-gray-400 truncate">{project.course || 'No Studio Assigned'}</p>
                </div>
                <div className="hidden md:block text-right">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Status</p>
                  <div className={`px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest ${alert?.color || 'bg-gray-50 dark:bg-gray-800 text-gray-400'}`}>
                    {alert?.label || 'Ongoing'}
                  </div>
                </div>
                <ArrowRight size={18} className="text-gray-300 group-hover:text-primary-600 transition-colors" />
              </Link>
            );
          })}
        </div>
      ) : (
        <div className="py-32 text-center space-y-6 bg-white dark:bg-[#1E293B] rounded-3xl border border-dashed border-gray-200 dark:border-gray-800">
          <div className="w-20 h-20 bg-gray-50 dark:bg-gray-900/50 rounded-full flex items-center justify-center mx-auto text-gray-300">
            <Folder size={40} />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-[#111827] dark:text-white uppercase tracking-tighter">No Projects Found</h3>
            <p className="text-gray-400 text-sm">Initialize your first project to start tracking your studio work.</p>
          </div>
          <button 
            onClick={() => setShowModal(true)}
            className="text-primary-600 font-bold text-sm hover:underline"
          >
            Create a project now
          </button>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="bg-white dark:bg-[#1E293B] w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-8 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
              <h2 className="text-2xl font-black tracking-tighter uppercase text-[#111827] dark:text-white">Initialize Project</h2>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl transition-colors">
                <Plus size={24} className="rotate-45 text-gray-400" />
              </button>
            </div>
            <form onSubmit={handleCreate} className="p-8 space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Project Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Modernist Pavilion"
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900/50 border-none rounded-xl focus:ring-2 focus:ring-primary-500/20 outline-none transition-all"
                  value={newProject.title}
                  onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Description</label>
                <textarea
                  rows={3}
                  placeholder="Brief overview of design intent..."
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900/50 border-none rounded-xl focus:ring-2 focus:ring-primary-500/20 outline-none transition-all resize-none"
                  value={newProject.description}
                  onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Studio/Course</label>
                  <input
                    type="text"
                    placeholder="e.g. ARCH 301"
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900/50 border-none rounded-xl focus:ring-2 focus:ring-primary-500/20 outline-none transition-all"
                    value={newProject.course}
                    onChange={(e) => setNewProject({ ...newProject, course: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Deadline</label>
                  <input
                    type="date"
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900/50 border-none rounded-xl focus:ring-2 focus:ring-primary-500/20 outline-none transition-all"
                    value={newProject.deadline}
                    onChange={(e) => setNewProject({ ...newProject, deadline: e.target.value })}
                  />
                </div>
              </div>
              <button
                type="submit"
                className="w-full py-4 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-primary-600/20 active:scale-95"
              >
                Create Project
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Projects;
                    <div className="w-10 h-10 bg-archi-gray flex items-center justify-center text-[10px] font-bold">
                      {project.files?.length || 0}
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-gray-300">Assets Uploaded</span>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-widest flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-2">
                    Open Project <ArrowRight size={14} />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      ) : (
        <div className="py-48 border border-dashed border-gray-200 text-center bg-gray-50/50">
          <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-gray-300 mb-10 text-xl">The library is empty</p>
          <button onClick={() => setShowModal(true)} className="text-[10px] font-bold uppercase tracking-widest px-12 py-5 bg-archi-black text-white hover:bg-archi-dark-gray transition-all">Start Your First Design</button>
        </div>
      )}

      {/* Create Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-archi-black/60 backdrop-blur-md flex items-center justify-center z-50 p-6">
          <div className="bg-white max-w-xl w-full p-16 relative shadow-2xl">
            <h2 className="text-4xl font-black tracking-tighter mb-10 uppercase">New Project Entry</h2>
            <form onSubmit={handleCreate} className="space-y-8">
              <div>
                <label className="block text-[10px] uppercase tracking-widest font-bold text-gray-400 mb-3">Project Title</label>
                <input
                  type="text"
                  required
                  className="w-full px-0 py-3 border-b-2 border-gray-100 focus:border-archi-black outline-none transition-colors text-xl font-bold tracking-tight"
                  placeholder="e.g., Vertical Housing Studio"
                  value={newProject.title}
                  onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <label className="block text-[10px] uppercase tracking-widest font-bold text-gray-400 mb-3">Course / Unit</label>
                  <input
                    type="text"
                    className="w-full px-0 py-3 border-b-2 border-gray-100 focus:border-archi-black outline-none transition-colors text-sm font-bold uppercase tracking-widest"
                    placeholder="ARC-401"
                    value={newProject.course}
                    onChange={(e) => setNewProject({ ...newProject, course: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-widest font-bold text-gray-400 mb-3">Submission Deadline</label>
                  <input
                    type="date"
                    className="w-full px-0 py-3 border-b-2 border-gray-100 focus:border-archi-black outline-none transition-colors text-sm font-bold"
                    value={newProject.deadline}
                    onChange={(e) => setNewProject({ ...newProject, deadline: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-widest font-bold text-gray-400 mb-3">Design Description</label>
                <textarea
                  className="w-full px-4 py-4 bg-archi-gray/50 border-0 focus:ring-2 focus:ring-archi-black outline-none h-32 text-sm font-light leading-relaxed"
                  placeholder="Outline the architectural intent..."
                  value={newProject.description}
                  onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                />
              </div>
              <div className="flex gap-4 pt-6">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-4 text-[10px] font-bold uppercase tracking-widest border border-gray-200 hover:bg-gray-50 transition-colors">Discard</button>
                <button type="submit" className="flex-1 py-4 text-[10px] font-bold uppercase tracking-widest bg-archi-black text-white hover:bg-archi-dark-gray transition-all">Initialize</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Projects;
