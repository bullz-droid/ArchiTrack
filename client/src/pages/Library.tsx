import React, { useEffect, useState, useRef } from 'react';
import api from '../services/api';
import { 
  File, 
  FileText, 
  Download, 
  Trash2, 
  Search, 
  Share2,
  Folder,
  Loader2,
  Image as ImageIcon,
  Grid,
  List,
  Upload
} from 'lucide-react';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

const Library: React.FC = () => {
  const [files, setFiles] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
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
            dateSort,
            search
          }
        }),
        api.get('/projects')
      ]);
      setFiles(filesRes.data);
      setProjects(projectsRes.data);
    } catch (err: any) {
      console.error(err);
      toast.error('Failed to sync studio assets');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchData();
    }, 300); // Debounce search
    return () => clearTimeout(timer);
  }, [selectedProject, selectedType, selectedFolder, dateSort, search]);

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
        toast.success(`Uploaded ${selectedFiles[i].name}`);
      } catch (err: any) {
        console.error('Upload failed:', err);
        toast.error(`Failed to upload ${selectedFiles[i].name}`);
      }
    }

    setUploading(false);
    setUploadProgress(0);
    fetchData();
  };

  const deleteFile = async (id: string) => {
    try {
      await api.delete(`/files/${id}`);
      toast.success('Asset removed');
      fetchData();
    } catch (err: any) {
      console.error(err);
      toast.error('Failed to remove asset');
    }
  };

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return <ImageIcon size={24} />;
    if (type === 'application/pdf') return <FileText size={24} />;
    return <File size={24} />;
  };

  return (
    <div className="space-y-12 pb-24">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <span className="h-px w-8 bg-primary-500"></span>
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary-500">Resource Library</span>
          </div>
          <h1 className="text-5xl font-black tracking-tighter text-[#111827] dark:text-white uppercase leading-none">
            Archi <span className="text-primary-600">Assets</span>
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-lg font-medium max-w-xl">
            Centralized storage for drawings, site photos, and architectural references.
          </p>
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
            className="bg-primary-600 hover:bg-primary-700 text-white font-bold py-4 px-8 rounded-2xl transition-all flex items-center gap-3 shadow-xl shadow-primary-600/20 active:scale-95 disabled:opacity-50"
          >
            {uploading ? <Loader2 className="animate-spin" size={20} /> : <Upload size={20} />}
            <span>{uploading ? `Uploading ${uploadProgress}%` : 'Upload Assets'}</span>
          </button>
        </div>
      </header>

      {/* Toolbar & Filters */}
      <div className="bg-white dark:bg-[#1E293B] p-6 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm space-y-6">
        <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
          <div className="relative flex-1 max-w-md w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search assets..." 
              className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-900/50 border-none rounded-xl text-sm focus:ring-2 focus:ring-primary-500/20 outline-none transition-all"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-900/50 p-1.5 rounded-xl">
            <button 
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white dark:bg-[#1E293B] shadow-sm text-primary-600' : 'text-gray-400 hover:text-gray-600'}`}
            >
              <Grid size={18} />
            </button>
            <button 
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-white dark:bg-[#1E293B] shadow-sm text-primary-600' : 'text-gray-400 hover:text-gray-600'}`}
            >
              <List size={18} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-gray-50 dark:border-gray-800">
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 ml-1">Studio Project</label>
            <select 
              className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900/50 border-none rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-primary-500/20 transition-all"
              value={selectedProject}
              onChange={(e) => setSelectedProject(e.target.value)}
            >
              <option value="">All Projects</option>
              {projects.map((p: any) => <option key={p._id} value={p._id}>{p.title}</option>)}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 ml-1">Asset Type</label>
            <select 
              className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900/50 border-none rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-primary-500/20 transition-all"
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
            >
              <option value="">All Formats</option>
              <option value="image">Images / Renders</option>
              <option value="pdf">PDF Documents</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 ml-1">Archive Sort</label>
            <select 
              className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900/50 border-none rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-primary-500/20 transition-all"
              value={dateSort}
              onChange={(e) => setDateSort(e.target.value)}
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 ml-1">Studio Folder</label>
            <select 
              className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900/50 border-none rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-primary-500/20 transition-all"
              value={selectedFolder}
              onChange={(e) => setSelectedFolder(e.target.value)}
            >
              <option value="">Root Library</option>
              <option value="Site">Site Research</option>
              <option value="Design">Design Iterations</option>
              <option value="Final">Final Submission</option>
            </select>
          </div>
        </div>
      </div>

      {loading ? (
        <div className={viewMode === 'grid' ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8" : "space-y-4"}>
          {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
            <div key={i} className="h-48 bg-gray-100 dark:bg-gray-800 rounded-3xl animate-pulse" />
          ))}
        </div>
      ) : files.length > 0 ? (
        <div className={viewMode === 'grid' ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8" : "space-y-4"}>
          {files.map((file: any) => (
            <div 
              key={file._id} 
              className={`group bg-white dark:bg-[#1E293B] border border-gray-100 dark:border-gray-800 rounded-3xl transition-all duration-500 hover:shadow-2xl hover:border-primary-500/50 overflow-hidden flex flex-col ${viewMode === 'list' ? 'md:flex-row md:items-center p-4 gap-6' : ''}`}
            >
              {viewMode === 'grid' && (
                <div className="aspect-video bg-gray-50 dark:bg-gray-900/50 flex items-center justify-center relative overflow-hidden">
                  {file.file_type.startsWith('image/') ? (
                    <img src={file.file_url} alt={file.file_name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  ) : (
                    <div className="text-gray-300 dark:text-gray-700">
                      {getFileIcon(file.file_type)}
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                    <a href={file.file_url} target="_blank" rel="noopener noreferrer" className="p-3 bg-white text-primary-600 rounded-xl hover:bg-primary-50 transition-colors shadow-lg">
                      <Download size={20} />
                    </a>
                    <button onClick={() => deleteFile(file._id)} className="p-3 bg-white text-red-500 rounded-xl hover:bg-red-50 transition-colors shadow-lg">
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              )}

              <div className={`p-6 space-y-4 ${viewMode === 'list' ? 'flex-1 p-0 space-y-1' : ''}`}>
                {viewMode === 'list' && (
                  <div className="flex items-center gap-6">
                    <div className="w-12 h-12 bg-gray-50 dark:bg-gray-900/50 rounded-xl flex items-center justify-center text-primary-600 dark:text-primary-400">
                      {getFileIcon(file.file_type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-[#111827] dark:text-white truncate uppercase tracking-tight">{file.file_name}</h4>
                      <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">{file.folder || 'Root'} • {format(new Date(file.created_at), 'MMM d, yyyy')}</p>
                    </div>
                    <div className="hidden lg:block text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                      {file.project?.title || 'No Project'}
                    </div>
                    <div className="flex items-center gap-2">
                      <a href={file.file_url} target="_blank" rel="noopener noreferrer" className="p-2.5 text-gray-400 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-xl transition-all">
                        <Download size={18} />
                      </a>
                      <button onClick={() => deleteFile(file._id)} className="p-2.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-xl transition-all">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                )}

                {viewMode === 'grid' && (
                  <>
                    <div className="flex justify-between items-start">
                      <div className="space-y-1 overflow-hidden">
                        <h4 className="font-bold text-[#111827] dark:text-white truncate uppercase tracking-tight group-hover:text-primary-600 transition-colors">{file.file_name}</h4>
                        <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold truncate">{file.project?.title || 'No Project'}</p>
                      </div>
                      <div className="px-2 py-1 bg-gray-50 dark:bg-gray-900/50 text-gray-400 text-[8px] font-bold uppercase tracking-widest rounded-lg border border-gray-100 dark:border-gray-800">
                        {file.folder || 'Root'}
                      </div>
                    </div>
                    <div className="pt-4 border-t border-gray-50 dark:border-gray-800 flex justify-between items-center text-[9px] font-bold text-gray-400 uppercase tracking-widest">
                      <span>{format(new Date(file.created_at), 'MMM d, yyyy')}</span>
                      <Share2 size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-32 text-center space-y-6 bg-white dark:bg-[#1E293B] rounded-3xl border border-dashed border-gray-200 dark:border-gray-800">
          <div className="w-20 h-20 bg-gray-50 dark:bg-gray-900/50 rounded-full flex items-center justify-center mx-auto text-gray-300">
            <Folder size={40} />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-[#111827] dark:text-white uppercase tracking-tighter">Library is Empty</h3>
            <p className="text-gray-400 text-sm">Upload your architectural assets to start building your studio archive.</p>
          </div>
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="text-primary-600 font-bold text-sm hover:underline"
          >
            Upload your first file
          </button>
        </div>
      )}
    </div>
  );
};

export default Library;
