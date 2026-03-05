import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: Request) {
  try {
    const { email, code } = await request.json();

    if (!email || !code) {
      return NextResponse.json({ error: 'Email and code are required' }, { status: 400 });
    }

    // Check code in database
    const { data: verification, error: dbError } = await supabase
      .from('verification_codes')
      .select('*')
      .eq('email', email)
      .eq('code', code)
      .gt('expires_at', new Date().toISOString()) // Check expiry
      .single();

    if (dbError || !verification) {
      return NextResponse.json({ error: 'Invalid or expired code' }, { status: 400 });
    }

    // Code is valid - we can delete it or mark as used
    const { error: deleteError } = await supabase.from('verification_codes').delete().eq('id', verification.id);
    
    if (deleteError) {
       console.error("Error deleting verification code:", deleteError);
       // Continue anyway since code was valid
    }

    // Update profile verification status
    const { error: profileError } = await supabase
      .from('profiles')
      .update({ 
        email_verified: true,
        email_verified_at: new Date().toISOString()
      })
      .eq('email', email);

    if (profileError) {
      console.error('Error updating profile verification status:', profileError);
      return NextResponse.json({ 
        success: true, 
        warning: 'Email verified but profile update failed. Please contact support if this persists.' 
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
