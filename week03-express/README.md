# Week 3: Campus Events with Express 5

The Week 2 API rebuilt with Express 5, plus update and delete. Each file now has one job, which is the layout you will use for Lab 2 and the project.

## Run it

```bash
npm install
cp .env.example .env
npm run dev
```

Open http://localhost:4000 for the events page, or open the `bruno/` folder in Bruno and pick the `Local` environment. Run "Create event" before "Update event" and "Delete event", because those two use the id it saves.

## Files

| File | Job |
|---|---|
| `src/server.js` | Starts the app on `PORT` |
| `src/app.js` | Creates the app and registers middleware and routes in order |
| `src/routes/events.routes.js` | Maps each method and path to a controller |
| `src/controllers/events.controller.js` | Reads the request, calls the data module, sends the response |
| `src/data/events.js` | In-memory events (reset on restart) |
| `src/validators/event.js` | Checks event fields and returns `{ value, errors }` |
| `src/middleware/request-logger.js` | Logs method, URL, status and time for every request |
| `src/middleware/validate-event.js` | Runs the validator and answers 400 when a field is wrong |
| `src/middleware/not-found.js` | JSON 404 for any path no route matched |
| `src/middleware/error-handler.js` | Turns thrown errors into JSON, hides server errors from clients |
| `src/utils/http-error.js` | An `Error` with a status code, thrown from controllers |
| `public/index.html` | Served by `express.static` at `/` |

## Routes

| Method | Path | Success | Errors |
|---|---|---|---|
| GET | `/api/health` | 200 `{ "status": "ok" }` | |
| GET | `/api/events?category=&q=` | 200 `{ "data": [...] }` | 400 unknown category |
| GET | `/api/events/:id` | 200 `{ "data": event }` | 404 |
| POST | `/api/events` | 201 `{ "data": event }` | 400 |
| PATCH | `/api/events/:id` | 200 `{ "data": event }` | 400, 404 |
| DELETE | `/api/events/:id` | 204, empty body | 404 |

`q` searches titles and ignores upper and lower case. Errors always look like `{ "error": { "message": "...", "details": ... } }`.

## Environment variables

| Name | Default | Purpose |
|---|---|---|
| `PORT` | `4000` | Port the server listens on |
