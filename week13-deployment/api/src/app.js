import path from 'node:path';
import express from 'express';
import mongoose from 'mongoose';
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
// Before the rate limit: Render's health check calls this every few seconds from the same address,
// and a 429 here would make Render think the service is down.
app.get('/api/health', (req, res) => {
  // readyState is a number (1 means connected). mongoose.STATES turns it into a name such as "connecting".
  const database = mongoose.STATES[mongoose.connection.readyState];
  const healthy = database === 'connected';
  // 503 Service Unavailable tells Render not to send traffic to this instance (and not to finish a deploy).
  res.status(healthy ? 200 : 503).json({ status: healthy ? 'ok' : 'unavailable', database });
});

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

app.use('/api/auth', authRouter);
app.use('/api/events', eventsRouter);
app.use('/admin', adminRouter);

// These two stay last: notFound catches anything no route matched,
// errorHandler catches anything thrown along the way.
app.use(notFound);
app.use(errorHandler);
