import Link from 'next/link';
import { eventsHref } from '@/lib/list-options';
import styles from './Pagination.module.css';

// Previous and Next links that keep the current category and sort order.
// At the first or last page the link becomes plain text, so there is nothing to click.
export default function Pagination({ category, sort, page, totalPages }) {
  if (totalPages <= 1) {
    return null;
  }

  return (
    <nav className={styles.pagination} aria-label="Pages">
      {page > 1 ? (
        // Math.min: from a hand-typed ?page=9 of 2, Previous goes to the last real page.
        <Link href={eventsHref({ category, sort, page: Math.min(page - 1, totalPages) })}>Previous</Link>
      ) : (
        <span className={styles.disabled}>Previous</span>
      )}
      <span>
        Page {page} of {totalPages}
      </span>
      {page < totalPages ? (
        <Link href={eventsHref({ category, sort, page: page + 1 })}>Next</Link>
      ) : (
        <span className={styles.disabled}>Next</span>
      )}
    </nav>
  );
}
