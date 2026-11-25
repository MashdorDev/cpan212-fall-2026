'use client';

import { useState } from 'react';
import Link from 'next/link';
import styles from './Form.module.css';

// next is the page to open after creating the account, like /events/new.
export default function RegisterForm({ next }) {
  // One message per field the API did not accept, for example { email: 'Already registered' }.
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);

  async function handleSubmit(event) {
    // Stop the browser from reloading the page. We send the data ourselves.
    event.preventDefault();
    setSending(true);
    setErrors({});
    setMessage('');

    const form = new FormData(event.currentTarget);
    const account = {
      name: form.get('name'),
      email: form.get('email'),
      password: form.get('password'),
    };

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(account),
      });
      const body = await res.json();

      // 400 or 409. Show the API's messages and stay on the form.
      if (!res.ok) {
        if (body.error.details) {
          setErrors(body.error.details);
        }
        setMessage(body.error.message);
        setSending(false);
        return;
      }

      // 201: the account exists and you are logged in. Load the next page fresh, with the new cookie.
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

      {/* noValidate turns off the browser's own checks, so you can see the API's validation errors. */}
      <form className={styles.form} onSubmit={handleSubmit} noValidate>
        <div className={styles.field}>
          <label htmlFor="name">Name</label>
          <input id="name" name="name" autoComplete="name" />
          {errors.name && <p className={styles.error}>{errors.name}</p>}
        </div>

        <div className={styles.field}>
          <label htmlFor="email">Email</label>
          <input id="email" name="email" type="email" autoComplete="email" />
          {errors.email && <p className={styles.error}>{errors.email}</p>}
        </div>

        <div className={styles.field}>
          <label htmlFor="password">
            Password <span className={styles.hint}>(at least 8 characters)</span>
          </label>
          {/* new-password lets a password manager suggest a strong password. */}
          <input id="password" name="password" type="password" autoComplete="new-password" />
          {errors.password && <p className={styles.error}>{errors.password}</p>}
        </div>

        <button className={styles.submit} type="submit" disabled={sending}>
          Create account
        </button>
      </form>

      <p>
        Already have an account? <Link href={'/login?next=' + encodeURIComponent(next)}>Log in</Link>
      </p>
    </>
  );
}
