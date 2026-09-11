// express-session still uses callbacks. These wrap the three calls the app needs in promises,
// so controllers can await them and a failure reaches the error handler.

// Replaces the session with a new one that has a new id. Call it on login and register: an attacker who
// planted a session id in someone's browser before they logged in ("session fixation") is left with a dead id.
export function regenerateSession(req) {
  return new Promise((resolve, reject) => {
    req.session.regenerate((error) => (error ? reject(error) : resolve()));
  });
}

// Writes the session to the store now. Without it, the response can reach the browser before the store
// has the session, and the very next request (for example GET /api/auth/me) looks logged out.
export function saveSession(req) {
  return new Promise((resolve, reject) => {
    req.session.save((error) => (error ? reject(error) : resolve()));
  });
}

// Deletes the session from the store. The cookie in the browser is cleared separately.
export function destroySession(req) {
  return new Promise((resolve, reject) => {
    req.session.destroy((error) => (error ? reject(error) : resolve()));
  });
}

// Logs the user in: a new session id, then only the user's id goes into the session.
// Everything else about the user is loaded from the database on each request (see requireAuth).
export async function startUserSession(req, user) {
  await regenerateSession(req);
  req.session.userId = user.id;
  await saveSession(req);
}
