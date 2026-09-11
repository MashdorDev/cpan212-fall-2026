'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CATEGORIES } from '@/lib/categories';
import styles from './page.module.css';

export default function NewEventPage() {
  const router = useRouter();
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setSubmitting(true);
    setErrors({});
    setMessage('');

    // datetime-local gives "2026-10-14T18:00" in this computer's time zone. new Date() reads it that way,
    // and toISOString() converts it to UTC for the API. An empty field is sent as '' so the API reports it.
    const startsAtInput = form.get('startsAt');
    const startsAt = startsAtInput ? new Date(startsAtInput).toISOString() : '';

    try {
      // A relative URL, so the request goes to Next.js, which forwards it to the API (see next.config.mjs).
      const res = await fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: form.get('title'),
          description: form.get('description'),
          category: form.get('category'),
          location: form.get('location'),
          startsAt,
          capacity: Number(form.get('capacity')),
        }),
      });
      const body = await res.json();
      router.push(`/events/${body.data.id}`);
    } catch {
      // Network failure, or a response that wasn't JSON (for example, the API is not running).
      setMessage('Could not reach the events API. Check that it is running.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <h1>New event</h1>

      {message && (
        <div className={styles.summary} role="alert">
          <p>{message}</p>
          {errors.body && <p>{errors.body}</p>}
        </div>
      )}

      {/* noValidate turns off the browser's checks so you can see the API's validation errors. */}
      <form className={styles.form} onSubmit={handleSubmit} noValidate>
        <div className={styles.field}>
          <label htmlFor="title">Title</label>
          <input id="title" name="title" required minLength={3} maxLength={100} />
          {errors.title && <p className={styles.error}>{errors.title}</p>}
        </div>

        <div className={styles.field}>
          <label htmlFor="description">
            Description <span className={styles.hint}>(optional)</span>
          </label>
          <textarea id="description" name="description" rows={4} maxLength={2000} />
          {errors.description && <p className={styles.error}>{errors.description}</p>}
        </div>

        <div className={styles.field}>
          <label htmlFor="category">Category</label>
          <select id="category" name="category" defaultValue="" required>
            <option value="">Choose a category</option>
            {CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
          {errors.category && <p className={styles.error}>{errors.category}</p>}
        </div>

        <div className={styles.field}>
          <label htmlFor="location">Location</label>
          <input id="location" name="location" required maxLength={200} />
          {errors.location && <p className={styles.error}>{errors.location}</p>}
        </div>

        <div className={styles.field}>
          <label htmlFor="startsAt">Starts</label>
          <input id="startsAt" name="startsAt" type="datetime-local" required />
          {errors.startsAt && <p className={styles.error}>Pick a date and a start time.</p>}
        </div>

        <div className={styles.field}>
          <label htmlFor="capacity">Capacity</label>
          <input id="capacity" name="capacity" type="number" min={1} max={1000} step={1} required />
          {errors.capacity && <p className={styles.error}>{errors.capacity}</p>}
        </div>

        <button className={styles.submit} type="submit" disabled={submitting}>
          {submitting ? 'Saving...' : 'Create event'}
        </button>
      </form>
    </>
  );
}
