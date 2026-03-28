const { supabase, getSupabaseClient } = require('../services/supabase');

const formatProject = (p) => ({
  ...p,
  _id: p.id,
  createdAt: p.created_at,
  updatedAt: p.updated_at,
  isPortfolioItem: p.is_portfolio_item,
  files: (p.project_files || []).map(f => ({
    ...f,
    _id: f.id,
    uploadedAt: f.created_at
  }))
});

exports.createProject = async (req, res) => {
  try {
    const client = getSupabaseClient(req.token);
    const { title, description, deadline, course } = req.body;
    const { data, error } = await client
      .from('projects')
      .insert([
        { 
          user_id: req.user.id, 
          title, 
          description, 
          deadline, 
          course 
        }
      ])
      .select()
      .single();

    if (error) throw error;
    res.status(201).json(formatProject(data));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getProjects = async (req, res) => {
  try {
    const client = getSupabaseClient(req.token);
    const { data, error } = await client
      .from('projects')
      .select('*, project_files(*)')
      .eq('user_id', req.user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    
    const formattedData = data.map(formatProject);
    
    res.json(formattedData);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getProjectById = async (req, res) => {
  try {
    const client = getSupabaseClient(req.token);
    const { data, error } = await client
      .from('projects')
      .select('*, project_files(*)')
      .eq('id', req.params.id)
      .eq('user_id', req.user.id)
      .single();

    if (error) return res.status(404).json({ message: 'Project not found' });
    
    res.json(formatProject(data));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getPublicPortfolio = async (req, res) => {
  try {
    const { username } = req.params;
    
    const { data: profile, error: pError } = await supabase
      .from('profiles')
      .select('id, username, full_name, avatar_url')
      .eq('username', username)
      .single();

    if (pError || !profile) return res.status(404).json({ message: 'User not found' });
    
    const { data, error } = await supabase
      .from('projects')
      .select('*, project_files(*)')
      .eq('user_id', profile.id)
      .eq('is_portfolio_item', true)
      .order('created_at', { ascending: false });

    if (error) throw error;
    
    const formattedData = data.map(formatProject);

    res.json({ user: profile, projects: formattedData });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateProject = async (req, res) => {
  try {
    const client = getSupabaseClient(req.token);
    const { title, description, deadline, course, isPortfolioItem } = req.body;
    const { data, error } = await client
      .from('projects')
      .update({ 
        title, 
        description, 
        deadline, 
        course, 
        is_portfolio_item: isPortfolioItem 
      })
      .eq('id', req.params.id)
      .eq('user_id', req.user.id)
      .select()
      .single();

    if (error) return res.status(404).json({ message: 'Project not found' });
    
    res.json(formatProject(data));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteProject = async (req, res) => {
  try {
    const client = getSupabaseClient(req.token);
    const { error } = await client
      .from('projects')
      .delete()
      .eq('id', req.params.id)
      .eq('user_id', req.user.id);

    if (error) return res.status(404).json({ message: 'Project not found' });
    res.json({ message: 'Project deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.uploadFiles = async (req, res) => {
  try {
    const client = getSupabaseClient(req.token);
    const { id: project_id } = req.params;

    const newFiles = await Promise.all(req.files.map(async (file) => {
      const fileName = `${Date.now()}-${file.originalname}`;
      const { data, error } = await client.storage
        .from('project-files')
        .upload(fileName, file.buffer, {
          contentType: file.mimetype,
          cacheControl: '3600',
          upsert: false
        });

      if (error) throw error;

      const { data: { publicUrl } } = client.storage
        .from('project-files')
        .getPublicUrl(fileName);

      return {
        project_id,
        name: file.originalname,
        path: publicUrl,
        type: file.mimetype.includes('image') ? 'image' : (file.mimetype.includes('pdf') ? 'pdf' : 'other')
      };
    }));

    const { data, error } = await client
      .from('project_files')
      .insert(newFiles)
      .select();

    if (error) throw error;

    const { data: project, error: pError } = await client
      .from('projects')
      .select('*, project_files(*)')
      .eq('id', project_id)
      .single();

    if (pError) throw pError;

    res.json(formatProject(project));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
