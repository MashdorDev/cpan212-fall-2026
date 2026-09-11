# Week 13: Campus Events API, ready for Render

The Week 12 API with a database-aware health check, a clean shutdown on `SIGTERM`, the client IP in the request log, and Node pinned to 24.x. See the week README (`../README.md`) for the changes and `../docs/deploy.md` for deploying it.

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
| `npm start` | Starts the API once. Render runs this. |
| `npm run seed` | Deletes users, events and RSVPs, then inserts the demo data. Never run it against a database with real data. |
| `npm run generate-secret` | Prints a random value for `SESSION_SECRET` |

## Files to look at

| File | What it shows |
|---|---|
| `src/server.js` | `server.close()`, `mongoose.disconnect()` and a shutdown timeout on `SIGTERM` |
| `src/app.js` | `/api/health` with `mongoose.STATES`, placed before the rate limiter |
| `src/middleware/request-logger.js` | `req.ip` in every log line |
| `../render.yaml` | How Render builds, starts and checks this folder |

The routes are the same as Weeks 11 and 12. `GET /api/health` now answers `{ "status": "ok", "database": "connected" }`, or 503 with `"status": "unavailable"` while MongoDB is disconnected.
