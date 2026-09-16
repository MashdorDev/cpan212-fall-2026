import { randomUUID } from 'node:crypto';

// The seed events use fixed ids so the Bruno requests and your notes keep working
// after a restart. Events created through the API get a new randomUUID().
// Times are stored in UTC. 21:00Z on Oct 2 is 5:00 PM in Toronto.
const events = [
  {
    id: '2ee63bdf-ece8-4397-b08b-fa74c92fafef',
    title: 'Fall hackathon kickoff',
    description:
      'Form a team of 2 to 4, hear the three challenge themes and meet the mentors. Bring a laptop and a charger. Pizza after the briefing.',
    category: 'academic',
    location: 'North Campus, Learning Resource Commons',
    startsAt: '2026-10-02T21:00:00.000Z',
    capacity: 120,
    imageUrl: null,
    createdAt: '2026-09-08T14:00:00.000Z',
  },
  {
    id: '2a6f09e3-d75e-4888-b53f-c8e743c2fc5e',
    title: 'Career fair prep workshop',
    description:
      'Practise a 30 second introduction, learn what employers look for at the fall career fair and leave with a one-page resume checklist.',
    category: 'career',
    location: 'Lakeshore Campus, Room A120',
    startsAt: '2026-09-29T17:00:00.000Z',
    capacity: 60,
    imageUrl: null,
    createdAt: '2026-09-08T15:30:00.000Z',
  },
  {
    id: '51b21140-5d42-4c7e-bbd4-6d831ff17438',
    title: 'Thanksgiving residence potluck',
    description:
      'For students staying in residence over the long weekend. Bring a dish from home if you can, plates and drinks are provided.',
    category: 'social',
    location: 'North Campus residence, main lounge',
    startsAt: '2026-10-12T21:30:00.000Z',
    capacity: 80,
    imageUrl: null,
    createdAt: '2026-09-09T12:00:00.000Z',
  },
  {
    id: '4c017028-1ae8-4117-a2fd-22220eddaa5b',
    title: 'Intramural ball hockey night',
    description: 'Drop-in ball hockey, all skill levels. Sticks and goggles are provided, running shoes required.',
    category: 'sports',
    location: 'North Campus athletics centre, Gym B',
    startsAt: '2026-11-12T00:00:00.000Z',
    capacity: 40,
    imageUrl: null,
    createdAt: '2026-09-09T16:45:00.000Z',
  },
  {
    id: '3c7ff3cb-d8b4-40a2-8402-8d8fb50d127e',
    title: 'Student art show opening',
    description:
      'Opening night for the fall show of student illustration, photography and ceramics. Light snacks, and several pieces are for sale.',
    category: 'arts',
    location: 'Lakeshore Campus gallery',
    startsAt: '2026-10-22T22:00:00.000Z',
    capacity: 150,
    imageUrl: null,
    createdAt: '2026-09-10T10:15:00.000Z',
  },
  {
    id: '6bdc9a9a-e337-4861-b39d-49368a8d98bd',
    title: 'Resume review drop-in',
    description: 'Share your resume with a career advisor for 15 minutes of feedback. First come, first served.',
    category: 'career',
    location: 'Online (Microsoft Teams)',
    startsAt: '2026-10-15T16:00:00.000Z',
    capacity: 25,
    imageUrl: null,
    createdAt: '2026-09-10T13:00:00.000Z',
  },
  {
    id: '028ea68f-bcb7-4aa9-b359-4cdc6a62e3ba',
    title: 'Midterm study skills session',
    description: 'Plan your midterm week, try two note-taking methods and set up a realistic study schedule.',
    category: 'academic',
    location: 'North Campus library, group study room 3',
    startsAt: '2026-10-20T19:00:00.000Z',
    capacity: 30,
    imageUrl: null,
    createdAt: '2026-09-11T09:00:00.000Z',
  },
  {
    id: '05859c8a-9a31-48cd-8bc9-bc5acab214fc',
    title: 'Open mic night',
    description: 'Music, poetry and comedy from students. Sign up at the door for a 5 minute slot.',
    category: 'arts',
    location: 'Lakeshore Campus student centre',
    startsAt: '2026-11-07T01:00:00.000Z',
    capacity: 100,
    imageUrl: null,
    createdAt: '2026-09-11T11:20:00.000Z',
  },
];

// ISO strings from toISOString() all have the same length, so comparing them as text sorts by time.
export function findEvents({ category, q } = {}) {
  let results = events;
  if (category) {
    results = results.filter((event) => event.category === category);
  }
  if (q) {
    const search = q.toLowerCase();
    results = results.filter((event) => event.title.toLowerCase().includes(search));
  }
  return results.toSorted((a, b) => a.startsAt.localeCompare(b.startsAt));
}

export function findEventById(id) {
  return events.find((event) => event.id === id);
}

export function insertEvent(fields) {
  const event = { id: randomUUID(), ...fields, createdAt: new Date().toISOString() };
  events.push(event);
  return event;
}
