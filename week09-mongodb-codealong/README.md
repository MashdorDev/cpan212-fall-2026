# Week 9 codealong: MongoDB and Mongoose

Tonight the events move out of an array in the API and into a MongoDB database, so they survive a restart. Open this folder in class. Everything is built except 7 steps in the API, marked `TODO STEP` in the code. Each TODO tells you what to type, why, and what you should see after. The Next.js app doesn't change.

Stuck on a step? Open the same file in [`../week09-mongodb`](../week09-mongodb). That's the finished version.

## Before you start: a database

Follow [`../week09-mongodb/docs/atlas-setup.md`](../week09-mongodb/docs/atlas-setup.md) to make a free MongoDB Atlas cluster and get a `mongodb+srv://...` connection string. If Atlas is blocked on your network, install MongoDB Community Server and use `mongodb://127.0.0.1:27017/campus_events`.

## Start (two terminals)

Terminal 1, the API:

```bash
cd api
npm install
cp .env.example .env
# edit .env and paste your connection string after MONGODB_URI=
npm run dev
```

Terminal 2, the Next.js app:

```bash
cd web
npm install
cp .env.example .env
npm run dev
```

Open http://localhost:3000/events. It says **Showing 0 of 0 events**. That's normal: the API isn't reading from a database yet.

## The steps

- [ ] **Step 1**, `api/src/db.js` and `api/src/server.js`: connect to MongoDB before starting. The API terminal says `Connected to MongoDB`.
- [ ] **Step 2**, `api/src/models/Event.js`: the schema, the rules for a valid event, and `id` instead of `_id`.
- [ ] **Step 3**, `api/scripts/seed.js`: `npm run seed` puts the 8 sample events in the database. Compass shows them.
- [ ] **Step 4**, `api/src/controllers/events.controller.js`: the list reads from MongoDB. You should see "Showing 8 of 8 events".
- [ ] **Step 5**, `api/src/utils/find-event.js` and the controller: one event by id. Clicking an event opens its page, and `/api/events/abc` is a 404.
- [ ] **Step 6**, the controller and `api/src/middleware/error-handler.js`: the form saves new events, and an empty form shows red messages. Restart the API: your event is still there.
- [ ] **Step 7**, the controller: PATCH and DELETE. Use the curl commands in `api/README.md`.

Do them in order. Step 4 needs steps 1 to 3.
