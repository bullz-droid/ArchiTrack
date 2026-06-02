const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('CRITICAL: Missing SUPABASE_URL or SUPABASE_KEY in server environment.');
}

const supabase = createClient(supabaseUrl, supabaseKey);

const getSupabaseClient = (token) => {
  if (!token) return supabase;
  return createClient(supabaseUrl, supabaseKey, {
    global: {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  });
};

module.exports = { supabase, getSupabaseClient };
