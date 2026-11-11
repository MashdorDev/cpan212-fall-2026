import { app } from './app.js';

// TODO STEP 1b: connect before taking requests.
// Why: if the database is down, the API should stop with a clear message,
// not start and then fail on every request.
// Delete these TODO lines and type (the import goes with the other import at the top):
//
//   import { connectDb } from './db.js';
//
//   // Connect to the database before taking requests.
//   await connectDb();
//
// Check: the API terminal says Connected to MongoDB, database "campus_events".
// Then stop the API (Ctrl+C), rename MONGODB_URI in api/.env to MONGODB_URL and run npm run dev:
// the API stops with "MONGODB_URI is not set". Change it back and start it again.

const port = process.env.PORT ?? 4000;

app.listen(port, (error) => {
  if (error) {
    throw error;
  }
  console.log(`Campus Events API running at http://localhost:${port}`);
});
