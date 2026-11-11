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

  // TODO STEP 4: read the events from the database.
  // Why: this still sends an empty list, so /events says "Showing 0 of 0 events".
  // Replace the res.json line below with:
  //
  //   // The filter says which events we want. An empty filter {} means all of them.
  //   const filter = {};
  //   if (category) {
  //     filter.category = category;
  //   }
  //   if (q) {
  //     // The i flag ignores upper and lower case.
  //     filter.title = new RegExp(escapeRegex(q), 'i');
  //   }
  //
  //   // 1 means oldest first.
  //   const events = await Event.find(filter).sort({ startsAt: 1 });
  //   res.json({ data: events });
  //
  // Check: http://localhost:4000/api/events shows 8 events, each with an "id".
  // http://localhost:3000/events says "Showing 8 of 8 events".
  // http://localhost:4000/api/events?category=career shows 2.
  res.json({ data: [] });
}

export async function getEvent(req, res) {
  // TODO STEP 5b: send one event.
  // Why: clicking an event on /events still gives the 404 page.
  // Replace the throw line below with:
  //
  //   const event = await findEventOr404(req.params.id);
  //   res.json({ data: event });
  //
  // Check: click any event on http://localhost:3000/events. Its page opens.
  // http://localhost:4000/api/events/abc answers 404 {"error":{"message":"Event not found"}}.
  throw new HttpError(404, 'Event not found');
}

export async function createEvent(req, res) {
  // req.body is undefined when the request had no JSON body.
  if (!req.body) {
    throw new HttpError(400, 'Validation failed', { body: 'Send a JSON object' });
  }

  // TODO STEP 6a: save a new event.
  // Why: the form at http://localhost:3000/events/new sends here. Until now nothing was saved.
  // Replace the throw line below with:
  //
  //   // Copy only the fields an event has. A client can't pick its own _id or createdAt.
  //   // create() checks the schema rules. If one fails, the error handler answers 400.
  //   const event = await Event.create({
  //     title: req.body.title,
  //     description: req.body.description,
  //     category: req.body.category,
  //     location: req.body.location,
  //     startsAt: req.body.startsAt,
  //     capacity: req.body.capacity,
  //     imageUrl: req.body.imageUrl,
  //   });
  //
  //   res.location('/api/events/' + event.id);
  //   res.status(201).json({ data: event });
  //
  // Check: fill in the whole form and press Create event. You land on the new event.
  // Restart the API: the event is still there. Now press Create event with the form empty.
  // The form says "Internal server error". Step 6b fixes that.
  throw new HttpError(501, 'Saving events is not built yet (TODO STEP 6a)');
}

export async function updateEvent(req, res) {
  if (!req.body) {
    throw new HttpError(400, 'Validation failed', { body: 'Send a JSON object' });
  }

  // TODO STEP 7a: change an event.
  // Why: PATCH sends only the fields to change. Updates skip the schema rules unless you ask,
  // so without runValidators a capacity of -5 would be saved.
  // Replace the throw line below with:
  //
  //   // Copy only the fields that were sent.
  //   const changes = {};
  //   const fields = ['title', 'description', 'category', 'location', 'startsAt', 'capacity', 'imageUrl'];
  //   for (const field of fields) {
  //     if (req.body[field] !== undefined) {
  //       changes[field] = req.body[field];
  //     }
  //   }
  //
  //   // Answers 404 for a bad id or an event that doesn't exist.
  //   await findEventOr404(req.params.id);
  //
  //   // returnDocument: 'after' sends back the event with the changes (the default is the old version).
  //   // runValidators: true checks the schema rules. Updates skip them unless you ask.
  //   const event = await Event.findByIdAndUpdate(req.params.id, changes, {
  //     returnDocument: 'after',
  //     runValidators: true,
  //   });
  //   res.json({ data: event });
  //
  // Check: the PATCH curl commands in the README. A new location is saved, capacity -5 answers 400.
  throw new HttpError(501, 'Changing events is not built yet (TODO STEP 7a)');
}

export async function deleteEvent(req, res) {
  // TODO STEP 7b: delete an event.
  // Why: the event leaves the database, and its uploaded image (if it has one) leaves uploads/.
  // Replace the throw line below with:
  //
  //   const event = await findEventOr404(req.params.id);
  //   await event.deleteOne();
  //   await removeUpload(event.imageUrl);
  //   res.status(204).end();
  //
  // Check: the DELETE curl command in the README answers 204. Send it again: 404.
  throw new HttpError(501, 'Deleting events is not built yet (TODO STEP 7b)');
}
