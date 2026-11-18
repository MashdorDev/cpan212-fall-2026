import { Rsvp } from '../models/Rsvp.js';
import { findEventOr404 } from '../utils/find-event.js';
import { HttpError } from '../utils/http-error.js';

// MongoDB's error code when a save breaks a unique index.
const DUPLICATE_KEY = 11000;

export async function createRsvp(req, res) {
  const event = await findEventOr404(req.params.id);

  if (!req.body) {
    throw new HttpError(400, 'Validation failed', { body: 'Send a JSON object' });
  }

  // The event id comes from the URL. Only the name and email come from the body.
  const rsvp = new Rsvp({
    event: event._id,
    name: req.body.name,
    email: req.body.email,
  });

  // validate() checks the schema rules without saving. A bad name or email goes to the
  // error handler, which answers 400.
  await rsvp.validate();

  // 409 Conflict: the request is fine, but it clashes with what is already saved.
  const alreadyRegistered = await Rsvp.exists({ event: event._id, email: rsvp.email });
  if (alreadyRegistered) {
    throw new HttpError(409, 'This email already has an RSVP for this event', { email: 'Already registered' });
  }

  const taken = await Rsvp.countDocuments({ event: event._id });
  if (taken >= event.capacity) {
    throw new HttpError(409, 'This event is full');
  }

  try {
    await rsvp.save();
  } catch (error) {
    // Two requests with the same email at the same moment can both pass the check above.
    // The unique index lets only one in. The other one fails with code 11000.
    if (error.code === DUPLICATE_KEY) {
      throw new HttpError(409, 'This email already has an RSVP for this event', { email: 'Already registered' });
    }
    throw error;
  }

  res.status(201).json({ data: rsvp });
}

// Anyone can call this in Week 10, so anyone can read every attendee's email address.
// Week 11 fixes that: only the event's organizer will see the list.
export async function listRsvps(req, res) {
  const event = await findEventOr404(req.params.id);

  // populate() runs a second query. It swaps each RSVP's event id for that event's title and startsAt.
  const rsvps = await Rsvp.find({ event: event._id }).sort({ createdAt: 1 }).populate('event', 'title startsAt');
  res.json({ data: rsvps });
}
