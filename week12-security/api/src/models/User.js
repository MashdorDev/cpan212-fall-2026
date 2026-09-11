import mongoose from 'mongoose';
import { toJSONOptions } from './to-json.js';

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, 'Email is required'],
      // unique creates a unique index. It is not a validator: a duplicate fails when saving with
      // error code 11000, and the register controller turns that into a 409.
      unique: true,
      trim: true,
      lowercase: true,
      maxlength: [254, 'Email must be 254 characters or fewer'],
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Email must look like name@example.com'],
    },
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must be 2 to 100 characters'],
      maxlength: [100, 'Name must be 2 to 100 characters'],
    },
    // Only ever a bcrypt hash, never the password itself. The register controller hashes the password
    // before it builds the user (see controllers/auth.controller.js for why there is no pre-save hook).
    passwordHash: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
    toJSON: {
      ...toJSONOptions,
      // Never send the hash to a client, not even to the user it belongs to. This runs for res.json(user),
      // for a user returned by create(), and for a user that populate() puts inside another document.
      transform(doc, ret, options) {
        const { passwordHash, ...fields } = toJSONOptions.transform(doc, ret, options);
        return fields;
      },
    },
  },
);

export const User = mongoose.model('User', userSchema);
