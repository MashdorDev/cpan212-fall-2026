'use client';

import { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext(null);

// Knows who is logged in, for any component that needs to show it (the header, the RSVP form).
// The session cookie is httpOnly, so JavaScript can't read it. The only way to find out is to ask the API.
export function AuthProvider({ children }) {
  // undefined while GET /api/auth/me is on its way, null when nobody is logged in, or the user object.
  const [user, setUser] = useState(undefined);

  useEffect(() => {
    let ignore = false;

    async function loadUser() {
      try {
        // The browser sends the session cookie with this request on its own: it is same-origin, through the rewrite.
        // A 401 here only means "not logged in", so it shows in the Network tab on every page for a visitor.
        const res = await fetch('/api/auth/me');
        // Read the body even for a 401. Chrome can leave an unread response open, which holds a connection
        // for as long as the page is open (it shows as a request that never finishes in the Network tab).
        const body = await res.json();
        if (!ignore) {
          setUser(res.ok ? body.data : null);
        }
      } catch {
        // The API is not reachable. Show the logged-out header rather than nothing.
        if (!ignore) {
          setUser(null);
        }
      }
    }
    loadUser();

    return () => {
      ignore = true;
    };
  }, []);

  return <AuthContext value={{ user, setUser }}>{children}</AuthContext>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used inside <AuthProvider>');
  }
  return context;
}
