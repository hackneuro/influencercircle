
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

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

const targetEmails = [
  'fernando@hackneuro.com',
  'elaine_bpc@hotmail.com', // Correcting user typo 'elaine_bcp'
  'fernando@pucangels.org'
];

async function deleteUsers() {
  console.log(`Starting deletion for users: ${targetEmails.join(', ')}`);

  // 1. List all users
  const { data: { users }, error } = await supabase.auth.admin.listUsers();
  
  if (error) {
    console.error('Error listing users:', error);
    return;
  }

  // Debug: log all emails found
  console.log('Current users in DB:', users.map(u => u.email));

  for (const email of targetEmails) {
    const user = users.find(u => u.email?.toLowerCase() === email.toLowerCase());

    if (!user) {
      console.log(`User ${email} not found in Auth.`);
      
      // Check for orphan profiles
      const { data: profiles } = await supabase
          .from('profiles')
          .select('*')
          .eq('email', email);
          
      if (profiles && profiles.length > 0) {
          console.log(`Found orphan profile(s) for ${email}. Deleting...`);
          const { error: delError } = await supabase
              .from('profiles')
              .delete()
              .eq('email', email);
              
          if (delError) console.error('Error deleting orphan profile:', delError);
          else console.log('Orphan profile deleted.');
      }
      continue;
    }

    console.log(`Found user ${email} (ID: ${user.id}). Deleting...`);

    // 2. Delete the user
    const { error: deleteError } = await supabase.auth.admin.deleteUser(user.id);

    if (deleteError) {
      console.error(`Failed to delete user ${email}:`, deleteError.message);
    } else {
      console.log(`Successfully deleted user ${email} from Auth.`);
      
      // 3. Ensure profile is cleaned up
      const { error: profileError } = await supabase
          .from('profiles')
          .delete()
          .eq('id', user.id);
          
      if (profileError) {
          console.log('Note on profile deletion:', profileError.message);
      } else {
          console.log('Profile cleanup check completed.');
      }
    }
  }
}

deleteUsers();
