import { NextResponse } from "next/server";
import { getSupabaseAdmin, getUserFromBearer } from "../_shared";

function makeCode() {
  return crypto.randomUUID();
}

const BUCKET = "referral-campaigns";

async function ensureBucket(supabaseAdmin: any) {
  const { data: buckets } = await supabaseAdmin.storage.listBuckets();
  if (!buckets?.some((b: { name: string }) => b.name === BUCKET)) {
    await supabaseAdmin.storage.createBucket(BUCKET, { public: false });
  }
}

export async function GET(req: Request) {
  try {
    const user = await getUserFromBearer(req);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const supabaseAdmin = getSupabaseAdmin();

    const { data, error } = await supabaseAdmin
      .from("referral_campaigns")
      .select("id,code,title,location,show_inviter_name,created_at")
      .eq("owner_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      const msg = String(error.message || "");
      if (msg.toLowerCase().includes("relation") && msg.toLowerCase().includes("referral_campaigns")) {
        await ensureBucket(supabaseAdmin);
        const { data: files, error: listError } = await supabaseAdmin.storage.from(BUCKET).list(`by-owner/${user.id}`, {
          limit: 100,
          offset: 0,
          sortBy: { column: "name", order: "desc" }
        });
        if (listError) return NextResponse.json({ campaigns: [] });
        const campaigns: any[] = [];
        for (const f of files || []) {
          const { data: blob } = await supabaseAdmin.storage.from(BUCKET).download(`by-owner/${user.id}/${f.name}`);
          if (!blob) continue;
          try {
            campaigns.push(JSON.parse(await blob.text()));
          } catch {}
        }
        campaigns.sort((a, b) => String(b.created_at || "").localeCompare(String(a.created_at || "")));
        return NextResponse.json({ campaigns });
      }
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ campaigns: data || [] });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await getUserFromBearer(req);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const title = String(body?.title || "").trim();
    const location = String(body?.location || "").trim();
    const show_inviter_name = body?.show_inviter_name !== false;

    if (!title) return NextResponse.json({ error: "Missing title" }, { status: 400 });

    const supabaseAdmin = getSupabaseAdmin();
    const code = makeCode();

    const { data, error } = await supabaseAdmin
      .from("referral_campaigns")
      .insert({
        owner_id: user.id,
        code,
        title,
        location: location || null,
        show_inviter_name
      })
      .select("id,code,title,location,show_inviter_name,created_at")
      .single();

    if (error) {
      const msg = String(error.message || "");
      if (msg.toLowerCase().includes("relation") && msg.toLowerCase().includes("referral_campaigns")) {
        await ensureBucket(supabaseAdmin);
        const campaign = {
          id: crypto.randomUUID(),
          code,
          title,
          location: location || null,
          show_inviter_name,
          created_at: new Date().toISOString()
        };
        await supabaseAdmin.storage.from(BUCKET).upload(`by-owner/${user.id}/${code}.json`, JSON.stringify(campaign), {
          contentType: "application/json",
          upsert: true
        });
        await supabaseAdmin.storage.from(BUCKET).upload(`by-code/${code}.json`, JSON.stringify({ ...campaign, owner_id: user.id }), {
          contentType: "application/json",
          upsert: true
        });
        return NextResponse.json({ campaign });
      }
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ campaign: data });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
