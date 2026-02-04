const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials in .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function listServices() {
  console.log("Fetching services from Supabase...");
  const { data: services, error } = await supabase
    .from('services')
    .select('id, title, stripe_price_id');

  if (error) {
    console.error("Error fetching services:", error);
    return;
  }

  console.log("\nCurrent Services Configuration:");
  console.table(services);

  const problematic = services.filter(s => s.stripe_price_id && s.stripe_price_id.startsWith('prod_'));
  
  if (problematic.length > 0) {
    console.log("\n⚠️  Found services with incorrect Product IDs (should be Price IDs):");
    problematic.forEach(s => {
      console.log(`- ${s.title} (ID: ${s.id}): ${s.stripe_price_id}`);
    });
  } else {
    console.log("\n✅ All services appear to have correct ID formats (or are empty).");
  }
}

listServices();
