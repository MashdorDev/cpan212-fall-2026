import http from 'node:http';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { findEvents, findEventById, insertEvent } from './data/events.js';
import { CATEGORIES, validateEventInput } from './validators/event.js';

// This is the codealong file, the one you type into during class.
//
// Already written for you: the five imports above, the two constants below and the
// server.listen call at the bottom. That is enough for `npm run dev` to start the server
// before you have typed anything, so you never begin from a crash.
//
// Everything else is a numbered step, marked `TODO (you): STEP N`. Do them in order,
// 1, 2, 3 and so on, and run that step's check on the Week 2 lesson page before you start
// the next one. Each TODO says what to write and where it goes. The lesson page has the
// same code with the explanation next to it.
//
// The TODO blocks are not in step order on the screen. Each one sits where its code
// belongs in the finished file, so use your editor's find (Ctrl + F, or Cmd + F on a Mac)
// to jump to your next one. Every marker is unique, so a search lands on one block and
// that is the one to do. Longer steps are split into lettered markers, 5a and 5b.
//
// When all eleven steps are done, delete this comment block. The finished file does not
// have it, so deleting it is what makes your file and ../week02-http-server/src/server.js
// match line for line.
const port = process.env.PORT ?? 4000;
const indexPath = path.join(import.meta.dirname, '..', 'public', 'index.html');

// TODO (you): STEP 2 - write two short helper functions here, in place of this comment.
// Every route you write later answers through one of them, so no response can forget its
// Content-Type header or invent its own error shape.
//   1. function sendJson(res, status, body): first line
//      res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8' }),
//      second line res.end(JSON.stringify(body)), which turns your object into JSON text
//      and sends it. res.end is what finishes a response.
//   2. function sendError(res, status, message, details): one line that calls sendJson
//      with the body { error: { message, details } }, so every error in this API looks the
//      same to a client.
// Then change the reply at the bottom of handleRequest to call sendError. The lesson page
// (section 3.2) gives you that line.

// TODO (you): STEP 5a - write function sendMethodNotAllowed(res, allowed) here, in place of
// this comment, just below sendError. `allowed` is an array of method names, for example
// ['GET', 'POST'].
//   First line: res.setHeader('Allow', allowed.join(', ')). A 405 answer has to tell the
//   client which methods the path does accept, and allowed.join(', ') glues the array into
//   the string "GET, POST".
//   Second line: call sendError with status 405 and a message that names the methods.
// Then add the one line guard to both routes inside handleRequest (section 3.5).

// TODO (you): STEP 8a - write async function readJsonBody(req) here, in place
// of this comment. It reads the body of a POST request and turns it into a JavaScript
// value. A body does not arrive in one piece, it arrives in chunks, so:
//   start with an empty array named chunks;
//   `for await (const chunk of req)` waits for each chunk as it arrives and you push it
//   into the array (the `await` is there because the chunks come over the network);
//   Buffer.concat(chunks) joins them into one block of raw bytes;
//   .toString('utf8') turns those bytes into text;
//   JSON.parse of that text is what you return.
// Do not catch anything in here. Bad JSON should throw, and createEvent is what turns that
// throw into a 400.

// TODO (you): STEP 6a - write function listEvents(res, searchParams) here, in place of this
// comment. It answers GET /api/events and takes two optional filters from the query string.
//   Read them with searchParams.get('category') and searchParams.get('q'). Either one is
//   null when the client did not send it.
//   If a category was sent and CATEGORIES does not include it, answer 400 through sendError
//   with a details object naming the allowed values, and return there.
//   Otherwise answer 200 through sendJson with the body { data: findEvents({ category, q }) }.
//   findEvents is imported at the top of this file and does the filtering and sorting.

// TODO (you): STEP 7a - write function getEvent(res, id) here, in place of this comment,
// just below listEvents. It answers GET /api/events/<id>.
//   Look the event up with findEventById(id). It is imported at the top and returns
//   undefined when no event has that id.
//   Nothing found: answer 404 through sendError, and return so nothing below runs.
//   Found: answer 200 through sendJson with the body { data: event }.

// TODO (you): STEP 8b - write async function createEvent(req, res) here, in
// place of this comment. It answers POST /api/events.
//   Declare `let body;` on its own line, then a try/catch. Inside try:
//   body = await readJsonBody(req). Inside catch: answer 400 with the message that the body
//   must be valid JSON, and return. try/catch is how you handle an error instead of letting
//   it crash the server.
//   Then const { value, errors } = validateEventInput(body). That hands you two objects:
//   `value` holds the cleaned fields, `errors` names every field that broke a rule.
//   If Object.keys(errors).length > 0 (the errors object has at least one key in it),
//   answer 400 and pass errors as the details, and return.
//   Otherwise answer 201 with the body { data: insertEvent(value) }. insertEvent saves the
//   event, gives it an id and hands it back.

async function handleRequest(req, res) {
  // TODO (you): STEP 3 - replace this comment with one line, the first line inside this
  // function:
  //   const { pathname, searchParams } = new URL(req.url, 'http://localhost');
  // req.url holds the path and the query string stuck together ("/api/events?category=arts").
  // new URL(...) splits them for you, but it needs a whole web address, so pass any host as
  // the second argument. Nothing is ever sent there.
  // The { } on the left is destructuring: it pulls the two named values out of the URL
  // object and puts them in two constants.
  // Then change the reply at the bottom to use pathname (section 3.3).

  // TODO (you): STEP 4 - the routes go here, in place of this comment. A route is one `if`
  // on the path that answers the request and then returns, so nothing below it runs.
  //   First route: if (pathname === '/'), read the page with `const html = await readFile(indexPath);`
  //   then res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' }) and finish with
  //   `return res.end(html);`. This route sends HTML, not JSON, so it does not use sendJson.
  //   Leave one blank line, then the second route: if (pathname === '/api/health'),
  //   return sendJson(res, 200, { status: 'ok' }).
  // TODO (you): STEP 5b - go back into those two routes and give each one a first line that
  //   answers a wrong method: if req.method is not 'GET', return sendMethodNotAllowed with
  //   ['GET'].
  // TODO (you): STEP 6b - third route, in place of this comment: if (pathname === '/api/events'),
  //   GET only for now, answered by `return listEvents(res, searchParams);`.
  // TODO (you): STEP 7b - fourth route, in place of this comment: one event by its id.
  //   Start with the comment line that explains the split, it is part of the finished file:
  //   // "/api/events/abc" split on "/" gives ['', 'api', 'events', 'abc'].
  //   Cut the path into pieces with pathname.split('/'), so "/api/events/abc" becomes
  //   ['', 'api', 'events', 'abc']. Counting starts at 0, so the id is piece 3.
  //   Match on: four pieces, piece 1 is 'api', piece 2 is 'events', piece 3 is not empty.
  //   GET only, answered by `return getEvent(res, parts[3]);`.
  // TODO (you): STEP 8c - change the /api/events route you already wrote so
  //   that GET goes to listEvents, POST goes to createEvent, and any other method gets a 405
  //   listing ['GET', 'POST'].

  // TODO (you): STEP 1 - replace the two lines below with a reply in plain text, so you can
  //   watch this one function run for every request that arrives:
  //   res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' }) and then
  //   res.end(`You asked for ${req.method} ${req.url}\n`).
  //   Those are backticks, not quotes: inside them, ${ } is filled in with the value.
  //   Leave the TODO block below it where it is, you need it later.
  // TODO (you): STEP 10 - every route above is written by now, so a request that still
  //   reaches the bottom of this function is asking for a path this server does not have,
  //   which is a 404. Replace the reply one last time with a single sendError line
  //   (section 3.10). Delete this comment with it, and leave exactly one blank line between
  //   the route above and that last line.
  res.writeHead(501, { 'Content-Type': 'text/plain; charset=utf-8' });
  res.end('Not written yet: handleRequest is still the starter stub.\n');
}

const server = http.createServer(async (req, res) => {
  // TODO (you): STEP 11 - two things wrap around the `await handleRequest(req, res);` line
  // below. Do them one at a time, and replace this comment as you go.
  //   Part 1, one log line per request. Above the await, save the time with
  //   `const started = performance.now();`, then res.on('finish', () => { ... }) registers a
  //   function that Node runs once the response has been sent. Inside it, console.log the
  //   method, req.url, res.statusCode and Math.round(performance.now() - started) with "ms".
  //   The () => { } is an arrow function, a function written inline.
  //   Part 2, stay alive. Put the `await handleRequest(req, res);` line inside a
  //   try { ... } catch (error) { ... }. In the catch: console.error(error) so the whole
  //   error lands in your terminal, then `if (!res.headersSent)` answer the client with a
  //   short 500 through sendError. Without this catch, one unexpected error takes the whole
  //   server down for everyone.
  await handleRequest(req, res);
});

server.listen(port, () => {
  console.log(`Campus Events API running at http://localhost:${port}`);
});
