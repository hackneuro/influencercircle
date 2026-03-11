
import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

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

export async function POST(request: Request) {
  try {
    const { applicationId } = await request.json();

    if (!applicationId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    console.log(`Approving application ${applicationId}`);

    // Update Application Status to 'approved' (no user creation here)
    let dbError = null;
    try {
      const { error } = await supabaseAdmin
        .from('applications')
        .update({ status: 'approved' })
        .eq('id', applicationId);
      if (error) dbError = error;
    } catch (e) {
      dbError = e;
      console.warn('DB Update failed (server), trying storage...', e);
    }

    // 4.2 Update Storage JSON (Backup)
    const fileName = `${applicationId}.json`;
    const { data: blob, error: downloadError } = await supabaseAdmin
        .storage
        .from('applications')
        .download(fileName);

    let storageError = null;

    if (!downloadError && blob) {
        const text = await blob.text();
        try {
            const applicationData = JSON.parse(text);
            applicationData.status = 'approved';
            applicationData.updated_at = new Date().toISOString();

            const { error: uploadError } = await supabaseAdmin
                .storage
                .from('applications')
                .upload(fileName, JSON.stringify(applicationData), {
                    contentType: 'application/json',
                    upsert: true
                });
            
            if (uploadError) storageError = uploadError;

        } catch (parseError) {
            console.error('Error parsing JSON for update:', parseError);
            storageError = parseError;
        }
    } else {
         // It's okay if storage file doesn't exist if DB update worked, but ideally both should work
         console.warn(`Could not find file ${fileName} in storage to update.`);
    }

    if (storageError) {
      return NextResponse.json({ error: `Failed to update storage: ${(storageError as any).message || storageError}` }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Approve API Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
