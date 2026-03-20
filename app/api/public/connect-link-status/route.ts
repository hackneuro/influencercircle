import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const BUCKET = "connect-links";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const token = String(searchParams.get("token") || "");
    if (!token) return NextResponse.json({ error: "Missing token" }, { status: 400 });

    const supabaseAdmin = createClient(
      supabaseUrl,
      supabaseServiceRoleKey,
      { auth: { autoRefreshToken: false, persistSession: false } }
    );

    const { data: blob, error } = await supabaseAdmin.storage.from(BUCKET).download(`${token}.json`);
    if (error || !blob) return NextResponse.json({ revoked: true }, { status: 200 });

    let json: any = {};
    try {
      json = JSON.parse(await blob.text());
    } catch {}

    const revoked = !!String(json?.revoked_at || "");
    const proceed_url = json?.proceed_url ? String(json.proceed_url) : "";
    return NextResponse.json({ revoked, proceed_url });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}

