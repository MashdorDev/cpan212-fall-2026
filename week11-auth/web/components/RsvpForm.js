'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from './AuthProvider';
import styles from './RsvpForm.module.css';

// RSVPs need a logged-in user, and the API takes the name and email from the session.
// So the form is one button. Visitors who aren't logged in get a link to the login page.
export default function RsvpForm({ eventId }) {
  const router = useRouter();
  const { user, setUser } = useAuth();

  // The message above the button, and whether it is good news.
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState(false);
  // true while the request is on its way, so a double-click doesn't send the RSVP twice.
  const [sending, setSending] = useState(false);

  async function handleSubmit(event) {
    // Stop the browser from reloading the page. We send the request ourselves.
    event.preventDefault();
    setSending(true);
    setMessage('');

    try {
      // No body: the API knows who you are from the session cookie.
      const res = await fetch('/api/events/' + eventId + '/rsvps', { method: 'POST' });
      const body = await res.json();

      if (res.ok) {
        setSuccess(true);
        setMessage("You're on the list. (HTTP " + res.status + ')');
        // Runs the page again on the server, so "spots taken" counts this RSVP.
        router.refresh();
      } else {
        // 401: the session ended since the page loaded. Show the logged-out version.
        if (res.status === 401) {
          setUser(null);
        }
        setSuccess(false);
        setMessage(body.error.message + ' (HTTP ' + res.status + ')');
      }
    } catch (err) {
      // The API is not running, or it answered with something that is not JSON.
      setSuccess(false);
      setMessage('Could not reach the events API. Check that it is running.');
    }
    setSending(false);
  }

  // Still finding out who is logged in.
  if (user === undefined) {
    return null;
  }

  let messageClass = styles.failure;
  if (success) {
    messageClass = styles.success;
  }

  let content;
  if (user === null) {
    content = (
      <p>
        <Link href={'/login?next=/events/' + eventId}>Log in</Link> to RSVP.
      </p>
    );
  } else {
    content = (
      <form className={styles.form} onSubmit={handleSubmit}>
        <p>
          You will be listed as {user.name} ({user.email}).
        </p>
        <button className={styles.submit} type="submit" disabled={sending}>
          RSVP
        </button>
      </form>
    );
  }

  return (
    <section className={styles.rsvp}>
      <h2>RSVP</h2>

      {message && (
        <p className={messageClass} role="status">
          {message}
        </p>
      )}

      {content}
    </section>
  );
}
