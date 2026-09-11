// Prints a random secret for SESSION_SECRET: npm run generate-secret
// 32 random bytes is 256 bits, far too many to guess. Base64 turns them into 44 characters you can paste into .env
// or a hosting dashboard. Make a new one for every environment (your laptop, Render), and never commit it.
import { randomBytes } from 'node:crypto';

console.log(randomBytes(32).toString('base64'));
