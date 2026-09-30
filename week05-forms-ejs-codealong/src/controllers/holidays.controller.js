import { findEventById } from '../data/events.js';
import { getCanadianHolidays } from '../services/holidays.service.js';
import { HttpError } from '../utils/http-error.js';

export async function checkHoliday(req, res) {
  const event = findEventById(req.params.id);
  if (!event) {
    throw new HttpError(404, 'Event not found');
  }

  // startsAt is stored in UTC. An event at 7 PM in Toronto on Nov 11 is already Nov 12 in UTC,
  // so compare the Toronto calendar date. The en-CA format is YYYY-MM-DD, the same as Nager.Date.
  const date = new Date(event.startsAt).toLocaleDateString('en-CA', { timeZone: 'America/Toronto' });
  const year = Number(date.slice(0, 4));

  // No try/catch needed: if this rejects, Express 5 passes the error to the error handler.
  const holidays = await getCanadianHolidays(year);
  const matches = holidays.filter((holiday) => holiday.date === date);

  res.json({
    data: {
      eventId: event.id,
      date,
      isHoliday: matches.length > 0,
      holidays: matches.map((holiday) => ({
        name: holiday.name,
        nationwide: holiday.global,
        // Province codes like "CA-ON" when the holiday is not nationwide.
        regions: holiday.counties ?? [],
      })),
    },
  });
}
