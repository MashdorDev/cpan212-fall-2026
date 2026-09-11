'use client';

import { createContext, useContext, useEffect, useState } from 'react';

const STORAGE_KEY = 'campus-events:saved-ids';

const SavedEventsContext = createContext(null);

// Holds the saved event ids for the whole app. Any component inside the provider can read them
// with useSavedEvents(), so a Save button and the /saved page always agree.
export function SavedEventsProvider({ children }) {
  const [savedIds, setSavedIds] = useState([]);
  // False until the stored ids have been read, so the Saved page can wait instead of flashing "Nothing saved".
  const [loaded, setLoaded] = useState(false);

  // localStorage only exists in the browser. The server renders with an empty list,
  // then this effect loads the stored ids once the page is running in the browser.
  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]');
      if (Array.isArray(stored)) {
        // The lint rule warns that setState in an effect causes a second render. Here that is the point:
        // the first render has to match the server's HTML, and the second one shows the stored ids.
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setSavedIds(stored);
      }
    } catch {
      // The stored value was not valid JSON (edited by hand, or an old format). Start fresh.
      localStorage.removeItem(STORAGE_KEY);
    }
    setLoaded(true);
  }, []);

  function toggleSaved(eventId) {
    const next = savedIds.includes(eventId) ? savedIds.filter((id) => id !== eventId) : [...savedIds, eventId];
    setSavedIds(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }

  const value = {
    savedIds,
    loaded,
    isSaved: (eventId) => savedIds.includes(eventId),
    toggleSaved,
  };

  return <SavedEventsContext value={value}>{children}</SavedEventsContext>;
}

export function useSavedEvents() {
  const context = useContext(SavedEventsContext);
  if (!context) {
    throw new Error('useSavedEvents must be used inside <SavedEventsProvider>');
  }
  return context;
}
