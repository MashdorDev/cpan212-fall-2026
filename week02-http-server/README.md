# Week 2: Campus Events with node:http

The Campus Events API built with Node's own `node:http` module. There is no Express and no dependency to install, so every part of a request and response is visible in `src/server.js`.

## Run it

```bash
cp .env.example .env
npm run dev
```

Open http://localhost:4000 for the events page, or send requests from the `bruno/` collection (open the folder in Bruno and pick the `Local` environment).

## Files

- `src/server.js` creates the server, matches each request to a route and sends JSON.
- `src/data/events.js` holds the events in memory. Restarting the server resets them.
- `src/validators/event.js` checks the body of `POST /api/events`.
- `public/index.html` is the page served at `/`. It calls `/api/events` with `fetch`.

## Routes

| Method | Path | Success | Errors |
|---|---|---|---|
| GET | `/` | 200 HTML page | |
| GET | `/api/health` | 200 `{ "status": "ok" }` | |
| GET | `/api/events?category=&q=` | 200 `{ "data": [...] }` | 400 unknown category |
| GET | `/api/events/:id` | 200 `{ "data": event }` | 404 |
| POST | `/api/events` | 201 `{ "data": event }` | 400 bad JSON or invalid fields |

Any other path returns 404. A known path with the wrong method (for example `DELETE /api/events`) returns 405 with an `Allow` header. Errors always look like `{ "error": { "message": "...", "details": ... } }`.

## Environment variables

| Name | Default | Purpose |
|---|---|---|
| `PORT` | `4000` | Port the server listens on |
