import { createClient } from "@supabase/supabase-js";
import { notFound } from "next/navigation";
import ProceedPaymentButton from "./ProceedPaymentButton";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

type PageProps = {
  params: Promise<{ token: string }>;
};

const BUCKET = "promo49br-links";

export default async function Promo49Page({ params }: PageProps) {
  const { token } = await params;

  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );

  const { data: blob } = await supabaseAdmin.storage.from(BUCKET).download(`${token}.json`);
  if (!blob) notFound();

  let payload: { email: string; name: string; phone: string; productName: string } | null = null;
  try {
    const text = await blob.text();
    const json = JSON.parse(text);
    payload = {
      email: String(json.email || ""),
      name: String(json.name || ""),
      phone: String(json.phone || ""),
      productName: String(json.productName || "Elite Plan Brazil first 1.000 (early market entry)")
    };
  } catch {
    payload = null;
  }

  if (!payload?.email || !payload?.name || !payload?.phone) notFound();

  return (
    <main className="max-w-2xl mx-auto space-y-6 py-10">
      <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-5">
        <div className="leading-tight">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">Product</div>
          <h1 className="text-2xl font-bold text-slate-900">{payload.productName}</h1>
        </div>

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
        </div>

        <div className="space-y-3 text-slate-700">
          <p>
            This promotion is valid for the Brazilian territory only for the first 1.000 users (market entry). It gives you access to Elite Version for unlimited time: minimum of 100 engagements per post to start your level boost on Linkedin.
          </p>
          <p className="font-semibold">
            This promotion is only valid for: Name, email, and phone and it cannot be sent to other users.
          </p>
        </div>

        <ProceedPaymentButton token={token} />
      </div>
    </main>
  );
}
