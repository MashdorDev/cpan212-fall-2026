import path from 'node:path';
import express from 'express';
import { eventsRouter } from './routes/events.routes.js';
import { adminRouter } from './routes/admin.routes.js';
import { requestLogger } from './middleware/request-logger.js';
import { notFound } from './middleware/not-found.js';
import { errorHandler } from './middleware/error-handler.js';
import { formatEventDate } from './utils/dates.js';
import { UPLOADS_DIR } from './utils/uploads.js';

export const app = express();

// TODO (you): STEP 5 - set EJS as the view engine, say where the views are, and add formatEventDate to app.locals.

// Order matters: Express runs middleware and routes top to bottom.
// Body parsers come before the routes, or req.body is undefined.
app.use(requestLogger);
app.use(express.json());
// TODO (you): STEP 7 - read HTML form bodies with express.urlencoded.
app.use(express.static(path.join(import.meta.dirname, '..', 'public')));
// TODO (you): STEP 9 - serve the uploads folder at /uploads.

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});
app.use('/api/events', eventsRouter);
// TODO (you): STEP 5 - mount adminRouter at /admin.

// These two stay last: notFound catches anything no route matched,
// errorHandler catches anything thrown along the way.
app.use(notFound);
app.use(errorHandler);
