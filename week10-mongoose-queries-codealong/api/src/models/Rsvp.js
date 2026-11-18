import mongoose from 'mongoose';

// One person going to one event.
// The RSVP stores the event's id, not a copy of the event. That is a reference, like a foreign key in SQL.
const rsvpSchema = new mongoose.Schema(
  {
    // TODO STEP 5a: the event this RSVP is for
    // ObjectId is the type of every _id. ref tells populate() (step 7c) which model the id belongs to.
    // Type under this comment:
    //
    //   event: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'Event',
    //     required: [true, 'Event is required'],
    //   },

    // TODO STEP 5b: the person's name
    // The same kind of rules as the event title last week. Type under this comment:
    //
    //   name: {
    //     type: String,
    //     required: [true, 'Name is required'],
    //     trim: true,
    //     minlength: [2, 'Name must be 2 to 100 characters'],
    //     maxlength: [100, 'Name must be 2 to 100 characters'],
    //   },

    // TODO STEP 5c: the person's email
    // lowercase saves Sam@Example.com as sam@example.com, so both count as the same person.
    // match is a light check for something@something.something. Type under this comment:
    //
    //   email: {
    //     type: String,
    //     required: [true, 'Email is required'],
    //     trim: true,
    //     lowercase: true,
    //     maxlength: [254, 'Email must be 254 characters or fewer'],
    //     match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Email must look like name@example.com'],
    //   },
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

// TODO STEP 5d: one RSVP per email per event
// unique: true makes the database refuse a second RSVP with the same event and email,
// even when two requests arrive at the same moment. Type under this comment:
//
//   rsvpSchema.index({ event: 1, email: 1 }, { unique: true });

// The name "Rsvp" becomes the collection "rsvps" in the database.
export const Rsvp = mongoose.model('Rsvp', rsvpSchema);
