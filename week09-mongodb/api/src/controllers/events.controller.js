import mongoose from 'mongoose';
import { CATEGORIES, Event } from '../models/Event.js';
import { findByIdOr404 } from '../utils/find-by-id.js';
import { HttpError } from '../utils/http-error.js';
import { removeUpload } from '../utils/uploads.js';

// Only these fields are copied from the request body. Anything else, like _id or createdAt,
// is ignored, so a client can't choose its own id or backdate an event.
const EDITABLE_FIELDS = ['title', 'description', 'category', 'location', 'startsAt', 'capacity', 'imageUrl'];

function pickEditableFields(body) {
  const fields = {};
  for (const field of EDITABLE_FIELDS) {
    // req.body is undefined when the request had no JSON body. The ?. handles that.
    if (body?.[field] !== undefined) {
      fields[field] = body[field];
    }
  }
  return fields;
}

// A search for "c++" should look for a plus sign, not treat + as "one or more". Escaping every
// special character makes the text match literally, and stops input like "(" from breaking the query.
function escapeRegex(text) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export async function listEvents(req, res) {
  const { category, q } = req.query;

  // Query values are strings, but ?category=a&category=b arrives as an array. includes() rejects both
  // an unknown category and an array, so the filter below only ever gets a plain string.
  if (category !== undefined && !CATEGORIES.includes(category)) {
    throw new HttpError(400, 'Invalid query', { category: `Must be one of: ${CATEGORIES.join(', ')}` });
  }
  if (q !== undefined && typeof q !== 'string') {
    throw new HttpError(400, 'Invalid query', { q: 'Send q only once' });
  }

  const filter = {};
  if (category) {
    filter.category = category;
  }
  if (q) {
    // The i flag ignores upper and lower case, like the in-memory search did.
    filter.title = new RegExp(escapeRegex(q), 'i');
  }

  const events = await Event.find(filter).sort({ startsAt: 1 });
  res.json({ data: events });
}

export async function getEvent(req, res) {
  const event = await findByIdOr404(Event, req.params.id);
  res.json({ data: event });
}

export async function createEvent(req, res) {
  // create() runs the schema validation. If it fails, the ValidationError goes to the error handler,
  // which answers 400 with a message for each field.
  const event = await Event.create(pickEditableFields(req.body));
  // A 201 says where the new resource lives, so the client can GET it without building the URL itself.
  res.location(`/api/events/${event.id}`);
  res.status(201).json({ data: event });
}

export async function updateEvent(req, res) {
  const changes = pickEditableFields(req.body);
  if (Object.keys(changes).length === 0) {
    throw new HttpError(400, 'Validation failed', { body: 'Send at least one field to change' });
  }

  const { id } = req.params;
  // returnDocument: 'after' returns the event with the changes applied (the default is the old version).
  // runValidators: true checks the schema rules, which updates skip unless you ask.
  const event = mongoose.isValidObjectId(id)
    ? await Event.findByIdAndUpdate(id, changes, { returnDocument: 'after', runValidators: true })
    : null;
  if (!event) {
    throw new HttpError(404, 'Event not found');
  }
  res.json({ data: event });
}

export async function deleteEvent(req, res) {
  const event = await findByIdOr404(Event, req.params.id);
  await event.deleteOne();
  await removeUpload(event.imageUrl);
  res.status(204).end();
}
