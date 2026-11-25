import MongoStore from 'connect-mongo';
import session from 'express-session';

// The cookie's name. The web app's proxy.js looks for a cookie with this name, so keep the two the same.
export const SESSION_COOKIE_NAME = 'campus.sid';

const SEVEN_DAYS = 7 * 24 * 60 * 60 * 1000;

// Both values are needed before the API can start, so check them now.
const secret = process.env.SESSION_SECRET;
if (!secret) {
  console.error('SESSION_SECRET is not set. Copy it from .env.example into .env and put a long random value after the =.');
  process.exit(1);
}
const mongoUrl = process.env.MONGODB_URI;
if (!mongoUrl) {
  console.error('MONGODB_URI is not set. Copy .env.example to .env and put your connection string in it.');
  process.exit(1);
}

// TODO STEP 2a: where sessions are saved
// In the "sessions" collection, not in the server's memory, so restarting the API doesn't log
// everyone out. Type under this comment:
//
//   const store = MongoStore.create({ mongoUrl: mongoUrl, collectionName: 'sessions' });

// TODO STEP 2b: the session middleware and its cookie
// The browser only gets a random session id in a cookie. The data (who is logged in) stays in MongoDB.
// Replace the 3 lines of sessionMiddleware below with:
//
//   export const sessionMiddleware = session({
//     name: SESSION_COOKIE_NAME,
//     // Signs the cookie. A cookie someone changed by hand no longer matches, and is ignored.
//     secret: secret,
//     store: store,
//     // Don't save a session that didn't change.
//     resave: false,
//     // Don't make a session (or send a cookie) until someone logs in.
//     saveUninitialized: false,
//     cookie: {
//       // JavaScript in the page can't read this cookie, so a script injected into the page can't steal it.
//       httpOnly: true,
//       // The browser doesn't send the cookie when another site posts a form to this API.
//       sameSite: 'lax',
//       // Only over HTTPS. Your computer uses plain http://localhost, so this is on only when deployed.
//       secure: process.env.NODE_ENV === 'production',
//       maxAge: SEVEN_DAYS,
//     },
//   });
//
// Check: nothing yet. Step 2c turns it on.
export const sessionMiddleware = function (req, res, next) {
  next();
};
