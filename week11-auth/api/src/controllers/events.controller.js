import mongoose from 'mongoose';
import { checkOrganizer } from '../middleware/require-auth.js';
import { CATEGORIES, Event } from '../models/Event.js';
import { Rsvp } from '../models/Rsvp.js';
import { torontoInputToIso } from '../utils/dates.js';
import { findEventOr404 } from '../utils/find-event.js';
import { HttpError } from '../utils/http-error.js';
import { removeUpload } from '../utils/uploads.js';

// The most events one page can have, so nobody can ask for a million at once.
const MAX_LIMIT = 50;
// The only fields ?sort= accepts. Anything else is a 400.
const SORT_FIELDS = ['startsAt', 'title', 'createdAt'];

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

  // ?from=2026-11-01 keeps only the events that start on or after that date.
  const from = req.query.from;
  if (from !== undefined) {
    // new Date('2026-11-01') would be midnight in London (UTC), the evening before in Toronto.
    // torontoInputToIso() (from Week 5) makes it midnight in Toronto. A bad date gives NaN in getTime().
    const fromDate = new Date(torontoInputToIso(from + 'T00:00'));
    if (typeof from !== 'string' || isNaN(fromDate.getTime())) {
      throw new HttpError(400, 'Invalid query', { from: 'Must be a date like 2026-11-01' });
    }

    // $gte means "greater than or equal". sanitizeFilter (in db.js) turns every $ operator into
    // plain text, to stop attacks. mongoose.trusted() says: this one is ours, keep it.
    filter.startsAt = mongoose.trusted({ $gte: fromDate });
  }

  // ?page=2 arrives as the text "2". Number() turns it into a number.
  let page = 1;
  if (req.query.page !== undefined) {
    page = Number(req.query.page);
  }
  // Number.isInteger() is false for "abc" (NaN), 2.5 and a repeated ?page=1&page=2.
  if (!Number.isInteger(page) || page < 1) {
    throw new HttpError(400, 'Invalid query', { page: 'Must be a whole number, 1 or more' });
  }

  // ?limit=3 is how many events one page has.
  let limit = 10;
  if (req.query.limit !== undefined) {
    limit = Number(req.query.limit);
  }
  if (!Number.isInteger(limit) || limit < 1 || limit > MAX_LIMIT) {
    throw new HttpError(400, 'Invalid query', { limit: 'Must be a whole number from 1 to ' + MAX_LIMIT });
  }

  // ?sort=title is A to Z. A minus in front reverses it: ?sort=-title is Z to A.
  let sort = 'startsAt';
  if (req.query.sort !== undefined) {
    sort = req.query.sort;
  }
  if (typeof sort !== 'string') {
    throw new HttpError(400, 'Invalid query', { sort: 'Send sort only once' });
  }
  let sortField = sort;
  let direction = 1;
  if (sort.startsWith('-')) {
    sortField = sort.slice(1);
    direction = -1;
  }

  // Only fields on the list. Without this check a client could sort on any field.
  if (!SORT_FIELDS.includes(sortField)) {
    throw new HttpError(400, 'Invalid query', {
      sort: 'Must be one of: ' + SORT_FIELDS.join(', ') + '. Put - in front to reverse, like -startsAt',
    });
  }

  // { startsAt: 1, _id: 1 }. _id breaks ties: two events at the same time always come back in the
  // same order, so one can't show up on page 1 and again on page 2.
  const sortBy = {};
  sortBy[sortField] = direction;
  sortBy._id = direction;

  // skip() jumps over the earlier pages. Page 3 with 10 per page skips 20 events.
  const skip = (page - 1) * limit;
  const events = await Event.find(filter).sort(sortBy).skip(skip).limit(limit);

  // How many events match on all pages together, so the web app can show "Page 1 of 3".
  const total = await Event.countDocuments(filter);
  const totalPages = Math.ceil(total / limit);

  res.json({ data: events, page: page, limit: limit, total: total, totalPages: totalPages });
}

export async function getEvent(req, res) {
  const event = await findEventOr404(req.params.id);

  // countDocuments() counts in the database, without loading every RSVP.
  const rsvpCount = await Rsvp.countDocuments({ event: event._id });

  // toJSON() turns the event into a plain object (with "id"), so we can add one more field to it.
  const data = event.toJSON();
  data.rsvpCount = rsvpCount;
  res.json({ data: data });
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
    // The organizer is whoever is logged in. A client can't create an event in someone else's name.
    organizer: req.user._id,
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
  const existing = await findEventOr404(req.params.id);
  // 403 unless you organize this event.
  checkOrganizer(existing, req.user);

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
  checkOrganizer(event, req.user);
  await event.deleteOne();
  // MongoDB doesn't delete the RSVPs that point to this event. We do it ourselves.
  await Rsvp.deleteMany({ event: event._id });
  await removeUpload(event.imageUrl);
  res.status(204).end();
}
