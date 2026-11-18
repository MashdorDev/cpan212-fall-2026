// Why src/db.js turns on sanitizeFilter. Run npm run seed first, then:
//   node --env-file=.env examples/injection-demo.js
//
// Picture a route "show my RSVPs" that reads an email from a JSON body and runs
//   Rsvp.find({ email: req.body.email })
// A normal client sends { "email": "priya.sharma@example.com" }. An attacker sends an object instead.
import mongoose from 'mongoose';
import { connectDb } from '../src/db.js';
import { Rsvp } from '../src/models/Rsvp.js';

// express.json() would turn the request body into exactly this object.
const body = JSON.parse('{ "email": { "$ne": null } }');
console.log('What the attacker sent:', body);

await connectDb();

// 1. sanitizeFilter off. The filter becomes { email: { $ne: null } }: "email is not null".
// That matches every RSVP, so the attacker sees everyone's email.
mongoose.set('sanitizeFilter', false);
const leaked = await Rsvp.find({ email: body.email });
console.log('');
console.log('1. sanitizeFilter off: ' + leaked.length + ' RSVPs came back, with other people\'s emails:');
for (const rsvp of leaked) {
  console.log('   ' + rsvp.name + ' <' + rsvp.email + '>');
}

// 2. sanitizeFilter on, the way src/db.js sets it. Mongoose treats { $ne: null } as a value to
// compare, not an operator. An object can't be an email, so the query fails instead.
mongoose.set('sanitizeFilter', true);
console.log('');
try {
  await Rsvp.find({ email: body.email });
  console.log('2. sanitizeFilter on: the query ran (this should not happen)');
} catch (error) {
  console.log('2. sanitizeFilter on: the query was stopped with ' + error.name);
  console.log('   In the API, the error handler turns this CastError into a 400.');
}

// Where can objects like this come from? A JSON body, always. A query string like ?email[$ne]=x
// only with the "extended" parser. Express 5 uses the simple one, so in Express 5 the URL is safe.

await mongoose.disconnect();
