import path from 'node:path';
import express from 'express';
import { sessionMiddleware } from './session.js';
import { authRouter } from './routes/auth.routes.js';
import { eventsRouter } from './routes/events.routes.js';
import { adminRouter } from './routes/admin.routes.js';
import { requestLogger } from './middleware/request-logger.js';
import { notFound } from './middleware/not-found.js';
import { errorHandler } from './middleware/error-handler.js';
import { formatEventDate } from './utils/dates.js';
import { UPLOADS_DIR } from './utils/uploads.js';

export const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(import.meta.dirname, 'views'));
// Everything in app.locals is available inside every template.
app.locals.formatEventDate = formatEventDate;

// Order matters: Express runs middleware and routes top to bottom.
// Body parsers come before the routes, or req.body is undefined.
app.use(requestLogger);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(import.meta.dirname, '..', 'public')));
app.use('/uploads', express.static(UPLOADS_DIR));
// After the static files, so a request for a CSS file or an image doesn't load a session from the database.
// Before the routes, so they can read and write req.session.
app.use(sessionMiddleware);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});
app.use('/api/auth', authRouter);
app.use('/api/events', eventsRouter);
app.use('/admin', adminRouter);

// These two stay last: notFound catches anything no route matched,
// errorHandler catches anything thrown along the way.
app.use(notFound);
app.use(errorHandler);
