'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from './AuthProvider';
import styles from './RsvpForm.module.css';

// RSVPs need a logged-in user, and the API takes the name and email from the session.
// So the form is just a button, and logged-out visitors get a link to log in and come back.
export default function RsvpForm({ eventId }) {
  const router = useRouter();
  const { user, setUser } = useAuth();
  const [result, setResult] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitting(true);
    setResult(null);

    try {
      // No body: the API knows who you are from the session cookie.
      const res = await fetch(`/api/events/${eventId}/rsvps`, { method: 'POST' });
      const body = await res.json();

      if (res.ok) {
        setResult({ ok: true, status: res.status, message: "You're on the list." });
        // Runs the Server Component page again, so the "spots taken" count includes this RSVP.
        router.refresh();
        return;
      }
      if (res.status === 401) {
        // The session ended since the page loaded. Show the logged-out state.
        setUser(null);
      }
      setResult({ ok: false, status: res.status, message: body.error?.message ?? 'Something went wrong' });
    } catch {
      setResult({ ok: false, status: null, message: 'Could not reach the events API. Check that it is running.' });
    } finally {
      setSubmitting(false);
    }
  }

  // Still finding out who is logged in.
  if (user === undefined) {
    return null;
  }

  return (
    <section className={styles.rsvp}>
      <h2>RSVP</h2>

      {result && (
        <p className={result.ok ? styles.success : styles.failure} role={result.ok ? 'status' : 'alert'}>
          {result.message}
          {/* The status code is shown for class, so you can match what you see to the API's response. */}
          {result.status && <span className={styles.code}> (HTTP {result.status})</span>}
        </p>
      )}

      {user === null ? (
        <p>
          <Link href={`/login?next=/events/${eventId}`}>Log in</Link> to RSVP.
        </p>
      ) : (
        <form onSubmit={handleSubmit}>
          <p>
            You will be listed as {user.name} ({user.email}).
          </p>
          <button className={styles.submit} type="submit" disabled={submitting}>
            {submitting ? 'Sending...' : 'RSVP'}
          </button>
        </form>
      )}
    </section>
  );
}
