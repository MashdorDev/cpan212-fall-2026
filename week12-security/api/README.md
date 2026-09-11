# Week 12: Campus Events API, hardened

The Week 11 API with security headers, rate limits, a CORS allowlist, body limits and an upload check. See the week README (`../README.md`) for what changed, why, and the security tests.

## Run it

```bash
npm install
cp .env.example .env
npm run generate-secret
# paste the output into SESSION_SECRET in .env, and set MONGODB_URI
npm run seed
npm run dev
```

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Starts the API and restarts it when you save a file |
| `npm start` | Starts the API once |
| `npm run seed` | Deletes users, events and RSVPs, then inserts the demo data |
| `npm run generate-secret` | Prints a random value for `SESSION_SECRET` |
| `node examples/jwt-with-jose.js` | JWTs with `jose` (from Week 11) |
| `node --env-file=.env examples/injection-demo.js` | Why `sanitizeFilter` is on (from Week 10) |
| `node --env-file=.env examples/native-driver.js` | The `mongodb` driver without Mongoose (from Week 9) |

## Files to look at

| File | What it shows |
|---|---|
| `src/security.js` | helmet and the CSP, `cors` with an allowlist, `rateLimit` with `limit` and `standardHeaders`, `TRUST_PROXY`, `no-store` |
| `src/app.js` | The order the security middleware runs in, and `express.json({ limit: '10kb' })` |
| `src/routes/auth.routes.js` | Which routes get the login limiter, and why `/me` doesn't |
| `src/middleware/upload-image.js` | Checking the first bytes of an upload |
| `public/js/events-page.js` | The script that used to be inline in `public/index.html` |
| `scripts/generate-secret.js` | `randomBytes(32).toString('base64')` |

The routes are the same as Week 11. The `bruno/` collection runs the same flow, plus a register request with wrong types. Running it more than once in 15 minutes can hit the login limit (the collection logs in several times): restart the API to reset it.
