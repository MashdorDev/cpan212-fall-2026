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

  // TODO STEP 6a: build the RSVP and check its fields
  // The event id comes from the URL. Only the name and email come from the body.
  // validate() checks the schema rules without saving. A bad field goes to the error handler (400).
  // Type under this comment:
  //
  //   const rsvp = new Rsvp({
  //     event: event._id,
  //     name: req.body.name,
  //     email: req.body.email,
  //   });
  //   await rsvp.validate();
  //
  // Check: on any event page, press RSVP with the form empty. Red messages show under Name and Email.

  // TODO STEP 6b: 409 when this email already has an RSVP
  // 409 Conflict: the request is fine, but it clashes with what is already saved.
  // Type under this comment:
  //
  //   const alreadyRegistered = await Rsvp.exists({ event: event._id, email: rsvp.email });
  //   if (alreadyRegistered) {
  //     throw new HttpError(409, 'This email already has an RSVP for this event', { email: 'Already registered' });
  //   }
  //
  // Check: on Fall hackathon kickoff, RSVP as Priya with PRIYA.SHARMA@example.com (the seed added her).
  // It says "already has an RSVP" (HTTP 409). Upper case doesn't matter: the schema saved it in lowercase.

  // TODO STEP 6c: 409 when the event is full
  // Type under this comment:
  //
  //   const taken = await Rsvp.countDocuments({ event: event._id });
  //   if (taken >= event.capacity) {
  //     throw new HttpError(409, 'This event is full');
  //   }
  //
  // Check: Fall hackathon kickoff has 3 RSVPs. Make it hold 3 people with the PATCH curl command in
  // api/README.md, then RSVP with a new email: "This event is full" (HTTP 409).
  // Then set it back to 120 with the same command and "capacity":120.

  // TODO STEP 6d: save the RSVP and answer 201
  // Replace the throw line below with:
  //
  //   await rsvp.save();
  //   res.status(201).json({ data: rsvp });
  //
  // Check: RSVP on any event that isn't full. "You're on the list" (HTTP 201).
  // Send the same email again: 409 from step 6b.
  throw new HttpError(501, 'Saving RSVPs is not built yet (TODO STEP 6d)');

  // TODO STEP 6e: the unique index as the last line of defence
  // Two requests with the same email at the same moment can both pass step 6b. The unique index from
  // step 5d lets only one in. The other save fails with error code 11000, and we turn it into a 409.
  // Try it first: put // in front of the 3 lines of step 6b and RSVP twice with the same email.
  // The second one says "Internal server error" (HTTP 500), and the API terminal shows E11000.
  // Then replace the "await rsvp.save();" line from step 6d (above) with:
  //
  //   try {
  //     await rsvp.save();
  //   } catch (error) {
  //     if (error.code === DUPLICATE_KEY) {
  //       throw new HttpError(409, 'This email already has an RSVP for this event', { email: 'Already registered' });
  //     }
  //     throw error;
  //   }
  //
  // Check: the same email twice now answers 409, from the database. Take the // off step 6b again.
}

// Anyone can call this in Week 10, so anyone can read every attendee's email address.
// Week 11 fixes that: only the event's organizer will see the list.
export async function listRsvps(req, res) {
  const event = await findEventOr404(req.params.id);

  // TODO STEP 7b: list the event's RSVPs, oldest first
  // Replace the throw line below with:
  //
  //   const rsvps = await Rsvp.find({ event: event._id }).sort({ createdAt: 1 });
  //   res.json({ data: rsvps });
  //
  // Check: copy the id of Fall hackathon kickoff and open http://localhost:4000/api/events/ID/rsvps
  // Each RSVP's "event" is just an id, like "6731f0c2a1b2c3d4e5f60718".

  // TODO STEP 7c: fill in each RSVP's event with populate()
  // populate() runs a second query. It swaps each event id for that event's title and startsAt.
  // In the find line from step 7b, add .populate('event', 'title startsAt') after .sort(...):
  //
  //   const rsvps = await Rsvp.find({ event: event._id }).sort({ createdAt: 1 }).populate('event', 'title startsAt');
  //
  // Check: refresh the same URL. Each "event" is now an object with id, title and startsAt.
  throw new HttpError(501, 'Listing RSVPs is not built yet (TODO STEP 7b)');
}
