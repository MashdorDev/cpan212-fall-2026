'use client';

// TODO (you): STEP 5a - replace this comment and the import below it with the import for useSavedEvents.
import { useState } from 'react';
import styles from './SaveButton.module.css';

export default function SaveButton({ eventId }) {
  // TODO (you): STEP 5b - replace this comment and the 5 lines below it: read saved from SavedEventsProvider.
  const [saved, setSaved] = useState(false);

  function handleClick() {
    setSaved(!saved);
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
