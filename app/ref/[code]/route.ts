import { NextResponse } from "next/server";

export async function GET(req: Request, ctx: { params: Promise<{ code: string }> }) {
  const { code } = await ctx.params;
  const url = new URL(req.url);
  const redirectTo = new URL("/apply", url.origin);

  const res = NextResponse.redirect(redirectTo);
  res.cookies.set("ic_ref_campaign", String(code || ""), {
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
    sameSite: "lax"
  });
  return res;
}

