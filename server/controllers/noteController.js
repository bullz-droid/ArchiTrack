const { supabase, getSupabaseClient } = require('../services/supabase');

const formatNote = (n) => ({
  ...n,
  _id: n.id,
  createdAt: n.created_at,
  updatedAt: n.updated_at,
  sketchUrl: n.sketch_url
});

exports.createNote = async (req, res) => {
  try {
    const client = getSupabaseClient(req.token);
    const { title, content, sketchUrl } = req.body;
    const { data, error } = await client
      .from('notes')
      .insert([
        {
          user_id: req.user.id,
          title,
          content,
          sketch_url: sketchUrl
        }
      ])
      .select()
      .single();

    if (error) throw error;
    res.status(201).json(formatNote(data));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getNotes = async (req, res) => {
  try {
    const client = getSupabaseClient(req.token);
    const { data, error } = await client
      .from('notes')
      .select('*')
      .eq('user_id', req.user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    
    const formattedData = data.map(formatNote);
    
    res.json(formattedData);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteNote = async (req, res) => {
  try {
    const client = getSupabaseClient(req.token);
    const { error } = await client
      .from('notes')
      .delete()
      .eq('id', req.params.id)
      .eq('user_id', req.user.id);

    if (error) return res.status(404).json({ message: 'Note not found' });
    res.json({ message: 'Note deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
