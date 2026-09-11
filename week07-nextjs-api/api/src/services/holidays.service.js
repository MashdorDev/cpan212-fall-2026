import { HttpError } from '../utils/http-error.js';

const API_BASE_URL = process.env.HOLIDAY_API_BASE_URL ?? 'https://date.nager.at/api/v3';
const TIMEOUT_MS = 5000;
// Holiday dates for a year almost never change, so one call every 12 hours is plenty.
const CACHE_TTL_MS = 12 * 60 * 60 * 1000;

// year -> { holidays, expiresAt }
const cache = new Map();

async function fetchCanadianHolidays(year) {
  // AbortSignal.timeout cancels the request if Nager.Date takes longer than 5 seconds.
  const res = await fetch(`${API_BASE_URL}/PublicHolidays/${year}/CA`, {
    signal: AbortSignal.timeout(TIMEOUT_MS),
  });
  // fetch only rejects when there is no response at all. A 404 or 500 still resolves, so check res.ok.
  if (!res.ok) {
    throw new Error(`Nager.Date answered ${res.status}`);
  }
  return res.json();
}

export async function getCanadianHolidays(year) {
  const cached = cache.get(year);
  if (cached && cached.expiresAt > Date.now()) {
    console.log(`Holiday cache hit for ${year}`);
    return cached.holidays;
  }

  console.log(`Holiday cache miss for ${year}, calling Nager.Date`);
  let holidays;
  try {
    holidays = await fetchCanadianHolidays(year);
  } catch (error) {
    // A timeout shows up here as error.name 'TimeoutError', a network failure as 'TypeError'.
    console.error(`Holiday lookup for ${year} failed: ${error.name}: ${error.message}`);
    if (error.name === 'TimeoutError') {
      // 504: we did reach for the upstream service, it just took too long to answer.
      throw new HttpError(504, 'The holiday service took too long to answer, try again later');
    }
    // 502: the upstream service failed (no connection, error status or unreadable answer).
    throw new HttpError(502, 'The holiday service is not responding, try again later');
  }

  cache.set(year, { holidays, expiresAt: Date.now() + CACHE_TTL_MS });
  return holidays;
}
