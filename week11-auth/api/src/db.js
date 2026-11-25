import mongoose from 'mongoose';

// Someone could send {"$ne": null} instead of a plain value, to match every document.
// With sanitizeFilter on, Mongoose treats that as a plain value, not a query operator.
mongoose.set('sanitizeFilter', true);

// Connects to the database in MONGODB_URI. server.js and scripts/seed.js call this first.
export async function connectDb() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('MONGODB_URI is not set. Copy .env.example to .env and put your connection string in it.');
    process.exit(1);
  }

  try {
    // Give up after 10 seconds instead of the default 30.
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 10000 });
  } catch (error) {
    console.error('Could not connect to MongoDB: ' + error.message);
    process.exit(1);
  }

  console.log('Connected to MongoDB, database "' + mongoose.connection.name + '"');
}
