import { assertOrganizer } from '../middleware/require-auth.js';
import { Event } from '../models/Event.js';
import { Rsvp } from '../models/Rsvp.js';
import { findByIdOr404 } from '../utils/find-by-id.js';
import { HttpError } from '../utils/http-error.js';

// MongoDB's error code for a write that breaks a unique index.
const DUPLICATE_KEY = 11000;

export async function createRsvp(req, res) {
  const event = await findByIdOr404(Event, req.params.id);

  // Nothing comes from the body any more: the event id is in the URL, and the name and email belong
  // to the logged-in user, so nobody can RSVP in someone else's name.
  const rsvp = new Rsvp({ event: event._id, name: req.user.name, email: req.user.email });

  // Before the capacity check, so someone who already has a spot hears that, not "full".
  if (await Rsvp.exists({ event: event._id, email: rsvp.email })) {
    throw new HttpError(409, 'You already have an RSVP for this event');
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
    // exists() above handles the usual case. This catches two requests from the same user that both
    // passed exists() at the same moment: the unique index lets only one of them in.
    if (error.code === DUPLICATE_KEY) {
      throw new HttpError(409, 'You already have an RSVP for this event');
    }
    throw error;
  }

  res.status(201).json({ data: rsvp });
}

// The list includes every attendee's email address, so only the event's organizer can see it.
export async function listRsvps(req, res) {
  const event = await findByIdOr404(Event, req.params.id);
  assertOrganizer(event, req.user);

  // populate() runs a second query and replaces each RSVP's event id with the event's title and startsAt.
  // Every RSVP here belongs to the same event, so this repeats the same event in every row. It is here to
  // show what populate() returns. A "my RSVPs" page, with many different events, is where it earns its place.
  const rsvps = await Rsvp.find({ event: event._id }).sort({ createdAt: 1 }).populate('event', 'title startsAt');

  res.json({ data: rsvps });
}
