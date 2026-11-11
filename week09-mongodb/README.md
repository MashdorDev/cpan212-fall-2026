# Week 9: MongoDB and Mongoose

The Week 7 Campus Events app, with the events moved out of an array in the API and into MongoDB. Events now survive a restart, and the rules for a valid event live in a Mongoose schema. The routes, the JSON and the Next.js app stay the same.

This is the **finished** version. In class, open [`../week09-mongodb-codealong`](../week09-mongodb-codealong) instead.

| Folder | What it is |
|---|---|
| `api/` | The Express API (port 4000), reading and writing MongoDB through Mongoose. Includes the EJS admin pages. |
| `web/` | The Next.js app (port 3000), the same as Week 7 |
| `docs/atlas-setup.md` | Creating a free MongoDB Atlas cluster, and looking at the data with Compass and mongosh |

## Before you start: a database

You need a connection string for `MONGODB_URI` in `api/.env`. Either:

- **MongoDB Atlas** (what you will deploy with): follow `docs/atlas-setup.md` and use the `mongodb+srv://...` string it gives you.
- **MongoDB on your own computer**: install MongoDB Community Server. The connection string is `mongodb://127.0.0.1:27017/campus_events`. Use `127.0.0.1`, not `localhost`: on some computers `localhost` goes to an address MongoDB doesn't listen on.

## Run both (two terminals)

Terminal 1, the API:

```bash
cd api
npm install
cp .env.example .env
# edit .env and set MONGODB_URI
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

Open http://localhost:3000/events for the app and http://localhost:4000/admin/events for the admin pages.

## What changed since Week 7

All the changes are in the API.

| File | Change |
|---|---|
| `api/src/db.js` | New. Turns on `sanitizeFilter`. `connectDb()` connects with `mongoose.connect()`, and stops the API with a message when `MONGODB_URI` is missing or the database can't be reached. |
| `api/src/server.js` | Calls `await connectDb()` before `app.listen()` |
| `api/src/models/Event.js` | New. The Event schema (`required`, `trim`, `minlength`, `maxlength`, `enum`, `min`, `max`, each with its own message), `createdAt` from `timestamps`, and a `toJSON` transform that sends `id` instead of `_id`. |
| `api/scripts/seed.js` | New. `npm run seed` empties the collection and inserts the sample events. |
| `api/src/controllers/events.controller.js` | Uses the model: `find()` with `sort()`, `create()`, `findByIdAndUpdate()` with `{ returnDocument: 'after', runValidators: true }`, and `deleteOne()` |
| `api/src/utils/find-event.js` | New. `findEventOr404()` answers 404 for an id that isn't a MongoDB id and for an id no event has. |
| `api/src/middleware/error-handler.js` | A Mongoose `ValidationError` (and a `CastError` from an update) becomes a 400 with one message per field |
| `api/src/controllers/admin.controller.js`, `holidays.controller.js` | Use the model and `findEventOr404()` |
| `api/src/data/events.js`, `api/src/validators/event.js`, `api/src/middleware/validate-event.js` | Removed. The schema replaces the hand-written validator. |
