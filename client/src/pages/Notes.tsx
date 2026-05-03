import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { Plus, Trash2, PenTool, Search, Calendar, ChevronRight, X, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

const Notes: React.FC = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [newNote, setNewNote] = useState({ title: '', content: '' });

  const fetchNotes = async () => {
    try {
      const res = await api.get('/notes');
      setNotes(res.data);
    } catch (err: any) {
      console.error(err);
      toast.error('Failed to sync design logs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.post('/notes', { ...newNote, sketchUrl: null });
      setShowModal(false);
      setNewNote({ title: '', content: '' });
      toast.success('Log entry saved');
      fetchNotes();
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Failed to save entry');
    } finally {
      setSaving(false);
    }
  };

  const deleteNote = async (id: string) => {
    try {
      await api.delete(`/notes/${id}`);
      toast.success('Entry removed');
      fetchNotes();
    } catch (err: any) {
      console.error(err);
      toast.error('Failed to remove entry');
    }
  };

  return (
    <div className="space-y-12 pb-24">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <span className="h-px w-8 bg-primary-500"></span>
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary-500">Process Tracking</span>
          </div>
          <h1 className="text-5xl font-black tracking-tighter text-[#111827] dark:text-white uppercase leading-none">
            Studio <span className="text-primary-600">Logs</span>
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-lg font-medium max-w-xl">
            Document your architectural concept sketches and studio iterations.
          </p>
        </div>
        <button 
          onClick={() => setShowModal(true)} 
          className="bg-primary-600 hover:bg-primary-700 text-white font-bold py-4 px-8 rounded-2xl transition-all flex items-center gap-3 shadow-xl shadow-primary-600/20 active:scale-95 self-start md:self-auto"
        >
          <Plus size={20} />
          <span>New Entry</span>
        </button>
      </header>

      {/* Toolbar */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white dark:bg-[#1E293B] p-4 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
        <div className="relative flex-1 max-w-md w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input 
            type="text" 
            placeholder="Search logs..." 
            className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-900/50 border-none rounded-xl text-sm focus:ring-2 focus:ring-primary-500/20 outline-none transition-all"
          />
        </div>
        <div className="flex items-center gap-4 text-xs font-bold text-gray-400 uppercase tracking-widest">
          <span>{notes.length} Entries</span>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-64 bg-gray-100 dark:bg-gray-800 rounded-3xl animate-pulse" />
          ))}
        </div>
      ) : notes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {notes.map((note: any) => (
            <div key={note._id} className="group bg-white dark:bg-[#1E293B] border border-gray-100 dark:border-gray-800 p-8 rounded-3xl transition-all duration-500 hover:shadow-2xl hover:border-primary-500/50 relative overflow-hidden flex flex-col h-full">
              <div className="flex justify-between items-start mb-8">
                <div className="px-3 py-1 bg-gray-50 dark:bg-gray-900/50 text-gray-400 text-[9px] font-bold uppercase tracking-widest rounded-lg border border-gray-100 dark:border-gray-800 flex items-center gap-2">
                  <Calendar size={10} />
                  {format(new Date(note.createdAt), 'MMM d, yyyy')}
                </div>
                <button 
                  onClick={() => deleteNote(note._id)}
                  className="opacity-0 group-hover:opacity-100 p-2 text-red-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-xl transition-all"
                >
                  <Trash2 size={16} />
                </button>
              </div>
              
              <h3 className="text-2xl font-black tracking-tighter text-[#111827] dark:text-white uppercase mb-4 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                {note.title}
              </h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm font-medium leading-relaxed whitespace-pre-wrap line-clamp-6 mb-8">
                {note.content}
              </p>

              <div className="mt-auto pt-6 border-t border-gray-50 dark:border-gray-800 flex items-center justify-between text-primary-600 dark:text-primary-400">
                <span className="text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5">
                  View Detail <ChevronRight size={12} />
                </span>
                <PenTool size={18} className="opacity-20 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-32 text-center space-y-6 bg-white dark:bg-[#1E293B] rounded-3xl border border-dashed border-gray-200 dark:border-gray-800">
          <div className="w-20 h-20 bg-gray-50 dark:bg-gray-900/50 rounded-full flex items-center justify-center mx-auto text-gray-300">
            <PenTool size={40} />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-[#111827] dark:text-white uppercase tracking-tighter">Empty Studio Log</h3>
            <p className="text-gray-400 text-sm">Start documenting your design process and architectural iterations.</p>
          </div>
          <button 
            onClick={() => setShowModal(true)}
            className="text-primary-600 font-bold text-sm hover:underline"
          >
            Create first entry
          </button>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="bg-white dark:bg-[#1E293B] w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-8 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
              <h2 className="text-2xl font-black tracking-tighter uppercase text-[#111827] dark:text-white">New Log Entry</h2>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl transition-colors">
                <X size={24} className="text-gray-400" />
              </button>
            </div>
            <form onSubmit={handleCreate} className="p-8 space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Entry Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Concept Iteration 01"
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900/50 border-none rounded-xl focus:ring-2 focus:ring-primary-500/20 outline-none transition-all"
                  value={newNote.title}
                  onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Log Content</label>
                <textarea
                  rows={8}
                  required
                  placeholder="Document your design decisions, critiques, and next steps..."
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900/50 border-none rounded-xl focus:ring-2 focus:ring-primary-500/20 outline-none transition-all resize-none"
                  value={newNote.content}
                  onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
                />
              </div>
              <button
                type="submit"
                disabled={saving}
                className="w-full py-4 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-primary-600/20 active:scale-95 flex items-center justify-center gap-3 disabled:opacity-50"
              >
                {saving ? <Loader2 className="animate-spin" size={20} /> : <PenTool size={20} />}
                <span>{saving ? 'Saving to Archives...' : 'Commit to Log'}</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Notes;
