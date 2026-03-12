import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const BUCKET = "hire-requests";

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

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const target_username = String(body?.target_username || "").trim();
    const target_name = String(body?.target_name || "").trim();
    const target_profile_id = String(body?.target_profile_id || "").trim();
    const company_or_person = String(body?.company_or_person || "").trim();
    const email = String(body?.email || "").trim();
    const phone = String(body?.phone || "").trim();

    if (!target_username || !target_profile_id || !company_or_person || !email || !phone) {
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
    }

    const objective_type = String(body?.objective_type || "").trim();
    const pay_per_message = Number(body?.pay_per_message);
    const total_budget = Number(body?.total_budget);

    if (!Number.isFinite(pay_per_message) || !Number.isFinite(total_budget)) {
      return NextResponse.json({ error: "Invalid numeric fields." }, { status: 400 });
    }

    const payload = {
      id: crypto.randomUUID(),
      created_at: new Date().toISOString(),
      target_username,
      target_name,
      target_profile_id,
      company_or_person,
      email,
      phone,
      website: normalizeUrl(body?.website || ""),
      linkedin_page: normalizeUrl(body?.linkedin_page || ""),
      instagram_page: normalizeUrl(body?.instagram_page || ""),
      objective_type,
      pay_per_message,
      want_other_talent: !!body?.want_other_talent,
      total_budget
    };

    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey, {
      auth: { autoRefreshToken: false, persistSession: false }
    });

    await ensureBucket(supabaseAdmin);

    const fileName = `${payload.created_at}_${payload.id}.json`.replace(/[:.]/g, "-");
    const { error } = await supabaseAdmin.storage
      .from(BUCKET)
      .upload(fileName, JSON.stringify(payload), { contentType: "application/json", upsert: true });

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}

