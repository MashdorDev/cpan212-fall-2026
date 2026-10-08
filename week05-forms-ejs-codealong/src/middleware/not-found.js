// Runs only when no route above it matched the request.
export function notFound(req, res) {
  // TODO (you): STEP 12a - add an if here: under /admin, render the error page instead of sending JSON.
  res.status(404).json({ error: { message: `No route for ${req.method} ${req.path}` } });
}
