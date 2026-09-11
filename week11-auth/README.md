# Week 11: Authentication

The Week 10 app with accounts. People register and log in, the API keeps a session in MongoDB and identifies the browser with an httpOnly cookie, and the routes that change data check who is asking. Only an event's organizer can edit or delete it, RSVPs use the logged-in user's name and email, and only the organizer can see who is coming.

| Folder | What it is |
|---|---|
| `api/` | The Express API (port 4000) with register, login, logout, sessions in MongoDB, `requireAuth` and ownership checks. The EJS admin pages now have their own login form. |
| `web/` | The Next.js app (port 3000) with register and login pages, the user in the header, and `proxy.js` sending logged-out visitors from `/events/new` to the login page |

## Run both (two terminals)

Terminal 1, the API:

```bash
cd api
npm install
cp .env.example .env
# set MONGODB_URI and SESSION_SECRET in .env
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

Run `npm run seed` again after pulling this week's code. Events now need an organizer, and the Week 10 events in your database don't have one.

## Demo accounts

`npm run seed` creates two accounts. These passwords are fake and only exist in your local database.

| Name | Email | Password | Organizes |
|---|---|---|---|
| Ava Martin | `ava@example.com` | `campus-demo-ava` | Fall hackathon kickoff, Career fair prep workshop, Resume review drop-in, Midterm study skills session |
| Sam Lee | `sam@example.com` | `campus-demo-sam` | Thanksgiving residence potluck, Intramural ball hockey night, Student art show opening, Open mic night |

Log in as one of them in the web app, and as the other in Bruno or a private browser window, to see the 403 rules.

## Environment variables

| Folder | Name | Example | Purpose |
|---|---|---|---|
| `api` | `PORT` | `4000` | Port the API listens on |
| `api` | `MONGODB_URI` | `mongodb://127.0.0.1:27017/campus_events` | **Required.** Events, users and sessions all go in this database. |
| `api` | `SESSION_SECRET` | a long random value | **Required.** Signs the session cookie. The API stops with a message if it is missing. |
| `api` | `NODE_ENV` | `development` | Set to `production` when deployed. The session cookie then gets the `Secure` flag and is only sent over HTTPS. |
| `api` | `HOLIDAY_API_BASE_URL` | `https://date.nager.at/api/v3` | Base URL of the holiday API |
| `web` | `API_ORIGIN` | `http://localhost:4000` | Where the API runs |

Make a secret with:

```bash
node -e "console.log(crypto.randomBytes(32).toString('base64'))"
```

Use a different secret on every computer and every deployment, and never commit it. Changing it logs everyone out, because existing cookies no longer match.

## Routes

New and changed API routes:

| Method | Path | Who | Success | Errors |
|---|---|---|---|---|
| POST | `/api/auth/register` | anyone | 201 `{ "data": user }` and a session cookie | 400, 409 email taken |
| POST | `/api/auth/login` | anyone | 200 `{ "data": user }` and a session cookie | 401 (same message for a wrong email or password) |
| POST | `/api/auth/logout` | anyone | 204, session deleted and cookie cleared | |
| GET | `/api/auth/me` | logged in | 200 `{ "data": user }` | 401 |
| POST | `/api/events` | logged in | 201, `organizer` is set to you | 400, 401 |
| PATCH | `/api/events/:id` | organizer | 200 | 400, 401, 403, 404 |
| DELETE | `/api/events/:id` | organizer | 204 | 401, 403, 404 |
| POST | `/api/events/:id/rsvps` | logged in | 201, with your name and email (no body needed) | 401, 404, 409 already going, 409 full |
| GET | `/api/events/:id/rsvps` | organizer | 200 | 401, 403, 404 |

Reading events (`GET /api/events`, `GET /api/events/:id`, the holiday check) stays public. No response ever includes a user's `passwordHash`.

Admin pages: `GET /admin/login` and `POST /admin/login` show and handle a login form, `POST /admin/logout` logs out. Every other `/admin` page redirects to the login form when nobody is logged in, and Delete only appears on your own events.

## What changed since Week 10

API:

| File | Change |
|---|---|
| `api/src/models/User.js` | New. Unique lowercase email, name, `passwordHash`, and a `toJSON` that never includes the hash |
| `api/src/services/auth.service.js` | New. Password rules (8 characters to 72 bytes), bcrypt hashing at cost 12, and `findUserByCredentials()`, which takes the same time for an unknown email as for a wrong password |
| `api/src/controllers/auth.controller.js` | New. Register (hashes in the controller, see below), login, logout, me |
| `api/src/session.js` | New. `express-session` with `connect-mongo`, the cookie settings, and a fail-fast check for `SESSION_SECRET` |
| `api/src/utils/session.js` | New. Promise versions of `regenerate()`, `save()` and `destroy()`, and `startUserSession()` |
| `api/src/utils/require-env.js` | New. Stops the process with a clear message when a required variable is missing. `db.js` uses it too. |
| `api/src/middleware/require-auth.js` | New. `requireAuth` (401), `requireAdminLogin` (redirect), `assertOrganizer` (403) |
| `api/src/models/Event.js` | New `organizer` field, a reference to `User` |
| `api/src/controllers/events.controller.js`, `rsvps.controller.js` | Organizer from the session, ownership checks, RSVPs from the logged-in user, RSVP list for the organizer only |
| `api/src/controllers/admin.controller.js`, `src/views/login.ejs`, `src/views/partials/header.ejs` | Admin login and logout forms, organizer on create, ownership on delete |
| `api/scripts/seed.js` | Creates the two demo users and assigns organizers |
| `api/examples/jwt-with-jose.js` | New. Signs and verifies a JWT, then shows a tampered, an expired and a wrong-audience token being rejected |

Web:

| File | Change |
|---|---|
| `web/components/AuthProvider.js` | New. Context that asks `GET /api/auth/me` once and shares the user |
| `web/components/UserMenu.js` | New. Log in and Register links, or the user's name and a Log out button |
| `web/components/AuthForm.js`, `web/app/login/page.js`, `web/app/register/page.js` | New. One form component for both pages, posting through the rewrite |
| `web/lib/next-path.js` | New. Only allows `?next=` values that are paths on this site |
| `web/proxy.js` | New. Redirects `/events/new` to `/login?next=/events/new` when there is no session cookie |
| `web/app/events/new/page.js` | Handles a 401 from the API (the cookie existed but the session didn't) |
| `web/components/RsvpForm.js` | A single RSVP button for logged-in users, a login link for everyone else |
| `web/components/Form.module.css` | The new event form's styles, now shared with the login and register form |

## Things to notice

- **Hashing in the controller, not a hook.** A `pre('save')` hook only runs for `save()` and `create()`. `insertMany()` and `findByIdAndUpdate()` skip it, and would store a plain password without an error. Hashing in the controller means the model never holds a plain password. (In Mongoose 9 a pre hook is `async function () {}` with no `next` argument, if you do use one.)
- **bcrypt's 72-byte limit.** bcrypt ignores everything after 72 bytes, so the API rejects longer passwords. Accented letters and emoji take 2 to 4 bytes each, which is why the check uses `bcrypt.truncates()` instead of `password.length`. OWASP's first choice for new systems is Argon2id. bcrypt at cost 10 or more is still acceptable.
- **One message for failed logins.** "Email or password is incorrect" for both cases, and a bcrypt comparison even when the email is unknown, so neither the message nor the response time reveals which emails have accounts.
- **Regenerate, then save.** `startUserSession()` gives the browser a new session id at login (so a session id planted before login is useless) and saves the session before the response goes out (so the next request sees it).
- **Sessions survive a restart.** Log in, stop the API, start it again: `GET /api/auth/me` still answers 200, because the session is in the `sessions` collection, not in memory. Look at that collection in Compass: the document holds the cookie settings and `userId`, nothing else.
- **401 vs 403.** 401 means "log in first". 403 means "you are logged in, and this isn't yours".
- **Cookies through the rewrite.** The login form posts to `/api/auth/login` on the Next.js origin. The rewrite forwards it, and the API's `Set-Cookie` header comes back to the browser as if Next.js had sent it. The cookie belongs to the Next.js site, so every later `/api` call from the browser carries it with no CORS or `credentials` settings.
- **`proxy.js` is not the lock.** It only checks that a cookie called `campus.sid` exists. A stale or forged cookie gets past it, and the API still answers 401. The API's `requireAuth` is what protects the data.
- **Full page load after login and logout.** While logged out, Next.js prefetches the "New event" link and remembers that `proxy.js` redirected it to `/login`. A client-side `router.push('/events/new')` after login would reuse that redirect and bounce back to the login page. `window.location.assign()` loads the page fresh with the new cookie.
- **A 401 on every page for visitors.** The header calls `/api/auth/me` to find out who is logged in. For a logged-out visitor that answers 401, and the browser console lists it as a failed request. That is expected.

## Examples

```bash
cd api
node examples/jwt-with-jose.js
```

No database needed. It prints a token, decodes its payload without the secret (anyone can read a JWT), then verifies the original, a tampered copy, an expired token and a token for another audience. It ends with the differences between sessions and JWTs: a session can be deleted on the server, a JWT stays valid until it expires, and either one belongs in an httpOnly cookie, never in localStorage.
