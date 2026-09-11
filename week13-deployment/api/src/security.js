import cors from 'cors';
import { rateLimit } from 'express-rate-limit';
import helmet from 'helmet';
import { HttpError } from './utils/http-error.js';

const isProduction = process.env.NODE_ENV === 'production';
const FIFTEEN_MINUTES_MS = 15 * 60 * 1000;

// helmet sets response headers that tell the browser to be stricter: no sniffing file types, no framing the
// pages on other sites, no Referer to other sites, HTTPS only (HSTS), and a Content Security Policy (CSP).
// It also removes X-Powered-By, which tells anyone looking that the server runs Express.
export const helmetMiddleware = helmet({
  contentSecurityPolicy: {
    // Merged into helmet's default policy: default-src 'self', script-src 'self', style-src 'self' https:
    // 'unsafe-inline', and more. script-src 'self' blocks inline <script> tags and onclick="..." attributes,
    // which is why public/index.html and the admin pages load their JavaScript from files in public/js/.
    directives: {
      // Event images are uploads on this site or any https:// address (see imageUrl in models/Event.js).
      'img-src': ["'self'", 'data:', 'https:'],
      // Tells the browser to load http:// resources over https://. On http://localhost there is no https,
      // and Safari then fails to load the admin CSS and JavaScript, so only send it in production.
      'upgrade-insecure-requests': isProduction ? [] : null,
    },
  },
});

// CORS is for browsers on another origin that call this API directly, for example a front end on
// http://localhost:5173 or a deployed site with no rewrite. The Next.js app doesn't need it: its browser code
// calls /api on its own origin, and the rewrite forwards the request server to server, where CORS doesn't apply.
// CORS_ORIGINS=http://localhost:3000,https://campus-events.example lists the origins to allow.
const allowedOrigins = (process.env.CORS_ORIGINS ?? '')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

export const corsMiddleware = cors({
  // An exact list, never origin: true or '*'. With credentials, a reflected or wildcard origin would let any
  // site make requests that carry a visitor's cookie. Other origins get no Access-Control-Allow-Origin header, so the browser
  // refuses to show them the response.
  origin: allowedOrigins,
  // Allows cookies on cross-origin requests from the listed origins. The browser also needs
  // fetch(url, { credentials: 'include' }), and a cookie on a different site needs SameSite=None and Secure,
  // which is exactly the kind of setup the rewrite lets you avoid.
  credentials: true,
});

// express-rate-limit counts requests per IP address in memory and answers 429 once a client goes over.
// Both limiters pass the 429 to the error handler as an HttpError, so API clients get the usual JSON error
// and the admin login form gets an HTML error page.
function tooManyRequests(message) {
  return (req, res, next, options) => next(new HttpError(options.statusCode, message));
}

// For login and register: 10 attempts per IP address every 15 minutes, shared by the API and the admin login
// form. That is plenty for a person who mistyped a password, and far too few to guess passwords.
export const authLimiter = rateLimit({
  windowMs: FIFTEEN_MINUTES_MS,
  limit: 10,
  // Sends RateLimit and RateLimit-Policy headers (the IETF draft 8 format), so a client can see how many
  // attempts are left. legacyHeaders: false leaves out the older X-RateLimit-* headers.
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  handler: tooManyRequests('Too many login or register attempts. Try again in 15 minutes.'),
});

// A looser limit for the whole API, against scripts that hammer it: 300 requests per IP address every 15 minutes.
export const apiLimiter = rateLimit({
  windowMs: FIFTEEN_MINUTES_MS,
  limit: 300,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  handler: tooManyRequests('Too many requests. Try again in a few minutes.'),
});

// TRUST_PROXY is the number of proxies between the internet and this app. Leave it unset when there are none
// (your laptop). Then req.ip is the address that connected, and X-Forwarded-For headers are ignored.
// Behind a proxy (Render's load balancer), every request connects from the proxy, so every visitor shares
// one IP address and one rate limit. TRUST_PROXY=1 tells Express to take the client address from the
// X-Forwarded-For header the proxy adds, and to believe X-Forwarded-Proto: https, which express-session needs
// before it sends a Secure cookie. Never set it higher than the real number of proxies: Express would then
// read addresses the client wrote into the header itself, and anyone could dodge the rate limit.
function readTrustProxy() {
  const value = process.env.TRUST_PROXY;
  if (!value) {
    return null;
  }
  if (!/^\d+$/.test(value)) {
    console.error('TRUST_PROXY must be a whole number (the number of proxies in front of the app), for example 1.');
    process.exit(1);
  }
  return Number(value);
}

export const trustProxyHops = readTrustProxy();

// Responses for a logged-in user can hold private data: your email, the RSVP list for your event.
// no-store tells the browser, and any proxy or CDN in between, not to keep a copy. Without it, pressing Back
// after logging out can show a cached page, and a shared cache could hand one person's data to another.
export function noStoreWhenLoggedIn(req, res, next) {
  if (req.session.userId || req.originalUrl.startsWith('/api/auth')) {
    res.set('Cache-Control', 'no-store');
  }
  next();
}
