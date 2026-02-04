const Stripe = require('stripe');
require('dotenv').config({ path: '.env.local' });

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const DOMAIN = "https://www.influencercircle.net";

async function createWebhook() {
  console.log(`Creating new Stripe Webhook for ${DOMAIN}...`);
  try {
    const webhook = await stripe.webhookEndpoints.create({
      url: `${DOMAIN}/api/webhooks`,
      enabled_events: [
        'checkout.session.completed',
        'checkout.session.async_payment_succeeded',
        'checkout.session.async_payment_failed',
        'checkout.session.expired'
      ],
    });

    console.log("\n✅ Webhook Created Successfully!");
    console.log(`ID: ${webhook.id}`);
    console.log(`URL: ${webhook.url}`);
    console.log(`Secret: ${webhook.secret}`);
    console.log("\n⚠️  IMPORTANT: Use the Secret above to update your Vercel Environment Variables!");

  } catch (error) {
    console.error("❌ Error creating webhook:", error.message);
  }
}

createWebhook();
