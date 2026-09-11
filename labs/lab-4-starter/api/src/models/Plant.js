import mongoose from 'mongoose';

// TODO (you): step 3, the Plant model (requirement 3 has the exact rules).
//   1. Create the schema: const plantSchema = new mongoose.Schema({ ... }, { timestamps: true });
//   2. Add the five fields: name, species, light, waterEveryDays, lastWatered.
//   3. Give every rule its own message, for example
//        required: [true, 'Name is required']
//        min: [1, 'Watering interval must be at least 1 day']
//        enum: { values: ['low', 'medium', 'bright'], message: 'Light must be low, medium or bright' }
//   4. Optional but worth it: add cast: 'Watering interval must be a number' to waterEveryDays,
//      so "abc" gets your message instead of Mongoose's long "Cast to Number failed" text.
//   5. Export the model:
//        export const Plant = mongoose.model('Plant', plantSchema);

export const LIGHT_LEVELS = ['low', 'medium', 'bright'];
