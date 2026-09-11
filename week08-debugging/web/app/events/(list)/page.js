import Link from 'next/link';
import CategoryFilter from '@/components/CategoryFilter';
import { getEvents } from '@/lib/events';

export const metadata = {
  title: 'Events',
};

// A Server Component: it runs on the Next.js server and calls the Express API from there.
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
