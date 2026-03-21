import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const BUCKET = "referral-campaigns";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const code = String(searchParams.get("code") || "").trim();
    if (!code) return NextResponse.json({ error: "Missing code" }, { status: 400 });

    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey, {
      auth: { autoRefreshToken: false, persistSession: false }
    });

    const { data: campaign, error: campaignError } = await supabaseAdmin
      .from("referral_campaigns")
      .select("owner_id,show_inviter_name,title,location")
      .eq("code", code)
      .maybeSingle();

    if (campaignError) {
      const msg = String(campaignError.message || "");
      if (msg.toLowerCase().includes("relation") && msg.toLowerCase().includes("referral_campaigns")) {
        const { data: blob } = await supabaseAdmin.storage.from(BUCKET).download(`by-code/${code}.json`);
        if (!blob) return NextResponse.json({ exists: false });
        const stored = JSON.parse(await blob.text());
        const ownerId = String(stored?.owner_id || "");
        const showName = !!stored?.show_inviter_name;
        let inviterName = "";
        if (showName && ownerId) {
          const { data: inviter } = await supabaseAdmin
            .from("profiles")
            .select("name,username")
            .eq("id", ownerId)
            .maybeSingle();
          inviterName = inviter?.name ? String(inviter.name) : "";
        }
        return NextResponse.json({
          exists: true,
          show_inviter_name: showName,
          inviter_name: inviterName,
          title: String(stored?.title || ""),
          location: stored?.location ? String(stored.location) : null
        });
      }
      return NextResponse.json({ error: campaignError.message }, { status: 500 });
    }
    if (!campaign) return NextResponse.json({ exists: false });

    let inviterName = "";
    if (campaign.show_inviter_name) {
      const { data: inviter } = await supabaseAdmin
        .from("profiles")
        .select("name,username")
        .eq("id", campaign.owner_id)
        .maybeSingle();
      inviterName = inviter?.name ? String(inviter.name) : "";
    }

    return NextResponse.json({
      exists: true,
      show_inviter_name: !!campaign.show_inviter_name,
      inviter_name: inviterName,
      title: campaign.title,
      location: campaign.location
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
