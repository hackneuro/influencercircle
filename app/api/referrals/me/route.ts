import { NextResponse } from "next/server";
import { getSupabaseAdmin, getUserFromBearer } from "../_shared";

const BUCKET = "referrals";

async function ensureBucket(supabaseAdmin: any) {
  const { data: buckets } = await supabaseAdmin.storage.listBuckets();
  if (!buckets?.some((b: { name: string }) => b.name === BUCKET)) {
    await supabaseAdmin.storage.createBucket(BUCKET, { public: false });
  }
}

function makeStableCode(userId: string) {
  return String(userId || "").replace(/-/g, "").slice(0, 12);
}

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

    if (error) {
      const msg = String(error.message || "");
      if (msg.includes("column") && msg.includes("referral_code")) {
        await ensureBucket(supabaseAdmin);
        const userPath = `users/${user.id}.json`;
        const { data: blob } = await supabaseAdmin.storage.from(BUCKET).download(userPath);
        if (blob) {
          try {
            const json = JSON.parse(await blob.text());
            const existing = String(json?.referral_code || "").trim();
            if (existing) return NextResponse.json({ referral_code: existing });
          } catch {}
        }
        const referral_code = makeStableCode(user.id);
        await supabaseAdmin.storage.from(BUCKET).upload(userPath, JSON.stringify({ referral_code }), {
          contentType: "application/json",
          upsert: true
        });
        await supabaseAdmin.storage.from(BUCKET).upload(`codes/${referral_code}.json`, JSON.stringify({ owner_id: user.id }), {
          contentType: "application/json",
          upsert: true
        });
        return NextResponse.json({ referral_code });
      }
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    let referral_code = profile?.referral_code ? String(profile.referral_code) : "";
    if (!referral_code) {
      const nextCode = makeStableCode(user.id);
      const { data: updated, error: updateError } = await supabaseAdmin
        .from("profiles")
        .update({ referral_code: nextCode })
        .eq("id", user.id)
        .select("referral_code")
        .maybeSingle();

      if (updateError) return NextResponse.json({ error: updateError.message }, { status: 500 });
      referral_code = updated?.referral_code ? String(updated.referral_code) : "";
      if (!referral_code) referral_code = nextCode;
    }

    return NextResponse.json({ referral_code });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
