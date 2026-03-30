const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function fix() {
    const { data, error } = await supabase.auth.admin.updateUserById(
        '907ea5f6-c552-4965-b2f4-bff314cfedd1',
        { password: 'Password123!', email_confirm: true }
    );
    console.log(error || "Success updating password");
    
    const { data: user } = await supabase.auth.admin.getUserById('907ea5f6-c552-4965-b2f4-bff314cfedd1');
    console.log("Identities:", user.user.identities);
}
fix();
