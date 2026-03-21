import { NextResponse } from "next/server";
import { getSupabaseAdmin, getUserFromBearer } from "../_shared";

function makeCode() {
  return crypto.randomUUID();
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

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
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

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ campaign: data });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}

