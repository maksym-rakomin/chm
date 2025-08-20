import { NextResponse } from "next/server";

// Make this route statically exportable for Next.js `output: "export"` builds.
export const dynamic = "force-static";

export async function GET() {
  return NextResponse.json({ role: "guest" });
}

export async function POST() {
  return NextResponse.json({ role: "guest" });
}
