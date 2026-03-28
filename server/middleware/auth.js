const { supabase } = require('../services/supabase');

const authMiddleware = async (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    const { data: { user }, error } = await supabase.auth.getUser(token);
    if (error || !user) {
      return res.status(401).json({ message: 'Token is not valid' });
    }

    // Ensure profile exists for this user
    const { data: profile } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', user.id)
      .single();

    if (!profile) {
      const username = user.user_metadata?.username || user.email.split('@')[0];
      await supabase
        .from('profiles')
        .insert([{ 
          id: user.id, 
          username,
          full_name: username 
        }]);
    }

    req.user = user;
    req.token = token;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

module.exports = authMiddleware;
