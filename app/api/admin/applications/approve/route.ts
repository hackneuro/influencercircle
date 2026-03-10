
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
    const { applicationId, email, password, firstName, lastName, role } = await request.json();

    if (!applicationId || !email || !password || !firstName || !lastName) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    console.log(`Approving application ${applicationId} for ${email}`);

    // 1. Create User in Supabase Auth
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: email,
      password: password,
      email_confirm: true,
      user_metadata: {
        name: `${firstName} ${lastName}`,
        role: role,
        force_password_change: true
      }
    });

    if (authError) {
      console.error('Error creating auth user:', authError);
      return NextResponse.json({ error: `Failed to create user: ${authError.message}` }, { status: 400 });
    }

    const userId = authData.user.id;

    // 2. Determine Profile Role
    // Map application roles to system roles (user, influencer, admin)
    let systemRole = 'user';
    if (role && role.toLowerCase().includes('influencer')) {
      systemRole = 'influencer';
    }
    // Executive, Student, Beginner -> user (default)

    // 3. Create Profile
    // Generate a simple username
    const username = `${firstName.toLowerCase()}_${lastName.toLowerCase()}_${Math.floor(Math.random() * 1000)}`;

    const { error: profileError } = await supabaseAdmin
      .from('profiles')
      .insert({
        id: userId,
        email: email,
        name: `${firstName} ${lastName}`,
        username: username,
        role: systemRole,
        is_premium: false,
        is_public: true,
        plan: 'member',
        updated_at: new Date().toISOString()
      });

    if (profileError) {
      console.error('Error creating profile:', profileError);
      // Clean up auth user if profile creation fails? 
      // Ideally yes, but for now we'll just report error. 
      // The user exists in Auth but has no profile.
      return NextResponse.json({ error: `User created but profile failed: ${profileError.message}` }, { status: 500 });
    }

    // 4. Update Application Status to 'approved'
    // 4.1 Update DB
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

    return NextResponse.json({ success: true, userId: userId });
  } catch (error: any) {
    console.error('Approve API Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
