import { NextResponse } from 'next/server';

// The same name as SESSION_COOKIE_NAME in the API's src/session.js.
const SESSION_COOKIE_NAME = 'campus.sid';

// proxy.js runs on the Next.js server before a page is shown. (Before Next.js 16 it was called middleware.)
// It only checks that a session cookie exists. It can't tell if the session is still valid: only the API
// can. So this just saves a logged-out visitor from filling in a form that will fail.
// The real lock is requireAuth in the API.
export function proxy(request) {
  if (request.cookies.has(SESSION_COOKIE_NAME)) {
    return NextResponse.next();
  }

  // No cookie: go to the login page, and come back here afterwards.
  const loginUrl = new URL('/login', request.url);
  loginUrl.searchParams.set('next', request.nextUrl.pathname);
  return NextResponse.redirect(loginUrl);
}

// Only these pages run the proxy.
export const config = {
  matcher: ['/events/new'],
};
