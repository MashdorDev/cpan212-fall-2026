# Week 10: Campus Events API with pages, RSVPs and indexes

The Week 9 API plus pages, sorting, a date filter, indexes and RSVPs. The week README (`../README.md`) lists every query parameter.

## Run it

```bash
npm install
cp .env.example .env
# edit .env and set MONGODB_URI
npm run seed
npm run dev
```

`npm run seed` creates the indexes, empties the events and RSVPs, and inserts eight events and five RSVPs.

## Try it

Open these in the browser:

- http://localhost:4000/api/events?limit=3&page=2 (3 events, `"totalPages": 3`)
- http://localhost:4000/api/events?sort=-title (Z to A)
- http://localhost:4000/api/events?from=2026-11-01 (2 events)
- http://localhost:4000/api/events?sort=password (400)

Copy one `"id"` from http://localhost:4000/api/events and use it in place of `ID`:

```bash
curl -i -X POST http://localhost:4000/api/events/ID/rsvps -H "Content-Type: application/json" -d '{"name":"Sam Lee","email":"sam@example.com"}'
curl -i -X POST http://localhost:4000/api/events/ID/rsvps -H "Content-Type: application/json" -d '{"name":"Sam Lee","email":"SAM@example.com"}'
curl -i -X POST http://localhost:4000/api/events/ID/rsvps -H "Content-Type: application/json" -d '{"name":"S","email":"nope"}'
curl http://localhost:4000/api/events/ID/rsvps
```

You should see 201, then 409 (the email is saved in lowercase, so it's the same person), then 400 with a message for `name` and `email`, then the list with each `event` filled in.

To see "This event is full", make the event small first:

```bash
curl -X PATCH http://localhost:4000/api/events/ID -H "Content-Type: application/json" -d '{"capacity":1}'
```

## Routes

| Method | Path | Success | Errors |
|---|---|---|---|
| GET | `/api/health` | 200 `{ "status": "ok" }` | |
| GET | `/api/events?category=&q=&from=&sort=&page=&limit=` | 200 `{ data, page, limit, total, totalPages }` | 400 |
| GET | `/api/events/:id` | 200 `{ "data": event }` with `rsvpCount` | 404 |
| POST | `/api/events` | 201 `{ "data": event }` and a `Location` header | 400 |
| PATCH | `/api/events/:id` | 200 `{ "data": event }` | 400, 404 |
| DELETE | `/api/events/:id` | 204, also deletes the event's RSVPs | 404 |
| GET | `/api/events/:id/holiday-check` | 200 | 404, 502, 504 |
| POST | `/api/events/:id/rsvps` | 201 `{ "data": rsvp }` | 400, 404, 409 |
| GET | `/api/events/:id/rsvps` | 200 `{ "data": [rsvp, ...] }` | 404 |

## Environment variables

| Name | Example | Purpose |
|---|---|---|
| `PORT` | `4000` | Port the server listens on |
| `MONGODB_URI` | `mongodb://127.0.0.1:27017/campus_events` | **Required.** Where the database is. |
| `HOLIDAY_API_BASE_URL` | `https://date.nager.at/api/v3` | Base URL of the holiday API |
