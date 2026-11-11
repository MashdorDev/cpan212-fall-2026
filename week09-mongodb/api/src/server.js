import { app } from './app.js';
import { connectDb } from './db.js';

const port = process.env.PORT ?? 4000;

// Connect to the database before taking requests.
await connectDb();

app.listen(port, (error) => {
  if (error) {
    throw error;
  }
  console.log(`Campus Events API running at http://localhost:${port}`);
});
