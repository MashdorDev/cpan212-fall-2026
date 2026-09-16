# Week 4 codealong: the Campus Events API

The Week 3 API, plus the endpoint we add together in class:
`GET /api/events/:id/holiday-check`, which says whether an event falls on a Canadian public holiday.

Three files are left for you to write, as numbered `// TODO (you): STEP N` comments:

- `src/routes/events.routes.js` (step 1)
- `src/controllers/holidays.controller.js` (steps 2, 3 and 5)
- `src/services/holidays.service.js` (steps 4, 6 and 7)

The step list is in [`../README.md`](../README.md). The code to type, the check to run after each
step and the explanations are in section 7 of the Week 4 lesson page. The finished version of this
project is in [`../../week04-async/api`](../../week04-async/api).

## Run it

```bash
npm install
cp .env.example .env
npm run dev
```

In Windows Command Prompt, use `copy .env.example .env` instead of `cp`.

This runs before you write a single line. Every Week 3 route works. The holiday check does not exist
yet, so asking for it gives a `404`: the server is up and waiting for step 1. Step 1 wires the route
up, and from then on it answers `501 Not Implemented` and a "not written yet" message.

Open the `bruno/` folder in Bruno and pick the `Local` environment to send a request to every route.
The three `Holiday check` requests in that collection fail until you have done the steps.

## Environment variables

| Name | Default | Purpose |
|---|---|---|
| `PORT` | `4000` | Port the server listens on |
| `HOLIDAY_API_BASE_URL` | `https://date.nager.at/api/v3` | Address of the holiday API. Point it at a wrong address to see the 502 in step 7. |
