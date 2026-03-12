import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const BUCKET = "profile-extras";

async function ensureBucket(supabaseAdmin: any) {
  const { data: buckets } = await supabaseAdmin.storage.listBuckets();
  if (!buckets?.some((b: { name: string }) => b.name === BUCKET)) {
    await supabaseAdmin.storage.createBucket(BUCKET, { public: false });
  }
}

function normalizeUrl(input: string) {
  const raw = String(input || "").trim();
  if (!raw) return "";
  if (raw.startsWith("http://") || raw.startsWith("https://")) return raw;
  return `https://${raw}`;
}

async function getUserFromRequest(req: Request) {
  const authHeader = req.headers.get("Authorization");
  if (!authHeader) return null;
  const token = authHeader.replace("Bearer ", "");
  const supabase = createClient(supabaseUrl, supabaseAnonKey);
  const { data: { user } } = await supabase.auth.getUser(token);
  return user ?? null;
}

export async function GET(req: Request) {
  try {
    const user = await getUserFromRequest(req);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey, {
      auth: { autoRefreshToken: false, persistSession: false }
    });

    await ensureBucket(supabaseAdmin);

    const { data: blob } = await supabaseAdmin.storage.from(BUCKET).download(`${user.id}.json`);
    if (!blob) return NextResponse.json({ tiktok_url: "", x_url: "", banner_url: "", gallery_urls: [], expertise: "" });

    const text = await blob.text();
    const payload = JSON.parse(text);
    return NextResponse.json({
      tiktok_url: String(payload?.tiktok_url || ""),
      x_url: String(payload?.x_url || ""),
      banner_url: String(payload?.banner_url || ""),
      gallery_urls: Array.isArray(payload?.gallery_urls) ? payload.gallery_urls.map((u: any) => String(u || "")).filter(Boolean).slice(0, 5) : [],
      expertise: String(payload?.expertise || "")
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await getUserFromRequest(req);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const tiktok_url = normalizeUrl(body?.tiktok_url || "");
    const x_url = normalizeUrl(body?.x_url || "");
    const banner_url = normalizeUrl(body?.banner_url || "");
    const gallery_urls = Array.isArray(body?.gallery_urls) ? body.gallery_urls.map((u: any) => normalizeUrl(String(u || ""))).filter(Boolean).slice(0, 5) : [];
    const expertise = String(body?.expertise || "").trim().slice(0, 300);

    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey, {
      auth: { autoRefreshToken: false, persistSession: false }
    });

    await ensureBucket(supabaseAdmin);

    const { data: existingBlob } = await supabaseAdmin.storage.from(BUCKET).download(`${user.id}.json`);
    let existing: any = {};
    if (existingBlob) {
      try {
        existing = JSON.parse(await existingBlob.text());
      } catch {}
    }

    const payload = {
      ...existing,
      tiktok_url,
      x_url,
      banner_url,
      gallery_urls,
      expertise,
      updated_at: new Date().toISOString()
    };

    const { error } = await supabaseAdmin.storage
      .from(BUCKET)
      .upload(`${user.id}.json`, JSON.stringify(payload), { contentType: "application/json", upsert: true });

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json({ success: true, tiktok_url, x_url, banner_url, gallery_urls, expertise });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
