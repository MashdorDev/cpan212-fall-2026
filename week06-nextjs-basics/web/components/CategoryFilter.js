'use client';

import { useState } from 'react';
import EventCard from './EventCard';
import { CATEGORIES } from '@/lib/categories';
import styles from './CategoryFilter.module.css';

// A Client Component: it keeps state and reacts to clicks, so it runs in the browser.
// The server page loads the events once and passes them in; filtering happens here without a new request.
export default function CategoryFilter({ events }) {
  const [category, setCategory] = useState('all');

  const visibleEvents = category === 'all' ? events : events.filter((event) => event.category === category);

  return (
    <section>
      <div className={styles.options} role="group" aria-label="Filter by category">
        {['all', ...CATEGORIES].map((option) => (
          <button
            key={option}
            type="button"
            className={styles.option}
            aria-pressed={option === category}
            onClick={() => setCategory(option)}
          >
            {option}
          </button>
        ))}
      </div>

      <p className={styles.count}>
        Showing {visibleEvents.length} of {events.length} events
      </p>

      {visibleEvents.length === 0 ? (
        <p>No events in this category yet.</p>
      ) : (
        <ul className={styles.grid}>
          {visibleEvents.map((event) => (
            // key tells React which card is which when the list changes.
            <li key={event.id}>
              <EventCard event={event} />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
