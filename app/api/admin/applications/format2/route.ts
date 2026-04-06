import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const BUCKET = "connect-links";

function getSupabaseAdmin() {
  return createClient(
    supabaseUrl,
    supabaseServiceRoleKey,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
}

async function requireAdmin(req: Request) {
  const authHeader = req.headers.get("Authorization");
  if (!authHeader) return { error: "Missing authorization header", status: 401 as const };
  const token = authHeader.replace("Bearer ", "");

  const supabase = createClient(supabaseUrl, supabaseAnonKey);
  const { data: { user }, error: authError } = await supabase.auth.getUser(token);
  if (authError || !user) return { error: "Invalid or expired token", status: 401 as const };

  const supabaseAdmin = getSupabaseAdmin();

  const { data: requesterProfile, error: requesterProfileError } = await supabaseAdmin
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  if (requesterProfileError) {
    console.error("Error fetching admin profile:", requesterProfileError);
  }
  
  const isAdmin = requesterProfile?.role === "admin" || user.user_metadata?.role === "admin";
  
  if (!isAdmin) {
    return { 
      error: `Forbidden: You do not have admin privileges. (Role in profile: ${requesterProfile?.role}, Role in metadata: ${user.user_metadata?.role})`, 
      status: 403 as const 
    };
  }

  return { supabaseAdmin };
}

async function findAuthUserByEmail(email: string) {
  const supabaseAdmin = getSupabaseAdmin();
  const perPage = 200;
  let page = 1;
  const needle = email.toLowerCase();

  while (page < 200) {
    const { data, error } = await supabaseAdmin.auth.admin.listUsers({ page, perPage });
    if (error) throw error;
    const users = data?.users || [];
    const found = users.find((u) => (u.email || "").toLowerCase() === needle);
    if (found) return found;
    if (users.length < perPage) return null;
    page += 1;
  }

  return null;
}

async function ensureBucket(supabaseAdmin: any) {
  const { data: buckets } = await supabaseAdmin.storage.listBuckets();
  if (!buckets?.some((b: { name: string }) => b.name === BUCKET)) {
    await supabaseAdmin.storage.createBucket(BUCKET, { public: false });
  }
}

export async function POST(request: Request) {
  try {
    const admin = await requireAdmin(request);
    if ("error" in admin) return NextResponse.json({ error: admin.error }, { status: admin.status });
    const { supabaseAdmin } = admin;

    const body = await request.json();
    const { applicationId, email, password, firstName, lastName, role, proceedUrl } = body;

    if (!applicationId || !email || !password || !firstName || !lastName || !proceedUrl) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // 1. Create/Update Auth User
    let authUser = await findAuthUserByEmail(String(email));
    if (!authUser) {
      const { data, error } = await supabaseAdmin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: {
          name: `${firstName} ${lastName}`,
          role,
          onboarding_format: 'format2',
          force_password_change: true,
        },
      });
      if (error) return NextResponse.json({ error: error.message }, { status: 400 });
      authUser = data.user;
    } else {
      const { error } = await supabaseAdmin.auth.admin.updateUserById(authUser.id, {
        password,
        email_confirm: true,
        user_metadata: {
          ...(authUser.user_metadata || {}),
          name: `${firstName} ${lastName}`,
          role,
          onboarding_format: 'format2',
          force_password_change: true,
        },
      });
      if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    }

    const userId = authUser.id;

    // 2. Create/Update Profile
    let systemRole = "user";
    if (role && String(role).toLowerCase().includes("influencer")) systemRole = "influencer";

    const baseUsername = `${String(firstName).toLowerCase()}_${String(lastName).toLowerCase()}`.replace(/[^a-z0-9_]/g, "");
    const username = `${baseUsername}_${Math.floor(Math.random() * 10000)}`;

    const { error: profileError } = await supabaseAdmin
      .from("profiles")
      .upsert(
        {
          id: userId,
          email,
          name: `${firstName} ${lastName}`,
          username,
          role: systemRole,
          is_premium: false,
          is_public: true,
          plan: "member",
          updated_at: new Date().toISOString(),
        },
        { onConflict: "id" }
      );

    if (profileError) {
      return NextResponse.json({ error: profileError.message }, { status: 500 });
    }

    // 3. Generate Link Token
    await ensureBucket(supabaseAdmin);
    const linkToken = crypto.randomUUID();
    const payload = {
      applicationId,
      email,
      name: `${firstName} ${lastName}`,
      phone: "", // Will be filled from application data if needed
      channel: "linkedin",
      proceed_url: proceedUrl,
      onboarding_format: 'format2',
      revoked_at: "",
      created_at: new Date().toISOString()
    };

    // Try to get phone from application
    try {
        const { data: appData } = await supabaseAdmin.from("applications").select("mobile").eq("id", applicationId).maybeSingle();
        if (appData?.mobile) {
            payload.phone = String(appData.mobile).replace(/\D/g, "");
        }
    } catch {}

    const { error: uploadError } = await supabaseAdmin.storage
      .from(BUCKET)
      .upload(`${linkToken}.json`, JSON.stringify(payload), {
        contentType: "application/json",
        upsert: true
      });

    if (uploadError) return NextResponse.json({ error: uploadError.message }, { status: 500 });

    // 4. Update Application Status
    try {
      await supabaseAdmin.from("applications").update({ 
        status: "approved",
        user_logged: true,
        onboarding_format: 'format2',
        connect_link_token: linkToken
      }).eq("id", applicationId);
    } catch {}

    return NextResponse.json({ success: true, token: linkToken, path: `/l/${linkToken}`, userId });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
