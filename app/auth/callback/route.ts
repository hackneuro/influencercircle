import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  
  // Default redirect to dashboard if no 'next' param provided
  const next = requestUrl.searchParams.get('next') || '/dashboard';

  if (code) {
    try {
      const cookieStore = await cookies();
      
      const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
          cookies: {
            get(name: string) {
              return cookieStore.get(name)?.value;
            },
            set(name: string, value: string, options: CookieOptions) {
              cookieStore.set({ name, value, ...options });
            },
            remove(name: string, options: CookieOptions) {
              cookieStore.set({ name, value: '', ...options });
            },
          },
        }
      );
      
      // Exchange the code for a session
      const { error } = await supabase.auth.exchangeCodeForSession(code);
      if (error) throw error;
      
    } catch (error) {
      console.error('Auth callback error:', error);
      // Redirect to login with error if exchange fails
      return NextResponse.redirect(`${requestUrl.origin}/login?error=auth_exchange_failed`);
    }
  }

  // Redirect to the intended page
  const redirectUrl = new URL(`${requestUrl.origin}${next}`);
  redirectUrl.searchParams.set('verified', 'true');
  return NextResponse.redirect(redirectUrl);
}
