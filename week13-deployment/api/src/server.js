import mongoose from 'mongoose';
import { app } from './app.js';
import { connectDb } from './db.js';
import { sessionStore } from './session.js';

const port = process.env.PORT ?? 4000;
// Render sends SIGKILL 30 seconds after SIGTERM, so stop waiting a little before that.
const SHUTDOWN_TIMEOUT_MS = 25_000;

// Connect first. If the database is unreachable, connectDb() stops the process with a message,
// so the API never starts accepting requests it can't answer.
await connectDb();

const server = app.listen(port, (error) => {
  if (error) {
    throw error;
  }
  console.log(`Campus Events API running at http://localhost:${port}`);
});

// Hosts like Render send SIGTERM before they stop an instance: on every deploy, on a restart, and when a free
// instance goes to sleep. Ctrl+C in a terminal sends SIGINT. Either way, let the requests in progress finish and
// close the database connections before exiting, instead of cutting people off in the middle of a request.
function shutDown(signal) {
  console.log(`${signal} received, closing the server`);

  // If a slow request keeps a connection open, exit anyway before the host kills the process.
  // unref() stops this timer from keeping Node running on its own.
  setTimeout(() => {
    console.error('Open connections did not close in time, exiting anyway');
    process.exit(1);
  }, SHUTDOWN_TIMEOUT_MS).unref();

  // close() stops accepting new connections, and calls back once the open ones have finished.
  server.close(async (error) => {
    let exitCode = error ? 1 : 0;
    try {
      await Promise.all([mongoose.disconnect(), sessionStore.close()]);
      console.log('Server and database connections closed');
    } catch (closeError) {
      console.error('Could not close the database connections:', closeError);
      exitCode = 1;
    }
    process.exit(exitCode);
  });
}

process.once('SIGTERM', () => shutDown('SIGTERM'));
process.once('SIGINT', () => shutDown('SIGINT'));
