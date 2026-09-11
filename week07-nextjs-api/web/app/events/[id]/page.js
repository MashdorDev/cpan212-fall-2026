import Link from 'next/link';
import { notFound } from 'next/navigation';
import SaveButton from '@/components/SaveButton';
import { getEventById } from '@/lib/events';
import { formatEventDate } from '@/lib/format';
import styles from './page.module.css';

// The folder name [id] makes this a dynamic route: /events/abc gives params.id === 'abc'.
export default async function EventPage({ params }) {
  // In Next.js 16 params is a promise, so await it before reading id.
  const { id } = await params;
  const event = await getEventById(id);

  if (!event) {
    // Stops rendering this page and shows app/not-found.js instead.
    notFound();
  }

  return (
    <article>
      <p className={styles.back}>
        <Link href="/events">Back to all events</Link>
      </p>
      <p className={styles.category}>{event.category}</p>
      <h1 className={styles.title}>{event.title}</h1>
      <dl className={styles.facts}>
        <dt>When</dt>
        <dd>
          <time dateTime={event.startsAt}>{formatEventDate(event.startsAt)}</time> (Toronto time)
        </dd>
        <dt>Where</dt>
        <dd>{event.location}</dd>
        <dt>Capacity</dt>
        <dd>{event.capacity} people</dd>
      </dl>
      {event.description && <p className={styles.description}>{event.description}</p>}
      <SaveButton eventId={event.id} />
    </article>
  );
}
