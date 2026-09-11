# Week 5: Forms, uploads and EJS

The Week 4 API plus server-rendered admin pages. The JSON API still works exactly as before. The new part is a small admin area where a person manages events with plain HTML forms.

## Run it

```bash
npm install
cp .env.example .env
npm run dev
```

- http://localhost:4000/admin/events lists events and has a Delete button on each row.
- http://localhost:4000/admin/events/new is the form for adding an event with an optional image.
- The `bruno/` collection covers the JSON API.

## What to look at

| File | What it shows |
|---|---|
| `src/app.js` | `view engine`, `views`, `express.urlencoded()`, and `/uploads` served with `express.static` |
| `src/views/partials/header.ejs`, `footer.ejs` | Shared page parts, included with `<%- include('partials/header', { title }) %>` |
| `src/views/events-index.ejs` | A table built with a loop, `<%= %>` escaping, and a POST form for delete |
| `src/views/events-new.ejs` | The form, error messages next to each field, and the user's values put back after an error |
| `src/controllers/admin.controller.js` | Server-side validation, re-rendering with status 400, and post/redirect/get with a 303 |
| `src/middleware/upload-image.js` | Multer: the `image` field, a 2 MB limit, JPEG/PNG/WebP only, random file names |
| `src/utils/dates.js` | Formatting dates in Toronto time and reading a `datetime-local` value as Toronto time |
| `public/js/confirm-delete.js` | A confirm dialog added with `addEventListener` instead of an inline `onsubmit` |

`POST /admin/events` accepts both `multipart/form-data` (the admin form, with or without an image) and `application/x-www-form-urlencoded` (a form with no file input). Multer only reads multipart requests and lets the others through to `express.urlencoded()`.

Uploaded files go to `uploads/`, which Git ignores. Deleting an event removes its image too.

## Routes

JSON API (same as Week 4):

| Method | Path | Success | Errors |
|---|---|---|---|
| GET | `/api/health` | 200 `{ "status": "ok" }` | |
| GET | `/api/events?category=&q=` | 200 `{ "data": [...] }` | 400 |
| GET | `/api/events/:id` | 200 `{ "data": event }` | 404 |
| POST | `/api/events` | 201 `{ "data": event }` | 400 |
| PATCH | `/api/events/:id` | 200 `{ "data": event }` | 400, 404 |
| DELETE | `/api/events/:id` | 204 | 404 |
| GET | `/api/events/:id/holiday-check` | 200 | 404, 502 |

Admin pages (HTML):

| Method | Path | Result |
|---|---|---|
| GET | `/admin/events` | Events table |
| GET | `/admin/events/new` | Empty form |
| POST | `/admin/events` | 303 redirect to `/admin/events`, or the form again with status 400 and error messages |
| POST | `/admin/events/:id/delete` | 303 redirect to `/admin/events`, or a 404 page |
| GET | `/uploads/<file>` | An uploaded image |

## Environment variables

| Name | Default | Purpose |
|---|---|---|
| `PORT` | `4000` | Port the server listens on |
| `HOLIDAY_API_BASE_URL` | `https://date.nager.at/api/v3` | Base URL of the holiday API |
