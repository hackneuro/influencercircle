
import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { fileName, fileType } = await request.json();
    
    if (!fileName || !fileType) {
      return NextResponse.json({ error: 'Missing fileName or fileType' }, { status: 400 });
    }

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

    // Create a signed URL for uploading (valid for 60 seconds)
    // Note: createSignedUploadUrl is for overwriting or creating.
    // However, it's simpler to use createSignedUrl if the file exists, 
    // but for upload we use createSignedUploadUrl
    const { data, error } = await supabaseAdmin
      .storage
      .from('cvs')
      .createSignedUploadUrl(fileName);

    if (error) {
      console.error('Storage Signed URL Error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Also get the public URL for later reference
    const { data: publicUrlData } = supabaseAdmin
      .storage
      .from('cvs')
      .getPublicUrl(fileName);

    return NextResponse.json({ 
      signedUrl: data.signedUrl, 
      token: data.token,
      path: data.path,
      publicUrl: publicUrlData.publicUrl 
    });
  } catch (error: any) {
    console.error('Upload API Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
