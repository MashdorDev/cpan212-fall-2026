import mongoose from 'mongoose';

// One account. The password itself is never saved, only a bcrypt hash of it.
const userSchema = new mongoose.Schema(
  {
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
      // unique makes MongoDB refuse a second account with the same email (error code 11000).
      unique: true,
      trim: true,
      // Saved in lowercase, so Ava@Example.com and ava@example.com are the same account.
      lowercase: true,
      maxlength: [254, 'Email must be 254 characters or fewer'],
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Email must look like name@example.com'],
    },
    // The bcrypt hash, like $2b$12$Q9... The register controller makes it from the password.
    passwordHash: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
    toJSON: {
      // res.json() calls this for every user. Send "id" instead of "_id", like the other models,
      // and never send the hash, not even to the user it belongs to.
      transform: function (doc, ret) {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;
        delete ret.passwordHash;
        return ret;
      },
    },
  },
);

// The name "User" becomes the collection "users" in the database.
export const User = mongoose.model('User', userSchema);
