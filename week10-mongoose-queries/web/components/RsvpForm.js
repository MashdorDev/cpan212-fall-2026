'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './RsvpForm.module.css';

// Posts { name, email } to /api/events/:id/rsvps through the rewrite and shows what the API answered:
// 201 created, 400 with a message per field, 409 when the email is already registered or the event is full.
export default function RsvpForm({ eventId }) {
  const router = useRouter();
  const [result, setResult] = useState(null);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    // Keep a reference to the form: after an await, React has already cleared event.currentTarget.
    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    setSubmitting(true);
    setErrors({});
    setResult(null);

    try {
      const res = await fetch(`/api/events/${eventId}/rsvps`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: form.get('name'), email: form.get('email') }),
      });
      const body = await res.json();

      if (res.ok) {
        setResult({ ok: true, status: res.status, message: `You're on the list, ${body.data.name}.` });
        formElement.reset();
        // Runs the Server Component page again, so the "spots taken" count includes this RSVP.
        router.refresh();
        return;
      }
      setErrors(body.error?.details ?? {});
      setResult({ ok: false, status: res.status, message: body.error?.message ?? 'Something went wrong' });
    } catch {
      setResult({ ok: false, status: null, message: 'Could not reach the events API. Check that it is running.' });
    } finally {
      setSubmitting(false);
    }
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

      <form className={styles.form} onSubmit={handleSubmit} noValidate>
        <div className={styles.field}>
          <label htmlFor="rsvp-name">Name</label>
          <input id="rsvp-name" name="name" autoComplete="name" required maxLength={100} />
          {errors.name && <p className={styles.error}>{errors.name}</p>}
        </div>
        <div className={styles.field}>
          <label htmlFor="rsvp-email">Email</label>
          <input id="rsvp-email" name="email" type="email" autoComplete="email" required maxLength={254} />
          {errors.email && <p className={styles.error}>{errors.email}</p>}
        </div>
        <button className={styles.submit} type="submit" disabled={submitting}>
          {submitting ? 'Sending...' : 'RSVP'}
        </button>
      </form>
    </section>
  );
}
