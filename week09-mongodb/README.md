# Week 9: MongoDB and Mongoose

The Week 7 app, with the events moved out of an in-memory array and into MongoDB. The JSON routes, the response shapes and the Next.js pages stay the same. What changes is where the data lives: events now survive a restart, and the rules for a valid event live in a Mongoose schema.

| Folder | What it is |
|---|---|
| `api/` | The Express API (port 4000), now reading and writing MongoDB through Mongoose. Includes the EJS admin pages. |
| `web/` | The Next.js app (port 3000). Same pages as Week 7, and it now shows event images. |
| `docs/atlas-setup.md` | Creating a free MongoDB Atlas cluster, and connecting with mongosh and Compass |

## Before you start: a MongoDB database

You need a connection string for `MONGODB_URI`. Either:

- **MongoDB Atlas** (what you will deploy with): follow `docs/atlas-setup.md`, then use the `mongodb+srv://...` string it gives you.
- **MongoDB on your own computer**: install MongoDB Community Server, or run it in Docker with `docker run -d --name mongo -p 27017:27017 mongo:8`. The connection string is `mongodb://127.0.0.1:27017/campus_events`.

Use `127.0.0.1` rather than `localhost` for a local database. On some computers `localhost` resolves to the IPv6 address `::1` first, and a MongoDB server installed on your computer only listens on IPv4 by default.

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

`npm run seed` deletes every event and inserts the eight sample events. Run it again any time you want to start over.

Terminal 2, the Next.js app:

```bash
cd web
npm install
cp .env.example .env
npm run dev
```

Open http://localhost:3000 for the app and http://localhost:4000/admin/events for the admin pages.

## Environment variables

| Folder | Name | Example | Purpose |
|---|---|---|---|
| `api` | `PORT` | `4000` | Port the API listens on |
| `api` | `MONGODB_URI` | `mongodb://127.0.0.1:27017/campus_events` | **Required.** Where the database is. The API and `npm run seed` stop with a message if it is missing. |
| `api` | `HOLIDAY_API_BASE_URL` | `https://date.nager.at/api/v3` | Base URL of the holiday API |
| `web` | `API_ORIGIN` | `http://localhost:4000` | Where the API runs. Used by Server Components and by the rewrites in `next.config.mjs`. |

## What changed since Week 7

API:

| File | Change |
|---|---|
| `api/src/db.js` | New. `connectDb()` fails fast when `MONGODB_URI` is missing or the database can't be reached, and turns on `sanitizeFilter`. |
| `api/src/server.js` | Awaits `connectDb()` before `app.listen()` |
| `api/src/models/Event.js` | New. The Event schema: `required`, `enum`, `min`/`max`, `trim`, `maxlength`, `match`, custom cast messages, `timestamps` for `createdAt`, and a `toJSON` transform that sends `id` instead of `_id` and drops `__v`. |
| `api/src/controllers/events.controller.js` | Uses the model: `find()` with `sort()`, `findById()`, `create()`, `findByIdAndUpdate()` with `{ returnDocument: 'after', runValidators: true }`, `deleteOne()`. `?q` is escaped before it goes into `new RegExp`. |
| `api/src/utils/find-by-id.js` | New. `findByIdOr404()` answers 404 for ids that are not valid ObjectIds and for ids no document has |
| `api/src/middleware/error-handler.js` | Mongoose `ValidationError` and `CastError` become 400 with a message for each field |
| `api/src/controllers/admin.controller.js` | The admin form builds an `Event` and checks it with `validateSync()` before saving |
| `api/scripts/seed.js` | New. `npm run seed` clears the collection and inserts the sample events |
| `api/examples/native-driver.js` | New. The same insert and find with the official `mongodb` driver, to compare with Mongoose |
| `api/src/data/events.js`, `api/src/validators/event.js`, `api/src/middleware/validate-event.js` | Removed. The schema replaces the hand-written validator. |
| `api/bruno/` | Ids are no longer fixed, so "List events" saves the first event's id as `eventId` |

Web:

| File | Change |
|---|---|
| `web/next.config.mjs` | A second rewrite for `/uploads/:path*`, so images uploaded in the admin pages load on the Next.js site |
| `web/components/EventCard.js`, `web/app/events/[id]/page.js` | Show the event image when there is one |

## Things to notice

- **Ids.** MongoDB creates an `_id` (an ObjectId) for every document. The `toJSON` transform in `Event.js` renames it to `id`, so the web app didn't have to change. The seed ids are different every time you run `npm run seed`, and saved events from Week 7 (stored in your browser) no longer match anything, so the Saved page is empty until you save events again.
- **Two kinds of 404.** `GET /api/events/no-such-id` is answered without a query, because `no-such-id` can never be an ObjectId. `GET /api/events/000000000000000000000000` is a valid ObjectId that no document has.
- **Validation moved.** The rules that were in `validators/event.js` are now in the schema. Mongoose also converts types: `"45"` becomes the number `45` and `"2026-10-14T18:00:00-04:00"` becomes a date. A value it can't convert, like `"lots"` for capacity, fails with the schema's cast message.
- **`sanitizeFilter` and operators.** With `sanitizeFilter` on, an object with `$` keys in a filter is treated as a plain value. That includes filters you write yourself: `{ startsAt: { $gte: date } }` fails with a CastError unless you wrap it as `mongoose.trusted({ $gte: date })`. A `RegExp` object is fine, `{ $regex: ... }` is not. Week 10 uses `mongoose.trusted()` for the date filter.
- **Uploads are files, not data.** Images still go to `api/uploads/`, and the database stores only the `/uploads/<file>` path. Running `npm run seed` deletes events but leaves old image files in `uploads/`.

## Examples

```bash
cd api
node --env-file=.env examples/native-driver.js
```

The script inserts an event with the driver, then a second document with a typo in a field name and text where a number belongs. The driver saves both, because it has no schema. It lists the social events and removes what it inserted.
