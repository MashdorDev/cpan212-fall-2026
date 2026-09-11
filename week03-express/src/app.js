import path from 'node:path';
import express from 'express';
import { eventsRouter } from './routes/events.routes.js';
import { requestLogger } from './middleware/request-logger.js';
import { notFound } from './middleware/not-found.js';
import { errorHandler } from './middleware/error-handler.js';

export const app = express();

// Order matters: Express runs middleware and routes top to bottom.
// The body parser has to come before the routes, or req.body is undefined.
app.use(requestLogger);
app.use(express.json());
app.use(express.static(path.join(import.meta.dirname, '..', 'public')));

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});
app.use('/api/events', eventsRouter);

// These two stay last: notFound catches anything no route matched,
// errorHandler catches anything thrown along the way.
app.use(notFound);
app.use(errorHandler);
