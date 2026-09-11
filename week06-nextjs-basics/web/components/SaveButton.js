'use client';

import { useState } from 'react';
import styles from './SaveButton.module.css';

// Each SaveButton has its own state. When its card is filtered out, or you open another page,
// the button is removed from the screen and its state is lost. Week 7 moves this state into Context.
export default function SaveButton() {
  const [saved, setSaved] = useState(false);

  return (
    <button type="button" className={styles.button} aria-pressed={saved} onClick={() => setSaved(!saved)}>
      {saved ? 'Saved' : 'Save'}
    </button>
  );
}
