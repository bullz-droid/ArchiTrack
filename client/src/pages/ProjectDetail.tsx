import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { ArrowLeft, File, FileText, Trash2, CheckCircle, ExternalLink, Plus, History, Share2 } from 'lucide-react';
import { format } from 'date-fns';

const ProjectDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchProject = async () => {
    try {
      const res = await api.get(`/projects/${id}`);
      setProject(res.data);
    } catch (err) {
      console.error(err);
      navigate('/projects');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProject();
  }, [id]);

  const [uploading, setUploading] = useState(false);

  const handleUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    
    setUploading(true);
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append('files', files[i]);
    }
    
    try {
      await api.post(`/projects/${id}/upload`, formData);
      fetchProject();
    } catch (err) {
      console.error('Upload failed:', err);
    } finally {
      setUploading(false);
    }
  };

  const togglePortfolio = async () => {
    try {
      await api.put(`/projects/${id}`, { ...project, isPortfolioItem: !project.isPortfolioItem });
      fetchProject();
    } catch (err) {
      console.error(err);
    }
  };

  const deleteProject = async () => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        await api.delete(`/projects/${id}`);
        navigate('/projects');
      } catch (err) {
        console.error(err);
      }
    }
  };

  const getStatus = () => {
    if (!project.deadline) return 'In Development';
    const deadline = new Date(project.deadline);
    const today = new Date();
    const diffTime = deadline.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return 'Overdue';
    if (diffDays <= 3) return 'Finalizing';
    return 'In Design';
  };

  const [copying, setCopying] = useState(false);

  const copyPortfolioLink = () => {
    const username = localStorage.getItem('username') || 'user';
    const url = `${window.location.origin}/portfolio/${username}`;
    navigator.clipboard.writeText(url);
    setCopying(true);
    setTimeout(() => setCopying(false), 2000);
  };

  if (loading) return <div className="h-screen flex items-center justify-center font-bold tracking-widest text-[10px] uppercase bg-white">
    <div className="flex flex-col items-center gap-4">
      <div className="w-12 h-px bg-archi-black animate-pulse" />
      <span>Loading Studio Project</span>
    </div>
  </div>;

  const status = getStatus();

  return (
    <div className="space-y-12 pb-24">
      <header className="space-y-6">
        <Link to="/projects" className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-archi-black transition-colors group">
          <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Back to Projects
        </Link>
        <div className="flex justify-between items-start">
          <div className="space-y-4 max-w-2xl">
            <div className="flex items-center gap-4">
              <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 px-3 py-1 border border-gray-100">
                {project.course || 'Unassigned Studio'}
              </span>
              {project.isPortfolioItem && (
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-500 flex items-center gap-1.5 px-3 py-1 bg-emerald-50 border border-emerald-100">
                    <CheckCircle size={10} /> Portfolio Feature
                  </span>
                  <button 
                    onClick={copyPortfolioLink}
                    className="text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-archi-black flex items-center gap-1 transition-colors"
                  >
                    <Share2 size={10} /> {copying ? 'Copied!' : 'Copy Portfolio Link'}
                  </button>
                </div>
              )}
            </div>
            <h1 className="text-6xl font-black tracking-tighter leading-none text-archi-black">{project.title}</h1>
            <p className="text-xl text-gray-500 leading-relaxed pt-2 font-light">{project.description}</p>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={togglePortfolio}
              className={`text-[10px] font-bold uppercase tracking-widest px-6 py-3 border border-archi-black transition-all hover:bg-archi-black hover:text-white ${project.isPortfolioItem ? 'bg-archi-black text-white' : 'bg-white text-archi-black'}`}
            >
              {project.isPortfolioItem ? 'In Portfolio' : 'Feature in Portfolio'}
            </button>
            <button 
              onClick={deleteProject}
              className="p-3 border border-red-100 text-red-400 hover:bg-red-50 hover:border-red-200 transition-all"
            >
              <Trash2 size={18} />
            </button>
          </div>
        </div>
      </header>

      {/* Stats/Details */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-0 border-y border-gray-100 bg-gray-100">
        <div className="p-8 bg-white border-r border-gray-100">
          <h4 className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-3">Created</h4>
          <p className="text-sm font-bold tracking-tight">{format(new Date(project.createdAt), 'MMM d, yyyy')}</p>
        </div>
        <div className="p-8 bg-white border-r border-gray-100">
          <h4 className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-3">Deadline</h4>
          <p className={`text-sm font-bold tracking-tight ${status === 'Overdue' ? 'text-red-500' : ''}`}>
            {project.deadline ? format(new Date(project.deadline), 'MMM d, yyyy') : '--'}
          </p>
        </div>
        <div className="p-8 bg-white border-r border-gray-100">
          <h4 className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-3">Total Files</h4>
          <p className="text-sm font-bold tracking-tight">{project.files?.length || 0} Assets</p>
        </div>
        <div className="p-8 bg-white">
          <h4 className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-3">Studio Status</h4>
          <p className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 inline-block ${
            status === 'Overdue' ? 'bg-red-50 text-red-600 border border-red-100' : 
            status === 'Finalizing' ? 'bg-orange-50 text-orange-600 border border-orange-100' :
            'bg-archi-gray text-archi-black border border-gray-200'
          }`}>
            {status}
          </p>
        </div>
      </div>

      {/* File Management */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-24">
        <div className="lg:col-span-2 space-y-12">
          <div className="flex justify-between items-end">
            <div>
              <h2 className="text-3xl font-black tracking-tighter uppercase mb-2">Design Documentation</h2>
              <p className="text-sm text-gray-400 font-medium">Manage your architectural drawings, CAD files, and renders.</p>
            </div>
            <label className={`btn-primary cursor-pointer flex items-center gap-2 px-8 py-3 ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}>
              <Plus size={16} /> {uploading ? 'Uploading...' : 'Add Studio Assets'}
              <input 
                type="file" 
                multiple 
                disabled={uploading}
                className="hidden" 
                onChange={(e) => handleUpload(e.target.files)}
              />
            </label>
          </div>

          {project.files && project.files.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {project.files.map((file: any) => (
                <div key={file._id} className="group relative bg-white border border-gray-100 p-4 transition-all hover:border-archi-black">
                  <div className="h-64 bg-archi-gray flex items-center justify-center mb-6 overflow-hidden relative">
                    {file.type === 'image' ? (
                      <img 
                        src={file.path} 
                        alt={file.name} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 grayscale hover:grayscale-0"
                      />
                    ) : (
                      <div className="flex flex-col items-center gap-3 text-gray-300">
                        {file.type === 'pdf' ? <FileText size={64} strokeWidth={1} /> : <File size={64} strokeWidth={1} />}
                        <span className="text-[10px] uppercase font-bold tracking-[0.2em]">{file.type}</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-archi-black/0 group-hover:bg-archi-black/5 transition-colors duration-500" />
                  </div>
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <h4 className="text-[10px] font-bold uppercase tracking-widest truncate max-w-[180px]">{file.name}</h4>
                      <p className="text-[10px] text-gray-400 uppercase tracking-widest">{format(new Date(file.uploadedAt), 'MMM d, yyyy')}</p>
                    </div>
                    <a 
                      href={file.path} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="p-2 border border-gray-100 hover:border-archi-black transition-all group/link"
                    >
                      <ExternalLink size={14} className="text-gray-400 group-hover/link:text-archi-black transition-colors" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-32 border border-dashed border-gray-200 text-center bg-gray-50/50">
              <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-300">No architectural assets found</p>
            </div>
          )}
        </div>

        {/* Timeline Tracker */}
        <div className="space-y-8">
          <div className="flex items-center gap-2 mb-8">
            <History size={20} className="text-archi-black" />
            <h2 className="text-2xl font-bold tracking-tight">Timeline</h2>
          </div>
          
          <div className="relative pl-8 space-y-8 before:content-[''] before:absolute before:left-[11px] before:top-2 before:bottom-0 before:w-px before:bg-gray-100">
            {project.files?.sort((a: any, b: any) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()).map((file: any) => (
              <div key={file._id} className="relative">
                <div className="absolute -left-[27px] top-1 w-3 h-3 rounded-full border-2 border-archi-black bg-white z-10" />
                <div className="space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                    {format(new Date(file.uploadedAt), 'MMM d, h:mm a')}
                  </span>
                  <p className="text-sm font-bold leading-tight">Uploaded {file.name}</p>
                  <p className="text-[10px] uppercase tracking-widest text-gray-400">{file.type} file added to studio</p>
                </div>
              </div>
            ))}
            <div className="relative">
              <div className="absolute -left-[27px] top-1 w-3 h-3 rounded-full border-2 border-gray-300 bg-white z-10" />
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                  {format(new Date(project.createdAt), 'MMM d, h:mm a')}
                </span>
                <p className="text-sm font-bold leading-tight">Project Created</p>
                <p className="text-[10px] uppercase tracking-widest text-gray-400">Initialized in ArchiTrack</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;
