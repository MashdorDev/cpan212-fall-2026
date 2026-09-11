# Week 9: Campus Events web app

The Week 7 app, running against the Week 9 API that stores events in MongoDB. Start the API first (see the week README).

```bash
npm install
cp .env.example .env
npm run dev
```

## What changed since Week 7

| File | Change |
|---|---|
| `next.config.mjs` | Rewrites `/uploads/:path*` to the API as well as `/api/:path*`, so uploaded images load from the Next.js origin |
| `components/EventCard.js` | Shows the event image at the top of the card when `imageUrl` is set |
| `app/events/[id]/page.js` | Shows the event image above the description |

Nothing else had to change: the API still sends `id`, and event ids are only ever passed along as strings. Ids are now 24-character ObjectIds instead of UUIDs.

The images use a plain `<img>` instead of `next/image`. `next/image` only loads images from hosts listed in `next.config.mjs`, and an event's `imageUrl` can be any https address.

## Pages

| URL | Rendered | Data |
|---|---|---|
| `/` | Server, static | none |
| `/events` | Server, on every request | `GET /api/events` from the Next.js server |
| `/events/:id` | Server, on every request | `GET /api/events/:id`, 404 page when the API says 404 |
| `/events/new` | Client | `POST /api/events` from the browser, through the rewrite |
| `/saved` | Client | `GET /api/events` from the browser, filtered by the ids in Context |

## Environment variables

| Name | Default | Purpose |
|---|---|---|
| `API_ORIGIN` | `http://localhost:4000` | Where the Express API runs |
