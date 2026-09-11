# Week 10: Campus Events API with queries, RSVPs and indexes

The Week 9 API plus pagination, sorting, a date filter, indexes and RSVPs. See the week README (`../README.md`) for the query parameters and the full list of changes.

## Run it

```bash
npm install
cp .env.example .env
# set MONGODB_URI in .env
npm run seed
npm run dev
```

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Starts the API and restarts it when you save a file |
| `npm start` | Starts the API once |
| `npm run seed` | Syncs indexes, deletes all events and RSVPs, inserts eight events and five RSVPs |
| `node --env-file=.env examples/native-driver.js` | Insert and find with the `mongodb` driver (from Week 9) |
| `node --env-file=.env examples/injection-demo.js` | Why `sanitizeFilter` is on |

## Routes

| Method | Path | Success | Errors |
|---|---|---|---|
| GET | `/api/health` | 200 `{ "status": "ok" }` | |
| GET | `/api/events?category=&q=&from=&sort=&page=&limit=` | 200 `{ data, page, limit, total, totalPages }` | 400 |
| GET | `/api/events/:id` | 200 `{ "data": event }` with `rsvpCount` | 404 |
| POST | `/api/events` | 201 `{ "data": event }` and a `Location` header | 400 |
| PATCH | `/api/events/:id` | 200 `{ "data": event }` | 400, 404 |
| DELETE | `/api/events/:id` | 204, also deletes the event's RSVPs | 404 |
| GET | `/api/events/:id/holiday-check` | 200 | 404, 502 holiday service failed, 504 holiday service timed out |
| POST | `/api/events/:id/rsvps` | 201 `{ "data": rsvp }` | 400, 404, 409 |
| GET | `/api/events/:id/rsvps` | 200 `{ "data": [rsvp, ...] }` with `event` populated | 404 |

Admin pages (HTML) are unchanged: `GET /admin/events`, `GET /admin/events/new`, `POST /admin/events`, `POST /admin/events/:id/delete`.

## Files to look at

| File | What it shows |
|---|---|
| `src/utils/event-list-query.js` | Checking query parameters, the sort allowlist, `mongoose.trusted()` |
| `src/controllers/events.controller.js` | `skip()`, `limit()`, `countDocuments()` and `Promise.all` |
| `src/models/Event.js` | `schema.index()` and why each index exists |
| `src/models/Rsvp.js` | `ref`, `lowercase`, and a unique compound index |
| `src/controllers/rsvps.controller.js` | 409 for a full event and for duplicate key error 11000, `populate()` |
| `examples/injection-demo.js` | The `{ "$ne": null }` attack with and without `sanitizeFilter` |

The `bruno/` collection covers every route. Run "List events" first. The RSVP requests create a small event with a capacity of 2, fill it, and delete it at the end.
