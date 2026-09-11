import http from 'node:http';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { findEvents, findEventById, insertEvent } from './data/events.js';
import { CATEGORIES, validateEventInput } from './validators/event.js';

const port = process.env.PORT ?? 4000;
const indexPath = path.join(import.meta.dirname, '..', 'public', 'index.html');

function sendJson(res, status, body) {
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8' });
  res.end(JSON.stringify(body));
}

function sendError(res, status, message, details) {
  sendJson(res, status, { error: { message, details } });
}

// 405 responses must list the methods the path does support in an Allow header.
function sendMethodNotAllowed(res, allowed) {
  res.setHeader('Allow', allowed.join(', '));
  sendError(res, 405, `Method not allowed. Use ${allowed.join(' or ')}`);
}

// The body arrives as a stream of chunks. Collect them all, then parse.
// JSON.parse throws a SyntaxError on bad JSON, which the caller turns into a 400.
async function readJsonBody(req) {
  const chunks = [];
  for await (const chunk of req) {
    chunks.push(chunk);
  }
  return JSON.parse(Buffer.concat(chunks).toString('utf8'));
}

function listEvents(res, searchParams) {
  const category = searchParams.get('category');
  const q = searchParams.get('q');

  if (category && !CATEGORIES.includes(category)) {
    return sendError(res, 400, 'Invalid query', { category: `Must be one of: ${CATEGORIES.join(', ')}` });
  }
  sendJson(res, 200, { data: findEvents({ category, q }) });
}

function getEvent(res, id) {
  const event = findEventById(id);
  if (!event) {
    return sendError(res, 404, 'Event not found');
  }
  sendJson(res, 200, { data: event });
}

async function createEvent(req, res) {
  let body;
  try {
    body = await readJsonBody(req);
  } catch {
    return sendError(res, 400, 'Request body must be valid JSON');
  }

  const { value, errors } = validateEventInput(body);
  if (Object.keys(errors).length > 0) {
    return sendError(res, 400, 'Validation failed', errors);
  }
  sendJson(res, 201, { data: insertEvent(value) });
}

async function handleRequest(req, res) {
  // req.url is only the path and query ("/api/events?category=arts").
  // URL needs a full address to parse it, and the host part does not matter here.
  const { pathname, searchParams } = new URL(req.url, 'http://localhost');

  if (pathname === '/') {
    if (req.method !== 'GET') return sendMethodNotAllowed(res, ['GET']);
    const html = await readFile(indexPath);
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    return res.end(html);
  }

  if (pathname === '/api/health') {
    if (req.method !== 'GET') return sendMethodNotAllowed(res, ['GET']);
    return sendJson(res, 200, { status: 'ok' });
  }

  if (pathname === '/api/events') {
    if (req.method === 'GET') return listEvents(res, searchParams);
    if (req.method === 'POST') return createEvent(req, res);
    return sendMethodNotAllowed(res, ['GET', 'POST']);
  }

  // "/api/events/abc" split on "/" gives ['', 'api', 'events', 'abc'].
  const parts = pathname.split('/');
  if (parts.length === 4 && parts[1] === 'api' && parts[2] === 'events' && parts[3] !== '') {
    if (req.method !== 'GET') return sendMethodNotAllowed(res, ['GET']);
    return getEvent(res, parts[3]);
  }

  sendError(res, 404, `No route for ${req.method} ${pathname}`);
}

const server = http.createServer(async (req, res) => {
  const started = performance.now();
  res.on('finish', () => {
    console.log(`${req.method} ${req.url} ${res.statusCode} ${Math.round(performance.now() - started)}ms`);
  });

  try {
    await handleRequest(req, res);
  } catch (error) {
    // Without this, one unexpected error would crash the whole server for everyone.
    console.error(error);
    if (!res.headersSent) {
      sendError(res, 500, 'Internal server error');
    }
  }
});

server.listen(port, () => {
  console.log(`Campus Events API running at http://localhost:${port}`);
});
