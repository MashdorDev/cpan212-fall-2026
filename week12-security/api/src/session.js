import MongoStore from 'connect-mongo';
import session from 'express-session';
import { requireEnv } from './utils/require-env.js';

// Both are checked when the app loads, before the server starts listening.
const secret = requireEnv(
  'SESSION_SECRET',
  'Run npm run generate-secret and put the output in .env.',
);
const mongoUrl = requireEnv('MONGODB_URI', 'Copy .env.example to .env and put your connection string in it.');

const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;

// The web app's proxy.js checks for a cookie with this name, so keep the two in sync.
export const SESSION_COOKIE_NAME = 'campus.sid';

export const sessionCookieOptions = {
  // JavaScript in the page can't read the cookie (document.cookie doesn't show it), so an XSS bug
  // can't copy the session id and send it somewhere else.
  httpOnly: true,
  // The browser leaves the cookie off requests that another site starts, such as a form on
  // evil.example that posts to this API. Following a normal link to the site still sends it.
  sameSite: 'lax',
  // Only sent over HTTPS. Local development runs on plain http://localhost, so this is on in production only.
  // Behind a proxy that handles HTTPS (Render), the app itself receives plain HTTP. Set TRUST_PROXY there,
  // or express-session sees an insecure request and doesn't send the cookie at all.
  secure: process.env.NODE_ENV === 'production',
};

export const sessionMiddleware = session({
  // The default name, connect.sid, tells anyone looking that the server runs Express.
  name: SESSION_COOKIE_NAME,
  // Signs the cookie, so a changed session id is rejected.
  secret,
  // Don't write the session back to the store on every request when nothing changed.
  resave: false,
  // Don't create a session (or set a cookie) for visitors who never log in.
  saveUninitialized: false,
  // Sessions live in the "sessions" collection instead of the server's memory, so a restart or a
  // second server instance doesn't log everyone out. connect-mongo opens its own connection with the same URI.
  store: MongoStore.create({ mongoUrl, collectionName: 'sessions' }),
  cookie: { ...sessionCookieOptions, maxAge: SEVEN_DAYS_MS },
});
