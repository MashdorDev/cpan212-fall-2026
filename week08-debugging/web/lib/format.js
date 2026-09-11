// Campus events happen in Toronto, so show Toronto time no matter where the code runs
// (the server may be in UTC and a visitor's laptop may be set to another zone).
const dateFormat = new Intl.DateTimeFormat('en-CA', {
  timeZone: 'America/Toronto',
  dateStyle: 'medium',
  timeStyle: 'short',
});

export function formatEventDate(iso) {
  return dateFormat.format(new Date(iso));
}
