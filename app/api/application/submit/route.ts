
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

    // Store new applications in Storage only.
      const applicationId = crypto.randomUUID();
      const applicationData = {
        id: applicationId,
        first_name: body.firstName,
        last_name: body.lastName,
        role: body.role,
        email: body.email,
        mobile: body.mobile,
        linkedin_url: body.linkedin,
        objective: body.objective,
        cv_url: body.cvUrl,
        campaign_id: body.campaignId || null,
        status: 'pending',
        created_at: new Date().toISOString()
      };

      const fileName = `${applicationId}.json`;
      const { error: storageError } = await supabaseAdmin
        .storage
        .from('applications')
        .upload(fileName, JSON.stringify(applicationData), {
          contentType: 'application/json',
          upsert: true
        });

      if (storageError) {
        console.error('Storage Backup Error:', storageError);
        throw new Error(`Submission failed: ${storageError.message}`);
      }

      return NextResponse.json({ success: true, id: applicationId });
  } catch (error: any) {
    console.error('Submission API Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
