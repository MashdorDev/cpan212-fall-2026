import path from 'node:path';
import express from 'express';
import { eventsRouter } from './routes/events.routes.js';
import { requestLogger } from './middleware/request-logger.js';
import { notFound } from './middleware/not-found.js';
import { errorHandler } from './middleware/error-handler.js';

// This is the codealong file, and the only file in this folder with a note like this at the top.
//
// The six imports above, the app on the line below and the last two lines of this file are already
// written, so `npm run dev` starts the server before you type anything. Every request answers 501
// with a "not written yet" message. That is the starting line.
//
// Everywhere else you will find comments that start with TODO (you): STEP N. Each one is a step in
// section 8 of the Week 3 lesson page, which gives you the code to type, a check to run and an
// explanation. Do the steps in order, and run the check after each one.
//
// Some files also have a stub: a short function that answers 501 so that the server keeps running
// before you have written the real one. When a step tells you to write that function, delete the
// stub and its TODO comment and put your code in their place.
//
// The TODO comments are not in step order. Each one sits where its code belongs in the finished
// file, so use your editor's search (Ctrl + F, or Cmd + F on macOS) to find "STEP 4".
//
// When all thirteen steps are done, delete this comment block. The finished file does not have it,
// so your file and ../week03-express/src/app.js will then be the same file.
export const app = express();

// TODO (you): STEP 4 - register the request logger here, above everything else, so that it also
// logs requests that never reach one of your routes: app.use(requestLogger).
// TODO (you): STEP 2 - two lines. app.use(express.json()) reads JSON request bodies into req.body,
// and app.use(express.static(...)) serves the files in the public folder. Build the path to that
// folder with path.join(import.meta.dirname, '..', 'public').

// TODO (you): STEP 1 - the health route: app.get('/api/health', ...) answering { status: 'ok' }.
// TODO (you): STEP 3 - mount the events router, on the line right after the health route:
// app.use('/api/events', eventsRouter).

// These two stay last: notFound catches anything no route matched,
// errorHandler catches anything thrown along the way.
app.use(notFound);
app.use(errorHandler);
