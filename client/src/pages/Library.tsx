import React, { useEffect, useState, useRef } from 'react';
import api from '../services/api';
import { 
  File, 
  FileText, 
  Download, 
  Trash2, 
  Search, 
  Plus, 
  ExternalLink,
  Share2
} from 'lucide-react';
import { format } from 'date-fns';

const Library: React.FC = () => {
  const [files, setFiles] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  
  // Filters
  const [search, setSearch] = useState('');
  const [selectedProject, setSelectedProject] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [selectedFolder, setSelectedFolder] = useState('');
  const [dateSort, setDateSort] = useState('newest');

  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchData = async () => {
    try {
      const [filesRes, projectsRes] = await Promise.all([
        api.get('/files', {
          params: {
            projectId: selectedProject,
            fileType: selectedType,
            folder: selectedFolder,
            dateSort
          }
        }),
        api.get('/projects')
      ]);
      setFiles(filesRes.data);
      setProjects(projectsRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [selectedProject, selectedType, selectedFolder, dateSort]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (!selectedFiles || selectedFiles.length === 0) return;

    setUploading(true);
    setUploadProgress(0);

    for (let i = 0; i < selectedFiles.length; i++) {
      const formData = new FormData();
      formData.append('file', selectedFiles[i]);
      if (selectedProject) {
        formData.append('projectId', selectedProject);
      }
      if (selectedFolder) {
        formData.append('folder', selectedFolder);
      }

      try {
        await api.post('/files/upload', formData, {
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / (progressEvent.total || 1));
            setUploadProgress(percentCompleted);
          }
        });
      } catch (err) {
        console.error('Upload failed:', err);
      }
    }

    setUploading(false);
    setUploadProgress(0);
    fetchData();
  };

  const deleteFile = async (id: string) => {
    if (window.confirm('Delete this studio asset permanently?')) {
      try {
        await api.delete(`/files/${id}`);
        fetchData();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleShare = async (id: string) => {
    try {
      const res = await api.post(`/files/${id}/share`);
      navigator.clipboard.writeText(res.data.signedUrl);
      alert('Secure share link copied to clipboard! (Expires in 1 hour)');
    } catch (err) {
      console.error('Sharing failed:', err);
    }
  };

  const downloadFile = (url: string, name: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', name);
    link.setAttribute('target', '_blank');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredFiles = files.filter((f: any) => 
    f.file_name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-16 pb-32">
      <header className="flex justify-between items-end border-b border-gray-100 pb-12">
        <div>
          <h1 className="text-6xl font-black tracking-tighter mb-4 text-archi-black uppercase">Archi Library</h1>
          <p className="text-gray-400 text-lg font-light">Centralized asset management for all studio projects.</p>
        </div>
        <div className="flex gap-4">
          <input 
            type="file" 
            multiple 
            className="hidden" 
            ref={fileInputRef}
            onChange={handleUpload}
          />
          <button 
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className={`text-[10px] font-bold uppercase tracking-widest px-8 py-4 bg-archi-black text-white hover:bg-archi-dark-gray transition-all flex items-center gap-3 ${uploading ? 'opacity-50' : ''}`}
          >
            <Plus size={16} /> {uploading ? `Uploading ${uploadProgress}%` : 'Upload Assets'}
          </button>
        </div>
      </header>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-8 bg-archi-gray/30 p-8 border border-gray-100">
        <div className="flex-1 min-w-[300px] relative">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search by filename..."
            className="w-full bg-white border-0 py-4 pl-12 pr-4 text-sm font-light outline-none focus:ring-2 focus:ring-archi-black transition-all"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        
        <div className="flex flex-wrap items-center gap-6">
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Project</span>
            <select 
              className="bg-white border-0 py-3 px-4 text-[10px] font-bold uppercase tracking-widest outline-none focus:ring-2 focus:ring-archi-black cursor-pointer"
              value={selectedProject}
              onChange={(e) => setSelectedProject(e.target.value)}
            >
              <option value="">All Projects</option>
              {projects.map((p: any) => (
                <option key={p._id} value={p._id}>{p.title}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Type</span>
            <select 
              className="bg-white border-0 py-3 px-4 text-[10px] font-bold uppercase tracking-widest outline-none focus:ring-2 focus:ring-archi-black cursor-pointer"
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
            >
              <option value="">All Types</option>
              <option value="image">Images</option>
              <option value="pdf">PDF Documents</option>
            </select>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Folder</span>
            <select 
              className="bg-white border-0 py-3 px-4 text-[10px] font-bold uppercase tracking-widest outline-none focus:ring-2 focus:ring-archi-black cursor-pointer"
              value={selectedFolder}
              onChange={(e) => setSelectedFolder(e.target.value)}
            >
              <option value="">All Folders</option>
              <option value="General">General</option>
              <option value="Drawings">Drawings</option>
              <option value="Renders">Renders</option>
              <option value="Models">Models</option>
              <option value="Site">Site Analysis</option>
            </select>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Sort</span>
            <select 
              className="bg-white border-0 py-3 px-4 text-[10px] font-bold uppercase tracking-widest outline-none focus:ring-2 focus:ring-archi-black cursor-pointer"
              value={dateSort}
              onChange={(e) => setDateSort(e.target.value)}
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
            </select>
          </div>
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {[1, 2, 3, 4, 5, 6, 7, 8].map(i => <div key={i} className="aspect-square bg-archi-gray animate-pulse" />)}
        </div>
      ) : filteredFiles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {filteredFiles.map((file: any) => (
            <div key={file.id} className="group relative bg-white border border-gray-100 p-4 transition-all hover:border-archi-black">
              <div className="aspect-square bg-archi-gray flex items-center justify-center mb-6 overflow-hidden relative">
                {file.file_type.includes('image') ? (
                  <img 
                    src={file.file_url} 
                    alt={file.file_name} 
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-110"
                  />
                ) : (
                  <div className="flex flex-col items-center gap-4 text-gray-300">
                    {file.file_type.includes('pdf') ? <FileText size={64} strokeWidth={1} /> : <File size={64} strokeWidth={1} />}
                    <span className="text-[10px] uppercase font-black tracking-[0.3em]">{file.file_type.split('/')[1] || 'FILE'}</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-archi-black/0 group-hover:bg-archi-black/5 transition-colors duration-500" />
                
                {/* Quick Actions Hover Overlay */}
                <div className="absolute inset-0 flex items-center justify-center gap-4 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-4 group-hover:translate-y-0">
                  <button 
                    onClick={() => downloadFile(file.file_url, file.file_name)}
                    className="p-4 bg-white text-archi-black hover:bg-archi-black hover:text-white transition-all shadow-xl"
                    title="Download"
                  >
                    <Download size={20} />
                  </button>
                  <button 
                    onClick={() => handleShare(file.id)}
                    className="p-4 bg-white text-archi-black hover:bg-archi-black hover:text-white transition-all shadow-xl"
                    title="Share Link"
                  >
                    <Share2 size={20} />
                  </button>
                  <button 
                    onClick={() => deleteFile(file.id)}
                    className="p-4 bg-white text-red-500 hover:bg-red-500 hover:text-white transition-all shadow-xl"
                    title="Delete"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-start">
                  <h4 className="text-[10px] font-black uppercase tracking-widest truncate max-w-[150px]">{file.file_name}</h4>
                  <a 
                    href={file.file_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-gray-300 hover:text-archi-black transition-colors"
                  >
                    <ExternalLink size={12} />
                  </a>
                </div>
                <div className="flex justify-between items-center text-[9px] uppercase tracking-widest font-bold text-gray-400">
                  <span>{format(new Date(file.created_at), 'MMM d, yyyy')}</span>
                  <span className="text-archi-black/40">{file.folder || 'General'}</span>
                </div>
                <div className="text-[9px] uppercase tracking-widest font-bold text-gray-300 truncate">
                  {file.projects?.title || 'GENERAL'}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-48 border border-dashed border-gray-200 text-center bg-gray-50/50">
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-300 mb-10 text-xl">No assets found in library</p>
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="text-[10px] font-bold uppercase tracking-widest px-12 py-5 bg-archi-black text-white hover:bg-archi-dark-gray transition-all"
          >
            Upload Your First Asset
          </button>
        </div>
      )}
    </div>
  );
};

export default Library;
