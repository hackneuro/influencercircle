import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

async function findAuthUserByEmail(email: string) {
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

export async function POST(request: Request) {
  try {
    const { applicationId, email, password, firstName, lastName, role } = await request.json();

    if (!applicationId || !email || !password || !firstName || !lastName) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    let authUser = await findAuthUserByEmail(String(email));
    if (!authUser) {
      const { data, error } = await supabaseAdmin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: {
          name: `${firstName} ${lastName}`,
          role,
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
          force_password_change: true,
        },
      });
      if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    }

    const userId = authUser.id;

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

    try {
      await supabaseAdmin.from("applications").update({ status: "approved" }).eq("id", applicationId);
    } catch {}

    const fileName = `${applicationId}.json`;
    const { data: blob } = await supabaseAdmin.storage.from("applications").download(fileName);
    if (blob) {
      try {
        const text = await blob.text();
        const applicationData = JSON.parse(text);
        applicationData.status = "approved";
        applicationData.user_logged = true;
        applicationData.user_id = userId;
        applicationData.updated_at = new Date().toISOString();
        await supabaseAdmin.storage.from("applications").upload(fileName, JSON.stringify(applicationData), {
          contentType: "application/json",
          upsert: true,
        });
      } catch {}
    }

    return NextResponse.json({ success: true, userId });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

