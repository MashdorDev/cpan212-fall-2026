# Week 10: Mongoose queries, RSVPs and indexes

The Week 9 app, grown so it still works with hundreds of events. The list comes one page at a time and can be sorted and filtered by date, the database gets indexes, and events get RSVPs: a second model that points at the first.

This is the **finished** version. In class, open [`../week10-mongoose-queries-codealong`](../week10-mongoose-queries-codealong) instead.

| Folder | What it is |
|---|---|
| `api/` | The Express API (port 4000) with pages, sorting, `?from=`, indexes and RSVP routes |
| `web/` | The Next.js app (port 3000) with category and sort links, Previous and Next links, and an RSVP form on each event |
| `diagrams/` | How `?page=` and `?limit=` become `skip()` and `limit()` |

## Run both (two terminals)

You need the same `MONGODB_URI` as in Week 9 (see [`../week09-mongodb/docs/atlas-setup.md`](../week09-mongodb/docs/atlas-setup.md)).

Terminal 1, the API:

```bash
cd api
npm install
cp .env.example .env
# edit .env and set MONGODB_URI
npm run seed
npm run dev
```

The seed now inserts eight events and five RSVPs, and creates the indexes.

Terminal 2, the Next.js app:

```bash
cd web
npm install
cp .env.example .env
npm run dev
```

Open http://localhost:3000/events.

## The list endpoint

`GET /api/events?page=2&limit=3` answers with one page, and the numbers the web app needs for its page links:

```json
{
  "data": [{ "id": "...", "title": "Resume review drop-in" }],
  "page": 2,
  "limit": 3,
  "total": 8,
  "totalPages": 3
}
```

| Parameter | Default | Rules |
|---|---|---|
| `page` | `1` | A whole number, 1 or more. A page past the end gives `data: []`, not an error. |
| `limit` | `10` | A whole number from 1 to 50 |
| `sort` | `startsAt` | `startsAt`, `title` or `createdAt`. A `-` in front reverses it: `-startsAt` is latest first. |
| `category` | all | One of `academic`, `social`, `sports`, `career`, `arts` |
| `q` | none | Search in titles, upper or lower case |
| `from` | none | Only events that start on or after this date, like `2026-11-01` |

A wrong parameter answers 400 and says which one, for example `GET /api/events?sort=password`:

```json
{ "error": { "message": "Invalid query", "details": { "sort": "Must be one of: startsAt, title, createdAt. Put - in front to reverse, like -startsAt" } } }
```

## RSVPs

| Method | Path | Success | Errors |
|---|---|---|---|
| POST | `/api/events/:id/rsvps` | 201 `{ "data": rsvp }` | 400 bad name or email, 404 no such event, 409 already registered, 409 event full |
| GET | `/api/events/:id/rsvps` | 200 `{ "data": [rsvp, ...] }`, each `event` filled in with its title and start time | 404 |
| GET | `/api/events/:id` | 200, the event now has `rsvpCount` | 404 |

Anyone can call `GET /api/events/:id/rsvps` this week, so anyone can read every attendee's email address. Week 11 adds logins and fixes that.

## What changed since Week 9

| File | Change |
|---|---|
| `api/src/controllers/events.controller.js` | `listEvents` reads `page`, `limit`, `sort` and `from`, and runs `find().sort().skip().limit()` and `countDocuments()`. `getEvent` adds `rsvpCount`. `deleteEvent` deletes the event's RSVPs. |
| `api/src/models/Event.js` | Three indexes, one for each kind of list query |
| `api/src/models/Rsvp.js` | New. `event` points at an Event with `ref`, the email is saved in lowercase, and a unique index allows one RSVP per email per event |
| `api/src/controllers/rsvps.controller.js` | New. Create an RSVP (400, 404, 409) and list them with `populate()` |
| `api/src/routes/events.routes.js` | The two RSVP routes |
| `api/scripts/seed.js` | Creates the indexes and inserts five RSVPs |
| `api/examples/injection-demo.js` | New. Why `sanitizeFilter` is on |
| `web/app/events/(list)/page.js` | Reads the category, sort and page from the URL and asks the API for one page |
| `web/lib/list-options.js` | New. The page size, the sort choices, reading the URL and building `/events?...` links |
| `web/components/EventFilters.js`, `Pagination.js` | New. Links instead of buttons. `CategoryFilter.js` is gone. |
| `web/components/RsvpForm.js` | New. Posts an RSVP and shows the 201, 400 or 409 answer |
| `web/app/events/[id]/page.js` | Shows spots taken and the RSVP form |
| `web/app/saved/page.js` | Loads each saved event by its id, because the list only sends one page now |

## Things to notice

- **`_id` breaks ties in the sort.** Two events at the same time could come back in either order, and one could show up on two pages. That's also why every index ends in `_id`.
- **See an index at work.** In Compass, open `events`, then the Explain Plan tab, and run the filter `{ category: 'arts' }` with the sort `{ startsAt: 1, _id: 1 }`. It says `IXSCAN` (used an index). Drop the index in the Indexes tab and run it again: `COLLSCAN` (read every event). Run `npm run seed` to get the index back.
- **`mongoose.trusted()`.** `sanitizeFilter` turns every `$` operator into plain text, to stop attacks. The `?from=` filter needs `$gte`, so it marks that one object as ours.
- **The database stops duplicates.** The controller checks for an existing RSVP first so the usual case gets a clear 409. The unique index is the real guarantee: two requests at the same moment can both pass the check, and the second save fails with error code 11000, which also becomes a 409.
- **`populate()` runs a second query.** In `GET /api/events/:id/rsvps`, each RSVP's `event` is an object with `id`, `title` and `startsAt` instead of an id.

## The injection demo

```bash
cd api
npm run seed
node --env-file=.env examples/injection-demo.js
```

It sends `{ "email": { "$ne": null } }` as a filter. With `sanitizeFilter` off you get every RSVP and every email. With it on, Mongoose stops the query.
