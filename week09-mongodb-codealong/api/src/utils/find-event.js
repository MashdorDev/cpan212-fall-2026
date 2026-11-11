import mongoose from 'mongoose';
import { Event } from '../models/Event.js';
import { HttpError } from './http-error.js';

// Loads one event by its id, or throws a 404.
// TODO STEP 5a: find one event.
// Why: the event page, PATCH, DELETE, the holiday check and the admin delete button all need to
// load one event or answer 404. Writing it once here means all five behave the same.
// Replace the 3 lines of findEventOr404() below with:
//
//   export async function findEventOr404(id) {
//     // A MongoDB id is 24 letters and numbers, like 6731f0c2a1b2c3d4e5f60718.
//     // Anything else can't be an event, so answer 404 without asking the database.
//     if (!mongoose.isObjectIdOrHexString(id)) {
//       throw new HttpError(404, 'Event not found');
//     }
//
//     const event = await Event.findById(id);
//     if (!event) {
//       throw new HttpError(404, 'Event not found');
//     }
//     return event;
//   }
//
// Check: nothing yet. Step 5b uses it.
export async function findEventOr404(id) {
  throw new HttpError(404, 'Event not found');
}
