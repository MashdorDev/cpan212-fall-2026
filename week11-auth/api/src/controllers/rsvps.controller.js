import { checkOrganizer } from '../middleware/require-auth.js';
import { Rsvp } from '../models/Rsvp.js';
import { findEventOr404 } from '../utils/find-event.js';
import { HttpError } from '../utils/http-error.js';

// MongoDB's error code when a save breaks a unique index.
const DUPLICATE_KEY = 11000;

export async function createRsvp(req, res) {
  const event = await findEventOr404(req.params.id);

  // The event id comes from the URL. The name and email come from the logged-in user,
  // so nobody can RSVP in someone else's name. The request needs no body at all.
  const rsvp = new Rsvp({
    event: event._id,
    name: req.user.name,
    email: req.user.email,
  });

  // 409 Conflict: the request is fine, but it clashes with what is already saved.
  const alreadyRegistered = await Rsvp.exists({ event: event._id, email: rsvp.email });
  if (alreadyRegistered) {
    throw new HttpError(409, 'You already have an RSVP for this event');
  }

  // Not a guarantee: two people asking for the last spot at the same moment can both pass this check,
  // and the event ends up one over. The database would need to enforce it, like the unique index does
  // for emails. For a campus event, the simple check is a fair trade.
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
      throw new HttpError(409, 'You already have an RSVP for this event');
    }
    throw error;
  }

  res.status(201).json({ data: rsvp });
}

// The list has every attendee's email address, so only the event's organizer can see it.
export async function listRsvps(req, res) {
  const event = await findEventOr404(req.params.id);
  checkOrganizer(event, req.user);

  // populate() runs a second query. It swaps each RSVP's event id for that event's title and startsAt.
  const rsvps = await Rsvp.find({ event: event._id }).sort({ createdAt: 1 }).populate('event', 'title startsAt');
  res.json({ data: rsvps });
}
