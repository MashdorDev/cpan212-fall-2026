import express from 'express';
import { miniExpress } from './mini-express.js';

// node mini-express/server.js          runs this file on our mini Express
// node mini-express/server.js express  runs the same file on the real Express
const useRealExpress = process.argv[2] === 'express';
const app = useRealExpress ? express() : miniExpress();

app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.get('/api/broken', (req, res) => {
  throw new Error('Something broke');
});

app.get('/api/broken-later', async (req, res) => {
  await new Promise((resolve) => setTimeout(resolve, 100));
  throw new Error('Something broke after an await');
});

// Nothing above answered, so there is no such route.
app.use((req, res) => {
  res.status(404).json({ error: { message: `No route for ${req.method} ${req.path}` } });
});

app.use((err, req, res, next) => {
  console.error(`Error: ${err.message}`);
  res.status(500).json({ error: { message: 'Internal server error' } });
});

const port = Number(process.env.PORT ?? 4000);
app.listen(port, () => {
  console.log(`${useRealExpress ? 'Express' : 'Mini Express'} running at http://localhost:${port}`);
});
