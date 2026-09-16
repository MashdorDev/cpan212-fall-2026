# Week 2 codealong: Campus Events with node:http

This is the folder we type together in class. It is the same project as `../week02-http-server`, except that `src/server.js` has been emptied out into numbered steps, and one rule in `src/validators/event.js` is left for you to write. Every step is marked `// TODO (you): STEP N`.

The finished version is in [`../week02-http-server`](../week02-http-server). Open it when you are stuck or when you want to check your work, not before you have tried the step.

Everything else is done for you: the seed events, the HTML page, the Bruno collection and the rest of the validator. Typing seed data is not what this class is about.

## Run it

```bash
cp .env.example .env
npm run dev
```

In Windows Command Prompt, use `copy .env.example .env` instead of `cp`. There is no `npm install` step because there are no dependencies.

This runs before you write a single line. Every request answers `501 Not Implemented` with a short "not written yet" message, which tells you the server is up and waiting for step 1.

## The steps

Do them in this order. The lesson page has the code, the check and the explanation for each one.

1. The smallest server: answer every request with one line of plain text.
2. `sendJson` and `sendError`, so every response is JSON with the right `Content-Type`.
3. Read `pathname` and `searchParams` out of `req.url`.
4. The first two routes: `GET /` sends the HTML page, `GET /api/health` sends `{ "status": "ok" }`.
5. `sendMethodNotAllowed`: a 405 and an `Allow` header for the wrong method on a path you know.
6. `GET /api/events`, with the `category` and `q` filters and a 400 for a category that does not exist.
7. `GET /api/events/:id`, with a 404 when no event has that id.
8. `readJsonBody` and `POST /api/events`: 400 for broken JSON, 400 for invalid fields, 201 for a saved event.
9. The capacity rule in `src/validators/event.js`, the one field the validator is missing.
10. The 404 fallback for a path that matches nothing.
11. One log line per request, and the `try`/`catch` that keeps the server alive when something throws.

## Run and test after every step

Each step in the lesson page ends with a `curl` command or a Bruno request and the response you should get. Run it before you start the next step.

This is the point of the exercise. If you type all eleven steps and only then press run, a single typo means hunting through 120 lines of new code. One step at a time means a broken check tells you exactly which ten lines are wrong.

## Routes, once you are done

| Method | Path | Success | Errors |
|---|---|---|---|
| GET | `/` | 200 HTML page | |
| GET | `/api/health` | 200 `{ "status": "ok" }` | |
| GET | `/api/events?category=&q=` | 200 `{ "data": [...] }` | 400 unknown category |
| GET | `/api/events/:id` | 200 `{ "data": event }` | 404 |
| POST | `/api/events` | 201 `{ "data": event }` | 400 bad JSON or invalid fields |

Any other path returns 404. A known path with the wrong method returns 405 with an `Allow` header. Errors always look like `{ "error": { "message": "...", "details": ... } }`.

After step 11, delete the comment block at the top of `src/server.js` (the one explaining how the codealong works) and your file and `../week02-http-server/src/server.js` should be the same file, line for line. Comparing them with `diff` is a fair way to check your work.

## Environment variables

| Name | Default | Purpose |
|---|---|---|
| `PORT` | `4000` | Port the server listens on |
