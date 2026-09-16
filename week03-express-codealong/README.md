# Week 3 codealong: Campus Events with Express 5

This is the folder we type together in class. It is the Week 2 Campus Events API rebuilt with Express 5, and it gains update and delete routes on the way.

It is the same project as [`../week03-express`](../week03-express), with one difference: the Express code we write in class has been taken out and replaced with numbered `// TODO (you): STEP N` comments. You put it back, one step at a time, with me.

The finished version is in [`../week03-express`](../week03-express). Open it when a step has you stuck, and to check your work when you are done. Try the step first.

Everything you should not have to type is already here: the events themselves (`src/data/events.js`), the field checks (`src/validators/event.js`), the web page in `public/`, the Bruno collection, `package.json` with Express already listed, and `src/server.js`, the four lines that start the server.

## Run it

Open a terminal, go into this folder, and run these three commands:

```bash
npm install
cp .env.example .env
npm run dev
```

`npm install` downloads Express into a `node_modules` folder. It takes a few seconds and you only do it once. In Windows Command Prompt, use `copy .env.example .env` instead of `cp`.

The terminal should print:

```text
Campus Events API running at http://localhost:4000
```

Leave that terminal running for the whole class. It restarts the server every time you save a file, so after each step all you do is send the check from a second terminal or from Bruno.

This runs before you write a single line. Every request answers `501 Not Implemented` with a short "not written yet" message:

```bash
curl -i http://localhost:4000/api/health
```

```text
HTTP/1.1 501 Not Implemented
Content-Type: application/json; charset=utf-8

{"error":{"message":"Not written yet: no route for GET /api/health"}}
```

That is what you want to see at the start. The server is up, it just does not know anything yet.

## What is in each file

You write the files marked "you write it". The others are done.

| File | What it is for |
|---|---|
| `src/server.js` | Starts the server on the port in `.env`. Done for you |
| `src/app.js` | Creates the Express app and lists, in order, everything a request passes through. You write it, in steps 1 to 4 |
| `src/routes/events.routes.js` | One line per route: which method and path runs which controller. You write it |
| `src/controllers/events.controller.js` | The five functions that answer the event routes. You write them |
| `src/middleware/request-logger.js` | Prints one line per request. You write it, in step 4 |
| `src/middleware/validate-event.js` | Checks the body of a create or update. You write it, in step 11 |
| `src/middleware/not-found.js` | The 404 answer for a path with no route. You write it, in step 5 |
| `src/middleware/error-handler.js` | Turns a thrown error into a JSON response. You write it, in steps 7 and 8 |
| `src/utils/http-error.js` | An `Error` that carries a status code. You write it, in step 6 |
| `src/data/events.js` | The 8 events and the functions that find, add, change and remove them. Done for you |
| `src/validators/event.js` | Checks each field of an event and reports what is wrong. Done for you |
| `public/index.html` | The page that lists the events in a browser. Done for you |
| `bruno/` | A saved request for every route, to send from Bruno. Done for you |

## The steps

Do them in this order. Section 8 of the Week 3 lesson page has the code to type, a check to run and an explanation for each one.

1. The health route: `GET /api/health` answers `{ "status": "ok" }`. Your first Express route.
2. `express.json()` and `express.static()`, so JSON bodies are read for you and the page in `public/` is served.
3. The events router and the list route: `GET /api/events` answers with all 8 events.
4. The request logger: one line in your terminal for every request.
5. The 404 handler: a path with no route answers 404 in JSON instead of 501.
6. `HttpError` and the query checks: an unknown `category` throws instead of answering an empty list.
7. The error handler, first half: a thrown error becomes a JSON response with the right status code.
8. The error handler, second half: broken JSON is a 400, and a bug is a 500 that keeps its details in your terminal.
9. `GET /api/events/:id`: one event by its id, and a 404 when there is no such event.
10. `POST /api/events`: create an event, answer 201 and say where it lives.
11. The validation middleware: a create with bad fields is a 400 that names every bad field.
12. `PATCH /api/events/:id`: change some fields of an event.
13. `DELETE /api/events/:id`: remove an event and answer 204 with no body.

## Run the check after every step

Each step on the lesson page ends with a `curl` command or a Bruno request, and the answer you should get back. It also has a short "if it does not work" note with the mistakes people actually make on that step. Run the check before you start the next step.

This is the point of working in steps. If you type all thirteen and only then press run, one typo means hunting through nine files. One step at a time means a failed check points at the few lines you just wrote.

## Routes, once you are done

| Method | Path | Success | Errors |
|---|---|---|---|
| GET | `/api/health` | 200 `{ "status": "ok" }` | |
| GET | `/api/events?category=&q=` | 200 `{ "data": [...] }` | 400 unknown category |
| GET | `/api/events/:id` | 200 `{ "data": event }` | 404 |
| POST | `/api/events` | 201 `{ "data": event }`, plus a `Location` header | 400 bad JSON or invalid fields |
| PATCH | `/api/events/:id` | 200 `{ "data": event }` | 400 invalid fields, 404 |
| DELETE | `/api/events/:id` | 204, empty body | 404 |

Any other path returns 404. Errors always look like `{ "error": { "message": "...", "details": ... } }`.

## Check your work at the end

After step 13, delete the comment block at the top of `src/app.js`, the one that explains how this codealong works. Then compare your whole `src` folder with the finished one. From the folder that holds both projects:

```bash
diff -r week03-express-codealong/src week03-express/src
```

No output means the two folders are identical, line for line. Any `TODO (you)` still in your files means you missed a step.

## Environment variables

An environment variable is a setting the program reads when it starts, kept outside the code. This project has one.

| Name | Default | Purpose |
|---|---|---|
| `PORT` | `4000` | Port the server listens on |
