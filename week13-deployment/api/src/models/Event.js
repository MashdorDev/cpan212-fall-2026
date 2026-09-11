import mongoose from 'mongoose';
import { toJSONOptions } from './to-json.js';

export const CATEGORIES = ['academic', 'social', 'sports', 'career', 'arts'];

// The schema is now the one place the event rules live. Mongoose checks them on create and,
// with runValidators: true, on updates. Each rule has its own message, and the error handler
// sends those messages back keyed by field name.
const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      // trim runs before the length checks, so "  Hi  " counts as 2 characters.
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
      enum: { values: CATEGORIES, message: `Category must be one of: ${CATEGORIES.join(', ')}` },
    },
    location: {
      type: String,
      required: [true, 'Location is required'],
      trim: true,
      maxlength: [200, 'Location must be 200 characters or fewer'],
    },
    startsAt: {
      // MongoDB stores dates in UTC. In JSON they come back as ISO strings like 2026-10-02T21:00:00.000Z.
      type: Date,
      required: [true, 'Start time is required'],
      // Shown instead of Mongoose's long "Cast to date failed" text when the value isn't a date.
      cast: 'Start time must be a date and time, for example 2026-10-14T18:00:00-04:00',
    },
    capacity: {
      type: Number,
      required: [true, 'Capacity is required'],
      cast: 'Capacity must be a whole number from 1 to 1000',
      min: [1, 'Capacity must be a whole number from 1 to 1000'],
      max: [1000, 'Capacity must be a whole number from 1 to 1000'],
      validate: { validator: Number.isInteger, message: 'Capacity must be a whole number from 1 to 1000' },
    },
    // The user who created the event. Only they can change or delete it. It is set from the session,
    // never from the request body (see createEvent).
    organizer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Organizer is required'],
    },
    imageUrl: {
      type: String,
      default: null,
      maxlength: [500, 'Image URL must be 500 characters or fewer'],
      // A full http(s) address, or a file saved by the upload form such as /uploads/1f0c...9a.png
      match: [
        /^(https?:\/\/\S+|\/uploads\/[\w-]+\.(jpg|png|webp))$/,
        'Image URL must be an http:// or https:// address, or an uploaded image',
      ],
    },
  },
  {
    // Mongoose sets createdAt when the event is first saved. The contract has no updatedAt, so it is off.
    timestamps: { createdAt: true, updatedAt: false },
    toJSON: toJSONOptions,
  },
);

// Indexes let MongoDB find and sort events without reading every document in the collection.
// Each one matches a query GET /api/events really runs. The list is always sorted by one field and then
// by _id (see sortFor() in the controller), and MongoDB can only use an index for a sort when the index has
// the same fields in the same order. That is why _id is the last field of each index.
// - { startsAt: 1, _id: 1 } for the default list, sorted by start time, and for ?from= (startsAt >= a date).
//   MongoDB can read an index backwards, so it also covers ?sort=-startsAt.
// - { category: 1, startsAt: 1, _id: 1 } for ?category=arts sorted by start time. The equality field comes
//   first, so MongoDB jumps to the arts events and reads them already in start time order.
// - { title: 1, _id: 1 } for ?sort=title. This is a regular index, not a text index. A text index answers
//   word searches with $text, which would change ?q from "title contains these letters" to "title contains
//   these words" (a search for "hock" would no longer find "hockey"). The ?q search is a case-insensitive regex,
//   which can't jump straight to matches in either kind of index, so it still checks every title.
//   For a campus events list that is fast enough.
eventSchema.index({ startsAt: 1, _id: 1 });
eventSchema.index({ category: 1, startsAt: 1, _id: 1 });
eventSchema.index({ title: 1, _id: 1 });

// The model name "Event" becomes the collection name "events".
export const Event = mongoose.model('Event', eventSchema);
