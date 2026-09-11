# Week 10: Mongoose queries, relationships and indexes

The Week 9 app with the list endpoint grown into something that works for more than eight events: pagination, sorting, a date filter and indexes. Events also get RSVPs, a second model that references the first, and the web app gets page links, sort links and an RSVP form.

| Folder | What it is |
|---|---|
| `api/` | The Express API (port 4000) with pagination, sorting, `?from=`, indexes and RSVP routes |
| `web/` | The Next.js app (port 3000) with filters and pages driven by the URL, and an RSVP form on each event |

## Run both (two terminals)

Terminal 1, the API:

```bash
cd api
npm install
cp .env.example .env
# set MONGODB_URI in .env
npm run seed
npm run dev
```

The seed now inserts the eight events and five RSVPs, and makes sure the indexes exist. Run it again after pulling this week's code, so the unique RSVP index is there before you test duplicates.

Terminal 2, the Next.js app:

```bash
cd web
npm install
cp .env.example .env
npm run dev
```

## Environment variables

Same as Week 9:

| Folder | Name | Example | Purpose |
|---|---|---|---|
| `api` | `PORT` | `4000` | Port the API listens on |
| `api` | `MONGODB_URI` | `mongodb://127.0.0.1:27017/campus_events` | **Required.** Where the database is. |
| `api` | `HOLIDAY_API_BASE_URL` | `https://date.nager.at/api/v3` | Base URL of the holiday API |
| `web` | `API_ORIGIN` | `http://localhost:4000` | Where the API runs |

## The list endpoint

`GET /api/events` now answers with one page and the numbers needed to show page links:

```json
{
  "data": [ { "id": "...", "title": "Career fair prep workshop", "...": "..." } ],
  "page": 2,
  "limit": 3,
  "total": 8,
  "totalPages": 3
}
```

| Parameter | Default | Rules |
|---|---|---|
| `page` | `1` | Whole number, 1 or more. A page past the end returns `data: []`, not an error. |
| `limit` | `10` | Whole number from 1 to 50 |
| `sort` | `startsAt` | `startsAt`, `title` or `createdAt`. Put `-` in front to reverse, for example `-startsAt`. Anything else is a 400. |
| `category` | all | One of `academic`, `social`, `sports`, `career`, `arts` |
| `q` | none | Case-insensitive search in titles |
| `from` | none | Only events starting at or after this date, for example `2026-11-01` or `2026-11-01T18:00:00-04:00` |

Every wrong parameter is listed in one 400 response, for example `GET /api/events?limit=500&sort=password`:

```json
{ "error": { "message": "Invalid query", "details": { "sort": "Must be one of: startsAt, title, createdAt. ...", "limit": "Must be a whole number from 1 to 50" } } }
```

## RSVPs

| Method | Path | Success | Errors |
|---|---|---|---|
| POST | `/api/events/:id/rsvps` | 201 `{ "data": rsvp }` | 400 bad name or email, 404 no such event, 409 email already registered, 409 event full |
| GET | `/api/events/:id/rsvps` | 200 `{ "data": [rsvp, ...] }` with each `event` populated as `{ id, title, startsAt }` | 404 |
| GET | `/api/events/:id` | 200, the event now includes `rsvpCount` | 404 |

`GET /api/events/:id/rsvps` is open to anyone this week, so anyone can read every attendee's email address. That is a real privacy problem (OWASP calls it Broken Access Control). Week 11 adds logins and lets only the event's organizer see the list.

## What changed since Week 9

API:

| File | Change |
|---|---|
| `api/src/utils/event-list-query.js` | New. Reads and checks `category`, `q`, `from`, `sort`, `page` and `limit`, with an allowlist of sort fields and `mongoose.trusted()` for the date filter |
| `api/src/controllers/events.controller.js` | `listEvents` runs `find().sort().skip().limit()` and `countDocuments()` together with `Promise.all`. `getEvent` adds `rsvpCount`. Deleting an event deletes its RSVPs. |
| `api/src/models/Event.js` | Three indexes, with a comment explaining each one and why the title index is not a text index |
| `api/src/models/Rsvp.js` | New. `event` references `Event`, email is stored lowercase, and a unique compound index on `{ event, email }` |
| `api/src/models/to-json.js` | New. The `toJSON` options shared by both models |
| `api/src/controllers/rsvps.controller.js` | New. Create (validate, check for an existing RSVP, check capacity, save, turn duplicate key error 11000 into 409) and list with `populate` |
| `api/scripts/seed.js` | Syncs indexes, and inserts RSVPs using the new event ids |
| `api/examples/injection-demo.js` | New. The same query with `sanitizeFilter` off and on |

Web:

| File | Change |
|---|---|
| `web/app/events/(list)/page.js` | Awaits `searchParams`, reads the category, sort and page from the URL, and asks the API for one page |
| `web/lib/list-options.js` | New. The sort choices, the page size, reading search params safely, and building `/events?...` links |
| `web/components/EventFilters.js`, `Pagination.js` | New. Server Components made of links. `CategoryFilter.js` (client-side filtering) is gone. |
| `web/components/RsvpForm.js` | New. A Client Component that posts an RSVP and shows the 201, 400 or 409 answer, then calls `router.refresh()` so the count updates |
| `web/app/events/[id]/page.js` | Shows spots taken out of capacity, and the RSVP form |
| `web/app/saved/page.js` | Loads each saved event by id with `Promise.all`, because the list endpoint only returns one page now |
| `web/components/SavedEventsProvider.js` | Adds `loaded`, so the Saved page waits for localStorage before deciding nothing is saved |

## Things to notice

- **Sort allowlist.** `?sort=` is checked against three field names before it reaches `.sort()`. Without the list, a client could sort on any field, including ones with no index.
- **The `_id` tie-breaker.** The API sorts by the chosen field and then by `_id`. Two events at the same time would otherwise come back in any order, and one could appear on two pages. Because the sort includes `_id`, the indexes end in `_id` too: MongoDB only uses an index for a sort when the fields match.
- **Seeing an index at work.** In mongosh, compare `db.events.find({ category: 'arts' }).sort({ startsAt: 1, _id: 1 }).explain('executionStats')` before and after the indexes exist: `COLLSCAN` reads every document, `IXSCAN` reads only the matching index entries.
- **`sanitizeFilter` and your own operators.** The date filter needs `$gte`, and `sanitizeFilter` would neutralize it like an attacker's `$ne`. `mongoose.trusted()` marks that one object as built by the code.
- **Duplicates are stopped by the database.** The controller checks with `Rsvp.exists()` first, so the usual duplicate gets a clear 409 before the capacity check. The unique index is the real guarantee: if two requests for the same email arrive at the same moment and both pass `exists()`, the second insert fails with error code 11000, which also becomes a 409. The capacity check has no such guarantee: see the comment in `rsvps.controller.js`.
- **`populate`** runs a second query. Look at `GET /api/events/:id/rsvps`: each RSVP's `event` is an object with `id`, `title` and `startsAt` instead of an id string.
- **URL state in Next.js.** The list page has no `useState`. The category, sort and page are in the URL, so Back and Forward work and a filtered page can be shared.

## Examples

```bash
cd api
npm run seed
node --env-file=.env examples/injection-demo.js
```

Sends `{ "email": { "$ne": null } }` as a filter. With `sanitizeFilter` off, the query returns every RSVP and every email. With it on, Mongoose rejects the query with a CastError.
