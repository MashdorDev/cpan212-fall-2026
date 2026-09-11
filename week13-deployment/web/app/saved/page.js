'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import EventCard from '@/components/EventCard';
import { useSavedEvents } from '@/components/SavedEventsProvider';
import styles from './page.module.css';

// The saved ids only exist in this browser (localStorage), so this page is a Client Component
// and loads the events from the browser, through the /api rewrite.
export default function SavedPage() {
  const { savedIds, loaded } = useSavedEvents();
  const [events, setEvents] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!loaded) {
      return;
    }
    // Set when savedIds changes before the requests below finish, so an old answer doesn't overwrite a newer one.
    let ignore = false;

    // GET /api/events only returns one page now, so a saved event could be on any page.
    // Ask for each saved event by id instead, all at the same time.
    async function loadEvents() {
      try {
        const results = await Promise.all(
          savedIds.map(async (id) => {
            const res = await fetch(`/api/events/${encodeURIComponent(id)}`);
            if (!res.ok) {
              // Read the error body even though it isn't used. Chrome can keep an unread response open.
              await res.text();
              // 404: the event was deleted since it was saved, or the id is a UUID saved before Week 9.
              if (res.status === 404) {
                return null;
              }
              throw new Error(`The API answered ${res.status}`);
            }
            const body = await res.json();
            return body.data;
          }),
        );
        if (!ignore) {
          setEvents(results.filter((event) => event !== null));
        }
      } catch (err) {
        if (!ignore) {
          setError(err.message);
        }
      }
    }
    loadEvents();

    return () => {
      ignore = true;
    };
  }, [savedIds, loaded]);

  if (error) {
    return (
      <>
        <h1>Saved events</h1>
        <p role="alert">Could not load your saved events. {error}</p>
      </>
    );
  }

  if (events === null) {
    return (
      <>
        <h1>Saved events</h1>
        <p role="status">Loading saved events...</p>
      </>
    );
  }

  return (
    <>
      <h1>Saved events</h1>
      {events.length === 0 ? (
        <p>
          Nothing saved yet. Press Save on any event in the <Link href="/events">events list</Link>.
        </p>
      ) : (
        <ul className={styles.list}>
          {events.map((event) => (
            <li key={event.id}>
              <EventCard event={event} />
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
