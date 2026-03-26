const { Client } = require('pg');
require('dotenv').config({ path: '.env.local' });

// Supabase Connection String format usually:
// postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres
// Since we don't have the DB password directly, let's try to extract it from the environment if available.
// If it's not available, I'll inform the user.
console.log("Supabase URL:", process.env.NEXT_PUBLIC_SUPABASE_URL);
