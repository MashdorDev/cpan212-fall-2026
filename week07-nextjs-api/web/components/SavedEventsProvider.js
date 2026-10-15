'use client';

import { createContext, useContext, useEffect, useState } from 'react';

// The name the saved ids are stored under in localStorage.
const STORAGE_KEY = 'campus-events:saved-ids';

// A Context is a box of values that any component inside the provider can read.
const SavedEventsContext = createContext(null);

// Holds the saved event ids for the whole app, so every Save button and the /saved page agree.
export function SavedEventsProvider({ children }) {
  const [savedIds, setSavedIds] = useState([]);

  // localStorage only exists in the browser, so read it in an effect.
  // The empty [] means: run once, after the page shows up in the browser.
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      // The lint rule warns about setting state in an effect. Here we want the second render.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSavedIds(JSON.parse(stored));
    }
  }, []);

  function isSaved(eventId) {
    return savedIds.includes(eventId);
  }

  function toggleSaved(eventId) {
    let nextIds;
    if (savedIds.includes(eventId)) {
      // Already saved: take it out.
      nextIds = savedIds.filter((id) => id !== eventId);
    } else {
      // Not saved yet: add it to the end.
      nextIds = savedIds.concat(eventId);
    }

    setSavedIds(nextIds);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nextIds));
  }

  // Everything the components inside can use.
  const value = {
    savedIds: savedIds,
    isSaved: isSaved,
    toggleSaved: toggleSaved,
  };

  return <SavedEventsContext value={value}>{children}</SavedEventsContext>;
}

// Any component inside the provider calls this to get savedIds, isSaved and toggleSaved.
export function useSavedEvents() {
  return useContext(SavedEventsContext);
}
