const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkServices() {
  console.log("Checking services...");
  const { data: services, error } = await supabase.from('services').select('*');
  
  if (error) {
    console.error("Error:", error);
    return;
  }
  
  console.table(services);
}

checkServices();
