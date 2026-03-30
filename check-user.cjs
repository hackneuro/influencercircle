const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkUser() {
    const { data: users, error } = await supabase.auth.admin.listUsers();
    if (error) return console.error(error);
    const u = users.users.find(u => u.email === 'elenice2905@gmail.com');
    console.log(u);
}
checkUser();
