// express-session uses callbacks, from before async and await existed.
// These two functions wrap them in promises, so the controllers can write await.

// Logs the user in.
export function startUserSession(req, user) {
  return new Promise(function (resolve, reject) {
    // A new session with a new id. If someone planted a session id in this browser before
    // the login, that old id is now useless.
    req.session.regenerate(function (error) {
      if (error) {
        reject(error);
        return;
      }

      // Only the user's id goes in the session. requireAuth loads the rest from the database.
      req.session.userId = user.id;

      // Save now, so the session is in the database before the response reaches the browser.
      req.session.save(function (saveError) {
        if (saveError) {
          reject(saveError);
          return;
        }
        resolve();
      });
    });
  });
}

// Logs the user out: deletes the session from the database.
export function endUserSession(req) {
  return new Promise(function (resolve, reject) {
    req.session.destroy(function (error) {
      if (error) {
        reject(error);
        return;
      }
      resolve();
    });
  });
}
