// The same insert and find as the API, written with the official MongoDB driver instead of Mongoose.
// Run it with: node --env-file=.env examples/native-driver.js
//
// Compare it with src/models/Event.js and src/controllers/events.controller.js:
// - The driver has no schema. insertOne() saves whatever object you give it, typos and wrong types included.
// - Dates, defaults, trimming and createdAt are all up to you.
// - Documents come back with _id as an ObjectId, not the id string the API sends.
import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;
if (!uri) {
  console.error('MONGODB_URI is not set. Run this with: node --env-file=.env examples/native-driver.js');
  process.exit(1);
}

const client = new MongoClient(uri);

try {
  await client.connect();
  // db() with no name uses the database in the connection string, the same one Mongoose uses.
  const events = client.db().collection('events');

  const { insertedId } = await events.insertOne({
    title: 'Driver example: board games night',
    description: 'Inserted by examples/native-driver.js',
    category: 'social',
    location: 'Lakeshore Campus student centre',
    // A real Date object, so MongoDB stores a date. A string here would be stored as a string.
    startsAt: new Date('2026-11-20T23:00:00.000Z'),
    capacity: 30,
    imageUrl: null,
    createdAt: new Date(),
  });
  console.log('Inserted _id:', insertedId);

  // Nothing stops this. Mongoose would reject both fields, the driver saves them as they are.
  const { insertedId: badId } = await events.insertOne({ titel: 'Typo in the field name', capacity: 'lots' });
  console.log('The driver also accepted a document with a typo and a text capacity:', badId);

  // find() returns a cursor. toArray() reads every matching document into an array.
  const socialEvents = await events.find({ category: 'social' }).sort({ startsAt: 1 }).toArray();
  console.log(`Found ${socialEvents.length} social events:`);
  for (const event of socialEvents) {
    console.log(`- ${event._id} ${event.title} (${event.startsAt.toISOString()})`);
  }

  // Clean up, so the example doesn't leave documents in the events list.
  const { deletedCount } = await events.deleteMany({ _id: { $in: [insertedId, badId] } });
  console.log(`Removed the ${deletedCount} example documents`);
} finally {
  // Close the connection even if something above threw, or the script keeps running.
  await client.close();
}
