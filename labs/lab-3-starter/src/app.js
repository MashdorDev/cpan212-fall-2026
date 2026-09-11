import path from 'node:path';
import express from 'express';
import { noticesRouter } from './routes/notices.routes.js';

export const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(import.meta.dirname, 'views'));

// Serves src/public/styles.css at /styles.css.
app.use(express.static(path.join(import.meta.dirname, 'public')));
app.use(express.urlencoded({ extended: false }));

// TODO (you): serve the uploads folder at /uploads with express.static.
// Import UPLOAD_DIR from ./middleware/upload.js once you've written it.

app.use(noticesRouter);

// TODO (you): add a 404 handler here that renders views/not-found.ejs with
// status 404 for any URL no route matched.

// TODO (you): add an error handler here (four parameters: err, req, res, next)
// that logs the error with console.error and responds with status 500. Never
// send err.message or err.stack to the browser.
