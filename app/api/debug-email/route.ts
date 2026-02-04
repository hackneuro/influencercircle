import { NextResponse } from "next/server";
import { Resend } from "resend";

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const resendKey = process.env.RESEND_API_KEY;
    const adminEmail = process.env.ADMIN_EMAIL;
    const fromEmail = process.env.RESEND_FROM_EMAIL || "no-reply@influencercircle.net";

    console.log("Debug Email Config:", { 
      hasKey: !!resendKey, 
      adminEmail, 
      fromEmail 
    });

    if (!resendKey) {
      return NextResponse.json({ error: "Missing RESEND_API_KEY" }, { status: 500 });
    }

    if (!adminEmail) {
        return NextResponse.json({ error: "Missing ADMIN_EMAIL" }, { status: 500 });
    }

    const resend = new Resend(resendKey);

    const { data, error } = await resend.emails.send({
      from: fromEmail,
      to: adminEmail,
      subject: "Debug Email from Production",
      html: "<p>If you receive this, <strong>Resend is working in Production!</strong></p>",
    });

    if (error) {
      console.error("Resend Error:", error);
      return NextResponse.json({ error }, { status: 500 });
    }

    console.log("Email sent successfully:", data);
    return NextResponse.json({ message: "Email sent", data });
  } catch (err: any) {
    console.error("Debug Route Error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
