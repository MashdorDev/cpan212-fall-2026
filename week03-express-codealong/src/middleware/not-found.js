// TODO (you): STEP 5 - answer 404 instead of the 501 below, in the error shape this API uses:
// { error: { message: ... } }, with a message naming the method and the path that matched nothing.
// req.method is the method and req.path is the path without the query string.
export function notFound(req, res) {
  res.status(501).json({ error: { message: `Not written yet: no route for ${req.method} ${req.path}` } });
}
