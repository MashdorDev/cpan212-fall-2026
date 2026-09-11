import mongoose from 'mongoose';
import { connectDb } from '../src/db.js';
import { Event } from '../src/models/Event.js';
import { Rsvp } from '../src/models/Rsvp.js';
import { User } from '../src/models/User.js';
import { hashPassword } from '../src/services/auth.service.js';

// The same eight events the API has used since Week 2, minus the fixed ids: MongoDB gives every
// document a new ObjectId, so the ids change each time you run this script.
// Times are stored in UTC. 21:00Z on Oct 2 is 5:00 PM in Toronto.
const seedEvents = [
  {
    title: 'Fall hackathon kickoff',
    description:
      'Form a team of 2 to 4, hear the three challenge themes and meet the mentors. Bring a laptop and a charger. Pizza after the briefing.',
    category: 'academic',
    location: 'North Campus, Learning Resource Commons',
    startsAt: '2026-10-02T21:00:00.000Z',
    capacity: 120,
    createdAt: '2026-09-08T14:00:00.000Z',
  },
  {
    title: 'Career fair prep workshop',
    description:
      'Practise a 30 second introduction, learn what employers look for at the fall career fair and leave with a one-page resume checklist.',
    category: 'career',
    location: 'Lakeshore Campus, Room A120',
    startsAt: '2026-09-29T17:00:00.000Z',
    capacity: 60,
    createdAt: '2026-09-08T15:30:00.000Z',
  },
  {
    title: 'Thanksgiving residence potluck',
    description:
      'For students staying in residence over the long weekend. Bring a dish from home if you can, plates and drinks are provided.',
    category: 'social',
    location: 'North Campus residence, main lounge',
    startsAt: '2026-10-12T21:30:00.000Z',
    capacity: 80,
    createdAt: '2026-09-09T12:00:00.000Z',
  },
  {
    title: 'Intramural ball hockey night',
    description: 'Drop-in ball hockey, all skill levels. Sticks and goggles are provided, running shoes required.',
    category: 'sports',
    location: 'North Campus athletics centre, Gym B',
    startsAt: '2026-11-12T00:00:00.000Z',
    capacity: 40,
    createdAt: '2026-09-09T16:45:00.000Z',
  },
  {
    title: 'Student art show opening',
    description:
      'Opening night for the fall show of student illustration, photography and ceramics. Light snacks, and several pieces are for sale.',
    category: 'arts',
    location: 'Lakeshore Campus gallery',
    startsAt: '2026-10-22T22:00:00.000Z',
    capacity: 150,
    createdAt: '2026-09-10T10:15:00.000Z',
  },
  {
    title: 'Resume review drop-in',
    description: 'Share your resume with a career advisor for 15 minutes of feedback. First come, first served.',
    category: 'career',
    location: 'Online (Microsoft Teams)',
    startsAt: '2026-10-15T16:00:00.000Z',
    capacity: 25,
    createdAt: '2026-09-10T13:00:00.000Z',
  },
  {
    title: 'Midterm study skills session',
    description: 'Plan your midterm week, try two note-taking methods and set up a realistic study schedule.',
    category: 'academic',
    location: 'North Campus library, group study room 3',
    startsAt: '2026-10-20T19:00:00.000Z',
    capacity: 30,
    createdAt: '2026-09-11T09:00:00.000Z',
  },
  {
    title: 'Open mic night',
    description: 'Music, poetry and comedy from students. Sign up at the door for a 5 minute slot.',
    category: 'arts',
    location: 'Lakeshore Campus student centre',
    startsAt: '2026-11-07T01:00:00.000Z',
    capacity: 100,
    createdAt: '2026-09-11T11:20:00.000Z',
  },
];

// Two demo accounts for trying the app locally. The passwords are in the README on purpose:
// they are fake, and this script is for your own database only. Never seed real accounts like this.
const seedUsers = [
  { name: 'Ava Martin', email: 'ava@example.com', password: 'campus-demo-ava' },
  { name: 'Sam Lee', email: 'sam@example.com', password: 'campus-demo-sam' },
];

// Which demo user organizes each event, by title. Ava runs the academic and career events, Sam the rest.
const organizerEmails = {
  'Fall hackathon kickoff': 'ava@example.com',
  'Career fair prep workshop': 'ava@example.com',
  'Resume review drop-in': 'ava@example.com',
  'Midterm study skills session': 'ava@example.com',
  'Thanksgiving residence potluck': 'sam@example.com',
  'Intramural ball hockey night': 'sam@example.com',
  'Student art show opening': 'sam@example.com',
  'Open mic night': 'sam@example.com',
};

// Made-up attendees (example.com addresses never receive mail). Each one is [event title, name, email].
const seedRsvps = [
  ['Fall hackathon kickoff', 'Sam Lee', 'sam@example.com'],
  ['Fall hackathon kickoff', 'Priya Sharma', 'priya.sharma@example.com'],
  ['Fall hackathon kickoff', 'Marcus Chen', 'marcus.chen@example.com'],
  ['Resume review drop-in', 'Priya Sharma', 'priya.sharma@example.com'],
  ['Open mic night', 'Ava Martin', 'ava@example.com'],
];

await connectDb();

// syncIndexes() makes the collections' indexes match the schemas, including the unique indexes on
// user emails and RSVPs. The API also builds indexes when it starts, but the seed shouldn't depend on that.
await Promise.all([User.syncIndexes(), Event.syncIndexes(), Rsvp.syncIndexes()]);

// Start from clean collections. Existing sessions are left alone, but they point at users that no longer
// exist, so anyone logged in is treated as logged out.
await Promise.all([Rsvp.deleteMany({}), Event.deleteMany({}), User.deleteMany({})]);

const users = await User.insertMany(
  await Promise.all(
    seedUsers.map(async ({ name, email, password }) => ({ name, email, passwordHash: await hashPassword(password) })),
  ),
);
const userIdsByEmail = new Map(users.map((user) => [user.email, user._id]));
console.log(`Inserted ${users.length} users`);

// insertMany() runs the schema validation too, so a typo in the data above fails loudly.
const events = await Event.insertMany(
  seedEvents.map((event) => ({ ...event, organizer: userIdsByEmail.get(organizerEmails[event.title]) })),
);
console.log(`Inserted ${events.length} events`);

// The RSVPs need the new ObjectIds, so look each event up by title.
const idsByTitle = new Map(events.map((event) => [event.title, event._id]));
const rsvps = await Rsvp.insertMany(
  seedRsvps.map(([title, name, email]) => ({ event: idsByTitle.get(title), name, email })),
);
console.log(`Inserted ${rsvps.length} RSVPs`);

// Without this the script never ends, because the open connection keeps Node running.
await mongoose.disconnect();
