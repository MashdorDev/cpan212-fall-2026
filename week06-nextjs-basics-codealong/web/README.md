# Week 6: Campus Events in Next.js

Created with:

```bash
npx create-next-app@latest web --js --app --eslint --no-tailwind --no-src-dir --import-alias "@/*" --use-npm --no-react-compiler --no-agents-md
```

## Run it

```bash
npm install
npm run dev
```

Open http://localhost:3000. There are no environment variables this week.

`npm run build` then `npm start` runs the production version. In production the events list is built once at build time, so you only see the loading message with `npm run dev`.

## Pages

| URL | File | What it shows |
|---|---|---|
| `/` | `app/page.js` | A plain Server Component with no data |
| `/events` | `app/events/(list)/page.js` | An async Server Component that loads events and passes them to a Client Component |
| `/events/:id` | `app/events/[id]/page.js` | A dynamic route: awaits `params`, calls `notFound()` for an unknown id |
| any other URL | `app/not-found.js` | The 404 page |

Special files:

- `app/layout.js` wraps every page with the header and nav. `Link` changes pages without a full reload.
- `app/events/(list)/loading.js` shows while the list is loading. The `(list)` folder is a route group: it does not change the URL, it only limits the loading screen to the list page (see the comment in the file for why).
- `app/events/error.js` is shown if loading events throws. It has to be a Client Component, and its `retry()` button tries again.

## Components

| File | Server or client | What it shows |
|---|---|---|
| `components/EventCard.js` | Either | Props: receives one `event` and renders it |
| `components/CategoryFilter.js` | Client (`'use client'`) | `useState`, click events, filtering a list in the browser, `key` |
| `components/SaveButton.js` | Client | A toggle with its own state. Filter a saved card out of the list and back, and it forgets. Week 7 fixes that with Context. |

`EventCard` has no `'use client'` line, but because `CategoryFilter` imports it, it runs in the browser too. Anything imported by a Client Component becomes part of the client bundle.

## Data

`lib/events.js` holds the same eight seed events as the Express API, with the same fields and ids. `getEvents()` waits 600 ms on purpose so the loading screen is visible. Dates are stored in UTC and shown in Toronto time by `lib/format.js`.
