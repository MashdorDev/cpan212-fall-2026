# Week 13: Campus Events web app, ready for Vercel

The Week 12 app with two production changes. See `../docs/deploy.md` for deploying it.

```bash
npm install
cp .env.example .env
npm run build
npm start
```

## What changed since Week 12

| File | Change |
|---|---|
| `next.config.mjs` | A Vercel build (`VERCEL=1`) fails with `API_ORIGIN is not set` when the variable is missing |
| `lib/events.js` | Server Components wait up to 60 seconds for the API, long enough for a sleeping Render instance to wake |
| `package.json` | `"engines": { "node": "24.x" }` |

## Environment variables

| Name | Local | On Vercel |
|---|---|---|
| `API_ORIGIN` | `http://localhost:4000` | `https://<your-service>.onrender.com`, with no `/api` and no trailing slash |

`API_ORIGIN` is read in two places at two different times:

- `next.config.mjs` reads it during `next build`, and writes the rewrites into the build output. Changing it later has no effect until the next build, which on Vercel means a redeploy.
- `lib/events.js` reads it while the site runs, for the Server Components' own calls to the API.

It has no `NEXT_PUBLIC_` prefix, so it never reaches the browser. The browser always calls `/api/...` on the Vercel domain.
