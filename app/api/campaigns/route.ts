import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

const BUCKET = "campaigns";

function getSupabase() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: { autoRefreshToken: false, persistSession: false }
  });
}

export async function GET() {
  try {
    const supabaseAdmin = getSupabase();

    const { data: files, error: listError } = await supabaseAdmin.storage.from(BUCKET).list("", { limit: 1000 });
    if (listError) return NextResponse.json({ error: listError.message }, { status: 500 });

    const campaigns: any[] = [];
    for (const f of files || []) {
      if (!f.name.endsWith(".json")) continue;
      const { data: blob } = await supabaseAdmin.storage.from(BUCKET).download(f.name);
      if (!blob) continue;
      try {
        campaigns.push(JSON.parse(await blob.text()));
      } catch {}
    }

    campaigns.sort((a, b) => String(b.created_at || "").localeCompare(String(a.created_at || "")));
    return NextResponse.json({ campaigns });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}

