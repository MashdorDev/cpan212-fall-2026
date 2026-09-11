// Why src/db.js turns on sanitizeFilter. Run npm run seed first, then:
//   node --env-file=.env examples/injection-demo.js
//
// Picture a route "show my RSVPs" that reads an email from a JSON body and runs
//   Rsvp.find({ email: req.body.email })
// A normal client sends { "email": "priya.sharma@example.com" }. An attacker sends an object instead.
import mongoose from 'mongoose';
import { connectDb } from '../src/db.js';
import { Rsvp } from '../src/models/Rsvp.js';

// express.json() would produce exactly this object from the request body.
const body = JSON.parse('{ "email": { "$ne": null } }');
console.log('Untrusted input:', body);

await connectDb();

try {
  // 1. Before: the same query with the setting from src/db.js switched off.
  // The filter becomes { email: { $ne: null } }, "email is not null", which matches every RSVP.
  mongoose.set('sanitizeFilter', false);
  const leaked = await Rsvp.find({ email: body.email });
  console.log(`\n1. sanitizeFilter off: the query returned ${leaked.length} RSVPs, including other people's emails:`);
  for (const rsvp of leaked) {
    console.log(`   ${rsvp.name} <${rsvp.email}>`);
  }

  // 2. After: sanitizeFilter back on, as src/db.js sets it.
  mongoose.set('sanitizeFilter', true);
  // Mongoose wraps the object as { $eq: { $ne: null } }, so it is a value to compare, not an operator.
  // An object can't be cast to a string email, so the query fails instead of returning data.
  try {
    await Rsvp.find({ email: body.email });
    console.log('\n2. sanitizeFilter on: the query ran (this should not happen)');
  } catch (error) {
    console.log(`\n2. sanitizeFilter on: the query was rejected with ${error.name}: ${error.message}`);
    console.log('   In the API, the error handler turns this CastError into a 400.');
  }

  // 3. Also check the type yourself. Then the bad request never reaches the database,
  // and the client gets a clear message instead of a cast error.
  if (typeof body.email !== 'string') {
    console.log('\n3. Type check: email is not a string, so the route answers 400 before querying.');
  }

  // Where can objects like this come from?
  // - JSON bodies, always: { "email": { "$ne": null } } is valid JSON.
  // - Query strings only with the "extended" parser. Express 5 uses the simple parser by default, which
  //   leaves ?email[$ne]=x as a key named "email[$ne]". Express 4 used the extended parser and turned the
  //   same URL into { email: { $ne: 'x' } }, which is why older tutorials show this attack in the URL.
} finally {
  await mongoose.disconnect();
}
