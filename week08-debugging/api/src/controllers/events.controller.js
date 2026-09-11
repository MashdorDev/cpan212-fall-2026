import { deleteEventById, findEventById, findEvents, insertEvent, updateEventById } from '../data/events.js';
import { CATEGORIES } from '../validators/event.js';
import { HttpError } from '../utils/http-error.js';
import { removeUpload } from '../utils/uploads.js';

export function listEvents(req, res) {
  const { category, q } = req.query;

  // Query values are strings, but ?category=a&category=b arrives as an array. includes() rejects both
  // an unknown category and an array, so the filter code below can trust what it gets.
  if (category !== undefined && !CATEGORIES.includes(category)) {
    throw new HttpError(400, 'Invalid query', { category: `Must be one of: ${CATEGORIES.join(', ')}` });
  }
  if (q !== undefined && typeof q !== 'string') {
    throw new HttpError(400, 'Invalid query', { q: 'Send q only once' });
  }

  res.json({ data: findEvents({ category, q }) });
}

export function getEvent(req, res) {
  const event = findEventById(req.params.id);
  if (!event) {
    throw new HttpError(404, 'Event not found');
  }
  res.json({ data: event });
}

export function createEvent(req, res) {
  const event = insertEvent(req.body);
  res.json({ data: event });
}

export function updateEvent(req, res) {
  const event = updateEventById(req.params.id, req.body);
  if (!event) {
    throw new HttpError(404, 'Event not found');
  }
  res.json({ data: event });
}

export async function deleteEvent(req, res) {
  const event = findEventById(req.params.id);
  if (!event) {
    throw new HttpError(404, 'Event not found');
  }
  deleteEventById(event.id);
  await removeUpload(event.imageUrl);
  res.status(204).end();
}
