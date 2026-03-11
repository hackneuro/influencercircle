import { createClient } from "@supabase/supabase-js";
import { notFound } from "next/navigation";
import ProceedButton from "./ProceedButton";

export const dynamic = "force-dynamic";
export const revalidate = 0;

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

  let payload: { email: string; name: string; phone: string } | null = null;
  try {
    const text = await blob.text();
    const json = JSON.parse(text);
    payload = {
      email: String(json.email || ""),
      name: String(json.name || ""),
      phone: String(json.phone || "")
    };
  } catch {
    payload = null;
  }

  if (!payload?.email || !payload?.name || !payload?.phone) notFound();

  const curlPayload = `{\n  \"email\": \"${payload.email}\",\n  \"name\": \"${payload.name}\",\n  \"phone\": \"${payload.phone}\",\n  \"channel\": \"linkedin\"\n}`;

  const curlCommand =
    "curl --location \\'https://remote.hackneuro.com/api/public/link/\\' \\\\\n" +
    "  --header \\'X-API-KEY: ************\\' \\\\\n" +
    "  --header \\'Content-Type: application/json\\' \\\\\n" +
    "  --header \\'Accept: application/json\\' \\\\\n" +
    `  --data-raw \\'${curlPayload}\\'`;

  return (
    <main className="max-w-2xl mx-auto space-y-6 py-10">
      <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
        <h1 className="text-xl font-bold text-slate-900">LinkedIn Secure Connection</h1>
        <p className="text-slate-600">
          You will now enter a secure connection into our server so you can log your Linkedin directly into our platform.
          Your password is not stored or seen by anyone and stays directly on your linkedin account.
        </p>

        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm">
          <div className="font-semibold text-slate-700 mb-2">Data</div>
          <pre className="whitespace-pre-wrap break-words text-slate-800">{curlPayload}</pre>
        </div>

        <ProceedButton token={token} />
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-3">
        <div className="font-semibold text-slate-800">Reference (masked)</div>
        <pre className="text-xs whitespace-pre-wrap break-words bg-slate-950 text-slate-50 p-4 rounded-xl">{curlCommand}</pre>
      </div>
    </main>
  );
}
