import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { handleEliteSubscriptionCompleted, handleStripeCheckoutCompleted } from "@/services/orderService";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-12-15.clover",
});

const secret = process.env.STRIPE_WEBHOOK_SECRET ? process.env.STRIPE_WEBHOOK_SECRET.trim() : "";

export async function POST(req: Request) {
  try {
    const body = await req.text();
    const signature = (await headers()).get("stripe-signature") as string;

    if (!secret) {
      console.error("Missing STRIPE_WEBHOOK_SECRET");
      return NextResponse.json({ error: "Configuration Error" }, { status: 500 });
    }

    // Log secret length for debug
    console.log(`Webhook Secret Length: ${secret.length}`);

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(body, signature, secret);
    } catch (error: any) {
      console.error("Webhook Signature Verification Failed:", error.message);
      return NextResponse.json({ error: `Webhook Error: ${error.message}` }, { status: 400 });
    }

    console.log(`Received Stripe Event: ${event.type} | ID: ${event.id}`);
    const session = event.data.object as Stripe.Checkout.Session;

    if (event.type === "checkout.session.completed") {
      console.log(`Processing Checkout Session: ${session.id} | Mode: ${session.mode}`);
      
      // Determine if it's a subscription or a one-time payment
      if (session.mode === "subscription") {
        await handleEliteSubscriptionCompleted(session);
      } else if (session.mode === "payment") {
        // Check if it has a service_id in metadata, implying it's a service purchase
        if (session.metadata?.service_id) {
          console.log(`Handling One-Time Payment for Service: ${session.metadata.service_id}`);
          await handleStripeCheckoutCompleted(session);
        } else {
          console.warn("Payment session missing service_id in metadata");
        }
      }
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error("Webhook handler fatal error:", error);
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 }
    );
  }
}
