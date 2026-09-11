import bcrypt from 'bcryptjs';
import { User } from '../models/User.js';

// bcrypt's cost factor: each step up doubles the work. 12 takes a few hundred milliseconds per hash,
// which a person logging in won't notice, but it makes guessing millions of passwords from a stolen
// database very slow. OWASP's first choice today is Argon2id. bcrypt is still acceptable at cost 10 or more,
// and bcryptjs is pure JavaScript, so it installs everywhere without a compiler.
const BCRYPT_COST = 12;

// Compared against when no user has the email, so a wrong email takes as long as a wrong password.
// Otherwise the response time would tell an attacker which emails have accounts.
const HASH_FOR_UNKNOWN_EMAILS = bcrypt.hashSync('no account has this password', BCRYPT_COST);

// Returns a message when the password breaks the rules, or null when it is fine.
export function passwordProblem(password) {
  if (typeof password !== 'string' || password.length < 8) {
    return 'Password must be 8 to 72 characters';
  }
  // bcrypt only uses the first 72 bytes and ignores the rest, so a longer password would give a false sense
  // of security. truncates() counts bytes: an accented letter or emoji is 2 to 4 bytes, not 1.
  if (bcrypt.truncates(password)) {
    return 'Password must be 8 to 72 characters (accented letters and emoji count as more than one)';
  }
  return null;
}

export function hashPassword(password) {
  return bcrypt.hash(password, BCRYPT_COST);
}

// Returns the user when the email and password match, or null. It never says which of the two was wrong.
export async function findUserByCredentials(email, password) {
  // A password over 72 bytes can't belong to any account (register refuses them), so don't spend
  // a bcrypt comparison on it. That also keeps someone from making the server hash megabytes of text.
  if (typeof email !== 'string' || typeof password !== 'string' || bcrypt.truncates(password)) {
    return null;
  }
  const user = await User.findOne({ email: email.trim().toLowerCase() });
  // bcrypt.compare hashes the password with the salt stored inside the hash and compares the results.
  const matches = await bcrypt.compare(password, user?.passwordHash ?? HASH_FOR_UNKNOWN_EMAILS);
  return user && matches ? user : null;
}
