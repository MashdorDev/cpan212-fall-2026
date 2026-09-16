// TODO (you): STEP 4 - print one line in your terminal for every finished request, like this:
// GET /api/events?category=arts 200 3ms
// Save the start time with performance.now(). Listen with res.on('finish', ...) so the line is
// printed after the response has been sent and the status code is final. Print req.method,
// req.originalUrl, res.statusCode and the rounded milliseconds. Then call next() right away, so
// the request carries on to the next middleware instead of stopping here.
export function requestLogger(req, res, next) {
  next();
}
