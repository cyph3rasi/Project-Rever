const { createClient } = require('@supabase/supabase-js');

if (!process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY) {
  console.error('Missing Supabase environment variables:', {
    url: !!process.env.SUPABASE_URL,
    key: !!process.env.SUPABASE_ANON_KEY
  });
  throw new Error('Missing Supabase configuration');
}

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

// Test the connection
const testConnection = async () => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('count')
      .limit(1);
    
    if (error) throw error;
    console.log('Supabase connection successful:', { data });
  } catch (error) {
    console.error('Supabase connection error:', error);
  }
};

testConnection();

module.exports = supabase;