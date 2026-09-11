import Link from 'next/link';
import { CATEGORIES } from '@/lib/categories';
import { SORT_OPTIONS, eventsHref } from '@/lib/list-options';
import styles from './EventFilters.module.css';

// A Server Component: each option is a link to the same page with different search params.
// Changing the category or the sort order goes back to page 1, because page 3 of the old list
// may not exist in the new one.
export default function EventFilters({ category, sort }) {
  return (
    <div className={styles.filters}>
      <nav className={styles.options} aria-label="Filter by category">
        {['', ...CATEGORIES].map((option) => (
          <Link
            key={option || 'all'}
            href={eventsHref({ category: option, sort })}
            className={styles.option}
            aria-current={option === category ? 'page' : undefined}
          >
            {option || 'all'}
          </Link>
        ))}
      </nav>

      <nav className={styles.sort} aria-label="Sort events">
        <span className={styles.label}>Sort:</span>
        {SORT_OPTIONS.map((option) => (
          <Link
            key={option.value}
            href={eventsHref({ category, sort: option.value })}
            aria-current={option.value === sort ? 'page' : undefined}
          >
            {option.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}
