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

  const password = req.body.password;
  if (typeof password !== 'string' || password.length < 8) {
    throw new HttpError(400, 'Validation failed', { password: 'Password must be at least 8 characters' });
  }
  // bcrypt only reads the first 72 bytes and ignores the rest. truncates() counts bytes, not letters:
  // an emoji is 4 bytes.
  if (bcrypt.truncates(password)) {
    throw new HttpError(400, 'Validation failed', { password: 'Password must be 72 bytes or fewer' });
  }

  // The hash has the salt inside it, so two people with the same password get different hashes.
  const passwordHash = await bcrypt.hash(password, BCRYPT_COST);

  const user = new User({
    name: req.body.name,
    email: req.body.email,
    passwordHash: passwordHash,
  });

  // save() checks the schema rules. A bad name or email goes to the error handler, which answers 400.
  try {
    await user.save();
  } catch (error) {
    if (error.code === DUPLICATE_KEY) {
      throw new HttpError(409, 'An account with this email already exists', { email: 'Already registered' });
    }
    throw error;
  }

  // Registering logs you in too.
  await startUserSession(req, user);
  res.status(201).json({ data: user });
}

export async function login(req, res) {
  if (!req.body) {
    throw new HttpError(400, 'Validation failed', { body: 'Send a JSON object' });
  }

  const email = req.body.email;
  const password = req.body.password;
  if (typeof email !== 'string' || typeof password !== 'string') {
    throw new HttpError(401, 'Email or password is incorrect');
  }

  // Emails are saved in lowercase, so look for the lowercase version.
  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) {
    // The same message as a wrong password, so nobody can use this form to find out who has an account.
    throw new HttpError(401, 'Email or password is incorrect');
  }

  // compare() hashes the password with the salt stored in passwordHash, and compares the two hashes.
  const matches = await bcrypt.compare(password, user.passwordHash);
  if (!matches) {
    throw new HttpError(401, 'Email or password is incorrect');
  }

  await startUserSession(req, user);
  res.json({ data: user });
}

export async function logout(req, res) {
  await endUserSession(req);
  // Tell the browser to delete the cookie too.
  res.clearCookie(SESSION_COOKIE_NAME);
  res.status(204).end();
}

// requireAuth already loaded the user into req.user.
export function me(req, res) {
  res.json({ data: req.user });
}
