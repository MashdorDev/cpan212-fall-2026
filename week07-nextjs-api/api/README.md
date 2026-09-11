# Week 7: Campus Events API

The same API as Week 5 (see `week05-forms-ejs/README.md` for the details): JSON routes under `/api`, the holiday check, and the EJS admin pages under `/admin`. The Next.js app in `../web` uses the JSON routes.

## Run it

```bash
npm install
cp .env.example .env
npm run dev
```

The `bruno/` collection covers every JSON route.

## Routes used by the Next.js app

| Method | Path | Used by |
|---|---|---|
| GET | `/api/events` | Events list (server) and saved page (browser) |
| GET | `/api/events/:id` | Event page (server) |
| POST | `/api/events` | New event form (browser) |

## Environment variables

| Name | Default | Purpose |
|---|---|---|
| `PORT` | `4000` | Port the server listens on |
| `HOLIDAY_API_BASE_URL` | `https://date.nager.at/api/v3` | Base URL of the holiday API |
