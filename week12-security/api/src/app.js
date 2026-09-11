import path from 'node:path';
import express from 'express';
import { apiLimiter, corsMiddleware, helmetMiddleware, noStoreWhenLoggedIn, trustProxyHops } from './security.js';
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

// Only behind a proxy such as Render's load balancer. See trustProxyHops in security.js.
if (trustProxyHops !== null) {
  app.set('trust proxy', trustProxyHops);
}

app.set('view engine', 'ejs');
app.set('views', path.join(import.meta.dirname, 'views'));
// Everything in app.locals is available inside every template.
app.locals.formatEventDate = formatEventDate;

// Order matters: Express runs middleware and routes top to bottom.
// Body parsers come before the routes, or req.body is undefined.
app.use(requestLogger);
// Security headers first, so every response gets them: pages, JSON, static files and errors.
app.use(helmetMiddleware);
// CORS and the general rate limit only apply to the JSON API. Both run before the body is read,
// so a blocked request costs as little as possible.
app.use('/api', corsMiddleware);
app.use('/api', apiLimiter);
// No event, login or form needs more than a few kilobytes. The default limit is 100kb; a smaller one
// means a client can't make the server read and parse large bodies. Too large gets a 413.
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: false, limit: '10kb', parameterLimit: 50 }));
app.use(express.static(path.join(import.meta.dirname, '..', 'public')));
app.use('/uploads', express.static(UPLOADS_DIR));
// After the static files, so a request for a CSS file or an image doesn't load a session from the database.
// Before the routes, so they can read and write req.session.
app.use(sessionMiddleware);
app.use(noStoreWhenLoggedIn);

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
