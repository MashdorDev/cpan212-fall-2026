# Week 12: Security

The Week 11 app, hardened. The API now sends security headers with a Content Security Policy, limits login attempts and overall traffic, allows CORS only for listed origins, refuses oversized bodies and fake images, and keeps private responses out of caches. Nothing about how you use the app changes: every page and route from Week 11 works the same way.

| Folder or file | What it is |
|---|---|
| `api/` | The Express API (port 4000) with helmet, rate limits, CORS, body limits and the upload check |
| `web/` | The Next.js app (port 3000). No changes since Week 11. |
| `SECURITY-CHECKLIST.md` | The OWASP Top 10 (2021), category by category, with the files that handle each one and what is still missing |
| `docs/local-https.md` | HTTPS on your own computer with mkcert, and why deployed apps don't need HTTPS code |

## Run both (two terminals)

Terminal 1, the API:

```bash
cd api
npm install
cp .env.example .env
npm run generate-secret
# paste the output into SESSION_SECRET in .env, and set MONGODB_URI
npm run seed
npm run dev
```

Terminal 2, the Next.js app:

```bash
cd web
npm install
cp .env.example .env
npm run dev
```

The demo accounts are the same as Week 11: `ava@example.com` / `campus-demo-ava` and `sam@example.com` / `campus-demo-sam`.

## Environment variables

| Folder | Name | Example | Purpose |
|---|---|---|---|
| `api` | `PORT` | `4000` | Port the API listens on |
| `api` | `MONGODB_URI` | `mongodb://127.0.0.1:27017/campus_events` | **Required.** Events, users and sessions |
| `api` | `SESSION_SECRET` | output of `npm run generate-secret` | **Required.** Signs the session cookie |
| `api` | `NODE_ENV` | `development` | `production` turns on the `Secure` cookie flag and the `upgrade-insecure-requests` CSP directive |
| `api` | `CORS_ORIGINS` | `http://localhost:5173` | Browser origins allowed to call the API directly, separated by commas. Empty means none. |
| `api` | `TRUST_PROXY` | empty | Number of proxies in front of the API. Empty on your computer, `1` on Render. Must be a whole number. |
| `api` | `HOLIDAY_API_BASE_URL` | `https://date.nager.at/api/v3` | Base URL of the holiday API |
| `web` | `API_ORIGIN` | `http://localhost:4000` | Where the API runs |

## What changed since Week 11

All the changes are in `api/`:

| File | Change |
|---|---|
| `src/security.js` | New. helmet with a Content Security Policy, the CORS allowlist, the login and general rate limiters, `TRUST_PROXY`, and `Cache-Control: no-store` for logged-in responses |
| `src/app.js` | Uses everything from `security.js` in order, and limits JSON and form bodies to 10 KB |
| `src/routes/auth.routes.js`, `src/routes/admin.routes.js` | The login limiter on register, API login and the admin login form |
| `public/index.html`, `public/js/events-page.js` | The inline `<script>` moved into a file, because the CSP blocks inline scripts |
| `src/middleware/upload-image.js` | Reads the first bytes of each upload and deletes files that aren't really JPEG, PNG or WebP. Limits the number and size of text fields in the form. |
| `src/middleware/error-handler.js`, `src/utils/validation.js` | 413 for oversized bodies, and "title has the wrong type" instead of Mongoose's cast message |
| `src/controllers/auth.controller.js` | 400 when register or login get objects or arrays instead of text |
| `src/services/auth.service.js` | Login refuses passwords over 72 bytes before running bcrypt |
| `src/session.js` | Explains why the `Secure` cookie needs `TRUST_PROXY` behind a proxy |
| `scripts/generate-secret.js` | New. `npm run generate-secret` prints a random 32-byte secret in base64 |
| `bruno/` | Adds "Register with wrong types" |

## Things to notice

- **The Content Security Policy.** helmet's policy allows scripts only from the API's own origin (`script-src 'self'`) and no inline event handlers (`script-src-attr 'none'`). An injected `<script>` or `onclick="..."` doesn't run. That is why `public/index.html` now loads `js/events-page.js`, and why the admin pages have used `public/js/confirm-delete.js` with `addEventListener` since Week 5. Open the admin pages with the devtools console open: there are no CSP errors. Try adding `<script>alert(1)</script>` to `index.html` and reload to see the browser refuse it.
- **`upgrade-insecure-requests` only in production.** It tells the browser to switch `http://` loads to `https://`. On `http://localhost` there is no HTTPS, and Safari then fails to load the admin CSS and JavaScript.
- **Two rate limits.** Register and login (API and admin form together) allow 10 attempts per IP address every 15 minutes, then answer 429 with `RateLimit`, `RateLimit-Policy` and `Retry-After` headers. `GET /api/auth/me` is left out, because the header calls it on every page. The whole `/api` gets a looser 300 requests per 15 minutes. Limits are kept in memory, so restarting the API resets them.
- **Rate limits and proxies.** A rate limit counts by `req.ip`. Behind a proxy, every request arrives from the proxy, so every visitor shares one count. `TRUST_PROXY=1` tells Express to read the visitor's address from `X-Forwarded-For`. Set it only when there really is a proxy: without one, anyone could send `X-Forwarded-For: 1.2.3.4` and get a fresh count on every request. The Next.js rewrite is a proxy too, and locally it does not add `X-Forwarded-For`, so every browser request from the web app counts against the Next.js server's address. Week 13 covers what that means once deployed.
- **`TRUST_PROXY` and cookies.** With `NODE_ENV=production`, the session cookie is `Secure`. Behind a proxy that handles HTTPS, the API itself receives plain HTTP, and express-session won't send a `Secure` cookie over what looks like HTTP. The login answers 200, but no cookie arrives, and the next request is logged out. `TRUST_PROXY=1` lets Express believe the proxy's `X-Forwarded-Proto: https`.
- **CORS is for the other setup.** The web app doesn't need CORS: its browser code calls `/api` on its own origin. `CORS_ORIGINS` is for a front end on another origin that calls the API directly. The list is exact, never `*`, because `credentials: true` with a wildcard would let any site send requests with a visitor's cookie. Even with CORS, a cookie across two different sites (for example `your-app.vercel.app` and `your-api.onrender.com`) needs `SameSite=None; Secure`, and browsers that block third-party cookies refuse it anyway. Images are also affected: helmet sends `Cross-Origin-Resource-Policy: same-origin`, so another origin can't embed `/uploads` images. The rewrite avoids all of this.
- **Fake images.** The browser's `Content-Type` for a file comes from its extension. A text file renamed to `photo.png` arrives as `image/png`. The upload middleware reads the first 12 bytes and compares them with the real JPEG, PNG and WebP signatures, and deletes the file if they don't match.
- **Body limits.** 10 KB is plenty for an event or a login. A bigger JSON body gets a 413 JSON error, and a bigger admin form gets a 413 page.
- **Read every response body.** Once the API sends these extra headers, Chrome keeps a response open when the page never reads its body, for example a 401 from `/api/auth/me` that the code only checks with `res.ok`. The Network tab shows the request as never finishing, and the connection stays busy. `web/components/AuthProvider.js`, `web/app/saved/page.js` and `web/lib/events.js` read the body before checking the status (the Week 11 folder has the same code). Do the same in your own fetch code.
- **`no-store`.** Responses for a logged-in user, and every `/api/auth` response, tell the browser and any cache in between not to keep a copy. Log in, open your RSVP list, log out, press Back: the browser asks the server again instead of showing the old page.

## Security tests run

Run on 2026-09-11 against MongoDB 8.3 (Docker) with the API and web app started from this folder, then repeated in Week 13's copy. All passed.

| Test | Result |
|---|---|
| Start without `SESSION_SECRET` | Exits with "SESSION_SECRET is not set. Run npm run generate-secret and put the output in .env." |
| Start with `TRUST_PROXY=true` | Exits with "TRUST_PROXY must be a whole number..." |
| `npm run generate-secret` | Prints a 44-character base64 value |
| Headers on `/api/health`, `/` and `/admin/login` | `Content-Security-Policy`, `Strict-Transport-Security`, `X-Content-Type-Options: nosniff`, `X-Frame-Options`, `Referrer-Policy`, `Cross-Origin-Resource-Policy` present. `X-Powered-By` absent. |
| `upgrade-insecure-requests` | Absent in development, present with `NODE_ENV=production` |
| CSP in Chrome (headless) | Static page lists events through `events-page.js`, admin login works, admin CSS applies, the delete confirmation dialog opens, no CSP violations in the console |
| CORS | `Origin: http://localhost:5173` gets `Access-Control-Allow-Origin` and `-Credentials`. `Origin: https://evil.example` gets no `Access-Control-Allow-Origin` header, so the browser blocks the response. Preflight from the allowed origin lists methods and headers. |
| 20 KB JSON body, 20 KB admin form | 413 JSON error, 413 HTML page |
| Objects and arrays instead of text | Register: 400 "Must be text". Login: 400. Event with an object title and an array category: 400 "title has the wrong type". `?q=a&q=b`: 400 "Send q only once". |
| Login with a 100-byte password | 401, no bcrypt comparison |
| Text file uploaded as `fake.png` (and as `fake.jpg`) | 400 "That file is not a real JPEG, PNG or WebP image", and `uploads/` is empty afterwards. A real PNG is accepted and served with `nosniff`. |
| `Cache-Control` | `no-store` on `/api/auth/me`, on a failed login, and on `GET /api/events` with a session. None on `GET /api/events` without one. |
| Ownership after the changes | 401 creating an event logged out, 403 for Sam editing Ava's event or reading its RSVP list |
| 11 logins with a wrong password | 1 to 10 answer 401, 11 answers 429 with `RateLimit`, `RateLimit-Policy` and `Retry-After`. The correct password is also refused during the lockout. |
| Shared login limit | After the API lockout, the admin login form answers a 429 page, and register answers 429. `GET /api/auth/me` still answers normally. |
| Spoofed `X-Forwarded-For` without `TRUST_PROXY` | Ignored, still 429 |
| With `TRUST_PROXY=1` and `NODE_ENV=production` | Each `X-Forwarded-For` address gets its own count. Login with `X-Forwarded-Proto: https` sets a `Secure` cookie. Without that header, login answers 200 and sets no cookie. |
| 302 requests to `/api/health` | 300 allowed, then 429 with JSON |
| `npm audit` in `api` and `web` | 0 vulnerabilities |

## Try it

```bash
# Headers
curl -I http://localhost:4000/api/health

# Login rate limit: the last lines show 429
for i in $(seq 1 11); do
  curl -s -o /dev/null -w "%{http_code}\n" -X POST -H "Content-Type: application/json" \
    -d '{"email":"ava@example.com","password":"wrong"}' http://localhost:4000/api/auth/login
done

# CORS: compare the headers for an allowed and a different origin (set CORS_ORIGINS=http://localhost:5173 first)
curl -s -D - -o /dev/null -H "Origin: http://localhost:5173" http://localhost:4000/api/events
curl -s -D - -o /dev/null -H "Origin: https://evil.example" http://localhost:4000/api/events
```

Restart the API to clear the rate limit after trying it.
