
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

export async function GET(request: Request) {
  try {
    let applicationsData: any[] = [];

    // 1. Try to fetch from DB
    try {
      const { data, error } = await supabaseAdmin
        .from('applications')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data) {
        applicationsData = data;
      }
    } catch (dbError) {
      console.warn('DB Fetch failed (server), trying storage...', dbError);
    }

    // 2. Also fetch from Storage (as backup or primary if DB failed)
    try {
      const { data: files, error: storageError } = await supabaseAdmin
        .storage
        .from('applications')
        .list();

      if (!storageError && files && files.length > 0) {
        // Fetch each file content
        const filePromises = files.map(async (file) => {
          if (!file.name.endsWith('.json')) return null;
          
          // Skip if we already have this ID from DB
          const id = file.name.replace('.json', '');
          if (applicationsData.some(app => app.id === id)) return null;

          const { data: blob } = await supabaseAdmin
            .storage
            .from('applications')
            .download(file.name);
          
          if (blob) {
            const text = await blob.text();
            try {
                return JSON.parse(text);
            } catch (e) {
                return null;
            }
          }
          return null;
        });

        const storageApps = (await Promise.all(filePromises)).filter(Boolean);
        applicationsData = [...applicationsData, ...storageApps];
      }
    } catch (storageErr) {
      console.error('Storage Fetch failed (server):', storageErr);
    }

    // Sort combined results
    applicationsData.sort((a, b) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );

    return NextResponse.json({ success: true, data: applicationsData });
  } catch (error: any) {
    console.error('Admin API Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
