import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

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
    const cvUrl = body.cvUrl ? String(body.cvUrl) : "";
    const deleteAuthUser = !!body.deleteAuthUser;

    if (!applicationId) return NextResponse.json({ error: "Missing applicationId" }, { status: 400 });

    const { error: deleteDbError } = await supabaseAdmin
      .from("applications")
      .delete()
      .eq("id", applicationId);

    if (deleteDbError) {
      try {
        await supabaseAdmin.storage.from("applications").remove([`${applicationId}.json`]);
      } catch {}
      return NextResponse.json({ error: deleteDbError.message }, { status: 500 });
    }

    try {
      await supabaseAdmin.storage.from("applications").remove([`${applicationId}.json`]);
    } catch {}

    if (cvUrl.includes("/storage/v1/object/public/cvs/")) {
      const idx = cvUrl.indexOf("/storage/v1/object/public/cvs/");
      const fileName = cvUrl.substring(idx + "/storage/v1/object/public/cvs/".length).split("?")[0];
      if (fileName) {
        try {
          await supabaseAdmin.storage.from("cvs").remove([fileName]);
        } catch {}
      }
    }

    if (deleteAuthUser && email) {
      const { data: userProfile } = await supabaseAdmin
        .from("profiles")
        .select("id")
        .eq("email", email)
        .maybeSingle();

      const targetUserId = userProfile?.id;
      if (targetUserId) {
        await supabaseAdmin.auth.admin.deleteUser(targetUserId);
        await supabaseAdmin.from("profiles").delete().eq("id", targetUserId);
      }
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Unknown error" }, { status: 500 });
  }
}

