# Week 11: Campus Events API with authentication

The Week 10 API with accounts, sessions stored in MongoDB, and ownership rules. See the week README (`../README.md`) for the demo accounts, the route table and the full list of changes.

## Run it

```bash
npm install
cp .env.example .env
# set MONGODB_URI and SESSION_SECRET in .env
npm run seed
npm run dev
```

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Starts the API and restarts it when you save a file |
| `npm start` | Starts the API once |
| `npm run seed` | Deletes users, events and RSVPs, then inserts two demo users, eight events and five RSVPs |
| `node examples/jwt-with-jose.js` | Signs and verifies JWTs with `jose` (no database needed) |
| `node --env-file=.env examples/injection-demo.js` | Why `sanitizeFilter` is on (from Week 10) |
| `node --env-file=.env examples/native-driver.js` | The `mongodb` driver without Mongoose (from Week 9) |

## Files to look at

| File | What it shows |
|---|---|
| `src/session.js` | `express-session`, `MongoStore.create()`, cookie `httpOnly`, `sameSite`, `secure`, `maxAge` |
| `src/utils/session.js` | `regenerate()` and `save()` on login |
| `src/services/auth.service.js` | `bcrypt.hash()`, `bcrypt.compare()`, the 72-byte check |
| `src/controllers/auth.controller.js` | Register (400, 409), login (401), logout (204), me |
| `src/middleware/require-auth.js` | `requireAuth`, `requireAdminLogin`, `assertOrganizer` |
| `src/models/User.js` | A unique email and a `toJSON` that removes `passwordHash` |
| `src/routes/events.routes.js` | Which routes are public and which need a login |
| `examples/jwt-with-jose.js` | `SignJWT`, `jwtVerify`, and the errors for a bad signature, expiry and audience |

The `bruno/` collection runs the whole flow in order: requests while logged out (401), register, log in as Ava, create and update events, log in as Sam (403 on Ava's event), RSVP, log out, and delete as the organizer. Bruno keeps cookies between requests, so the session carries over. Run `npm run seed` before running the collection a second time, or "Register" answers 409.
