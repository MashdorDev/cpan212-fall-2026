'use client';

import { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext(null);

// Knows who is logged in, for every component that needs it (the header, the RSVP form).
// The session cookie is httpOnly, so JavaScript can't read it. The only way to know is to ask the API.
export function AuthProvider({ children }) {
  // undefined while we are still asking, null when nobody is logged in, or the user { id, name, email }.
  const [user, setUser] = useState(undefined);

  useEffect(() => {
    async function loadUser() {
      try {
        // The browser sends the session cookie with this request by itself.
        // For a visitor who isn't logged in the API answers 401. That is expected, not a bug.
        const res = await fetch('/api/auth/me');
        const body = await res.json();
        if (res.ok) {
          setUser(body.data);
        } else {
          setUser(null);
        }
      } catch (err) {
        // The API is not running. Show the logged-out header.
        setUser(null);
      }
    }
    loadUser();
  }, []);

  return <AuthContext value={{ user: user, setUser: setUser }}>{children}</AuthContext>;
}

// Any component inside AuthProvider can call this: const { user } = useAuth();
export function useAuth() {
  return useContext(AuthContext);
}
