import { CATEGORIES } from './categories';

// How many events the list page shows at once.
export const PAGE_SIZE = 6;

// The sort links. value is what the API accepts in ?sort=, label is what people see.
export const SORT_OPTIONS = [
  { value: 'startsAt', label: 'Soonest first' },
  { value: '-startsAt', label: 'Latest first' },
  { value: 'title', label: 'Title A to Z' },
  { value: '-createdAt', label: 'Recently added' },
];

const DEFAULT_SORT = 'startsAt';

// Reads the category, sort and page from the URL (/events?category=arts&sort=title&page=2).
// Anything unexpected, like ?page=abc, falls back to the default, so a typo in the URL
// shows the normal list instead of an error page.
export function readListOptions(searchParams) {
  let category = '';
  if (CATEGORIES.includes(searchParams.category)) {
    category = searchParams.category;
  }

  let sort = DEFAULT_SORT;
  for (const option of SORT_OPTIONS) {
    if (option.value === searchParams.sort) {
      sort = option.value;
    }
  }

  let page = 1;
  const pageNumber = Number(searchParams.page);
  if (Number.isInteger(pageNumber) && pageNumber > 1) {
    page = pageNumber;
  }

  return { category: category, sort: sort, page: page };
}

// Builds a link like /events?category=arts&page=2. Default values are left out to keep the URL short.
export function eventsHref(category, sort, page) {
  const params = new URLSearchParams();
  if (category) {
    params.set('category', category);
  }
  if (sort !== DEFAULT_SORT) {
    params.set('sort', sort);
  }
  if (page > 1) {
    params.set('page', page);
  }

  const query = params.toString();
  if (query === '') {
    return '/events';
  }
  return '/events?' + query;
}
