
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Load env vars
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY in .env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
  console.log('Testing Supabase connection...');
  console.log(`URL: ${supabaseUrl}`);
  
  const startTime = Date.now();
  
  // Try to select from projects (even if empty, it verifies connection)
  const { data, error, status } = await supabase
    .from('projects')
    .select('count', { count: 'exact', head: true });

  const duration = Date.now() - startTime;

  if (error) {
    console.error('❌ Connection Failed!');
    console.error(`Status: ${status}`);
    console.error(`Error: ${error.message}`);
    
    if (error.code === 'PGRST301') {
      console.error('Hint: JWT expired or invalid permissions.');
    } else if (status === 0) {
      console.error('Hint: Network error or invalid URL.');
    } else if (error.code === '42P01') { // undefined_table
      console.error('Hint: The "projects" table does not exist. Did you run the SQL schema?');
    }
  } else {
    console.log(`✅ Connection Successful! (${duration}ms)`);
    console.log(`Status: ${status}`);
  }
}

testConnection();
