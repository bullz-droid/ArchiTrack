import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import { ArrowRight } from 'lucide-react';
import { format } from 'date-fns';

const PublicPortfolio: React.FC = () => {
  const { username } = useParams();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        const res = await api.get(`/projects/portfolio/${username}`);
        setData(res.data);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Portfolio not found');
      } finally {
        setLoading(false);
      }
    };
    fetchPortfolio();
  }, [username]);

  if (loading) return <div className="h-screen flex flex-col items-center justify-center font-bold tracking-widest text-xs uppercase bg-white">
    <div className="animate-pulse mb-4">ARCHITRACK</div>
    <div className="text-gray-400">Loading Portfolio...</div>
  </div>;

  if (error) return <div className="h-screen flex items-center justify-center text-red-500 font-bold uppercase tracking-widest">{error}</div>;

  return (
    <div className="min-h-screen bg-white text-archi-black selection:bg-archi-black selection:text-white">
      {/* Header */}
      <nav className="p-8 md:p-12 flex justify-between items-center sticky top-0 bg-white/90 backdrop-blur-xl z-50 border-b border-gray-50">
        <div className="flex flex-col">
          <span className="text-2xl font-black tracking-tighter uppercase leading-none mb-1">{data.user.full_name || data.user.username}</span>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-archi-black rounded-full" />
            <span className="text-[10px] uppercase tracking-[0.3em] text-gray-400 font-black">Architecture Portfolio</span>
          </div>
        </div>
        <Link to="/" className="text-[10px] font-bold uppercase tracking-[0.2em] border-2 border-archi-black px-6 py-3 hover:bg-archi-black hover:text-white transition-all duration-500">
          Built with ArchiTrack
        </Link>
      </nav>

      {/* Main Content */}
      <main className="max-w-[1600px] mx-auto px-8 md:px-16 py-32 space-y-64">
        {data.projects.map((project: any, index: number) => (
          <section key={project._id} className={`grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-32 items-start ${index % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}>
            <div className={`lg:col-span-5 space-y-12 sticky lg:top-48 ${index % 2 === 1 ? 'lg:order-2' : ''}`}>
              <div className="space-y-6">
                <div className="flex items-center gap-6 text-[10px] font-black uppercase tracking-[0.3em] text-gray-300">
                  <span className="text-archi-black">{project.course || 'Design Studio'}</span>
                  <span className="w-12 h-px bg-gray-100" />
                  <span>{format(new Date(project.createdAt), 'yyyy')}</span>
                </div>
                <h2 className="text-7xl md:text-8xl font-black tracking-tighter leading-[0.85] text-archi-black uppercase break-words">
                  {project.title}
                </h2>
              </div>
              
              <div className="space-y-8 max-w-lg">
                <p className="text-2xl text-gray-500 leading-relaxed font-light italic">
                  "{project.description}"
                </p>
                
                <div className="flex flex-wrap gap-4 pt-4">
                  {project.files?.filter((f: any) => f.type === 'pdf').map((file: any) => (
                    <a 
                      key={file._id}
                      href={file.path}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-3 px-6 py-4 bg-archi-gray hover:bg-archi-black hover:text-white transition-all duration-500 group"
                    >
                      Technical Drawings <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </a>
                  ))}
                </div>
              </div>
            </div>

            <div className={`lg:col-span-7 space-y-16 ${index % 2 === 1 ? 'lg:order-1' : ''}`}>
              <div className="grid grid-cols-1 gap-16">
                {project.files?.filter((f: any) => f.type === 'image').map((file: any) => (
                  <div key={file._id} className="group overflow-hidden bg-archi-gray relative aspect-[4/3] cursor-crosshair">
                    <img 
                      src={file.path} 
                      alt={file.name} 
                      className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 scale-100 group-hover:scale-110"
                    />
                    <div className="absolute bottom-0 left-0 p-8 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-t from-archi-black/50 to-transparent w-full">
                      <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white">{file.name}</span>
                    </div>
                  </div>
                ))}
                {(!project.files || project.files.filter((f: any) => f.type === 'image').length === 0) && (
                  <div className="aspect-[4/3] bg-archi-gray flex items-center justify-center border-2 border-dashed border-gray-100">
                    <span className="text-[10px] uppercase tracking-[0.4em] text-gray-300 font-black">Documentation In Progress</span>
                  </div>
                )}
              </div>
            </div>
          </section>
        ))}
      </main>

      {/* Footer */}
      <footer className="py-32 border-t border-gray-100 text-center space-y-8">
        <div className="flex flex-col items-center gap-4">
          <span className="text-[10px] font-black uppercase tracking-[0.5em] text-gray-300">Curated with</span>
          <h3 className="text-4xl font-black tracking-tighter">ARCHITRACK</h3>
        </div>
        <p className="text-sm text-gray-400 font-light">© {new Date().getFullYear()} Architectural Design Portfolio</p>
      </footer>
    </div>
  );
};

export default PublicPortfolio;
