# Week 4 codealong: async JavaScript and calling another API

This is the folder we work in during class. It holds the same two projects as
[`../week04-async`](../week04-async), but the code we write together has been taken out and replaced
with numbered `// TODO (you): STEP N` comments.

The finished version is in [`../week04-async`](../week04-async). Open it when a step has you stuck,
and to check your work at the end. Try the step first.

## What you type and what you only run

`examples/` holds six short scripts about async JavaScript. They are **copied complete**. You read
them and run them, you do not type them. Their whole point is the order the lines print, and you
can only see that by running them.

`api/` is the Campus Events API you built in Week 3, plus one new endpoint:
`GET /api/events/:id/holiday-check`, which says whether an event falls on a Canadian public holiday.
Everything from Week 3 is already here and working. The three files that make the new endpoint work
are the ones you write:

| File | What you write in it | Steps |
|---|---|---|
| `api/src/routes/events.routes.js` | The line that sends the new URL to your code | 1 |
| `api/src/controllers/holidays.controller.js` | Finding the event, its date, and the answer you send back | 2, 3, 5 |
| `api/src/services/holidays.service.js` | The call to the third-party API, the cache and the error handling | 4, 6, 7 |

Everything else is done for you: the seed events, the web page, the Bruno collection, the
validator, the middleware and the error handler.

## Run the examples

```bash
cd examples
node 01-callbacks.js
```

There is nothing to install. `05-fetch-timeout.js` needs an internet connection, the other five do
not. The scripts that write files put them in `examples/output/`.

| File | What it shows |
|---|---|
| `01-callbacks.js` | Error-first callbacks, and why nesting gets deep |
| `02-promises.js` | The same work with promises, `then()` and `catch()` |
| `03-async-await.js` | The same work again with `async`, `await` and `try`/`catch` |
| `04-promise-all.js` | One after another vs `Promise.all`, and `Promise.allSettled` when one call fails |
| `05-fetch-timeout.js` | `fetch` with a timeout, and checking `res.ok` |
| `06-event-loop-blocking.js` | How one busy loop freezes everything else |

## Run the API

```bash
cd api
npm install
cp .env.example .env
npm run dev
```

In Windows Command Prompt, use `copy .env.example .env` instead of `cp`.

`npm install` downloads Express. `cp .env.example .env` makes your own settings file (an
**environment variable** is a setting that lives outside your code, so it can change per computer
without editing a file that gets committed). `npm run dev` starts the server and restarts it every
time you save.

The terminal prints `Campus Events API running at http://localhost:4000`. Every Week 3 route already
works. The holiday check does not exist yet, so asking for it gives a `404`. Step 1 wires it up, and
from then on it answers `501 Not Implemented` and a "not written yet" message until you write it.
That is the starting line.

Leave `npm run dev` running in one terminal the whole time. Send the checks from a second terminal,
or from Bruno.

## The steps

Do them in this order. The lesson page (section 7) has the code to type, the check to run and the
explanation for each one. Every step prints the whole function it changes, so you can see where
each line goes.

1. Send `GET /api/events/:id/holiday-check` to the new controller, in `api/src/routes/events.routes.js`.
2. Find the event and work out its calendar date in Toronto, in `api/src/controllers/holidays.controller.js`.
3. Ask the holiday service whether that date is a holiday.
4. Call Nager.Date with `fetch`, a 5 second timeout and an `res.ok` check, in `api/src/services/holidays.service.js`.
5. Send the full answer, with the list of holidays that matched.
6. Remember each year's answer in a cache that expires, so the same question is not asked twice.
7. Turn a failing holiday service into a 502 or a 504 instead of a 500.

Steps 1, 2, 3 and 7 work with no internet connection. Steps 4, 5 and 6 call the real holiday API.

## Run the check after every step

Each step on the lesson page ends with a command to run and the answer you should get back. Run it
before you start the next step.

This is the point of working in small steps. If you type all seven and only then press run, one typo
means hunting through every line you wrote. One step at a time means a failed check points at the
few lines you just typed.

## If the holiday API is slow or down

Steps 4, 5 and 6 call [Nager.Date](https://date.nager.at), a free service on the internet. Steps 1,
2, 3 and 7 do not need the internet at all.

If Nager.Date is down, or you are working offline, the holiday check answers `502` once you have
finished step 7, and the terminal shows the real reason (`TypeError: fetch failed`). Before step 7
it answers `500`. Nothing is wrong with your code, and the rest of the API keeps working. That is
exactly the failure step 7 is about, so carry on with the steps and try again later.

## Routes, once you are done

| Method | Path | Success | Errors |
|---|---|---|---|
| GET | `/api/health` | 200 `{ "status": "ok" }` | |
| GET | `/api/events?category=&q=` | 200 `{ "data": [...] }` | 400 unknown category |
| GET | `/api/events/:id` | 200 `{ "data": event }` | 404 |
| POST | `/api/events` | 201 `{ "data": event }` | 400 |
| PATCH | `/api/events/:id` | 200 `{ "data": event }` | 400, 404 |
| DELETE | `/api/events/:id` | 204, empty body | 404 |
| GET | `/api/events/:id/holiday-check` | 200 `{ "data": { ... } }` | 404, 502, 504 |

Errors always look like `{ "error": { "message": "...", "details": ... } }`.

## Check your work at the end

Delete the comment block at the top of `api/src/services/holidays.service.js`, the one explaining how
the codealong works (the one starting "This is the codealong file"). The finished file does not have
it. Then compare your three files with the finished ones from the `repo` folder:

```bash
diff -r week04-async-codealong/api/src week04-async/api/src
```

No output means your code and mine are the same, line for line. If `diff` prints something, it shows
your line and mine next to each other. Differences in blank lines are fine.

## Environment variables

| Name | Default | Purpose |
|---|---|---|
| `PORT` | `4000` | Port the server listens on |
| `HOLIDAY_API_BASE_URL` | `https://date.nager.at/api/v3` | Address of the holiday API. Point it at a wrong address to see the 502 in step 7. |
