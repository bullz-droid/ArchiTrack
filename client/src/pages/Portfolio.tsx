import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { CheckCircle, Share2, ArrowRight } from 'lucide-react';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Portfolio: React.FC = () => {
  const { user } = useAuth();
  const [portfolioProjects, setPortfolioProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        const res = await api.get('/projects');
        setPortfolioProjects(res.data.filter((p: any) => p.isPortfolioItem));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPortfolio();
  }, []);

  const handleShare = () => {
    const username = user?.user_metadata?.username;
    const url = `${window.location.origin}/portfolio/${username}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-16 pb-32">
      <header className="flex justify-between items-end border-b border-gray-100 pb-12">
        <div>
          <h1 className="text-6xl font-black tracking-tighter mb-4 text-archi-black uppercase">Portfolio Generator</h1>
          <p className="text-gray-400 text-lg font-light">Curate and preview your public architectural showcase.</p>
        </div>
        <div className="flex gap-4">
          <Link 
            to={`/portfolio/${user?.user_metadata?.username}`}
            target="_blank"
            className="text-[10px] font-bold uppercase tracking-widest px-8 py-4 border-2 border-archi-black hover:bg-archi-black hover:text-white transition-all flex items-center gap-3"
          >
            Preview Live <ArrowRight size={16} />
          </Link>
          <button 
            onClick={handleShare}
            className="text-[10px] font-bold uppercase tracking-widest px-8 py-4 bg-archi-black text-white hover:bg-archi-dark-gray transition-all flex items-center gap-3"
          >
            {copied ? <CheckCircle size={16} /> : <Share2 size={16} />}
            {copied ? 'Copied Link' : 'Copy Public Link'}
          </button>
        </div>
      </header>

      {loading ? (
        <div className="space-y-24">
          {[1, 2].map(i => <div key={i} className="h-96 bg-archi-gray animate-pulse" />)}
        </div>
      ) : portfolioProjects.length > 0 ? (
        <div className="space-y-32">
          {portfolioProjects.map((project: any) => (
            <div key={project._id} className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start border-b border-gray-50 pb-32 last:border-0">
              <div className="lg:col-span-5 space-y-10">
                <div className="space-y-4">
                  <div className="flex items-center gap-6 text-[10px] font-black uppercase tracking-[0.3em] text-gray-300">
                    <span className="text-archi-black">{project.course || 'Design Studio'}</span>
                    <span className="w-12 h-px bg-gray-100" />
                    <span>{format(new Date(project.createdAt), 'yyyy')}</span>
                  </div>
                  <h2 className="text-5xl font-black tracking-tighter leading-[0.9] text-archi-black uppercase break-words">
                    {project.title}
                  </h2>
                </div>
                <p className="text-xl text-gray-500 leading-relaxed font-light italic border-l-2 border-gray-100 pl-8">
                  "{project.description}"
                </p>
                <Link 
                  to={`/projects/${project._id}`} 
                  className="text-[10px] font-black uppercase tracking-[0.2em] inline-flex items-center gap-3 hover:gap-6 transition-all group"
                >
                  Edit Documentation <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>

              <div className="lg:col-span-7 grid grid-cols-2 gap-4">
                {project.files && project.files.filter((f: any) => f.type === 'image').slice(0, 4).map((file: any) => (
                  <div key={file._id} className="aspect-square bg-archi-gray overflow-hidden group relative">
                    <img 
                      src={file.path} 
                      alt={file.name} 
                      className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-archi-black/0 group-hover:bg-archi-black/10 transition-colors" />
                  </div>
                ))}
                {(!project.files || project.files.filter((f: any) => f.type === 'image').length === 0) && (
                  <div className="col-span-2 aspect-[16/9] bg-archi-gray flex flex-col items-center justify-center border-2 border-dashed border-gray-100">
                    <p className="text-[10px] uppercase font-black tracking-[0.3em] text-gray-300">No architectural renders found</p>
                    <Link to={`/projects/${project._id}`} className="mt-4 text-[9px] font-bold uppercase tracking-widest text-archi-black underline underline-offset-4">Add Renders</Link>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-48 border border-dashed border-gray-200 text-center bg-gray-50/50">
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-300 mb-10 text-xl">Your portfolio is empty</p>
          <Link to="/projects" className="text-[10px] font-bold uppercase tracking-widest px-12 py-5 bg-archi-black text-white hover:bg-archi-dark-gray transition-all">Select Projects to Feature</Link>
        </div>
      )}

      {portfolioProjects.length > 0 && (
        <footer className="pt-24 border-t border-gray-100 text-center">
          <p className="text-[10px] uppercase font-bold tracking-widest text-gray-300">End of curated work</p>
        </footer>
      )}
    </div>
  );
};

export default Portfolio;
