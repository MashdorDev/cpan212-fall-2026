'use client';

import EventCard from './EventCard';
import styles from './CategoryFilter.module.css';
import { useState } from 'react';
import { CATEGORIES } from '@/lib/categories';

// The page loads the events on the server and passes them in as a prop.
export default function CategoryFilter({ events }) {
  const [category, setCategory] = useState('all');

  // Work out which events to show from the events and the chosen category.
  let visibleEvents = events;
  if (category !== 'all') {
    visibleEvents = events.filter((event) => event.category === category);
  }

  // One button for "all", then one per category.
  const options = ['all'].concat(CATEGORIES);

  return (
    <section>
      <div className={styles.options} role="group" aria-label="Filter by category">
        {options.map((option) => (
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

      <ul className={styles.grid}>
        {visibleEvents.map((event) => (
          // key tells React which card is which when the list changes.
          <li key={event.id}>
            <EventCard event={event} />
          </li>
        ))}
      </ul>
    </section>
  );
}
