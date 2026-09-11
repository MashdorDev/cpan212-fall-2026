import { CATEGORIES } from './categories';

export const PAGE_SIZE = 6;

// The labels people see, and the sort value the API accepts for each one.
export const SORT_OPTIONS = [
  { value: 'startsAt', label: 'Soonest first' },
  { value: '-startsAt', label: 'Latest first' },
  { value: 'title', label: 'Title A to Z' },
  { value: '-createdAt', label: 'Recently added' },
];

const DEFAULT_SORT = SORT_OPTIONS[0].value;

// Turns the URL's search params into values that are safe to send to the API.
// Anything unexpected (a typo, ?page=abc, ?category=a&category=b) falls back to the default,
// so a hand-edited URL shows the normal list instead of an error page.
export function readListOptions(searchParams) {
  const { category, sort, page } = searchParams;
  return {
    category: CATEGORIES.includes(category) ? category : '',
    sort: SORT_OPTIONS.some((option) => option.value === sort) ? sort : DEFAULT_SORT,
    page: typeof page === 'string' && /^[1-9]\d*$/.test(page) ? Number(page) : 1,
  };
}

// Builds a link such as /events?category=arts&page=2. Default values are left out to keep URLs short.
export function eventsHref({ category, sort, page }) {
  const params = new URLSearchParams();
  if (category) {
    params.set('category', category);
  }
  if (sort && sort !== DEFAULT_SORT) {
    params.set('sort', sort);
  }
  if (page > 1) {
    params.set('page', String(page));
  }
  const query = params.toString();
  return query ? `/events?${query}` : '/events';
}
