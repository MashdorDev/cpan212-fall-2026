import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import { connectDb } from '../src/db.js';
import { Event } from '../src/models/Event.js';
import { Rsvp } from '../src/models/Rsvp.js';
import { User } from '../src/models/User.js';

// The same eight events the API has used since Week 2. MongoDB gives each one a new _id,
// so the ids change every time you run this script.
// Times are stored in UTC. 21:00Z on Oct 2 is 5:00 PM in Toronto.
const sampleEvents = [
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

// Two demo accounts for trying the app on your own computer. The passwords are fake and written
// here on purpose. Never put real accounts or passwords in a script like this.
const sampleUsers = [
  { name: 'Ava Martin', email: 'ava@example.com', password: 'campus-demo-ava' },
  { name: 'Sam Lee', email: 'sam@example.com', password: 'campus-demo-sam' },
];

// Who organizes each event, by title. Ava has the academic and career events, Sam the rest.
const organizers = {
  'Fall hackathon kickoff': 'ava@example.com',
  'Career fair prep workshop': 'ava@example.com',
  'Resume review drop-in': 'ava@example.com',
  'Midterm study skills session': 'ava@example.com',
  'Thanksgiving residence potluck': 'sam@example.com',
  'Intramural ball hockey night': 'sam@example.com',
  'Student art show opening': 'sam@example.com',
  'Open mic night': 'sam@example.com',
};

// Made-up people (example.com addresses never get mail). Each RSVP names its event by title,
// because the event ids only exist after the events are inserted.
const sampleRsvps = [
  { eventTitle: 'Fall hackathon kickoff', name: 'Sam Lee', email: 'sam@example.com' },
  { eventTitle: 'Fall hackathon kickoff', name: 'Priya Sharma', email: 'priya.sharma@example.com' },
  { eventTitle: 'Fall hackathon kickoff', name: 'Marcus Chen', email: 'marcus.chen@example.com' },
  { eventTitle: 'Resume review drop-in', name: 'Priya Sharma', email: 'priya.sharma@example.com' },
  { eventTitle: 'Open mic night', name: 'Ava Martin', email: 'ava@example.com' },
];

await connectDb();

// syncIndexes() makes the indexes in the database match the ones in the schemas.
// That includes the unique index on user emails.
await User.syncIndexes();
await Event.syncIndexes();
await Rsvp.syncIndexes();

// Start from empty collections, so running the script twice doesn't give you 16 events.
// Anyone who was logged in is logged out, because their user no longer exists.
await Rsvp.deleteMany({});
await User.deleteMany({});
const deleted = await Event.deleteMany({});

// Hash each password the same way the register route does.
const users = [];
for (const sample of sampleUsers) {
  const passwordHash = await bcrypt.hash(sample.password, 12);
  users.push({ name: sample.name, email: sample.email, passwordHash: passwordHash });
}
const insertedUsers = await User.insertMany(users);
console.log('Inserted ' + insertedUsers.length + ' users');

// Give each event the id of its organizer, found by email.
for (const event of sampleEvents) {
  for (const user of insertedUsers) {
    if (user.email === organizers[event.title]) {
      event.organizer = user._id;
    }
  }
}
// insertMany() checks the schema rules too, so a typo in the data above fails loudly.
const inserted = await Event.insertMany(sampleEvents);
console.log('Removed ' + deleted.deletedCount + ' events, inserted ' + inserted.length);

// Give each RSVP the id of its event, found by title.
const rsvps = [];
for (const sample of sampleRsvps) {
  for (const event of inserted) {
    if (event.title === sample.eventTitle) {
      rsvps.push({ event: event._id, name: sample.name, email: sample.email });
    }
  }
}
const insertedRsvps = await Rsvp.insertMany(rsvps);
console.log('Inserted ' + insertedRsvps.length + ' RSVPs');

// Close the connection, or the script never ends.
await mongoose.disconnect();
