'use client';

import { useSavedEvents } from './SavedEventsProvider';
import styles from './SaveButton.module.css';

// The saved ids now live in SavedEventsProvider, not in the button.
// They stay the same when you filter, change pages or reload.
export default function SaveButton({ eventId }) {
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
