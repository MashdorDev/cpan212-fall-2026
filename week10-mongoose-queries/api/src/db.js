import mongoose from 'mongoose';

// A filter built from user input can contain query operators, for example { "$ne": null } sent in a
// JSON body. With sanitizeFilter on, Mongoose treats those as plain values instead of operators.
mongoose.set('sanitizeFilter', true);

// server.js and scripts/seed.js both call this before doing anything else.
export async function connectDb() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('MONGODB_URI is not set. Copy .env.example to .env and put your connection string in it.');
    process.exit(1);
  }

  try {
    // By default Mongoose keeps trying for 30 seconds. 10 seconds is enough to tell that
    // the database is down, the password is wrong or Atlas is blocking your IP address.
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 10_000 });
  } catch (error) {
    console.error(`Could not connect to MongoDB: ${error.message}`);
    console.error('Check MONGODB_URI in .env, that the database is running, and (on Atlas) Network Access.');
    process.exit(1);
  }
  console.log(`Connected to MongoDB, database "${mongoose.connection.name}"`);
}
