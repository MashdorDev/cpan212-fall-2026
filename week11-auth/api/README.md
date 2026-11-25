# Week 11: Campus Events API with accounts

The Week 10 API with accounts, sessions stored in MongoDB, and organizer rules. The week README (`../README.md`) has the demo accounts and the route table.

## Run it

```bash
npm install
cp .env.example .env
# edit .env and set MONGODB_URI and SESSION_SECRET
npm run seed
npm run dev
```

`npm run seed` empties the users, events and RSVPs, then inserts two demo users, eight events and five RSVPs.

## Try it with curl

`-c` saves the cookie the API sends into a file, and `-b` sends it back, the way a browser does. Run these in Git Bash.

```bash
curl -i -c ava.txt -X POST http://localhost:4000/api/auth/login -H "Content-Type: application/json" -d '{"email":"ava@example.com","password":"campus-demo-ava"}'
curl -i -b ava.txt http://localhost:4000/api/auth/me
curl -i http://localhost:4000/api/auth/me
curl -i -b ava.txt -X POST http://localhost:4000/api/auth/logout
```

The first answers 200 with a `Set-Cookie: campus.sid=...` header. The second is 200 with Ava's details (no `passwordHash`). The third has no cookie, so it's 401. After the logout, the second command answers 401 too. Delete `ava.txt` when you're done: it holds a working login.

## Files to look at

| File | What it shows |
|---|---|
| `src/models/User.js` | A unique email, and a `toJSON` that removes `passwordHash` |
| `src/session.js` | `express-session`, `MongoStore.create()`, and the cookie's `httpOnly`, `sameSite`, `secure` and `maxAge` |
| `src/utils/session.js` | `regenerate()` and `save()` on login, `destroy()` on logout |
| `src/controllers/auth.controller.js` | `bcrypt.hash()`, `bcrypt.compare()`, the 72-byte check, 400, 401, 409 |
| `src/middleware/require-auth.js` | `requireAuth`, `requireAdminLogin`, `checkOrganizer` |
| `src/routes/events.routes.js` | Which routes are public and which need a login |
| `examples/jwt-with-jose.js` | `SignJWT`, `jwtVerify`, and the errors for a bad signature, an expired token and the wrong audience |
