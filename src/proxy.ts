import { NextResponse, type NextRequest } from "next/server";

const SESSION_COOKIE = "atlas_session";

/**
 * First line of defence for the editorial desk, previews and desk APIs: no
 * session cookie, no entry. This is only a cheap gate — every page, route
 * handler and server action verifies the session against the database and
 * checks permissions itself (src/lib/auth/session.ts, src/lib/editorial/permissions.ts).
 */
export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (pathname === "/admin/login") return NextResponse.next();
  if (req.cookies.get(SESSION_COOKIE)?.value) return NextResponse.next();
  if (pathname.startsWith("/api/")) return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  const url = req.nextUrl.clone();
  url.pathname = "/admin/login";
  url.search = pathname === "/admin" ? "" : `?next=${encodeURIComponent(pathname + req.nextUrl.search)}`;
  return NextResponse.redirect(url);
}

export const config = { matcher: ["/admin", "/admin/:path*", "/preview/:path*", "/api/desk/:path*"] };
