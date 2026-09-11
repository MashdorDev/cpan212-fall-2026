# Week 9: Campus Events API with MongoDB

The Week 7 API with the events stored in MongoDB through Mongoose. See the week README (`../README.md`) for setup and the full list of changes.

## Run it

```bash
npm install
cp .env.example .env
# set MONGODB_URI in .env
npm run seed
npm run dev
```

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Starts the API and restarts it when you save a file |
| `npm start` | Starts the API once |
| `npm run seed` | Deletes every event and inserts the eight sample events |
| `node --env-file=.env examples/native-driver.js` | Inserts and finds events with the `mongodb` driver instead of Mongoose |

## Routes

JSON API:

| Method | Path | Success | Errors |
|---|---|---|---|
| GET | `/api/health` | 200 `{ "status": "ok" }` | |
| GET | `/api/events?category=&q=` | 200 `{ "data": [...] }` | 400 bad category, `q` sent twice |
| GET | `/api/events/:id` | 200 `{ "data": event }` | 404 |
| POST | `/api/events` | 201 `{ "data": event }` and a `Location` header | 400 |
| PATCH | `/api/events/:id` | 200 `{ "data": event }` | 400, 404 |
| DELETE | `/api/events/:id` | 204 | 404 |
| GET | `/api/events/:id/holiday-check` | 200 | 404, 502 holiday service failed, 504 holiday service timed out |

Admin pages (HTML): `GET /admin/events`, `GET /admin/events/new`, `POST /admin/events`, `POST /admin/events/:id/delete`, and uploaded images at `GET /uploads/<file>`.

## Files to look at

| File | What it shows |
|---|---|
| `src/db.js` | Connecting before the server starts, failing fast, `sanitizeFilter` |
| `src/models/Event.js` | Schema rules and messages, `timestamps`, the `toJSON` transform |
| `src/controllers/events.controller.js` | CRUD with the model, picking allowed fields, escaping search text |
| `src/utils/find-by-id.js` | `mongoose.isValidObjectId()` and a 404 for missing documents |
| `src/middleware/error-handler.js` | `ValidationError` and `CastError` to 400 |
| `scripts/seed.js` | `deleteMany()`, `insertMany()` and `mongoose.disconnect()` |
| `examples/native-driver.js` | `MongoClient`, `insertOne()`, `find().toArray()` |

The `bruno/` collection covers every JSON route. Run "List events" first: it saves an event id for the requests that need one.
