import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

type CheckoutSession = Stripe.Checkout.Session;

export async function handleStripeCheckoutCompleted(session: CheckoutSession) {
  const metadata = session.metadata || {};
  const userId = metadata.user_id as string | undefined;
  const serviceId = metadata.service_id as string | undefined;
  const postUrl = metadata.post_url as string | undefined;

  if (!userId || !serviceId) {
    throw new Error("Missing metadata user_id or service_id");
  }

  const amountTotal = session.amount_total;
  const currency = session.currency;

  if (!amountTotal || !currency) {
    throw new Error("Missing amount or currency from session");
  }

  const amount = amountTotal / 100;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error("Missing Supabase service role configuration");
  }

  const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey);

  const { data: service, error: serviceError } = await supabaseAdmin
    .from("services")
    .select("*")
    .eq("id", serviceId)
    .maybeSingle();

  if (serviceError || !service) {
    throw new Error("Service not found when creating order");
  }

  const { error: orderError } = await supabaseAdmin.from("orders").insert({
    buyer_id: userId,
    service_id: serviceId,
    amount,
    currency: currency.toUpperCase(),
    status: "paid",
    post_url: postUrl ?? null,
    metadata: {
      stripe_session_id: session.id
    }
  });

  if (orderError) {
    console.error("Supabase Order Insert Error:", orderError);
    throw new Error(orderError.message || "Failed to create order");
  }
  
  console.log(`Order created successfully: ${userId} -> ${serviceId}`);

  const adminEmail = process.env.ADMIN_EMAIL;
  const resendKey = process.env.RESEND_API_KEY;

  if (!adminEmail || !resendKey) {
    console.warn("Missing Email Configuration (ADMIN_EMAIL or RESEND_API_KEY). Skipping emails.");
    return;
  }

  const Resend = (await import("resend")).Resend;
  const resend = new Resend(resendKey);

  const subject = `New order: ${service.title}`;
  const text = `New order received.\n\nService: ${service.title}\nAmount: ${currency.toUpperCase()} ${amount.toFixed(
    2
  )}\nPost URL: ${postUrl ?? "not provided"}\nStripe Session ID: ${session.id}`;

  console.log("Sending Admin Email...");
  const { error: adminMailError } = await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL || "no-reply@influencercircle.net",
    to: adminEmail,
    subject,
    text
  });
  
  if (adminMailError) {
    console.error("Failed to send Admin Email:", adminMailError);
  } else {
    console.log("Admin Email sent.");
  }

  // Send confirmation email to the buyer
  if (session.customer_email) {
    console.log(`Sending Buyer Email to ${session.customer_email}...`);
    const { error: buyerMailError } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || "no-reply@influencercircle.net",
      to: session.customer_email,
      subject: `Order Confirmed: ${service.title}`,
      text: `Hello,\n\nThank you for your purchase!\n\nService: ${service.title}\nAmount: ${currency.toUpperCase()} ${amount.toFixed(2)}\n\nWe have received your order and will process your request shortly.\n\nBest regards,\nThe Influencer Circle Team`
    });
    
    if (buyerMailError) {
        console.error("Failed to send Buyer Email:", buyerMailError);
    } else {
        console.log("Buyer Email sent.");
    }
  }
}

export async function handleEliteSubscriptionCompleted(session: CheckoutSession) {
  const metadata = session.metadata || {};
  const userId = metadata.user_id as string | undefined;

  if (!userId) {
    throw new Error("Missing metadata user_id for elite subscription");
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error("Missing Supabase service role configuration");
  }

  const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey);

  // 1. Update Profile
  const { error } = await supabaseAdmin
    .from("profiles")
    .update({ plan: "elite", is_premium: true })
    .eq("id", userId);

  if (error) {
    throw new Error(error.message || "Failed to update elite subscription profile");
  }

  // 2. Create Order for the subscription
  // Find the Elite Membership service ID
  const { data: eliteService, error: serviceError } = await supabaseAdmin
    .from("services")
    .select("*")
    .eq("title", "Elite Membership")
    .maybeSingle();

  if (!serviceError && eliteService) {
      const amountTotal = session.amount_total || 0;
      const currency = session.currency || "usd";
      const amount = amountTotal / 100;

      const { error: orderError } = await supabaseAdmin.from("orders").insert({
        buyer_id: userId,
        service_id: eliteService.id,
        amount,
        currency: currency.toUpperCase(),
        status: "paid",
        post_url: null,
        metadata: {
          stripe_session_id: session.id,
          subscription_id: session.subscription
        }
      });

      if (orderError) {
        console.error("Failed to create subscription order:", orderError);
        // Don't throw, as profile update was successful
      } else {
         console.log("Subscription order created.");
      }
      
      // 3. Send Emails
      const adminEmail = process.env.ADMIN_EMAIL;
      const resendKey = process.env.RESEND_API_KEY;

      if (adminEmail && resendKey) {
        const Resend = (await import("resend")).Resend;
        const resend = new Resend(resendKey);
        
        // Admin Email
        const subject = `New Elite Subscription: ${userId}`;
        const text = `New Elite Subscription started.\n\nUser ID: ${userId}\nAmount: ${currency.toUpperCase()} ${amount.toFixed(2)}\nStripe Session ID: ${session.id}`;

        console.log("Sending Admin Email (Subscription)...");
        await resend.emails.send({
            from: process.env.RESEND_FROM_EMAIL || "no-reply@influencercircle.net",
            to: adminEmail,
            subject,
            text
        });

        // Buyer Email
        if (session.customer_email) {
            console.log(`Sending Buyer Email to ${session.customer_email}...`);
            await resend.emails.send({
              from: process.env.RESEND_FROM_EMAIL || "no-reply@influencercircle.net",
              to: session.customer_email,
              subject: `Welcome to Elite Plan!`,
              text: `Hello,\n\nThank you for subscribing to the Elite Plan!\n\nYour account has been upgraded.\nAmount: ${currency.toUpperCase()} ${amount.toFixed(2)}\n\nEnjoy your exclusive benefits!\n\nBest regards,\nThe Influencer Circle Team`
            });
        }
      }

  } else {
      console.warn("Elite Membership service not found. Skipping Order creation.");
  }
}
