// Server Components call the Express API directly, server to server.
// Code in the browser uses /api/... instead, which next.config.mjs forwards to the same API.
const API_ORIGIN = process.env.API_ORIGIN ?? 'http://localhost:4000';

async function fetchFromApi(path) {
  return fetch(`${API_ORIGIN}${path}`, {
    // Ask the API on every request, because events change. This also tells Next.js not to
    // fetch at build time, when the API might not be running.
    cache: 'no-store',
    signal: AbortSignal.timeout(5000),
  });
}

export async function getEvents() {
  const res = await fetchFromApi('/api/events');
  if (!res.ok) {
    throw new Error(`The API answered ${res.status} when loading events`);
  }
  const body = await res.json();
  return body.data;
}

// Returns null when the API says the event doesn't exist, so the page can call notFound().
export async function getEventById(id) {
  const res = await fetchFromApi(`/api/events/${encodeURIComponent(id)}`);
  if (res.status === 404) {
    return null;
  }
  if (!res.ok) {
    throw new Error(`The API answered ${res.status} when loading event ${id}`);
  }
  const body = await res.json();
  return body.data;
}
