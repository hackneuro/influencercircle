const Stripe = require('stripe');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

async function validatePrices() {
  if (!process.env.STRIPE_SECRET_KEY) {
    console.error("❌ STRIPE_SECRET_KEY is missing in .env.local");
    return;
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

  console.log("Fetching all prices from Stripe...");
  
  const allPrices = [];
  let hasMore = true;
  let startingAfter = undefined;

  while (hasMore) {
    const response = await stripe.prices.list({
      limit: 100,
      starting_after: startingAfter,
      active: true, // Only active prices
    });
    
    allPrices.push(...response.data);
    hasMore = response.has_more;
    if (hasMore) {
      startingAfter = response.data[response.data.length - 1].id;
    }
  }

  console.log(`Found ${allPrices.length} active prices in Stripe.`);

  // List of prices to validate (from clean_prices.ps1 and seed_products.sql)
  const pricesToValidate = {
    "Elite Argentina": process.env.NEXT_PUBLIC_STRIPE_ELITE_PRICE_ID_ARGENTINA,
    "Elite Australia": process.env.NEXT_PUBLIC_STRIPE_ELITE_PRICE_ID_AUSTRALIA,
    "Elite Brazil": process.env.NEXT_PUBLIC_STRIPE_ELITE_PRICE_ID_BRAZIL,
    "Elite Chile": process.env.NEXT_PUBLIC_STRIPE_ELITE_PRICE_ID_CHILE,
    "Elite Colombia": process.env.NEXT_PUBLIC_STRIPE_ELITE_PRICE_ID_COLOMBIA,
    "Elite Europe": process.env.NEXT_PUBLIC_STRIPE_ELITE_PRICE_ID_EUROPE,
    "Elite India": process.env.NEXT_PUBLIC_STRIPE_ELITE_PRICE_ID_INDIA,
    "Elite Mexico": process.env.NEXT_PUBLIC_STRIPE_ELITE_PRICE_ID_MEXICO,
    "Elite USA": process.env.NEXT_PUBLIC_STRIPE_ELITE_PRICE_ID_USA,
    "Elite PUC Angels": process.env.NEXT_PUBLIC_STRIPE_ELITE_PUC_ANGELS_PRICE_ID,
    "500 Engagement (Seed)": "price_1Sql9mPcE1dEtoc2Gu5sOD8M" 
  };

  // Add more from finding usages if needed
  
  console.log("\n--- Validation Results ---");
  let allValid = true;

  for (const [label, priceId] of Object.entries(pricesToValidate)) {
    if (!priceId) {
      console.log(`⚠️  ${label}: ID missing in environment variables.`);
      continue;
    }

    const cleanId = priceId.trim();
    if (cleanId !== priceId) {
        console.log(`⚠️  ${label}: Contains whitespace! '${JSON.stringify(priceId)}' -> Should be '${cleanId}'`);
    }

    const found = allPrices.find(p => p.id === cleanId);
    if (found) {
      console.log(`✅ ${label}: Valid (${cleanId}) - ${found.unit_amount / 100} ${found.currency.toUpperCase()}`);
    } else {
      console.error(`❌ ${label}: NOT FOUND in Stripe Active Prices! (${cleanId})`);
      allValid = false;
    }
  }
  
  // Also print all found prices for reference
  console.log("\n--- Available Prices (All) ---");
  allPrices.forEach(p => {
      console.log(`${p.id}: ${p.nickname || 'No nickname'} - ${p.unit_amount/100} ${p.currency.toUpperCase()}`);
  });

}

validatePrices().catch(console.error);
