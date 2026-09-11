import CategoryFilter from '@/components/CategoryFilter';
import { getEvents } from '@/lib/events';

export const metadata = {
  title: 'Events',
};

// A Server Component: it can be async and load data directly. None of this code is sent to the browser.
export default async function EventsPage() {
  const events = await getEvents();

  return (
    <>
      <h1>Events</h1>
      <CategoryFilter events={events} />
    </>
  );
}
