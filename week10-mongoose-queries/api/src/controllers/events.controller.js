import mongoose from 'mongoose';
import { Event } from '../models/Event.js';
import { Rsvp } from '../models/Rsvp.js';
import { parseEventListQuery } from '../utils/event-list-query.js';
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

export async function listEvents(req, res) {
  // Throws a 400 with a message per parameter when the query is wrong. See utils/event-list-query.js.
  const { filter, sort, page, limit } = parseEventListQuery(req.query);

  // Two queries at once: one page of events, and how many events match in total (for totalPages).
  // skip() jumps over the earlier pages: page 3 with limit 10 skips 20 events.
  const [events, total] = await Promise.all([
    Event.find(filter)
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(limit),
    Event.countDocuments(filter),
  ]);

  // A page past the end is not an error: it just has no events, like an empty search.
  res.json({ data: events, page, limit, total, totalPages: Math.ceil(total / limit) });
}

export async function getEvent(req, res) {
  const event = await findByIdOr404(Event, req.params.id);
  // countDocuments() counts on the server. Loading every RSVP just to read .length would be much slower.
  const rsvpCount = await Rsvp.countDocuments({ event: event._id });
  // toJSON() gives the plain object (with id instead of _id), so rsvpCount can be added next to the fields.
  res.json({ data: { ...event.toJSON(), rsvpCount } });
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
  // MongoDB doesn't delete related documents for you, so remove the event's RSVPs too.
  await Rsvp.deleteMany({ event: event._id });
  await removeUpload(event.imageUrl);
  res.status(204).end();
}
