import Link from 'next/link';
import EventCard from '@/components/EventCard';
import EventFilters from '@/components/EventFilters';
import Pagination from '@/components/Pagination';
import { getEvents } from '@/lib/events';
import { PAGE_SIZE, eventsHref, readListOptions } from '@/lib/list-options';
import styles from './page.module.css';

export const metadata = {
  title: 'Events',
};

// A Server Component. The category, sort and page are in the URL (/events?category=arts&page=2),
// so every filter and page link is a normal link and Back and Forward work.
export default async function EventsPage({ searchParams }) {
  // In Next.js 16 searchParams is a promise, like params.
  const query = await searchParams;
  const options = readListOptions(query);

  // Ask the API for one page only.
  const result = await getEvents({
    category: options.category,
    sort: options.sort,
    page: options.page,
    limit: PAGE_SIZE,
  });
  const events = result.data;

  return (
    <>
      <h1>Events</h1>
      <p>
        <Link href="/events/new">Add an event</Link>
      </p>

      <EventFilters category={options.category} sort={options.sort} />

      <p className={styles.count}>
        Showing {events.length} of {result.total} events
      </p>

      {events.length === 0 && (
        <p>
          No events on this page. Try another category, or go back to the{' '}
          <Link href={eventsHref(options.category, options.sort, 1)}>first page</Link>.
        </p>
      )}

      <ul className={styles.grid}>
        {events.map((event) => (
          // key tells React which card is which when the list changes.
          <li key={event.id}>
            <EventCard event={event} />
          </li>
        ))}
      </ul>

      <Pagination category={options.category} sort={options.sort} page={result.page} totalPages={result.totalPages} />
    </>
  );
}
