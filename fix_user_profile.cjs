const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function fixUser() {
  const userId = 'bdf02a10-dc38-43c1-92a6-7b02f7302f6e';
  const email = 'felipesbp96@gmail.com';
  const name = 'Felipe'; // Fallback name

  console.log(`Fixing profile for user: ${email} (${userId})`);

  // 1. Create Profile
  const { data, error: insertError } = await supabase
    .from('profiles')
    .insert({
      id: userId,
      email: email,
      username: email.split('@')[0],
      name: name, // Mandatory field
      role: 'user', // Correct role based on types
      plan: 'elite', // Granting Elite directly since they paid
      is_premium: true,
      is_public: false
    })
    .select()
    .single();

  if (insertError) {
    console.error("Failed to create profile:", insertError);
  } else {
    console.log("✅ Profile created successfully with Elite plan:");
    console.table(data);
  }

  // 2. Create Order (Backfill)
  // Need to find the Elite Service first
  const { data: service } = await supabase
    .from('services')
    .select('id')
    .eq('title', 'Elite Membership')
    .single();

  if (service) {
      const { error: orderError } = await supabase
        .from('orders')
        .insert({
            buyer_id: userId,
            service_id: service.id,
            amount: 199.00, // Assuming USD price
            currency: 'USD',
            status: 'paid',
            metadata: { note: 'Backfilled via script' }
        });
        
      if (orderError) console.error("Failed to backfill order:", orderError);
      else console.log("✅ Order backfilled successfully.");
  }
}

fixUser();
