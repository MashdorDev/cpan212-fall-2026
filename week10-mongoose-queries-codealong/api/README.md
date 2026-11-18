# Week 10 codealong: the API

The steps are listed in the week README (`../README.md`) and in the `TODO STEP` comments.

## Run it

```bash
npm install
cp .env.example .env
# edit .env and set MONGODB_URI
npm run seed
npm run dev
```

## curl commands for the steps

Open http://localhost:4000/api/events and copy the `"id"` of **Fall hackathon kickoff**. Use it in place of `ID`.

Step 6c, make the event hold only 3 people (it already has 3 RSVPs), then put it back to 120:

```bash
curl -X PATCH http://localhost:4000/api/events/ID -H "Content-Type: application/json" -d '{"capacity":3}'
curl -X PATCH http://localhost:4000/api/events/ID -H "Content-Type: application/json" -d '{"capacity":120}'
```

Step 6, the RSVP answers without the web app:

```bash
curl -i -X POST http://localhost:4000/api/events/ID/rsvps -H "Content-Type: application/json" -d '{"name":"Sam Lee","email":"sam@example.com"}'
curl -i -X POST http://localhost:4000/api/events/ID/rsvps -H "Content-Type: application/json" -d '{"name":"S","email":"nope"}'
```

Step 7d, delete the event (and its RSVPs):

```bash
curl -i -X DELETE http://localhost:4000/api/events/ID
```

Run `npm run seed` any time to start over with 8 events and 5 RSVPs.

## Environment variables

| Name | Example | Purpose |
|---|---|---|
| `PORT` | `4000` | Port the server listens on |
| `MONGODB_URI` | `mongodb://127.0.0.1:27017/campus_events` | **Required.** Where the database is. |
| `HOLIDAY_API_BASE_URL` | `https://date.nager.at/api/v3` | Base URL of the holiday API |
