# Week 9: Campus Events API with MongoDB

The Week 7 API, with the events stored in MongoDB through Mongoose instead of an array. The routes and the JSON shapes are the same, so the Next.js app in `../web` didn't change.

## Run it

```bash
npm install
cp .env.example .env
# edit .env and set MONGODB_URI
npm run seed
npm run dev
```

`npm run seed` empties the events collection and inserts the eight sample events. Run it any time you want to start over.

## Try it with curl

Run `curl http://localhost:4000/api/events` and copy one `"id"` into the commands below in place of `ID`.

```bash
curl -X PATCH http://localhost:4000/api/events/ID -H "Content-Type: application/json" -d '{"location":"Room 2"}'
curl -X PATCH http://localhost:4000/api/events/ID -H "Content-Type: application/json" -d '{"capacity":-5}'
curl -X DELETE -i http://localhost:4000/api/events/ID
curl -i http://localhost:4000/api/events/abc
```

You should see the new location, then a 400 with `"capacity":"Capacity must be from 1 to 1000"`, then `204 No Content`, then a 404.

## Environment variables

| Name | Example | Purpose |
|---|---|---|
| `PORT` | `4000` | Port the server listens on |
| `MONGODB_URI` | `mongodb://127.0.0.1:27017/campus_events` | **Required.** Where the database is. The API and `npm run seed` stop with a message if it is missing. |
| `HOLIDAY_API_BASE_URL` | `https://date.nager.at/api/v3` | Base URL of the holiday API |
