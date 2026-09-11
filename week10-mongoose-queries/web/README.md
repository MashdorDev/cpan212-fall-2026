# Week 10: Campus Events web app

The Week 9 app with URL-driven filters and pages on the events list, and an RSVP form on each event. Start the API first (see the week README).

```bash
npm install
cp .env.example .env
npm run dev
```

## What changed since Week 9

| File | Change |
|---|---|
| `app/events/(list)/page.js` | Reads `category`, `sort` and `page` from `await searchParams` and asks the API for 6 events at a time |
| `lib/list-options.js` | New. Sort choices, page size, `readListOptions()` (ignores values the API would reject) and `eventsHref()` (builds links) |
| `lib/events.js` | `getEvents()` takes `{ category, sort, page, limit }` and returns the whole response, including `total` and `totalPages` |
| `components/EventFilters.js` | New. Category and sort links. Picking one goes back to page 1. |
| `components/Pagination.js` | New. Previous and Next links that keep the category and sort |
| `components/CategoryFilter.js` | Removed. Filtering in the browser only worked while every event came back in one response. |
| `components/RsvpForm.js` | New. Client Component form: `POST /api/events/:id/rsvps`, shows the API's message and status code, `router.refresh()` after a 201 |
| `app/events/[id]/page.js` | Shows "3 of 120 taken" and the RSVP form |
| `app/saved/page.js` | Fetches each saved id from `/api/events/:id` with `Promise.all`, skipping ids that return 404 |
| `components/SavedEventsProvider.js` | Adds `loaded` so the Saved page knows when localStorage has been read |

## Pages

| URL | Rendered | Data |
|---|---|---|
| `/` | Server, static | none |
| `/events?category=&sort=&page=` | Server, on every request | `GET /api/events?...&limit=6` from the Next.js server |
| `/events/:id` | Server, on every request | `GET /api/events/:id`, 404 page when the API says 404 |
| `/events/new` | Client | `POST /api/events` from the browser, through the rewrite |
| `/saved` | Client | `GET /api/events/:id` for each saved id, from the browser |

Try `/events?category=arts&sort=title`, then press Back: the previous list comes back, because the filters are part of the URL. A hand-edited URL such as `/events?sort=nonsense&page=abc` shows the default list instead of an error.

## Environment variables

| Name | Default | Purpose |
|---|---|---|
| `API_ORIGIN` | `http://localhost:4000` | Where the Express API runs |
