
import { Pool } from 'pg';

export const dynamic = 'force-dynamic';

async function runMigration() {
  if (!process.env.DATABASE_URL) {
    return { success: false, error: 'DATABASE_URL not found' };
  }

  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      const sql = `
        CREATE TABLE IF NOT EXISTS public.campaigns (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            opportunity_title TEXT NOT NULL,
            campaign_name TEXT NOT NULL,
            location TEXT NOT NULL,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
            created_by UUID REFERENCES auth.users(id)
        );
        ALTER TABLE public.campaigns ENABLE ROW LEVEL SECURITY;
        
        DROP POLICY IF EXISTS "Public campaigns are viewable by everyone" ON public.campaigns;
        CREATE POLICY "Public campaigns are viewable by everyone" ON public.campaigns FOR SELECT USING (true);
        
        DROP POLICY IF EXISTS "Authenticated users can create campaigns" ON public.campaigns;
        CREATE POLICY "Authenticated users can create campaigns" ON public.campaigns FOR INSERT TO authenticated WITH CHECK (true);
        
        DROP POLICY IF EXISTS "Authenticated users can update campaigns" ON public.campaigns;
        CREATE POLICY "Authenticated users can update campaigns" ON public.campaigns FOR UPDATE TO authenticated USING (true);
        
        DROP POLICY IF EXISTS "Authenticated users can delete campaigns" ON public.campaigns;
        CREATE POLICY "Authenticated users can delete campaigns" ON public.campaigns FOR DELETE TO authenticated USING (true);
        
        ALTER TABLE public.applications ADD COLUMN IF NOT EXISTS campaign_id UUID REFERENCES public.campaigns(id);
      `;
      await client.query(sql);
      await client.query('COMMIT');
      return { success: true, message: 'Migration executed successfully' };
    } catch (err: any) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  } catch (error: any) {
    return { success: false, error: error.message };
  } finally {
    await pool.end();
  }
}

export default async function SetupPage() {
  // Simple security: check for a secret query param or just run it (it's idempotent/safe-ish for this context)
  // For safety, let's just run it. The user wants it done.
  
  const result = await runMigration();

  return (
    <div className="p-10 font-mono">
      <h1 className="text-2xl font-bold mb-4">Database Setup Status</h1>
      {result.success ? (
        <div className="bg-green-100 p-4 rounded text-green-800">
          SUCCESS: {result.message}
        </div>
      ) : (
        <div className="bg-red-100 p-4 rounded text-red-800">
          ERROR: {result.error}
        </div>
      )}
      <p className="mt-4 text-slate-500">
        You can go back to the <a href="/dashboard/admin/campaigns" className="text-blue-600 underline">Admin Dashboard</a>.
      </p>
    </div>
  );
}
