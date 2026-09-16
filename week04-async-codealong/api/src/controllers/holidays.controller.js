import { findEventById } from '../data/events.js';
import { getCanadianHolidays } from '../services/holidays.service.js';
import { HttpError } from '../utils/http-error.js';

export async function checkHoliday(req, res) {
  // TODO (you): STEP 2 - find the event and answer 404 when there is none, then work out the
  //   event's calendar date in Toronto and the year, and reply with them.
  // TODO (you): STEP 3 - await getCanadianHolidays(year) and work out whether that date is one
  //   of them. No try/catch here: Express 5 hands a rejected promise to the error handler for you.
  // TODO (you): STEP 5 - send the full answer, with the list of holidays that matched.
  //
  // Steps 2, 3 and 5 each print this whole function on the lesson page. Replace everything
  // between the braces, this comment block and the throw included, with the version for the
  // step you are on.
  throw new HttpError(501, 'The holiday check is not written yet');
}
