
import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

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
      const cookieStore = await cookies();
      const referralCode = String(cookieStore.get("ic_ref_code")?.value || "").trim();
      const referralCampaignCode = String(cookieStore.get("ic_ref_campaign")?.value || "").trim();

      let referrerUserId: string | null = null;
      let referrerName: string | null = null;
      let referrerUsername: string | null = null;
      let referralCampaignTitle: string | null = null;
      let referralCampaignLocation: string | null = null;

      try {
        if (referralCampaignCode) {
          const { data: campaign } = await supabaseAdmin
            .from("referral_campaigns")
            .select("owner_id,title,location")
            .eq("code", referralCampaignCode)
            .maybeSingle();
          if (campaign?.owner_id) referrerUserId = String(campaign.owner_id);
          referralCampaignTitle = campaign?.title ? String(campaign.title) : null;
          referralCampaignLocation = campaign?.location ? String(campaign.location) : null;
        } else if (referralCode) {
          const { data: inviter } = await supabaseAdmin
            .from("profiles")
            .select("id,name,username")
            .eq("referral_code", referralCode)
            .maybeSingle();
          if (inviter?.id) {
            referrerUserId = String(inviter.id);
            referrerName = inviter?.name ? String(inviter.name) : null;
            referrerUsername = inviter?.username ? String(inviter.username) : null;
          }
        }

        if (referrerUserId && (!referrerName || !referrerUsername)) {
          const { data: inviterProfile } = await supabaseAdmin
            .from("profiles")
            .select("name,username")
            .eq("id", referrerUserId)
            .maybeSingle();
          referrerName = inviterProfile?.name ? String(inviterProfile.name) : referrerName;
          referrerUsername = inviterProfile?.username ? String(inviterProfile.username) : referrerUsername;
        }
      } catch {}

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
        referral_code: referralCode || null,
        referral_campaign_code: referralCampaignCode || null,
        referral_campaign_title: referralCampaignTitle,
        referral_campaign_location: referralCampaignLocation,
        referrer_user_id: referrerUserId,
        referrer_name: referrerName,
        referrer_username: referrerUsername,
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
