'use client';

import { useSavedEvents } from './SavedEventsProvider';
import styles from './SaveButton.module.css';

export default function SaveButton({ eventId }) {
  // The saved ids live in SavedEventsProvider, so they stay the same when you filter, change pages or reload.
  const savedEvents = useSavedEvents();
  const saved = savedEvents.isSaved(eventId);

  // React calls this when the button is clicked.
  function handleClick() {
    savedEvents.toggleSaved(eventId);
  }

  let label = 'Save';
  if (saved) {
    label = 'Saved';
  }

  return (
    <button type="button" className={styles.button} aria-pressed={saved} onClick={handleClick}>
      {label}
    </button>
  );
}
