import Link from 'next/link';
import SaveButton from './SaveButton';
import { formatEventDate } from '@/lib/format';
import styles from './EventCard.module.css';

// One event, passed in as a prop. The card doesn't know or care where the event came from.
export default function EventCard({ event }) {
  return (
    <article className={styles.card}>
      {event.imageUrl && (
        // next/image needs every image host listed in next.config.mjs, and imageUrl can be any https address,
        // so a plain <img> is used. "/uploads/..." images load through the rewrite in next.config.mjs.
        // eslint-disable-next-line @next/next/no-img-element
        <img className={styles.image} src={event.imageUrl} alt="" loading="lazy" />
      )}
      <p className={styles.category}>{event.category}</p>
      <h2 className={styles.title}>
        <Link href={`/events/${event.id}`}>{event.title}</Link>
      </h2>
      <p className={styles.meta}>
        {/* The browser may format a date slightly differently from Node (for example "p.m." vs "PM").
            suppressHydrationWarning tells React that small difference is expected here. */}
        <time dateTime={event.startsAt} suppressHydrationWarning>
          {formatEventDate(event.startsAt)}
        </time>
        <br />
        {event.location}
      </p>
      <SaveButton eventId={event.id} />
    </article>
  );
}
