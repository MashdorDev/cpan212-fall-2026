const TIME_ZONE = 'America/Toronto';

export function formatEventDate(iso) {
  return new Date(iso).toLocaleString('en-CA', { timeZone: TIME_ZONE, dateStyle: 'medium', timeStyle: 'short' });
}

// <input type="datetime-local"> sends a value like "2026-10-14T18:00" with no time zone.
// new Date() would read that in the server's own time zone (UTC on most hosting),
// so look up Toronto's UTC offset for that date and attach it: "2026-10-14T18:00:00-04:00".
export function torontoInputToIso(value) {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(:\d{2})?$/.test(value)) {
    // Leave anything else as it is and let the validator report it.
    return value;
  }
  const withSeconds = value.length === 16 ? `${value}:00` : value;
  const offset = new Intl.DateTimeFormat('en-US', { timeZone: TIME_ZONE, timeZoneName: 'longOffset' })
    .formatToParts(new Date(`${withSeconds}Z`))
    .find((part) => part.type === 'timeZoneName')
    .value.replace('GMT', '');
  return `${withSeconds}${offset}`;
}
