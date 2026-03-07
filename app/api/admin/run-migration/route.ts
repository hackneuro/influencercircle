
import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ message: "Migration route disabled. Campaigns now use Storage." });
}
