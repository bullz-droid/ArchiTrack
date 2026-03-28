import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { Plus, Trash2 } from 'lucide-react';
import { format } from 'date-fns';

const Notes: React.FC = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newNote, setNewNote] = useState({ title: '', content: '' });

  const fetchNotes = async () => {
    try {
      const res = await api.get('/notes');
      setNotes(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/notes', { ...newNote, sketchUrl: null });
      setShowModal(false);
      setNewNote({ title: '', content: '' });
      fetchNotes();
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.message || 'Failed to save entry. Please try again.');
    }
  };

  const deleteNote = async (id: string) => {
    try {
      await api.delete(`/notes/${id}`);
      fetchNotes();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-16 pb-24">
      <header className="flex justify-between items-end border-b border-gray-100 pb-12">
        <div>
          <h1 className="text-6xl font-black tracking-tighter mb-4 text-archi-black uppercase">Design Log</h1>
          <p className="text-gray-400 text-lg font-light">Capture your architectural concept sketches and studio iterations.</p>
        </div>
        <button 
          onClick={() => setShowModal(true)} 
          className="text-[10px] font-bold uppercase tracking-widest px-8 py-4 bg-archi-black text-white hover:bg-archi-dark-gray transition-all flex items-center gap-3"
        >
          <Plus size={16} /> New Entry
        </button>
      </header>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[1, 2, 3].map(i => <div key={i} className="h-64 bg-archi-gray animate-pulse" />)}
        </div>
      ) : notes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {notes.map((note: any) => (
            <div key={note._id} className="group block bg-white border border-gray-100 p-8 transition-all hover:border-archi-black hover:shadow-xl relative">
              <div className="flex justify-between items-start mb-8">
                <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 px-3 py-1 border border-gray-100 group-hover:border-archi-black transition-colors">
                  {format(new Date(note.createdAt), 'MMM d, yyyy')}
                </span>
                <button 
                  onClick={() => deleteNote(note._id)}
                  className="opacity-0 group-hover:opacity-100 p-2 text-red-300 hover:text-red-500 hover:bg-red-50 transition-all"
                >
                  <Trash2 size={16} />
                </button>
              </div>
              <h3 className="text-2xl font-black tracking-tighter mb-4 leading-none">{note.title}</h3>
              <p className="text-gray-500 text-sm font-light leading-relaxed line-clamp-8 whitespace-pre-wrap">{note.content}</p>
              
              <div className="absolute bottom-0 left-0 w-full h-1 bg-archi-black scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500" />
            </div>
          ))}
        </div>
      ) : (
        <div className="py-48 border border-dashed border-gray-200 text-center bg-gray-50/50">
          <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-gray-300 mb-10 text-xl text-center">No design notes captured yet</p>
          <button onClick={() => setShowModal(true)} className="text-[10px] font-bold uppercase tracking-widest px-12 py-5 bg-archi-black text-white hover:bg-archi-dark-gray transition-all">Create First Entry</button>
        </div>
      )}

      {/* Create Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-archi-black/60 backdrop-blur-md flex items-center justify-center z-50 p-6">
          <div className="bg-white max-w-xl w-full p-16 relative shadow-2xl">
            <h2 className="text-4xl font-black tracking-tighter mb-10 uppercase">New Design Entry</h2>
            <form onSubmit={handleCreate} className="space-y-8">
              <div>
                <label className="block text-[10px] uppercase tracking-widest font-bold text-gray-400 mb-3">Note Title</label>
                <input
                  type="text"
                  required
                  className="w-full px-0 py-3 border-b-2 border-gray-100 focus:border-archi-black outline-none transition-colors text-xl font-bold tracking-tight"
                  placeholder="e.g., Site Analysis Sketch"
                  value={newNote.title}
                  onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-widest font-bold text-gray-400 mb-3">Content & Observations</label>
                <textarea
                  className="w-full px-4 py-4 bg-archi-gray/50 border-0 focus:ring-2 focus:ring-archi-black outline-none h-48 text-sm font-light leading-relaxed"
                  placeholder="Record your architectural thoughts..."
                  value={newNote.content}
                  onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
                />
              </div>
              <div className="flex gap-4 pt-6">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-4 text-[10px] font-bold uppercase tracking-widest border border-gray-200 hover:bg-gray-50 transition-colors">Discard</button>
                <button type="submit" className="flex-1 py-4 text-[10px] font-bold uppercase tracking-widest bg-archi-black text-white hover:bg-archi-dark-gray transition-all">Save Entry</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Notes;
