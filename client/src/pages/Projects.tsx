import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { Plus, Clock, MoreHorizontal, ArrowRight } from 'lucide-react';

const Projects: React.FC = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newProject, setNewProject] = useState({ title: '', description: '', course: '', deadline: '' });

  const fetchProjects = async () => {
    try {
      const res = await api.get('/projects');
      setProjects(res.data);
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.message || 'Failed to initialize project. Please try again.');
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
      fetchProjects();
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.message || 'Failed to initialize project. Please try again.');
    }
  };

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
    <div className="space-y-16">
      <header className="flex justify-between items-end border-b border-gray-100 pb-12">
        <div>
          <h1 className="text-6xl font-black tracking-tighter mb-4 text-archi-black uppercase">Studio Library</h1>
          <p className="text-gray-400 text-lg font-light">Archive and manage your architectural design portfolio.</p>
        </div>
        <button 
          onClick={() => setShowModal(true)} 
          className="text-[10px] font-bold uppercase tracking-widest px-8 py-4 bg-archi-black text-white hover:bg-archi-dark-gray transition-all flex items-center gap-3"
        >
          <Plus size={16} /> Initialize Project
        </button>
      </header>

      {/* Projects Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {[1, 2, 3, 4].map(i => <div key={i} className="h-64 bg-archi-gray animate-pulse" />)}
        </div>
      ) : projects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {projects.map((project: any) => {
            const alert = project.deadline ? getDeadlineAlert(project.deadline) : null;
            return (
              <Link to={`/projects/${project._id}`} key={project._id} className="group block bg-white border border-gray-100 p-10 transition-all hover:border-archi-black hover:shadow-2xl">
                <div className="flex justify-between items-start mb-10">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 px-3 py-1 border border-gray-100 group-hover:border-archi-black transition-colors">
                    {project.course || 'Unassigned Studio'}
                  </span>
                  <div className="flex items-center gap-4">
                    {alert && (
                      <div className={`flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest px-2 py-1 ${alert.color}`}>
                        <Clock size={10} />
                        {alert.label}
                      </div>
                    )}
                    <MoreHorizontal size={16} className="text-gray-300" />
                  </div>
                </div>
                <h3 className="text-4xl font-black tracking-tighter mb-6 group-hover:underline underline-offset-8 decoration-2">{project.title}</h3>
                <p className="text-gray-500 text-lg font-light leading-relaxed mb-10 line-clamp-2">{project.description}</p>
                
                <div className="flex justify-between items-center pt-8 border-t border-gray-50 mt-auto">
                  <div className="flex items-center gap-4">
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
