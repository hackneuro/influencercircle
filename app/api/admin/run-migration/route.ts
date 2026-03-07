
import { Pool } from 'pg';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  // Security check: require a secret token or admin session
  // For now, let's rely on the service role key or a simple secret
  // Ideally we check supabase auth, but since we are running migration we might be outside normal auth flow.
  // Let's check for a query param ?secret=...
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get('secret');
  
  // Use the service role key as the secret for simplicity, as only admins have it
  if (secret !== process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!process.env.DATABASE_URL) {
    return NextResponse.json({ error: 'DATABASE_URL not found in environment variables' }, { status: 500 });
  }

  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false } // Required for Supabase/Vercel
  });

  try {
    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');

      // SQL Migration content
      const sql = `
        -- Create Campaigns Table
        CREATE TABLE IF NOT EXISTS public.campaigns (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            opportunity_title TEXT NOT NULL,
            campaign_name TEXT NOT NULL,
            location TEXT NOT NULL,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
            created_by UUID REFERENCES auth.users(id)
        );

        -- Enable RLS on campaigns (idempotent)
        ALTER TABLE public.campaigns ENABLE ROW LEVEL SECURITY;

        -- Create Policies (Drop first to avoid errors if exist)
        DROP POLICY IF EXISTS "Public campaigns are viewable by everyone" ON public.campaigns;
        CREATE POLICY "Public campaigns are viewable by everyone" 
        ON public.campaigns FOR SELECT 
        USING (true);

        DROP POLICY IF EXISTS "Authenticated users can create campaigns" ON public.campaigns;
        CREATE POLICY "Authenticated users can create campaigns" 
        ON public.campaigns FOR INSERT 
        TO authenticated 
        WITH CHECK (true);

        DROP POLICY IF EXISTS "Authenticated users can update campaigns" ON public.campaigns;
        CREATE POLICY "Authenticated users can update campaigns" 
        ON public.campaigns FOR UPDATE 
        TO authenticated 
        USING (true);

        DROP POLICY IF EXISTS "Authenticated users can delete campaigns" ON public.campaigns;
        CREATE POLICY "Authenticated users can delete campaigns" 
        ON public.campaigns FOR DELETE 
        TO authenticated 
        USING (true);

        -- Add campaign_id to applications table
        ALTER TABLE public.applications 
        ADD COLUMN IF NOT EXISTS campaign_id UUID REFERENCES public.campaigns(id);
      `;

      await client.query(sql);
      await client.query('COMMIT');
      
      return NextResponse.json({ success: true, message: 'Migration executed successfully' });
    } catch (err: any) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  } catch (error: any) {
    console.error('Migration failed:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  } finally {
    await pool.end();
  }
}
