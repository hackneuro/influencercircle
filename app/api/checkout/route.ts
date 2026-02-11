import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import Stripe from "stripe";

// Initialize Stripe with the secret key from environment variables
export async function POST(req: Request) {
  if (!process.env.STRIPE_SECRET_KEY) {
    console.error("Missing STRIPE_SECRET_KEY");
    return NextResponse.json({ error: "Configuration Error: Missing Stripe Key" }, { status: 500 });
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2025-12-15.clover" as any,
  });

  try {
    const body = await req.json();
    const { mode, priceId, serviceId, postUrl, successUrl, cancelUrl, region } = body;

    // Validate Authorization Header
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return NextResponse.json({ error: "Missing authorization header" }, { status: 401 });
    }
    const token = authHeader.replace("Bearer ", "");

    // Initialize Supabase Client
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    // Validate User Session
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return NextResponse.json({ error: "Invalid or expired token" }, { status: 401 });
    }

    let finalPriceId = priceId;
    let finalMode = mode;

    // Handle "Likes" (One-time purchase via Service ID)
    if (serviceId) {
       // Fetch service from Supabase to get Stripe Price ID
       const { data: service, error: serviceError } = await supabase
         .from("services")
         .select("stripe_price_id, title")
         .eq("id", serviceId)
         .single();
         
       if (serviceError || !service || !service.stripe_price_id) {
          return NextResponse.json({ error: "Service not found or missing price configuration" }, { status: 400 });
       }
       
       finalPriceId = service.stripe_price_id;
       finalMode = "payment"; // Enforce payment mode for one-time services
    }

    if (!finalPriceId) {
      return NextResponse.json({ error: "Price ID is required" }, { status: 400 });
    }

    // Prepare metadata for the session
    const metadata: any = {
      user_id: user.id,
    };
    
    if (serviceId) {
      metadata.service_id = serviceId;
    }
    if (postUrl) {
      metadata.post_url = postUrl;
    }
    if (region) {
      metadata.region = region;
    }

    // Verify Stripe key
    if (!process.env.STRIPE_SECRET_KEY) {
        console.error("Missing STRIPE_SECRET_KEY");
        return NextResponse.json({ error: "Configuration Error: Missing Stripe Key" }, { status: 500 });
    }

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price: finalPriceId,
          quantity: 1,
        },
      ],
      mode: finalMode || "subscription", // Default to subscription if not specified
      success_url: `${successUrl}&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancelUrl,
      customer_email: user.email,
      metadata: metadata,
      allow_promotion_codes: true,
    });

    return NextResponse.json({ url: session.url });

  } catch (error: any) {
    console.error("Checkout error:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
