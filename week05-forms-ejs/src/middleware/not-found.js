// Runs only when no route above it matched the request.
export function notFound(req, res) {
  // Admin pages are HTML, so a person gets a page instead of JSON.
  if (req.originalUrl.startsWith('/admin')) {
    res.status(404);
    res.render('error', { title: 'Not found', status: 404, message: 'No route for ' + req.method + ' ' + req.path });
    return;
  }
  res.status(404).json({ error: { message: `No route for ${req.method} ${req.path}` } });
}
