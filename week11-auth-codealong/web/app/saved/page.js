'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import EventCard from '@/components/EventCard';
import { useSavedEvents } from '@/components/SavedEventsProvider';
import styles from './page.module.css';

// The saved ids only exist in this browser (localStorage), so this page is a Client Component
// and loads the events from the browser, through the /api rewrite.
export default function SavedPage() {
  const savedEvents = useSavedEvents();
  // null means "still loading".
  const [events, setEvents] = useState(null);
  const [error, setError] = useState('');

  // Load the saved events once localStorage has been read (savedEvents.loaded).
  useEffect(() => {
    if (!savedEvents.loaded) {
      return;
    }

    // GET /api/events only sends one page now, so a saved event could be on any page.
    // Ask for each saved event by its id instead, one after the other.
    async function loadEvents() {
      try {
        const loadedEvents = [];
        for (const id of savedEvents.savedIds) {
          const res = await fetch('/api/events/' + id);
          // 404: the event was deleted after it was saved. Skip it.
          if (res.status === 404) {
            continue;
          }
          if (!res.ok) {
            throw new Error('The API answered ' + res.status);
          }
          const body = await res.json();
          loadedEvents.push(body.data);
        }
        setEvents(loadedEvents);
      } catch (err) {
        setError(err.message);
      }
    }
    loadEvents();
    // Only run again when loaded changes. Pressing Unsave on this page hides the card below
    // without loading everything again.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [savedEvents.loaded]);

  // 1. Something went wrong.
  if (error) {
    return (
      <>
        <h1>Saved events</h1>
        <p role="alert">Could not load your saved events. {error}</p>
      </>
    );
  }

  // 2. Still loading.
  if (events === null) {
    return (
      <>
        <h1>Saved events</h1>
        <p role="status">Loading saved events...</p>
      </>
    );
  }

  // Keep only the events whose id is in the saved list.
  const saved = events.filter((event) => savedEvents.isSaved(event.id));

  // 3. Nothing saved yet.
  if (saved.length === 0) {
    return (
      <>
        <h1>Saved events</h1>
        <p>
          Nothing saved yet. Press Save on any event in the <Link href="/events">events list</Link>.
        </p>
      </>
    );
  }

  // 4. Show the saved events.
  return (
    <>
      <h1>Saved events</h1>
      <ul className={styles.list}>
        {saved.map((event) => (
          <li key={event.id}>
            <EventCard event={event} />
          </li>
        ))}
      </ul>
    </>
  );
}
