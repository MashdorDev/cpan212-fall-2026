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

// The model is what the controllers use to read and write events.
// The name "Event" becomes the collection "events" in the database.
export const Event = mongoose.model('Event', eventSchema);
