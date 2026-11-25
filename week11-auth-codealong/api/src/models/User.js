import mongoose from 'mongoose';

// One account. The password itself is never saved, only a bcrypt hash of it.
const userSchema = new mongoose.Schema(
  {
    // TODO STEP 1a: the name
    // The same rules as the RSVP's name last week. Type under this comment:
    //
    //   name: {
    //     type: String,
    //     required: [true, 'Name is required'],
    //     trim: true,
    //     minlength: [2, 'Name must be 2 to 100 characters'],
    //     maxlength: [100, 'Name must be 2 to 100 characters'],
    //   },

    // TODO STEP 1b: the email, one account each
    // unique is new: MongoDB refuses a second account with the same email (error code 11000).
    // lowercase saves Ava@Example.com as ava@example.com. Type under this comment:
    //
    //   email: {
    //     type: String,
    //     required: [true, 'Email is required'],
    //     unique: true,
    //     trim: true,
    //     lowercase: true,
    //     maxlength: [254, 'Email must be 254 characters or fewer'],
    //     match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Email must look like name@example.com'],
    //   },

    // TODO STEP 1c: the password hash
    // Never the password itself. A hash looks like $2b$12$Q9..., and you can't turn it back into
    // the password. Step 3 makes it. Type under this comment:
    //
    //   passwordHash: {
    //     type: String,
    //     required: true,
    //   },
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
        // TODO STEP 1d: never send the hash
        // Even a hash helps someone guessing passwords, so it never leaves the API.
        // Type under this comment:
        //
        //   delete ret.passwordHash;
        //
        // Check: in a third terminal, cd api and run npm run seed. It prints "Inserted 2 users".
        // In Compass, campus_events > users has Ava and Sam, and each passwordHash starts with $2b$12$.
        return ret;
      },
    },
  },
);

// The name "User" becomes the collection "users" in the database.
export const User = mongoose.model('User', userSchema);
