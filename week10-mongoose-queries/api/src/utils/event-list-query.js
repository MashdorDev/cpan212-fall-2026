import mongoose from 'mongoose';
import { CATEGORIES } from '../models/Event.js';
import { HttpError } from './http-error.js';

export const DEFAULT_LIMIT = 10;
export const MAX_LIMIT = 50;

// Only these fields can be sorted on. Passing req.query.sort straight to .sort() would let a client sort
// on any field, including ones without an index (slow on a big collection) or ones you never meant to expose.
export const SORT_FIELDS = ['startsAt', 'title', 'createdAt'];

// A search for "c++" should look for plus signs, not treat + as "one or more". Escaping every special
// character makes the text match literally, and stops input like "(" from breaking the query.
function escapeRegex(text) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// "3" is a whole number. "3.5", "-1", "abc", "" and "1e3" are not.
function parseWholeNumber(text, { min, max }) {
  const number = /^\d+$/.test(text) ? Number(text) : Number.NaN;
  return number >= min && number <= max ? number : null;
}

// Reads GET /api/events?category=&q=&from=&sort=&page=&limit= and returns what the controller needs
// for find(), sort(), skip() and limit(). Every problem goes into one 400 response.
export function parseEventListQuery(query) {
  const { category, q, from, sort = 'startsAt', page = '1', limit = String(DEFAULT_LIMIT) } = query;

  // Express turns ?page=1&page=2 into an array. None of these parameters make sense twice,
  // and after this check every value below is either a string or undefined.
  const repeated = Object.entries({ category, q, from, sort, page, limit }).filter(
    ([, value]) => value !== undefined && typeof value !== 'string',
  );
  if (repeated.length > 0) {
    const details = Object.fromEntries(repeated.map(([name]) => [name, `Send ${name} only once`]));
    throw new HttpError(400, 'Invalid query', details);
  }

  const errors = {};
  const filter = {};

  if (category !== undefined) {
    if (CATEGORIES.includes(category)) {
      filter.category = category;
    } else {
      errors.category = `Must be one of: ${CATEGORIES.join(', ')}`;
    }
  }

  if (q) {
    // The i flag ignores upper and lower case.
    filter.title = new RegExp(escapeRegex(q), 'i');
  }

  if (from !== undefined) {
    // Date.parse accepts loose formats like "3", so also require at least YYYY-MM-DD.
    // A date on its own ("2026-11-01") means midnight UTC, which is the evening before in Toronto.
    if (/^\d{4}-\d{2}-\d{2}/.test(from) && !Number.isNaN(Date.parse(from))) {
      // sanitizeFilter (see db.js) treats any { $...: } object in a filter as a plain value, so this query
      // would fail. mongoose.trusted() marks this one object as safe: the code built it, and the only
      // thing inside that came from the user is a Date.
      filter.startsAt = mongoose.trusted({ $gte: new Date(from) });
    } else {
      errors.from = 'Must be an ISO 8601 date or date and time, for example 2026-11-01 or 2026-11-01T18:00:00-04:00';
    }
  }

  const descending = sort.startsWith('-');
  const sortField = descending ? sort.slice(1) : sort;
  if (!SORT_FIELDS.includes(sortField)) {
    errors.sort = `Must be one of: ${SORT_FIELDS.join(', ')}. Put - in front to reverse the order, for example -startsAt`;
  }
  // _id breaks ties. Without it, two events with the same start time could come back in either order,
  // so one of them might show up on page 1 and again on page 2.
  const direction = descending ? -1 : 1;
  const sortBy = { [sortField]: direction, _id: direction };

  const pageNumber = parseWholeNumber(page, { min: 1, max: Number.MAX_SAFE_INTEGER });
  if (pageNumber === null) {
    errors.page = 'Must be a whole number, 1 or more';
  }

  const limitNumber = parseWholeNumber(limit, { min: 1, max: MAX_LIMIT });
  if (limitNumber === null) {
    errors.limit = `Must be a whole number from 1 to ${MAX_LIMIT}`;
  }

  if (Object.keys(errors).length > 0) {
    throw new HttpError(400, 'Invalid query', errors);
  }

  return { filter, sort: sortBy, page: pageNumber, limit: limitNumber };
}
