import mongoose from 'mongoose';
import { connectDb } from '../src/db.js';
import { Event } from '../src/models/Event.js';

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

await connectDb();

// Start from a clean collection, so running the script twice doesn't give you 16 events.
const { deletedCount } = await Event.deleteMany({});
// insertMany() runs the schema validation too, so a typo in the data above fails loudly.
const events = await Event.insertMany(seedEvents);
console.log(`Removed ${deletedCount} events, inserted ${events.length}`);

// Without this the script never ends, because the open connection keeps Node running.
await mongoose.disconnect();
