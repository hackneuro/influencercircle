
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
    const { id, status } = await request.json();

    if (!id || !status) {
      return NextResponse.json({ error: 'Missing id or status' }, { status: 400 });
    }

    console.log(`Updating application ${id} to status ${status}`);

    // 1. Update DB
    let dbError = null;
    try {
      const { error } = await supabaseAdmin
        .from('applications')
        .update({ status })
        .eq('id', id);
      if (error) dbError = error;
    } catch (e) {
      dbError = e;
      console.warn('DB Update failed (server), trying storage...', e);
    }

    // 2. Update Storage JSON (Backup/Primary)
    // First we need to find the file or we can just try to download it
    const fileName = `${id}.json`;
    
    // We need to read the existing file to preserve other fields, then update status
    const { data: blob, error: downloadError } = await supabaseAdmin
        .storage
        .from('applications')
        .download(fileName);

    let storageError = null;

    if (!downloadError && blob) {
        const text = await blob.text();
        try {
            const applicationData = JSON.parse(text);
            applicationData.status = status;
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
        console.warn(`Could not find file ${fileName} in storage to update.`);
        storageError = downloadError || new Error('File not found');
    }

    if (dbError && storageError) {
         throw new Error(`Update failed: DB Error: ${dbError instanceof Error ? dbError.message : JSON.stringify(dbError)}, Storage Error: ${storageError instanceof Error ? storageError.message : JSON.stringify(storageError)}`);
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Admin Update API Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
