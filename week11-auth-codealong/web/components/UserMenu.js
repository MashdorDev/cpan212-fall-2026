'use client';

import Link from 'next/link';
import { useAuth } from './AuthProvider';
import styles from './UserMenu.module.css';

// The right side of the header: Log in and Register, or your name and Log out.
export default function UserMenu() {
  const { user } = useAuth();

  async function handleLogout() {
    // The API deletes the session and tells the browser to delete the cookie.
    await fetch('/api/auth/logout', { method: 'POST' });
    // A full page load, so no page Next.js kept from while you were logged in is shown again.
    // The lint rule prefers router.push(), which would reuse those pages.
    // eslint-disable-next-line @next/next/no-location-assign-relative-destination
    window.location.assign('/');
  }

  // Still asking the API. Show nothing, instead of "Log in" changing to your name a moment later.
  if (user === undefined) {
    return <div className={styles.menu} />;
  }

  if (user === null) {
    return (
      <div className={styles.menu}>
        <Link href="/login">Log in</Link>
        <Link href="/register">Register</Link>
      </div>
    );
  }

  return (
    <div className={styles.menu}>
      <span className={styles.name}>{user.name}</span>
      <button type="button" className={styles.logout} onClick={handleLogout}>
        Log out
      </button>
    </div>
  );
}
