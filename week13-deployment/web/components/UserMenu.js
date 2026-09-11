'use client';

import Link from 'next/link';
import { useAuth } from './AuthProvider';
import styles from './UserMenu.module.css';

export default function UserMenu() {
  const { user } = useAuth();

  async function handleLogout() {
    // The API deletes the session and tells the browser to delete the cookie.
    await fetch('/api/auth/logout', { method: 'POST' });
    // A full page load, for the same reason as after logging in (see AuthForm.js): pages Next.js fetched
    // while you were logged in shouldn't be reused. The lint rule prefers router.push(), which would reuse them.
    // eslint-disable-next-line @next/next/no-location-assign-relative-destination
    window.location.assign('/');
  }

  // Still asking the API. Rendering nothing avoids a "Log in" link that flips to a name a moment later.
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
