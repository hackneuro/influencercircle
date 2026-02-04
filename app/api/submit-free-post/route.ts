import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { postUrl } = body;

    // Validate Authorization Header
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return NextResponse.json({ error: "Missing authorization header" }, { status: 401 });
    }
    const token = authHeader.replace("Bearer ", "");

    // Initialize Supabase Client for Auth
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    // Validate User Session
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return NextResponse.json({ error: "Invalid or expired token" }, { status: 401 });
    }

    // Initialize Supabase Admin for DB operations
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Get User Plan
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('plan')
      .eq('id', user.id)
      .single();
    
    if (profileError) {
      console.error("Error fetching user plan:", profileError);
    }

    const userPlan = profile?.plan || 'free';
    const isElite = userPlan.toLowerCase() === 'elite';

    // Check Daily Limit (Reset at midnight UTC-3 / Sao Paulo)
    const now = new Date();
    // Shift to UTC-3
    const offset = 3 * 60 * 60 * 1000;
    const spTime = new Date(now.getTime() - offset);
    // Reset to midnight
    spTime.setUTCHours(0, 0, 0, 0);
    // Shift back to UTC to get the comparison timestamp
    const today = new Date(spTime.getTime() + offset);
    
    const { count, error: countError } = await supabaseAdmin
      .from("free_post_submissions")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id)
      .gte("created_at", today.toISOString());

    if (countError) {
      console.error("Error checking limit:", countError);
      return NextResponse.json({ error: "Failed to check daily limit" }, { status: 500 });
    }

    if (count && count >= 1) {
      return NextResponse.json({ error: "Daily limit reached. You can only submit one post per day." }, { status: 429 });
    }

    // Insert Submission
    const { error: insertError } = await supabaseAdmin
      .from("free_post_submissions")
      .insert({
        user_id: user.id,
        post_url: postUrl
      });

    if (insertError) {
      console.error("Error inserting submission:", insertError);
      return NextResponse.json({ error: "Failed to save submission" }, { status: 500 });
    }

    // Send Email to Admin
    const adminEmail = process.env.ADMIN_EMAIL;
    const resendKey = process.env.RESEND_API_KEY;

    if (adminEmail && resendKey) {
      try {
        const resend = new Resend(resendKey);
        await resend.emails.send({
          from: process.env.RESEND_FROM_EMAIL || "no-reply@influencercircle.net",
          to: adminEmail,
          subject: `New ${isElite ? 'Elite' : 'Free'} Post Submission`,
          text: `User ${user.email} (${userPlan} plan) submitted a new post for engagement.\n\nPost URL: ${postUrl}\n\nTime: ${new Date().toLocaleString()}`
        });
      } catch (emailError) {
        console.error("Failed to send admin email:", emailError);
        // Don't fail the request if email fails, just log it.
      }
    }

    return NextResponse.json({ success: true });

  } catch (error: any) {
    console.error("Submit free post error:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    // Validate Authorization Header
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return NextResponse.json({ error: "Missing authorization header" }, { status: 401 });
    }
    const token = authHeader.replace("Bearer ", "");

    // Initialize Supabase Client for Auth
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    // Validate User Session
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return NextResponse.json({ error: "Invalid or expired token" }, { status: 401 });
    }

    // Initialize Supabase Admin for DB operations
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Check Daily Limit (Reset at midnight UTC-3 / Sao Paulo)
    const now = new Date();
    const offset = 3 * 60 * 60 * 1000;
    const spTime = new Date(now.getTime() - offset);
    spTime.setUTCHours(0, 0, 0, 0);
    const today = new Date(spTime.getTime() + offset);
    
    const { count, error: countError } = await supabaseAdmin
      .from("free_post_submissions")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id)
      .gte("created_at", today.toISOString());

    if (countError) {
      return NextResponse.json({ error: "Failed to check daily limit" }, { status: 500 });
    }

    const hasSubmitted = count && count >= 1;

    return NextResponse.json({ 
      canSubmit: !hasSubmitted,
      submittedToday: hasSubmitted
    });

  } catch (error: any) {
    console.error("Check free post limit error:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
