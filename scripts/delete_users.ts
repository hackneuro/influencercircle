import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error('Missing environment variables. Make sure .env.local exists and contains NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

const emails = ['fernando@pucangels.org', 'fernandoscdias@gmail.com'];

async function deleteUsers() {
  console.log('Starting user deletion...');

  // Get all users first (pagination if needed, but for now fetch first 1000)
  const { data: { users }, error } = await supabase.auth.admin.listUsers({ page: 1, perPage: 1000 });
  
  if (error) {
    console.error('Error listing users:', error);
    return;
  }

  for (const email of emails) {
    const user = users.find(u => u.email?.toLowerCase() === email.toLowerCase());
    
    if (user) {
      console.log(`Found user ${email} (ID: ${user.id}). Deleting...`);
      const { error: deleteError } = await supabase.auth.admin.deleteUser(user.id);
      
      if (deleteError) {
        console.error(`Failed to delete user ${email}:`, deleteError.message);
      } else {
        console.log(`Successfully deleted user ${email}.`);
      }
    } else {
      console.log(`User ${email} not found.`);
    }
  }
}

deleteUsers();
