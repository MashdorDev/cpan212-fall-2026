# Week 7: Campus Events web app

The Week 6 app, now backed by the Express API in `../api`. Start the API first (see the week README).

```bash
npm install
cp .env.example .env
npm run dev
```

## What changed since Week 6

| File | Change |
|---|---|
| `lib/events.js` | `getEvents()` and `getEventById()` call the API with `fetch`, check `res.ok`, and time out after 5 seconds. The pages that call them did not change. |
| `next.config.mjs` | Rewrites `/api/:path*` to `${API_ORIGIN}/api/:path*` |
| `app/events/new/page.js` | New. A Client Component form that POSTs JSON to `/api/events`, shows the API's validation messages next to each field, and goes to the new event's page on success. |
| `components/SavedEventsProvider.js` | New. React Context that holds saved event ids in state and stores them in `localStorage`. |
| `components/SaveButton.js` | Reads and changes the saved ids through `useSavedEvents()` instead of its own `useState` |
| `app/layout.js` | Wraps every page in `SavedEventsProvider`, and the nav links to New event and Saved |
| `app/saved/page.js` | New. Fetches events in the browser and shows the saved ones, with loading, error and empty states. |
| `app/events/error.js` | Shows a friendly message. In production, Server Component errors reach the browser without their real text, so the details are only in the Next.js terminal. |

## Pages

| URL | Rendered | Data |
|---|---|---|
| `/` | Server, static | none |
| `/events` | Server, on every request | `GET /api/events` from the Next.js server |
| `/events/:id` | Server, on every request | `GET /api/events/:id`, 404 page when the API says 404 |
| `/events/new` | Client | `POST /api/events` from the browser, through the rewrite |
| `/saved` | Client | `GET /api/events` from the browser, filtered by the ids in Context |

## Environment variables

| Name | Default | Purpose |
|---|---|---|
| `API_ORIGIN` | `http://localhost:4000` | Where the Express API runs |
