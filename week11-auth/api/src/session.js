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

// Sessions are saved in the "sessions" collection, not in the server's memory,
// so restarting the API doesn't log everyone out.
const store = MongoStore.create({ mongoUrl: mongoUrl, collectionName: 'sessions' });

const cookieSettings = {
  // JavaScript in the page can't read this cookie, so a script injected into the page can't steal it.
  httpOnly: true,
  // The browser doesn't send the cookie when another site posts a form to this API.
  sameSite: 'lax',
  // Only over HTTPS. Your computer uses plain http://localhost, so this is on only when deployed.
  secure: process.env.NODE_ENV === 'production',
  maxAge: SEVEN_DAYS,
};

export const sessionMiddleware = session({
  name: SESSION_COOKIE_NAME,
  // Signs the cookie. A cookie someone changed by hand no longer matches, and is ignored.
  secret: secret,
  store: store,
  // Don't save a session that didn't change.
  resave: false,
  // Don't make a session (or send a cookie) until someone logs in.
  saveUninitialized: false,
  cookie: cookieSettings,
});
