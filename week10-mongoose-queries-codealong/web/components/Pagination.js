import Link from 'next/link';
import { eventsHref } from '@/lib/list-options';
import styles from './Pagination.module.css';

// Previous and Next links that keep the current category and sort.
// On the first or last page the word is plain text, so there is nothing to click.
export default function Pagination({ category, sort, page, totalPages }) {
  // One page or none: no links needed.
  if (totalPages <= 1) {
    return null;
  }

  let previous = <span className={styles.disabled}>Previous</span>;
  if (page > 1) {
    previous = <Link href={eventsHref(category, sort, page - 1)}>Previous</Link>;
  }

  let next = <span className={styles.disabled}>Next</span>;
  if (page < totalPages) {
    next = <Link href={eventsHref(category, sort, page + 1)}>Next</Link>;
  }

  return (
    <nav className={styles.pagination} aria-label="Pages">
      {previous}
      <span>
        Page {page} of {totalPages}
      </span>
      {next}
    </nav>
  );
}
