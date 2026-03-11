import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";
export const maxDuration = 300;

const BUCKET = "connect-links";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const token = String(body?.token || "");
    if (!token) return NextResponse.json({ error: "Missing token" }, { status: 400 });

    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { autoRefreshToken: false, persistSession: false } }
    );

    const { data: blob } = await supabaseAdmin.storage.from(BUCKET).download(`${token}.json`);
    if (!blob) return NextResponse.json({ error: "Invalid link" }, { status: 404 });

    const text = await blob.text();
    const payload = JSON.parse(text);
    const email = String(payload.email || "");
    const name = String(payload.name || "");
    const phone = String(payload.phone || "");

    if (!email || !name || !phone) return NextResponse.json({ error: "Invalid link payload" }, { status: 400 });

    const apiKey = process.env.HACKNEURO_REMOTE_API_KEY || "019bfb84-c738-7064-bba6-a9082e8e6140";
    const apiUrl = "https://remote.hackneuro.com/api/public/link/";

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 180000);

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "X-API-KEY": apiKey,
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify({ email, name, phone, channel: "linkedin" }),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    const responseText = await response.text();
    let responseJson: any = null;
    try {
      responseJson = JSON.parse(responseText);
    } catch {
      responseJson = { raw: responseText };
    }

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to communicate with integration service", details: responseJson },
        { status: response.status }
      );
    }

    return NextResponse.json(responseJson);
  } catch (error: any) {
    if (error?.name === "AbortError") {
      return NextResponse.json({ error: "Integration service unavailable (Timeout)" }, { status: 504 });
    }
    return NextResponse.json({ error: error.message || "Unknown error" }, { status: 500 });
  }
}

