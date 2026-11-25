// Sessions vs JWTs. This API uses sessions: the cookie holds a random id, and the data lives in MongoDB.
// A JWT puts the data in the token itself and signs it, so the server can check it without a database.
// Run it with: node examples/jwt-with-jose.js   (no database or .env needed)
import { randomBytes } from 'node:crypto';
import { SignJWT, decodeJwt, errors, jwtVerify } from 'jose';

// HS256 signs with a shared secret. A real app reads it from an environment variable and fails to start
// without it, like SESSION_SECRET. This demo makes a new random one each run.
const secret = randomBytes(32);

const ISSUER = 'campus-events-api';
const AUDIENCE = 'campus-events-web';

async function verify(label, token) {
  try {
    // jwtVerify checks the signature, the expiry and the issuer and audience you ask for.
    const { payload } = await jwtVerify(token, secret, { issuer: ISSUER, audience: AUDIENCE, algorithms: ['HS256'] });
    console.log(`${label}: valid, user ${payload.sub} (${payload.name})`);
  } catch (error) {
    // jose has one error class per problem, each with a code you can check.
    if (error instanceof errors.JWTExpired) {
      console.log(`${label}: rejected, the token expired (${error.code})`);
    } else if (error instanceof errors.JWSSignatureVerificationFailed) {
      console.log(`${label}: rejected, the signature doesn't match the contents (${error.code})`);
    } else if (error instanceof errors.JWTClaimValidationFailed) {
      console.log(`${label}: rejected, the "${error.claim}" claim is wrong (${error.code})`);
    } else {
      throw error;
    }
  }
}

// 1. Sign a token for a logged-in user.
const token = await new SignJWT({ name: 'Ava Martin' })
  .setProtectedHeader({ alg: 'HS256' })
  .setSubject('6650f0c2a1b2c3d4e5f60718') // the user's id
  .setIssuer(ISSUER) // who made the token
  .setAudience(AUDIENCE) // who the token is for
  .setIssuedAt()
  .setExpirationTime('15m')
  .sign(secret);

console.log('Token (header.payload.signature):');
console.log(token);

// 2. Anyone can read the payload. It is base64url-encoded, not encrypted, and decodeJwt doesn't need the secret.
// Never put a password, an email you want to keep private, or anything else secret in a JWT.
console.log('\nPayload, read without the secret:', decodeJwt(token));

console.log();
await verify('Original token', token);

// 3. Tamper with it: change the payload to claim to be a different user, keep the old signature.
const [header, , signature] = token.split('.');
const forgedPayload = Buffer.from(
  JSON.stringify({ ...decodeJwt(token), sub: '000000000000000000000001', name: 'Someone else' }),
).toString('base64url');
await verify('Tampered token', `${header}.${forgedPayload}.${signature}`);

// 4. An expired token: signed correctly, but its exp time (in seconds since 1970) is a minute ago.
const expired = await new SignJWT({ name: 'Ava Martin' })
  .setProtectedHeader({ alg: 'HS256' })
  .setSubject('6650f0c2a1b2c3d4e5f60718')
  .setIssuer(ISSUER)
  .setAudience(AUDIENCE)
  .setIssuedAt(Math.floor(Date.now() / 1000) - 16 * 60)
  .setExpirationTime(Math.floor(Date.now() / 1000) - 60)
  .sign(secret);
await verify('Expired token', expired);

// 5. A valid token made for a different app.
const otherAudience = await new SignJWT({ name: 'Ava Martin' })
  .setProtectedHeader({ alg: 'HS256' })
  .setSubject('6650f0c2a1b2c3d4e5f60718')
  .setIssuer(ISSUER)
  .setAudience('some-other-app')
  .setExpirationTime('15m')
  .sign(secret);
await verify('Token for another audience', otherAudience);

console.log(`
What this means for sessions vs JWTs:
- Logging out with a session deletes it from the database, and the cookie stops working at once.
  A JWT stays valid until it expires, because the server keeps no record of it. Short expiry times
  (minutes, not days) limit the damage from a stolen token.
- If you use a JWT in a browser, send it in an httpOnly cookie, the same as the session id.
  Never keep it in localStorage, where any script on the page (including one injected by an XSS bug) can read it.`);
