const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function createEliteService() {
  console.log("Checking if Elite Membership service exists...");
  
  const { data: existing, error: fetchError } = await supabase
    .from('services')
    .select('*')
    .eq('title', 'Elite Membership')
    .maybeSingle();

  if (fetchError) {
    console.error("Error fetching service:", fetchError);
    return;
  }

  if (existing) {
    console.log("Service already exists:", existing);
    return existing.id;
  }

  console.log("Creating Elite Membership service...");
  
  // Using a placeholder price/id since the actual price varies by region
  // This service entry is mainly for Order reference.
  const { data: newService, error: insertError } = await supabase
    .from('services')
    .insert({
      title: 'Elite Membership',
      description: 'Monthly subscription to Elite plan',
      category: 'Subscription',
      price: 199.00, // Base price (USD) placeholder
      currency: 'USD',
      stripe_price_id: 'price_1SruvMPcE1dEtoc2c59Go9IA', // USA Price ID as default
      is_active: true
    })
    .select()
    .single();

  if (insertError) {
    console.error("Error creating service:", insertError);
    return;
  }

  console.log("Service created successfully:", newService);
  return newService.id;
}

createEliteService();
