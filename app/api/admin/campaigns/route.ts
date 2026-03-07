
import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

// Use service role key to bypass RLS and manage storage buckets
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const BUCKET = 'campaigns';

async function ensureBucket() {
  const { data: buckets } = await supabase.storage.listBuckets();
  if (!buckets?.find(b => b.name === BUCKET)) {
    await supabase.storage.createBucket(BUCKET, { public: true });
  }
}

export async function GET() {
  try {
    await ensureBucket();
    const { data: files, error } = await supabase.storage.from(BUCKET).list();
    
    if (error) throw error;

    const campaigns = await Promise.all(files.map(async (file) => {
      if (!file.name.endsWith('.json')) return null;
      const { data } = await supabase.storage.from(BUCKET).download(file.name);
      if (!data) return null;
      try {
        const text = await data.text();
        return JSON.parse(text);
      } catch (e) {
        return null;
      }
    }));

    const validCampaigns = campaigns.filter(Boolean).sort((a, b) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );

    return NextResponse.json(validCampaigns);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const id = crypto.randomUUID();
    const campaign = {
      id,
      ...body,
      created_at: new Date().toISOString()
    };

    await ensureBucket();
    const { error } = await supabase.storage
      .from(BUCKET)
      .upload(`${id}.json`, JSON.stringify(campaign), {
        contentType: 'application/json',
        upsert: true
      });

    if (error) throw error;

    return NextResponse.json(campaign);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) return NextResponse.json({ error: 'Missing ID' }, { status: 400 });

    const { error } = await supabase.storage
      .from(BUCKET)
      .remove([`${id}.json`]);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
