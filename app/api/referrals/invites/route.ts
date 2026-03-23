import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import Stripe from "stripe";
import { getSupabaseAdmin, getUserFromBearer } from "../_shared";

const BUCKET_APPLICATIONS = "applications";
const BUCKET_CAMPAIGNS = "campaigns";

const stripeSecret = process.env.STRIPE_SECRET_KEY || "";
const stripe = stripeSecret ? new Stripe(stripeSecret, { apiVersion: "2025-02-24.acacia" as any }) : null;

function formatMoney(amount: number, currency: string) {
  const cur = String(currency || "").toLowerCase();
  const value = Number(amount || 0);
  if (!Number.isFinite(value)) return "";
  if (cur === "brl") return `R$${value.toFixed(2)}`;
  if (cur === "usd") return `$${value.toFixed(2)}`;
  return `${cur.toUpperCase()} ${value.toFixed(2)}`;
}

async function getSettlementDaysForSession(sessionId: string) {
  if (!stripe || !sessionId) return 60;
  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    const methods = Array.isArray((session as any).payment_method_types) ? (session as any).payment_method_types : [];
    if (methods.includes("pix")) return 15;
    return 60;
  } catch {
    return 60;
  }
}

export async function GET(req: Request) {
  try {
    const user = await getUserFromBearer(req);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const supabaseAdmin = getSupabaseAdmin();

    const { data: files, error: listError } = await supabaseAdmin.storage.from(BUCKET_APPLICATIONS).list("", { limit: 1000 });
    if (listError) return NextResponse.json({ error: listError.message }, { status: 500 });

    const invites: any[] = [];

    for (const file of files || []) {
      if (!file.name.endsWith(".json")) continue;
      const { data: blob } = await supabaseAdmin.storage.from(BUCKET_APPLICATIONS).download(file.name);
      if (!blob) continue;
      try {
        const json = JSON.parse(await blob.text());
        if (String(json?.referrer_user_id || "") !== user.id) continue;
        invites.push(json);
      } catch {}
    }

    const campaignIds = Array.from(new Set(invites.map((a) => String(a.campaign_id || "")).filter(Boolean)));
    const campaignsMap: Record<string, any> = {};
    if (campaignIds.length > 0) {
      const { data: campaignFiles } = await supabaseAdmin.storage.from(BUCKET_CAMPAIGNS).list("", { limit: 1000 });
      await Promise.all((campaignFiles || []).map(async (f: any) => {
        if (!f.name.endsWith(".json")) return;
        const id = String(f.name).replace(".json", "");
        if (!campaignIds.includes(id)) return;
        const { data } = await supabaseAdmin.storage.from(BUCKET_CAMPAIGNS).download(f.name);
        if (!data) return;
        try {
          campaignsMap[id] = JSON.parse(await data.text());
        } catch {}
      }));
    }

    const referralCampaignCodes = Array.from(new Set(invites.map((a) => String(a.referral_campaign_code || "")).filter(Boolean)));
    const referralCampaignsMap: Record<string, any> = {};
    if (referralCampaignCodes.length > 0) {
      const { data: rc } = await supabaseAdmin
        .from("referral_campaigns")
        .select("code,title,location")
        .in("code", referralCampaignCodes);
      for (const r of rc || []) {
        referralCampaignsMap[String((r as any).code)] = r;
      }
    }

    const userIds = Array.from(new Set(invites.map((a) => String(a.user_id || "")).filter(Boolean)));
    const profilesById: Record<string, any> = {};
    if (userIds.length > 0) {
      const { data: profiles } = await supabaseAdmin
        .from("profiles")
        .select("id,plan")
        .in("id", userIds);
      for (const p of profiles || []) profilesById[String((p as any).id)] = p;
    }

    const commissionsByBuyer: Record<string, any[]> = {};
    if (userIds.length > 0) {
      const { data: commissions } = await supabaseAdmin
        .from("commissions")
        .select("buyer_id,amount,currency,status,created_at,order_id")
        .eq("recipient_id", user.id)
        .in("buyer_id", userIds);
      for (const c of commissions || []) {
        const buyerId = String((c as any).buyer_id);
        commissionsByBuyer[buyerId] = commissionsByBuyer[buyerId] || [];
        commissionsByBuyer[buyerId].push(c);
      }
    }

    const orderIds = Array.from(new Set(
      Object.values(commissionsByBuyer).flatMap((arr) => arr.map((c: any) => String(c.order_id || ""))).filter(Boolean)
    ));
    const ordersById: Record<string, any> = {};
    if (orderIds.length > 0) {
      const { data: orders } = await supabaseAdmin
        .from("orders")
        .select("id,metadata")
        .in("id", orderIds);
      for (const o of orders || []) ordersById[String((o as any).id)] = o;
    }

    const settlementCache = new Map<string, number>();

    const rows = [];
    for (const a of invites) {
      const buyerId = String(a.user_id || "");
      const profile = buyerId ? profilesById[buyerId] : null;
      const comms = buyerId ? (commissionsByBuyer[buyerId] || []) : [];

      let netRevenue = 0;
      let netCurrency = "brl";
      for (const c of comms) {
        const amt = Number((c as any).amount || 0);
        if (Number.isFinite(amt)) netRevenue += amt;
        if ((c as any).currency) netCurrency = String((c as any).currency);
      }

      let withdrawDate: string | null = null;
      const pending = comms.filter((c: any) => String(c.status || "") === "pending");
      if (pending.length > 0) {
        let best: Date | null = null;
        for (const c of pending) {
          const createdAt = new Date(String(c.created_at));
          const orderId = String(c.order_id || "");
          const order = orderId ? ordersById[orderId] : null;
          const sessionId = order?.metadata?.stripe_session_id ? String(order.metadata.stripe_session_id) : "";
          let days = 60;
          if (sessionId) {
            if (!settlementCache.has(sessionId)) {
              settlementCache.set(sessionId, await getSettlementDaysForSession(sessionId));
            }
            days = settlementCache.get(sessionId) || 60;
          }
          const available = new Date(createdAt.getTime() + days * 24 * 60 * 60 * 1000);
          if (!best || available < best) best = available;
        }
        withdrawDate = best ? best.toISOString() : null;
      }

      const campaignId = String(a.campaign_id || "");
      const campaignFromStorage = campaignId ? campaignsMap[campaignId] : null;
      const referralCampaignCode = String(a.referral_campaign_code || "");
      const referralCampaign = referralCampaignCode ? referralCampaignsMap[referralCampaignCode] : null;

      const campaignTitle = campaignFromStorage?.opportunity_title || referralCampaign?.title || "";
      const campaignLocation = campaignFromStorage?.location || referralCampaign?.location || "";

      let financial = "Free Member";
      if (profile?.plan === "elite") {
        financial = "Elite Member";
      }

      rows.push({
        name: `${String(a.first_name || "")} ${String(a.last_name || "")}`.trim(),
        campaign: campaignTitle,
        role: String(a.role || ""),
        status: String(a.status || "pending"),
        financial,
        netRevenue: formatMoney(netRevenue, netCurrency),
        withdrawDate
      });
    }

    rows.sort((x: any, y: any) => String(y.withdrawDate || "").localeCompare(String(x.withdrawDate || "")));

    return NextResponse.json({ invites: rows });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}

