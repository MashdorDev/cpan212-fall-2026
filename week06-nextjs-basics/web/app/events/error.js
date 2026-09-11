'use client';

import { useEffect } from 'react';

// Error boundaries have to be Client Components, because retry() runs in the browser.
export default function EventsError({ error, retry }) {
  useEffect(() => {
    // In production, an error thrown in a Server Component reaches the browser without its real message,
    // so nothing secret leaks. The full error is printed in the terminal that runs Next.js.
    console.error(error);
  }, [error]);

  return (
    <section role="alert">
      <h1>Something went wrong</h1>
      <p>The events could not be loaded. Try again in a moment.</p>
      <button type="button" onClick={() => retry()}>
        Try again
      </button>
    </section>
  );
}
