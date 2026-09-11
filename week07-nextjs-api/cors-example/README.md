# CORS instead of rewrites

The Week 7 app avoids CORS completely: the browser calls `/api/...` on the Next.js origin and a rewrite forwards the request to Express. This folder shows the other common setup, where the browser calls the Express API on its own origin and the API allows that with the `cors` package.

## Try it

```bash
npm install
cp .env.example .env
npm run dev
```

Ask as if you were a page on `http://localhost:3000` (allowed) and on `http://localhost:5173` (not allowed):

```bash
curl -i -H "Origin: http://localhost:3000" http://localhost:4000/api/events
curl -i -H "Origin: http://localhost:5173" http://localhost:4000/api/events
```

The first response has `Access-Control-Allow-Origin: http://localhost:3000`. The second has no such header. Both are `200 OK`: the server still ran the route. It is the **browser** that refuses to give the second response to the page's JavaScript, and it prints a "blocked by CORS policy" error in the console. curl, Bruno and server-side code ignore CORS.

A `POST` with `Content-Type: application/json` makes the browser send an `OPTIONS` "preflight" request first. `cors()` answers it too:

```bash
curl -i -X OPTIONS -H "Origin: http://localhost:3000" \
  -H "Access-Control-Request-Method: POST" \
  -H "Access-Control-Request-Headers: content-type" \
  http://localhost:4000/api/events
```

## What the Next.js side would look like

With CORS, the browser needs the API's address, so it has to be a public env var:

```bash
# web/.env
NEXT_PUBLIC_API_ORIGIN=http://localhost:4000
```

```js
// in a Client Component
const res = await fetch(`${process.env.NEXT_PUBLIC_API_ORIGIN}/api/events`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(newEvent),
});
```

and there is no `rewrites()` in `next.config.mjs`.

## Rewrites or CORS?

| | Rewrites (Week 7 app) | CORS (this folder) |
|---|---|---|
| What the browser calls | `localhost:3000/api/...` (same origin) | `localhost:4000/api/...` (another origin) |
| Server config | `rewrites()` in `next.config.mjs` | `cors({ origin: [...] })` in Express |
| Preflight requests | None | One extra `OPTIONS` request for JSON `POST`, `PATCH` and `DELETE` |
| API address visible to the browser | No | Yes, in `NEXT_PUBLIC_API_ORIGIN` |
| Login cookies from the API | First-party, work with `sameSite: 'lax'` | Cross-site: need `credentials: 'include'` on every fetch, `cors({ credentials: true })`, and cookies with `sameSite: 'none'` and `secure`. Safari blocks third-party cookies by default, even then. |
| When it fits | You control the frontend and it can forward requests | A public API used by many sites, or a frontend that can't proxy |

In production the two sites usually have different domains (for example a Vercel app and a Render API), which is exactly when cross-site cookies cause trouble. That is why this course uses rewrites.

## Environment variables

| Name | Default | Purpose |
|---|---|---|
| `PORT` | `4000` | Port the API listens on |
| `CORS_ORIGINS` | `http://localhost:3000` | Comma-separated origins allowed to call the API from a browser |
