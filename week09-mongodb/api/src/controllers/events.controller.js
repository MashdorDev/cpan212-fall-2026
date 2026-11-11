import { CATEGORIES, Event } from '../models/Event.js';
import { findEventOr404 } from '../utils/find-event.js';
import { HttpError } from '../utils/http-error.js';
import { removeUpload } from '../utils/uploads.js';

// A search for "c++" should look for a plus sign, not treat + as a regex symbol.
// This puts a \ in front of every special character so the text matches as typed.
function escapeRegex(text) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export async function listEvents(req, res) {
  const category = req.query.category;
  const q = req.query.q;

  // ?category=a&category=b arrives as an array. includes() rejects that and any unknown category.
  if (category !== undefined && !CATEGORIES.includes(category)) {
    throw new HttpError(400, 'Invalid query', { category: 'Must be one of: ' + CATEGORIES.join(', ') });
  }
  if (q !== undefined && typeof q !== 'string') {
    throw new HttpError(400, 'Invalid query', { q: 'Send q only once' });
  }

  // The filter says which events we want. An empty filter {} means all of them.
  const filter = {};
  if (category) {
    filter.category = category;
  }
  if (q) {
    // The i flag ignores upper and lower case.
    filter.title = new RegExp(escapeRegex(q), 'i');
  }

  // 1 means oldest first.
  const events = await Event.find(filter).sort({ startsAt: 1 });
  res.json({ data: events });
}

export async function getEvent(req, res) {
  const event = await findEventOr404(req.params.id);
  res.json({ data: event });
}

export async function createEvent(req, res) {
  // req.body is undefined when the request had no JSON body.
  if (!req.body) {
    throw new HttpError(400, 'Validation failed', { body: 'Send a JSON object' });
  }

  // Copy only the fields an event has. A client can't pick its own _id or createdAt.
  // create() checks the schema rules. If one fails, the error handler answers 400.
  const event = await Event.create({
    title: req.body.title,
    description: req.body.description,
    category: req.body.category,
    location: req.body.location,
    startsAt: req.body.startsAt,
    capacity: req.body.capacity,
    imageUrl: req.body.imageUrl,
  });

  res.location('/api/events/' + event.id);
  res.status(201).json({ data: event });
}

export async function updateEvent(req, res) {
  if (!req.body) {
    throw new HttpError(400, 'Validation failed', { body: 'Send a JSON object' });
  }

  // Copy only the fields that were sent.
  const changes = {};
  const fields = ['title', 'description', 'category', 'location', 'startsAt', 'capacity', 'imageUrl'];
  for (const field of fields) {
    if (req.body[field] !== undefined) {
      changes[field] = req.body[field];
    }
  }

  // Answers 404 for a bad id or an event that doesn't exist.
  await findEventOr404(req.params.id);

  // returnDocument: 'after' sends back the event with the changes (the default is the old version).
  // runValidators: true checks the schema rules. Updates skip them unless you ask.
  const event = await Event.findByIdAndUpdate(req.params.id, changes, {
    returnDocument: 'after',
    runValidators: true,
  });
  res.json({ data: event });
}

export async function deleteEvent(req, res) {
  const event = await findEventOr404(req.params.id);
  await event.deleteOne();
  await removeUpload(event.imageUrl);
  res.status(204).end();
}
