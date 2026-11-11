'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CATEGORIES } from '@/lib/categories';
import styles from './page.module.css';

// A Client Component: the form runs in the browser and sends the new event to the API.
export default function NewEventPage() {
  const router = useRouter();

  // One message per field that the API did not accept, for example { title: 'Title is required' }.
  const [errors, setErrors] = useState({});
  // One message for the top of the form.
  const [message, setMessage] = useState('');

  async function handleSubmit(event) {
    // Stop the browser from reloading the page. We send the data ourselves.
    event.preventDefault();
    setErrors({});
    setMessage('');

    // Read every field of the form by its name="..." attribute.
    const form = new FormData(event.currentTarget);

    // The date field gives "2026-10-21T18:00" in this computer's time zone.
    // The API wants a full date in UTC, like "2026-10-21T22:00:00.000Z".
    let startsAt = '';
    if (form.get('startsAt')) {
      startsAt = new Date(form.get('startsAt')).toISOString();
    }

    const newEvent = {
      title: form.get('title'),
      description: form.get('description'),
      category: form.get('category'),
      location: form.get('location'),
      startsAt: startsAt,
      capacity: Number(form.get('capacity')),
    };

    try {
      // A short URL with no port: the request goes to Next.js on port 3000,
      // and the rewrite in next.config.mjs passes it on to the API on port 4000.
      const res = await fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newEvent),
      });
      const body = await res.json();

      // The API said no (400). Show its messages and stay on the form.
      if (!res.ok) {
        if (body.error.details) {
          setErrors(body.error.details);
        }
        setMessage(body.error.message);
        return;
      }

      // Saved (201). Go to the new event's page.
      router.push('/events/' + body.data.id);
    } catch (err) {
      // The API is not running, or it answered with something that is not JSON.
      setMessage('Could not reach the events API. Check that it is running.');
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

      {/* noValidate turns off the browser's own checks, so you can see the API's validation errors. */}
      <form className={styles.form} onSubmit={handleSubmit} noValidate>
        <div className={styles.field}>
          <label htmlFor="title">Title</label>
          <input id="title" name="title" />
          {errors.title && <p className={styles.error}>{errors.title}</p>}
        </div>

        <div className={styles.field}>
          <label htmlFor="description">
            Description <span className={styles.hint}>(optional)</span>
          </label>
          <textarea id="description" name="description" rows={4} />
          {errors.description && <p className={styles.error}>{errors.description}</p>}
        </div>

        <div className={styles.field}>
          <label htmlFor="category">Category</label>
          <select id="category" name="category" defaultValue="">
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
          <input id="location" name="location" />
          {errors.location && <p className={styles.error}>{errors.location}</p>}
        </div>

        <div className={styles.field}>
          <label htmlFor="startsAt">Starts</label>
          <input id="startsAt" name="startsAt" type="datetime-local" />
          {errors.startsAt && <p className={styles.error}>Pick a date and a start time.</p>}
        </div>

        <div className={styles.field}>
          <label htmlFor="capacity">Capacity</label>
          <input id="capacity" name="capacity" type="number" />
          {errors.capacity && <p className={styles.error}>{errors.capacity}</p>}
        </div>

        <button className={styles.submit} type="submit">
          Create event
        </button>
      </form>
    </>
  );
}
