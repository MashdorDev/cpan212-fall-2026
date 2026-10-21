'use client';

// TODO STEP 5a: use the shared saved list.
// Why: right now each button remembers "saved" on its own, so it forgets when you change pages,
// and the /saved page never sees it. SavedEventsProvider keeps one list for the whole app.
// Replace the useState import below with:
//
//   import { useSavedEvents } from './SavedEventsProvider';
import { useState } from 'react';
import styles from './SaveButton.module.css';

export default function SaveButton({ eventId }) {
  // TODO STEP 5b: read and change the shared list instead of local state.
  // Replace the 5 lines below (from const [saved... to the closing } of handleClick) with:
  //
  //   const savedEvents = useSavedEvents();
  //   const saved = savedEvents.isSaved(eventId);
  //
  //   function handleClick() {
  //     savedEvents.toggleSaved(eventId);
  //   }
  //
  // Check: save two events, then open http://localhost:3000/saved. Both are listed.
  // Reload the page: they're still saved.
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
