// Runs only when no route above it matched the request.
export function notFound(req, res) {
  const message = `No route for ${req.method} ${req.path}`;
  // Admin pages are HTML, so a person gets a page instead of JSON.
  if (req.originalUrl.startsWith('/admin')) {
    return res.status(404).render('error', { title: 'Not found', status: 404, message });
  }
  res.status(404).json({ error: { message } });
}
