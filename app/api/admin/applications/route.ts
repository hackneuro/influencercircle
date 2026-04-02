
import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

function getSupabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    }
  );
}

export async function GET() {
  try {
    const supabaseAdmin = getSupabaseAdmin();
    let applicationsData: any[] = [];

    // 1. Try to fetch from DB
    try {
      const { data, error } = await supabaseAdmin
        .from('applications')
        .select('*, campaigns(campaign_name, opportunity_title, location)')
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

    // 3. Hydrate Campaign Data for applications that have campaign_id but no campaign details (e.g. from Storage or failed DB join)
    try {
      // Fetch all campaigns from storage (since DB join might fail or campaigns are in storage now)
      // This is less efficient but necessary for the storage fallback architecture
      const { data: campaignFiles } = await supabaseAdmin.storage.from('campaigns').list();
      const campaignsMap: Record<string, any> = {};

      if (campaignFiles) {
        await Promise.all(campaignFiles.map(async (file) => {
           if (!file.name.endsWith('.json')) return;
           const id = file.name.replace('.json', '');
           // Only fetch if we have applications referencing this ID
           if (applicationsData.some(app => app.campaign_id === id && !app.campaigns)) {
             const { data } = await supabaseAdmin.storage.from('campaigns').download(file.name);
             if (data) {
               try {
                 const text = await data.text();
                 campaignsMap[id] = JSON.parse(text);
               } catch (e) {}
             }
           }
        }));
      }

      // Attach campaign details
      applicationsData = applicationsData.map(app => {
        if (app.campaign_id && !app.campaigns && campaignsMap[app.campaign_id]) {
          return {
            ...app,
            campaigns: {
              campaign_name: campaignsMap[app.campaign_id].campaign_name,
              opportunity_title: campaignsMap[app.campaign_id].opportunity_title,
              location: campaignsMap[app.campaign_id].location
            }
          };
        }
        return app;
      });
    } catch (hydrateError) {
      console.warn('Campaign hydration failed:', hydrateError);
    }

    // 4. Hydrate referrer profile details (username/name) when present
    try {
      const referrerIds = Array.from(
        new Set(
          applicationsData
            .map((a) => String(a?.referrer_user_id || ""))
            .filter(Boolean)
        )
      );

      if (referrerIds.length > 0) {
        const { data: referrers } = await supabaseAdmin
          .from("profiles")
          .select("id,name,username")
          .in("id", referrerIds);

        const refMap: Record<string, any> = {};
        for (const r of referrers || []) refMap[String((r as any).id)] = r;

        applicationsData = applicationsData.map((app) => {
          const rid = String(app?.referrer_user_id || "");
          if (!rid) return app;
          const r = refMap[rid];
          if (!r) return app;
          return {
            ...app,
            referrer_name: app.referrer_name || r.name || null,
            referrer_username: app.referrer_username || r.username || null
          };
        });
      }
    } catch (e) {
      console.warn("Referrer hydration failed:", e);
    }

    // 5. Hydrate referral campaign details when present
    try {
      const codes = Array.from(
        new Set(
          applicationsData
            .map((a) => String(a?.referral_campaign_code || ""))
            .filter(Boolean)
        )
      );

      if (codes.length > 0) {
        const { data: referralCampaigns } = await supabaseAdmin
          .from("referral_campaigns")
          .select("code,title,location")
          .in("code", codes);

        const rcMap: Record<string, any> = {};
        for (const c of referralCampaigns || []) rcMap[String((c as any).code)] = c;

        applicationsData = applicationsData.map((app) => {
          const code = String(app?.referral_campaign_code || "");
          if (!code) return app;
          if (app.referral_campaign_title || app.referral_campaign_location) return app;
          const rc = rcMap[code];
          if (!rc) return app;
          return {
            ...app,
            referral_campaign_title: rc.title || null,
            referral_campaign_location: rc.location || null
          };
        });
      }
    } catch (e) {
      console.warn("Referral campaign hydration failed:", e);
    }

    return NextResponse.json({ success: true, data: applicationsData });
  } catch (error: any) {
    console.error('Admin API Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
