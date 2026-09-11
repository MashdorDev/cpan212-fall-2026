# Week 13: Deployment

The Week 12 app, ready to put online: the API on Render, the web app on Vercel, and the data in MongoDB Atlas. The features are the same as Week 12. The changes are the things a hosted app needs: a health check that includes the database, a clean shutdown when the host stops the process, pinned Node versions, a Render Blueprint, and a web build that refuses to go out without the API's address.

| Folder or file | What it is |
|---|---|
| `api/` | The Express API. Runs on Render. |
| `web/` | The Next.js app. Runs on Vercel. |
| `render.yaml` | Render Blueprint for the API |
| `docs/deploy.md` | Step by step: Atlas network access, Render, Vercel, environment variables, logs, and a troubleshooting table |

## Run it locally first

Deploying doesn't fix bugs, it only moves them somewhere harder to debug. Make sure both parts work on your computer before you deploy.

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
npm run build
npm start
```

`npm run build` followed by `npm start` runs the production build, which is what Vercel runs. It catches problems `npm run dev` doesn't show, such as lint errors that fail the build.

Then follow `docs/deploy.md`.

## Environment variables

| Folder | Name | On your computer | On Render or Vercel |
|---|---|---|---|
| `api` | `PORT` | `4000` | Set by Render, don't add it |
| `api` | `MONGODB_URI` | local or Atlas connection string | Atlas connection string for a production database user (`sync: false` in `render.yaml`) |
| `api` | `SESSION_SECRET` | output of `npm run generate-secret` | a different generated value (`sync: false`) |
| `api` | `NODE_ENV` | `development` | `production` |
| `api` | `TRUST_PROXY` | empty | `1` |
| `api` | `CORS_ORIGINS` | empty | empty (the web app uses the rewrite) |
| `api` | `HOLIDAY_API_BASE_URL` | `https://date.nager.at/api/v3` | same |
| `web` | `API_ORIGIN` | `http://localhost:4000` | `https://<your-service>.onrender.com`, set **before** the first build |

## What changed since Week 12

API:

| File | Change |
|---|---|
| `api/src/app.js` | `GET /api/health` reports the MongoDB connection state (`connected`, `connecting`, `disconnected`) and answers 503 when it isn't connected. It is registered before the rate limiter, so Render's frequent health checks never get a 429. |
| `api/src/server.js` | Handles `SIGTERM` and `SIGINT`: stops accepting connections, lets requests in progress finish, closes Mongoose and the session store, and exits. Gives up after 25 seconds, before the host's `SIGKILL`. |
| `api/src/session.js` | Exports `sessionStore` so the shutdown code can close its connection |
| `api/src/middleware/request-logger.js` | Adds `req.ip` to each log line, to check `TRUST_PROXY` after deploying |
| `api/package.json` | `"engines": { "node": "24.x" }` |
| `api/bruno/` | "Health check" also asserts `database` is `connected` |
| `render.yaml` | New. The Render Blueprint |

Web:

| File | Change |
|---|---|
| `web/next.config.mjs` | Throws during a Vercel build (`VERCEL=1`) when `API_ORIGIN` is missing |
| `web/lib/events.js` | Waits up to 60 seconds for the API instead of 5, because a sleeping free Render instance takes about a minute to wake |
| `web/package.json` | `"engines": { "node": "24.x" }` |
| `web/.env.example` | Explains the production value of `API_ORIGIN` |

## Things to notice

- **`engines` is `24.x` now, not `>=24`.** Render and Vercel use it to choose the Node version. `>=24` would let them pick Node 26 or whatever comes next, and a deploy could break on a Node upgrade you never asked for. Render also reads `.nvmrc`.
- **The health check tells the truth.** Stop MongoDB while the API runs, and `/api/health` answers 503 with `"database": "disconnected"` within a few seconds. Render stops sending traffic to an instance that fails its health check, and a new deploy that can't reach the database never replaces the working one.
- **Try the shutdown yourself.** Start the API with `npm start`, note its process id (it is in `ps` or Activity Monitor, or press Ctrl+C in its terminal), and send `kill -TERM <pid>`. The log shows `SIGTERM received, closing the server`, then `Server and database connections closed`, and the process exits with code 0. `npm run dev` restarts on file changes the same way.
- **Cookies stay first-party.** The browser only talks to `your-app.vercel.app`. The API's `Set-Cookie` comes back through the Vercel rewrite, so the session cookie belongs to the Vercel domain. That is why production needs no CORS, no `SameSite=None`, and no third-party cookies.
- **`TRUST_PROXY=1` on Render is required, not optional.** Without it, the `Secure` session cookie is never sent: login answers 200 and the user still looks logged out. `docs/deploy.md` section 5 explains why, and how to check the rate limit sees real visitor addresses.
- **Uploads don't survive on the free plan.** Render's free instances have no permanent disk, so images uploaded through the admin form disappear on the next deploy or restart.
