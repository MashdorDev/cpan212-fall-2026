# Week 11: Campus Events web app with logins

The Week 10 app with register and login pages, the logged-in user in the header, and a login required to create events and RSVP. Start the API first (see the week README).

```bash
npm install
cp .env.example .env
npm run dev
```

## What changed since Week 10

| File | Change |
|---|---|
| `components/AuthProvider.js` | New. Asks `GET /api/auth/me` once when the app loads and shares the user: `undefined` while asking, `null` when nobody is logged in |
| `components/UserMenu.js` | New. Log in and Register, or your name and Log out |
| `app/layout.js` | Wraps the app in `AuthProvider` and puts `UserMenu` in the header |
| `components/LoginForm.js`, `components/RegisterForm.js` | New. Post to `/api/auth/login` or `/api/auth/register` through the rewrite, show the API's messages, then load the `next` page |
| `app/login/page.js`, `app/register/page.js` | New. Server Components that read `?next=` and show the form |
| `lib/next-path.js` | New. `safeNextPath()` turns anything that isn't a path on this site, such as `//evil.example`, into `/events` |
| `proxy.js` | New. Next.js 16's name for middleware. Sends `/events/new` to the login page when the `campus.sid` cookie is missing |
| `app/events/new/page.js` | A "Log in again" link when the API answers 401 |
| `components/RsvpForm.js` | One button for logged-in users (the API uses their name and email), a login link for everyone else |
| `components/Form.module.css` | The form styles, moved from `app/events/new/page.module.css` and shared with the login and register forms |

## Pages

| URL | Who | Rendered | Data |
|---|---|---|---|
| `/` | anyone | Server, static | none |
| `/events` | anyone | Server, on every request | `GET /api/events` |
| `/events/:id` | anyone, RSVP needs a login | Server, with the RSVP form in the browser | `GET /api/events/:id`, `POST /api/events/:id/rsvps` |
| `/events/new` | logged in (checked by `proxy.js`, enforced by the API) | Client | `POST /api/events` |
| `/saved` | anyone | Client | `GET /api/events/:id` for each saved id |
| `/login`, `/register` | anyone | Server page, client form | `POST /api/auth/login`, `POST /api/auth/register` |

## Try it

1. Open http://localhost:3000/events/new while logged out. `proxy.js` sends you to `/login?next=%2Fevents%2Fnew`.
2. Log in as `ava@example.com` / `campus-demo-ava`. You land back on the new event form, and the header shows Ava Martin.
3. Open the devtools Application tab, then Cookies: `campus.sid` is there with HttpOnly ticked. Type `document.cookie` in the console: it doesn't show up.
4. Create an event, then RSVP to it. Press RSVP again for the 409.
5. Log out and open an event page: the RSVP section now links to the login page.

## Environment variables

| Name | Default | Purpose |
|---|---|---|
| `API_ORIGIN` | `http://localhost:4000` | Where the Express API runs |
