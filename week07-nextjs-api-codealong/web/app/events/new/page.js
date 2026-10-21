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

    // TODO STEP 4a: read the form.
    // Why: we need the values as one object to send to the API. The date field is local time,
    // and the API wants UTC, so toISOString() converts it.
    // Delete these TODO lines and type:
    //
    //   const form = new FormData(event.currentTarget);
    //
    //   let startsAt = '';
    //   if (form.get('startsAt')) {
    //     startsAt = new Date(form.get('startsAt')).toISOString();
    //   }
    //
    //   const newEvent = {
    //     title: form.get('title'),
    //     description: form.get('description'),
    //     category: form.get('category'),
    //     location: form.get('location'),
    //     startsAt: startsAt,
    //     capacity: Number(form.get('capacity')),
    //   };

    // TODO STEP 4b: send it to the API.
    // Why: a 201 means it was saved, so go to the new event's page. A 400 means the API rejected it,
    // so show its messages next to the fields. /api/events goes through the rewrite from step 3.
    // Delete these TODO lines and type:
    //
    //   try {
    //     const res = await fetch('/api/events', {
    //       method: 'POST',
    //       headers: { 'Content-Type': 'application/json' },
    //       body: JSON.stringify(newEvent),
    //     });
    //     const body = await res.json();
    //
    //     if (!res.ok) {
    //       if (body.error.details) {
    //         setErrors(body.error.details);
    //       }
    //       setMessage(body.error.message);
    //       return;
    //     }
    //
    //     router.push('/events/' + body.data.id);
    //   } catch (err) {
    //     setMessage('Could not reach the events API. Check that it is running.');
    //   }
    //
    // Check: open http://localhost:3000/events/new and press Create event with the form empty.
    // You see red messages under the fields. Fill it in and press it again: you land on the new event.
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
