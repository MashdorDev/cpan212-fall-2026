// TODO (you): STEP 7 - turn an error that was thrown anywhere in the app into one JSON response.
// Keep all four parameters, or Express will treat this as an ordinary middleware and never send
// errors to it. Take the status from err.status, fall back to 500, and send err.message and
// err.details in this API's error shape.
// TODO (you): STEP 8 - finish the same function: hand the error on with next(err) when
// res.headersSent is already true, answer 400 when err.type is 'entity.parse.failed' (the body was
// not valid JSON), and for anything else that is a 500, console.error the error and send a short
// message instead of its own.
export function errorHandler(err, req, res, next) {
  // Until you write this, Express answers with its own error page, which includes the stack trace.
  next(err);
}
