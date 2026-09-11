import express from 'express';
import { connectDb } from './db.js';
import { errorHandler } from './middleware/error-handler.js';
import { notFound } from './middleware/not-found.js';
import { plantsRouter } from './routes/plants.routes.js';

// This file is finished. Read it once so you know the order: connect to the
// database first, then set up the app, then start listening.
await connectDb();

const app = express();

app.use(express.json());
app.use('/api/plants', plantsRouter);

// These two stay last: notFound catches anything no route matched,
// errorHandler catches anything thrown along the way.
app.use(notFound);
app.use(errorHandler);

const port = Number(process.env.PORT) || 4000;
app.listen(port, (error) => {
  if (error) {
    console.error(error);
    process.exit(1);
  }
  console.log(`Plants API listening on http://localhost:${port}`);
});
