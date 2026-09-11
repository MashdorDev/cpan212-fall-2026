'use client';

import { useState } from 'react';
import Link from 'next/link';
import styles from './Form.module.css';

// One form for both pages. mode is 'login' or 'register'; next is where to go afterwards.
export default function AuthForm({ mode, next }) {
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const isRegister = mode === 'register';

  async function handleSubmit(event) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setSubmitting(true);
    setErrors({});
    setMessage('');

    try {
      // Through the rewrite, so the Set-Cookie header in the API's answer is stored for this site (the Next.js
      // origin) and sent with every later /api request. Called on port 4000 directly, the cookie would belong
      // to the API's origin instead, and cross-site cookie rules would get in the way.
      const res = await fetch(isRegister ? '/api/auth/register' : '/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(
          isRegister
            ? { name: form.get('name'), email: form.get('email'), password: form.get('password') }
            : { email: form.get('email'), password: form.get('password') },
        ),
      });
      const body = await res.json();

      if (!res.ok) {
        setErrors(body.error?.details ?? {});
        setMessage(body.error?.message ?? `The API answered ${res.status}`);
        return;
      }
      // A full page load instead of router.push(next). While you were logged out, Next.js prefetched the
      // "New event" link and remembered proxy.js's redirect to /login. router.push would reuse that answer and
      // bounce you back here. Loading the page fresh asks the server again, with the new cookie, and
      // AuthProvider loads the user from /api/auth/me on the way.
      window.location.assign(next);
    } catch {
      setMessage('Could not reach the events API. Check that it is running.');
    } finally {
      setSubmitting(false);
    }
  }

  const otherPage = isRegister ? '/login' : '/register';
  const nextQuery = next === '/events' ? '' : `?next=${encodeURIComponent(next)}`;

  return (
    <>
      {message && (
        <p className={styles.summary} role="alert">
          {message}
        </p>
      )}

      <form className={styles.form} onSubmit={handleSubmit} noValidate>
        {isRegister && (
          <div className={styles.field}>
            <label htmlFor="name">Name</label>
            <input id="name" name="name" autoComplete="name" required maxLength={100} />
            {errors.name && <p className={styles.error}>{errors.name}</p>}
          </div>
        )}

        <div className={styles.field}>
          <label htmlFor="email">Email</label>
          <input id="email" name="email" type="email" autoComplete="email" required />
          {errors.email && <p className={styles.error}>{errors.email}</p>}
        </div>

        <div className={styles.field}>
          <label htmlFor="password">
            Password {isRegister && <span className={styles.hint}>(8 to 72 characters)</span>}
          </label>
          {/* autoComplete lets password managers offer a saved password on login and a new one on register. */}
          <input
            id="password"
            name="password"
            type="password"
            autoComplete={isRegister ? 'new-password' : 'current-password'}
            required
          />
          {errors.password && <p className={styles.error}>{errors.password}</p>}
        </div>

        <button className={styles.submit} type="submit" disabled={submitting}>
          {submitting ? 'Please wait...' : isRegister ? 'Create account' : 'Log in'}
        </button>
      </form>

      <p>
        {isRegister ? 'Already have an account? ' : 'New here? '}
        <Link href={`${otherPage}${nextQuery}`}>{isRegister ? 'Log in' : 'Create an account'}</Link>
      </p>
    </>
  );
}
