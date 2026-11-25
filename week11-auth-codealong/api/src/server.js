import { app } from './app.js';
import { connectDb } from './db.js';

let port = 4000;
if (process.env.PORT) {
  port = process.env.PORT;
}

// Connect to the database before taking requests.
await connectDb();

app.listen(port, (error) => {
  if (error) {
    throw error;
  }
  console.log('Campus Events API running at http://localhost:' + port);
});
