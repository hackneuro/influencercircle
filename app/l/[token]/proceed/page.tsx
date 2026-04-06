import { createClient } from "@supabase/supabase-js";
import { ExternalLink, CheckCircle, HelpCircle, ChevronRight } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type PageProps = {
  params: Promise<{ token: string }>;
};

const BUCKET = "connect-links";

export default async function ProceedFramedPage({ params }: PageProps) {
  const { token } = await params;

  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );

  const { data: blob, error: downloadError } = await supabaseAdmin.storage.from(BUCKET).download(`${token}.json`);
  
  if (downloadError || !blob) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4 text-center">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 border border-slate-200">
           <h1 className="text-xl font-bold text-slate-900 mb-4">Error</h1>
           <p className="text-slate-500 mb-6">Secure connection link not found or expired.</p>
           <Link href="/dashboard" className="text-blue-600 font-bold hover:underline">Go to Dashboard</Link>
        </div>
      </div>
    );
  }

  let payload: any = null;
  try {
    const text = await blob.text();
    payload = JSON.parse(text);
  } catch {
    return notFound();
  }

  if (!payload?.proceed_url) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4 text-center">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 border border-slate-200">
           <h1 className="text-xl font-bold text-slate-900 mb-4">Error</h1>
           <p className="text-slate-500 mb-6">This connection does not have a destination URL configured.</p>
           <Link href="/dashboard" className="text-blue-600 font-bold hover:underline">Go to Dashboard</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-slate-50">
      {/* Top Frame */}
      <div className="bg-white border-b border-slate-200 shadow-sm z-50 p-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
             <div className="bg-blue-600 p-2 rounded-lg text-white shadow-md shadow-blue-200">
                <ExternalLink className="h-5 w-5" />
             </div>
             <div>
                <h1 className="text-sm font-bold text-slate-900 leading-tight">Influencer Circle Secure Platform Connection</h1>
                <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider flex items-center gap-1">
                   <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> Streaming ativo
                </p>
             </div>
          </div>

          <div className="flex items-center gap-2">
            <Link 
              href="/dashboard"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all shadow-md shadow-blue-200 text-sm font-bold flex items-center gap-2"
            >
              <CheckCircle className="h-4 w-4" />
              Login successful, proceed to the dashboard
            </Link>
            <Link 
              href="/dashboard/entrance-secure2/help"
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-all shadow-md shadow-red-200 text-sm font-bold flex items-center gap-2"
            >
              <HelpCircle className="h-4 w-4" />
              Can&apos;t login, need help!
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content (Iframe) */}
      <div className="flex-1 w-full h-full relative">
        <iframe 
          src={payload.proceed_url} 
          className="w-full h-full border-0"
          title="Remote Platform"
          allow="camera; microphone; display-capture; autoplay; clipboard-write"
          sandbox="allow-forms allow-modals allow-popups allow-popups-to-escape-sandbox allow-scripts allow-same-origin"
        />
        
        {/* Overlay helper for first-time users */}
        <div className="absolute bottom-6 right-6 pointer-events-none">
           <div className="bg-slate-900/90 text-white p-4 rounded-2xl shadow-2xl backdrop-blur-sm flex items-center gap-4 animate-in fade-in slide-in-from-bottom-4 duration-1000">
              <div className="text-xs space-y-1">
                 <p className="font-bold">Pro Tip:</p>
                 <p className="text-slate-300">Once logged in, click the blue button on top.</p>
              </div>
              <ChevronRight className="h-5 w-5 text-blue-400" />
           </div>
        </div>
      </div>
    </div>
  );
}
