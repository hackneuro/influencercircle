import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const BUCKET = "promo49br-links";

async function ensureBucket(supabaseAdmin: any) {
  const { data: buckets } = await supabaseAdmin.storage.listBuckets();
  if (!buckets?.some((b: { name: string }) => b.name === BUCKET)) {
    await supabaseAdmin.storage.createBucket(BUCKET, { public: false });
  }
}

export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) return NextResponse.json({ error: "Missing authorization header" }, { status: 401 });
    const token = authHeader.replace("Bearer ", "");

    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user) return NextResponse.json({ error: "Invalid or expired token" }, { status: 401 });

    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey, {
      auth: { autoRefreshToken: false, persistSession: false }
    });

    const { data: requesterProfile, error: requesterProfileError } = await supabaseAdmin
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .maybeSingle();

    if (requesterProfileError) return NextResponse.json({ error: requesterProfileError.message }, { status: 500 });
    if (requesterProfile?.role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

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
      productName: "Elite Plan Brazil first 1.000 (early market entry)",
      productId: "prod_U84sTzhxpzCSML",
      priceId: "price_1T9oirPcE1dEtoc2UzZk0Vjh",
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
        applicationData.promo49br_token = linkToken;
        applicationData.promo49br_created_at = new Date().toISOString();
        await supabaseAdmin.storage.from("applications").upload(`${applicationId}.json`, JSON.stringify(applicationData), {
          contentType: "application/json",
          upsert: true
        });
      }
    } catch {}

    return NextResponse.json({ success: true, token: linkToken, path: `/promo49/${linkToken}` });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Unknown error" }, { status: 500 });
  }
}

