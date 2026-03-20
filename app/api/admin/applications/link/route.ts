import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const BUCKET = "connect-links";

async function ensureBucket(supabaseAdmin: any) {
  const { data: buckets } = await supabaseAdmin.storage.listBuckets();
  if (!buckets?.some((b: { name: string }) => b.name === BUCKET)) {
    await supabaseAdmin.storage.createBucket(BUCKET, { public: false });
  }
}

function normalizeProceedUrl(input: string) {
  const raw = String(input || "").trim();
  if (!raw) return "";
  if (raw.startsWith("/")) return raw;
  try {
    const url = new URL(raw);
    const host = url.hostname.toLowerCase();
    if (url.protocol !== "https:") return "";
    if (!host.endsWith("influencercircle.net")) return "";
    return url.toString();
  } catch {
    return "";
  }
}

async function requireAdmin(req: Request) {
  const authHeader = req.headers.get("Authorization");
  if (!authHeader) return { error: "Missing authorization header", status: 401 as const };
  const token = authHeader.replace("Bearer ", "");

  const supabase = createClient(supabaseUrl, supabaseAnonKey);
  const { data: { user }, error: authError } = await supabase.auth.getUser(token);
  if (authError || !user) return { error: "Invalid or expired token", status: 401 as const };

  const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false }
  });

  const { data: requesterProfile, error: requesterProfileError } = await supabaseAdmin
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  if (requesterProfileError) return { error: requesterProfileError.message, status: 500 as const };
  if (requesterProfile?.role !== "admin") return { error: "Forbidden", status: 403 as const };

  return { supabaseAdmin };
}

export async function POST(req: Request) {
  try {
    const admin = await requireAdmin(req);
    if ("error" in admin) return NextResponse.json({ error: admin.error }, { status: admin.status });
    const { supabaseAdmin } = admin;

    const body = await req.json();
    const applicationId = String(body.applicationId || "");
    const email = String(body.email || "");
    const name = String(body.name || "");
    const phone = String(body.phone || "");

    if (!applicationId || !email || !name || !phone) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    await ensureBucket(supabaseAdmin);

    const linkToken = crypto.randomUUID();
    const payload = {
      applicationId,
      email,
      name,
      phone,
      channel: "linkedin",
      proceed_url: "",
      created_at: new Date().toISOString()
    };

    const { error: uploadError } = await supabaseAdmin.storage
      .from(BUCKET)
      .upload(`${linkToken}.json`, JSON.stringify(payload), {
        contentType: "application/json",
        upsert: true
      });

    if (uploadError) return NextResponse.json({ error: uploadError.message }, { status: 500 });

    try {
      const { data: blob } = await supabaseAdmin.storage.from("applications").download(`${applicationId}.json`);
      if (blob) {
        const text = await blob.text();
        const applicationData = JSON.parse(text);
        applicationData.connect_link_token = linkToken;
        applicationData.connect_link_created_at = new Date().toISOString();
        await supabaseAdmin.storage.from("applications").upload(`${applicationId}.json`, JSON.stringify(applicationData), {
          contentType: "application/json",
          upsert: true
        });
      }
    } catch {}

    return NextResponse.json({ success: true, token: linkToken, path: `/l/${linkToken}` });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Unknown error" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const admin = await requireAdmin(req);
    if ("error" in admin) return NextResponse.json({ error: admin.error }, { status: admin.status });
    const { supabaseAdmin } = admin;

    const body = await req.json();
    const token = String(body.token || "");
    const proceedUrl = normalizeProceedUrl(String(body.proceedUrl || body.proceed_url || ""));
    if (!token) return NextResponse.json({ error: "Missing token" }, { status: 400 });
    if (!proceedUrl) return NextResponse.json({ error: "Invalid proceed URL" }, { status: 400 });

    await ensureBucket(supabaseAdmin);

    const { data: blob, error: downloadError } = await supabaseAdmin.storage.from(BUCKET).download(`${token}.json`);
    if (downloadError || !blob) return NextResponse.json({ error: "Link token not found" }, { status: 404 });

    let payload: any = {};
    try {
      payload = JSON.parse(await blob.text());
    } catch {
      payload = {};
    }

    payload.proceed_url = proceedUrl;
    payload.proceed_url_updated_at = new Date().toISOString();

    const { error: uploadError } = await supabaseAdmin.storage
      .from(BUCKET)
      .upload(`${token}.json`, JSON.stringify(payload), { contentType: "application/json", upsert: true });

    if (uploadError) return NextResponse.json({ error: uploadError.message }, { status: 500 });

    try {
      const applicationId = String(payload.applicationId || "");
      if (applicationId) {
        const { data: appBlob } = await supabaseAdmin.storage.from("applications").download(`${applicationId}.json`);
        if (appBlob) {
          const text = await appBlob.text();
          const appData = JSON.parse(text);
          appData.connect_link_proceed_url = proceedUrl;
          appData.connect_link_proceed_url_updated_at = new Date().toISOString();
          await supabaseAdmin.storage.from("applications").upload(`${applicationId}.json`, JSON.stringify(appData), {
            contentType: "application/json",
            upsert: true
          });
        }
      }
    } catch {}

    return NextResponse.json({ success: true, proceed_url: proceedUrl });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Unknown error" }, { status: 500 });
  }
}
