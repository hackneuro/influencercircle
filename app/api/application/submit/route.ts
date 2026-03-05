
import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Initialize Supabase with Service Role Key to bypass RLS
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    );

    // Insert into applications table
    const { data, error } = await supabaseAdmin
      .from('applications')
      .insert({
        first_name: body.firstName,
        last_name: body.lastName,
        role: body.role,
        email: body.email,
        mobile: body.mobile,
        linkedin_url: body.linkedin,
        objective: body.objective,
        cv_url: body.cvUrl,
        status: 'pending'
      })
      .select()
      .single();

    if (error) {
      console.error('Admin Insert Error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error('Submission API Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
