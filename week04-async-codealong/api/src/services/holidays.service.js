import { HttpError } from '../utils/http-error.js';

// This is the codealong file. The import above and the two constants below already work, so the
// server starts before you type anything. Everything else is a numbered TODO (you) step.
// The steps are not in file order here: step 6's cache belongs above step 4's fetch function,
// because that is where those lines live in the finished file. Search for "STEP 4" to find your
// first one. Delete this comment block once steps 4, 6 and 7 are done.
const API_BASE_URL = process.env.HOLIDAY_API_BASE_URL ?? 'https://date.nager.at/api/v3';
const TIMEOUT_MS = 5000;
// TODO (you): STEP 6 - the two cache constants go here, above the fetch function: CACHE_TTL_MS,
// how long a saved answer stays good, and const cache = new Map(), which holds one entry per year.

// TODO (you): STEP 4 - async function fetchCanadianHolidays(year) goes here. It calls the address
// `${API_BASE_URL}/PublicHolidays/${year}/CA` with a 5 second timeout, checks res.ok, and returns
// res.json().

export async function getCanadianHolidays(year) {
  // TODO (you): STEP 4 - return fetchCanadianHolidays(year) instead of the throw below.
  // TODO (you): STEP 6 - look in the cache first, log the hit or the miss, and save what you fetch.
  // TODO (you): STEP 7 - turn a failed call into an HttpError: 504 when error.name is
  //   'TimeoutError', 502 for every other failure.
  //
  // Steps 4, 6 and 7 each print this whole function on the lesson page. Replace everything
  // between the braces, this comment block and the throw included, with the version for the
  // step you are on.
  throw new HttpError(501, 'The holiday service is not written yet');
}
