import http from 'node:http';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { findEvents, findEventById, insertEvent } from './data/events.js';
import { CATEGORIES, validateEventInput } from './validators/event.js';

// This is the codealong file. The imports above, the two constants below and the
// server.listen call at the bottom already work, so `npm run dev` runs before you
// type anything. Everything else is a numbered TODO (you) step. Do them in order and
// run the check from the lesson page after each one.
//
// The TODO blocks are not in step order. Each one sits where its code belongs in the
// finished file, so search for "STEP 6" to find your next one.
//
// When all eleven steps are done, delete this comment block. The finished file has no
// comment here, so your file and ../week02-http-server/src/server.js will then match.
const port = process.env.PORT ?? 4000;
const indexPath = path.join(import.meta.dirname, '..', 'public', 'index.html');

// TODO (you): STEP 2 - write sendJson(res, status, body) and sendError(res, status, message, details).
// sendJson: res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8' }), then res.end(JSON.stringify(body)).
// sendError: one line that calls sendJson with the body { error: { message, details } }.

// TODO (you): STEP 5 - write sendMethodNotAllowed(res, allowed), where allowed is an array like ['GET', 'POST'].
// res.setHeader('Allow', allowed.join(', ')) first, then sendError with status 405 and a message naming the methods.

// TODO (you): STEP 8 - write async readJsonBody(req).
// Collect the chunks with `for await (const chunk of req)`, join them with Buffer.concat,
// call .toString('utf8') and return JSON.parse of that text. Let bad JSON throw.

// TODO (you): STEP 6 - write listEvents(res, searchParams).
// Read 'category' and 'q' with searchParams.get(). A category that is not in CATEGORIES is a 400
// with details; anything else is a 200 with { data: findEvents({ category, q }) }.

// TODO (you): STEP 7 - write getEvent(res, id).
// findEventById(id): no match is a 404, a match is a 200 with { data: event }.

// TODO (you): STEP 8 - write async createEvent(req, res).
// try/catch around `await readJsonBody(req)` (400 when it throws), then validateEventInput(body).
// Any keys in errors is a 400 with details, otherwise 201 with { data: insertEvent(value) }.

async function handleRequest(req, res) {
  // TODO (you): STEP 3 - pull pathname and searchParams out of req.url with
  // `new URL(req.url, 'http://localhost')`. req.url has no host, so URL needs a base.

  // TODO (you): STEP 4 - the routes go here, one `if` per path, each one answering and returning.
  //   Start with GET / (readFile(indexPath), Content-Type text/html) and GET /api/health (200 with { status: 'ok' }).
  // TODO (you): STEP 5 - add the method guard to both of those routes.
  // TODO (you): STEP 6 - /api/events goes to listEvents.
  // TODO (you): STEP 7 - /api/events/<id> goes to getEvent. pathname.split('/') gives you the parts.
  // TODO (you): STEP 8 - POST /api/events goes to createEvent, and /api/events now allows GET, POST.

  // The reply below is the leftover: it answers whatever the routes above did not.
  // TODO (you): STEP 1 - replace these two lines with a plain text reply to every request.
  // TODO (you): STEP 10 - replace them again with the 404 that says no route matched.
  res.writeHead(501, { 'Content-Type': 'text/plain; charset=utf-8' });
  res.end('Not written yet: handleRequest is still the starter stub.\n');
}

const server = http.createServer(async (req, res) => {
  // TODO (you): STEP 11 - log one line per finished request with res.on('finish', ...),
  // and wrap the await below in try/catch so an unexpected error answers 500
  // instead of taking the whole server down.
  await handleRequest(req, res);
});

server.listen(port, () => {
  console.log(`Campus Events API running at http://localhost:${port}`);
});
