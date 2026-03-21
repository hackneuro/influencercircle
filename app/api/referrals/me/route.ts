import { NextResponse } from "next/server";
import { getSupabaseAdmin, getUserFromBearer } from "../_shared";

export async function GET(req: Request) {
  try {
    const user = await getUserFromBearer(req);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const supabaseAdmin = getSupabaseAdmin();

    const { data: profile, error } = await supabaseAdmin
      .from("profiles")
      .select("id,referral_code")
      .eq("id", user.id)
      .maybeSingle();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    let referral_code = profile?.referral_code ? String(profile.referral_code) : "";
    if (!referral_code) {
      const { data: updated, error: updateError } = await supabaseAdmin
        .from("profiles")
        .update({ referral_code: null })
        .eq("id", user.id)
        .select("referral_code")
        .maybeSingle();

      if (updateError) return NextResponse.json({ error: updateError.message }, { status: 500 });
      referral_code = updated?.referral_code ? String(updated.referral_code) : "";
    }

    return NextResponse.json({ referral_code });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}

