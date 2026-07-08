import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ token: string }> },
) {
  const { token } = await params;

  // Probe the subscription endpoint to tell management sessions from rescue sessions
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/customer-portal/sessions/${token}/subscription`,
      { cache: "no-store" },
    );
    if (res.ok) {
      return NextResponse.redirect(new URL(`/portal/manage/${token}`, req.url));
    }
  } catch {
    // fall through to rescue page
  }

  return NextResponse.redirect(new URL(`/portal/${token}`, req.url));
}
