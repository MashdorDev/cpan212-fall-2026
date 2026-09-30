// Logs one line per request once the response has been sent, for example:
// GET /api/events?category=arts 200 3ms
export function requestLogger(req, res, next) {
  const started = performance.now();
  res.on('finish', () => {
    const ms = Math.round(performance.now() - started);
    console.log(`${req.method} ${req.originalUrl} ${res.statusCode} ${ms}ms`);
  });
  next();
}
