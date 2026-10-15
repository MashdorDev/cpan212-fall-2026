import Link from 'next/link';
import { getEvents } from '@/lib/events';
import CategoryFilter from '@/components/CategoryFilter';

export const metadata = {
  title: 'Events',
};

// A Server Component: it runs on the Next.js server and loads the events from the API there.
export default async function EventsPage() {
  const events = await getEvents();

  return (
    <>
      <h1>Events</h1>
      <p>
        <Link href="/events/new">Add an event</Link>
      </p>
      <CategoryFilter events={events} />
    </>
  );
}
