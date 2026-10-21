// TODO STEP 1a: where the API runs.
// Why: the server needs the API's address. It comes from web/.env, with a default for when it's missing.
// Delete these TODO lines and type:
//
//   let API_ORIGIN = process.env.API_ORIGIN;
//   if (!API_ORIGIN) {
//     API_ORIGIN = 'http://localhost:4000';
//   }

// Loads every event from the API. Only Server Components call this, so it runs on the Next.js server.
// TODO STEP 1b: load the events.
// Why: right now this returns [], so /events says "Showing 0 of 0 events".
// Replace the 3 lines of getEvents() below with:
//
//   export async function getEvents() {
//     const res = await fetch(API_ORIGIN + '/api/events', { cache: 'no-store' });
//     if (!res.ok) {
//       throw new Error('The API answered ' + res.status + ' when loading events');
//     }
//     const body = await res.json();
//     return body.data;
//   }
//
// Check: refresh http://localhost:3000/events. It says "Showing 8 of 8 events".
export async function getEvents() {
  return [];
}

// Loads one event. Returns null when the API says it does not exist, so the page can show the 404 page.
// TODO STEP 2: load one event.
// Why: clicking an event shows "not found" because this always returns null.
// Replace the 3 lines of getEventById() below with:
//
//   export async function getEventById(id) {
//     const res = await fetch(API_ORIGIN + '/api/events/' + id, { cache: 'no-store' });
//     if (res.status === 404) {
//       return null;
//     }
//     if (!res.ok) {
//       throw new Error('The API answered ' + res.status + ' when loading event ' + id);
//     }
//     const body = await res.json();
//     return body.data;
//   }
//
// Check: click any event. Its page opens. Then change the id in the address bar: you get the 404 page.
export async function getEventById(id) {
  return null;
}
