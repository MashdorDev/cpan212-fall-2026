// Express knows this is an error handler because it takes four arguments.
export function errorHandler(err, req, res, next) {
  if (res.headersSent) return next(err);

  // TODO (you): step 5, validation errors (requirement 9).
  //   1. Import mongoose at the top of this file.
  //   2. If err is a mongoose.Error.ValidationError, send 400 with
  //        { error: { message: 'Validation failed', details: { <field>: <message>, ... } } }
  //      err.errors is an object with one entry per invalid field, and each
  //      entry has a .message.
  //   3. If err is a mongoose.Error.CastError, send 400 in the same shape, with
  //      err.path as the field. An update with "abc" for a number ends up here.

  // express.json() sets type 'entity.parse.failed' when the body is not valid JSON.
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ error: { message: 'Request body must be valid JSON' } });
  }

  // Anything else is a bug: log the details for yourself, and never send the
  // stack trace to the client.
  console.error(err);
  res.status(500).json({ error: { message: 'Internal server error' } });
}
