import Link from 'next/link';
import { CATEGORIES } from '@/lib/categories';
import { SORT_OPTIONS, eventsHref } from '@/lib/list-options';
import styles from './EventFilters.module.css';

// A Server Component made of links. Each link is the same page with a different URL,
// so the server loads the new list. Changing the category or sort goes back to page 1.
export default function EventFilters({ category, sort }) {
  // '' means "all categories".
  const categoryOptions = [''].concat(CATEGORIES);

  return (
    <div className={styles.filters}>
      <nav className={styles.options} aria-label="Filter by category">
        {categoryOptions.map((option) => {
          let label = option;
          if (option === '') {
            label = 'all';
          }
          return (
            <Link
              key={label}
              href={eventsHref(option, sort, 1)}
              className={styles.option}
              // aria-current marks the chosen link. The CSS colours it.
              aria-current={option === category && 'page'}
            >
              {label}
            </Link>
          );
        })}
      </nav>

      <nav className={styles.sort} aria-label="Sort events">
        <span className={styles.label}>Sort:</span>
        {SORT_OPTIONS.map((option) => (
          <Link key={option.value} href={eventsHref(category, option.value, 1)} aria-current={option.value === sort && 'page'}>
            {option.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}
