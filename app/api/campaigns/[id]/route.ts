
import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

// Use service role to bypass RLS for public read if needed, 
// though we set public read policy, so anon key should work too.
// Using service role for consistency in APIs if anon key environment variable is not passed to this file context easily (it is, but safe side).
// Actually, let's use the standard client creation if possible, but for simplicity in API routes I often use direct creation.

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = params.id;

  if (!id) {
    return NextResponse.json({ error: "Missing ID" }, { status: 400 });
  }

  try {
    const { data, error } = await supabase
      .from("campaigns")
      .select("opportunity_title, location, campaign_name")
      .eq("id", id)
      .single();

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching campaign:", error);
    return NextResponse.json({ error: "Campaign not found" }, { status: 404 });
  }
}
