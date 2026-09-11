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

// Returns the API's whole list response: { data, page, limit, total, totalPages }.
// Empty options are left out, so getEvents({ category: '' }) asks for every category.
export async function getEvents({ category, sort, page, limit } = {}) {
  const params = new URLSearchParams();
  for (const [name, value] of Object.entries({ category, sort, page, limit })) {
    if (value) {
      params.set(name, value);
    }
  }
  const res = await fetchFromApi(`/api/events?${params}`);
  if (!res.ok) {
    // Read the body before giving up, for the same reason as in getEventById below.
    await res.text();
    throw new Error(`The API answered ${res.status} when loading events`);
  }
  return res.json();
}

// Returns null when the API says the event doesn't exist, so the page can call notFound().
export async function getEventById(id) {
  const res = await fetchFromApi(`/api/events/${encodeURIComponent(id)}`);
  if (!res.ok) {
    // Read the error body even though it isn't used. fetch keeps the connection busy until the body has been read,
    // so unread error responses slowly use up connections.
    await res.text();
    if (res.status === 404) {
      return null;
    }
    throw new Error(`The API answered ${res.status} when loading event ${id}`);
  }
  const body = await res.json();
  return body.data;
}
