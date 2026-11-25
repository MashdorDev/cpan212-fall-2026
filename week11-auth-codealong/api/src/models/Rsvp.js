import mongoose from 'mongoose';

// One person going to one event.
// The RSVP stores the event's id, not a copy of the event. That is a reference, like a foreign key in SQL.
const rsvpSchema = new mongoose.Schema(
  {
    event: {
      type: mongoose.Schema.Types.ObjectId,
      // ref tells populate() which model the id belongs to.
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
      // Saved in lowercase, so Sam@Example.com and sam@example.com are the same person.
      lowercase: true,
      maxlength: [254, 'Email must be 254 characters or fewer'],
      // A light check: something@something.something
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Email must look like name@example.com'],
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
    toJSON: {
      // The same as in Event.js: send "id" instead of "_id".
      transform: function (doc, ret) {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  },
);

// One RSVP per email per event. unique: true makes the database refuse a second one,
// even when two requests arrive at the same moment.
rsvpSchema.index({ event: 1, email: 1 }, { unique: true });

// The name "Rsvp" becomes the collection "rsvps" in the database.
export const Rsvp = mongoose.model('Rsvp', rsvpSchema);
