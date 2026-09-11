import { User } from '../models/User.js';
import { findUserByCredentials, hashPassword, passwordProblem } from '../services/auth.service.js';
import { SESSION_COOKIE_NAME, sessionCookieOptions } from '../session.js';
import { HttpError } from '../utils/http-error.js';
import { destroySession, startUserSession } from '../utils/session.js';
import { messagesByField } from '../utils/validation.js';

const DUPLICATE_KEY = 11000;

// The password is hashed here, in the controller, rather than in a pre('save') hook on the model.
// A hook only runs on save() and create(), so an insertMany() or findByIdAndUpdate() would store the plain
// password without complaint. Hashing here means the model never holds a plain password at all.
export async function register(req, res) {
  const { name, email, password } = req.body ?? {};

  // Check the schema fields and the password together, so one 400 lists every problem.
  const user = new User({ name, email });
  const validationError = user.validateSync(['name', 'email']);
  const errors = validationError ? messagesByField(validationError) : {};
  const problem = passwordProblem(password);
  if (problem) {
    errors.password = problem;
  }
  if (Object.keys(errors).length > 0) {
    throw new HttpError(400, 'Validation failed', errors);
  }

  user.passwordHash = await hashPassword(password);
  try {
    await user.save();
  } catch (error) {
    if (error.code === DUPLICATE_KEY) {
      throw new HttpError(409, 'An account with this email already exists', { email: 'Already registered' });
    }
    throw error;
  }

  await startUserSession(req, user);
  res.status(201).json({ data: user });
}

export async function login(req, res) {
  const user = await findUserByCredentials(req.body?.email, req.body?.password);
  if (!user) {
    // The same message for an unknown email and a wrong password, so the response doesn't reveal
    // which emails have accounts.
    throw new HttpError(401, 'Email or password is incorrect');
  }
  await startUserSession(req, user);
  res.json({ data: user });
}

export async function logout(req, res) {
  await destroySession(req);
  // clearCookie needs the same options the cookie was set with, or the browser keeps it.
  res.clearCookie(SESSION_COOKIE_NAME, sessionCookieOptions);
  res.status(204).end();
}

// requireAuth has already loaded the user.
export function me(req, res) {
  res.json({ data: req.user });
}
