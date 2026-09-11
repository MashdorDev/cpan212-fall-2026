// Shown right away while page.js in this folder waits for the API.
// It lives in the (list) group so it only wraps the list page. A folder name in parentheses
// groups files without adding to the URL, so this page is still /events.
// If it also wrapped /events/[id], Next.js would start sending that page before it knew whether
// the event exists, and a missing event would get status 200 instead of 404.
export default function Loading() {
  return <p role="status">Loading events...</p>;
}
