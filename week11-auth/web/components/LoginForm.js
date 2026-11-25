'use client';

import { useState } from 'react';
import Link from 'next/link';
import styles from './Form.module.css';

// next is the page to open after logging in, like /events/new.
export default function LoginForm({ next }) {
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);

  async function handleSubmit(event) {
    // Stop the browser from reloading the page. We send the data ourselves.
    event.preventDefault();
    setSending(true);
    setMessage('');

    const form = new FormData(event.currentTarget);
    const login = {
      email: form.get('email'),
      password: form.get('password'),
    };

    try {
      // Through the rewrite to the API, like every /api call. The API answers with a Set-Cookie header,
      // and the browser keeps the cookie for this site.
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(login),
      });
      const body = await res.json();

      if (!res.ok) {
        setMessage(body.error.message);
        setSending(false);
        return;
      }

      // A full page load instead of router.push(), so every page is loaded fresh with the new cookie.
      window.location.assign(next);
    } catch (err) {
      setMessage('Could not reach the events API. Check that it is running.');
      setSending(false);
    }
  }

  return (
    <>
      {message && (
        <p className={styles.summary} role="alert">
          {message}
        </p>
      )}

      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.field}>
          <label htmlFor="email">Email</label>
          <input id="email" name="email" type="email" autoComplete="email" required />
        </div>

        <div className={styles.field}>
          <label htmlFor="password">Password</label>
          {/* current-password lets a password manager fill in the saved password. */}
          <input id="password" name="password" type="password" autoComplete="current-password" required />
        </div>

        <button className={styles.submit} type="submit" disabled={sending}>
          Log in
        </button>
      </form>

      <p>
        New here? <Link href={'/register?next=' + encodeURIComponent(next)}>Create an account</Link>
      </p>
    </>
  );
}
