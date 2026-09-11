import { NextResponse } from 'next/server';

// Must match SESSION_COOKIE_NAME in the API's src/session.js.
const SESSION_COOKIE_NAME = 'campus.sid';

// Proxy (called middleware before Next.js 16) runs on the server before the page renders.
// This is a quick check: is there a session cookie at all? It can't tell whether the session is still valid,
// because only the API can look it up. So it is a convenience that saves a logged-out visitor from filling in
// a form that will fail. The real protection is requireAuth on POST /api/events.
export function proxy(request) {
  if (request.cookies.has(SESSION_COOKIE_NAME)) {
    return NextResponse.next();
  }
  const loginUrl = new URL('/login', request.url);
  loginUrl.searchParams.set('next', request.nextUrl.pathname);
  return NextResponse.redirect(loginUrl);
}

// Only these paths run the proxy. Everything else, including /_next files and images, skips it.
export const config = {
  matcher: ['/events/new'],
};
