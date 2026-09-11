import mongoose from 'mongoose';

// server.js and seed.js both call this once, before doing anything else.
export async function connectDb() {
  // TODO (you): step 1, fail fast (requirement 1).
  //   Read process.env.MONGODB_URI. If it's missing or empty, print a message
  //   that names the variable and says how to fix it (copy .env.example to .env),
  //   then call process.exit(1). Don't add a fallback connection string.

  // TODO (you): step 2, connect (requirement 2).
  //   Call mongoose.set('sanitizeFilter', true) before connecting.
  //   Then await mongoose.connect(...) with the URI, and log
  //   mongoose.connection.name so you can see which database you're using.

  console.log('connectDb() is not written yet, so nothing is saved.');
}
