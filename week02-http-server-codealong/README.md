# Week 2 codealong: Campus Events with node:http

This is the folder we type into together in class. It is the same project as
`../week02-http-server`, with two pieces taken out for you to write: all of `src/server.js`,
and one rule in `src/validators/event.js`. Each piece is marked with a `// TODO (you): STEP N`
comment that says what to write and where it goes.

The finished version is in [`../week02-http-server`](../week02-http-server). Open it when a
step has you stuck, and to check your work at the end. Try the step first.

Everything else is written for you: the seed events, the HTML page, the Bruno collection and
the rest of the validator. Typing seed data is not what this class is about.

The lesson page (Week 2, section 3) has the code for every step, the explanation, the check to
run, and what to do when the check fails. Keep it open beside your editor.

## Run it

Open a terminal, go into this folder, and run:

```bash
cd week02-http-server-codealong
cp .env.example .env
npm run dev
```

In Windows Command Prompt, type `copy .env.example .env` instead of `cp`. There is no
`npm install` step, because this project has no dependencies.

The terminal should print:

```text
Campus Events API running at http://localhost:4000
```

That happens before you write a single line. Every request answers `501 Not Implemented` with a
short "not written yet" message, which tells you the server is up and waiting for step 1.

Leave `npm run dev` running in that terminal for the whole class. It restarts the server every
time you save a file, so after each step all you do is send the check from a second terminal or
from Bruno.

If something goes wrong here:

- `npm error enoent Could not read package.json` means the terminal is in the wrong folder.
  `cd` into `week02-http-server-codealong` first.
- `Error: listen EADDRINUSE: address already in use :::4000` means another server is already
  using port 4000. Stop it with **Ctrl + C** in its terminal, or change `PORT` in your `.env`.
- `curl: (7) Failed to connect to localhost port 4000` means the server is not running. Look at
  the terminal where you typed `npm run dev`.

## The steps

Do them in this order. They are numbered by the order you write them, not by where they sit in
the file, so use find (**Ctrl + F**, or **Cmd + F** on a Mac) and search for `STEP 6` to jump to
the next one.

1. The smallest server: answer every request with one line of plain text.
2. `sendJson` and `sendError`, so every response is JSON with the right `Content-Type` and every
   error has the same shape.
3. Split `req.url` into the path and the query string.
4. The first two routes: `GET /` sends the HTML page, `GET /api/health` sends `{ "status": "ok" }`.
5. `sendMethodNotAllowed`: a 405 and an `Allow` header when a path you know is asked with a
   method it does not support.
6. `GET /api/events`, with the `category` and `q` filters, and a 400 for a category that does not
   exist.
7. `GET /api/events/:id`, with a 404 when no event has that id.
8. `readJsonBody` and `POST /api/events`, in three parts: 400 for broken JSON, 400 for invalid
   fields, 201 for a saved event.
9. The capacity rule in `src/validators/event.js`, the one field the validator is missing.
10. The 404 fallback for a path that matches nothing.
11. One log line per request, and the `try`/`catch` that keeps the server alive when something
    throws.

## Run the check after every step

Each step on the lesson page ends with a `curl` command or a Bruno request and the exact response
you should get back. Run it before you start the next step.

This is the point of the exercise. If you type all eleven steps and only then press run, a single
typo means hunting through 120 lines of new code. One step at a time means a failed check points
at the ten lines you just wrote.

Every step leaves the server working. You can stop after step 4, run the check, and go home with
something that runs.

## Routes, once you are done

| Method | Path | Success | Errors |
|---|---|---|---|
| GET | `/` | 200 HTML page | |
| GET | `/api/health` | 200 `{ "status": "ok" }` | |
| GET | `/api/events?category=&q=` | 200 `{ "data": [...] }` | 400 unknown category |
| GET | `/api/events/:id` | 200 `{ "data": event }` | 404 |
| POST | `/api/events` | 201 `{ "data": event }` | 400 bad JSON or invalid fields |

Any other path returns 404. A known path with the wrong method returns 405 with an `Allow` header.
Errors always look like `{ "error": { "message": "...", "details": ... } }`.

## Checking your work at the end

After step 11, delete the comment block at the top of `src/server.js`, the one explaining how the
codealong works. The finished file does not have it.

Your `src/server.js` and `../week02-http-server/src/server.js` should then be the same file, line
for line. Compare them from the folder that holds both:

```bash
diff week02-http-server-codealong/src/server.js week02-http-server/src/server.js
```

No output at all means they match.

## Environment variables

An environment variable is a setting your program reads from outside its own code, so you can
change it without editing the file. This project has one.

| Name | Default | Purpose |
|---|---|---|
| `PORT` | `4000` | Port the server listens on |

`.env` holds your own values and is never committed. `.env.example` is the copy that is committed,
so your teammates know which variables to set.
