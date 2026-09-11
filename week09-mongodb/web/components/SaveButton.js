'use client';

import { useSavedEvents } from './SavedEventsProvider';
import styles from './SaveButton.module.css';

// The saved state now lives in SavedEventsProvider, so it survives filtering, page changes and reloads.
export default function SaveButton({ eventId }) {
  const { isSaved, toggleSaved } = useSavedEvents();
  const saved = isSaved(eventId);

  return (
    <button type="button" className={styles.button} aria-pressed={saved} onClick={() => toggleSaved(eventId)}>
      {saved ? 'Saved' : 'Save'}
    </button>
  );
}
