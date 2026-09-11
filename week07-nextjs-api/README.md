# Week 7: Next.js with the Express API

The Week 6 Next.js app now reads and writes real data through the Express API from Week 5.

| Folder | What it is |
|---|---|
| `api/` | The Express API (port 4000). Same code as Week 5, including the EJS admin pages. |
| `web/` | The Next.js app (port 3000). Lists, shows and creates events through the API, and remembers saved events. |
| `cors-example/` | A short example of the other way to connect them, CORS, to compare with rewrites. |

## Run both (two terminals)

Terminal 1, the API:

```bash
cd api
npm install
cp .env.example .env
npm run dev
```

Terminal 2, the Next.js app:

```bash
cd web
npm install
cp .env.example .env
npm run dev
```

Open http://localhost:3000. Start the API first: the events pages show an error screen while the API is not running, and recover when you press Try again.

## Environment variables

| Folder | Name | Default | Purpose |
|---|---|---|---|
| `api` | `PORT` | `4000` | Port the API listens on |
| `api` | `HOLIDAY_API_BASE_URL` | `https://date.nager.at/api/v3` | Base URL of the holiday API |
| `web` | `API_ORIGIN` | `http://localhost:4000` | Where the API runs. Server Components call it directly, and the `/api` rewrite forwards browser requests to it. |

`API_ORIGIN` has no `NEXT_PUBLIC_` prefix, so it is only available on the server and is never sent to the browser. The browser doesn't need it: it always calls `/api/...` on the Next.js origin.

The rewrite destination is read when Next.js starts in dev mode, and when you run `npm run build` for production. If you change `API_ORIGIN`, restart `npm run dev`, or build again before `npm start`.

## How a request travels

- **Server Component** (`app/events/(list)/page.js`, `app/events/[id]/page.js`): the Next.js server calls `http://localhost:4000/api/events` with `fetch` (see `web/lib/events.js`). The browser only receives the finished HTML.
- **Client Component** (`app/events/new/page.js`, `app/saved/page.js`): code in the browser calls `/api/events` on `localhost:3000`. The rewrite in `web/next.config.mjs` forwards it to `localhost:4000`. To the browser it is a same-origin request, so no CORS headers are needed.

Open the Network tab in your browser's devtools on `/saved` or while creating an event: the requests go to `localhost:3000/api/events`, never to port 4000.
