# Week 3: Campus Events with Express

The same API as Week 2. Same events, same routes, same JSON. What changed is how it is built.

In Week 2 the whole server was one 120-line file of `if` statements that compared `req.method` and `req.url` by hand. Express does that comparing for you. The work that file was doing is still here, just spread across small files that each do one job, which is the layout you will use for Lab 2 and the project.

Express also makes two new routes cheap, so this week the API can finally change an event (`PATCH`) and remove one (`DELETE`).

## Run it

```bash
npm install
cp .env.example .env
npm run dev
```

In Windows Command Prompt, use `copy .env.example .env` instead of `cp`.

`npm install` is new this week. Express is the first dependency in this course, so there is now a `node_modules/` folder to download. It is not committed to git, which is why you have to run install yourself.

Open http://localhost:4000 and you should see the events page.

## Most of this you have already read

Before the file count scares you, three of these files are not new:

- `src/data/events.js` is last week's file with two functions added at the bottom, `updateEventById` and `deleteEventById`.
- `src/validators/event.js` is last week's file with one addition: a `partial` mode, so `PATCH` can check only the fields that were actually sent.
- `public/index.html` is identical to last week's, line for line.

So the new code this week is about 160 lines spread over nine small files. Read them in the order below and each one will make sense on its own.

## Read the files in this order

**1. `src/server.js`** starts the app on a port. That is all it does. Keeping it separate means the app itself can be imported by a test or by another file without something starting to listen.

**2. `src/app.js`** is the one to understand properly. It creates the app and then registers everything in order with `app.use(...)`. Express runs those top to bottom for every request, so the order is the program. `express.json()` has to come before the routes or `req.body` will be `undefined` when a controller looks at it. `notFound` and `errorHandler` have to come last or they would answer requests that a real route was about to handle.

**3. `src/routes/events.routes.js`** is the table of contents: method plus path on the left, the function that handles it on the right. A `Router()` is a mini app you can mount somewhere, and `app.js` mounts this one at `/api/events`. That is why the paths in this file are `/` and `/:id` rather than the full `/api/events/:id`.

**4. `src/controllers/events.controller.js`** holds the functions the routes point at. Each one reads what it needs off `req`, asks the data file for something, and sends a response. No controller knows what URL it is behind, which is the point of splitting them out.

**5. `src/middleware/request-logger.js`** is the smallest possible piece of middleware, and a good one to read first. It takes `(req, res, next)`, starts a timer, and calls `next()` to hand the request to whatever comes next. Without that `next()` call the request would hang forever.

**6. `src/middleware/validate-event.js`** runs the validator before the controller, so a controller never has to wonder whether `req.body.capacity` is a number. It is a function that *returns* middleware, which lets one file serve both routes: `validateEvent()` for `POST`, `validateEvent({ partial: true })` for `PATCH`.

**7. `src/utils/http-error.js` and `src/middleware/error-handler.js`** work as a pair. A controller that cannot do its job throws `new HttpError(404, 'Event not found')` and stops. Express catches it and skips ahead to `errorHandler`. Express knows that function is an error handler only because it takes four arguments, `(err, req, res, next)`, instead of the usual three. Drop the first one and it silently becomes ordinary middleware that never runs.

**8. `src/middleware/not-found.js`** answers any path no route above it matched. Four lines, last in the queue.

## How one request travels

`GET /api/events/2ee63bdf-...` arrives:

1. `requestLogger` starts a timer and calls `next()`.
2. `express.json()` looks for a JSON body. A `GET` has none, so it calls `next()`.
3. `express.static` looks for a file at `public/api/events/2ee63bdf-...`. There isn't one, so it calls `next()`.
4. The router mounted at `/api/events` matches `GET /:id` and runs `getEvent`.
5. `getEvent` reads `req.params.id`, finds the event, and sends it with `res.json(...)`.
6. `notFound` and `errorHandler` never run. The response has already gone out.

Now the same request with an id that does not exist. Steps 1 to 4 are identical. At step 5 `getEvent` throws `HttpError(404, ...)`, Express catches it and jumps straight to `errorHandler`, which turns it into `{ "error": { "message": "Event not found" } }` with status 404. `notFound` is skipped, because a route did match, it just had nothing to return.

## Where the request's data lives

| What you want | Where Express puts it | Example |
|---|---|---|
| The `:id` part of the path | `req.params.id` | `GET /api/events/abc` |
| Anything after `?` | `req.query.category`, `req.query.q` | `GET /api/events?category=arts` |
| The JSON body | `req.body` | `POST /api/events` |

`req.body` only exists because `express.json()` runs before the routes. Comment that line out and every `POST` breaks, which is worth trying once so you recognise the symptom later.

Watch out for one thing with `req.query`: a value is normally a string, but `?category=a&category=b` arrives as an array. The controller checks for that instead of assuming, because `['a','b'].toLowerCase()` is not a function, and the client would get a 500 instead of being told what it did wrong.

## Routes

| Method | Path | Success | Errors |
|---|---|---|---|
| GET | `/api/health` | 200 `{ "status": "ok" }` | |
| GET | `/api/events?category=&q=` | 200 `{ "data": [...] }` | 400 unknown category |
| GET | `/api/events/:id` | 200 `{ "data": event }` | 404 |
| POST | `/api/events` | 201 `{ "data": event }`, plus a `Location` header | 400 |
| PATCH | `/api/events/:id` | 200 `{ "data": event }` | 400, 404 |
| DELETE | `/api/events/:id` | 204, empty body | 404 |

`q` searches titles and ignores upper and lower case. Every error looks the same: `{ "error": { "message": "...", "details": ... } }`, where `details` names the fields that were wrong.

Events live in memory, so restarting the server puts the eight seed events back and drops anything you created.

## Try it

Open the `bruno/` folder in [Bruno](https://www.usebruno.com) and pick the `Local` environment. Run the requests in order. "Create event" saves the new id into a variable, and "Update event" and "Delete event" both use it, so those two fail if you skip it.

## Environment variables

| Name | Default | Purpose |
|---|---|---|
| `PORT` | `4000` | Port the server listens on |
