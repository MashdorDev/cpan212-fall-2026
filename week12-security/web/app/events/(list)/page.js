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

// The category, sort order and page all live in the URL (/events?category=arts&page=2).
// Every filter and page link is a normal link, so the server renders the new list, and the URL can be
// bookmarked, shared or opened in a new tab. No client-side state is needed.
export default async function EventsPage({ searchParams }) {
  // In Next.js 16 searchParams is a promise, like params.
  const options = readListOptions(await searchParams);
  const { data: events, page, total, totalPages } = await getEvents({ ...options, limit: PAGE_SIZE });

  return (
    <>
      <h1>Events</h1>
      <p>
        <Link href="/events/new">Add an event</Link>
      </p>

      <EventFilters category={options.category} sort={options.sort} />

      <p className={styles.count}>{total === 1 ? '1 event' : `${total} events`}</p>

      {events.length === 0 ? (
        <p>
          No events here. Try another category, or go back to the{' '}
          <Link href={eventsHref({ category: options.category, sort: options.sort })}>first page</Link>.
        </p>
      ) : (
        <ul className={styles.grid}>
          {events.map((event) => (
            <li key={event.id}>
              <EventCard event={event} />
            </li>
          ))}
        </ul>
      )}

      <Pagination category={options.category} sort={options.sort} page={page} totalPages={totalPages} />
    </>
  );
}
