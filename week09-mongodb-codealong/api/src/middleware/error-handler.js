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

  // TODO STEP 6b: turn a schema error into a 400.
  // Why: when a schema rule fails, Mongoose throws a ValidationError. Without this block it falls
  // through to the 500 below. The web form expects 400 with one message per field in "details".
  // Delete these TODO lines and type:
  //
  //   // The schema rejected the data. err.errors has one entry per field that broke a rule.
  //   if (err instanceof mongoose.Error.ValidationError) {
  //     const details = {};
  //     for (const field in err.errors) {
  //       details[field] = err.errors[field].message;
  //     }
  //     return res.status(400).json({ error: { message: 'Validation failed', details: details } });
  //   }
  //
  // Check: press Create event with the form empty. Red messages appear under the fields.

  // An update with a value Mongoose can't convert, like "lots" for capacity, throws a CastError
  // instead of a ValidationError. err.path is the field name.
  if (err instanceof mongoose.Error.CastError) {
    const details = {};
    details[err.path] = err.message;
    return res.status(400).json({ error: { message: 'Validation failed', details: details } });
  }

  const status = err.status ?? 500;
  // An HttpError was thrown on purpose, so its message is safe to show. Any other 5xx error is a bug:
  // log the details for yourself, and never send the stack trace to the client.
  const expected = err instanceof HttpError || status < 500;
  if (!expected) {
    console.error(err);
  }
  const message = expected ? err.message : 'Internal server error';

  if (req.originalUrl.startsWith('/admin')) {
    return res.status(status).render('error', { title: status === 404 ? 'Not found' : 'Error', status, message });
  }
  res.status(status).json({ error: { message, details: err.details } });
}
