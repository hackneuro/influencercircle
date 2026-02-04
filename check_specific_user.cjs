const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkUser() {
  const email = 'felipesbp96@gmail.com';
  console.log(`Checking user: ${email}`);

  // Check auth.users (requires service role)
  const { data: { users }, error: authError } = await supabase.auth.admin.listUsers();
  
  if (authError) {
    console.error("Auth Error:", authError);
    return;
  }

  const user = users.find(u => u.email === email);

  if (!user) {
    console.log("❌ User NOT FOUND in auth.users");
    // List all users to see if there's a typo or different email
    console.log("Available users:", users.map(u => u.email));
    return;
  }

  console.log("✅ User FOUND in auth.users:");
  console.log(`- ID: ${user.id}`);
  console.log(`- Email: ${user.email}`);
  console.log(`- Created: ${user.created_at}`);

  // Check public.profiles
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .maybeSingle();

  if (profileError) {
    console.error("Profile Error:", profileError);
  } else if (!profile) {
    console.log("❌ Profile NOT FOUND in public.profiles (Trigger failure?)");
    
    // Attempt to fix missing profile
    console.log("Attempting to create missing profile...");
    const { error: insertError } = await supabase
      .from('profiles')
      .insert({
        id: user.id,
        email: user.email,
        username: user.email.split('@')[0],
        role: 'member',
        plan: 'member',
        is_public: false
      });
      
    if (insertError) console.error("Failed to create profile:", insertError);
    else console.log("✅ Profile created manually.");
    
  } else {
    console.log("✅ Profile FOUND in public.profiles:");
    console.table(profile);
  }
}

checkUser();
