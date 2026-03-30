const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function testLogin() {
    const { data, error } = await supabase.auth.signInWithPassword({
        email: 'elenice2905@gmail.com',
        password: 'Password123!'
    });
    if (error) {
        console.error("Login failed:", error.message);
    } else {
        console.log("Login successful! User ID:", data.user.id);
    }
}
testLogin();
