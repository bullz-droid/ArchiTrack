const { getSupabaseClient } = require('../services/supabase');

exports.getFiles = async (req, res) => {
  try {
    const client = getSupabaseClient(req.token);
    const { projectId, fileType, dateSort, folder, search } = req.query;

    let query = client
      .from('files')
      .select('*, projects(title)')
      .eq('user_id', req.user.id);

    if (projectId) {
      query = query.eq('project_id', projectId);
    }

    if (folder) {
      query = query.eq('folder', folder);
    }

    if (search) {
      query = query.ilike('file_name', `%${search}%`);
    }

    if (fileType) {
      if (fileType === 'image') {
        query = query.ilike('file_type', 'image/%');
      } else if (fileType === 'pdf') {
        query = query.eq('file_type', 'application/pdf');
      }
    }

    if (dateSort === 'oldest') {
      query = query.order('created_at', { ascending: true });
    } else {
      query = query.order('created_at', { ascending: false });
    }

    const { data, error } = await query;

    if (error) throw error;
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.uploadFile = async (req, res) => {
  try {
    const client = getSupabaseClient(req.token);
    const { projectId, folder = 'General' } = req.body;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const fileName = `${Date.now()}-${file.originalname}`;
    const { data: storageData, error: storageError } = await client.storage
      .from('project-files')
      .upload(fileName, file.buffer, {
        contentType: file.mimetype,
        upsert: false
      });

    if (storageError) throw storageError;

    const { data: { publicUrl } } = client.storage
      .from('project-files')
      .getPublicUrl(fileName);

    const { data, error } = await client
      .from('files')
      .insert([
        {
          user_id: req.user.id,
          project_id: projectId || null,
          file_name: file.originalname,
          file_url: publicUrl,
          file_type: file.mimetype,
          folder
        }
      ])
      .select()
      .single();

    if (error) throw error;
    res.status(201).json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteFile = async (req, res) => {
  try {
    const client = getSupabaseClient(req.token);
    const { id } = req.params;

    // 1. Get file info to delete from storage
    const { data: file, error: fetchError } = await client
      .from('files')
      .select('*')
      .eq('id', id)
      .eq('user_id', req.user.id)
      .single();

    if (fetchError || !file) return res.status(404).json({ message: 'File not found' });

    // 2. Delete from storage
    const storagePath = file.file_url.split('/').pop();
    const { error: storageError } = await client.storage
      .from('project-files')
      .remove([storagePath]);

    if (storageError) console.error('Storage deletion error:', storageError);

    // 3. Delete from database
    const { error: dbError } = await client
      .from('files')
      .delete()
      .eq('id', id);

    if (dbError) throw dbError;

    res.json({ message: 'File deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createSignedUrl = async (req, res) => {
  try {
    const client = getSupabaseClient(req.token);
    const { id } = req.params;
    const { expiresIn = 3600 } = req.body; // Default 1 hour

    const { data: file, error: fetchError } = await client
      .from('files')
      .select('*')
      .eq('id', id)
      .eq('user_id', req.user.id)
      .single();

    if (fetchError || !file) return res.status(404).json({ message: 'File not found' });

    const storagePath = file.file_url.split('/').pop();
    const { data, error } = await client.storage
      .from('project-files')
      .createSignedUrl(storagePath, expiresIn);

    if (error) throw error;

    res.json({ signedUrl: data.signedUrl });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
