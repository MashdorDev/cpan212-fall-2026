import mongoose from 'mongoose';

export const CATEGORIES = ['academic', 'social', 'sports', 'career', 'arts'];

// The schema is the list of fields an event has, and the rules each field must follow.
// Mongoose checks these rules before it saves anything.
const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      minlength: [3, 'Title must be 3 to 100 characters'],
      maxlength: [100, 'Title must be 3 to 100 characters'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [2000, 'Description must be 2000 characters or fewer'],
      default: '',
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: { values: CATEGORIES, message: 'Category must be one of: academic, social, sports, career, arts' },
    },
    location: {
      type: String,
      required: [true, 'Location is required'],
      trim: true,
      maxlength: [200, 'Location must be 200 characters or fewer'],
    },
    startsAt: {
      type: Date,
      required: [true, 'Start time is required'],
      // Shown instead of Mongoose's long message when the value is not a date.
      cast: 'Start time must be a date and time, for example 2026-10-14T18:00:00-04:00',
    },
    capacity: {
      type: Number,
      required: [true, 'Capacity is required'],
      cast: 'Capacity must be a number',
      min: [1, 'Capacity must be from 1 to 1000'],
      max: [1000, 'Capacity must be from 1 to 1000'],
    },
    imageUrl: {
      type: String,
      default: null,
      maxlength: [500, 'Image URL must be 500 characters or fewer'],
    },
    // TODO STEP 1e: who organizes the event
    // The user's id, not a copy of the user: a reference, like the event in an RSVP.
    // Only the organizer will be allowed to change or delete the event (step 6). Type under this comment:
    //
    //   organizer: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'User',
    //     required: [true, 'Organizer is required'],
    //   },
    //
    // Check: run npm run seed again. Every event in http://localhost:4000/api/events now has an
    // "organizer" (a user's id). Ava organizes 4 events, Sam the other 4.
  },
  {
    // Mongoose fills in createdAt when the event is first saved.
    timestamps: { createdAt: true, updatedAt: false },
    toJSON: {
      // res.json() calls this for every event. MongoDB calls the id "_id", the web app expects "id".
      transform: function (doc, ret) {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  },
);

// An index is a sorted list MongoDB keeps next to the collection, like the index at the back of a book.
// With it, MongoDB jumps to the events it needs instead of reading every one.
// Each index matches a query that GET /api/events really runs. The list is always sorted by one field
// and then by _id, so _id is the last field of each index.

// The default list: sorted by start time. Also used by ?from= and ?sort=-startsAt.
eventSchema.index({ startsAt: 1, _id: 1 });
// ?category=arts sorted by start time. Category comes first, so MongoDB jumps to the arts events.
eventSchema.index({ category: 1, startsAt: 1, _id: 1 });
// ?sort=title, A to Z.
eventSchema.index({ title: 1, _id: 1 });

// The model is what the controllers use to read and write events.
// The name "Event" becomes the collection "events" in the database.
export const Event = mongoose.model('Event', eventSchema);
