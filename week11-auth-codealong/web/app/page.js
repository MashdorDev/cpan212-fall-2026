import Link from 'next/link';
import styles from './page.module.css';

export default function HomePage() {
  return (
    <>
      <h1>Campus Events</h1>
      <p className={styles.lead}>
        Workshops, games nights, art shows and career sessions at North and Lakeshore campuses this term.
      </p>
      <ol className={styles.steps}>
        <li>
          Browse the <Link href="/events">events list</Link> and filter it by category.
        </li>
        <li>Open an event to see when and where it happens.</li>
        <li>
          Press Save on the ones you want to go to. They stay on your <Link href="/saved">saved list</Link>.
        </li>
        <li>
          Running something yourself? <Link href="/events/new">Add an event</Link>.
        </li>
      </ol>
    </>
  );
}
