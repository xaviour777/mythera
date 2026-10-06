import { NextResponse, type NextRequest } from "next/server";

// Temporary: send visitors landing on the homepage to the egg teaser.
// Turns itself off after this moment, no follow-up change needed.
const EGG_REDIRECT_UNTIL = Date.parse("2026-10-14T00:00:00Z");

export function proxy(request: NextRequest) {
  if (Date.now() >= EGG_REDIRECT_UNTIL) return NextResponse.next();

  // Let people who click through from the site itself (e.g. the egg page's
  // "Back to the studio" link) reach the real homepage.
  const referer = request.headers.get("referer");
  if (referer) {
    try {
      if (new URL(referer).host === request.nextUrl.host) return NextResponse.next();
    } catch {}
  }

  const url = request.nextUrl.clone();
  url.pathname = "/egg";
  return NextResponse.redirect(url, 307);
}

export const config = { matcher: "/" };
