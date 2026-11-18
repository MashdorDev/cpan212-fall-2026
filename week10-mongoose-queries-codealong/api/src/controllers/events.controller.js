import mongoose from 'mongoose';
import { CATEGORIES, Event } from '../models/Event.js';
import { Rsvp } from '../models/Rsvp.js';
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
    // TODO STEP 1a: turn ?from= into a date, or answer 400
    // new Date('nope') is an Invalid Date, and getTime() gives NaN for it.
    // Type under this comment:
    //
    //   const fromDate = new Date(from);
    //   if (typeof from !== 'string' || isNaN(fromDate.getTime())) {
    //     throw new HttpError(400, 'Invalid query', { from: 'Must be a date like 2026-11-01' });
    //   }
    //
    // Check: http://localhost:4000/api/events?from=nope answers 400.

    // TODO STEP 1b: keep the events on or after that date
    // $gte means "greater than or equal". Type under this comment:
    //
    //   filter.startsAt = { $gte: fromDate };
    //
    // Predict, then open http://localhost:4000/api/events?from=2026-11-01
    // You get a 400 about the start time, not 2 events. Why? db.js turns on sanitizeFilter,
    // which turns every $ operator into plain text to stop attacks. Ours too. Step 1c fixes it.

    // TODO STEP 1c: tell Mongoose this $gte is ours
    // Change the line from step 1b to:
    //
    //   filter.startsAt = mongoose.trusted({ $gte: fromDate });
    //
    // Check: http://localhost:4000/api/events?from=2026-11-01 shows 2 events, Open mic night and ball hockey.
  }

  // TODO STEP 2a: read ?page= from the URL
  // ?page=2 arrives as the text "2". Number() turns it into the number 2.
  // Type under this comment:
  //
  //   let page = 1;
  //   if (req.query.page !== undefined) {
  //     page = Number(req.query.page);
  //   }

  // TODO STEP 2b: answer 400 for a bad page
  // Number.isInteger() is false for "abc" (it became NaN), 2.5 and a repeated ?page=1&page=2.
  // Type under this comment:
  //
  //   if (!Number.isInteger(page) || page < 1) {
  //     throw new HttpError(400, 'Invalid query', { page: 'Must be a whole number, 1 or more' });
  //   }
  //
  // Check: http://localhost:4000/api/events?page=abc answers 400.

  // TODO STEP 2c: read and check ?limit= (how many events on one page)
  // The same two parts as 2a and 2b, with a default of 10 and a top of MAX_LIMIT.
  // Type under this comment:
  //
  //   let limit = 10;
  //   if (req.query.limit !== undefined) {
  //     limit = Number(req.query.limit);
  //   }
  //   if (!Number.isInteger(limit) || limit < 1 || limit > MAX_LIMIT) {
  //     throw new HttpError(400, 'Invalid query', { limit: 'Must be a whole number from 1 to ' + MAX_LIMIT });
  //   }
  //
  // Check: http://localhost:4000/api/events?limit=500 answers 400.

  // TODO STEP 3a: read ?sort= from the URL
  // Type under this comment:
  //
  //   let sort = 'startsAt';
  //   if (req.query.sort !== undefined) {
  //     sort = req.query.sort;
  //   }
  //   if (typeof sort !== 'string') {
  //     throw new HttpError(400, 'Invalid query', { sort: 'Send sort only once' });
  //   }

  // TODO STEP 3b: a minus in front means backwards
  // ?sort=-title means "title, Z to A". slice(1) drops the first character.
  // Type under this comment:
  //
  //   let sortField = sort;
  //   let direction = 1;
  //   if (sort.startsWith('-')) {
  //     sortField = sort.slice(1);
  //     direction = -1;
  //   }

  // TODO STEP 3c: only allow the fields on the list
  // Without this, a client could sort on any field, even ones we never meant to share.
  // Type under this comment:
  //
  //   if (!SORT_FIELDS.includes(sortField)) {
  //     throw new HttpError(400, 'Invalid query', {
  //       sort: 'Must be one of: ' + SORT_FIELDS.join(', ') + '. Put - in front to reverse, like -startsAt',
  //     });
  //   }
  //
  // Check: http://localhost:4000/api/events?sort=password answers 400.

  // TODO STEP 3d: build the sort object
  // For ?sort=-title this makes { title: -1, _id: -1 }. _id breaks ties: two events at the same
  // time always come back in the same order, so one can't show up on page 1 and again on page 2.
  // Type under this comment:
  //
  //   const sortBy = {};
  //   sortBy[sortField] = direction;
  //   sortBy._id = direction;

  // TODO STEP 2d: skip the earlier pages and send one page
  // skip() jumps over the earlier pages. Page 3 with 10 per page skips 20 events.
  // Replace the "const events" line below with:
  //
  //   const skip = (page - 1) * limit;
  //   const events = await Event.find(filter).sort({ startsAt: 1 }).skip(skip).limit(limit);
  //
  // Check: http://localhost:4000/api/events?limit=3&page=2 shows Resume review, Midterm study skills
  // and Student art show. The web app (6 per page) now says "Showing 6 of 6 events". 6 of 6 is wrong:
  // there are 8. Step 2e fixes that.

  // TODO STEP 3e: use the sort object
  // In the "const events" line from step 2d, change .sort({ startsAt: 1 }) to .sort(sortBy)
  //
  // Check: http://localhost:4000/api/events?sort=-title&limit=3 starts with Thanksgiving residence potluck.
  // On http://localhost:3000/events the Sort links work.
  const events = await Event.find(filter).sort({ startsAt: 1 });

  // TODO STEP 2e: count every match, so the web app can show "Page 1 of 2"
  // countDocuments() counts in the database. Math.ceil() rounds up: 8 events / 3 per page = 3 pages.
  // Replace the res.json line below with:
  //
  //   const total = await Event.countDocuments(filter);
  //   const totalPages = Math.ceil(total / limit);
  //   res.json({ data: events, page: page, limit: limit, total: total, totalPages: totalPages });
  //
  // Check: http://localhost:4000/api/events?limit=3 ends with "total":8,"totalPages":3.
  // http://localhost:3000/events says "Showing 6 of 8 events" and "Page 1 of 2". Next works.
  res.json({ data: events, page: 1, limit: events.length, total: events.length, totalPages: 1 });
}

export async function getEvent(req, res) {
  const event = await findEventOr404(req.params.id);

  // TODO STEP 7a: send how many RSVPs the event has
  // countDocuments() counts in the database, without loading every RSVP.
  // toJSON() turns the event into a plain object (with "id"), so we can add one more field to it.
  // Replace the res.json line below with:
  //
  //   const rsvpCount = await Rsvp.countDocuments({ event: event._id });
  //   const data = event.toJSON();
  //   data.rsvpCount = rsvpCount;
  //   res.json({ data: data });
  //
  // Check: open Fall hackathon kickoff on http://localhost:3000/events. Spots says "3 of 120 taken"
  // (more if you added RSVPs in step 6). RSVP with a new email: the number goes up by 1.
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

  // TODO STEP 7d: delete the event's RSVPs too
  // MongoDB doesn't delete the RSVPs that point to this event. We do it ourselves.
  // Type under this comment:
  //
  //   await Rsvp.deleteMany({ event: event._id });
  //
  // Check: use the DELETE curl command in api/README.md on Fall hackathon kickoff.
  // In Compass, refresh rsvps: its 3 RSVPs are gone (5 became 2).

  await removeUpload(event.imageUrl);
  res.status(204).end();
}
