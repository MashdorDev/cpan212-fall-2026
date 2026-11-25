import bcrypt from 'bcryptjs';
import { User } from '../models/User.js';
import { SESSION_COOKIE_NAME } from '../session.js';
import { HttpError } from '../utils/http-error.js';
import { endUserSession, startUserSession } from '../utils/session.js';

// How slow bcrypt is. Each step up doubles the time. 12 takes about a quarter of a second:
// nobody notices when logging in, but guessing millions of passwords takes years.
const BCRYPT_COST = 12;

// MongoDB's error code when a save breaks a unique index.
const DUPLICATE_KEY = 11000;

export async function register(req, res) {
  if (!req.body) {
    throw new HttpError(400, 'Validation failed', { body: 'Send a JSON object' });
  }

  // TODO STEP 3a: the password rules
  // The schema never sees the password (only its hash), so we check it here.
  // bcrypt only reads the first 72 bytes and ignores the rest. truncates() counts bytes, not letters:
  // an emoji is 4 bytes. Type under this comment:
  //
  //   const password = req.body.password;
  //   if (typeof password !== 'string' || password.length < 8) {
  //     throw new HttpError(400, 'Validation failed', { password: 'Password must be at least 8 characters' });
  //   }
  //   if (bcrypt.truncates(password)) {
  //     throw new HttpError(400, 'Validation failed', { password: 'Password must be 72 bytes or fewer' });
  //   }
  //
  // Check: on http://localhost:3000/register, type a name, an email and the password "short".
  // Press Create account: "Password must be at least 8 characters" shows under Password.

  // TODO STEP 3b: hash the password
  // bcrypt adds a random salt and runs slowly on purpose (BCRYPT_COST, at the top of this file).
  // The salt is stored inside the hash, so two people with the same password get different hashes.
  // Type under this comment:
  //
  //   const passwordHash = await bcrypt.hash(password, BCRYPT_COST);
  //   console.log(passwordHash);
  //
  // Check: register with a password of 8 or more characters. The API terminal prints $2b$12$ and
  // 53 more characters. Press Create account again: a different hash for the same password.
  // Then delete the console.log line.

  // TODO STEP 3c: save the user, 409 when the email is taken
  // save() checks the schema rules from step 1. A bad name or email goes to the error handler (400).
  // The unique index refuses a second account with the same email: error code 11000.
  // Type under this comment:
  //
  //   const user = new User({
  //     name: req.body.name,
  //     email: req.body.email,
  //     passwordHash: passwordHash,
  //   });
  //   try {
  //     await user.save();
  //   } catch (error) {
  //     if (error.code === DUPLICATE_KEY) {
  //       throw new HttpError(409, 'An account with this email already exists', { email: 'Already registered' });
  //     }
  //     throw error;
  //   }
  //
  // Check: register as yourself. The form still says "not built yet", but in Compass you are in users.
  // Press Create account again: "Already registered" under Email.

  // TODO STEP 3d: log in and answer 201
  // startUserSession() (in utils/session.js) makes a new session with your id in it, and saves it.
  // Replace the throw line below with:
  //
  //   await startUserSession(req, user);
  //   res.status(201).json({ data: user });
  //
  // Check: register with a new email. The page changes to the events list. In Compass, the sessions
  // collection has a document with your userId in it. The header still says "Log in": step 4 teaches
  // the API who you are.
  throw new HttpError(501, 'Register is not built yet (TODO STEP 3d)');
}

export async function login(req, res) {
  if (!req.body) {
    throw new HttpError(400, 'Validation failed', { body: 'Send a JSON object' });
  }

  // TODO STEP 5a: find the user by email
  // Emails are saved in lowercase, so look for the lowercase version.
  // No user: the same message as a wrong password, so nobody can use this form to find out who
  // has an account. Type under this comment:
  //
  //   const email = req.body.email;
  //   const password = req.body.password;
  //   if (typeof email !== 'string' || typeof password !== 'string') {
  //     throw new HttpError(401, 'Email or password is incorrect');
  //   }
  //   const user = await User.findOne({ email: email.toLowerCase() });
  //   if (!user) {
  //     throw new HttpError(401, 'Email or password is incorrect');
  //   }
  //
  // Check: on http://localhost:3000/login, log in as nobody@example.com: "Email or password is incorrect".

  // TODO STEP 5b: check the password
  // We can't turn the hash back into the password. compare() hashes what was typed, with the salt
  // stored in passwordHash, and compares the two hashes. Type under this comment:
  //
  //   const matches = await bcrypt.compare(password, user.passwordHash);
  //   if (!matches) {
  //     throw new HttpError(401, 'Email or password is incorrect');
  //   }
  //
  // Check: log in as ava@example.com with the password "wrong": the same message as for nobody.

  // TODO STEP 5c: log in
  // Replace the throw line below with:
  //
  //   await startUserSession(req, user);
  //   res.json({ data: user });
  //
  // Check: log in as ava@example.com with the password campus-demo-ava. The header says Ava Martin.
  throw new HttpError(501, 'Login is not built yet (TODO STEP 5c)');
}

export async function logout(req, res) {
  // TODO STEP 5d: log out
  // endUserSession() deletes the session from MongoDB. clearCookie() tells the browser to delete
  // the cookie too. Replace the throw line below with:
  //
  //   await endUserSession(req);
  //   res.clearCookie(SESSION_COOKIE_NAME);
  //   res.status(204).end();
  //
  // Check: press Log out in the header. It says Log in and Register again, and in Compass the
  // session is gone from the sessions collection.
  throw new HttpError(501, 'Logout is not built yet (TODO STEP 5d)');
}

// requireAuth already loaded the user into req.user.
export function me(req, res) {
  // TODO STEP 4b: send the logged-in user
  // The web app's header asks this route who is logged in. Replace the throw line below with:
  //
  //   res.json({ data: req.user });
  //
  // Check: reload http://localhost:3000. The header shows your name and Log out.
  // Open http://localhost:3000/api/auth/me: your name and email, and no passwordHash (step 1c).
  throw new HttpError(501, 'Not built yet (TODO STEP 4b)');
}
