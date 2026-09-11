import { app } from './app.js';
import { connectDb } from './db.js';

const port = process.env.PORT ?? 4000;

// Connect first. If the database is unreachable, connectDb() stops the process with a message,
// so the API never starts accepting requests it can't answer.
await connectDb();

app.listen(port, (error) => {
  if (error) {
    throw error;
  }
  console.log(`Campus Events API running at http://localhost:${port}`);
});
