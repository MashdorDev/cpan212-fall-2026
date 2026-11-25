import mongoose from 'mongoose';
import { HttpError } from '../utils/http-error.js';

// Express knows this is an error handler because it takes four arguments.
export function errorHandler(err, req, res, next) {
  if (res.headersSent) {
    return next(err);
  }

  // express.json() sets type 'entity.parse.failed' when the body is not valid JSON.
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ error: { message: 'Request body must be valid JSON' } });
  }

  // The schema rejected the data. err.errors has one entry per field that broke a rule.
  if (err instanceof mongoose.Error.ValidationError) {
    const details = {};
    for (const field in err.errors) {
      details[field] = err.errors[field].message;
    }
    return res.status(400).json({ error: { message: 'Validation failed', details: details } });
  }

  // An update with a value Mongoose can't convert, like "lots" for capacity, throws a CastError
  // instead of a ValidationError. err.path is the field name.
  if (err instanceof mongoose.Error.CastError) {
    const details = {};
    details[err.path] = err.message;
    return res.status(400).json({ error: { message: 'Validation failed', details: details } });
  }

  let status = 500;
  if (err.status) {
    status = err.status;
  }
  // An HttpError was thrown on purpose, so its message is safe to show. Any other 5xx error is a bug:
  // log the details for yourself, and never send the stack trace to the client.
  const expected = err instanceof HttpError || status < 500;
  if (!expected) {
    console.error(err);
  }
  let message = 'Internal server error';
  if (expected) {
    message = err.message;
  }

  if (req.originalUrl.startsWith('/admin')) {
    let title = 'Error';
    if (status === 404) {
      title = 'Not found';
    }
    return res.status(status).render('error', { title: title, status: status, message: message });
  }
  res.status(status).json({ error: { message: message, details: err.details } });
}
