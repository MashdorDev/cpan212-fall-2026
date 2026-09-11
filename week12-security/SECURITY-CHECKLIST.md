# Security checklist: OWASP Top 10 (2021) in Campus Events

The OWASP Top 10 is a list of the most common and most damaging kinds of web application security problems. This page goes through the 2021 edition one category at a time and points at the places in this week's code that deal with it, and at what is still missing. Use the same structure for your own project: for every category, either name the file that handles it or write down why it doesn't apply.

OWASP published a 2025 edition as well. It reorders the list and adds two categories (Software Supply Chain Failures, and Mishandling of Exceptional Conditions), but most of the ideas below carry over. File paths are relative to `week12-security/`.

## A01 Broken Access Control

Users doing things they shouldn't be allowed to: editing someone else's data, reading private data, reaching pages that should need a login.

What this app does:

- `api/src/middleware/require-auth.js`: `requireAuth` answers 401 on every route that changes data, and `assertOrganizer` answers 403 when you aren't the event's organizer (PATCH and DELETE on events, and the RSVP list).
- `api/src/controllers/events.controller.js`: `pickEditableFields()` copies only known fields from the body, and `organizer` comes from the session. A client can't create an event in someone else's name or move an event to a different organizer.
- `api/src/controllers/rsvps.controller.js`: the RSVP name and email come from the logged-in user, not the body, and only the organizer can list attendees (their emails are personal data).
- `api/src/controllers/admin.controller.js`: the admin pages check ownership again on delete, even though the page only shows Delete on your own events. Hiding a button is not access control.
- `api/src/security.js`: CORS allows only the origins listed in `CORS_ORIGINS`, never `*` with credentials.
- Cross-site request forgery: the session cookie is `SameSite=Lax` (`api/src/session.js`), so a form on another site that posts to the API or the admin pages arrives without the cookie.

Still missing:

- `web/proxy.js` only checks that a cookie exists. That is fine as a convenience, as long as every API route keeps its own check. Adding a route without `requireAuth` would be a hole that the web app can't see.
- No roles. Every account can use the admin pages for its own events. A real campus site would have an admin role, checked on the server.
- No CSRF tokens. `SameSite=Lax` stops the common cases in current browsers, but OWASP treats it as an extra layer, not complete CSRF protection: a GET request that changes data, or a request from another subdomain of the same site, still carries the cookie. Very old browsers ignore it.

## A02 Cryptographic Failures

Sensitive data sent or stored without proper protection: passwords in plain text, weak hashing, no HTTPS, secrets in the code.

What this app does:

- `api/src/services/auth.service.js`: passwords are hashed with bcrypt at cost 12 and never stored or returned. `api/src/models/User.js` removes `passwordHash` from every JSON response.
- `api/src/session.js`: the cookie is signed with `SESSION_SECRET`, which comes only from the environment (`npm run generate-secret` makes one). The cookie is `Secure` in production.
- HTTPS is handled by Render and Vercel, and helmet sends `Strict-Transport-Security` so browsers keep using it (`docs/local-https.md`).
- Atlas connection strings (`mongodb+srv://`) use TLS by default.

Still missing:

- OWASP's first choice for password hashing is Argon2id. bcrypt at cost 10 or more is acceptable, not ideal.
- No way to rotate `SESSION_SECRET` without logging everyone out. (express-session accepts an array of secrets, newest first, which would allow it.)

## A03 Injection

Untrusted input changing the meaning of a query or a page: NoSQL operator injection, regular expression injection, cross-site scripting (XSS).

What this app does:

- `api/src/db.js`: `mongoose.set('sanitizeFilter', true)` turns `{ "$ne": null }` from a request into a plain value. `api/examples/injection-demo.js` shows the attack with it off.
- `api/src/controllers/auth.controller.js`: register and login reject objects and arrays where text belongs, with a 400.
- `api/src/utils/event-list-query.js`: `?q` is escaped before `new RegExp()`, `?sort` must be one of three field names, `?page` and `?limit` must be whole numbers in range, and repeated parameters are a 400.
- `api/src/models/*.js`: the schemas cast every field to its type and reject what doesn't fit.
- XSS: EJS `<%= %>` escapes output, React escapes text in JSX, and `api/public/js/events-page.js` uses `textContent`, not `innerHTML`. The CSP from helmet (`api/src/security.js`) only runs scripts served by the API itself, so an injected `<script>` tag or `onclick` attribute doesn't run.

Still missing:

- `imageUrl` accepts any https address. The browser loads it, which tells that site the visitor's IP address. A stricter app would only allow uploads.
- The Next.js app sends no Content Security Policy of its own.

## A04 Insecure Design

Problems in how a feature was planned, which no amount of careful coding fixes.

What this app does:

- The RSVP flow checks for an existing RSVP, then capacity, and a unique index on `{ event, email }` guarantees one RSVP per person even when two requests arrive at once (`api/src/models/Rsvp.js`).
- Logins are rate limited, and the login response is the same for an unknown email and a wrong password.

Still missing:

- The capacity check can be beaten by two requests for the last spot at the same moment. The comment in `api/src/controllers/rsvps.controller.js` explains the atomic update that would fix it.
- No email verification, so anyone can register with an address they don't own and RSVP in that person's name.
- No password reset. A user who forgets their password is stuck.
- Uploaded images are files on the API server's disk. On Render's free plan the disk is wiped on every deploy and restart, and the images disappear (Week 13).

## A05 Security Misconfiguration

Unsafe defaults, extra information in errors, missing security headers, debug settings left on.

What this app does:

- `api/src/security.js`: helmet sets the security headers and removes `X-Powered-By`. `upgrade-insecure-requests` is only sent in production, where HTTPS exists.
- `api/src/middleware/error-handler.js`: unexpected errors are logged on the server, and the client only gets "Internal server error". No stack traces, file paths or database messages reach the browser.
- `api/src/utils/require-env.js`, `api/src/session.js`, `api/src/security.js`: the API refuses to start without `MONGODB_URI` or `SESSION_SECRET`, or with a malformed `TRUST_PROXY`. There are no fallback values that would let a misconfigured server run.
- `api/src/app.js`: JSON and form bodies are limited to 10 KB (413 when bigger), and `api/src/middleware/upload-image.js` limits uploads to one 2 MB file and 20 short text fields.
- `.env` is in `.gitignore`, and `.env.example` only has fake values.
- The session cookie is renamed from `connect.sid` to `campus.sid`, and `saveUninitialized: false` means visitors who never log in get no session.

Still missing:

- Mongoose builds indexes when the app starts (`autoIndex`). On a large production database that can slow startup, and teams usually build indexes separately.
- `TRUST_PROXY` has to match the real number of proxies. Too low and every visitor shares one rate limit; too high and clients can fake their IP address.

## A06 Vulnerable and Outdated Components

Libraries with known security bugs.

What this app does:

- Current major versions: Express 5.2, Mongoose 9, Multer 2.3 (versions before 2.3.0 have denial-of-service advisories), helmet 8, express-rate-limit 8, bcryptjs 3, Next.js 16.3.
- `package-lock.json` is committed in both folders, so everyone installs the same versions. `npm audit` reported 0 vulnerabilities for `api` and `web` on 2026-09-11.

Still missing:

- Nothing checks for new advisories automatically. Run `npm audit` and `npm outdated` before each milestone, or turn on Dependabot alerts in your GitHub repository.

## A07 Identification and Authentication Failures

Weak logins: guessable passwords, unlimited attempts, session ids that can be stolen or reused.

What this app does:

- `api/src/security.js`: `authLimiter` allows 10 login or register attempts per IP address every 15 minutes, shared between the API and the admin login form, then answers 429.
- `api/src/services/auth.service.js`: passwords must be 8 characters to 72 bytes, and a bcrypt comparison runs even for an unknown email, so response times don't reveal which emails have accounts.
- `api/src/utils/session.js`: a new session id on every login and register, which stops session fixation.
- `api/src/session.js`: the cookie is `httpOnly` (no JavaScript access), `SameSite=Lax`, `Secure` in production, and expires after 7 days. Sessions live in MongoDB, so logging out deletes the session on the server, not only the cookie.
- `api/src/security.js`: `Cache-Control: no-store` on responses for a logged-in user, so pages don't come back from the browser cache after logout.

Still missing:

- No multi-factor authentication.
- No check against lists of breached passwords. `password1` passes the rules.
- The rate limit is per IP address, not per account. An attacker with many IP addresses can still try one password against many accounts.
- No "log out everywhere" button, and no shorter idle timeout than 7 days.

## A08 Software and Data Integrity Failures

Trusting code or data without checking it has not been changed.

What this app does:

- `api/src/middleware/upload-image.js`: the first bytes of every upload must match a real JPEG, PNG or WebP file. A text file renamed to `photo.png` is deleted and rejected. Files are saved under a random name, never the name the browser sent.
- The session cookie is signed. A cookie with a changed session id is rejected, and the request counts as logged out.
- `npm ci` (used for deployment in Week 13) installs exactly what `package-lock.json` lists, and fails if the two don't match.

Still missing:

- No automated tests or CI that run before a deploy, so a broken or unsafe change can go straight to production.

## A09 Security Logging and Monitoring Failures

Attacks that go unnoticed because nothing is recorded or nobody looks.

What this app does:

- `api/src/middleware/request-logger.js`: one line per request with method, URL, status and time, so failed logins (401), blocked attempts (429) and forbidden actions (403) show up in the logs.
- `api/src/middleware/error-handler.js`: unexpected errors are logged in full on the server.
- Request bodies are never logged, so passwords don't end up in log files.

Still missing:

- No alerts. Nobody is told when there are 500 failed logins in an hour.
- Render's free plan keeps logs for a limited time, and they aren't searchable by user.
- No request ids to follow one request through the web app and the API.

## A10 Server-Side Request Forgery (SSRF)

The server fetching a URL that an attacker controls, which can reach internal services the attacker can't.

What this app does:

- `api/src/services/holidays.service.js`: the only outgoing request goes to a base URL from the environment (`HOLIDAY_API_BASE_URL`), never to a URL from a request, and it times out after 5 seconds.
- `imageUrl` is stored and shown in the browser, but the server never fetches it.

Still missing:

- Nothing to miss today. If you add a feature that fetches a user-supplied URL on the server (a link preview, "import image from URL"), allow only specific hosts and block private addresses such as `127.0.0.1`, `10.0.0.0/8` and `169.254.169.254`.
