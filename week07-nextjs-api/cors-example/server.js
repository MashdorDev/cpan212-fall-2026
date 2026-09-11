import cors from 'cors';
import express from 'express';

const port = process.env.PORT ?? 4000;

// Browsers may only call this API from these origins. A comma-separated env var lets the deployed
// API add its real frontend address without a code change.
const allowedOrigins = (process.env.CORS_ORIGINS ?? 'http://localhost:3000').split(',');

const app = express();

// For a request from an allowed origin, cors() adds Access-Control-Allow-Origin to the response
// and answers the browser's OPTIONS preflight. For any other origin it adds nothing, and the
// browser refuses to hand the response to the page. Requests without an Origin header
// (curl, Bruno, server-to-server fetch) are not affected, because CORS is a browser rule.
app.use(cors({ origin: allowedOrigins }));
app.use(express.json());

app.get('/api/events', (req, res) => {
  res.json({
    data: [{ id: '2ee63bdf-ece8-4397-b08b-fa74c92fafef', title: 'Fall hackathon kickoff', category: 'academic' }],
  });
});

app.post('/api/events', (req, res) => {
  res.status(201).json({ data: { id: crypto.randomUUID(), ...req.body } });
});

app.listen(port, (error) => {
  if (error) {
    throw error;
  }
  console.log(`CORS example API at http://localhost:${port}, allowing ${allowedOrigins.join(', ')}`);
});
