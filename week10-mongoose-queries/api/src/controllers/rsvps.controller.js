import { Event } from '../models/Event.js';
import { Rsvp } from '../models/Rsvp.js';
import { findByIdOr404 } from '../utils/find-by-id.js';
import { HttpError } from '../utils/http-error.js';

// MongoDB's error code for a write that breaks a unique index.
const DUPLICATE_KEY = 11000;

export async function createRsvp(req, res) {
  const event = await findByIdOr404(Event, req.params.id);

  // Only name and email come from the body. The event id comes from the URL.
  const rsvp = new Rsvp({ event: event._id, name: req.body?.name, email: req.body?.email });
  // Check the fields first, so bad input gets a 400 even when the event is full.
  // A ValidationError goes to the error handler, which answers 400.
  await rsvp.validate();

  // After validate(), rsvp.email is a trimmed, lowercase string, so it is safe to use in a filter.
  // This comes before the capacity check, so someone who already has a spot hears that, not "full".
  if (await Rsvp.exists({ event: event._id, email: rsvp.email })) {
    throw new HttpError(409, 'This email already has an RSVP for this event', { email: 'Already registered' });
  }

  const taken = await Rsvp.countDocuments({ event: event._id });
  // Two requests for the last spot can both pass this check before either one saves, and the event ends up
  // one over capacity. Closing that gap needs an atomic update (for example a spotsLeft counter changed with
  // $inc in the same query that checks it). For a campus event list, the simple check is a fair trade.
  if (taken >= event.capacity) {
    throw new HttpError(409, 'This event is full');
  }

  try {
    await rsvp.save();
  } catch (error) {
    // exists() above handles the usual case. This catches two requests for the same email that both
    // passed exists() at the same moment: the unique index lets only one of them in.
    if (error.code === DUPLICATE_KEY) {
      throw new HttpError(409, 'This email already has an RSVP for this event', { email: 'Already registered' });
    }
    throw error;
  }

  res.status(201).json({ data: rsvp });
}

// Anyone can call this in Week 10, so anyone can read every attendee's email address.
// Week 11 fixes that: only the event's organizer can see the list.
export async function listRsvps(req, res) {
  const event = await findByIdOr404(Event, req.params.id);

  // populate() runs a second query and replaces each RSVP's event id with the event's title and startsAt.
  // Every RSVP here belongs to the same event, so this repeats the same event in every row. It is here to
  // show what populate() returns. A "my RSVPs" page, with many different events, is where it earns its place.
  const rsvps = await Rsvp.find({ event: event._id }).sort({ createdAt: 1 }).populate('event', 'title startsAt');

  res.json({ data: rsvps });
}
