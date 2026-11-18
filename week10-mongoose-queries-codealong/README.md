# Week 10 codealong: queries, indexes and RSVPs

Tonight the events list learns to filter by date, come one page at a time and sort. Then events get RSVPs, a second collection that points at the first. Open this folder in class. Everything is built except 7 steps in the API, marked `TODO STEP` in the code.

Each step is cut into small parts (1a, 1b, 1c...). Every part sits exactly where its lines go, shows the few lines to type, and says why. Most parts end with a **Check** you can open in the browser right away. Do them in order: in the Todo Tree panel they're listed STEP 1a, 1b, 1c... from top to bottom.

Stuck on a part? Open the same file in [`../week10-mongoose-queries`](../week10-mongoose-queries). That's the finished version.

## Start (two terminals)

Use the same `MONGODB_URI` as last week.

Terminal 1, the API:

```bash
cd api
npm install
cp .env.example .env
# edit .env and paste your connection string after MONGODB_URI=
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

Open http://localhost:3000/events. It says **Showing 8 of 8 events** and every event is on one page. The category and sort links are there, but sorting doesn't work yet. The web app is finished: tonight we only change the API.

## The steps

- [ ] **Step 1**, `api/src/controllers/events.controller.js` (1a to 1c): `?from=2026-11-01` keeps the events on or after a date. You'll see why `sanitizeFilter` blocks our own `$gte`, and fix it with `mongoose.trusted()`.
- [ ] **Step 2**, the same file (2a to 2e): `?page=` and `?limit=`, then `skip()`, `limit()` and `countDocuments()`. The web app shows "Page 1 of 2". See [`../week10-mongoose-queries/diagrams/pages-skip-limit.svg`](../week10-mongoose-queries/diagrams/pages-skip-limit.svg).
- [ ] **Step 3**, the same file (3a to 3e): `?sort=title` and `?sort=-title`, only for fields on the list. The Sort links work.
- [ ] **Step 4**, `api/src/models/Event.js` (4a to 4c): three indexes. Compass shows them, and Explain Plan says `IXSCAN`.
- [ ] **Step 5**, `api/src/models/Rsvp.js` and `api/scripts/seed.js` (5a to 5e): the RSVP model with a reference to an event and a unique index. `npm run seed` inserts 5 RSVPs.
- [ ] **Step 6**, `api/src/controllers/rsvps.controller.js` (6a to 6e): the RSVP form saves, with 400 for bad fields and 409 for "already registered" and "full".
- [ ] **Step 7**, both controllers (7a to 7d): the event page shows "3 of 120 taken", the RSVP list fills in each event with `populate()`, and deleting an event deletes its RSVPs.

## After the steps: the injection demo

```bash
cd api
npm run seed
node --env-file=.env examples/injection-demo.js
```

It sends `{ "email": { "$ne": null } }` as a filter. With `sanitizeFilter` off you get every RSVP and every email. With it on, Mongoose stops the query.
