import { randomUUID } from 'node:crypto';

// Kept in memory, so notices disappear when the server restarts. Their photos
// stay in uploads/ until you delete them.
const notices = [];

export function listNotices() {
  return notices;
}

export function addNotice(fields) {
  const notice = { id: randomUUID(), ...fields, createdAt: new Date().toISOString() };
  // unshift puts the newest notice first, which is the order the list page shows.
  notices.unshift(notice);
  return notice;
}

// Returns the removed notice, or null when no notice has that id.
export function removeNotice(id) {
  const index = notices.findIndex((notice) => notice.id === id);
  if (index === -1) {
    return null;
  }
  return notices.splice(index, 1)[0];
}
