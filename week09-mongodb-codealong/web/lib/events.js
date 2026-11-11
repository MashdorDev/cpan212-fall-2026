// Where the Express API runs. The value comes from web/.env.
let API_ORIGIN = process.env.API_ORIGIN;
if (!API_ORIGIN) {
  API_ORIGIN = 'http://localhost:4000';
}

// Loads every event from the API. Only Server Components call this, so it runs on the Next.js server.
export async function getEvents() {
  // cache: 'no-store' asks the API again on every visit, because events change.
  const res = await fetch(API_ORIGIN + '/api/events', { cache: 'no-store' });

  // fetch does not throw for a 404 or a 500. Check res.ok to know if it worked.
  if (!res.ok) {
    throw new Error('The API answered ' + res.status + ' when loading events');
  }

  const body = await res.json();
  return body.data;
}

// Loads one event. Returns null when the API says it does not exist, so the page can show the 404 page.
export async function getEventById(id) {
  const res = await fetch(API_ORIGIN + '/api/events/' + id, { cache: 'no-store' });

  if (res.status === 404) {
    return null;
  }

  if (!res.ok) {
    throw new Error('The API answered ' + res.status + ' when loading event ' + id);
  }

  const body = await res.json();
  return body.data;
}
