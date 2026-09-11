import mongoose from 'mongoose';
import { connectDb } from './db.js';

// Sample plants. Change or add to them if you like, but keep at least 6.
const plants = [
  { name: 'Monstera', species: 'Monstera deliciosa', light: 'medium', waterEveryDays: 7, lastWatered: '2026-11-08' },
  { name: 'Snake plant', species: 'Dracaena trifasciata', light: 'low', waterEveryDays: 21, lastWatered: '2026-10-30' },
  { name: 'Basil', species: 'Ocimum basilicum', light: 'bright', waterEveryDays: 2, lastWatered: '2026-11-10' },
  { name: 'Pothos', species: 'Epipremnum aureum', light: 'low', waterEveryDays: 10, lastWatered: '2026-11-03' },
  { name: 'Fiddle leaf fig', species: 'Ficus lyrata', light: 'bright', waterEveryDays: 9 },
  { name: 'Peace lily', species: 'Spathiphyllum wallisii', light: 'medium', waterEveryDays: 5, lastWatered: '2026-11-09' },
  { name: 'Aloe', species: 'Aloe vera', light: 'bright', waterEveryDays: 18, lastWatered: '2026-10-25' },
  { name: 'ZZ plant', light: 'low', waterEveryDays: 28, lastWatered: '2026-10-20' },
];

// TODO (you): step 6, the seed script (requirement 10). Run it with npm run seed.
//   1. Import your Plant model.
//   2. Delete every existing plant, then insert the array above.
//      Plant.insertMany() runs your schema validation, so a bad sample fails loudly.
//   3. Log how many plants were created.
//   4. Replace the console.log below with: await mongoose.disconnect();
//      Without it the script never exits, because the connection stays open.

await connectDb();
console.log(`seed.js has ${plants.length} sample plants but doesn't save them yet.`);
