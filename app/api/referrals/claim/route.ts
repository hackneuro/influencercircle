import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getSupabaseAdmin, getUserFromBearer } from "../_shared";

export async function POST(req: Request) {
  try {
    const user = await getUserFromBearer(req);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json().catch(() => ({}));
    const cookieStore = await cookies();

    const referralCode =
      String(body?.referral_code || body?.referralCode || cookieStore.get("ic_ref_code")?.value || "").trim();
    const campaignCode =
      String(body?.campaign_code || body?.campaignCode || cookieStore.get("ic_ref_campaign")?.value || "").trim();

    if (!referralCode && !campaignCode) return NextResponse.json({ ok: true, claimed: false });

    const supabaseAdmin = getSupabaseAdmin();

    const { data: existing, error: existingError } = await supabaseAdmin
      .from("profiles")
      .select("id,referred_by_id")
      .eq("id", user.id)
      .maybeSingle();

    if (existingError) return NextResponse.json({ error: existingError.message }, { status: 500 });
    if (!existing) return NextResponse.json({ ok: true, claimed: false });
    if (existing.referred_by_id) return NextResponse.json({ ok: true, claimed: false });

    let referrerId = "";

    if (campaignCode) {
      const { data: campaign, error: campaignError } = await supabaseAdmin
        .from("referral_campaigns")
        .select("owner_id")
        .eq("code", campaignCode)
        .maybeSingle();

      if (campaignError) return NextResponse.json({ error: campaignError.message }, { status: 500 });
      referrerId = campaign?.owner_id ? String(campaign.owner_id) : "";
    } else if (referralCode) {
      const { data: referrer, error: referrerError } = await supabaseAdmin
        .from("profiles")
        .select("id")
        .eq("referral_code", referralCode)
        .maybeSingle();

      if (referrerError) return NextResponse.json({ error: referrerError.message }, { status: 500 });
      referrerId = referrer?.id ? String(referrer.id) : "";
    }

    if (!referrerId || referrerId === user.id) return NextResponse.json({ ok: true, claimed: false });

    const { error: updateError } = await supabaseAdmin
      .from("profiles")
      .update({ referred_by_id: referrerId })
      .eq("id", user.id)
      .is("referred_by_id", null);

    if (updateError) return NextResponse.json({ error: updateError.message }, { status: 500 });

    return NextResponse.json({ ok: true, claimed: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}

