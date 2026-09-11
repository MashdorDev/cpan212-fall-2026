// Logs one line per request once the response has been sent, for example:
// GET /api/events?category=arts 200 3ms 203.0.113.7
// The last part, req.ip, is how you check TRUST_PROXY after deploying: behind Render it should be each
// visitor's own address, not the same internal address on every line.
export function requestLogger(req, res, next) {
  const started = performance.now();
  res.on('finish', () => {
    const ms = Math.round(performance.now() - started);
    console.log(`${req.method} ${req.originalUrl} ${res.statusCode} ${ms}ms ${req.ip}`);
  });
  next();
}
