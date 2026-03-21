import { NextResponse } from "next/server";
import { getSupabaseAdmin, getUserFromBearer } from "../_shared";

export async function GET(req: Request) {
  try {
    const user = await getUserFromBearer(req);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const supabaseAdmin = getSupabaseAdmin();

    const { data: commissions, error: commissionsError } = await supabaseAdmin
      .from("commissions")
      .select("level,amount,status")
      .eq("recipient_id", user.id);

    if (commissionsError) return NextResponse.json({ error: commissionsError.message }, { status: 500 });

    const totals = { level1: 0, level2: 0, level3: 0 };
    for (const c of commissions || []) {
      const amt = Number(c.amount || 0);
      if (!Number.isFinite(amt)) continue;
      if (c.level === 1) totals.level1 += amt;
      if (c.level === 2) totals.level2 += amt;
      if (c.level === 3) totals.level3 += amt;
    }

    const { data: layer1, error: layer1Error } = await supabaseAdmin
      .from("profiles")
      .select("id,name,username,created_at")
      .eq("referred_by_id", user.id)
      .order("created_at", { ascending: false });

    if (layer1Error) return NextResponse.json({ error: layer1Error.message }, { status: 500 });

    const layer1Ids = (layer1 || []).map((p: any) => p.id).filter(Boolean);
    let layer2Count = 0;
    let layer3Count = 0;

    if (layer1Ids.length > 0) {
      const { data: layer2, error: layer2Error } = await supabaseAdmin
        .from("profiles")
        .select("id")
        .in("referred_by_id", layer1Ids);

      if (layer2Error) return NextResponse.json({ error: layer2Error.message }, { status: 500 });
      const layer2Ids = (layer2 || []).map((p: any) => p.id).filter(Boolean);
      layer2Count = layer2Ids.length;

      if (layer2Ids.length > 0) {
        const { data: layer3, error: layer3Error } = await supabaseAdmin
          .from("profiles")
          .select("id")
          .in("referred_by_id", layer2Ids);

        if (layer3Error) return NextResponse.json({ error: layer3Error.message }, { status: 500 });
        layer3Count = (layer3 || []).length;
      }
    }

    return NextResponse.json({
      totals,
      layer1: layer1 || [],
      layer2Count,
      layer3Count
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}

