import mongoose from 'mongoose';
import { toJSONOptions } from './to-json.js';

// One person going to one event. The RSVP stores the event's ObjectId, not a copy of the event:
// a reference, like a foreign key in SQL. populate('event') swaps the id for the event document when you need it.
const rsvpSchema = new mongoose.Schema(
  {
    event: {
      type: mongoose.Schema.Types.ObjectId,
      // ref names the model that populate() should load the id from.
      ref: 'Event',
      required: [true, 'Event is required'],
    },
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must be 2 to 100 characters'],
      maxlength: [100, 'Name must be 2 to 100 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      // Stored in lowercase, so Sam@Example.com and sam@example.com count as the same person.
      lowercase: true,
      maxlength: [254, 'Email must be 254 characters or fewer'],
      // A light check (something@something.something). The only real test is sending an email.
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Email must look like name@example.com'],
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
    toJSON: toJSONOptions,
  },
);

// One RSVP per email per event. The database enforces this, so it holds even when two requests arrive
// at the same moment. A second insert fails with error code 11000 (duplicate key), which the controller
// turns into a 409. The index also makes "all RSVPs for this event" fast, because event is its first field.
rsvpSchema.index({ event: 1, email: 1 }, { unique: true });

export const Rsvp = mongoose.model('Rsvp', rsvpSchema);
