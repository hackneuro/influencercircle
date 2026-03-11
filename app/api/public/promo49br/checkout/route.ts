import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import Stripe from "stripe";

export const dynamic = "force-dynamic";
export const maxDuration = 300;

const BUCKET = "promo49br-links";

export async function POST(req: Request) {
  try {
    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json({ error: "Configuration Error: Missing Stripe Key" }, { status: 500 });
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2025-12-15.clover" as any,
    });

    const body = await req.json();
    const token = String(body?.token || "");
    if (!token) return NextResponse.json({ error: "Missing token" }, { status: 400 });

    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { autoRefreshToken: false, persistSession: false } }
    );

    const { data: blob } = await supabaseAdmin.storage.from(BUCKET).download(`${token}.json`);
    if (!blob) return NextResponse.json({ error: "Invalid link" }, { status: 404 });

    const payloadText = await blob.text();
    const payload = JSON.parse(payloadText);

    const email = String(payload.email || "");
    const name = String(payload.name || "");
    const phone = String(payload.phone || "");
    const priceId = String(payload.priceId || "");
    const productId = String(payload.productId || "");
    const applicationId = String(payload.applicationId || "");

    if (!email || !name || !phone || !priceId) {
      return NextResponse.json({ error: "Invalid link payload" }, { status: 400 });
    }

    const { data: profile } = await supabaseAdmin
      .from("profiles")
      .select("id,email")
      .eq("email", email)
      .maybeSingle();

    if (!profile?.id) {
      return NextResponse.json(
        { error: "User not active yet. Ask the admin to click 'User logged' first." },
        { status: 400 }
      );
    }

    const origin = new URL(req.url).origin;
    const successUrl = `${origin}/login?checkout=elite-success`;
    const cancelUrl = `${origin}/promo49/${token}`;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [{ price: priceId, quantity: 1 }],
      mode: "subscription",
      success_url: `${successUrl}&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancelUrl,
      customer_email: email,
      metadata: {
        user_id: profile.id,
        promo: "PROMO49BR",
        product_id: productId,
        application_id: applicationId,
        email,
        name,
        phone,
      },
      allow_promotion_codes: true,
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}

