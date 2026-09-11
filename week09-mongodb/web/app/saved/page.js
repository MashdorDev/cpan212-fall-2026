'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import EventCard from '@/components/EventCard';
import { useSavedEvents } from '@/components/SavedEventsProvider';
import styles from './page.module.css';

// The saved ids only exist in this browser (localStorage), so this page is a Client Component
// and loads the events from the browser, through the /api rewrite.
export default function SavedPage() {
  const { savedIds } = useSavedEvents();
  const [events, setEvents] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadEvents() {
      try {
        const res = await fetch('/api/events');
        if (!res.ok) {
          throw new Error(`The API answered ${res.status}`);
        }
        const body = await res.json();
        setEvents(body.data);
      } catch (err) {
        setError(err.message);
      }
    }
    loadEvents();
  }, []);

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

  // An id can point to an event that was deleted since it was saved, so only show ids the API still has.
  const savedEvents = events.filter((event) => savedIds.includes(event.id));

  return (
    <>
      <h1>Saved events</h1>
      {savedEvents.length === 0 ? (
        <p>
          Nothing saved yet. Press Save on any event in the <Link href="/events">events list</Link>.
        </p>
      ) : (
        <ul className={styles.list}>
          {savedEvents.map((event) => (
            <li key={event.id}>
              <EventCard event={event} />
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
