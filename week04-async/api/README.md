# Week 4: Campus Events API with a third-party call

The Week 3 API plus `GET /api/events/:id/holiday-check`, which tells you whether an event falls on a Canadian public holiday. The holiday data comes from [Nager.Date](https://date.nager.at), a free API with no key.

## Run it

```bash
npm install
cp .env.example .env
npm run dev
```

Open the `bruno/` folder in Bruno and pick the `Local` environment.

## How the holiday check works

`src/services/holidays.service.js` does the third-party work:

1. Look in an in-memory `Map` for that year's holidays. If they are there and less than 12 hours old, use them and log `Holiday cache hit`.
2. Otherwise call `https://date.nager.at/api/v3/PublicHolidays/{year}/CA` with `AbortSignal.timeout(5000)`, check `res.ok`, and store the result with an expiry time.
3. If the call times out, can't connect, or gets a non-2xx answer, throw an `HttpError` with status 502 (Bad Gateway). The error handler sends it as JSON.

`src/controllers/holidays.controller.js` finds the event, works out its date in Toronto time, and compares it with the holiday list. Try it twice in a row: the first call takes a few hundred milliseconds, the second takes about 1 ms and the terminal shows the cache hit.

Example response:

```json
{
  "data": {
    "eventId": "51b21140-5d42-4c7e-bbd4-6d831ff17438",
    "date": "2026-10-12",
    "isHoliday": true,
    "holidays": [{ "name": "Thanksgiving", "nationwide": true, "regions": [] }]
  }
}
```

`regions` lists province and territory codes (like `CA-NS`) for holidays that only apply in some places.

## Routes

| Method | Path | Success | Errors |
|---|---|---|---|
| GET | `/api/health` | 200 `{ "status": "ok" }` | |
| GET | `/api/events?category=&q=` | 200 `{ "data": [...] }` | 400 unknown category |
| GET | `/api/events/:id` | 200 `{ "data": event }` | 404 |
| POST | `/api/events` | 201 `{ "data": event }` | 400 |
| PATCH | `/api/events/:id` | 200 `{ "data": event }` | 400, 404 |
| DELETE | `/api/events/:id` | 204, empty body | 404 |
| GET | `/api/events/:id/holiday-check` | 200 `{ "data": { ... } }` | 404, 502 holiday service failed |

## Environment variables

| Name | Default | Purpose |
|---|---|---|
| `PORT` | `4000` | Port the server listens on |
| `HOLIDAY_API_BASE_URL` | `https://date.nager.at/api/v3` | Base URL of the holiday API. Point it at a wrong address to see the 502 error. |
