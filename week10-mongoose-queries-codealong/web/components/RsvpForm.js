'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './RsvpForm.module.css';

// A Client Component: the form runs in the browser and sends { name, email } to the API.
// It shows what the API answered: 201 you're in, 400 a message per field, 409 already registered or full.
export default function RsvpForm({ eventId }) {
  const router = useRouter();

  // One message per field the API did not accept, for example { email: 'Email is required' }.
  const [errors, setErrors] = useState({});
  // The message above the form, and whether it is good news.
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState(false);

  async function handleSubmit(event) {
    // Stop the browser from reloading the page. We send the data ourselves.
    event.preventDefault();
    setErrors({});
    setMessage('');

    // Keep the form element: we empty it after a successful RSVP.
    const formElement = event.currentTarget;
    const form = new FormData(formElement);

    const rsvp = {
      name: form.get('name'),
      email: form.get('email'),
    };

    try {
      const res = await fetch('/api/events/' + eventId + '/rsvps', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(rsvp),
      });
      const body = await res.json();

      // 400, 404 or 409. Show the API's messages and stay on the form.
      if (!res.ok) {
        if (body.error.details) {
          setErrors(body.error.details);
        }
        setSuccess(false);
        setMessage(body.error.message + ' (HTTP ' + res.status + ')');
        return;
      }

      // 201: saved.
      setSuccess(true);
      setMessage("You're on the list, " + body.data.name + '. (HTTP ' + res.status + ')');
      formElement.reset();
      // Runs the page again on the server, so "spots taken" counts this RSVP.
      router.refresh();
    } catch (err) {
      // The API is not running, or it answered with something that is not JSON.
      setSuccess(false);
      setMessage('Could not reach the events API. Check that it is running.');
    }
  }

  let messageClass = styles.failure;
  if (success) {
    messageClass = styles.success;
  }

  return (
    <section className={styles.rsvp}>
      <h2>RSVP</h2>

      {message && (
        <p className={messageClass} role="status">
          {message}
        </p>
      )}

      {/* noValidate turns off the browser's own checks, so you can see the API's validation errors. */}
      <form className={styles.form} onSubmit={handleSubmit} noValidate>
        <div className={styles.field}>
          <label htmlFor="rsvp-name">Name</label>
          <input id="rsvp-name" name="name" autoComplete="name" />
          {errors.name && <p className={styles.error}>{errors.name}</p>}
        </div>
        <div className={styles.field}>
          <label htmlFor="rsvp-email">Email</label>
          <input id="rsvp-email" name="email" type="email" autoComplete="email" />
          {errors.email && <p className={styles.error}>{errors.email}</p>}
        </div>
        <button className={styles.submit} type="submit">
          RSVP
        </button>
      </form>
    </section>
  );
}
