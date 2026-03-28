const { supabase } = require('../services/supabase');

exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username,
        }
      }
    });

    if (error) throw error;
    
    // Create profile entry
    const { error: pError } = await supabase
      .from('profiles')
      .insert([
        { 
          id: data.user.id, 
          username, 
          full_name: username 
        }
      ]);

    if (pError) throw pError;
    
    res.status(201).json({ 
      session: data.session, 
      user: { 
        id: data.user.id, 
        username: data.user.user_metadata?.username || username, 
        email: data.user.email 
      } 
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) return res.status(401).json({ message: error.message });

    // Check if profile exists, create if not (for migration)
    const { data: profile } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', data.user.id)
      .single();

    if (!profile) {
      await supabase
        .from('profiles')
        .insert([{ 
          id: data.user.id, 
          username: data.user.user_metadata?.username || data.user.email.split('@')[0],
          full_name: data.user.user_metadata?.username || data.user.email.split('@')[0]
        }]);
    }

    res.json({ 
      session: data.session, 
      user: { 
        id: data.user.id, 
        username: data.user.user_metadata?.username, 
        email: data.user.email 
      } 
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getMe = async (req, res) => {
  try {
    // req.user is already populated by authMiddleware using supabase.auth.getUser()
    res.json(req.user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
