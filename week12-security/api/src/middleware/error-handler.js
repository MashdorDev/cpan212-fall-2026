import mongoose from 'mongoose';
import { HttpError } from '../utils/http-error.js';
import { messagesByField } from '../utils/validation.js';

// Works out the status, message and details for any error. Express knows errorHandler (below)
// is an error handler because it takes four arguments.
function describeError(err) {
  // express.json() sets type 'entity.parse.failed' when the body is not valid JSON.
  if (err.type === 'entity.parse.failed') {
    return { status: 400, message: 'Request body must be valid JSON' };
  }
  // express.json() and express.urlencoded() refuse bodies over their limit (see app.js).
  if (err.type === 'entity.too.large') {
    return { status: 413, message: 'Request body is too large' };
  }
  // The schema rejected the data, for example a title that is too short.
  if (err instanceof mongoose.Error.ValidationError) {
    return { status: 400, message: 'Validation failed', details: messagesByField(err) };
  }
  // A value that can't be converted to the schema type outside of document validation, for example
  // "lots" as the capacity in an update. The message is the schema's cast message when it has one.
  if (err instanceof mongoose.Error.CastError) {
    const message = err.message.startsWith('Cast to') ? `${err.path} has the wrong type` : err.message;
    return { status: 400, message: 'Validation failed', details: { [err.path]: message } };
  }

  const status = err.status ?? 500;
  // An HttpError was thrown on purpose, so its message is safe to show. Any other 5xx error is a bug:
  // log the details for yourself, and never send the stack trace to the client.
  if (err instanceof HttpError || status < 500) {
    return { status, message: err.message, details: err.details };
  }
  console.error(err);
  return { status, message: 'Internal server error' };
}

export function errorHandler(err, req, res, next) {
  if (res.headersSent) {
    return next(err);
  }

  const { status, message, details } = describeError(err);

  if (req.originalUrl.startsWith('/admin')) {
    return res.status(status).render('error', { title: status === 404 ? 'Not found' : 'Error', status, message });
  }
  res.status(status).json({ error: { message, details } });
}
